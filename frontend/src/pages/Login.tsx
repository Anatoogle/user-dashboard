import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
    const { setUser } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                email,
                password,
            }),
        });

        const data = await response.json();

        if(response.ok) {
            setUser(data.user);
            navigate("/dashboard");
            return;
        }

        setMessage(data.message);
    }

    return (      
        <main className="auth-page">
            <div className="auth-card">
                <h1>Welcome back</h1>
                <p className="auth-subtitle">
                    Log in to your account
                </p>

                <form onSubmit={handleSubmit}>
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
                        placeholder="Your password"
                        required
                    />

                    <button type="submit">
                        Login
                    </button>

                    {message && <p className="auth-message">{message}</p>}
                </form>

                <p className="auth-link">
                    Don't have an account?{" "}
                    <Link to="/register">Register</Link>
                </p>
            </div>
        </main>
    );
}

export default Login;