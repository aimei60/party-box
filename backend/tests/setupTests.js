//clears test db before every test and disconnects prisma after all tests
import prisma from "../application/utilities/prisma.js";

beforeEach(async () => {
  await prisma.product_images.deleteMany();
  await prisma.products.deleteMany();
  await prisma.admins.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
