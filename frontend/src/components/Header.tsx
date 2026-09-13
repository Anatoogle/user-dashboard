import { useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();

    async function handleLogout() {
        await fetch("http://localhost:3000/api/logout", {
            method: "POST",
            credentials: "include",
        });

        navigate("/login");
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