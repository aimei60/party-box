import {PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    await prisma.admins.create({
        data: {
            email: "superadmin@example.com",
            password: "$2b$12$NDwyntBbV8YZ9gJFVNLpsuza6OiM9WIfrKCUus/YpA5NxeNUk3nzO",
            role: "superadmin"
        }
        })
}

main()
    .then(() => {
        console.log("Entered seed")
    })
    .catch((e) => {
        console.error("Seed Error", e)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
