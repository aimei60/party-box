//crud functions for auth product images
import prisma from "../utilities/prisma.js";

//add new image
export async function addProductImage(currentAdmin, productId, imageData) {
  if (!currentAdmin || (currentAdmin.role !== "admin" && currentAdmin.role !== "superadmin")) {
    throw new Error("Not allowed");
  }

  const id = Number(productId);

  if (isNaN(id)) {
    return null;
  }

  const product = await prisma.products.findUnique({
    where: { id: id }
  });

  if (!product) {
    return null;
  }

  if (!imageData || !imageData.url) {
    throw new Error("Image url is required");
  }

  let alt_text = "";
  if (imageData.alt_text) {
    alt_text = imageData.alt_text;
  }

  let sort_order = 0;
  if (imageData.sort_order !== undefined) {
    sort_order = imageData.sort_order;
  }

  let is_primary = false;
  if (imageData.is_primary === true) {
    is_primary = true;
  }

  // transaction to delete old primary image and create new primary image
  const newImage = await prisma.$transaction(async function (tx) {
    if (is_primary === true) {
      await tx.product_images.updateMany({
        where: {
          product_id: id,
          is_primary: true
        },
        data: {
          is_primary: false
        }
      });
    }

    const created = await tx.product_images.create({
      data: {
        product_id: id,
        url: imageData.url,
        alt_text: alt_text,
        sort_order: sort_order,
        is_primary: is_primary
      }
    });

    return created;
  });

  return newImage;
}

//updating an image
export async function updateProductImage(currentAdmin, productId, imageId, imageData) {

  if (!currentAdmin || (currentAdmin.role !== "admin" && currentAdmin.role !== "superadmin")) {
    throw new Error("Not allowed");
  }

  const pid = Number(productId);
  const iid = Number(imageId);

  if (isNaN(pid) || isNaN(iid)) {
    return null;
  }

  const existing = await prisma.product_images.findFirst({
    where: {
      id: iid,
      product_id: pid
    }
  });

  if (!existing) {
    return null;
  }

  //transaction to add new image and delete old image
  const updatedImage = await prisma.$transaction(async function (tx) {
    const data = {};

    if (imageData.url !== undefined) {
      data.url = imageData.url;
    }

    if (imageData.alt_text !== undefined) {
      data.alt_text = imageData.alt_text;
    }

    if (imageData.sort_order !== undefined) {
      data.sort_order = imageData.sort_order;
    }

    let makingPrimary = false;

    if (imageData.is_primary !== undefined) {
      data.is_primary = imageData.is_primary;
      if (imageData.is_primary === true) {
        makingPrimary = true;
      }
    }

    if (makingPrimary === true) {
      await tx.product_images.updateMany({
        where: {
          product_id: pid,
          is_primary: true,
          id: { not: iid }
        },
        data: {
          is_primary: false
        }
      });
    }

    const updated = await tx.product_images.update({
      where: { id: iid },
      data: data
    });

    return updated;
  });

  return updatedImage;
}

//delete an image
export async function deleteProductImage(currentAdmin, productId, imageId) {
  if (!currentAdmin || (currentAdmin.role !== "admin" && currentAdmin.role !== "superadmin")) {
    throw new Error("Not allowed");
  }

  const pid = Number(productId); // confirm image belongs to that specific product
  const iid = Number(imageId); //delete image

  if (isNaN(pid) || isNaN(iid)) {
    return null;
  }

  const existing = await prisma.product_images.findFirst({
    where: {
      id: iid,
      product_id: pid
    }
  });

  if (!existing) {
    return null;
  }

  const deleted = await prisma.product_images.delete({
    where: { id: iid }
  });

  return deleted;
}