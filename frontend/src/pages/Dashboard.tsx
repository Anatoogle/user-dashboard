// import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  id: number;
  name: string;
  email: string;
};

function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  // useEffect hook to fetch user data when the component mounts
  // useeffect is a hook that runs after the component renders. It can be used to fetch data, set up subscriptions, and manually change the DOM in React components.
  useEffect(() => {
    fetch("http://localhost:3000/api/me",{
      credentials: "include",
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Not authenticated");
      }
      return response.json();
    })
    .then((data) => {
      setUsers([data.user]);
    })
    .catch(() => {
      navigate("/login");
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