import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Settings() {
  const { user, loading, setUser } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

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

  function showMessage(text: string, type: "success" | "error") {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  }

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
        showMessage(data.message, "error");
        return;
      }

      setUser(data.user);
      setName(data.user.name);
      setEmail(data.user.email);
      showMessage("Name updated successfully!", "success");
    } catch (error) {
      console.error(error);
      showMessage("Could not update name", "error");
    }
  }

  async function handleChangePassword(
    event: React.FormEvent<HTMLFormElement>
  ){
    event.preventDefault();
    
    if(newPassword.length < 4){
      showMessage("Password must be at least 4 characters long", "error");
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
        showMessage(data.message, "error");
        return;
      }

      showMessage("Password updated successfully!", "success");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.error(error);
      showMessage("Could not change password", "error");
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
        showMessage(data.message, "error");
        return;
      }

      setUser(data.user);
      setEmail(data.user.email);
      showMessage("Email updated successfully!", "success");
    } catch (error) {
      console.error(error);
      showMessage("Could not update email", "error");
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="settings">
        <div className="page-header">
            <h1>Settings</h1>
            <p>Manage your account settings.</p>
        </div>

        <section className="settings-card">
            <div className="settings-section">
                <h2>Profile</h2>

                <label>
                    Name
                <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
                </label>

                <button onClick={handleSave}>
                    Save Name
                </button>
            </div>

            <div className="settings-section">
                <h2>Email</h2>

                <label>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </label>

                <button onClick={handleEmailUpdate}>
                    Change Email
                </button>
            </div>

            <div className="settings-section">
                <h2>Password</h2>

                <form onSubmit={handleChangePassword}>
                <label>
                    Current Password
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(event) =>
                            setCurrentPassword(event.target.value)
                    }
                    required
                    />
                </label>

                <label>
                    New Password
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(event) =>
                            setNewPassword(event.target.value)
                        }
                        minLength={4}
                        required
                        placeholder="At least 4 characters"
                    />
                </label>

                <button type="submit" disabled={passwordLoading}>
                    {passwordLoading ? "Changing..." : "Change Password"}
                </button>
                </form>
            </div>

            {message && 
              <p className={`settings-message ${messageType}`}>
                {message}
              </p>}

        </section>
    </main>
  );
}

export default Settings;