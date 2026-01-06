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
    <div>
        <h1>Admin Dashboard</h1>
        <p>{admin.email} ({admin.role})</p>
        <nav>
            <ul>
                <li><Link to="/admin/admins">Manage Admins</Link></li>
                <li><Link to="/admin/products">Manage Products</Link></li>
            </ul>
        </nav>
    </div>
    );
}

export default AdminDashboard;
