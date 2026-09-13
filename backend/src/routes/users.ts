import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

// api/me = get the current logged in user
router.get("/me", async (req, res) => {
    if(!req.session.userId) {
        res.status(401).json({
            message: "Not authenticated",
        });
        return;
    }

    try {
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
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error",
        });
    }
})

// Define a route to handle PUT requests to the /api/me URL
// Update the current logged in user
router.put("/me", async (req, res) => {
    if(!req.session.userId) {
        res.status(401).json({
            message: "Not authenticated",
        });
        return;
    }

    const { name } = req.body; 

    if(typeof name !== "string" || name.trim() === ""){
        res.status(400).json({
            message: "Name is required",
        });

        return;
    }

    try {
        // we take the user id from the session and update the user with the new name
        // dont take the user id from the request body, because that would allow a user to update another user's name
        const user = await prisma.user.update({
            where: {
                id: req.session.userId,
            },
            data: {
                name,
            },
        });

        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error. Could not update user",
        });
    }
});

export default router;