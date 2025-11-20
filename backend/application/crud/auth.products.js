import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// create product if you are admin or superadmin
export async function createProduct(currentAdmin, productData) {
  if (!currentAdmin || (currentAdmin.role !== "admin" && currentAdmin.role !== "superadmin")) {
    throw new Error("Not allowed");
  }

  if (!productData.title || !productData.price || !productData.currency) {
    throw new Error("title, price and currency are required");
  }

  let description = "";
  if (productData.description) {
    description = productData.description;
  }

  let active = true;
  if (productData.active === false) {
    active = false;
  }

  let etsy_url = null;
  if (productData.etsy_url) {
    etsy_url = productData.etsy_url;
  }

  const product = await prisma.products.create({
    data: {
      title: productData.title,
      description: description,
      price: productData.price,
      currency: productData.currency,
      active: active,
      etsy_url: etsy_url,
    }
  });

  return product;
}

//update product details if you are admin or superadmin
export async function updateProduct(currentAdmin, id, productData) {
  if (!currentAdmin || (currentAdmin.role !== "admin" && currentAdmin.role !== "superadmin")) {
    throw new Error("Not allowed");
  }

  const productId = Number(id);

  if (isNaN(productId)) {
    return null;
  }

  const existing = await prisma.products.findUnique({
    where: { id: productId }
  });

  if (!existing) {
    return null;
  }

  const data = {};

  if (productData.title !== undefined) {
    data.title = productData.title;
  }
  if (productData.description !== undefined) {
    data.description = productData.description;
  }
  if (productData.price !== undefined) {
    data.price = productData.price;
  }
  if (productData.currency !== undefined) {
    data.currency = productData.currency;
  }
  if (productData.active !== undefined) {
    data.active = productData.active;
  }
  if (productData.etsy_url !== undefined) {
    data.etsy_url = productData.etsy_url;
  }
  
  const updated = await prisma.products.update({
    where: { id: productId },
    data: data
  });

  return updated;
}

// makes a product inactive 
export async function deleteProduct(currentAdmin, id) {
  if (!currentAdmin || (currentAdmin.role !== "admin" && currentAdmin.role !== "superadmin")) {
    throw new Error("Not allowed");
  }

  const productId = Number(id);

  if (isNaN(productId)) {
    return null;
  }

  const existing = await prisma.products.findUnique({
    where: { id: productId }
  });

  if (!existing) {
    return null;
  }

  const updated = await prisma.products.update({
    where: { id: productId },
    data: { active: false }
  });

  return updated;
}

//retrieves all products information, including inactive products
export async function getAdminProducts(currentAdmin) {
  if (!currentAdmin || (currentAdmin.role !== "admin" && currentAdmin.role !== "superadmin")) {
    throw new Error("Not allowed");
  }

  const products = await prisma.products.findMany({
    orderBy: { id: "desc" },
    include: {
      product_images: true
    }
  });

  return products;
}

export default prisma;