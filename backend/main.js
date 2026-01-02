import express from 'express'
import cors from "cors"
import dotenv from 'dotenv'
import cookieParser from "cookie-parser"
import productsRouter from './application/routers/public.products.routes.js'
import publicProductsRouter from './application/routers/public.products.routes.js'
import authProductsRouter from './application/routers/auth.products.routes.js'
import authImages from './application/routers/auth.product.images.routes.js'

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

app.use("/api", productsRouter)
app.use("/api", authProductsRouter)
app.use("/api", publicProductsRouter)
app.use("/api", authImages)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})