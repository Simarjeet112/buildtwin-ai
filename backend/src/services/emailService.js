const { Resend } = require("resend")

const resend = new Resend(process.env.RESEND_API_KEY)

exports.sendOTP = async (email, otp) => {
  await resend.emails.send({
    from: "BuildTwin AI <onboarding@resend.dev>",
    to: email,
    subject: "Your BuildTwin AI Verification Code",
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; background: #0f172a; color: #f1f5f9; padding: 40px; border-radius: 16px;">
        <h1 style="font-size: 20px; font-weight: 700; margin: 16px 0 4px;">BuildTwin AI</h1>
        <p style="font-size: 15px; color: #94a3b8; margin-bottom: 24px;">Your verification code:</p>
        <div style="text-align: center; background: #1e293b; border-radius: 12px; padding: 28px; margin-bottom: 24px;">
          <p style="font-size: 42px; font-weight: 900; letter-spacing: 12px; color: #818cf8; margin: 0;">${otp}</p>
        </div>
        <p style="font-size: 13px; color: #475569;">Expires in 10 minutes.</p>
      </div>
    `
  })
}
