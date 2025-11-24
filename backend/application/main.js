import express from 'express'
import dotenv from 'dotenv'
import productsRouter from './routers/public.products.routes.js'

const app = express()
dotenv.config()

app.use(express.json())

app.use('/api', productsRouter)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})