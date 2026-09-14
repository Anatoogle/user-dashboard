import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {
  const { user, loading, setUser } = useContext(AuthContext);

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setUserName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  async function handleSave() {
    if(!user) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setUser(data.user);
      setName(data.user.name);
      setEmail(data.user.email);
      setMessage("Name updated successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Could not update name");
    }
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

  async function handleEmailUpdate() {
    try {
      const response = await fetch("http://localhost:3000/api/me/email", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
        }),
      });

      const data= await response.json();

      if(!response.ok) {
        setMessage(data.message);
        return;
      }

      setUser(data.user);
      setEmail(data.user.email);
      setMessage("Email updated successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Could not update email");
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <main>
      <h1>Dashboard</h1>


      <div>
        <p>Name: {userName}</p>
        <p>Email: {user.email}</p>

        <h3>Change Name</h3>
        <label>
          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
          />
        </label>

        <button onClick={handleSave}>
          Save
        </button>
      </div>

      
      <h3>Change Password</h3>
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

      <h3>Change Email</h3>
      <input
        type="text"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <button onClick={handleEmailUpdate}>
        Change Email
      </button>
      {message && <p>{message}</p>}
    </main>
  );
}

export default Dashboard;