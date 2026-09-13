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
  const [loading, setLoading] = useState(true);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

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
      setMessage(data.message);
      return;
    }

    setUser(data.user);
    setName(data.user.name);
    setMessage("Name updated successfully!");
  }

  async function handleChangePassword(
    event: React.FormEvent<HTMLFormElement>
  ){
    event.preventDefault();
    
    if(newPassword.length < 4){
      setMessage("Password must be at least 4 characters long");
      return;
    }

    setPasswordLoading(true);

    try {

      
      const response = await fetch("http://localhost:3000/api/me/password", 
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        },
      );

      const data = await response.json();

      if(response.status === 401) {
        navigate("/login");
        return;
      }

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setMessage(data.message);
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.error(error);
      setMessage("Could not change password");
    } finally {
      setPasswordLoading(false);
    }
    
  };

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
    return <p>Loading...</p>;
  }

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
      
      <h2>Change Password</h2>
      <form onSubmit= {handleChangePassword}>
        <label>
          Current Password: 
          <input
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            required
          />
        </label>

        <label>
          New Password:
          <input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            minLength={4}
            required
            placeholder="At least 4 characters"
          />
        </label>

        <button type="submit" disabled={passwordLoading}>
          {passwordLoading ? "Changing..." : "Change Password"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </main>
  );
}

export default Dashboard;