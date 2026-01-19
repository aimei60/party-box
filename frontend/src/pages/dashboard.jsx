import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import '../css/dashboard.css'

function AdminDashboard() {
    const [admin, setAdmin] = useState(null);
    const [csrfToken, setCsrfToken] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadAdminAndCSRF() {
            try {
                //who am i check
                const res = await fetch("/api/admin/auth/me", { 
                    credentials: "include", 
                });
                
                if (!res.ok) {
                    navigate("/login");
                    return;
                }

                const data = await res.json();
                setAdmin(data.admin);

                //CSRF token fetch
                const csrfRes = await fetch("/api/admin/csrf-token", {
                    credentials: "include",
                });

                if (!csrfRes.ok) {
                    throw new Error("Failed to fetch CSRF token");
                }

                const csrfData = await csrfRes.json();
                setCsrfToken(csrfData.csrfToken);
            } catch (error) {
                console.error(error);
                navigate("/login");
            }
        }
        loadAdminAndCSRF();
    }, [navigate]);


    if (!admin || !csrfToken) {
         return <p>Loading...</p>;
    }
    
    return (
        <div className="dashboard-page">
            <div className="dashboard-container">
                <h1 className="dashboard-title">Dashboard</h1>
                <p className="user-details">
                    <strong>User:</strong> {admin.email}{'  '}
                    <strong>Role:</strong> {admin.role}
                </p>
                <nav>
                    <Link className="dashboard-links" to="/admin/admins" state={{csrfToken}}>Manage Admins</Link>
                    <Link className="dashboard-links" to="/admin/products" state={{csrfToken}}>Manage Products</Link>
                </nav>
            </div>
        </div>
    );
}

export default AdminDashboard;
