import { useState, useRef, useEffect } from "react"
import API from "../services/api"

export default function RepoAnalyzer() {
  const [repoUrl, setRepoUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [err, setErr] = useState("")
  const [loadingMsg, setLoadingMsg] = useState("")
  const [question, setQuestion] = useState("")
  const [chatHistory, setChatHistory] = useState([])
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef(null)

  const loadingMessages = [
    "Fetching repository files...",
    "Reading your codebase...",
    "Analyzing architecture...",
    "Understanding data flow...",
    "Generating insights..."
  ]

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatHistory])

  const analyze = async () => {
    if (!repoUrl.trim()) return setErr("Please enter a GitHub repo URL")
    if (!repoUrl.includes("github.com")) return setErr("Please enter a valid GitHub URL")
    setErr("")
    setResult(null)
    setChatHistory([])
    setLoading(true)

    let msgIndex = 0
    setLoadingMsg(loadingMessages[0])
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % loadingMessages.length
      setLoadingMsg(loadingMessages[msgIndex])
    }, 3000)

    try {
      const res = await API.post("/repo/analyze", { repoUrl })
      setResult(res.data)
      setChatHistory([{
        role: "assistant",
        content: `I've analyzed **${res.data.repoInfo.fullName}**! I've read ${res.data.repoInfo.filesAnalyzed} files and understand the entire codebase. Ask me anything — like "How does auth work?", "What does index.js do?", or "How do I run this project?"`
      }])
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to analyze repository")
    } finally {
      clearInterval(interval)
      setLoading(false)
      setLoadingMsg("")
    }
  }

  const askQuestion = async () => {
    if (!question.trim() || !result) return
    const userQuestion = question.trim()
    setQuestion("")
    setChatHistory(prev => [...prev, { role: "user", content: userQuestion }])
    setChatLoading(true)

    try {
      const res = await API.post("/repo/chat", {
        repoUrl,
        question: userQuestion,
        analysis: result.analysis,
        repoInfo: result.repoInfo
      })
      setChatHistory(prev => [...prev, { role: "assistant", content: res.data.answer }])
    } catch (e) {
      setChatHistory(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't answer that. Try asking differently." }])
    } finally {
      setChatLoading(false)
    }
  }

  const suggestedQuestions = [
    "How does authentication work?",
    "What is the folder structure?",
    "How do I run this project?",
    "What are the main API endpoints?",
    "What database is used?"
  ]

  return (
    <div style={{ padding: "32px", maxWidth: "1000px" }}>
      <p style={{ color: "#64748b", marginBottom: "28px", fontSize: "14px" }}>
        Paste any public GitHub repository URL — AI will explain the entire codebase and answer your questions.
      </p>

      {/* Input */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <input
          style={{ flex: 1, padding: "14px 18px", background: "#1e293b", border: "1px solid #334155", borderRadius: "10px", color: "#f1f5f9", fontSize: "14px", outline: "none" }}
          placeholder="https://github.com/username/repository"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && analyze()}
          onFocus={e => e.target.style.borderColor = "#6366f1"}
          onBlur={e => e.target.style.borderColor = "#334155"}
        />
        <button
          onClick={analyze}
          disabled={loading}
          style={{ padding: "14px 28px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", borderRadius: "10px", color: "white", fontSize: "14px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, whiteSpace: "nowrap", boxShadow: "0 0 20px rgba(99,102,241,0.3)" }}
        >
          {loading ? "Analyzing..." : "Analyze Repo →"}
        </button>
      </div>

      {err && (
        <div style={{ background: "#450a0a", border: "1px solid #7f1d1d", color: "#fca5a5", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>
          {err}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
          <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", animation: "spin 2s linear infinite" }}>
            <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
          </div>
          <p style={{ fontSize: "16px", fontWeight: "600", color: "#f1f5f9", marginBottom: "8px" }}>{loadingMsg}</p>
          <p style={{ fontSize: "13px", color: "#475569" }}>This may take 15-30 seconds for large repos</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div>
          {/* Repo header */}
          <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "20px 24px", marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                <svg width="18" height="18" fill="none" stroke="#6366f1" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
                <a href={result.repoInfo.url} target="_blank" rel="noreferrer" style={{ fontSize: "16px", fontWeight: "700", color: "#f1f5f9", textDecoration: "none" }}>
                  {result.repoInfo.fullName}
                </a>
              </div>
              {result.repoInfo.description && <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>{result.repoInfo.description}</p>}
            </div>
            <div style={{ display: "flex", gap: "20px" }}>
              {result.repoInfo.language && (
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "11px", color: "#64748b", margin: "0 0 4px" }}>Language</p>
                  <p style={{ fontSize: "13px", fontWeight: "600", color: "#f1f5f9", margin: 0 }}>{result.repoInfo.language}</p>
                </div>
              )}
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "11px", color: "#64748b", margin: "0 0 4px" }}>Stars</p>
                <p style={{ fontSize: "13px", fontWeight: "600", color: "#f59e0b", margin: 0 }}>⭐ {result.repoInfo.stars}</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "11px", color: "#64748b", margin: "0 0 4px" }}>Files Read</p>
                <p style={{ fontSize: "13px", fontWeight: "600", color: "#6366f1", margin: 0 }}>{result.repoInfo.filesAnalyzed}</p>
              </div>
            </div>
          </div>

          {/* Two column layout */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            {/* Left - Analysis */}
            <div>
              <h2 style={{ fontSize: "13px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>Full Analysis</h2>
              <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "20px", maxHeight: "600px", overflowY: "auto" }}>
                <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: "1.8", whiteSpace: "pre-wrap", margin: 0 }}>
                  {result.analysis.replace(/\*\*([^*]+)\*\*/g, "$1")}
                </p>
              </div>
            </div>

            {/* Right - Chat */}
            <div>
              <h2 style={{ fontSize: "13px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>Ask Questions</h2>
              
              {/* Chat messages */}
              <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "16px", height: "440px", overflowY: "auto", marginBottom: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
                {chatHistory.map((msg, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                    <div style={{
                      maxWidth: "85%",
                      padding: "10px 14px",
                      borderRadius: msg.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                      background: msg.role === "user" ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#0f172a",
                      border: msg.role === "assistant" ? "1px solid #334155" : "none",
                      fontSize: "13px",
                      color: "#f1f5f9",
                      lineHeight: "1.6"
                    }}>
                      {msg.content.replace(/\*\*([^*]+)\*\*/g, "$1")}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div style={{ display: "flex", justifyContent: "flex-start" }}>
                    <div style={{ padding: "10px 14px", borderRadius: "12px 12px 12px 4px", background: "#0f172a", border: "1px solid #334155", fontSize: "13px", color: "#64748b" }}>
                      Thinking...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Suggested questions */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
                {suggestedQuestions.map(q => (
                  <button
                    key={q}
                    onClick={() => setQuestion(q)}
                    style={{ padding: "6px 12px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "999px", color: "#818cf8", fontSize: "12px", cursor: "pointer" }}
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Chat input */}
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  style={{ flex: 1, padding: "12px 14px", background: "#1e293b", border: "1px solid #334155", borderRadius: "10px", color: "#f1f5f9", fontSize: "13px", outline: "none" }}
                  placeholder="Ask anything about this repo..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && askQuestion()}
                  onFocus={e => e.target.style.borderColor = "#6366f1"}
                  onBlur={e => e.target.style.borderColor = "#334155"}
                />
                <button
                  onClick={askQuestion}
                  disabled={chatLoading || !question.trim()}
                  style={{ padding: "12px 16px", background: "#6366f1", border: "none", borderRadius: "10px", color: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer", opacity: chatLoading ? 0.6 : 1 }}
                >
                  Ask
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
