//router functions for auth admins - login/me/logout
import express from 'express';
import prisma from "../utilities/prisma.js";
import bcrypt from "bcryptjs";
import {generateToken, authRequired} from '../auth.js';
import { forgotPassword } from "../forgotPassword/forgotPassword.js";
import { resetPassword } from "../forgotPassword/resetPassword.js";

const router = express.Router()

//auth/login - successful log in and get jwt token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    //Find admin by email
    const admin = await prisma.admins.findUnique({
      where: { 
        email: email.toLowerCase(),
        isActive: true, 
      },
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

    // set HTTP-only cookie
    const isProduction = process.env.NODE_ENV === "production";
    let sameSiteValue = "lax";
    if (isProduction) {
      sameSiteValue = "none";
    }

    res.cookie("adminToken", token, {
    httpOnly: true,
    secure: isProduction, 
    sameSite: sameSiteValue,
    maxAge: 60 * 60 * 1000, // 1 hour
  });

    //return both the admin info (no password) and token
    res.json({admin: publicAdmin,})
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to log in' })
  }
})

//who am I check
router.get('/me', authRequired, (req, res) => {
  res.json({ admin: req.user })
})

//logout route for user
router.post('/logout', authRequired, (req, res) => {
  res.clearCookie("adminToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  })

  res.json({ message: "Logged out" })
})

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

export default router