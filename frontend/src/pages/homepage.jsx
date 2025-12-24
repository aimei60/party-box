import Footer from "../components/footer";
import Banner from "../components/banner";
import '../css/homepage.css';
import { Link } from "react-router-dom";

function Homepage() {
    const bestSellers = [
        {
            title: "Sonic Party Box",
            price: "£2.00",
            image: "/images/Sonic-angled.png",
            etsy: "www.etsy.com/sonic",
            alt: "Sonic Party Box",
        },
        {
            title: "Peppa Pig Party Box",
            price: "£2.00",
            image: "/images/p1.png",
            etsy: "www.etsy.com/peppapig",
            alt: "Peppa Pig Party Box",
        },
        {
            title: "Minecraft Party Box",
            price: "£2.00",
            image: "/images/f3.png",
            etsy: "/www.etsy.com/minecraft",
            alt: "Minecraft Party Box",
        },
    ]
    return (
        <>
        <Banner/>
        {/*bestseller section*/}
        <div className="bestseller-header">
            <div className="bestseller-inner">
                <div className="bestseller-title">Shop Best Sellers</div>
                <div className="bestseller-favourite">Customer's favourite party boxes</div>
                <div className="boxes-grid">{bestSellers.map((item) => (
                    <div className="boxes-section" key={item.title}>
                    <div className="product-picture"><img src={item.image} alt={item.alt} /></div>
                    <div className="product-title">{item.title}</div>
                    <div className="product-price">{item.price}</div>
                    <a className="link-etsy" href={item.etsy} target="_blank" rel="noopener noreferrer">View on Etsy</a>
                    </div>))}
                </div>
                <Link to="/shop" className="shop-all">Shop all products</Link>
            </div>
        </div>
        {/*review section*/}
        <div className="review-section">
            <div className="review-title">What Our Customers Say</div>
            <div className="review-grid-container">
                <div className="reviews-grid">
                    <div className="review-stars">★★★★★</div>
                    <div className="review-text">The Boxes were really sturdy and beautiful 😍, my son was so excited when he saw them. It was the center piece of a awesome day.</div>
                    <div className="reviewer">Ana</div>
                </div>
                <div className="reviews-grid">
                    <div className="review-stars">★★★★★</div>
                    <div className="review-text">Amazing quality! Fab communication! We love them and are perfect for my daughter’s peppa pig party! Thank you so much.</div>
                    <div className="reviewer">Vicky</div>
                </div>
                <div className="reviews-grid">
                    <div className="review-stars">★★★★★</div>
                    <div className="review-text">I Noticed a mistake on my end after placing my order, I immediately messaged the seller and got a response within minutes. The boxes are absolutely amazing and I know my son will FREAK when he see’s them.</div>
                    <div className="reviewer">Ashley</div>
                </div>
            </div>
            <div className="bottom-section">
                <Link to="/shop" className="shop">Shop</Link>
                <a className="more-reviews" href="https://www.etsy.com/shop/ZogyStudios?ref=shop_profile&listing_id=1584457460#reviews" target="_blank" rel="noopener noreferrer">More reviews on Etsy</a>
            </div>
        </div>
        <Footer/>
        </>
    );
}

export default Homepage;