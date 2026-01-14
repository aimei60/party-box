import { useEffect, useState} from 'react'
import '../css/adminproduct.css'

function AdminProduct() {

    const [form, setForm] = useState({title: "", short_description: "", price: "", currency: "", active: "", etsy_url: ""})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [image, setImage] = useState({ url: "", alt_text: "", sort_order: "", is_primary: false })
    
    //create product
    async function createProduct(e) {
        e.preventDefault()
        setLoading(true);
        setError("")
        setSuccess("")

        try {
            // false or true value for products
            let activeValue = true
            if (form.active === "false" || form.active === false) {
                activeValue = false
            }

            const response = await fetch("/api/admin/products", {
                method: "POST",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({title: form.title, short_description: form.short_description, price: Number(form.price), currency: form.currency, active: activeValue, etsy_url: form.etsy_url})
            })

            const data = await response.json();

            if (response.ok === false) {
                setError(data.error || "Failed to create product");
                setLoading(false);
                return;
            }

            const productId = data.id
            //image details such as url and sort order for product images
            if (image.url.trim() !== "") {
                let sortOrderValue = undefined
                if (image.sort_order !== "") {
                    sortOrderValue = Number(image.sort_order)
                }

                const imageRes = await fetch(`/api/admin/products/${productId}/images`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({url: image.url, alt_text: image.alt_text, sort_order: sortOrderValue, is_primary: image.is_primary})
                })

                const imageData = await imageRes.json()

                if (imageRes.ok === false) {
                    setError(imageData.error)
                    setLoading(false)
                    return
                }
            }

            setSuccess("Successfully created Product!")
            setLoading(false)
            setForm({title: "", short_description: "", price: "", currency: "", active: "", etsy_url:""});
            setImage({url: "", alt_text: "", sort_order: "", is_primary: false})
            ListProduct()
        } catch (err) {
            setError("Unable to create product!")
            setLoading(false);
        }
    }

    // to enter product details
    function handleChange(event) {
        const field = event.target.name;
        const value = event.target.value;

        if (field === "title") {
            setForm({
            ...form,
            title: value
            });
        }

        if (field === "short_description") {
            setForm({
            ...form,
            short_description: value
            });
        }

        if (field === "price") {
            setForm({
            ...form,
            price: value
            });
        }

        if (field === "currency") {
            setForm({
            ...form,
            currency: value
            });
        }

        if (field === "active") {
            setForm({
            ...form,
            active: value
            });
        }

        if (field === "etsy_url") {
            setForm({
            ...form,
            etsy_url: value
            });
        }

        if (field === "url") {
            setImage({
            ...image,
            url: value
            });
        }

        if (field === "alt_text") {
            setImage({
            ...image,
            alt_text: value
            });
        }

        if (field === "sort_order") {
            setImage({
            ...image,
            sort_order: value
            });
        }

        if (field === "is_primary") {
            setImage({
            ...image,
            is_primary: event.target.checked
            });
        }
    }

    function ListProduct() {

    }

    return (
        <div className='admin-product-section'>
            <div className='admin-product-title'>Product Management</div>
            <div className='product-management-container'>
                {/* CREATE product UI*/}
                <div className="product-card">
                    <h2 className="product-subtitle">Create Product</h2>
                    <form onSubmit={createProduct} className="product-form">
                        {/* form to create product UI*/}
                        <label className="product-label">Title<input className="product-input" type="text" name="title" value={form.title} onChange={handleChange} required/></label>
                        <label className="product-label">Short Description<input className="product-input" type="text" name="short_description" value={form.short_description} onChange={handleChange} required /></label>
                        <label className="product-label">Price<input className="product-input" type="number" name="price" value={form.price} onChange={handleChange} required/></label>
                        <label className="product-label">Currency<input className="product-input" type="text" name="currency" value={form.currency} onChange={handleChange} required/></label>
                        <label className="product-label">Active Status
                            <select className="product-input" name="active" value={form.active} onChange={handleChange} required>
                                <option value="">Select...</option>
                                <option value="true">true</option>
                                <option value="false">false</option>
                            </select></label>
                        <label className="product-label">Etsy URL<input className="product-input" type="text" name="etsy_url" value={form.etsy_url} onChange={handleChange}/></label>
                        <h3 className="product-subtitle">Add Product Image</h3>
                        <label className="product-label">Image URL<input className="product-input" type="text" name="url" value={image.url} onChange={handleChange}placeholder="https://example"/></label>
                        <label className="product-label">Alt Text<input className="product-input" type="text" name="alt_text" value={image.alt_text} onChange={handleChange} placeholder="Front view"/></label>
                        <label className="product-label">Sort Order<input className="product-input" type="number" name="sort_order" value={image.sort_order} onChange={handleChange} placeholder="0" /></label>
                        <label className="product-label">Primary Image<input type="checkbox" name="is_primary" checked={image.is_primary} onChange={handleChange}/></label>
                        {/* creating, loading and success status and error statuses*/}
                        <button className="product-button" type="submit" disabled={loading}>
                            {loading && "Creating..."}
                            {!loading && "Create Product"}
                        </button>
                    </form>
                    {success !== "" && <p className="success">{success}</p>}
                    {error !== "" && <p className="error">{error}</p>}
                </div>
            </div>
        </div>
    )
}

export default AdminProduct;