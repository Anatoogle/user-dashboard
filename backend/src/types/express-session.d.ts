import "express-session";

// Extends the express-session type with our custom userId property.
declare module "express-session" {
    interface SessionData {
        userId: number;
    }
}