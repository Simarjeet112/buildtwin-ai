import { useState } from "react"
import API from "../services/api"

export default function AILearn() {
  const [topic, setTopic] = useState("")
  const [level, setLevel] = useState("beginner")
  const [goal, setGoal] = useState("")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const learn = async () => {
    if (!topic.trim()) return
    setLoading(true)
    try {
      const res = await API.post("/ai/learn", { topic, level, goal })
      console.log("RESULT:", res.data)
      setResult(res.data.learning)
    } catch (err) {
      console.error(err)
      alert("Failed: " + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: "32px", maxWidth: "900px" }}>
      <p style={{ color: "#64748b", marginBottom: "28px", fontSize: "14px" }}>
        Learn any programming concept with AI-powered explanations.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
        <input
          style={{ padding: "12px 16px", background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9", fontSize: "14px" }}
          placeholder="Topic (ex: Recursion)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <select
          style={{ padding: "12px 16px", background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9", fontSize: "14px" }}
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <input
          style={{ padding: "12px 16px", background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9", fontSize: "14px" }}
          placeholder="Learning goal (ex: interview prep)"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />

        <button
          onClick={learn}
          disabled={loading}
          style={{ padding: "12px 24px", background: "#6366f1", border: "none", borderRadius: "8px", color: "white", fontSize: "14px", fontWeight: "600", cursor: "pointer", opacity: loading ? 0.6 : 1, width: "fit-content" }}
        >
          {loading ? "Generating..." : "Generate Explanation"}
        </button>
      </div>

      {result && (
        <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "24px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "12px", color: "#a5b4fc" }}>AI Explanation</h2>
          <p style={{ whiteSpace: "pre-wrap", fontSize: "14px", lineHeight: "1.8", color: "#cbd5e1" }}>{result}</p>
        </div>
      )}
    </div>
  )
}
