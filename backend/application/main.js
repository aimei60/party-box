import express from 'express'
import cors from "cors"
import dotenv from 'dotenv'
import productsRouter from './routers/public.products.routes.js'
import publicProductsRouter from './routers/public.products.routes.js'
import authProductsRouter from './routers/auth.products.routes.js'
import authImages from './routers/auth.product.images.routes.js'

const app = express()
dotenv.config()

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
]

app.use(
  cors({
    origin: allowedOrigins,
    credentials: false, // change to true when using cookies/session
  })
);

app.use(express.json())

app.use(productsRouter)
app.use(authProductsRouter)
app.use(publicProductsRouter)
app.use(authImages)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})