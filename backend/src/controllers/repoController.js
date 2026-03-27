const Groq = require("groq-sdk")

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const fetchRepoFiles = async (owner, repo, path = "") => {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
  const res = await fetch(url, {
    headers: {
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "BuildTwin-AI"
    }
  })
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
  return res.json()
}

const fetchFileContent = async (url) => {
  const res = await fetch(url, {
    headers: { "User-Agent": "BuildTwin-AI" }
  })
  return res.text()
}

const collectFiles = async (owner, repo, path = "", files = [], depth = 0) => {
  if (depth > 2) return files // limit depth to avoid huge repos
  
  const items = await fetchRepoFiles(owner, repo, path)
  
  const skipDirs = ["node_modules", ".git", "dist", "build", ".next", "coverage"]
  const allowedExtensions = [".js", ".jsx", ".ts", ".tsx", ".py", ".json", ".md", ".env.example", ".css", ".html"]

  for (const item of items) {
    if (item.type === "dir") {
      if (!skipDirs.includes(item.name)) {
        await collectFiles(owner, repo, item.path, files, depth + 1)
      }
    } else if (item.type === "file") {
      const ext = "." + item.name.split(".").pop()
      if (allowedExtensions.includes(ext) && item.size < 50000) {
        files.push({ path: item.path, downloadUrl: item.download_url, size: item.size })
      }
    }
  }
  return files
}

exports.analyzeRepo = async (req, res) => {
  try {
    const { repoUrl } = req.body

    if (!repoUrl) return res.status(400).json({ message: "Repo URL is required" })

    // Parse GitHub URL
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
    if (!match) return res.status(400).json({ message: "Invalid GitHub URL" })

    const owner = match[1]
    const repo = match[2].replace(".git", "")

    // Fetch repo info
    const repoInfoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { "User-Agent": "BuildTwin-AI" }
    })
    if (!repoInfoRes.ok) return res.status(404).json({ message: "Repo not found or is private" })
    const repoInfo = await repoInfoRes.json()

    // Collect files
    const files = await collectFiles(owner, repo)

    if (files.length === 0) return res.status(400).json({ message: "No readable files found in this repo" })

    // Fetch content of files (limit to 20 files to stay within token limits)
    const topFiles = files.slice(0, 20)
    const fileContents = []

    for (const file of topFiles) {
      try {
        const content = await fetchFileContent(file.downloadUrl)
        fileContents.push(`\n\n=== FILE: ${file.path} ===\n${content.slice(0, 2000)}`)
      } catch (e) {
        // skip unreadable files
      }
    }

    const codeContext = fileContents.join("\n")

    const prompt = `
You are an expert software architect analyzing a GitHub repository.

Repository: ${owner}/${repo}
Description: ${repoInfo.description || "No description"}
Language: ${repoInfo.language || "Unknown"}
Stars: ${repoInfo.stargazers_count}

Here are the key files from this repository:
${codeContext}

Please provide a comprehensive analysis including:

1. **Project Overview** — What does this project do? What problem does it solve?
2. **Tech Stack** — List all technologies, frameworks, and libraries used
3. **Architecture** — How is the project structured? What are the main layers/components?
4. **Key Files** — Which files are most important and what does each do?
5. **Data Flow** — How does data move through the application?
6. **Entry Points** — Where does the app start? How does a request flow through it?
7. **Database & Models** — What data structures are used?
8. **API Endpoints** — What routes/endpoints exist?
9. **Authentication** — How is auth handled?
10. **Strengths & Weaknesses** — What's done well? What could be improved?
11. **How to Run** — Step by step setup instructions based on the code
12. **Suggested Improvements** — 3-5 concrete improvements a developer could make

Be specific, reference actual file names and code where relevant.
`

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      max_tokens: 4000
    })

    const analysis = completion.choices[0].message.content

    res.json({
      analysis,
      repoInfo: {
        name: repoInfo.name,
        fullName: repoInfo.full_name,
        description: repoInfo.description,
        language: repoInfo.language,
        stars: repoInfo.stargazers_count,
        forks: repoInfo.forks_count,
        url: repoInfo.html_url,
        filesAnalyzed: topFiles.length,
        totalFiles: files.length
      }
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message || "Failed to analyze repository" })
  }
}

exports.chatAboutRepo = async (req, res) => {
  try {
    const { question, analysis, repoInfo } = req.body

    if (!question || !analysis) return res.status(400).json({ message: "Missing question or analysis" })

    const prompt = `
You are an expert explaining a GitHub repository called "${repoInfo.fullName}" to a developer.

Here is the full analysis of the codebase:
${analysis}

The developer is asking: "${question}"

Answer clearly and simply. Reference specific files, functions, or code patterns from the analysis where relevant.
If you don't know something based on the analysis, say so honestly.
Keep your answer concise but complete.
`

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      max_tokens: 1000
    })

    res.json({ answer: completion.choices[0].message.content })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to answer question" })
  }
}