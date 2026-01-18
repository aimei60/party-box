import express from 'express'
import cors from "cors"
import dotenv from 'dotenv'
import cookieParser from "cookie-parser"
import helmet from "helmet"
import rateLimit from "express-rate-limit";
import adminAuthRouter from './application/routers/auth.admins.routes.js'
import adminsRouter from './application/routers/auth.admins.routes.js'
import publicProductsRouter from './application/routers/public.products.routes.js'
import authProductsRouter from './application/routers/auth.products.routes.js'
import authImagesRouter from './application/routers/auth.product.images.routes.js'

const app = express()
dotenv.config()

//JWT env safety checks so we dont get weird failure errors
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET missing")
}

if (!process.env.JWT_EXPIRES_IN) {
  throw new Error("JWT_EXPIRES_IN missing")
}

app.use(helmet())

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,// 15 minutes fresh start for each IP
  max: 20,// max 20 requests per IP
  standardHeaders: true, //so client knows how many attempts is left and is aware
  legacyHeaders: false,//use moden rate limit headers only and forget older ones
})

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

app.use("/api/admin/auth",authLimiter, adminAuthRouter)
app.use("/api/admin/admins", adminsRouter)
app.use("/api/admin/products", authProductsRouter)
app.use("/api/products", publicProductsRouter)
app.use("/api/admin/products", authImagesRouter)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})