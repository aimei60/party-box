import prisma from "../utilities/prisma.js";

// returns all of the products on the product page with one image and brief product details
export async function getAllProducts() {
  const products = await prisma.products.findMany({
    where: { active: true },
    orderBy: { id: "desc" },
    include: {
      product_images: {
        orderBy: [
          { is_primary: "desc" },
          { sort_order: "asc" },
          { id: "asc" }
        ],
        take: 1
      }
    }
  });

  const cleanedProducts = [];

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    let mainImage = null;

    if (product.product_images.length > 0) {
      mainImage = product.product_images[0].url;
    }

    cleanedProducts.push({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      currency: product.currency,
      main_image: mainImage
    });
  }

  return cleanedProducts;
}

// returns the full product information and the rest of the images
export async function getProductById(id) {
  const productId = Number(id);

  if (isNaN(productId)) {
    return null;
  }

  const product = await prisma.products.findUnique({
    where: { id: productId },
    include: {
      product_images: {
        orderBy: [
          { is_primary: "desc" },
          { sort_order: "asc" },
          { id: "asc" }
        ]
      }
    }
  });

  if (!product || !product.active) {
    return null;
  }

  const result = {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    currency: product.currency,
    etsy_url: product.etsy_url,
    images: []
  };

  for (let i = 0; i < product.product_images.length; i++) {
    const img = product.product_images[i];

    result.images.push({
      id: img.id,
      product_id: img.product_id,
      url: img.url,
      is_primary: img.is_primary,
      sort_order: img.sort_order
    });
  }

  return result;
}

export default prisma;