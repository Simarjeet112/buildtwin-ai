import { Link, useLocation, useNavigate } from "react-router-dom"

const icons = {
  Dashboard: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  "AI Debug": (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/>
      <path d="M12 8v4l3 3"/>
    </svg>
  ),
  "AI Learn": (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  Projects: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Snippets: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  Bookmarks: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Tutorials: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
    </svg>
  )
}

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "AI Debug", path: "/ai-debug" },
    { name: "AI Learn", path: "/ai-learn" },
    { name: "Projects", path: "/projects" },
    { name: "Snippets", path: "/snippets" },
    { name: "Bookmarks", path: "/bookmarks" },
    { name: "Tutorials", path: "/tutorials" },
    { name: "Repo Analyzer", path: "/repo-analyzer" }
  ]

  const logout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  return (
    <div style={{
      width: "240px",
      minHeight: "100vh",
      background: "#020617",
      color: "white",
      padding: "24px 16px",
      borderRight: "1px solid #1e293b",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }}>
      {/* Top */}
      <div>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "36px", padding: "0 8px" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px", fontWeight: "bold"
          }}>B</div>
          <span style={{ fontWeight: "700", fontSize: "16px", letterSpacing: "-0.3px" }}>BuildTwin AI</span>
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {menu.map(item => {
            const active = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: active ? "600" : "400",
                  color: active ? "#fff" : "#64748b",
                  background: active ? "#1e293b" : "transparent",
                  transition: "all 0.15s ease"
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = "#cbd5e1" }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = "#64748b" }}
              >
                <span style={{ color: active ? "#6366f1" : "inherit" }}>{icons[item.name]}</span>
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom - Logout */}
      <button
        onClick={logout}
        style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "10px 12px", borderRadius: "8px",
          background: "transparent", border: "none",
          color: "#64748b", fontSize: "14px", cursor: "pointer",
          width: "100%", transition: "all 0.15s ease"
        }}
        onMouseEnter={e => e.currentTarget.style.color = "#f87171"}
        onMouseLeave={e => e.currentTarget.style.color = "#64748b"}
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Logout
      </button>
    </div>
  )
}
