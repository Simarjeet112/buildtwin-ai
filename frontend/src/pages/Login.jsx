import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import API from "../services/api"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState("")
  const [focused, setFocused] = useState("")

  const login = async () => {
    if (!email || !password) return setErr("Please fill in all fields")
    setErr("")
    setLoading(true)
    try {
      const res = await API.post("/auth/login", { email, password })
      localStorage.setItem("token", res.data.token)
      navigate("/dashboard")
    } catch (e) {
      setErr(e.response?.data?.message || "Invalid credentials")
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = () => {
    window.location.href = "http://localhost:5000/api/v1/auth/google"
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
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .float { animation: float 6s ease-in-out infinite; }
        .float2 { animation: float 8s ease-in-out infinite; animation-delay: -3s; }
        .pulse { animation: pulse 4s ease-in-out infinite; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 0 30px rgba(99,102,241,0.5) !important; }
        .btn-primary { transition: all 0.2s ease !important; }
        .google-btn:hover { background: rgba(255,255,255,0.06) !important; border-color: rgba(255,255,255,0.15) !important; }
        .google-btn { transition: all 0.2s ease !important; }
        .input-field:focus { border-color: rgba(129,140,248,0.6) !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12), inset 0 1px 0 rgba(255,255,255,0.04) !important; }
      `}</style>

      {/* LEFT PANEL */}
      <div style={{
        flex: 1,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "64px",
        overflow: "hidden",
        background: "linear-gradient(135deg, #0a0520 0%, #0d0b2e 40%, #0a1628 100%)"
      }}>
        {/* Mesh gradient background */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 20% 40%, rgba(99,102,241,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(139,92,246,0.1) 0%, transparent 50%), radial-gradient(ellipse 40% 40% at 60% 10%, rgba(59,130,246,0.08) 0%, transparent 50%)" }} />
        
        {/* Grid pattern */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        {/* Floating orbs */}
        <div className="float" style={{ position: "absolute", top: "15%", right: "20%", width: "180px", height: "180px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)", filter: "blur(20px)" }} />
        <div className="float2" style={{ position: "absolute", bottom: "20%", left: "10%", width: "220px", height: "220px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)", filter: "blur(25px)" }} />
        <div className="pulse" style={{ position: "absolute", top: "50%", right: "5%", width: "120px", height: "120px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)", filter: "blur(15px)" }} />

        {/* Floating UI cards */}
        <div className="float" style={{ position: "absolute", top: "12%", right: "8%", background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "14px 18px", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          </div>
          <div>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: 0 }}>Bug Fixed</p>
            <p style={{ fontSize: "13px", color: "white", fontWeight: "600", margin: 0 }}>NullPointerException</p>
          </div>
        </div>

        <div className="float2" style={{ position: "absolute", bottom: "18%", right: "12%", background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "14px 18px", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #059669, #10b981)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: 0 }}>Concept Learned</p>
            <p style={{ fontSize: "13px", color: "white", fontWeight: "600", margin: 0 }}>React Hooks</p>
          </div>
        </div>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Logo */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "56px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "16px", color: "white", boxShadow: "0 0 20px rgba(99,102,241,0.4)" }}>B</div>
            <span style={{ color: "white", fontWeight: "700", fontSize: "16px", letterSpacing: "-0.3px" }}>BuildTwin AI</span>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#818cf8", textTransform: "uppercase", letterSpacing: "0.1em", background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)", padding: "4px 12px", borderRadius: "999px" }}>
              AI Developer Platform
            </span>
          </div>

          <h1 style={{ fontSize: "52px", fontWeight: "900", color: "white", lineHeight: 1.1, marginBottom: "20px", letterSpacing: "-2px" }}>
            Debug smarter.<br />
            <span style={{ background: "linear-gradient(90deg, #818cf8 0%, #c084fc 50%, #67e8f9 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Learn faster.
            </span>
          </h1>

          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: "400px", marginBottom: "48px" }}>
            The AI-powered workspace for developers. Fix bugs instantly, master concepts, ship better code.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { icon: "🔍", text: "AI-powered code debugging" },
              { icon: "📚", text: "Personalized learning studio" },
              { icon: "⚡", text: "Smart snippet manager" }
            ].map(f => (
              <div key={f.text} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "16px" }}>{f.icon}</span>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", fontWeight: "400" }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{
        width: "520px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 56px",
        background: "rgba(255,255,255,0.015)",
        backdropFilter: "blur(40px)",
        borderLeft: "1px solid rgba(255,255,255,0.06)",
        position: "relative"
      }}>
        {/* Subtle glow behind form */}
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)", filter: "blur(30px)", pointerEvents: "none" }} />

        <div style={{ width: "100%", position: "relative" }}>
          <div style={{ marginBottom: "36px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#f8fafc", marginBottom: "8px", letterSpacing: "-0.8px" }}>Welcome back</h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", fontWeight: "400" }}>Sign in to continue to BuildTwin AI</p>
          </div>

          {err && (
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5", padding: "12px 16px", borderRadius: "12px", marginBottom: "20px", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>⚠️</span> {err}
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "rgba(255,255,255,0.4)", marginBottom: "8px", letterSpacing: "0.02em" }}>Email address</label>
            <input
              className="input-field"
              style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", color: "#f1f5f9", fontSize: "14px", boxSizing: "border-box", outline: "none", transition: "all 0.2s" }}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "28px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "rgba(255,255,255,0.4)", marginBottom: "8px", letterSpacing: "0.02em" }}>Password</label>
            <input
              className="input-field"
              type="password"
              style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", color: "#f1f5f9", fontSize: "14px", boxSizing: "border-box", outline: "none", transition: "all 0.2s" }}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
            />
          </div>

          {/* Sign In Button */}
          <button
            className="btn-primary"
            onClick={login}
            disabled={loading}
            style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", border: "none", borderRadius: "12px", color: "white", fontSize: "14px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginBottom: "16px", letterSpacing: "0.01em", boxShadow: "0 0 20px rgba(99,102,241,0.3)" }}
          >
            {loading ? "Signing in..." : "Sign in →"}
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", fontWeight: "500" }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
          </div>

          {/* Google Button */}
          <button
            className="google-btn"
            onClick={loginWithGoogle}
            style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", color: "rgba(255,255,255,0.7)", fontSize: "14px", fontWeight: "500", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p style={{ textAlign: "center", marginTop: "28px", fontSize: "13px", color: "rgba(255,255,255,0.25)" }}>
            No account?{" "}
            <Link to="/signup" style={{ color: "#818cf8", textDecoration: "none", fontWeight: "600" }}>Create one free →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
