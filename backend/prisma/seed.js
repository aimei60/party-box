import prisma from "../application/utilities/prisma.js"

/*async function main() {
    await prisma.products.createMany({
        data: [
            {
                title: "Baby Shark Party Box",
                description: {
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
                        {   heading: "How to Order",
                            body: "Visit our Etsy Store to place your order." },
                        {
                            body: "If you have any questions or need assistance, don’t hesitate to contact us.",
                        },
                    ],
                },
                short_description: "Baby Shark themed party box.",
                price: 200,
                currency: "GBP",
                active: true,
            },
            {
                title: "Peppa Pig Party Box",
                description: {
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
                        {   heading: "How to Order",
                            body: "Visit our Etsy Store to place your order." },
                        {
                            body: "If you have any questions or need assistance, don’t hesitate to contact us.",
                        },
                    ],
                },
                short_description: "Peppa Pig party fun themed box.",
                price: 200,
                currency: "GBP",
                active: true,
            },
            {
                title: "Bluey Party Box",
                description: {
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
                        {   heading: "How to Order",
                            body: "Visit our Etsy Store to place your order." },
                        {
                            body: "If you have any questions or need assistance, don’t hesitate to contact us.",
                        },
                    ],
                },
                short_description: "Bluey themed party box",
                price: 200,
                currency: "GBP",
                active: true,
            },
        ]
    });
}


async function main() {
    const baby = await prisma.products.findFirst({
        where: {
            title: "Baby Shark Party Box"
        }
    })
    
    if (!baby) {
        throw new Error("One or more products not found. Check your titles match exactly.")
    }
    
    await prisma.product_images.createMany({
        data: [
            { 
                product_id: baby.id, 
                url: "/images/baby-shark/bs1.png", 
                alt_text: "Baby Shark Party Box - front", 
                sort_order: 1, 
                is_primary: true 
            },
            { 
                product_id: baby.id, 
                url: "/images/baby-shark/bs2.png", 
                alt_text: "Baby Shark Party Box - side",  
                sort_order: 2, 
                is_primary: false 
            },
            { 
                product_id: baby.id, 
                url: "/images/baby-shark/bs3.png", 
                alt_text: "Baby Shark Party Box - front with hand",
                sort_order: 3, 
                is_primary: false 
            },
        ]
    })
}
    

async function main() {
    const peppa = await prisma.products.findFirst({
        where: {
            title: "Peppa Pig Party Box"
        }

        })

    if (!peppa) {
        throw new Error("One or more products not found. Check your titles match exactly.")
    }

    await prisma.product_images.createMany({
        data: [
            { 
                product_id: peppa.id, 
                url: "/images/peppa-pig/p1.png", 
                alt_text: "Peppa Pig Party Box - front", 
                sort_order: 1, 
                is_primary: true 
            },
            { 
                product_id: peppa.id, 
                url: "/images/peppa-pig/p3.png", 
                alt_text: "Peppa Pig Party Box - side", 
                sort_order: 2, 
                is_primary: false
            },
            { 
                product_id: peppa.id, 
                url: "/images/peppa-pig/p2.png", 
                alt_text: "Peppa Pig Party Box - another front angle", 
                sort_order: 3, 
                is_primary: false
            },
        ]
    })
    

}



async function main() {
    const bluey = await prisma.products.findFirst({
        where: {
            title: "Bluey Party Box"
        }
    })

    if (!bluey) {
        throw new Error("One or more products not found. Check your titles match exactly.")
    }

    await prisma.product_images.createMany({
        data: [
            { 
                product_id: bluey.id, 
                url: "/images/bluey/bluey1.png", 
                alt_text: "Bluey Party Box - front with hand", 
                sort_order: 1, 
                is_primary: true 
            },
            { 
                product_id: bluey.id, 
                url: "/images/bluey/bluey3.png", 
                alt_text: "Bluey Party Box - side", 
                sort_order: 2, 
                is_primary: false
            },
            { 
                product_id: bluey.id, 
                url: "//images/bluey/bluey2.png", 
                alt_text: "Blury Party Box - another front angle", 
                sort_order: 3, 
                is_primary: false
            },
        ]
    })
}

main()
.catch((e) => {
    console.error(e)
})
.finally(async () => {
    await prisma.$disconnect()
})
    */