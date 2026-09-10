import { useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import Header from "./components/Header";

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

        <Link to="/dashboard">Go to Dashboard</Link>
      </form>
    </main>
  );
}

function Dashboard() {
  return (
    <main>
      <h1>Dashboard</h1>
      <p>Welcome! You are now logged in.</p>

      <Link to="/login">Go to Login</Link>
    </main>
  );
}

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  )
}
export default App;