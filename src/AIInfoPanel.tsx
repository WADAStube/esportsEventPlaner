import { useState } from "react";

// ─── same key resolution as GeneratePlan ─────────────────────────────────────
const ENV_KEY = (import.meta as { env?: Record<string, string> }).env?.VITE_OPENAI_KEY ?? "";
function resolveKey(): string {
  if (ENV_KEY && ENV_KEY.length > 20) return ENV_KEY;
  try { return localStorage.getItem("openai_key") || ""; } catch { return ""; }
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface Schnellinfo {
  zusammenfassung: string; punkte: string[];
  kosten: string; schwierigkeit: string; zeitaufwand: string; team: string;
}
interface BreakdownPhase { phase: string; schritte: string[]; }
interface DiagramStep { label: string; typ: "start" | "prozess" | "entscheidung" | "ergebnis"; notiz: string; }
interface Referenz { titel: string; url: string; beschreibung: string; typ: string; }
interface InfoData {
  schnellinfo: Schnellinfo;
  breakdown: BreakdownPhase[];
  diagramm: { titel: string; schritte: DiagramStep[] };
  referenzen: Referenz[];
}

const TABS = [
  { id: "schnellinfo", label: "Schnellinfo", icon: "⚡" },
  { id: "breakdown",  label: "Breakdown",   icon: "📋" },
  { id: "diagramm",   label: "Diagramm",    icon: "🔀" },
  { id: "referenzen", label: "Referenzen",  icon: "🔗" },
] as const;

const KOSTENCOLOR: Record<string, string>  = { Niedrig: "#22c55e", Mittel: "#f59e0b", Hoch: "#ef4444" };
const SCHWIERCOLOR: Record<string, string> = { Anfänger: "#22c55e", Mittel: "#f59e0b", Fortgeschritten: "#ef4444" };
const DIAG_STYLE: Record<string, { bg: string; border: string; color: string; shape: string }> = {
  start:        { bg: "rgba(0,229,255,0.12)", border: "rgba(0,229,255,0.5)",   color: "#00e5ff", shape: "24px" },
  prozess:      { bg: "rgba(168,85,247,0.1)", border: "rgba(168,85,247,0.4)", color: "#c084fc", shape: "8px"  },
  entscheidung: { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.4)", color: "#fbbf24", shape: "8px"  },
  ergebnis:     { bg: "rgba(34,197,94,0.1)",  border: "rgba(34,197,94,0.4)",  color: "#22c55e", shape: "24px" },
};
const REF_COLORS: Record<string, string> = {
  Tutorial: "#00e5ff", Artikel: "#a855f7", Tool: "#f59e0b", Video: "#ef4444", Community: "#22c55e",
};

async function fetchInfo(section: string, optionLabel: string, optionDesc: string, apiKey: string): Promise<InfoData> {
  const prompt = `Du bist ein E-Sports Event-Experte. Gib detaillierte Informationen auf DEUTSCH über folgende Option:

Bereich: ${section}
Option: ${optionLabel}
Beschreibung: ${optionDesc}

Antworte NUR mit diesem JSON (kein weiterer Text):
{
  "schnellinfo": {"zusammenfassung":"...","punkte":["..."],"kosten":"Niedrig|Mittel|Hoch","schwierigkeit":"Anfänger|Mittel|Fortgeschritten","zeitaufwand":"...","team":"..."},
  "breakdown": [{"phase":"...","schritte":["..."]}],
  "diagramm": {"titel":"...","schritte":[{"label":"...","typ":"start|prozess|entscheidung|ergebnis","notiz":"..."}]},
  "referenzen": [{"titel":"...","url":"https://...","beschreibung":"...","typ":"Tutorial|Artikel|Tool|Video|Community"}]
}

Mindestens 3 Breakdown-Phasen mit je 3-4 Schritten, 6-8 Diagramm-Schritte, 4-5 Referenzen mit echten URLs.`;

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
    body: JSON.stringify({ model: "gpt-4o", messages: [{ role: "user", content: prompt }] }),
  });
  if (!resp.ok) {
    let errMsg = `HTTP ${resp.status}`;
    try { const j = await resp.json(); errMsg = j.error?.message || errMsg; } catch {}
    throw new Error(errMsg);
  }
  const json = await resp.json();
  const raw = json.choices?.[0]?.message?.content || "{}";
  const cleaned = raw.trim().replace(/^```json\s*/, "").replace(/```\s*$/, "");
  return JSON.parse(cleaned) as InfoData;
}

export default function AIInfoPanel({
  section, optionLabel, optionDesc, accentColor, onClose,
}: {
  section: string; optionLabel: string; optionDesc: string; accentColor: string; onClose: () => void;
}) {
  const [tab, setTab]       = useState<"schnellinfo" | "breakdown" | "diagramm" | "referenzen">("schnellinfo");
  const [data, setData]     = useState<InfoData | null>(null);
  const [loading, setLoad]  = useState(false);
  const [error, setError]   = useState("");
  const [noKey, setNoKey]   = useState(false);

  async function load() {
    const key = resolveKey();
    if (!key) { setNoKey(true); return; }
    setLoad(true); setError(""); setNoKey(false);
    try {
      const result = await fetchInfo(section, optionLabel, optionDesc, key);
      setData(result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Fehler beim Laden. Bitte nochmal versuchen.");
    } finally {
      setLoad(false);
    }
  }

  if (!data && !loading && !error && !noKey) { load(); }

  return (
    <div style={{ marginTop: "12px", border: `1px solid ${accentColor}44`, borderRadius: "12px", background: "linear-gradient(135deg, rgba(10,10,20,0.95), rgba(15,15,30,0.95))", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: `linear-gradient(90deg, ${accentColor}10, transparent)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "16px" }}>🤖</span>
          <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", color: accentColor }}>KI-ANALYSE · {optionLabel.toUpperCase()}</span>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: "18px", lineHeight: 1 }}>✕</button>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 16px" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ background: "none", border: "none", borderBottom: tab === t.id ? `2px solid ${accentColor}` : "2px solid transparent", color: tab === t.id ? accentColor : "rgba(255,255,255,0.35)", fontFamily: "'Orbitron', sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", padding: "10px 12px 9px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
            <span>{t.icon}</span>{t.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "16px" }}>
        {noKey && (
          <div style={{ padding: "16px", fontFamily: "'Rajdhani', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
            ⚠ Kein API Key gefunden.{" "}
            {ENV_KEY
              ? "Der Umgebungs-Key scheint nicht gesetzt. Vercel Environment Variable prüfen."
              : <>Geht zu <strong style={{ color: "#00e5ff" }}>Unser Plan</strong> und tragt euren OpenAI Key ein.</>}
          </div>
        )}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "24px 0" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: accentColor, animation: "ai-pulse 1.2s ease-in-out infinite" }} />
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>KI analysiert {optionLabel}…</span>
            <style>{`@keyframes ai-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.3;transform:scale(0.7)}}`}</style>
          </div>
        )}
        {error && (
          <div style={{ padding: "16px", color: "#ef4444", fontFamily: "'Rajdhani', sans-serif", fontSize: "13px", display: "flex", gap: "10px", alignItems: "center" }}>
            ⚠ {error}
            <button onClick={load} style={{ background: "none", border: "1px solid #ef4444", color: "#ef4444", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontSize: "11px", fontFamily: "'Orbitron', sans-serif" }}>RETRY</button>
          </div>
        )}
        {data && !loading && (
          <>
            {tab === "schnellinfo" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.75)", lineHeight: "1.7" }}>{data.schnellinfo.zusammenfassung}</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "8px" }}>
                  {[
                    { label: "KOSTEN",        value: data.schnellinfo.kosten,        color: KOSTENCOLOR[data.schnellinfo.kosten]        || "#94a3b8" },
                    { label: "SCHWIERIGKEIT", value: data.schnellinfo.schwierigkeit, color: SCHWIERCOLOR[data.schnellinfo.schwierigkeit] || "#94a3b8" },
                    { label: "ZEITAUFWAND",   value: data.schnellinfo.zeitaufwand,   color: accentColor },
                    { label: "TEAM",          value: data.schnellinfo.team,          color: "#a855f7" },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "10px 12px" }}>
                      <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "8px", letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", marginBottom: "5px" }}>{label}</div>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "13px", fontWeight: 700, color }}>{value}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)", marginBottom: "8px" }}>WICHTIGE PUNKTE</div>
                  {data.schnellinfo.punkte.map((p, i) => (
                    <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                      <span style={{ color: accentColor, fontSize: "14px", flexShrink: 0 }}>▸</span>
                      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: "1.5" }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tab === "breakdown" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {data.breakdown.map((phase, pi) => (
                  <div key={pi} style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", overflow: "hidden" }}>
                    <div style={{ padding: "10px 14px", background: `linear-gradient(90deg, ${accentColor}18, rgba(255,255,255,0.03))`, display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: accentColor, color: "#000", fontFamily: "'Orbitron', sans-serif", fontSize: "10px", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{pi + 1}</div>
                      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "14px", fontWeight: 700, color: "white" }}>{phase.phase}</span>
                    </div>
                    <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: "7px" }}>
                      {phase.schritte.map((s, si) => (
                        <div key={si} style={{ display: "flex", gap: "10px" }}>
                          <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", color: accentColor, fontWeight: 700, flexShrink: 0, marginTop: "3px" }}>{String(si+1).padStart(2,"0")}</span>
                          <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: "1.5" }}>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {tab === "diagramm" && (
              <div>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "10px", letterSpacing: "0.15em", color: accentColor, marginBottom: "16px" }}>{data.diagramm.titel.toUpperCase()}</div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  {data.diagramm.schritte.map((s, i) => {
                    const ds = DIAG_STYLE[s.typ] || DIAG_STYLE.prozess;
                    return (
                      <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                        <div style={{ width: "100%", maxWidth: "380px", background: ds.bg, border: `1.5px solid ${ds.border}`, borderRadius: ds.shape, padding: "10px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                            <div>
                              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "13px", fontWeight: 700, color: ds.color }}>
                                {s.typ==="start"?"● ":s.typ==="ergebnis"?"★ ":s.typ==="entscheidung"?"⬡ ":"▶ "}{s.label}
                              </div>
                              {s.notiz && <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>{s.notiz}</div>}
                            </div>
                            <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "8px", color: ds.color, opacity: 0.7, flexShrink: 0 }}>{s.typ.toUpperCase()}</span>
                          </div>
                        </div>
                        {i < data.diagramm.schritte.length - 1 && (
                          <div style={{ height: "18px", width: "2px", background: `linear-gradient(to bottom, ${ds.border}, rgba(255,255,255,0.08))`, position: "relative" }}>
                            <div style={{ position: "absolute", bottom: "-4px", left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "7px solid rgba(255,255,255,0.2)" }} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  {Object.entries(DIAG_STYLE).map(([typ, ds]) => (
                    <div key={typ} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: ds.bg, border: `1px solid ${ds.border}` }} />
                      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>{typ}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tab === "referenzen" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {data.referenzen.map((r, i) => {
                  const color = REF_COLORS[r.typ] || "#94a3b8";
                  return (
                    <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none", border: "1px solid rgba(255,255,255,0.07)", borderLeft: `3px solid ${color}`, borderRadius: "8px", padding: "12px 14px", background: "rgba(255,255,255,0.02)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "8px", fontWeight: 700, color, background: `${color}18`, border: `1px solid ${color}44`, borderRadius: "4px", padding: "2px 6px" }}>{r.typ.toUpperCase()}</span>
                        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "13px", fontWeight: 700, color: "white" }}>{r.titel}</span>
                        <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.2)", fontSize: "14px" }}>↗</span>
                      </div>
                      <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.45)", margin: "0 0 4px" }}>{r.beschreibung}</p>
                      <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "10px", color: `${color}99`, margin: 0, wordBreak: "break-all" }}>{r.url}</p>
                    </a>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
