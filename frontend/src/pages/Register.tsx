import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error" | "">("");

    const navigate = useNavigate();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const response = await fetch("http://localhost:3000/api/users", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            name,
            email,
            password,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            showMessage(data.message, "error");
            return;
        }

        navigate("/login");
    }

    function showMessage(text: string, type: "success" | "error") {
        setMessage(text);
        setMessageType(type);

        setTimeout(() => {
            setMessage("");
            setMessageType("");
        }, 4000);
    }


    return (
        <main className="auth-page">
            <div className="auth-card">
                <h1>Create account</h1>
                <p className="auth-subtitle">
                    Create your account to get started
                </p>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">
                        Name
                    </label>

                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Your name"
                        required
                    />

                    <label htmlFor="email">
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="your@email.com"
                        required
                    />

                    <label htmlFor="password">
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="At least 4 characters"
                        minLength={4}
                        required
                    />

                    <button type="submit">
                        Register
                    </button>

                    {message && (
                        <p className={`auth-message ${messageType}`}>
                            {message}
                        </p>
                    )}
                </form>

                <p className="auth-link">
                    Already have an account?{" "}
                    <Link to="/login">Login</Link>
                </p>
            </div>
        </main>
    );
}

export default Register;