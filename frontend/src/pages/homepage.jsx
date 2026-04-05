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
            etsy: "https://www.etsy.com/uk/listing/1584454652/personalized-sonic-party-favor-box?sr_prefetch=0&pf_from=shop_home&ref=shop_home_active_9&logging_key=9088c20abbadfad3694c0442dd57dac5f0d19f4b%3A1584454652",
            alt: "Sonic Party Box",
        },
        {
            title: "Unicorn Party Box",
            price: "£2.00",
            image: "/images/p1.png",
            etsy: "https://www.etsy.com/uk/listing/1584457460/personalized-unicorn-birthday-party?sr_prefetch=0&pf_from=shop_home&ref=shop_home_active_5&logging_key=639a519f68aadfb003b969e70a526e6273852cb5%3A1584457460",
            alt: "Unicorn Party Box",
        },
        {
            title: "Baby Shark Party Box",
            price: "£2.00",
            image: "/images/bs1.png",
            etsy: "https://www.etsy.com/uk/listing/1589291641/baby-shark-personalized-party-favor-box?sr_prefetch=0&pf_from=shop_home&ref=shop_home_active_4&logging_key=04239e180a8c155f3ee4ad901a7f401621eabdc2%3A1589291641",
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
                    <Link to="/shop" className="boxes-section" key={item.title}>
                    <div className="product-picture"><img src={item.image} alt={item.alt} /></div>
                    <div className="product-title">{item.title}</div>
                    <div className="product-price">{item.price}</div>
                    </Link>))}
                </div>
                <Link to="/shop" className="shop-all">Shop all products</Link>
            </div>
        </div>
        {/*review section*/}
        <div className="review-section">
            <div className="review-title">Verified Customer Reviews</div>
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
                <a className="more-reviews" href="https://www.etsy.com/shop/ZogyStudios?ref=shop_profile&listing_id=1584457460#reviews" target="_blank" rel="noopener noreferrer">More reviews on Etsy</a>
                <Link to="/shop" className="shop">Shop</Link>
            </div>
        </div>
        <Footer/>
        </>
    );
}

export default Homepage;