import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
};

function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/users")
    .then((response) => response.json())
    .then((data) => {
      setUsers(data);
    });
  }, []);

  return (
    <main>
      <h1>Dashboard</h1>

      {users.map((user) => (
        <div key={user.id}>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      ))}

      {/* <p>Welcome! You are now logged in.</p>

      <Link to="/login">Go to Login</Link> */}
    </main>
  );
}

export default Dashboard;