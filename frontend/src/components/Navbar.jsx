//navbar for the website
import { Link } from "react-router-dom";
import { HiShoppingBag } from "react-icons/hi";
import { FaMagnifyingGlass } from "react-icons/fa6"
import '../css/navbar.css'

function Navbar() {
    return (
    <header className="header">
        <div className="header-inner">
            <div className="left">
                <Link to="/" className="logo">
                 <span className="logo-z">Z</span>
                 <span className="logo-s">S</span>
                 </Link>
                <nav className="nav">
                    <Link to="/shop" className="nav-link">Shop</Link>
                     <Link to="/about" className="nav-link">About</Link>
                     <Link to="/faq" className="nav-link">FAQ</Link>
                     <Link to="/contact" className="nav-link">Contact</Link>
                    </nav>
            </div>
            <div className="right">
                <button className="magnifying-glass">
                    <FaMagnifyingGlass className="icon" />
                </button>
                <button className="shopping-bag">
                    <HiShoppingBag className="icon1" />
                </button>
            </div>
        </div>
    </header>
    )
}

export default Navbar;