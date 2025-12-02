import { Link } from "react-router-dom";
import '../css/footer.css'
import { IoBalloon } from "react-icons/io5";
import { GiPartyPopper } from "react-icons/gi";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
            <h2 className="footer-logo">
                <span className="zogy">Zogy</span> Studios 
                <IoBalloon className="footer-icon" />
            </h2>
        </div>
        <div className="footer-links">
            <div className="footer-column">
                <h3 className="footer-title">SHOP</h3>
                <Link to="/shop">All Boxes</Link>
          </div>
          <div className="footer-column">
            <h3 className="footer-title">HELP</h3>
            <Link to="/faq">FAQ</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
          <div className="footer-column">
            <h3 className="footer-title">ABOUT</h3>
            <Link to="/about">Our Story</Link>
          </div>
        </div>
        <div className="footer-etsy">
          <p>Join the party on Etsy 
            <GiPartyPopper className="party"/></p>
        </div>
      </div>
      <div className="footer-bottom">© 2025 Zogy Studios</div>
    </footer>
  );
}

export default Footer;