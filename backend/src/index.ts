import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./db.js";
import { Prisma } from "./generated/prisma/client.js";
import bcrypt from "bcrypt";
import session from "express-session";

// Check if the SESSION_SECRET environment variable is defined
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET is not defined");
}

// Create an instance of the Express application
const app = express();

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
app.use(
    session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
        },
    }),
);

const PORT = 3000;

app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if(!user) {
        res.status(401).json({
            message: "Invalid email or password",
        });

        return;
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if(!passwordMatches) {
        res.status(401).json({
            message: "Invalid email or password",
        });

        return;
    }

    req.session.userId = user.id;

    res.json({
        message: "Login successful",
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    });
});

// api/me = get the current logged in user
app.get("/api/me", async (req, res) => {
    if(!req.session.userId) {
        res.status(401).json({
            message: "Not authenticated",
        });
        return;
    }

    const user = await prisma.user.findUnique({
        where: {
            id: req.session.userId,
        },
    });

    if(!user) {
        res.status(401).json({
            message: "Not authenticated",
        });

        return;
    }

    res.json({
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    });
})

app.post("/api/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            res.status(500).json({
                message: "Could not log out",
            });

            return;
        }

        res.json({
            message: "Logout successful",
        });
    });
});

// Define a route to handle POST requests to the /api/users URL
app.post("/api/users", async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
            name,
            email,
            password: hashedPassword,
            },
        });

        res.status(201).json({
            message: "User created",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        if(
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            res.status(409).json({
                message: "Email already registered",
            });

            return;
        }
        
        console.error(error);

        res.status(500).json({
            message: "Could not create user",
        });
    }
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