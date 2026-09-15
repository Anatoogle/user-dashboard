import { NavLink  } from "react-router-dom";

function Sidebar() {
    return (
        <aside className="sidebar">
            <nav>
                <NavLink  to="/dashboard">Dashboard</NavLink >
                <NavLink  to="/settings">Settings</NavLink >
            </nav>
        </aside>
    )
}

export default Sidebar;