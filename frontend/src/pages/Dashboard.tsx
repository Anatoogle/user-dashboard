import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {
  const { user, loading } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user.name}.</p>
      </div>

      <div className="stats">
        <div className="stat-card">
          <span>Role</span>
          <strong>User</strong>
        </div>

        <div className="stat-card">
          <span>Name</span>
          <strong>{user.name}</strong>
        </div>

        <div className="stat-card">
          <span>Email</span>
          <strong>{user.email}</strong>
        </div>
      </div>

      <section className="profile-card">
        <div className="avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>

        <div className="profile-info">
          <h2>{name}</h2>
          <p>{email}</p>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;