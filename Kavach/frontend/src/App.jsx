import { useState } from "react"
import RepoInput from "./components/RepoInput"
import AgentSwarm from "./components/AgentSwarm"
import Report from "./components/Report"

export default function App() {
  const [stage, setStage] = useState("idle")
  const [agentStatuses, setAgentStatuses] = useState({
    planner: "waiting", secrets: "waiting", dependency: "waiting", logic: "waiting", synthesizer: "waiting"
  })
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const analyze = async (repoUrl) => {
    setStage("running")
    setResult(null)
    setError(null)
    setAgentStatuses({ planner: "waiting", secrets: "waiting", dependency: "waiting", logic: "waiting", synthesizer: "waiting" })

    try {
      const response = await fetch("http://kavach-38i4.onrender.com/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo_url: repoUrl })
      })
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value)
        const lines = text.split("\n").filter(l => l.startsWith("data: "))
        for (const line of lines) {
          const data = JSON.parse(line.replace("data: ", ""))
          if (data.stage === "complete") { setResult(data.result); setStage("done") }
          else if (data.stage === "running") setAgentStatuses({ planner: "running", secrets: "running", dependency: "running", logic: "running", synthesizer: "waiting" })
          else if (data.stage === "synthesizing") setAgentStatuses(p => ({ ...p, planner: "done", secrets: "done", dependency: "done", logic: "done", synthesizer: "running" }))
          else if (["planner", "secrets", "dependency", "logic"].includes(data.stage)) setAgentStatuses(p => ({ ...p, [data.stage]: "done" }))
        }
      }
    } catch {
      setError("Failed to reach backend.")
      setStage("idle")
    }
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f0f11", color: "#e2e8f0", fontFamily: "'Inter', system-ui, sans-serif", boxSizing: "border-box" }}>
      {/* Sidebar */}
      <div style={{ width: "200px", background: "#0c0c0e", borderRight: "1px solid #1c1c22", padding: "24px 0", flexShrink: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid #1c1c22" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "28px", height: "28px", background: "linear-gradient(135deg, #e85d3e, #c94828)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>⬡</div>
            <span style={{ fontWeight: "700", fontSize: "0.9rem", letterSpacing: "0.02em" }}>Kavach</span>
          </div>
        </div>
        <div style={{ padding: "16px 12px", flex: 1 }}>
          {[
            { icon: "⊞", label: "Dashboard", active: true },
            { icon: "⚑", label: "Findings", active: false },
            { icon: "◎", label: "Agents", active: false },
            { icon: "⊙", label: "Reports", active: false },
          ].map(item => (
            <div key={item.label} style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "9px 10px", borderRadius: "6px", marginBottom: "2px",
              background: item.active ? "#1c1c22" : "transparent",
              color: item.active ? "#e2e8f0" : "#555",
              fontSize: "0.82rem", cursor: "pointer"
            }}>
              <span style={{ fontSize: "0.9rem" }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
        <div style={{ padding: "16px 20px", borderTop: "1px solid #1c1c22" }}>
          <div style={{ fontSize: "0.7rem", color: "#444", marginBottom: "6px" }}>SYSTEM STATUS</div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: stage === "running" ? "#f59e0b" : "#22c55e" }} />
            <span style={{ fontSize: "0.75rem", color: "#888" }}>{stage === "running" ? "Scanning..." : "Operational"}</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto", minWidth: 0 }}>
        {/* Topbar */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #1c1c22", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0c0c0e" }}>
          <div>
            <div style={{ fontSize: "0.7rem", color: "#555", marginBottom: "2px" }}>Dashboard / Scan</div>
            <div style={{ fontSize: "1rem", fontWeight: "600" }}>Threat Analysis</div>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <div style={{ padding: "6px 14px", background: "#1c1c22", borderRadius: "6px", fontSize: "0.75rem", color: "#888" }}>v1.0.0</div>
            <div style={{ width: "32px", height: "32px", background: "#1c1c22", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem" }}>⚙</div>
          </div>
        </div>

        <div style={{ padding: "20px", flex: 1, minWidth: 0 }}>
          <RepoInput onAnalyze={analyze} disabled={stage === "running"} />
          {error && <div style={{ padding: "12px 16px", background: "#1a0a0a", border: "1px solid #7f1d1d", borderRadius: "8px", color: "#f87171", fontSize: "0.8rem", marginBottom: "24px" }}>{error}</div>}
          {stage !== "idle" && <AgentSwarm statuses={agentStatuses} />}
          {result && <Report result={result} />}
        </div>
      </div>
    </div>
  )
}