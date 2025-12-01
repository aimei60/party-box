//tests the entering of example DB data into the Test DB
import prisma from "../application/utilities/prisma.js";

//Test 1: tests entering data into the admins table
test("can insert an admin into test DB", async () => {
  await prisma.admins.deleteMany();

  const adminEmail = "seed_admin@example.com";

  const admin = await prisma.admins.create({
    data: {
      email: adminEmail,
      password: "hashed_password63",
      role: "superadmin",
    },
  });

  expect(admin.id).toBeDefined();
  expect(admin.email).toBe(adminEmail);
  expect(admin.role).toBe("superadmin");
});

//Test 2: tests data entering into products table
test("can insert a product linked to admin", async () => {
  await prisma.product_images.deleteMany();
  await prisma.products.deleteMany();
  await prisma.admins.deleteMany();

  const admin = await prisma.admins.create({
    data: {
      email: "product_admin@example.com",
      password: "hashed_password33",
      role: "admin",
    },
  });

  const productTitle = "Princess Party Box";
  const productDescription = "Pink Princess Party Box";
  const productPrice = 2;
  const productCurrency = "GBP";
  const activeStatus = true;
  const etsyURL = "https://example.com/listing/123";

  const product = await prisma.products.create({
    data: {
      title: productTitle,
      description: productDescription,
      price: productPrice,
      currency: productCurrency,
      active: activeStatus,
      etsy_url: etsyURL,
      created_by_admin_id: admin.id,
      updated_by_admin_id: admin.id,
    },
  });

  expect(product.id).toBeDefined();
  expect(product.title).toBe(productTitle);
  expect(product.description).toBe(productDescription);
  expect(product.price).toBe(productPrice);
  expect(product.currency).toBe(productCurrency);
  expect(product.active).toBe(activeStatus);
  expect(product.etsy_url).toBe(etsyURL);
  expect(product.created_by_admin_id).toBe(admin.id);
  expect(product.updated_by_admin_id).toBe(admin.id);

  const found = await prisma.products.findUnique({
    where: { id: product.id },
  });

  expect(found).not.toBeNull();
  expect(found.title).toBe(productTitle);
});

//Test 3: tests data being added to the product images table
test("can insert a product image linked to product", async () => {
  await prisma.product_images.deleteMany();
  await prisma.products.deleteMany();
  await prisma.admins.deleteMany();

  const admin = await prisma.admins.create({
    data: {
      email: "image_admin@example.com",
      password: "hashed_password_img",
      role: "admin",
    },
  });

  const product = await prisma.products.create({
    data: {
      title: "Jungle Party Box",
      description: "Jungle Party Theme Box",
      price: 5,
      currency: "GBP",
      active: true,
      etsy_url: "https://example.com/listing/456",
      created_by_admin_id: admin.id,
      updated_by_admin_id: admin.id,
    },
  });

  const image = await prisma.product_images.create({
    data: {
      product_id: product.id,
      url: "jungle1.jpg",
      is_primary: true,
      sort_order: 1,
    },
  });

  expect(image.id).toBeDefined();
  expect(image.product_id).toBe(product.id);
  expect(image.url).toBe("jungle1.jpg");

  const found = await prisma.product_images.findUnique({
    where: { id: image.id },
  });

  expect(found).not.toBeNull();
  expect(found.product_id).toBe(product.id);
});