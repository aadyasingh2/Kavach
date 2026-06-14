const agents = [
    { key: "planner", name: "Planner", desc: "Attack surface mapping", icon: "◈" },
    { key: "secrets", name: "Secrets", desc: "Credential detection", icon: "◉" },
    { key: "dependency", name: "Dependency", desc: "CVE analysis", icon: "◎" },
    { key: "logic", name: "Logic", desc: "OWASP vulnerabilities", icon: "◆" },
    { key: "synthesizer", name: "Synthesizer", desc: "Report compilation", icon: "◇" }
]

export default function AgentSwarm({ statuses }) {
    return (
        <div style={{ marginBottom: "28px" }}>
            <div style={{ fontSize: "0.75rem", color: "#555", marginBottom: "12px", fontWeight: "500" }}>AGENT SWARM</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: "10px" }}>
                {agents.map(agent => {
                    const s = statuses[agent.key]
                    return (
                        <div key={agent.key} style={{
                            padding: "14px 10px",
                            background: "#141418",
                            border: `1px solid ${s === "done" ? "#166534" : s === "running" ? "#1e3a5f" : "#1c1c22"}`,
                            borderRadius: "10px",
                            transition: "all 0.3s",
                            minWidth: 0
                        }}>
                            <div style={{
                                width: "28px", height: "28px", borderRadius: "8px", marginBottom: "10px",
                                background: s === "done" ? "#14532d" : s === "running" ? "#1e3a5f" : "#1c1c22",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: s === "done" ? "#22c55e" : s === "running" ? "#60a5fa" : "#444",
                                fontSize: "0.9rem", transition: "all 0.3s"
                            }}>
                                {agent.icon}
                            </div>
                            <div style={{ fontSize: "0.72rem", fontWeight: "600", marginBottom: "4px", color: "#e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{agent.name}</div>
                            <div style={{ fontSize: "0.62rem", color: "#555", marginBottom: "10px", lineHeight: "1.4" }}>{agent.desc}</div>
                            <div style={{
                                display: "inline-flex", alignItems: "center", gap: "5px",
                                padding: "3px 8px", borderRadius: "4px", fontSize: "0.6rem", fontWeight: "600",
                                background: s === "done" ? "#14532d" : s === "running" ? "#1e3a5f" : "#1c1c22",
                                color: s === "done" ? "#22c55e" : s === "running" ? "#60a5fa" : "#555"
                            }}>
                                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
                                {s === "running" ? "Active" : s === "done" ? "Complete" : "Standby"}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}