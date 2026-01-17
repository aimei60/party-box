import { useEffect, useState } from "react";
import Footer from "../components/footer";
import ProductCard from "../components/productcard";
import '../css/shop.css'

function Shop({searchText= ""}) {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadProducts() {
            try {
                setLoading(true)
                setError("")

                const response = await fetch("/api/products")
            
                if (!response.ok) {
                    throw new Error("Failed to fetch products")
            }
                const data = await response.json()
                setProducts(data)
            } catch (error) {
                setError("Could not load products")
            } finally {
                setLoading(false)
            }
        }
        loadProducts()
    }, [])

    const search = searchText.toLowerCase().trim()

    const filteredProducts = products.filter((product) => {
        if (search === "")
            return true

        const words = product.title.toLowerCase().split(" ");

        return words.some(word => word.startsWith(search));
    })

    return (
        <>
        <div className="shop-page">
            <div className="shop-container">
                <div className="shop-inner-container">
                    <div className="shop-title">Shop</div>
                    {loading && <p>Loading products...</p>}

                    {!loading && error && <p className="no-results">{error}</p>}

                    {!loading && !error && filteredProducts.length === 0 && (
                        <p className="no-results">No products found.</p>)}
                    
                    <div className="products-grid">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        <Footer/>
        </div>
        </>
    )
}

export default Shop;