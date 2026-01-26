//reset password
import bcrypt from "bcrypt";
import { z } from "zod";
import prisma  from '../utilities/prisma.js'
import { hashResetToken } from "./resetToken.js";

//schema validation
const schema = z.object({
    token: z.string().min(10),
    newPassword: z.string().min(8),
});

export async function resetPassword(req, res) {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: "Invalid input"});
    }

    const token = parsed.data.token;
    const newPassword = parsed.data.newPassword;
    const pepper = process.env.RESET_TOKEN_PEPPER;
    const tokenHash = hashResetToken(token, pepper);//hash again before storing

    //get admin with the corresponding token hash
    const admin = await prisma.admins.findFirst({
        where: {
            passwordResetTokenHash: tokenHash,
        },
        select: {
            id: true,
            passwordResetExpiresAt: true,
            passwordResetUsedAt: true,
        },
    });

    if (!admin) {
        return res.status(400).json({ error: "Invalid or expired token" });
    }

    if (!pepper) {
        return res.status(500).json({ error: "RESET_TOKEN_PEPPER missing" });
    }

    const now = new Date();

    if (!admin.passwordResetExpiresAt) {
        return res.status(400).json({ error: "Invalid or expired token" });
    }

    if (now > admin.passwordResetExpiresAt) {
        return res.status(400).json({ error: "Invalid or expired token" });
    }

    if (admin.passwordResetUsedAt) {
        return res.status(400).json({ error: "Token already used" });
    }

    //Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    //save new password and remove reset token
    await prisma.admins.update({
        where: { id: admin.id },
        data: {
            password: passwordHash,
            passwordResetTokenHash: null,
            passwordResetExpiresAt: null,
            passwordResetUsedAt: now,
            mustChangePassword: false,
        },
    });

    return res.status(200).json({ message: "Password reset successful." });
}
