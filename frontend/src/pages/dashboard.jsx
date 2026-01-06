import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import '../css/dashboard.css'

function AdminDashboard() {
    const [admin, setAdmin] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadAdmin() {
            try {
                const res = await fetch("/api/admin/auth/me", { 
                    credentials: "include", 
                });
                
                if (!res.ok) {
                    navigate("/login");
                    return;
                }

                const data = await res.json();
                setAdmin(data.admin);
            } catch (error) {
                navigate("/login");
            }
        }
        loadAdmin();
    }, [navigate]);


    if (!admin) {
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
                    <Link className="dashboard-links" to="/admin/admins">Manage Admins</Link>
                    <Link className="dashboard-links" to="/admin/products">Manage Products</Link>
                </nav>
            </div>
        </div>
    );
}

export default AdminDashboard;
