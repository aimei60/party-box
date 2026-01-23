import {Link, useOutletContext} from "react-router-dom";
import '../css/dashboard.css'

function AdminDashboard() {
    const { admin } = useOutletContext()
    
    return (
        <>
        <div className="dashboard-page">
            <div className="dashboard-container">
                <h1 className="dashboard-title">Dashboard</h1>
                <p className="user-details">
                    <strong>User:</strong> {admin.email}{'  '}
                    <strong>Role:</strong> {admin.role}
                </p>
                <nav>
                    <Link className="dashboard-links" to="/admin/admins" >Manage Admins</Link>
                    <Link className="dashboard-links" to="/admin/products">Manage Products</Link>
                </nav>
            </div>
        </div>
        </>
    );
}

export default AdminDashboard;
