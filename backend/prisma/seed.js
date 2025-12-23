import prisma from "../application/utilities/prisma.js"

async function main() {
    await prisma.products.createMany({
        data: [
            {
                title: "Baby Shark Party Box",
                description: "A Baby Shark themed party box.",
                short_description: "Baby Shark themed party box.",
                price: 200,
                currency: "GBP",
                main_image: "/images/baby-shark/bs3.png",
                
            }
        ]
    })

}