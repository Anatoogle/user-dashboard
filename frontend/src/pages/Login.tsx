import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
  }

  return (      
    <main>
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email">Email </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="your@email.com"
                />
            </div>

            <div>
                <label htmlFor="password">Password </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Your password"
                />
            </div>

            <button type="submit">Login</button>

        </form>
        <Link to="/dashboard">Go to Dashboard</Link>
    </main>
  );
}

export default Login;