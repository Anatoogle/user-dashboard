import express from "express";
import cors from "cors";

// Create an instance of the Express application
const app = express();

// to allow cross-origin requests, we need to use the cors() middleware
app.use(cors());

// to read JSON data from the request body, we need to use express.json() middleware
app.use(express.json());

const PORT = 3000;

// Define a route to handle POST requests to the /api/users URL
app.post("/api/users", (req, res) => {
    const { name, email } = req.body;

    console.log("New user:", name, email);

    res.status(201).json({
        message: "User created",
        user: {
            name,
            email,
        },
    });
});

// Define a route to handle GET requests to the root URL
app.get("/", (req, res) => {
    res.json({
        message: "Backend is running!",
    });
});

// Define a route to handle GET requests to the /api/users URL
app.get("/api/users", (req, res) => {
  res.json([
    {
      id: 1,
      name: "Max",
      email: "max@example.com",
    },
  ]);
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
