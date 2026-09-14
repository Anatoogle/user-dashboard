import { Router } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../db.js";
import { Prisma } from "../generated/prisma/client.js";

// A router is a way to define a set of routes for a specific part of your application. 
// It allows to group related routes together and apply middleware to them. 
// In Express, you can create a router using the `Router` class, which provides methods for defining routes (like `get`, `post`, `put`, etc.) and handling requests.
const router = Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if(
        typeof email !== "string" ||
        typeof password !== "string" ||
        email.trim() === "" ||
        password.trim() === ""
    ) {
        res.status(400).json({
            message: "Email and password are required",
        });
        
        return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: normalizedEmail,
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
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Could not log in",
        });
    }
});

router.post("/logout", (req, res) => {
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

router.post("/users", async (req, res) => {
    const { name, email, password } = req.body;

    if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string" ||
        name.trim() === "" ||
        email.trim() === "" ||
        password.trim() === ""
    ) {
        res.status(400).json({
            message: "Name, email and password are required",
        });
        return;
    }

    // 4 only for testing purposes, in production it should be at least 8 characters long
    if (password.length < 4) {
        res.status(400).json({
            message: "Password must be at least 4 characters long",
        });
        return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(normalizedEmail)) {
        res.status(400).json({
            message: "Please enter a valid email address",
        });
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
            name: name.trim(),
            email: normalizedEmail,
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

export default router;
