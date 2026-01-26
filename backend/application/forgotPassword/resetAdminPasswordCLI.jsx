//cli password recovery
import bcrypt from "bcrypt";
import prisma from "../utilities/prisma.js";

function getArg(name) {
    const idx = process.argv.indexOf("--" + name); //looks for email
    if (idx === -1) {
        return null;
    }
    return process.argv[idx + 1]; //extracts email
}

const email = getArg("email");
const password = getArg("password");

if (!email || !password) {
    console.error('Usage: node scripts/resetAdminPassword.js --email you@example.com --password "NewStrongPasswordHere"');
    process.exit(1);// 1= program failed
}

if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
}

async function run() {
    const passwordHash = await bcrypt.hash(password, 12);

    const updated = await prisma.admins.updateMany({
        where: { email: email.toLowerCase() },
        data: {
            passwordHash,
            mustChangePassword: true,
            passwordResetTokenHash: null,
            passwordResetExpiresAt: null,
            passwordResetUsedAt: null,
        },
    });

    if (updated.count === 0) {
        console.error("Admin not found.");
        process.exit(1);
    }

    console.log("Password updated for:", email.toLowerCase());
    process.exit(0);//0 = finished succesfully
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
