import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./db.js";
import { Prisma } from "./generated/prisma/client.js";
import bcrypt from "bcrypt";

// Create an instance of the Express application
const app = express();

// to allow cross-origin requests, we need to use the cors() middleware
app.use(cors());

// to read JSON data from the request body, we need to use express.json() middleware
app.use(express.json());

const PORT = 3000;

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