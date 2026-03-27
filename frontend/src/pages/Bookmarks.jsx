import { useEffect, useState } from "react"
import API from "../services/api"

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([])
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState("")

  const fetchBookmarks = async () => {
    try {
      const res = await API.get("/bookmarks")
      setBookmarks(res.data)
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to load bookmarks.")
    } finally {
      setLoading(false)
    }
  }

  const saveBookmark = async () => {
    if (!title.trim() || !url.trim()) return setErr("Title and URL are required.")
    setErr("")
    setSaving(true)
    try {
      await API.post("/bookmarks", { title, url })
      setTitle("")
      setUrl("")
      fetchBookmarks()
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to save bookmark.")
    } finally {
      setSaving(false)
    }
  }

  const deleteBookmark = async (id) => {
    try {
      await API.delete(`/bookmarks/${id}`)
      setBookmarks(prev => prev.filter(b => b._id !== id))
    } catch (e) {
      setErr("Failed to delete bookmark.")
    }
  }

  useEffect(() => { fetchBookmarks() }, [])

  return (
    <div style={{ padding: "32px", maxWidth: "800px" }}>
      <p style={{ color: "#64748b", marginBottom: "28px", fontSize: "14px" }}>
        Save useful links and resources for later.
      </p>

      {err && (
        <div style={{ background: "#450a0a", border: "1px solid #7f1d1d", color: "#fca5a5", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>
          {err}
        </div>
      )}

      {/* Add bookmark form */}
      <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "20px", marginBottom: "32px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            style={{ padding: "10px 14px", background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9", fontSize: "14px" }}
            placeholder="Title (ex: React Docs)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            style={{ padding: "10px 14px", background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9", fontSize: "14px" }}
            placeholder="URL (ex: https://react.dev)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={saveBookmark}
            disabled={saving}
            style={{ padding: "10px 24px", background: "#6366f1", border: "none", borderRadius: "8px", color: "white", fontSize: "14px", fontWeight: "600", cursor: "pointer", opacity: saving ? 0.6 : 1, width: "fit-content" }}
          >
            {saving ? "Saving..." : "Save Bookmark"}
          </button>
        </div>
      </div>

      {/* Bookmark list */}
      {loading ? (
        <p style={{ color: "#64748b", fontSize: "14px" }}>Loading bookmarks...</p>
      ) : bookmarks.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px", background: "#1e293b", borderRadius: "12px", color: "#64748b" }}>
          <p style={{ fontSize: "15px" }}>No bookmarks saved yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {bookmarks.map(b => (
            <div key={b._id} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <a href={b.url} target="_blank" rel="noreferrer" style={{ fontWeight: "600", fontSize: "14px", color: "#a5b4fc", textDecoration: "none" }}>
                  {b.title}
                </a>
                <p style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>{b.url}</p>
              </div>
              <button
                onClick={() => deleteBookmark(b._id)}
                style={{ background: "transparent", border: "1px solid #7f1d1d", color: "#f87171", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
