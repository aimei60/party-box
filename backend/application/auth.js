import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET 
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN

//generates jwt token with payload details
export function generateToken(admin) {
  const payload = {
    id: admin.id,
    email: admin.email,
    role: admin.role,
  }

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

//checks for the correct authorisation
export function authRequired(req, res, next) {
   //gets authorisation header from request
  const authHeader = req.headers.authorization

  //expects authorisation: Bearer <token> if not raises error
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' })
  }

  //splits header and gets the JWT string
  const token = authHeader.split(' ')[1]

  try {
    //verify token via secret key
    const payload = jwt.verify(token, JWT_SECRET)

    //adds user info from token into user so its ready to be used
    req.user = payload //id, email, role assigned

    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}
