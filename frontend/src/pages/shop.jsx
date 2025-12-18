import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import ProductCard from "../components/productcard";
import '../css/shop.css'
import bbyshrk from '../assets/baby-shark/bs3.png'
import peppa from '../assets/peppa-pig/p1.png'
import bluey from '../assets/bluey/bluey1.png'

function Shop() {
    const mocks = [
        {
            id: 1,
            title: "Baby Shark Party Box",
            description: "A Baby Ahark themed party box.",
            price: 200,
            currency: "GBP",
            main_image: bbyshrk,
        },
        {
            id: 2,
            title: "Peppa Pig Party Box",
            description: "Peppa Pig party fun themed box.",
            price: 200,
            currency: "GBP",
            main_image: peppa,
        },
        {
            id: 3,
            title: "Bluey Party Box",
            description: "A Bluey party fun themed box.",
            price: 200,
            currency: "GBP",
            main_image: bluey,
        },
    ];

    return (
        <>
        <Navbar/>
        <div className="shop-container">
            <div className="shop-inner-container">
                <h1 className="shop-title">Shop</h1>
                <div className="products-grid">{mocks.map((product) => (<ProductCard key={product.id} product={product} />))}</div>
            </div>
        </div>
        <Footer/>
        </>
    )

}

export default Shop;