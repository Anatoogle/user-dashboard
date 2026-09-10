import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <main>
      <h1>Dashboard</h1>
      <p>Welcome! You are now logged in.</p>

      <Link to="/login">Go to Login</Link>
    </main>
  );
}

export default Dashboard;