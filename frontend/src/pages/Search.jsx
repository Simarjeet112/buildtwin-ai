import { useEffect, useState } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import API from "../services/api"

export default function Search() {
  const location = useLocation()
  const navigate = useNavigate()
  const query = new URLSearchParams(location.search).get("q") || ""
  const [results, setResults] = useState({ projects: [], snippets: [], debugSessions: [] })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query) return
    setLoading(true)
    API.get(`/search?q=${encodeURIComponent(query)}`)
      .then(res => setResults(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [query])

  const total = results.projects.length + results.snippets.length + results.debugSessions.length

  return (
    <div style={{ padding: "32px", maxWidth: "900px" }}>
      <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "28px" }}>
        {loading ? "Searching..." : `${total} result${total !== 1 ? "s" : ""} for "${query}"`}
      </p>

      {/* Projects */}
      {results.projects.length > 0 && (
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "13px", fontWeight: "600", color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
            Projects ({results.projects.length})
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {results.projects.map(p => (
              <div
                key={p._id}
                onClick={() => navigate(`/projects/${p._id}`)}
                style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "14px 18px", cursor: "pointer" }}
              >
                <p style={{ fontWeight: "600", fontSize: "14px", color: "#f1f5f9" }}>{p.name}</p>
                <p style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                  Created {new Date(p.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Snippets */}
      {results.snippets.length > 0 && (
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "13px", fontWeight: "600", color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
            Snippets ({results.snippets.length})
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {results.snippets.map(s => (
              <div key={s._id} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", overflow: "hidden" }}>
                <div style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between" }}>
                  <p style={{ fontWeight: "600", fontSize: "14px", color: "#f1f5f9" }}>{s.title}</p>
                  <span style={{ fontSize: "11px", color: "#6366f1", background: "#1e1b4b", padding: "3px 10px", borderRadius: "999px" }}>{s.language}</span>
                </div>
                <pre style={{ padding: "0 18px 14px", margin: 0, fontSize: "13px", color: "#94a3b8", fontFamily: "monospace", overflowX: "auto" }}>
                  {s.code?.slice(0, 100)}{s.code?.length > 100 ? "..." : ""}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Debug Sessions */}
      {results.debugSessions.length > 0 && (
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "13px", fontWeight: "600", color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
            Debug Sessions ({results.debugSessions.length})
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {results.debugSessions.map(d => (
              <div key={d._id} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "14px 18px" }}>
                <p style={{ fontWeight: "600", fontSize: "14px", color: "#f1f5f9" }}>{d.errorMessage || "No error message"}</p>
                <p style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                  {d.language} · {new Date(d.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && total === 0 && (
        <div style={{ textAlign: "center", padding: "48px", background: "#1e293b", borderRadius: "12px", color: "#64748b" }}>
          <p style={{ fontSize: "15px" }}>No results found for "{query}"</p>
        </div>
      )}
    </div>
  )
}
