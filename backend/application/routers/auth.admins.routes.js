//router functions for auth admins
import express from 'express';
import prisma from "../utilities/prisma.js";
import bcrypt from "bcryptjs";
import {generateToken, authRequired} from '../auth.js';
import {createAdmin, listAdmins, getAdminById, updateAdmin, deleteAdmin  } from '../crud/auth.admins.js';

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

    // set HTTP-only cookie
    res.cookie("adminToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // https in prod and http in dev
    sameSite: "strict",
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
router.post('/logout', (req, res) => {
  res.clearCookie("adminToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  })

  res.json({ message: "Logged out" })
})

//logged in admin create admin user
router.post('/', authRequired, async (req, res) => {
  try {
    const currentAdmin = req.user //stores details of current admin or superadmin
    const { email, password, role } = req.body //details of new admin

    const newAdmin = await createAdmin(currentAdmin, { email, password, role })
    res.status(201).json(newAdmin)
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to create admin' })
  }
})

//router function to list admins
router.get('/', authRequired, async (req, res) => {
  try {
    const currentAdmin = req.user
    const adminList = await listAdmins(currentAdmin)

    res.status(200).json(adminList)
  } catch (error) {
    res.status(404).json({ error: error.message || 'Failed to return list of admins' })
  }
})

//router to get admin by id
router.get('/:id', authRequired, async (req, res) => {
  try {
    const currentAdmin = req.user
    const { id } = req.params     

    const adminById = await getAdminById(currentAdmin, id)

    if (!adminById) {
      return res.status(404).json({ error: 'Admin not found' })
    }

    res.status(200).json(adminById)
  } catch (error) {
    if (error.message === 'Not allowed') {
      return res.status(403).json({ error: 'Not allowed'})
    }
    console.error(error)
    res.status(500).json({ error: error.message || 'Failed to get admin' })
  }
})

//router function to update admin
router.put('/:id', authRequired, async (req, res) => {
  try {
    const currentAdmin = req.user
    const { id } = req.params    
    const { email, password, role } = req.body 

    const updatesAdmin = await updateAdmin(currentAdmin, id, { email, password, role })

    if (!updatesAdmin) {
      return res.status(404).json({ error: 'Admin not found' })
    }

    res.json(updatesAdmin)
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to update admin' })
  }
})

// router function to delete admin
router.delete('/:id', authRequired, async (req, res) => {
  try {
    const currentAdmin = req.user
    const { id } = req.params    

    const delAdmin = await deleteAdmin(currentAdmin, id)

    if (!delAdmin) {
      return res.status(404).json({ error: 'Admin not found' })
    }

    res.json(delAdmin)
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to delete admin' })
  }
})

export default router