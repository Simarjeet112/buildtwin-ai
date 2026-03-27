import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [err, setErr] = useState("")
  const navigate = useNavigate()

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects")
      setProjects(res.data)
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to load projects.")
    } finally {
      setLoading(false)
    }
  }

  const createProject = async () => {
    if (!name.trim()) return
    setCreating(true)
    try {
      await API.post("/projects", { name })
      setName("")
      fetchProjects()
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to create project.")
    } finally {
      setCreating(false)
    }
  }

  const deleteProject = async (e, id) => {
    e.stopPropagation()
    if (!window.confirm("Delete this project?")) return
    try {
      await API.delete(`/projects/${id}`)
      setProjects(prev => prev.filter(p => p._id !== id))
    } catch (e) {
      setErr("Failed to delete project.")
    }
  }

  useEffect(() => { fetchProjects() }, [])

  return (
    <div style={{ padding: "32px", maxWidth: "800px" }}>
      <p style={{ color: "#64748b", marginBottom: "28px", fontSize: "14px" }}>
        Manage your projects and view AI debug history for each one.
      </p>

      {err && (
        <div style={{ background: "#450a0a", border: "1px solid #7f1d1d", color: "#fca5a5", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>
          {err}
        </div>
      )}

      <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
        <input
          style={{ flex: 1, padding: "12px 16px", background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9", fontSize: "14px" }}
          placeholder="Project name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createProject()}
        />
        <button
          onClick={createProject}
          disabled={creating}
          style={{ padding: "12px 24px", background: "#6366f1", border: "none", borderRadius: "8px", color: "white", fontSize: "14px", fontWeight: "600", cursor: "pointer", opacity: creating ? 0.6 : 1 }}
        >
          {creating ? "Creating..." : "Create"}
        </button>
      </div>

      {loading ? (
        <p style={{ color: "#64748b", fontSize: "14px" }}>Loading projects...</p>
      ) : projects.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px", background: "#1e293b", borderRadius: "12px", color: "#64748b" }}>
          <p style={{ fontSize: "15px" }}>No projects yet.</p>
          <p style={{ fontSize: "13px", marginTop: "8px" }}>Create your first project above.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {projects.map(p => (
            <div
              key={p._id}
              onClick={() => navigate(`/projects/${p._id}`)}
              style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", transition: "border-color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#6366f1"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#334155"}
            >
              <div>
                <p style={{ fontWeight: "600", fontSize: "15px", color: "#f1f5f9" }}>{p.name}</p>
                <p style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                  Created {new Date(p.createdAt).toLocaleDateString()} · Click to view debug history
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#6366f1" }} />
                <button
                  onClick={(e) => deleteProject(e, p._id)}
                  style={{ background: "transparent", border: "1px solid #7f1d1d", color: "#f87171", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
