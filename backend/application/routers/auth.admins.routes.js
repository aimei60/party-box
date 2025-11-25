import express from 'express'
import prisma from '../crud/auth.admins.js'  
import bcrypt from "bcryptjs"  
import { generateToken } from '../auth.js'
import { toPublicAdmin, createAdmin, listAdmins, getAdminById, updateAdmin, deleteAdmin  } from '../crud/auth.admins.js'

const router = express.Router()

//auth/login - successful log in and get jwt token
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    //Find admin by email
    const admin = await prisma.admins.findUnique({
      where: { email },
    })

    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    //Compare password with hashed password
    const isMatch = await bcrypt.compare(password, admin.password)

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    //returns the below admin details without password
    const publicAdmin = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      created_at: admin.created_at,
      updated_at: admin.updated_at,
    }

    //create JWT token
    const token = generateToken(publicAdmin)

    //return both the admin info (no password) and token
    res.json({
      admin: publicAdmin,
      token,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to log in' })
  }
})

export default router