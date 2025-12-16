import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import '../css/shop.css'

function Shop() {
    return (
        <>
        <Navbar/>
        <div className="shop-container">
            <div className="shop-inner-container">
                <div className="category-container">
                    <div className="category-inner-container"></div>
                </div>
                <div className="products-box-section">
                    <div className="products-box-inner-section"></div>
                </div>

            </div>
        </div>
        <Footer/>
        </>
    )

}

export default Shop;