import express from 'express'
import cors from "cors"
import dotenv from 'dotenv'
import cookieParser from "cookie-parser"
import adminAuthRouter from './application/routers/auth.admins.routes.js'
import adminsRouter from './application/routers/auth.admins.routes.js'
import publicProductsRouter from './application/routers/public.products.routes.js'
import authProductsRouter from './application/routers/auth.products.routes.js'
import authImagesRouter from './application/routers/auth.product.images.routes.js'

const app = express()
dotenv.config()

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
]

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, //  using cookies/session, false if its authentication bearer
  })
);

app.use(express.json())
app.use(cookieParser());

app.use("/api/admin/auth", adminAuthRouter)
app.use("/api/admin/admins", adminsRouter)
app.use("/api/admin/products", authProductsRouter)
app.use("/api/products", publicProductsRouter)
app.use("/api/admin/products", authImagesRouter)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})