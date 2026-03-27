import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState("")
  const [err, setErr] = useState("")

  useEffect(() => {
    API.get("/users/profile")
      .then(res => {
        setUser(res.data.user)
        setName(res.data.user.name)
      })
      .catch(() => setErr("Failed to load profile"))
      .finally(() => setLoading(false))
  }, [])

  const updateProfile = async () => {
    if (!name.trim()) return setErr("Name cannot be empty")
    setErr("")
    setSuccess("")
    setSaving(true)
    try {
      const res = await API.put("/users/profile", { name })
      setUser(res.data.user)
      setSuccess("Profile updated successfully!")
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  if (loading) return <div style={{ padding: "32px", color: "#64748b" }}>Loading...</div>

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U"

  return (
    <div style={{ padding: "32px", maxWidth: "600px" }}>
      <p style={{ color: "#64748b", marginBottom: "32px", fontSize: "14px" }}>
        Manage your account information.
      </p>

      {/* Avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "36px" }}>
        <div style={{
          width: "72px", height: "72px", borderRadius: "50%",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "24px", fontWeight: "700", color: "white"
        }}>
          {initials}
        </div>
        <div>
          <p style={{ fontSize: "18px", fontWeight: "700", color: "#f1f5f9" }}>{user?.name}</p>
          <p style={{ fontSize: "13px", color: "#64748b" }}>{user?.email}</p>
          <p style={{ fontSize: "12px", color: "#334155", marginTop: "4px" }}>
            Provider: {user?.provider === "google" ? "Google OAuth" : "Email/Password"}
          </p>
        </div>
      </div>

      {success && (
        <div style={{ background: "#052e16", border: "1px solid #166534", color: "#86efac", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>
          {success}
        </div>
      )}

      {err && (
        <div style={{ background: "#450a0a", border: "1px solid #7f1d1d", color: "#fca5a5", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>
          {err}
        </div>
      )}

      {/* Update form */}
      <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "14px", fontWeight: "600", color: "#94a3b8", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Update Profile
        </h2>

        <div style={{ marginBottom: "14px" }}>
          <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "8px" }}>Name</label>
          <input
            style={{ width: "100%", padding: "12px 16px", background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9", fontSize: "14px", boxSizing: "border-box" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "8px" }}>Email</label>
          <input
            style={{ width: "100%", padding: "12px 16px", background: "#0f172a", border: "1px solid #475569", borderRadius: "8px", color: "#64748b", fontSize: "14px", boxSizing: "border-box" }}
            value={user?.email}
            disabled
          />
          <p style={{ fontSize: "11px", color: "#475569", marginTop: "6px" }}>Email cannot be changed</p>
        </div>

        <button
          onClick={updateProfile}
          disabled={saving}
          style={{ padding: "10px 24px", background: "#6366f1", border: "none", borderRadius: "8px", color: "white", fontSize: "14px", fontWeight: "600", cursor: "pointer", opacity: saving ? 0.6 : 1 }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Danger zone */}
      <div style={{ background: "#1e293b", border: "1px solid #7f1d1d", borderRadius: "12px", padding: "24px" }}>
        <h2 style={{ fontSize: "14px", fontWeight: "600", color: "#f87171", marginBottom: "8px" }}>Danger Zone</h2>
        <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>Sign out of your account.</p>
        <button
          onClick={logout}
          style={{ padding: "10px 24px", background: "transparent", border: "1px solid #7f1d1d", borderRadius: "8px", color: "#f87171", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
        >
          Logout
        </button>
      </div>
    </div>
  )
}
