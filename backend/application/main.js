import express from 'express'
import dotenv from 'dotenv'
import productsRouter from './routers/public.products.routes.js'
import authRouter from './routers/auth.admins.routes.js'

const app = express()
dotenv.config()

app.use(express.json())

app.use(productsRouter)
app.use(authRouter)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})