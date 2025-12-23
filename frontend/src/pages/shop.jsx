import Footer from "../components/footer";
import ProductCard from "../components/productcard";
import '../css/shop.css'

function Shop({searchText= ""}) {
    const mocks = [
        {
            id: 1,
            title: "Baby Shark Party Box",
            description: "A Baby Shark themed party box.",
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

    const search = searchText.toLowerCase().trim()

    const filteredProducts = mocks.filter((product) => {
        if (search === "")
            return true

        const words = product.title.toLowerCase().split(" ");

        return words.some(word => word.startsWith(search));
    })

    return (
        <>
        <div className="shop-container">
            <div className="shop-inner-container">
                <div className="shop-title">Shop</div>
                {filteredProducts.length === 0 && (<p className="no-results">No products found.</p>)}
                <div className="products-grid">{filteredProducts.map((product) => (<ProductCard key={product.id} product={product} />))}</div>
            </div>
        </div>
        <Footer/>
        </>
    )

}

export default Shop;