import {Outlet, useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./components/sidebar";
import './css/adminlayout.css'

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

function AdminLayout() {
  const [admin, setAdmin] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadAdminAndCSRF() {
      try {
        const res = await fetch(`${API_BASE}/api/admin/auth/me`, 
          { credentials: "include" });
        if (!res.ok) {
          return navigate("/login");
        }

        const data = await res.json();
        setAdmin(data.admin);

        const csrfRes = await fetch(`${API_BASE}/api/admin/csrf-token`, 
          { credentials: "include" });
        if (!csrfRes.ok) {
          return navigate("/login");
        }

        const csrfData = await csrfRes.json();
        setCsrfToken(csrfData.csrfToken);
      } catch (err) {
        navigate("/login");
      }
    }

    loadAdminAndCSRF();
  }, [navigate]);

  async function handleLogout() {
    await fetch(`${API_BASE}/api/admin/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    navigate("/login");
  }

  if (!admin || !csrfToken) {
    return <p>Loading...</p>;
  }

  return (
    <div className="layout">
      <Sidebar onLogout={handleLogout} />
      <main className="rest-of-page-content">
        <Outlet context={{ admin, csrfToken }}/>
      </main>
    </div>
  );
}

export default AdminLayout;
