import {Outlet, useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./components/sidebar";
import './css/adminlayout.css'

function AdminLayout() {
  const [admin, setAdmin] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadAdminAndCSRF() {
      try {
        const res = await fetch("/api/admin/auth/me", 
          { credentials: "include" });
        if (!res.ok) {
          return navigate("/login");
        }

        const data = await res.json();
        setAdmin(data.admin);

        const csrfRes = await fetch("/api/admin/csrf-token", 
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
    await fetch("/api/admin/auth/logout", {
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
