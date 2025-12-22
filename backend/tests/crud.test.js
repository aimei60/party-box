//crud tests for public products, auth admin, auth products and auth product images functions
import prisma from "../application/utilities/prisma.js";
import { getAllProducts, getProductById } from "../application/crud/public.products.js";
import bcrypt from "bcryptjs";
import { toPublicAdmin, createAdmin, listAdmins, getAdminById, updateAdmin, deleteAdmin } from "../application/crud/auth.admins.js"
import { createProduct, updateProduct, deleteProduct, getAdminProducts } from "../application/crud/auth.products.js"
import { addProductImage, updateProductImage, deleteProductImage } from "../application/crud/auth.product.images.js"

//gives a random unique email to avoid repetitive emails causing errors in testing
const uniqueEmail = (prefix) =>`${prefix}-${Date.now()}@test.com`;

//TESTS FOR PUBLIC PRODUCT CRUD FUNCTIONS

//returns only active products with main image
test("returns only active products with main image", async () => {
  await prisma.product_images.deleteMany();
  await prisma.products.deleteMany();
  await prisma.admins.deleteMany();

  const admin = await prisma.admins.create({
    data: {
      email: "test-admin@example.com",
      password: "hashed",
      role: "admin",
    },
  });

  const product = await prisma.products.create({
    data: {
      title: "Princess Box",
      description: "Pink box",
      price: 10,
      currency: "GBP",
      active: true,
      etsy_url: null,
      created_by_admin_id: admin.id,
      updated_by_admin_id: admin.id,
    },
  });

  await prisma.product_images.create({
    data: {
      product_id: product.id,
      url: "image1.jpg",
      is_primary: true,
      sort_order: 1,
    },
  });

  const result = await getAllProducts();

  const found = result.find((p) => p.title === "Princess Box");

  expect(found).toEqual({
    id: expect.any(Number),
    title: "Princess Box",
    description: "Pink box",
    price: 10,
    currency: "GBP",
    main_image: "image1.jpg",
  });
});

//getProductById returns full product with images for active product
test("returns full product with images for active product", async () => {
  await prisma.product_images.deleteMany();
  await prisma.products.deleteMany();
  await prisma.admins.deleteMany();
  
  const admin = await prisma.admins.create({
    data: {
        email: "test-admin@example.com",
        password: "hashed",
        role: "admin",
    },});
    
    const product = await prisma.products.create({
    data: {
        title: "Princess Box",
        description: "Pink box",
        price: 10,
        currency: "GBP",
        active: true,
        etsy_url: null,
        created_by_admin_id: admin.id,
        updated_by_admin_id: admin.id,
        product_images: {
        create: {
            url: "image1.jpg",
            is_primary: true,
            sort_order: 1,
        },
        },
    },
    });

  const result = await getProductById(product.id);

  expect(result).toEqual({
    id: product.id,
    title: "Princess Box",
    description: "Pink box",
    price: 10,
    currency: "GBP",
    etsy_url: null,
    images: [
      {
        id: expect.any(Number),
        product_id: product.id,
        url: "image1.jpg",
        is_primary: true,
        sort_order: 1,
      },
    ],
  });
});

//TESTS FOR AUTH ADMIN CRUD FUNCTIONS

//tests toPublicAdmin to return the correct fields to user
test("shows sensible public data", () => {
  const admin = {
    id: 1,
    email: "admin@example.com",
    password: "hashed",
    role: "admin",
    created_at: new Date("2025-01-01"),
    updated_at: new Date("2025-01-02"),
  };

  const publicAdmin = toPublicAdmin(admin);

  expect(publicAdmin).toEqual({
    id: 1,
    email: "admin@example.com",
    role: "admin",
    created_at: new Date("2025-01-01"),
    updated_at: new Date("2025-01-02"),
  });
});

//successful superadmin test to create superadmin
test("allows superadmin to create another superadmin", async () => {
  const currentSuperadmin = { id: 1, email: "superadmin@example.com", role: "superadmin" };

  const created = await createAdmin(currentSuperadmin, {
    email: "superadmin2@example.com",
    password: "password123",
    role: "superadmin",
  });

  expect(created.id).toEqual(expect.any(Number));
  expect(created.email).toBe("superadmin2@example.com");
  expect(created.role).toBe("superadmin");

  const dbAdmin = await prisma.admins.findUnique({
    where: { id: created.id },
  });

  expect(dbAdmin).not.toBeNull();
  expect(dbAdmin.password).not.toBe("password123");
  const matches = await bcrypt.compare("password123", dbAdmin.password);
  expect(matches).toBe(true);
});

//test to show correct error if non-superadmin member tries to create superadmin
test("if non-superadmin tries to create superadmin", async () => {
  const currentAdmin = { id: 1, email: "admin@example.com", role: "admin" };

  await expect(
    createAdmin(currentAdmin, {
      email: "superadmin@example.com",
      password: "password123",
      role: "superadmin",
    })
  ).rejects.toThrow("Only a superadmin can create another superadmin");
});

//listAdmins crud test
test("superadmin sees admins and superadmins, admin sees only admins", async () => {
  const currentSuperadmin = { id: 1, email: "superadmin@example.com", role: "superadmin" };

  const sa1 = await createAdmin(currentSuperadmin, {
    email: "superadmin1@example.com",
    password: "pass",
    role: "superadmin",
  });

  const admin1 = await createAdmin(currentSuperadmin, {
    email: "admin1@example.com",
    password: "pass",
    role: "admin",
  });

  const admin2 = await createAdmin(currentSuperadmin, {
    email: "admin2@example.com",
    password: "pass",
    role: "admin",
  });

  //what superadmin sees
  const superList = await listAdmins({ id: sa1.id, email: sa1.email, role: "superadmin" });

  expect(superList).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ email: "superadmin1@example.com" }),
      expect.objectContaining({ email: "admin1@example.com" }),
      expect.objectContaining({ email: "admin2@example.com" }),
    ])
  );

  //what admins sees
  const adminList = await listAdmins({ id: admin1.id, email: admin1.email, role: "admin" });

  for (const admin of adminList) {
    expect(admin.role).toBe("admin");
  }
});

//getAdminById test function
test("returns admins for superadmin", async () => {
  const currentSuperadmin = { id: 1, email: "superadmin@example.com", role: "superadmin" };

  const adminEmail = uniqueEmail("admin");

  const adminUser = await createAdmin(currentSuperadmin, {
    email: adminEmail,
    password: "pass",
    role: "admin",
  });

  const result = await getAdminById(currentSuperadmin, adminUser.id);

  expect(result).toEqual({
    id: adminUser.id,
    email: adminEmail,
    role: "admin",
    created_at: expect.any(Date),
    updated_at: expect.any(Date),
  });
});

//updateAdmin test updating details for admin
test("can change email and password for an admin", async () => {
  const currentSuperadmin = { id: 1, email: "superadmin@example.com", role: "superadmin" };

  const originalEmail = uniqueEmail("admin");
  const updatedEmail = uniqueEmail("newadmin");

  const adminUser = await createAdmin(currentSuperadmin, {
    email: originalEmail,
    password: "oldpassword",
    role: "admin",
  });

  const updated = await updateAdmin(currentSuperadmin, adminUser.id, {
    email: updatedEmail,
    password: "newpassword",
  });

  expect(updated.email).toBe(updatedEmail);
  expect(updated.role).toBe("admin");

  const dbAdmin = await prisma.admins.findUnique({
    where: { id: adminUser.id },
  });

  const matchesOld = await bcrypt.compare("oldpassword", dbAdmin.password);
  const matchesNew = await bcrypt.compare("newpassword", dbAdmin.password);

  expect(matchesOld).toBe(false);
  expect(matchesNew).toBe(true);
});

//updateAdmin to stop demoting the last superadmin
test("prevents demoting the last superadmin", async () => {
  const currentSuperadmin = { id: 1, email: "superadmin@example.com", role: "superadmin" };

  const superUser = await createAdmin(currentSuperadmin, {
    email: "normaladmin@example.com",
    password: "password",
    role: "superadmin",
  });

  await expect(
    updateAdmin(currentSuperadmin, superUser.id, { role: "admin" })
  ).rejects.toThrow("You cannot demote the last superadmin");
});

//deleteAdmin test to stop deleting superadmin
test(" prevents admin from deleting superadmin", async () => {
  const currentSuperadmin = { id: 1, email: "superadmin@example.com", role: "superadmin" };

  const superEmail = uniqueEmail("sa");
  const adminEmail = uniqueEmail("admin");

  const superUser = await createAdmin(currentSuperadmin, {
    email: superEmail,
    password: "pass",
    role: "superadmin",
  });

  const adminUser = await createAdmin(currentSuperadmin, {
    email: adminEmail,
    password: "pass",
    role: "admin",
  });

  await expect(
    deleteAdmin({ id: adminUser.id, email: adminUser.email, role: "admin" }, superUser.id)
  ).rejects.toThrow("You are not allowed to delete this admin");
});


//deleteAdmin allows superadmin to delete admin account
test(" allows superadmin to delete an admin", async () => {
  const currentSuperadmin = { id: 1, email: "superadmin@example.com", role: "superadmin" };

  const superEmail = uniqueEmail("sa");
  const adminEmail = uniqueEmail("admin");

  // create one superadmin and one admin
  const superUser = await createAdmin(currentSuperadmin, {
    email: superEmail,
    password: "pass",
    role: "superadmin",
  });

  const adminUser = await createAdmin(currentSuperadmin, {
    email: adminEmail,
    password: "pass",
    role: "admin",
  });

  const deleted = await deleteAdmin(
    { id: superUser.id, email: superUser.email, role: "superadmin" },
    adminUser.id
  );

  expect(deleted).toEqual({
    id: adminUser.id,
    email: adminEmail,
    role: "admin",
    created_at: expect.any(Date),
    updated_at: expect.any(Date),
  });

  const dbAdmin = await prisma.admins.findUnique({
    where: { id: adminUser.id },
  });

  expect(dbAdmin).toBeNull();
});


//TESTS FOR AUTH PRODUCT CRUD FUNCTIONS

//superadmin for creating, updating, reading and deleting products
let superadmin;

beforeEach(async () => {
  await prisma.product_images.deleteMany();
  await prisma.products.deleteMany();
  await prisma.admins.deleteMany();

  superadmin = null; // will be set inside each product test
});


//createProduct creates a product
test("creates a product", async () => {
    const dbSuperadmin = await prisma.admins.create({
    data: {
      email: "sa@example.com",
      password: "hashed-password",
      role: "superadmin",
    },
  });

  const superadmin = {
    id: dbSuperadmin.id,
    email: dbSuperadmin.email,
    role: dbSuperadmin.role,
  };

  const productData = {
    title: "Princess Box",
    description: "Pink box",
    short_description: null,
    price: 10,
    currency: "GBP",
    active: true,
    etsy_url: "http://etsy.com/item123",
  };

  const newProduct = await createProduct(superadmin, productData);

  expect(newProduct).toEqual({
    id: expect.any(Number),
    title: "Princess Box",
    description: "Pink box",
    price: 10,
    currency: "GBP",
    active: true,
    etsy_url: "http://etsy.com/item123",
    created_by_admin_id: superadmin.id,
    updated_by_admin_id: superadmin.id,
    created_at: expect.any(Date),
    updated_at: expect.any(Date),
    short_description: null
  });
});

//updateProduct updates a products details
test("updates an existing product", async () => {

    const dbSuperadmin = await prisma.admins.create({
    data: {
      email: "sa@example.com",
      password: "hashed-password",
      role: "superadmin",
    },
  });

  const superadmin = {
    id: dbSuperadmin.id,
    email: dbSuperadmin.email,
    role: dbSuperadmin.role,
  };

  const original = await prisma.products.create({
    data: {
      title: "Jungle Box",
      description: "Green box",
      price: 20,
      currency: "GBP",
      active: true,
      etsy_url: null,
      created_by_admin_id: superadmin.id,
      updated_by_admin_id: superadmin.id,
      short_description: "JBX"
    },
  });

  const updated = await updateProduct(superadmin, original.id, {
    title: "Updated Jungle Box",
    price: 25,
  });

  expect(updated).toEqual({
    id: original.id,
    title: "Updated Jungle Box",
    description: "Green box",
    short_description: "JBX",
    price: 25,
    currency: "GBP",
    active: true,
    etsy_url: null,
    created_by_admin_id: superadmin.id,
    updated_by_admin_id: superadmin.id,
    created_at: expect.any(Date),
    updated_at: expect.any(Date),
  });
});

//deleteProduct deletes a product
test("sets a product to inactive", async () => {

    const dbSuperadmin = await prisma.admins.create({
    data: {
      email: "sa@example.com",
      password: "hashed-password",
      role: "superadmin",
    },
  });

  const superadmin = {
    id: dbSuperadmin.id,
    email: dbSuperadmin.email,
    role: dbSuperadmin.role,
  };

  const product = await prisma.products.create({
    data: {
      title: "Party Box",
      description: "Fun theme box",
      price: 30,
      currency: "GBP",
      active: true,
      etsy_url: null,
      created_by_admin_id: superadmin.id,
      updated_by_admin_id: superadmin.id,
    },
  });

  const deleted = await deleteProduct(superadmin, product.id);

  expect(deleted.active).toBe(false);
  expect(deleted.id).toBe(product.id);
});

//getAdminProducts gets all products and images
test("retrieves all products with images", async () => {
  const dbSuperadmin = await prisma.admins.create({
    data: {
      email: "sa@example.com",
      password: "hashed-password",
      role: "superadmin",
    },
  });

  const superadmin = {
    id: dbSuperadmin.id,
    email: dbSuperadmin.email,
    role: dbSuperadmin.role,
  };

  await prisma.products.createMany({
    data: [
      {
        title: "Box A",
        description: "A",
        price: 1,
        currency: "GBP",
        active: true,
        etsy_url: null,
        created_by_admin_id: superadmin.id,
        updated_by_admin_id: superadmin.id,
      },
      {
        title: "Box B",
        description: "B",
        price: 2,
        currency: "GBP",
        active: false,
        etsy_url: null,
        created_by_admin_id: superadmin.id,
        updated_by_admin_id: superadmin.id,
      },
    ],
  });

  const products = await getAdminProducts(superadmin);

  expect(products).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ title: "Box A" }),
      expect.objectContaining({ title: "Box B" }),
    ])
  );

  expect(products[0]).toEqual(
    expect.objectContaining({
      id: expect.any(Number),
      title: expect.any(String),
      description: expect.any(String),
      price: expect.any(Number),
      currency: "GBP",
      active: expect.any(Boolean),
    })
  );
});


//TESTS FOR AUTH PRODUCT IMAGES CRUD FUNCTIONS

//set up code
let admin;
let product;

beforeEach(async () => {
  await prisma.product_images.deleteMany();
  await prisma.products.deleteMany();
  await prisma.admins.deleteMany();

  admin = await prisma.admins.create({
    data: {
      email: "admin@example.com",
      password: "hashed",
      role: "admin"
    }
  });

  product = await prisma.products.create({
    data: {
      title: "Test Product",
      description: "desc",
      price: 10,
      currency: "GBP",
      active: true,
      created_by_admin_id: admin.id,
      updated_by_admin_id: admin.id
    }
  });
});

//creates image test
test("addProductImage creates a new image", async () => {
  const image = await addProductImage(admin, product.id, {
    url: "img1.jpg",
    alt_text: "first image",
    sort_order: 1,
    is_primary: true
  });

  expect(image).toEqual(
    expect.objectContaining({
      id: expect.any(Number),
      product_id: product.id,
      url: "img1.jpg",
      alt_text: "first image",
      sort_order: 1,
      is_primary: true
    })
  );
});

//updates image test
test("updateProductImage updates an existing image", async () => {
  const image = await prisma.product_images.create({
    data: {
      product_id: product.id,
      url: "old.jpg",
      alt_text: "old",
      sort_order: 1,
      is_primary: false
    }
  });

  const updated = await updateProductImage(admin, product.id, image.id, {
    url: "new.jpg",
    alt_text: "new text",
    sort_order: 5,
    is_primary: true
  });

  expect(updated).toEqual(
    expect.objectContaining({
      id: image.id,
      product_id: product.id,
      url: "new.jpg",
      alt_text: "new text",
      sort_order: 5,
      is_primary: true
    })
  );
});

//deletes image test
test("deleteProductImage deletes an image", async () => {
  const image = await prisma.product_images.create({
    data: {
      product_id: product.id,
      url: "delete-me.jpg",
      alt_text: "bye",
      sort_order: 0,
      is_primary: false
    }
  });

  const deleted = await deleteProductImage(admin, product.id, image.id);

  expect(deleted).toEqual(
    expect.objectContaining({
      id: image.id,
      product_id: product.id,
      url: "delete-me.jpg"
    })
  );

  const check = await prisma.product_images.findUnique({
    where: { id: image.id }
  });

  expect(check).toBeNull();
});