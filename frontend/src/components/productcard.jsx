import "../css/productcard.css"

//product card function to return the party box image and its title, price and view more details
function ProductCard({product}) {
    const priceInGBP = (product.price / 100).toFixed(2);

    let shortDescription = product.description;
    if (shortDescription.length > 80) {
        shortDescription = shortDescription.slice(0,80) + "...";
    }

    let imageContent;

    if (product.main_image !== null) {
        imageContent = (<img src={product.main_image} alt={product.title} />);
    } else {
        imageContent = (<div className="product-card-placeholder">No image available</div>)}

    return (
    <div className="product-card">
        <div className="product-image">{imageContent}</div>
        <div className="product-card-body">
            <h3 className="product-card-title">{product.title}</h3>
            <p className="product-description">{shortDescription}</p>
            
            <div className="product-card-footer">
                <span className="product-card-price">£{priceInGBP}</span>
                <button className="product-button">View</button>
            </div>
        </div>
    </div>
  );
}

export default ProductCard;