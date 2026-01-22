//crud functions for products
import prisma from "../utilities/prisma.js";

const DEFAULT_DESCRIPTION = {
  title: "Personalised Party Bags and Boxes",
  paragraph:
    "These beautifully personalised party boxes are the perfect finishing touch for children’s parties, birthdays, playdates, classroom celebrations, or any fun little event. They add a thoughtful, memorable detail that guests will love.",
  sections: [
    {
      heading: "Measurements (H × L × W)",
      body: "17.5 cm × 13.5 cm × 10.9 cm (6.8 in × 5.3 in × 4 in)",
    },
    {
      heading: "Assembly",
      body: "Each box comes professionally printed, pre-folded, and ready to pop open. Just press the base together and fill it with special treats. There’s no need for glue or tape. Simply fill with your chosen goodies and secure the top tabs for a neat finish.",
    },
    { heading: "How to Order", body: "Visit our Etsy Store to place your order." },
    { body: "If you have any questions or need assistance, don’t hesitate to contact us." },
  ],
};

// create product if you are admin or superadmin
export async function createProduct(currentAdmin, productData) {
  if (!currentAdmin || (currentAdmin.role !== "admin" && currentAdmin.role !== "superadmin")) {
    throw new Error("Not allowed");
  }

  if (!productData.title || productData.price === undefined  || !productData.currency) {
    throw new Error("title, price and currency are required");
  }

  const description = DEFAULT_DESCRIPTION

  let short_description = null;
  if (productData.short_description) {
    short_description = productData.short_description
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
      short_description: short_description,
      price: productData.price,
      currency: productData.currency,
      active: active,
      etsy_url: etsy_url,
      created_by_admin_id: currentAdmin.id,
      updated_by_admin_id: currentAdmin.id
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
  if (productData.short_description !== undefined) {
    data.short_description = productData.short_description;
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

  data.updated_by_admin_id = currentAdmin.id;
  
  const updated = await prisma.products.update({
    where: { id: productId },
    data: data
  });

  return updated;
}

// delete product
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

  await prisma.product_images.deleteMany({
    where: { product_id: productId }
  });

  const deleted = await prisma.products.delete({
    where: { id: productId }
  });

  return deleted;

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
