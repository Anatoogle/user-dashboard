import { useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();

    async function handleLogout() {
        const response = await fetch("http://localhost:3000/api/logout", {
            method: "POST",
            credentials: "include",
        });

        if (response.ok) {
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