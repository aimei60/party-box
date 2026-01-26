//forgot password send link
import { z } from "zod";
import prisma from '../utilities/prisma.js'
import { makeResetToken, hashResetToken } from "./resetToken.js";

//schema validation
const schema = z.object({email: z.string().email(),});

export async function forgotPassword(req, res) {
    const parsed = schema.safeParse(req.body);//check for email
    if (!parsed.success) {
        return res.status(400).json({ error: "Invalid email" });
    }

    const email = parsed.data.email.toLowerCase();

    const pepper = process.env.RESET_TOKEN_PEPPER;
    const ttlMinutes = Number(process.env.RESET_TOKEN_TTL_MINUTES || "30");
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

    const responseMessage = "If an account exists, we’ve sent a reset link.";

    //find admin
    const admin = await prisma.admins.findUnique({
        where: { email },
        select: { id: true },
    });

    if (!admin) {
        return res.status(200).json({ message: responseMessage });
    }

    if (!pepper) {
        return res.status(500).json({error: "Server misconfiguration: RESET_TOKEN_PEPPER missing"})
    }

    //Create token and store hash in DB
    const rawToken = makeResetToken();
    const tokenHash = hashResetToken(rawToken, pepper);

    await prisma.admins.update({
        where: { id: admin.id },
        data: {
            passwordResetTokenHash: tokenHash,
            passwordResetExpiresAt: expiresAt,
            passwordResetUsedAt: null,
        },
    });

    // print link instead of emailing it: CHANGE LATER
    const resetLink =
        process.env.APP_BASE_URL +
        "/admin/reset-password?token=" +
        rawToken;

    console.log("[ADMIN RESET LINK]", resetLink);

    return res.status(200).json({ message: responseMessage });
}
