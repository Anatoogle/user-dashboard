// import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  id: number;
  name: string;
  email: string;
};

function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  async function handleSave() {
    if(!user) {
      return;
    }

    const response = await fetch("http://localhost:3000/api/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: user.name,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "Failed to update name");
      return;
    }

    setUser(data.user);
    setName(data.user.name);
    setMessage("Name updated successfully!");
  }

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
      setUser(data.user);
      setName(data.user.name);
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
      navigate("/login");
    });
  }, []);

  if (loading) {
  return (
    <main>
      <h1>Dashboard</h1>

      {user && (
        <div>
          <p>Name: {name}</p>
          <p>Email: {user.email}</p>

          <label>
            Change Name:
            <input
              type="text"
              value={user.name}
              onChange={(event) =>
                setUser({
                  ...user,
                  name: event.target.value,
                })
              }
            />
          </label>

          <button onClick={handleSave}>
            Save
          </button>
        </div>
      )}
      
      {message && <p>{message}</p>}
    </main>
  );
}

export default Dashboard;