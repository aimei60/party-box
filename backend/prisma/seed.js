import {PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// adding superadmin
/*async function main() {
    await prisma.admins.create({
        data: {
            email: "superadmin@example.com",
            password: "$2b$12$NDwyntBbV8YZ9gJFVNLpsuza6OiM9WIfrKCUus/YpA5NxeNUk3nzO",
            role: "superadmin"
        }
        })
}

// added sample products and product images
async function product() {
    const princessBox = await prisma.products.create({
        data: {
        title: "Princess Party Box",
        description: "Pink Princess Party Box",
        price: 200,
        currency: "GBP",
        active: true,
        etsy_url: "https://etsy.com/listing/123",
        created_by_admin_id: 1,
        updated_by_admin_id: 1
        }
    })

    const jungleBox = await prisma.products.create({
        data: {
        title: "Jungle Party Box",
        description: "Jungle Animal themed Party Box",
        price: 200,
        currency: "GBP",
        active: true,
        etsy_url: "https://etsy.com/listing/567",
        created_by_admin_id: 1,
        updated_by_admin_id: 1
        }
    })

    const oceanBox = await prisma.products.create({
        data: {
        title: "Ocean Party Box",
        description: "Ocean themed Party Box",
        price: 200,
        currency: "GBP",
        active: true,
        etsy_url: "https://etsy.com/listing/165",
        created_by_admin_id: 1,
        updated_by_admin_id: 1
        }
    })

    await prisma.product_images.createMany({
        data: [
        {
            product_id: princessBox.id,
            url: "https://example.com/images/princess.jpg",
            alt_text: "Princess Party Box - main image",
            sort_order: 0,
            is_primary: true
        },
        {
            product_id: princessBox.id,
            url: "https://example.com/images/princess.jpg",
            alt_text: "Princess Party Box close-up",
            sort_order: 1,
            is_primary: false
        },

        {
            product_id: jungleBox.id,
            url: "https://example.com/images/jungle.jpg",
            alt_text: "Jungle Party Box - main image",
            sort_order: 0,
            is_primary: true
        },
        {
            product_id: jungleBox.id,
            url: "https://example.com/images/jungle.jpg",
            alt_text: "Jungle Party Box setup",
            sort_order: 1,
            is_primary: false
        },

        {
            product_id: oceanBox.id,
            url: "https://example.com/images/ocean.jpg",
            alt_text: "Ocean Party Box - main image",
            sort_order: 0,
            is_primary: true
        },
        {
            product_id: oceanBox.id,
            url: "https://example.com/images/ocean.jpg",
            alt_text: "Ocean Party Box",
            sort_order: 1,
            is_primary: false
        }
    ]
  })
}


product()
    .then(() => {
        console.log("Entered seed")
    })
    .catch((e) => {
        console.error("Seed Error", e)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
*/