import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Header() {
    const { user, setUser } = useContext(AuthContext);

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
            {user && (
                <nav>
                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </nav>
            )}
        </header>
    );
}

export default Header;