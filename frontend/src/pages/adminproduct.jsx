import { useEffect, useState} from 'react'
import '../css/adminproduct.css'

function AdminProduct() {

    //create product
    const [form, setForm] = useState({title: "", short_description: "", price: "", currency: "", active: "", etsy_url: ""})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [images, setImages] = useState([{ url: "", alt_text: "", sort_order: "", is_primary: false }])

    //for multiple images: image helper functions
    function addImage() {
        setImages([
            ...images,
            { url: "", alt_text: "", sort_order: "", is_primary: false }
        ])
    }

    function removeImage(index) {
        const copy = [...images]
        copy.splice(index, 1)
        setImages(copy)
    }
    //handles image edits
    function handleImageChange(index, e) {
        const imagesCopy = [...images]

        imagesCopy[index][e.target.name] =
            e.target.type === "checkbox"
            ? e.target.checked
            : e.target.value

        setImages(imagesCopy)
    }

    async function createProduct(e) {
        e.preventDefault()
        setLoading(true);
        setError("")
        setSuccess("")

        try {
            // more clearer false or true value 
            let activeValue = true
            if (form.active === "Not Active") {
                activeValue = false
            }
            
            //fetch create router
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
            //add all images
            for (let i = 0; i < images.length; i++) {
                const img = images[i]

                if (img.url.trim() === "") {
                    continue
                }

                let sortOrderValue = undefined
                if (img.sort_order !== "") {
                    sortOrderValue = Number(img.sort_order)
                }
                //fetch created product id
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
            setImages([{url: "", alt_text: "", sort_order: "", is_primary: false}])
            ListProduct()
        } catch (err) {
            setError("Unable to create product!")
            setLoading(false);
        }
    }

    // to enter product details in UI
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

    //list products
    const [products, setProducts] = useState([])

    async function ListProduct() {
        setLoading(true);
        setError("");
        setSuccess("");

        // fetch read router
        try {
            const response = await fetch("/api/admin/products", {
                method: "GET",
                credentials: "include",
            })

            const data = await response.json();

                if (response.ok === false) {
                    setError(data.error || "Failed to load products")
                    setLoading(false)
                    return
                }
                setProducts(data);
                setLoading(false);
        }   catch (err) {
                setError("Error loading Products list");
                setLoading(false)
        } 
    }

    useEffect(function () {
        ListProduct();
    }, [])

    //edit product
    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState({title: "", short_description: "", price: "", currency: "", active: "", etsy_url: "", url: "", alt_text: "", sort_order: "", is_primary: false, imageId: null});

    //to edit the fields
    function Edit(product) {
        setEditId(product.id)
        // retrieve the primary image. if not marked pick the first image
        let primary = null
        if (product.product_images && product.product_images.length > 0) {
            primary = product.product_images[0]
            for (let i = 0; i < product.product_images.length; i++) {
                if (product.product_images[i].is_primary === true) {
                    primary = product.product_images[i]
                }
            }
        }
        setEditForm({
            title: product.title,
            short_description: product.short_description || "",
            price: product.price,
            currency: product.currency,
            active: product.active === true ? "true" : "false",
            etsy_url: product.etsy_url || "",
            url: primary ? primary.url : "",
            alt_text: primary ? primary.alt_text : "", //set primary alt text or use empty string
            sort_order: primary ? primary.sort_order : "",
            is_primary: primary ? primary.is_primary : false,
            imageId: primary ? primary.id : null
        })
        setError("")
        setSuccess("")
    }

    //cancel editing
    function cancelEdit() {
        setEditId(null);
        setEditForm({title: "", short_description: "", price: "", currency: "", active: "", etsy_url: "", url: "", alt_text: "", sort_order: "", is_primary: false, imageId: null});
    }

    //enter product details
    function handleEditChange(e) {
        const field = e.target.name;
        const value = e.target.value;

        if (field === "title") {
            setEditForm({ ...editForm, title: value });
        }

        if (field === "short_description") {
            setEditForm({ ...editForm, short_description: value });
        }

        if (field === "price") {
            setEditForm({ ...editForm, price: value });
        }

        if (field === "currency") {
            setEditForm({ ...editForm, currency: value });
        }

        if (field === "active") {
            setEditForm({ ...editForm, active: value });
        }

        if (field === "etsy_url") {
            setEditForm({ ...editForm, etsy_url: value });
        }

        if (field === "url") {
            setEditForm({ ...editForm, url: value });
        }

        if (field === "alt_text") {
            setEditForm({ ...editForm, alt_text: value });
        }

        if (field === "sort_order") {
            setEditForm({ ...editForm, sort_order: value });
        }

        if (field === "is_primary") {
            setEditForm({ ...editForm, is_primary: e.target.checked });
        }
    }

    async function updateProduct(e) {
        e.preventDefault()
        
        if (editId === null) {
            setError("No product selected to update");
            return
        }
        setLoading(true)
        setError("")
        setSuccess("")

        try {//converts form input to boolean because js sees false below from the UI as true
            let activeValue = true
            
            if (editForm.active === "Not Active") {
                activeValue = false
            }

            //update product by fetching product id
            const response = await fetch("/api/admin/products/" + editId, {
                method: "PUT",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({title: editForm.title, short_description: editForm.short_description, price: Number(editForm.price), currency: editForm.currency, active: activeValue, etsy_url: editForm.etsy_url})
            })

            const data = await response.json();

            if (response.ok === false) {
                setError(data.error || "Failed to update product");
                setLoading(false);
                return;
            }

            if (editForm.imageId !== null) {
                let sortOrderValue = undefined
                if (editForm.sort_order !== "") {
                    sortOrderValue = Number(editForm.sort_order)
                }
                //get image id to edit
                const imageRes = await fetch("/api/admin/products/" + editId + "/images/" + editForm.imageId, {
                    method: "PUT",
                    credentials: "include",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({url: editForm.url, alt_text: editForm.alt_text, sort_order: sortOrderValue, is_primary: editForm.is_primary})
                })

                const imageData = await imageRes.json()

                if (imageRes.ok === false) {
                    setError(imageData.error || "Product updated, but failed to update image")
                    setLoading(false)
                    return
                }
            }

            setSuccess("Successfully updated product!")
            setLoading(false)
            cancelEdit()
            ListProduct()
            } catch (err) {
            setError("Unable to update product!")
            setLoading(false);
            }
        }

        //delete product
        async function deleteProduct(product) {
            const confirmed = window.confirm("Delete " + product.title + " ?");
            if (confirmed === false) {
                return;
            }
            setLoading(true);
            setError("");
            setSuccess("");

            //get product id
            try {
            const response = await fetch("/api/admin/products/" + product.id, {
                method: "DELETE",
                credentials: "include"
            });

            const data = await response.json();

            if (response.ok === false) {
                setError(data.error || "Failed to delete product");
                setLoading(false);
                return;
            }
            setSuccess("Successfully deleted product!");
            setLoading(false);

            if (editId === product.id) {
                cancelEdit();
            }
            ListProduct();
            } catch (err) {
            setError("Unable to delete product!");
            setLoading(false);
            }
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
                                <option value="">Select</option>
                                <option value="true">Active</option>
                                <option value="false">Not Active</option>
                            </select></label>
                        <label className="product-label">Etsy URL<input className="product-input" type="text" name="etsy_url" value={form.etsy_url} onChange={handleChange}/></label>
                        <h3 className="product-subtitle">Add Product Image</h3>
                        {images.map(function (img, index) {
                        return (
                            <div key={index} className="image-block">
                            <label className="product-label">Image URL<input className="product-input" type="text" name="url" value={img.url} onChange={function (e) { handleImageChange(index, e) }}placeholder="https://example.com"/></label>
                            <label className="product-label">Alt Text<input className="product-input" type="text" name="alt_text" value={img.alt_text} onChange={function (e) { handleImageChange(index, e) }} placeholder="Front view"/></label>
                            <label className="product-label">Sort Order<input className="product-input" type="number" name="sort_order" value={img.sort_order} onChange={function (e) { handleImageChange(index, e) }} placeholder="0"/></label>
                            <label className="product-label">Primary Image <small>(main product image)</small><input className="checkbox" type="checkbox" name="is_primary" checked={img.is_primary} onChange={function (e) { handleImageChange(index, e) }}/></label>
                            {images.length > 1 && (<button type="button" className="product-button" onClick={function () { removeImage(index) }}>Remove Image</button>)}</div>)})}
                            <button type="button" className="product-button"onClick={addImage}>+ Add Another Image</button>
                            {/* creating, loading and success status and error statuses*/}
                            <button className="product-button" type="submit" disabled={loading}>
                                {loading && "Creating..."}
                                {!loading && "Create Product"}
                            </button>
                        </form>
                        {success !== "" && <p className="success">{success}</p>}
                        {error !== "" && <p className="error">{error}</p>}
                </div>

                {/*LIST products */}
                {/* loading and error status or errors*/}
                {loading && <p>Loading…</p>}
                {error && <p className="error">{error}</p>}
                {/* table to enter data and actions for that data*/}
                {loading === false && error === "" && (
                    <table className="product-table">
                        <thead className='table-bar'>
                            <tr>
                                <th className='table-title'>ID</th>
                                <th className='table-title'>Title</th>
                                <th className='table-title'>Price</th>
                                <th className='table-title'>Active</th>
                                <th className='table-title'>Images</th>
                                <th className='table-title'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(function (p) {
                            //picks primary image if it exists, otherwise picks first image
                            let primary = null
                            if (p.product_images && p.product_images.length > 0) {
                                primary = p.product_images[0]
                                for (let i = 0; i < p.product_images.length; i++) {
                                    if (p.product_images[i].is_primary === true) {
                                        primary = p.product_images[i]
                                    }
                                }
                            }
                            return (
                                <tr className='product-detail' key={p.id}>
                                    <td className='product-detail'>{p.id}</td>
                                    <td className='product-detail'>{p.title}</td>
                                    <td className='product-detail'>{Number(p.price/100).toFixed(2)} {p.currency}</td>
                                    <td className='product-detail'>{p.active ? "true" : "false"}</td>
                                    <td className='images-cell'>
                                        {/* primary image */}
                                        {primary && (
                                        <div className="primary-image">
                                            <div className="primary-label"><strong>Primary image</strong></div>
                                            <img className="product-image" src={primary.url} alt={primary.alt_text || "primary image"}/>
                                            </div>)}
                                        {/* list of images*/}
                                        {p.product_images && p.product_images.length > 0 && (
                                            <ul className="image-list">{p.product_images.map(function (img) {
                                                return (
                                                <li key={img.id} className="image-item"><div className="image-alt">{img.alt_text}</div>
                                                    <img className="product-image" src={img.url} alt={img.alt_text}/>
                                                </li>)})}
                                            </ul>)}
                                    </td>
                                    <td className='product-buttons'>
                                        <button className="product-button" id='edit' type="button" onClick={function () {Edit(p);}}disabled={loading}>Edit</button>
                                        {/*DELETE product */}
                                        <button className="product-button" id='delete' type="button" onClick={function () {deleteProduct(p);}} disabled={loading}>Delete</button>
                                    </td>
                                </tr>)})}
                        </tbody>
                    </table>)}
                <button className='refresh' onClick={ListProduct}>Refresh</button>

                 {/*EDIT product*/}
                <div className="product-card">
                    <h2 className="product-subtitle">Edit Product</h2>
                    {editId === null && <p>Select a Product and click Edit.</p>}
                    {editId !== null && (
                        <form onSubmit={updateProduct} className="product-form">
                            {/* enter updated fields*/}
                        <label className="product-label">Title<input className="product-input" type="text" name="title" value={editForm.title} onChange={handleEditChange}/></label>
                        <label className="product-label">Short Description<input className="product-input" type="text" name="short_description" value={editForm.short_description} onChange={handleEditChange}/></label>
                        <label className="product-label">Price<input className="product-input" type="number" name="price" value={editForm.price} onChange={handleEditChange}/></label>
                        <label className="product-label">Currency<input className="product-input" type="text" name="currency" value={editForm.currency} onChange={handleEditChange}/></label>
                        <label className="product-label">Active Status<select className="product-input" name="active" value={editForm.active} onChange={handleEditChange}>
                            <option value="true">true</option>
                            <option value="false">false</option>
                            </select>
                        </label>
                        <label className="product-label">Etsy URL<input className="product-input" type="text" name="etsy_url" value={editForm.etsy_url} onChange={handleEditChange}/></label>
                        <label className="product-label">Image URL <small className='small-image-info'>Only edits the primary image</small><input className="product-input" type="text" name="url" value={editForm.url} onChange={handleEditChange}/></label> 
                        <p className="hint">To manage additional images, delete and re-add the product!</p>
                        <label className="product-label">Alt Text<input className="product-input" type="text" name="alt_text" value={editForm.alt_text} onChange={handleEditChange}/></label>
                        <label className="product-label">Sort Order<input className="product-input" type="number" name="sort_order" value={editForm.sort_order} onChange={handleEditChange}/></label>
                        <label className="product-label">Primary Image<input className='checkbox' type="checkbox" name="is_primary" checked={editForm.is_primary} onChange={handleEditChange}/></label>
                        {/*submit and loading statuses */}
                        <button className="product-button" type="submit" disabled={loading}>
                            {loading && "Saving..."}
                            {loading === false && "Save Changes"}
                        </button>
                        <button className="product-button" type="button" onClick={cancelEdit} disabled={loading}>Cancel</button>
                        </form>
                    )}
                    </div>
                </div>
            </div>
    )
}

export default AdminProduct;