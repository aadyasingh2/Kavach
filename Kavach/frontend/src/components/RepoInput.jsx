import { useState } from "react"

export default function RepoInput({ onAnalyze, disabled }) {
    const [url, setUrl] = useState("")

    return (
        <div style={{ marginBottom: "28px" }}>
            <div style={{ fontSize: "0.75rem", color: "#555", marginBottom: "10px", fontWeight: "500" }}>REPOSITORY URL</div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "nowrap" }}>
                <div style={{
                    flex: 1, display: "flex", alignItems: "center",
                    background: "#141418", border: "1px solid #1c1c22",
                    borderRadius: "8px", padding: "0 16px", gap: "10px", minWidth: 0
                }}>
                    <span style={{ color: "#444", fontSize: "0.9rem" }}>⊕</span>
                    <input
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && !disabled && url && onAnalyze(url)}
                        placeholder="https://github.com/owner/repo"
                        disabled={disabled}
                        style={{
                            flex: 1, padding: "13px 0", background: "transparent",
                            border: "none", color: "#e2e8f0", fontSize: "0.88rem",
                            outline: "none", fontFamily: "inherit", minWidth: 0, width: "100%"
                        }}
                    />
                </div>
                <button
                    onClick={() => onAnalyze(url)}
                    disabled={disabled || !url}
                    style={{
                        padding: "13px 24px",
                        background: disabled ? "#1c1c22" : "#e85d3e",
                        border: "none", borderRadius: "8px",
                        color: disabled ? "#444" : "#fff",
                        fontWeight: "600", fontSize: "0.82rem",
                        cursor: disabled ? "not-allowed" : "pointer",
                        fontFamily: "inherit", whiteSpace: "nowrap",
                        transition: "all 0.2s", flexShrink: 0
                    }}
                >
                    {disabled ? "Scanning..." : "Run Swarm →"}
                </button>
            </div>
        </div>
    )
}