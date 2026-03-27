import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import Projects from "./pages/Projects"
import ProjectDetail from "./pages/ProjectDetail"
import AIDebug from "./pages/AIDebug"
import AILearn from "./pages/AILearn"
import Snippets from "./pages/Snippets"
import Bookmarks from "./pages/Bookmarks"
import Tutorials from "./pages/Tutorials"
import OAuthSuccess from "./pages/OAuthSuccess"
import Layout from "./components/Layout"
import Search from "./pages/Search"
import Profile from "./pages/Profile"
import VerifyOTP from "./pages/VerifyOTP"
import RepoAnalyzer from "./pages/RepoAnalyzer"

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token")
  if (!token) return <Navigate to="/" replace />
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />

        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/ai-debug" element={<ProtectedRoute><Layout><AIDebug /></Layout></ProtectedRoute>} />
        <Route path="/ai-learn" element={<ProtectedRoute><Layout><AILearn /></Layout></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><Layout><Projects /></Layout></ProtectedRoute>} />
        <Route path="/projects/:id" element={<ProtectedRoute><Layout><ProjectDetail /></Layout></ProtectedRoute>} />
        <Route path="/snippets" element={<ProtectedRoute><Layout><Snippets /></Layout></ProtectedRoute>} />
        <Route path="/bookmarks" element={<ProtectedRoute><Layout><Bookmarks /></Layout></ProtectedRoute>} />
        <Route path="/tutorials" element={<ProtectedRoute><Layout><Tutorials /></Layout></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><Layout><Search /></Layout></ProtectedRoute>} />LayoutCode · JSX DownloadSearchCode · JSX DownloadDownload all Sonnet 4.6Claude is AI and can make mistakes. Please double-check responses.Search · JSXCopy
        <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
      
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/repo-analyzer" element={<ProtectedRoute><Layout><RepoAnalyzer /></Layout></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
