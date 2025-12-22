//sets up prisma client so I can use prisma for the backend

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;