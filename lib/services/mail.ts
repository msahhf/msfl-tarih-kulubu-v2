import sgMail from "@sendgrid/mail";

const FROM_EMAIL = process.env.SENDGRID_FROM || "msfltarihkulubu@outlook.com";
const FROM_NAME = "MSFL Tarih Kulübü";

function ensureApiKey() {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error("SENDGRID_API_KEY environment variable is not defined");
  }
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function sendMail(to: string, subject: string, html: string): Promise<boolean> {
  try {
    ensureApiKey();
    await sgMail.send({
      to,
      from: { name: FROM_NAME, email: FROM_EMAIL },
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error("Mail gönderilemedi:", error);
    return false;
  }
}

export async function sendPasswordResetEmail(to: string, resetLink: string): Promise<boolean> {
  const html = `
    <h2>Şifre Sıfırlama Talebi</h2>
    <p>Hesabınız için şifre sıfırlama bağlantısı:</p>
    <p><a href="${resetLink}">Şifremi Sıfırla</a></p>
    <p>Bu link 1 saat geçerlidir.</p>
    <p>Bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
  `;

  return sendMail(to, "Şifre Sıfırlama", html);
}
