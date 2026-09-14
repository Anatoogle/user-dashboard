import { Router } from "express";
import { prisma } from "../db.js";
import bcrypt from "bcrypt";

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
            message: "Could not update user",
        });
    }
});

router.put("/me/password", async (req, res) => {
    if (!req.session.userId) {
        res.status(401).json({
            message: "Not authenticated",
        });
        return;
    }
    
    const { currentPassword, newPassword } = req.body;

    if (
        typeof currentPassword !== "string" ||
        typeof newPassword !== "string" ||
        currentPassword.trim() === "" ||
        newPassword.trim() === ""
    ) {
        res.status(400).json({
            message: "Current password and new password are required",
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

        const passwordMatches = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if(!passwordMatches) {
            res.status(400).json({
                message: "Current password is incorrect",
            });

            return;
        }

        if(newPassword.length < 4) {
            res.status(400).json({
                message: "New password must be at least 4 characters long",
            });

            return;
        }
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: hashedPassword,
            },
        });

        res.json({
            message: "Password updated successfully",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Could not update password",
        });
    }
});


router.put("/me/email", async (req, res) => {
    if(!req.session.userId) {
        res.status(401).json({
            message: "Not authenticated",
        });
        return;
    }

    const { email } = req.body;

    if(typeof email !== "string" || email.trim() === ""){
        res.status(400).json({
            message: "Email is required",
        });
        return;
    }

    try {
        const normalizedEmail = email.trim().toLowerCase();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(normalizedEmail)) {
            res.status(400).json({
                message: "Please enter a valid email address",
            });
            return;
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email: normalizedEmail,
            },
        });

        if (existingUser && existingUser.id === req.session.userId) {
            res.status(400).json({
                message: "This is already your current email",
            });
            return;
        }

        if (existingUser && existingUser.id !== req.session.userId) {
            res.status(400).json({
                message: "Email is already in use",
            });
            return;
        }

        const user = await prisma.user.update({
            where: {
                id: req.session.userId,
            },
            data: {
                email: normalizedEmail,
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

        res.status(599).json({
            message: "Could not update email",
        })
    }
})

export default router;