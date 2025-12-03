//router functions for admin products
import express from 'express';
import { createProduct, updateProduct, deleteProduct, getAdminProducts } from '../crud/auth.products.js';
import { generateToken, authRequired} from '../auth.js';

const router = express.Router()

//router function to create product by admin/superadmin
router.post('/products', authRequired, async (req, res) => {
  try {
    const currentAdmin = req.user 
    const productData = req.body

    const newProduct = await createProduct(currentAdmin, productData)
    res.status(201).json(newProduct)
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to create new product' })
  }
})

//router function to update product
router.put('/products/:id', authRequired, async (req, res) => {
  try {
    const currentAdmin = req.user 
    const productData = req.body
    const { id } = req.params

    const updateProd = await updateProduct(currentAdmin, id, productData)

    if (!updateProd) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.status(200).json(updateProd)
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to update new product' })
  }
})

//router function to delete product
router.delete('/products/:id', authRequired, async (req, res) => {
  try {
    const currentAdmin = req.user 
    const { id } = req.params

    const delProd = await deleteProduct(currentAdmin, id)

    if (!delProd) {
      return res.status(404).json({ error: 'Product not found' })
    }
    
    res.status(200).json(delProd)
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to update new product' })
  }
})

//router function to return all products
router.get('/admin/products', authRequired, async (req, res) => {
  try {
    const currentAdmin = req.user 

    const getAllProducts = await getAdminProducts(currentAdmin)
    
    res.status(200).json(getAllProducts)
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to get all products' })
  }
})

export default router