import '../css/sidebar.css'
import { Link } from 'react-router-dom';

function Sidebar( onLogout) {

    return (
        <>
        <div className='sidebar-container'>
            <div className='sidebar-inner-container'>
                <div className='title-section'>
                    <div className='title1'>Zogy</div>
                    <div className='title2'>Studios</div>
                </div>
                <div className='sidebar-body'>
                    <Link to="/admin/admins">Manage Admins</Link>
                    <Link to="/admin/products">Manage Products</Link>
                </div>
                <button onClick={onLogout}>Logout</button>
            </div>
        </div>
        </>
    )
}

export default Sidebar;