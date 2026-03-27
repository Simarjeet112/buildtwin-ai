import { useState, useEffect } from "react"
import API from "../services/api"

export default function AIDebug() {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [projectId, setProjectId] = useState("")
  const [projects, setProjects] = useState([])
  const [analysis, setAnalysis] = useState("")
  const [fix, setFix] = useState("")
  const [loadingAnalyze, setLoadingAnalyze] = useState(false)
  const [loadingFix, setLoadingFix] = useState(false)
  const [err, setErr] = useState("")

  useEffect(() => {
    API.get("/projects").then(res => setProjects(res.data)).catch(() => {})
  }, [])

  const analyze = async () => {
    if (!code.trim()) return setErr("Please paste some code first.")
    setErr("")
    setLoadingAnalyze(true)
    try {
      const res = await API.post("/ai/debug", {
        language,
        code,
        errorMessage: error,
        projectId: projectId || undefined
      })
      setAnalysis(res.data.session?.aiAnalysis?.explanation || res.data.result || "No analysis returned.")
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to analyze. Make sure you're logged in.")
    } finally {
      setLoadingAnalyze(false)
    }
  }

  const fixBug = async () => {
    if (!code.trim()) return setErr("Please paste some code first.")
    setErr("")
    setLoadingFix(true)
    try {
      const res = await API.post("/ai/fix", { language, code, errorMessage: error })
      setFix(res.data.result || "No fix returned.")
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to fix. Make sure you're logged in.")
    } finally {
      setLoadingFix(false)
    }
  }

  return (
    <div style={{ padding: "32px", maxWidth: "900px" }}>
      <p style={{ color: "#64748b", marginBottom: "28px", fontSize: "14px" }}>
        Paste your code and error message below to get AI-powered debugging help.
      </p>

      {err && (
        <div style={{ background: "#450a0a", border: "1px solid #7f1d1d", color: "#fca5a5", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>
          {err}
        </div>
      )}

      {/* Project + Language selectors */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "8px" }}>Project (optional)</label>
          <select
            style={{ width: "100%", padding: "12px", background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9", fontSize: "14px" }}
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            <option value="">No project</option>
            {projects.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1 }}>
          <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "8px" }}>Language</label>
          <select
            style={{ width: "100%", padding: "12px", background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9", fontSize: "14px" }}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="typescript">TypeScript</option>
            <option value="cpp">C++</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "8px" }}>Error Message (optional)</label>
        <input
          style={{ width: "100%", padding: "12px", background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9", fontSize: "14px", boxSizing: "border-box" }}
          placeholder="e.g. TypeError: Cannot read property 'map' of undefined"
          value={error}
          onChange={(e) => setError(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "8px" }}>Your Code</label>
        <textarea
          style={{ width: "100%", height: "220px", padding: "16px", background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9", fontSize: "13px", fontFamily: "monospace", resize: "vertical", boxSizing: "border-box" }}
          placeholder="Paste your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "28px" }}>
        <button
          onClick={analyze}
          disabled={loadingAnalyze}
          style={{ padding: "10px 24px", background: "#6366f1", border: "none", borderRadius: "8px", color: "white", fontSize: "14px", fontWeight: "600", cursor: "pointer", opacity: loadingAnalyze ? 0.6 : 1 }}
        >
          {loadingAnalyze ? "Analyzing..." : "Analyze Error"}
        </button>
        <button
          onClick={fixBug}
          disabled={loadingFix}
          style={{ padding: "10px 24px", background: "#059669", border: "none", borderRadius: "8px", color: "white", fontSize: "14px", fontWeight: "600", cursor: "pointer", opacity: loadingFix ? 0.6 : 1 }}
        >
          {loadingFix ? "Fixing..." : "Fix Code"}
        </button>
      </div>

      {analysis && (
        <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "24px", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "12px", color: "#a5b4fc" }}>AI Analysis</h2>
          <p style={{ whiteSpace: "pre-wrap", fontSize: "14px", lineHeight: "1.7", color: "#cbd5e1" }}>{analysis}</p>
        </div>
      )}

      {fix && (
        <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "24px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "12px", color: "#6ee7b7" }}>Suggested Fix</h2>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: "13px", lineHeight: "1.7", color: "#cbd5e1", fontFamily: "monospace" }}>{fix}</pre>
        </div>
      )}
    </div>
  )
}
