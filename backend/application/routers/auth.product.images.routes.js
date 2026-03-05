//router functions for product images
import express from 'express';
import multer from "multer";
import {addProductImage, updateProductImage, deleteProductImage} from '../crud/auth.product.images.js';
import {authRequired} from '../auth.js';
import { uploadProductImageToS3 } from "../utilities/s3Upload.js";

const router = express.Router()

//for file uploads keep in memory and reject if its bigger than 5MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, //20MB
  },
});

//upload image
router.post("/upload", authRequired, upload.single("image"), async (req, res) => {
  try {
    const currentAdmin = req.user;

    if (!currentAdmin || (currentAdmin.role !== "admin" && currentAdmin.role !== "superadmin")) {
      return res.status(403).json({ error: "Not allowed" });
    }

    const productIdRaw = req.body.productId;
    const productId = Number(productIdRaw);

    if (isNaN(productId)) {
      return res.status(400).json({ error: "productId must be a number" });
    }

    const file = req.file;
    const uploaded = await uploadProductImageToS3(file, productId);

    return res.status(201).json({ url: uploaded.url, key: uploaded.key });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Upload failed" });
  }
});

//router function to add product image by admin/superadmin
router.post('/:productId/images', authRequired, async (req, res) => {
  try {
    const currentAdmin = req.user 
    const { productId } = req.params
    const imageData = req.body

    const newImage = await addProductImage(currentAdmin, productId, imageData)

    if (!newImage) {
      return res.status(404).json({ error: 'Product or image not found' })
    }

    res.status(201).json(newImage)
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to add new Image' })
  }
})

//router function to update product image
router.put('/:productId/images/:imageId', authRequired, async (req, res) => {
  try {
    const currentAdmin = req.user 
    const { productId, imageId } = req.params
    const imageData = req.body

    const updateImage = await updateProductImage(currentAdmin, productId, imageId, imageData)

    if (!updateImage) {
      return res.status(404).json({ error: 'Product or image not found' })
    }

    res.status(200).json(updateImage)
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to update Image' })
  }
})

//router function to delete product image
router.delete('/:productId/images/:imageId', authRequired, async (req, res) => {
  try {
    const currentAdmin = req.user 
    const { productId, imageId } = req.params

    const delImage = await deleteProductImage(currentAdmin, productId, imageId)

    if (!delImage) {
      return res.status(404).json({ error: 'Product or image not found' })
    }

    res.status(200).json(delImage)
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to delete Image' })
  }
})

export default router