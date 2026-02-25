import { Resend } from "resend";

let resend = null;

//connects to resend if api key is present
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

//send email for password reset
export async function sendPasswordResetEmail({ to, resetLink }) {

  if (!resend) {
    console.log("[EMAIL DISABLED] Would send reset link:", resetLink); //log reset link for dev
    return;
  }

  let from = process.env.EMAIL_FROM;

  await resend.emails.send({
    from: from,
    to: to,
    subject: "Zogy Studio: Reset your password",
    html: `
      <div>
        <h2>Password reset</h2>
        <p>Click below to reset your password. This link expires soon.</p>
        <p><a href="${resetLink}">Reset password</a></p>
        <p>If you didn’t request this, ignore this email.</p>
      </div>
    `,
  });
}