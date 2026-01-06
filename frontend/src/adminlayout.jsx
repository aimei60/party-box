import {Outlet, useNavigate} from "react-router-dom";
import Sidebar from "./components/sidebar";
import './css/adminlayout.css'

function AdminLayout() {
  const navigate = useNavigate();

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    navigate("/login");
  }

  return (
    <div className="layout">
      <Sidebar onLogout={handleLogout} />
      <main className="rest-of-page-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
