import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import session from "express-session";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";

// Load environment variables from the .env file
dotenv.config({ path: "../.env" });

// Check if the SESSION_SECRET environment variable is defined
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error("SESSION_SECRET is not defined");
}

// Create an instance of the Express application
const app = express();

const PORT = 3000;

// to allow cross-origin requests, we need to use the cors() middleware
// allow credentials to be sent with the request, so that the session cookie can be set
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    }),
);

// to read JSON data from the request body, we need to use express.json() middleware
app.use(express.json());


// to use sessions, we need to use the express-session middleware
// secure: false means that the cookie can be sent over HTTP, not just HTTPS.
// sameSite: "lax" means that the cookie can be sent with cross-site requests, but only for top-level navigations (like clicking a link), not for subresource requests (like loading an image or making an AJAX request).
app.use(
    session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        },
    }),
);

// Use the authRouter for all routes starting with /api
app.use("/api", authRouter);
app.use("/api", usersRouter);

// Define a route to handle GET requests to the root URL
app.get("/", (req, res) => {
    res.json({
        message: "Backend is running!",
    });
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
