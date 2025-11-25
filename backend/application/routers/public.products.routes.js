import express from 'express'
import { getAllProducts, getProductById } from '../crud/public.products.js'

const router = express.Router()

//function to get all products - for main product page
router.get('/products', async (req, res) => {
    try {
        const products = await getAllProducts()
        res.json(products)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' })
    }
})

//function to show products and all their images - on the individual product page
router.get('/products/:id', async (req, res) => {
    try {
        const product = await getProductById(req.params.id)
        if (!product) {
        return res.status(404).json({ error: 'Product not found' })
    }
        res.json(product)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' })
    }
})

export default router