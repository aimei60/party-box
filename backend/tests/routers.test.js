//router tests for public products, auth admin, auth products and auth product images functions
import request from "supertest";
import express from "express";
import bcrypt from "bcryptjs";
import prisma from "../application/utilities/prisma.js";
import publicProductsRouter from "../application/routers/public.products.routes.js";
import authAdminsRouter from "../application/routers/auth.admins.routes.js";
import authProductsRouter from "../application/routers/auth.products.routes.js";
import authProductImagesRouter from "../application/routers/auth.product.images.routes.js";
import { generateToken } from "../application/auth.js";

const app = express();
app.use(express.json());
app.use(publicProductsRouter);
app.use(authAdminsRouter);
app.use(authProductsRouter);
app.use(authProductImagesRouter);

//set up code
beforeEach(async () => {
  await prisma.product_images.deleteMany();
  await prisma.products.deleteMany();
  await prisma.admins.deleteMany();
});

//close DB connection
afterAll(async () => {
  await prisma.$disconnect();
});

//creates an admin and a JWT
async function createAdminAndToken(role = "superadmin", email = "admin@example.com") {
  const passwordHash = await bcrypt.hash("password123", 12);

  const admin = await prisma.admins.create({
    data: {
      email,
      password: passwordHash,
      role,
    },
  });

  const publicAdmin = {
    id: admin.id,
    email: admin.email,
    role: admin.role,
    created_at: admin.created_at,
    updated_at: admin.updated_at,
  };

  const token = generateToken(publicAdmin);

  return { admin, token };
}

// TESTS FOR PUBLIC PRODUCT ROUTES 

//tests returning all of the products
test("GET /products returns 200 and an array", async () => {
  const res = await request(app).get("/products");

  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

//tests if product id is not in db and returns error
test("GET /products/:id returns 404 if missing", async () => {
  const res = await request(app).get("/products/999");
  expect(res.status).toBe(404);
  expect(res.body).toEqual({ error: "Product not found" });
});

//returns the correct product calling its ID
test("GET /products/:id returns a product when it exists", async () => {
  const { admin } = await createAdminAndToken("admin", "public-test@example.com");

  const product = await prisma.products.create({
    data: {
      title: "Test Product",
      description: "Nice box",
      price: 10,
      currency: "GBP",
      active: true,
      created_by_admin_id: admin.id,
      updated_by_admin_id: admin.id,
    },
  });

  const res = await request(app).get(`/products/${product.id}`);

  expect(res.status).toBe(200);
  expect(res.body.title).toBe("Test Product");
});

// TESTS FOR AUTH ADMINS ROUTES 

//test to login and get jwt token
test("POST /auth/login logs in successfully", async () => {
  const password = "secret123";
  const hash = await bcrypt.hash(password, 12);

  const admin = await prisma.admins.create({
    data: { email: "login@example.com", password: hash, role: "admin" },
  });

  const res = await request(app)
    .post("/auth/login")
    .send({ email: admin.email, password });

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("token");
});

//test to raise correct error if missing email or password
test("POST /auth/login returns 400 if missing fields", async () => {
  const res = await request(app)
  .post("/auth/login")
  .send({});
  
expect(res.status).toBe(400);
});

//test to create admin
test("POST /admins creates new admin (superadmin only)", async () => {
  const { token } = await createAdminAndToken("superadmin", "sa@example.com");

  const res = await request(app)
    .post("/admins")
    .set("Authorization", `Bearer ${token}`)
    .send({ email: "new@example.com", password: "pass123", role: "admin" });

  expect(res.status).toBe(201);
  expect(res.body.email).toBe("new@example.com");
});

//test to list admins
test("GET /admins returns admins list", async () => {
  const { token } = await createAdminAndToken("superadmin", "sa@example.com");

  await prisma.admins.create({
    data: { email: "a2@example.com", password: await bcrypt.hash("x", 12), role: "admin" },
  });

  const res = await request(app)
    .get("/admins")
    .set("Authorization", `Bearer ${token}`);

  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBeGreaterThan(0);
});

//test to get admin by ID
test("GET /admins/:id returns 404 if admin missing", async () => {
  const { token } = await createAdminAndToken();

  const res = await request(app)
    .get("/admins/999")
    .set("Authorization", `Bearer ${token}`);

  expect(res.status).toBe(404);
});

// TEST FOR AUTH PRODUCT ROUTES 

//test to create product
test("POST /products (admin) creates a product", async () => {
  const { token, admin } = await createAdminAndToken(
    "admin",
    "product-maker@example.com"
  );

  const productData = {
    title: "Admin Box",
    description: "Cool box",
    price: 25,
    currency: "GBP",
    active: true,
  };

  const res = await request(app)
    .post("/products")
    .set("Authorization", `Bearer ${token}`)
    .send(productData);

  expect(res.status).toBe(201);
  expect(res.body.created_by_admin_id).toBe(admin.id);
});

// TESTS FOR AUTH PRODUCT IMAGE ROUTES 

//test to add product images
test("POST /products/:id/images adds product image", async () => {
  const { token, admin } = await createAdminAndToken("admin", "img-admin@example.com");

  const product = await prisma.products.create({
    data: {
      title: "Img Product",
      description: "Has images",
      price: 10,
      currency: "GBP",
      active: true,
      created_by_admin_id: admin.id,
      updated_by_admin_id: admin.id,
    },
  });

  const res = await request(app)
    .post(`/products/${product.id}/images`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      url: "test.jpg",
      alt_text: "test",
      sort_order: 1,
      is_primary: true,
    });

  expect(res.status).toBe(201);
  expect(res.body.url).toBe("test.jpg");
});

//test to delete product images
test("DELETE /products/:id/images/:imgId deletes image", async () => {
  const { token, admin } = await createAdminAndToken("admin", "img-admin2@example.com");

  const product = await prisma.products.create({
    data: {
      title: "Delete Img Product",
      description: "Test",
      price: 10,
      currency: "GBP",
      active: true,
      created_by_admin_id: admin.id,
      updated_by_admin_id: admin.id,
    },
  });

  const image = await prisma.product_images.create({
    data: {
      product_id: product.id,
      url: "bye.jpg",
      alt_text: "bye",
      sort_order: 0,
      is_primary: false,
    },
  });

  const res = await request(app)
    .delete(`/products/${product.id}/images/${image.id}`)
    .set("Authorization", `Bearer ${token}`);

  expect(res.status).toBe(200);
  expect(res.body.id).toBe(image.id);
});