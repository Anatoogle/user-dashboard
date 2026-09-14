import { createContext, useEffect, useState } from "react";

type User = {
    id: number;
    name: string;
    email: string;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    setUser: (user: User | null) => void;
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    setUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode}) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:3000/api/me", {
        credentials: "include",
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Not authenticated");
            }

            return response.json();
        })
        .then((data) => {
            setUser(data.user);
        })
        .catch(() => {
            setUser(null);
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, setUser}}>
            {children}
        </AuthContext.Provider>
    );
}