import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/footer";
import "../css/product.css";

function ProductPage() {
    const {id} = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadProduct() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(`/api/products/${id}`);

            if (!response.ok) {
                throw new Error("Product not found");
            }

            const data = await response.json();
            setProduct(data);
        }   catch (err) {
            setError(err.message || "Could not load product");
        }   finally {
            setLoading(false);
        }
    }
    loadProduct();
    }, [id]); // to go to another product ID

    if (loading) return <p>Loading product...</p>;
    if (error) return <p>{error}</p>;
    if (!product) return <p>Product not found.</p>;

    const description = product.description || {};
    const sections = description.sections || [];

    return (
    <>
        <div className="product-page">
        <div className="product-layout">
            {/* left side for pics */}
            <div className="product-images-grid">
            {product.images && product.images.length > 0 && product.images.map((img) => (<img key={img.id} className="product-image" src={img.url} alt={product.title}/>))}
            </div>

            {/* right side for wording */}
            <div className="product-info">
            <h1>{product.title}</h1>
            <p className="price">£{(product.price / 100).toFixed(2)} {product.currency}</p>
            {description.title && <h2>{description.title}</h2>}
            {description.paragraph && <p>{description.paragraph}</p>}
            {sections.map((section, index) => (
                <div key={index} className="description-section">
                {section.heading && <h3>{section.heading}</h3>}
                {section.body && <p>{section.body}</p>}
                </div>))}
            {product.etsy_url && (<a href={product.etsy_url} target="_blank" rel="noreferrer"><button>Buy on Etsy</button></a>)}
            </div>
        </div>
        </div>
        <Footer />
    </>
    );

}

export default ProductPage