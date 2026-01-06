import '../css/sidebar.css'
import { Link } from 'react-router-dom';
import { MdDashboard } from "react-icons/md";
import { RiShoppingBasket2Fill } from "react-icons/ri";
import { IoPeopleSharp } from "react-icons/io5";

function Sidebar({onLogout}) {

    return (
        <div className='sidebar-container'>
            <div className='sidebar-inner-container'>
                <div className='title-section'>
                    <div className='title1'>Zogy</div>
                    <div className='title2'>Studios</div>
                </div>
                <nav className="sidebar-nav">
                    <Link className="nav-side-link" to="/dashboard"><MdDashboard className="nav-icon" /><span>Dashboard</span></Link>
                    <Link className="nav-side-link" to="/admin/products"><RiShoppingBasket2Fill className="nav-icon" /><span>Products</span></Link>
                    <Link className="nav-side-link" to="/admin/admins"><IoPeopleSharp className="nav-icon" /><span>Admins</span></Link>
                </nav>
                <button className="logout-button" onClick={onLogout}>Logout</button>
            </div>
        </div>
    )
}

export default Sidebar;