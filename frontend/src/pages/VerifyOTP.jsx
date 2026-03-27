import { useState, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import API from "../services/api"

export default function VerifyOTP() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ""
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [err, setErr] = useState("")
  const [success, setSuccess] = useState("")
  const inputs = useRef([])

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const newOtp = [...otp]
    newOtp[i] = val
    setOtp(newOtp)
    if (val && i < 5) inputs.current[i + 1]?.focus()
    if (!val && i > 0) inputs.current[i - 1]?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputs.current[i - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (pasted.length === 6) {
      setOtp(pasted.split(""))
      inputs.current[5]?.focus()
    }
  }

  const verify = async () => {
    const code = otp.join("")
    if (code.length !== 6) return setErr("Please enter the 6-digit OTP")
    setErr("")
    setLoading(true)
    try {
      const res = await API.post("/auth/verify-otp", { email, otp: code })
      localStorage.setItem("token", res.data.token)
      navigate("/dashboard")
    } catch (e) {
      setErr(e.response?.data?.message || "Invalid OTP")
    } finally {
      setLoading(false)
    }
  }

  const resend = async () => {
    setResending(true)
    setErr("")
    setSuccess("")
    try {
      await API.post("/auth/resend-otp", { email })
      setSuccess("New OTP sent to your email!")
      setOtp(["", "", "", "", "", ""])
      inputs.current[0]?.focus()
    } catch (e) {
      setErr("Failed to resend OTP")
    } finally {
      setResending(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#030712",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', -apple-system, sans-serif",
      padding: "20px"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
        .float { animation: float 6s ease-in-out infinite; }
        .otp-input:focus { border-color: rgba(129,140,248,0.8) !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.15) !important; background: rgba(99,102,241,0.08) !important; }
        .btn-verify:hover { transform: translateY(-1px); box-shadow: 0 0 30px rgba(99,102,241,0.5) !important; }
        .btn-verify { transition: all 0.2s ease !important; }
      `}</style>

      {/* Background effects */}
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(99,102,241,0.1) 0%, transparent 60%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: "440px", position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "8px 16px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "14px", color: "white" }}>B</div>
            <span style={{ color: "white", fontWeight: "700", fontSize: "15px" }}>BuildTwin AI</span>
          </div>
        </div>

        {/* Card */}
        <div style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(40px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "40px", textAlign: "center" }}>
          {/* Email icon */}
          <div className="float" style={{ width: "64px", height: "64px", borderRadius: "16px", background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))", border: "1px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <svg width="28" height="28" fill="none" stroke="#818cf8" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>

          <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#f8fafc", marginBottom: "8px", letterSpacing: "-0.5px" }}>Check your email</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", marginBottom: "8px" }}>We sent a 6-digit code to</p>
          <p style={{ fontSize: "14px", fontWeight: "600", color: "#818cf8", marginBottom: "32px" }}>{email || "your email"}</p>

          {err && (
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5", padding: "12px 16px", borderRadius: "10px", marginBottom: "20px", fontSize: "13px" }}>
              {err}
            </div>
          )}
          {success && (
            <div style={{ background: "rgba(5,150,105,0.08)", border: "1px solid rgba(5,150,105,0.2)", color: "#6ee7b7", padding: "12px 16px", borderRadius: "10px", marginBottom: "20px", fontSize: "13px" }}>
              {success}
            </div>
          )}

          {/* OTP Inputs */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "28px" }} onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                className="otp-input"
                ref={el => inputs.current[i] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                style={{
                  width: "52px", height: "56px", textAlign: "center", fontSize: "22px", fontWeight: "700",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px", color: "#f1f5f9", outline: "none", transition: "all 0.2s",
                  caretColor: "#818cf8"
                }}
              />
            ))}
          </div>

          <button
            className="btn-verify"
            onClick={verify}
            disabled={loading}
            style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", borderRadius: "12px", color: "white", fontSize: "14px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginBottom: "16px", boxShadow: "0 0 20px rgba(99,102,241,0.3)" }}
          >
            {loading ? "Verifying..." : "Verify Email →"}
          </button>

          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>
            Didn't receive it?{" "}
            <button
              onClick={resend}
              disabled={resending}
              style={{ background: "none", border: "none", color: "#818cf8", fontWeight: "600", cursor: "pointer", fontSize: "13px", padding: 0 }}
            >
              {resending ? "Sending..." : "Resend OTP"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
