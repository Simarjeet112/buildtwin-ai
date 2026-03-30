import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import API from "../services/api"

export default function Signup() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState("")

  const signup = async () => {
    if (!name || !email || !password) return setErr("Please fill in all fields")
    setErr("")
    setLoading(true)
    try {
      await API.post("/auth/signup", { name, email, password })
      navigate("/verify-otp", { state: { email } })
    } catch (e) {
      setErr(e.response?.data?.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  const signupWithGoogle = () => {
    window.location.href = "https://buildtwin-ai.onrender.com/api/v1/auth/google"
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#030712",
      display: "flex",
      fontFamily: "'Inter', -apple-system, sans-serif",
      overflow: "hidden"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        @keyframes float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-12px)} }
        @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
        .float { animation: float 6s ease-in-out infinite; }
        .float2 { animation: float 8s ease-in-out infinite; animation-delay: -3s; }
        .pulse { animation: pulse 4s ease-in-out infinite; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 0 30px rgba(99,102,241,0.5) !important; }
        .btn-primary { transition: all 0.2s ease !important; }
        .google-btn:hover { background: rgba(255,255,255,0.06) !important; border-color: rgba(255,255,255,0.15) !important; }
        .google-btn { transition: all 0.2s ease !important; }
        .input-field:focus { border-color: rgba(129,140,248,0.6) !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12) !important; }
      `}</style>

      {/* LEFT PANEL */}
      <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "64px", overflow: "hidden", background: "linear-gradient(135deg, #0a0520 0%, #0d0b2e 40%, #0a1628 100%)" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 20% 40%, rgba(99,102,241,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(139,92,246,0.1) 0%, transparent 50%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="float" style={{ position: "absolute", top: "15%", right: "20%", width: "180px", height: "180px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)", filter: "blur(20px)" }} />
        <div className="float2" style={{ position: "absolute", bottom: "20%", left: "10%", width: "220px", height: "220px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)", filter: "blur(25px)" }} />

        {/* Floating cards */}
        <div className="float" style={{ position: "absolute", top: "12%", right: "8%", background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "14px 18px", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #f59e0b, #ef4444)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          <div>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: 0 }}>AI Generated</p>
            <p style={{ fontSize: "13px", color: "white", fontWeight: "600", margin: 0 }}>Learning Plan</p>
          </div>
        </div>

        <div className="float2" style={{ position: "absolute", bottom: "18%", right: "12%", background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "14px 18px", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          </div>
          <div>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: 0 }}>Saved Snippet</p>
            <p style={{ fontSize: "13px", color: "white", fontWeight: "600", margin: 0 }}>useDebounce Hook</p>
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "56px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "16px", color: "white", boxShadow: "0 0 20px rgba(99,102,241,0.4)" }}>B</div>
            <span style={{ color: "white", fontWeight: "700", fontSize: "16px" }}>BuildTwin AI</span>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#818cf8", textTransform: "uppercase", letterSpacing: "0.1em", background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)", padding: "4px 12px", borderRadius: "999px" }}>Free Forever</span>
          </div>

          <h1 style={{ fontSize: "52px", fontWeight: "900", color: "white", lineHeight: 1.1, marginBottom: "20px", letterSpacing: "-2px" }}>
            Start building.<br />
            <span style={{ background: "linear-gradient(90deg, #818cf8 0%, #c084fc 50%, #67e8f9 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Start learning.</span>
          </h1>

          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: "400px", marginBottom: "48px" }}>
            Join developers using AI to level up their skills. No credit card required.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[{ icon: "🆓", text: "Free forever — no credit card needed" }, { icon: "🤖", text: "AI debug sessions saved to projects" }, { icon: "⭐", text: "Community tutorial ratings" }].map(f => (
              <div key={f.text} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "16px" }}>{f.icon}</span>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)" }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ width: "520px", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 56px", background: "rgba(255,255,255,0.015)", backdropFilter: "blur(40px)", borderLeft: "1px solid rgba(255,255,255,0.06)", position: "relative" }}>
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)", filter: "blur(30px)", pointerEvents: "none" }} />

        <div style={{ width: "100%", position: "relative" }}>
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#f8fafc", marginBottom: "8px", letterSpacing: "-0.8px" }}>Create account</h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)" }}>We'll send a verification code to your email</p>
          </div>

          {err && (
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5", padding: "12px 16px", borderRadius: "12px", marginBottom: "20px", fontSize: "13px" }}>
              ⚠️ {err}
            </div>
          )}

          {[
            { label: "Full name", placeholder: "John Doe", value: name, set: setName, type: "text" },
            { label: "Email address", placeholder: "you@example.com", value: email, set: setEmail, type: "email" },
            { label: "Password", placeholder: "Min. 6 characters", value: password, set: setPassword, type: "password" }
          ].map((field, i) => (
            <div key={field.label} style={{ marginBottom: i === 2 ? "28px" : "16px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "rgba(255,255,255,0.4)", marginBottom: "8px" }}>{field.label}</label>
              <input
                className="input-field"
                type={field.type}
                style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", color: "#f1f5f9", fontSize: "14px", boxSizing: "border-box", outline: "none", transition: "all 0.2s" }}
                placeholder={field.placeholder}
                value={field.value}
                onChange={(e) => field.set(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && signup()}
              />
            </div>
          ))}

          <button className="btn-primary" onClick={signup} disabled={loading} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", borderRadius: "12px", color: "white", fontSize: "14px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginBottom: "16px", boxShadow: "0 0 20px rgba(99,102,241,0.3)" }}>
            {loading ? "Sending OTP..." : "Continue →"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)" }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
          </div>

          <button className="google-btn" onClick={signupWithGoogle} style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", color: "rgba(255,255,255,0.7)", fontSize: "14px", fontWeight: "500", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p style={{ textAlign: "center", marginTop: "28px", fontSize: "13px", color: "rgba(255,255,255,0.25)" }}>
            Already have an account?{" "}
            <Link to="/" style={{ color: "#818cf8", textDecoration: "none", fontWeight: "600" }}>Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
