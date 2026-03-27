import { useState } from "react"
import API from "../services/api"

const typeColors = {
  youtube: { bg: "#450a0a", color: "#fca5a5", label: "YouTube" },
  article: { bg: "#1e1b4b", color: "#a5b4fc", label: "Article" },
  docs: { bg: "#052e16", color: "#86efac", label: "Docs" },
  practice: { bg: "#431407", color: "#fdba74", label: "Practice" }
}

function StarRating({ tutorialId, currentRating, userRating, onRate }) {
  const [hovered, setHovered] = useState(0)

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{ display: "flex", gap: "4px" }}>
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            onClick={() => onRate(tutorialId, star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            style={{
              fontSize: "20px",
              cursor: "pointer",
              color: star <= (hovered || userRating) ? "#f59e0b" : "#334155",
              transition: "color 0.1s"
            }}
          >
            ★
          </span>
        ))}
      </div>
      <span style={{ fontSize: "13px", color: "#64748b" }}>
        {currentRating > 0 ? `${currentRating} avg` : "No ratings yet"}
      </span>
    </div>
  )
}

export default function Tutorials() {
  const [topic, setTopic] = useState("")
  const [tutorials, setTutorials] = useState([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState("")
  const [userRatings, setUserRatings] = useState({})

  const getTutorials = async () => {
    if (!topic.trim()) return
    setErr("")
    setLoading(true)
    try {
      const res = await API.post("/tutorials", { topic })
      setTutorials(res.data.tutorials)
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to get tutorials")
    } finally {
      setLoading(false)
    }
  }

  const rateTutorial = async (id, rating) => {
    try {
      const res = await API.post(`/tutorials/${id}/rate`, { rating })
      // Update tutorial in list with new ratings
      setTutorials(prev =>
        prev.map(t => t._id === id ? res.data.tutorial : t)
      )
      setUserRatings(prev => ({ ...prev, [id]: rating }))
    } catch (e) {
      console.error("Rating failed", e)
    }
  }

  return (
    <div style={{ padding: "32px", maxWidth: "900px" }}>
      <p style={{ color: "#64748b", marginBottom: "28px", fontSize: "14px" }}>
        Get AI-curated tutorials for any topic and rate them for the community.
      </p>

      {err && (
        <div style={{ background: "#450a0a", border: "1px solid #7f1d1d", color: "#fca5a5", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>
          {err}
        </div>
      )}

      <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
        <input
          style={{ flex: 1, padding: "12px 16px", background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9", fontSize: "14px" }}
          placeholder="Topic (ex: React hooks, Recursion, Docker)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && getTutorials()}
        />
        <button
          onClick={getTutorials}
          disabled={loading}
          style={{ padding: "12px 24px", background: "#6366f1", border: "none", borderRadius: "8px", color: "white", fontSize: "14px", fontWeight: "600", cursor: "pointer", opacity: loading ? 0.6 : 1 }}
        >
          {loading ? "Finding..." : "Find Tutorials"}
        </button>
      </div>

      {tutorials.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {tutorials.map(t => {
            const typeStyle = typeColors[t.type] || typeColors.article
            const avgRating = t.averageRating || 0
            const userRating = userRatings[t._id] || 0

            return (
              <div key={t._id} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "20px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "999px", background: typeStyle.bg, color: typeStyle.color }}>
                      {typeStyle.label}
                    </span>
                    <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#f1f5f9", margin: 0 }}>{t.title}</h3>
                  </div>
                </div>

                {t.description && (
                  <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: "1.6", marginBottom: "14px", whiteSpace: "pre-wrap" }}>
                    {t.description}
                  </p>
                )}

                <StarRating
                  tutorialId={t._id}
                  currentRating={avgRating}
                  userRating={userRating}
                  onRate={rateTutorial}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
