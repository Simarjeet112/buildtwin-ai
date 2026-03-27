import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Sidebar from "./Sidebar"
import API from "../services/api"

const pageTitles = {
  "/dashboard": "Dashboard",
  "/ai-debug": "AI Debug Assistant",
  "/ai-learn": "AI Learning Studio",
  "/projects": "Projects",
  "/snippets": "Code Snippets",
  "/bookmarks": "Bookmarks",
  "/tutorials": "Tutorial Recommender",
  "/search": "Search Results",
  "/profile": "My Profile"
}

export default function Layout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const title = pageTitles[location.pathname] || "BuildTwin AI"
  const [user, setUser] = useState(null)
  const [query, setQuery] = useState("")

  useEffect(() => {
    API.get("/users/profile")
      .then(res => setUser(res.data.user))
      .catch(() => {})
  }, [location.pathname])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/search?q=${encodeURIComponent(query)}`)
    setQuery("")
  }

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U"

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f172a" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{
          height: "60px",
          borderBottom: "1px solid #1e293b",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          background: "#0f172a",
          position: "sticky",
          top: 0,
          zIndex: 10,
          gap: "16px"
        }}>
          <h1 style={{ fontSize: "16px", fontWeight: "600", color: "#f1f5f9", margin: 0, whiteSpace: "nowrap" }}>
            {title}
          </h1>

          <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: "400px" }}>
            <input
              style={{ width: "100%", padding: "8px 16px", background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9", fontSize: "13px", boxSizing: "border-box" }}
              placeholder="Search projects, snippets, debug sessions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>

          {/* User info - clickable */}
          <div
            onClick={() => navigate("/profile")}
            style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
          >
            {user && (
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "13px", fontWeight: "600", color: "#f1f5f9", margin: 0 }}>{user.name}</p>
                <p style={{ fontSize: "11px", color: "#64748b", margin: 0 }}>{user.email}</p>
              </div>
            )}
            <div style={{
              width: "34px", height: "34px", borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "13px", fontWeight: "600", color: "white",
              flexShrink: 0
            }}>
              {initials}
            </div>
          </div>
        </header>

        <main style={{ flex: 1, overflowY: "auto", color: "#f1f5f9" }}>
          {children}
        </main>
      </div>
    </div>
  )
}
