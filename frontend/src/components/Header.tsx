import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Header() {
    const { setUser } = useContext(AuthContext);

    const navigate = useNavigate();

    async function handleLogout() {
        const response = await fetch("http://localhost:3000/api/logout", {
            method: "POST",
            credentials: "include",
        });

        if (response.ok) {
            setUser(null);
            navigate("/login");
            return;
        }
    }

    return (
        <header>
            <h2>My User App</h2>
            <button onClick={handleLogout}>
                Logout
            </button>
        </header>
    );
}

export default Header;