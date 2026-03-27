import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import API from "../services/api"

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, sessionsRes] = await Promise.all([
          API.get(`/projects/${id}`),
          API.get(`/ai/project/${id}`)
        ])
        setProject(projectRes.data)
        setSessions(sessionsRes.data.sessions || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) return <div style={{ padding: "32px", color: "#64748b" }}>Loading...</div>

  return (
    <div style={{ padding: "32px", maxWidth: "900px" }}>
      <button
        onClick={() => navigate("/projects")}
        style={{ background: "transparent", border: "none", color: "#6366f1", fontSize: "14px", cursor: "pointer", marginBottom: "20px", display: "flex", alignItems: "center", gap: "6px" }}
      >
        ← Back to Projects
      </button>

      <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#f1f5f9", marginBottom: "4px" }}>
        {project?.name}
      </h2>
      <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "32px" }}>
        {sessions.length} debug session{sessions.length !== 1 ? "s" : ""}
      </p>

      {sessions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px", background: "#1e293b", borderRadius: "12px", color: "#64748b" }}>
          <p style={{ fontSize: "15px" }}>No debug sessions yet for this project.</p>
          <p style={{ fontSize: "13px", marginTop: "8px" }}>Go to AI Debug and your sessions will appear here.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {sessions.map(s => (
            <div key={s._id} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "10px", overflow: "hidden" }}>
              <div
                onClick={() => setExpanded(expanded === s._id ? null : s._id)}
                style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
              >
                <div>
                  <p style={{ fontWeight: "600", fontSize: "14px", color: "#f1f5f9" }}>
                    {s.errorMessage || "No error message"}
                  </p>
                  <p style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                    {s.language} · {new Date(s.createdAt).toLocaleString()}
                  </p>
                </div>
                <span style={{ color: "#64748b", fontSize: "18px" }}>
                  {expanded === s._id ? "▲" : "▼"}
                </span>
              </div>

              {expanded === s._id && (
                <div style={{ borderTop: "1px solid #334155", padding: "16px 20px" }}>
                  <div style={{ marginBottom: "16px" }}>
                    <p style={{ fontSize: "12px", color: "#6366f1", marginBottom: "8px", fontWeight: "600" }}>CODE</p>
                    <pre style={{ background: "#0f172a", padding: "12px", borderRadius: "8px", fontSize: "13px", color: "#94a3b8", overflowX: "auto", fontFamily: "monospace" }}>
                      {s.code}
                    </pre>
                  </div>
                  {s.aiAnalysis?.explanation && (
                    <div>
                      <p style={{ fontSize: "12px", color: "#6366f1", marginBottom: "8px", fontWeight: "600" }}>AI ANALYSIS</p>
                      <p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: "1.7", whiteSpace: "pre-wrap" }}>
                        {s.aiAnalysis.explanation}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
