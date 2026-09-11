import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");

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

        setMessage(data.message);
    }

    return (
        <main>
            <h1>Register</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Name 
                        <input
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        />
                    </label>
                </div>

                <div>

                    <label htmlFor="email">Email </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="password">Password  </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>

                <button type="submit">Register </button>
            </form>

            {message && <p>{message}</p>}
            
            <Link to="/login">Already have an account? Login</Link>
        </main>
    )
}

export default Register;