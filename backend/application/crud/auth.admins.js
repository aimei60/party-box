import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// function when returning admin details, it doesnt return hashed password
export function toPublicAdmin(admin) {

  return {
    id: admin.id,
    email: admin.email,
    role: admin.role,
    created_at: admin.created_at,
    updated_at: admin.updated_at
  };
}

//create admins and superadmin
export async function createAdmin(currentAdmin, { email, password, role }) {

  if (!email || !password || !role) {
    throw new Error("email, password and role are required");
  }

  if (!["admin", "superadmin"].includes(role)) {
    throw new Error("role must be 'admin' or 'superadmin'");
  }

  //only superadmins can create other superadmins
  if (role === "superadmin" && currentAdmin.role !== "superadmin") {
    throw new Error("Only a superadmin can create another superadmin");
  }

  //admins can create another admin
   if (currentAdmin.role === "admin") {
    role = "admin";
  }

  const password_hash = await bcrypt.hash(password, 12);

  const admin = await prisma.admins.create({
    data: {
      email,
      password: password_hash,
      role
    }
  });

  return toPublicAdmin(admin);
}

//get admins/superadmins list 
export async function listAdmins(currentAdmin) {

  let where = {};

//only admins see other admins
  if (currentAdmin.role !== "superadmin") {
    where = { role: "admin" };
  }

  return prisma.admins.findMany({
    where,
    orderBy: { id: "asc" },
    select: {
      id: true,
      email: true,
      role: true,
      created_at: true,
      updated_at: true
    }
  });
}

// returns admins by their ID number so user can edit, view, delete admin details
export async function getAdminById(currentAdmin, id) {

  const adminId = Number(id);

  if (isNaN(adminId)) {
    return null;
  }

  const admin = await prisma.admins.findUnique({
    where: { id: adminId }
  });

  if (!admin) {
    return null;
  }

  //admins cant see superadmins
  if (currentAdmin.role !== "superadmin" && admin.role === "superadmin") {
    throw new Error("Not allowed");
  }

  return toPublicAdmin(admin);
}

// updates superadmin and admin's role, email and password
export async function updateAdmin(currentAdmin, id, { email, password, role }) {

  const adminId = Number(id);

  if (isNaN(adminId)) {
    return null;
  }

  const targetAdmin = await prisma.admins.findUnique({
    where: { id: adminId }
  });

  if (!targetAdmin) {
    return null;
  }

    //admins cannot update superadmins
  if (currentAdmin.role !== "superadmin" && targetAdmin.role === "superadmin") {
    throw new Error("You are not allowed to update this admin");
  }

  const data = {};

  if (email) {
    data.email = email;
  }

  if (role) {
    if (!["admin", "superadmin"].includes(role)) {
      throw new Error("role must be 'admin' or 'superadmin'");
    }

    //admins cannot assign superadmin role
    if (currentAdmin.role !== "superadmin" && role === "superadmin") {
      throw new Error("You are not allowed to assign superadmin role");
    }

    if (targetAdmin.role === "superadmin" && role === "admin") {
    const superadminCount = await prisma.admins.count({
      where: { role: "superadmin" }
    });

    // if superadmin less than 1, you cannot demote the last superadmin
    if (superadminCount <= 1) {
      throw new Error("You cannot demote the last superadmin");
    }
  }

    data.role = role;
  }

  if (password) {
    data.password = await bcrypt.hash(password, 12);
  }

  const admin = await prisma.admins.update({
    where: { id: adminId },
    data
  });

  return toPublicAdmin(admin);
}

//delete superadmin and admins
export async function deleteAdmin(currentAdmin, id) {

  const adminId = Number(id);

  if (isNaN(adminId)) {
    return null;
  }

  if (currentAdmin.id === adminId) {
    throw new Error("You cannot delete your own account");
  }

  const targetAdmin = await prisma.admins.findUnique({
    where: { id: adminId }
  });

  if (!targetAdmin) {
    return null;
  }

  //admins cant delete superadmins
  if (currentAdmin.role !== "superadmin" && targetAdmin.role === "superadmin") {
    throw new Error("You are not allowed to delete this admin");
  }

  if (targetAdmin.role === "superadmin") {
    const superadminCount = await prisma.admins.count({
      where: { role: "superadmin" }
    });

    if (superadminCount <= 1) {
      throw new Error("You cannot delete the last superadmin");
    }
  }

  const admin = await prisma.admins.delete({
    where: { id: adminId }
  });

  return toPublicAdmin(admin);
}

export default prisma;