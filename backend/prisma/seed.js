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
*/



main()
.catch((e) => {
    console.error(e)
})
.finally(async () => {
    await prisma.$disconnect()
})
    