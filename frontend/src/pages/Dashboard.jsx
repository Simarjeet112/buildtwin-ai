import { useEffect, useState } from "react"
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts"
import { useNavigate } from "react-router-dom"
import API from "../services/api"

const skillData = [
  { skill: "Web Dev", value: 70 },
  { skill: "Debugging", value: 80 },
  { skill: "DSA", value: 50 },
  { skill: "AI/ML", value: 40 },
  { skill: "DevOps", value: 30 }
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    projects: 0,
    snippets: 0,
    bookmarks: 0,
    debugSessions: 0
  })
  const [recentProjects, setRecentProjects] = useState([])
  const [recentSnippets, setRecentSnippets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [projects, snippets, bookmarks] = await Promise.all([
          API.get("/projects"),
          API.get("/snippets"),
          API.get("/bookmarks")
        ])
        setStats({
          projects: projects.data.length,
          snippets: snippets.data.length,
          bookmarks: bookmarks.data.length,
          debugSessions: 0
        })
        setRecentProjects(projects.data.slice(0, 3))
        setRecentSnippets(snippets.data.slice(0, 3))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const cards = [
    { label: "Projects", value: loading ? "..." : stats.projects, color: "#6366f1", path: "/projects" },
    { label: "Snippets", value: loading ? "..." : stats.snippets, color: "#059669", path: "/snippets" },
    { label: "Bookmarks", value: loading ? "..." : stats.bookmarks, color: "#0ea5e9", path: "/bookmarks" },
    { label: "Learning Efficiency", value: "76%", color: "#f59e0b", path: null },
  ]

  return (
    <div style={{ padding: "32px" }}>
      <p style={{ color: "#64748b", marginBottom: "32px", fontSize: "14px" }}>
        Your development activity at a glance.
      </p>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px", marginBottom: "36px" }}>
        {cards.map(card => (
          <div
            key={card.label}
            onClick={() => card.path && navigate(card.path)}
            style={{
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "12px",
              padding: "20px 22px",
              borderTop: `3px solid ${card.color}`,
              cursor: card.path ? "pointer" : "default",
              transition: "border-color 0.15s"
            }}
            onMouseEnter={e => { if (card.path) e.currentTarget.style.borderColor = card.color }}
            onMouseLeave={e => { if (card.path) e.currentTarget.style.borderColor = "#334155" }}
          >
            <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {card.label}
            </p>
            <p style={{ fontSize: "28px", fontWeight: "700", color: "#f1f5f9" }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
        {/* Recent Projects */}
        <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "13px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Recent Projects</h2>
            <span onClick={() => navigate("/projects")} style={{ fontSize: "12px", color: "#6366f1", cursor: "pointer" }}>View all</span>
          </div>
          {recentProjects.length === 0 ? (
            <p style={{ fontSize: "13px", color: "#64748b" }}>No projects yet.</p>
          ) : recentProjects.map(p => (
            <div
              key={p._id}
              onClick={() => navigate(`/projects/${p._id}`)}
              style={{ padding: "10px 0", borderBottom: "1px solid #334155", cursor: "pointer" }}
            >
              <p style={{ fontSize: "14px", color: "#f1f5f9", fontWeight: "500" }}>{p.name}</p>
              <p style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>{new Date(p.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>

        {/* Recent Snippets */}
        <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "13px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Recent Snippets</h2>
            <span onClick={() => navigate("/snippets")} style={{ fontSize: "12px", color: "#6366f1", cursor: "pointer" }}>View all</span>
          </div>
          {recentSnippets.length === 0 ? (
            <p style={{ fontSize: "13px", color: "#64748b" }}>No snippets yet.</p>
          ) : recentSnippets.map(s => (
            <div key={s._id} style={{ padding: "10px 0", borderBottom: "1px solid #334155" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: "14px", color: "#f1f5f9", fontWeight: "500" }}>{s.title}</p>
                <span style={{ fontSize: "11px", color: "#6366f1", background: "#1e1b4b", padding: "2px 8px", borderRadius: "999px" }}>{s.language}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Radar Chart */}
      <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "24px", maxWidth: "460px" }}>
        <h2 style={{ fontSize: "13px", fontWeight: "600", color: "#94a3b8", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Skill Radar
        </h2>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={skillData}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="skill" tick={{ fill: "#64748b", fontSize: 12 }} />
            <Radar dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
