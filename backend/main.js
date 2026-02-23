import express from 'express'
import cors from "cors"
import dotenv from 'dotenv'
import cookieParser from "cookie-parser"
import csrf from "csurf";
import helmet from "helmet"
import rateLimit from "express-rate-limit";
import morgan from "morgan"
import { authRequired } from './application/auth.js';
import adminAuthRouter from './application/routers/auth.admins.routes.js'
import adminsRouter from './application/routers/admins.routes.js'
import publicProductsRouter from './application/routers/public.products.routes.js'
import authProductsRouter from './application/routers/auth.products.routes.js'
import authImagesRouter from './application/routers/auth.product.images.routes.js'

const app = express()
dotenv.config()

app.set("trust proxy", 1) //trust first proxy in front of app

app.use(morgan("dev")) //morgan logs dev style

//redirect to https
app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production" && !req.secure) {
    return res.redirect(`https://${req.headers.host}${req.originalUrl}`);
  }
  next();
});

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
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, //  using cookies/session, false if its authentication bearer
  })
);

app.use(express.json())
app.use(cookieParser());

//CSRF Protection: Creates CSRF protection middleware, stores it in cookie,
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", //Cookie is only sent on same-site requests
  },
});

app.get("/api/admin/csrf-token", csrfProtection,
  (req, res) => {
    res.json({ csrfToken: req.csrfToken() }); //Generate a CSRF token and send it to the frontend
  }
);

app.use("/api/admin/auth",authLimiter, adminAuthRouter)
app.use("/api/admin/admins",authRequired, csrfProtection, adminsRouter)
app.use("/api/admin/products", authRequired, csrfProtection, authProductsRouter)
app.use("/api/products", publicProductsRouter)
app.use("/api/admin/product-images",authRequired, csrfProtection, authImagesRouter)

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong" })
}) //catches log errors nicely

const PORT = process.env.PORT || 3000

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on http://localhost:${PORT}`)
}) //0.0.0.0 - Listen on all network interfaces on this machine.
