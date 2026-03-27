import { useEffect, useState } from "react"
import API from "../services/api"

export default function Snippets() {
  const [snippets, setSnippets] = useState([])
  const [title, setTitle] = useState("")
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState("")

  const fetchSnippets = async () => {
    try {
      const res = await API.get("/snippets")
      setSnippets(res.data)
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to load snippets.")
    } finally {
      setLoading(false)
    }
  }

  const saveSnippet = async () => {
    if (!code.trim() || !title.trim()) return setErr("Title and code are required.")
    setErr("")
    setSaving(true)
    try {
      await API.post("/snippets", { title, code, language })
      setTitle("")
      setCode("")
      fetchSnippets()
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to save snippet.")
    } finally {
      setSaving(false)
    }
  }

  const deleteSnippet = async (id) => {
    try {
      await API.delete(`/snippets/${id}`)
      setSnippets(prev => prev.filter(s => s._id !== id))
    } catch (e) {
      setErr("Failed to delete snippet.")
    }
  }

  useEffect(() => { fetchSnippets() }, [])

  return (
    <div style={{ padding: "32px", maxWidth: "900px" }}>
      <p style={{ color: "#64748b", marginBottom: "28px", fontSize: "14px" }}>
        Save and organize your code snippets.
      </p>

      {err && (
        <div style={{ background: "#450a0a", border: "1px solid #7f1d1d", color: "#fca5a5", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>
          {err}
        </div>
      )}

      {/* Save form */}
      <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "24px", marginBottom: "32px" }}>
        <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
          <input
            style={{ flex: 1, padding: "10px 14px", background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9", fontSize: "14px" }}
            placeholder="Snippet title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <select
            style={{ padding: "10px 14px", background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9", fontSize: "14px" }}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="typescript">TypeScript</option>
            <option value="java">Java</option>
            <option value="css">CSS</option>
            <option value="html">HTML</option>
            <option value="other">Other</option>
          </select>
        </div>
        <textarea
          style={{ width: "100%", height: "160px", padding: "14px", background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9", fontSize: "13px", fontFamily: "monospace", resize: "vertical", boxSizing: "border-box" }}
          placeholder="Paste your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          onClick={saveSnippet}
          disabled={saving}
          style={{ marginTop: "12px", padding: "10px 24px", background: "#6366f1", border: "none", borderRadius: "8px", color: "white", fontSize: "14px", fontWeight: "600", cursor: "pointer", opacity: saving ? 0.6 : 1 }}
        >
          {saving ? "Saving..." : "Save Snippet"}
        </button>
      </div>

      {/* Snippet list */}
      {loading ? (
        <p style={{ color: "#64748b", fontSize: "14px" }}>Loading snippets...</p>
      ) : snippets.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px", background: "#1e293b", borderRadius: "12px", color: "#64748b" }}>
          <p style={{ fontSize: "15px" }}>No snippets saved yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {snippets.map(s => (
            <div key={s._id} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "10px", overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontWeight: "600", fontSize: "14px" }}>{s.title}</span>
                  <span style={{ fontSize: "11px", color: "#6366f1", background: "#1e1b4b", padding: "3px 10px", borderRadius: "999px" }}>{s.language}</span>
                </div>
                <button
                  onClick={() => deleteSnippet(s._id)}
                  style={{ background: "transparent", border: "1px solid #7f1d1d", color: "#f87171", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}
                >
                  Delete
                </button>
              </div>
              <pre style={{ padding: "16px 18px", margin: 0, fontSize: "13px", color: "#94a3b8", fontFamily: "monospace", overflowX: "auto" }}>
                {s.code}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
