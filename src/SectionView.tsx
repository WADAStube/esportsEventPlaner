import { useState } from "react";
import { useLocation } from "wouter";
import { usePlanner, AIGeneratedCard } from "./PlannerContext";
import { SECTIONS, PlanningSection, SectionOption } from "./data";
import AIInfoPanel from "./AIInfoPanel";

const COLOR_MAP: Record<string, { accent: string; border: string; bg: string; badgeBg: string; badgeCol: string }> = {
  purple: { accent: "#a855f7", border: "rgba(168,85,247,0.4)", bg: "rgba(168,85,247,0.08)", badgeBg: "rgba(168,85,247,0.2)", badgeCol: "#c084fc" },
  teal:   { accent: "#00e5ff", border: "rgba(0,229,255,0.35)",  bg: "rgba(0,229,255,0.07)",   badgeBg: "rgba(0,229,255,0.15)",   badgeCol: "#00e5ff" },
  coral:  { accent: "#f97316", border: "rgba(249,115,22,0.4)",  bg: "rgba(249,115,22,0.07)",  badgeBg: "rgba(249,115,22,0.18)",  badgeCol: "#fb923c" },
  amber:  { accent: "#f59e0b", border: "rgba(245,158,11,0.4)",  bg: "rgba(245,158,11,0.07)",  badgeBg: "rgba(245,158,11,0.18)",  badgeCol: "#fbbf24" },
  blue:   { accent: "#3b82f6", border: "rgba(59,130,246,0.4)",  bg: "rgba(59,130,246,0.07)",  badgeBg: "rgba(59,130,246,0.18)",  badgeCol: "#60a5fa" },
};

async function callOpenAI(prompt: string): Promise<string> {
  const apiKey = localStorage.getItem("openai_key");
  if (!apiKey) throw new Error("NO_KEY");
  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
    body: JSON.stringify({ model: "gpt-4o", max_tokens: 800, messages: [{ role: "user", content: prompt }] }),
  });
  if (!resp.ok) throw new Error("API_ERROR");
  const json = await resp.json();
  const raw = json.choices?.[0]?.message?.content || "{}";
  return raw.trim().replace(/^```json\s*/, "").replace(/```\s*$/, "");
}

// ── Option Card ─────────────────────────────────────────────────────────────
function OptionCard({ opt, sectionId, sectionTitle }: { opt: SectionOption; sectionId: string; sectionTitle: string }) {
  const { selectedOptions, selectedSubs, setOption, toggleSub } = usePlanner();
  const [expanded, setExpanded] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const c = COLOR_MAP[opt.color];
  const isSelected = (selectedOptions[sectionId] || []).includes(opt.id);

  return (
    <div style={{ borderRadius: "12px", border: isSelected ? `1.5px solid ${c.accent}` : "1.5px solid rgba(255,255,255,0.08)", background: isSelected ? c.bg : "rgba(255,255,255,0.02)", boxShadow: isSelected ? `0 0 18px ${c.accent}28` : "none" }}>
      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "10px", letterSpacing: "0.15em", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", background: c.badgeBg, color: c.badgeCol }}>{opt.badge.toUpperCase()}</span>
              {isSelected && <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", letterSpacing: "0.12em", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", background: "rgba(0,229,255,0.15)", color: "#00e5ff" }}>✓ GEWÄHLT</span>}
            </div>
            <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "16px", fontWeight: 700, color: "white", marginBottom: "4px" }}>{opt.label}</h3>
            <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: "1.5" }}>{opt.short}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "8px" }}>
              <span style={{ fontSize: "10px" }}>👥</span>
              <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{opt.teamSize}</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0 }}>
            <button onClick={() => setOption(sectionId, opt.id)} style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", border: `1.5px solid ${c.accent}`, background: isSelected ? c.accent : "transparent", color: isSelected ? "#0a0a12" : c.accent, boxShadow: isSelected ? `0 0 12px ${c.accent}55` : "none" }}>
              {isSelected ? "GEWÄHLT ✓" : "WÄHLEN"}
            </button>
            <button onClick={() => setExpanded(p => !p)} style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.4)" }}>
              {expanded ? "WENIGER ▲" : "DETAILS ▼"}
            </button>
            <button onClick={() => setShowAI(p => !p)} style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", border: showAI ? `1px solid ${c.accent}55` : "1px solid rgba(255,255,255,0.08)", background: showAI ? `${c.accent}18` : "rgba(255,255,255,0.03)", color: showAI ? c.accent : "rgba(255,255,255,0.35)" }}>
              🤖 KI-INFO
            </button>
          </div>
        </div>
      </div>

      {showAI && (
        <div style={{ padding: "0 20px 16px" }}>
          <AIInfoPanel section={sectionTitle} optionLabel={opt.label} optionDesc={opt.short} accentColor={c.accent} onClose={() => setShowAI(false)} />
        </div>
      )}

      {expanded && (
        <div style={{ padding: "0 20px 20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ paddingTop: "16px" }}>
            {opt.details.map((d, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <span style={{ color: c.accent, marginTop: "2px", flexShrink: 0 }}>▸</span>
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: "1.5" }}>{d}</span>
              </div>
            ))}
            {opt.subs.length > 0 && (
              <div style={{ marginTop: "16px" }}>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.35)", marginBottom: "10px" }}>DETAILS / VARIANTE</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {opt.subs.map(sub => {
                    const isSub = (selectedSubs[sectionId] || []).includes(sub.id);
                    return (
                      <button key={sub.id} onClick={() => toggleSub(sectionId, sub.id)} style={{ border: isSub ? `1px solid ${c.accent}` : "1px solid rgba(255,255,255,0.1)", background: isSub ? c.bg : "rgba(255,255,255,0.02)", borderRadius: "8px", padding: "10px 12px", cursor: "pointer", textAlign: "left" }}>
                        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "13px", fontWeight: 700, color: "white", marginBottom: "2px" }}>{isSub && <span style={{ color: c.accent }}>✓ </span>}{sub.label}</div>
                        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{sub.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── AI Generated Card ────────────────────────────────────────────────────────
function AIGeneratedOptionCard({ card, sectionId }: { card: AIGeneratedCard; sectionId: string }) {
  const { selectedOptions, setOption } = usePlanner();
  const [showAI, setShowAI] = useState(false);
  const c = COLOR_MAP[card.color] || COLOR_MAP.teal;
  const isSelected = (selectedOptions[sectionId] || []).includes("__custom__");

  return (
    <div style={{ borderRadius: "12px", border: isSelected ? `1.5px solid ${c.accent}` : `1.5px solid ${c.border}`, background: isSelected ? c.bg : "rgba(255,255,255,0.02)", boxShadow: isSelected ? `0 0 18px ${c.accent}28` : "none" }}>
      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "10px", letterSpacing: "0.1em", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", background: c.badgeBg, color: c.badgeCol }}>{card.badge.toUpperCase()}</span>
              <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", letterSpacing: "0.1em", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", background: "rgba(168,85,247,0.15)", color: "#c084fc" }}>🤖 KI-GENERIERT</span>
              {isSelected && <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", letterSpacing: "0.1em", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", background: "rgba(0,229,255,0.15)", color: "#00e5ff" }}>✓ GEWÄHLT</span>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span style={{ fontSize: "18px" }}>{card.icon}</span>
              <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "16px", fontWeight: 700, color: "white" }}>{card.label}</h3>
            </div>
            <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: "1.5" }}>{card.short}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "8px" }}>
              <span style={{ fontSize: "10px" }}>👥</span>
              <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{card.teamSize}</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0 }}>
            <button onClick={() => setOption(sectionId, "__custom__")} style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", border: `1.5px solid ${c.accent}`, background: isSelected ? c.accent : "transparent", color: isSelected ? "#0a0a12" : c.accent, boxShadow: isSelected ? `0 0 12px ${c.accent}55` : "none" }}>
              {isSelected ? "GEWÄHLT ✓" : "WÄHLEN"}
            </button>
            <button onClick={() => setShowAI(p => !p)} style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", border: showAI ? `1px solid ${c.accent}55` : "1px solid rgba(255,255,255,0.08)", background: showAI ? `${c.accent}18` : "rgba(255,255,255,0.03)", color: showAI ? c.accent : "rgba(255,255,255,0.35)" }}>
              🤖 KI-INFO
            </button>
          </div>
        </div>
        <div style={{ marginTop: "12px" }}>
          {card.details.map((d, i) => (
            <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
              <span style={{ color: c.accent, flexShrink: 0, marginTop: "2px" }}>▸</span>
              <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: "1.5" }}>{d}</span>
            </div>
          ))}
        </div>
      </div>
      {showAI && (
        <div style={{ padding: "0 20px 16px" }}>
          <AIInfoPanel section="Eigene Idee" optionLabel={card.label} optionDesc={card.short} accentColor={c.accent} onClose={() => setShowAI(false)} />
        </div>
      )}
    </div>
  );
}

// ── Custom Option Card ───────────────────────────────────────────────────────
function CustomOptionCard({ section }: { section: PlanningSection }) {
  const { customText, setCustomText, selectedOptions, setOption, aiGeneratedOptions, setAIGeneratedOption } = usePlanner();
  const [showInput, setShowInput] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");
  const text = customText[section.id] || "";
  const isSelected = (selectedOptions[section.id] || []).includes("__custom__");
  const aiCard = aiGeneratedOptions[section.id];

  function handleSuggestion(s: string) { setCustomText(section.id, s); setShowInput(true); }

  async function generateCard() {
    if (!text.trim()) return;
    setGenerating(true); setGenError("");
    const prompt = `Du bist ein E-Sports Event-Experte. Ein Team möchte folgende eigene Idee für den Bereich "${section.title}" umsetzen:\n\n"${text}"\n\nErstelle eine strukturierte Optionskarte auf DEUTSCH. Antworte NUR mit diesem JSON:\n{"label":"Kurzer Name (max 4 Wörter)","badge":"1-2 Wörter","short":"Eine Zeile Beschreibung","details":["5 konkrete Punkte"],"teamSize":"z.B. 3-4 Personen empfohlen","icon":"Emoji","color":"teal|purple|coral|amber|blue"}`;
    try {
      const raw = await callOpenAI(prompt);
      const card = JSON.parse(raw) as AIGeneratedCard;
      setAIGeneratedOption(section.id, card);
      setShowInput(false);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "";
      if (msg === "NO_KEY") setGenError("Kein API Key. Tragt euren OpenAI Key zuerst unter 'Unser Plan' ein.");
      else setGenError("Fehler beim Generieren. Nochmal versuchen.");
    } finally {
      setGenerating(false);
    }
  }

  if (aiCard && !showInput) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <AIGeneratedOptionCard card={aiCard} sectionId={section.id} />
        <button onClick={() => setShowInput(true)} style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "rgba(255,255,255,0.3)" }}>✏ IDEE ÄNDERN</button>
      </div>
    );
  }

  return (
    <div style={{ borderRadius: "12px", border: isSelected ? "1.5px solid rgba(255,255,255,0.35)" : "1.5px dashed rgba(255,255,255,0.12)", background: isSelected ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.01)" }}>
      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "10px", letterSpacing: "0.12em", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}>EIGENE IDEE</span>
              {isSelected && <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", letterSpacing: "0.1em", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", background: "rgba(0,229,255,0.15)", color: "#00e5ff" }}>✓ GEWÄHLT</span>}
            </div>
            <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "4px" }}>Eigene Option hinzufügen</h3>
            <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: "1.5" }}>Habt ihr eine eigene Idee? Die KI macht automatisch eine vollständige Karte daraus.</p>
          </div>
          <button onClick={() => setShowInput(p => !p)} style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", padding: "8px 14px", borderRadius: "6px", cursor: "pointer", border: "1.5px solid rgba(255,255,255,0.15)", background: "transparent", color: "rgba(255,255,255,0.5)", flexShrink: 0 }}>
            {showInput ? "SCHLIESSEN" : "ÖFFNEN"}
          </button>
        </div>

        {showInput && (
          <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)", marginBottom: "8px" }}>VORSCHLÄGE</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {section.suggestions.map((s, i) => (
                  <button key={i} onClick={() => handleSuggestion(s)} style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "12px", padding: "5px 12px", borderRadius: "20px", cursor: "pointer", background: text === s ? "rgba(0,229,255,0.15)" : "rgba(255,255,255,0.05)", color: text === s ? "#00e5ff" : "rgba(255,255,255,0.55)", border: text === s ? "1px solid rgba(0,229,255,0.4)" : "1px solid rgba(255,255,255,0.1)" }}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)", marginBottom: "8px" }}>EIGENER TEXT</div>
              <textarea value={text} onChange={e => setCustomText(section.id, e.target.value)} rows={3} placeholder="Beschreibt eure eigene Idee — die KI macht daraus automatisch eine vollständige Karte..." style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px", padding: "10px 14px", color: "white", fontFamily: "'Rajdhani', sans-serif", fontSize: "13px", resize: "none", outline: "none" }} />
            </div>
            {genError && <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "12px", color: "#ef4444" }}>{genError}</p>}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button onClick={generateCard} disabled={!text.trim() || generating} style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", padding: "8px 16px", borderRadius: "6px", cursor: !text.trim() || generating ? "not-allowed" : "pointer", border: "1.5px solid rgba(168,85,247,0.4)", background: generating ? "rgba(168,85,247,0.05)" : "rgba(168,85,247,0.15)", color: "#c084fc", opacity: !text.trim() ? 0.4 : 1 }}>
                {generating ? "⟳ KI GENERIERT…" : "🤖 KI-KARTE ERSTELLEN"}
              </button>
              <button onClick={() => { if (text.trim()) setOption(section.id, "__custom__"); }} disabled={!text.trim()} style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", padding: "8px 16px", borderRadius: "6px", cursor: !text.trim() ? "not-allowed" : "pointer", border: "1.5px solid #00e5ff", background: isSelected ? "#00e5ff" : "transparent", color: isSelected ? "#0a0a12" : "#00e5ff", boxShadow: isSelected ? "0 0 12px #00e5ff44" : "none", opacity: !text.trim() ? 0.4 : 1 }}>
                {isSelected ? "GEWÄHLT ✓" : "OHNE KI BESTÄTIGEN"}
              </button>
              {isSelected && <button onClick={() => setOption(section.id, "__custom__")} style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", border: "1.5px solid rgba(255,80,80,0.3)", background: "transparent", color: "rgba(255,80,80,0.8)" }}>ENTFERNEN</button>}
            </div>
            <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>💡 KI-Karte: Die KI liest eure Idee und erstellt eine vollständige Karte — genauso wie alle anderen Optionen.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Notes Area ───────────────────────────────────────────────────────────────
function SectionNoteArea({ sectionId }: { sectionId: string }) {
  const { sectionNotes, setSectionNote } = usePlanner();
  const note = sectionNotes[sectionId] || "";
  const [expanded, setExpanded] = useState(!!note);

  return (
    <div style={{ marginTop: "16px", borderRadius: "12px", border: note ? "1px solid rgba(0,229,255,0.2)" : "1px dashed rgba(255,255,255,0.1)", background: note ? "rgba(0,229,255,0.03)" : "rgba(255,255,255,0.01)" }}>
      <button onClick={() => setExpanded(p => !p)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "transparent", border: "none", cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "14px" }}>📝</span>
          <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", color: note ? "#00e5ff" : "rgba(255,255,255,0.35)", letterSpacing: "0.15em" }}>
            NOTIZEN FÜR DIESEN BEREICH
          </span>
          {note && <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "11px", color: "rgba(0,229,255,0.5)" }}>({note.length} Zeichen gespeichert)</span>}
        </div>
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>{expanded ? "▲" : "▼"}</span>
      </button>
      {expanded && (
        <div style={{ padding: "0 16px 16px" }}>
          <textarea
            value={note}
            onChange={e => setSectionNote(sectionId, e.target.value)}
            rows={5}
            placeholder={"Was haben wir in diesem Bereich besprochen?\nWelche Fragen sind noch offen?\nBesondere Anforderungen, Links, Kontakte..."}
            style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "12px 14px", color: "white", fontFamily: "'Rajdhani', sans-serif", fontSize: "14px", lineHeight: "1.6", resize: "vertical", outline: "none" }}
          />
          {note && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "6px" }}>
              <button onClick={() => setSectionNote(sectionId, "")}
                style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", color: "rgba(255,80,80,0.5)", background: "transparent", border: "1px solid rgba(255,80,80,0.15)", borderRadius: "5px", padding: "3px 10px", cursor: "pointer", letterSpacing: "0.1em" }}>
                LÖSCHEN
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Section View ────────────────────────────────────────────────────────
export default function SectionView() {
  const [, navigate] = useLocation();
  const { activeSectionId, setActiveSectionId, selectedOptions } = usePlanner();
  const section = SECTIONS.find(s => s.id === activeSectionId) ?? SECTIONS[0];
  const idx = SECTIONS.findIndex(s => s.id === section.id);

  function goTo(newId: string) { setActiveSectionId(newId); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function goPrev() { if (idx > 0) goTo(SECTIONS[idx - 1].id); else navigate("/plan"); }
  function goNext() { if (idx < SECTIONS.length - 1) goTo(SECTIONS[idx + 1].id); else navigate("/plan"); }

  // Keyboard navigation
  useState(() => {
    const handler = (e: KeyboardEvent) => {
      // Only when not typing in an input/textarea
      if (["INPUT","TEXTAREA","SELECT"].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft")  goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const selectedCount = (selectedOptions[section.id]?.length ?? 0);

  return (
    <div style={{ maxWidth: "768px", margin: "0 auto", padding: "0 16px 64px" }}>

      {/* Section header */}
      <div style={{ marginBottom: "28px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px",
          fontFamily: "'Orbitron', sans-serif", fontSize: "9px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em" }}>
          <span>{idx + 1}</span>
          <span>/</span>
          <span>{SECTIONS.length}</span>
          <span style={{ margin: "0 4px", color: "rgba(255,255,255,0.1)" }}>—</span>
          {selectedCount > 0 && (
            <span style={{ color: "#00e5ff" }}>
              {selectedCount} OPTION{selectedCount > 1 ? "EN" : ""} GEWÄHLT ✓
            </span>
          )}
        </div>

        <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "22px", fontWeight: 900, color: "white", marginBottom: "6px" }}>
          {section.title}
        </h2>
        <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "15px", color: "rgba(255,255,255,0.5)", marginBottom: "4px" }}>
          {section.question}
        </p>
        <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.2)", marginTop: "2px" }}>
          Mehrfachauswahl möglich &nbsp;·&nbsp; ← → Pfeiltasten zum Navigieren &nbsp;·&nbsp; 🤖 KI-INFO auf jeder Karte
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {section.options.map(opt => (
          <OptionCard key={opt.id} opt={opt} sectionId={section.id} sectionTitle={section.title} />
        ))}
        <CustomOptionCard section={section} />
      </div>

      <SectionNoteArea sectionId={section.id} />

      {/* Navigation footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "32px", gap: "8px" }}>
        <button
          onClick={goPrev}
          style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em",
            padding: "9px 16px", borderRadius: "8px", cursor: "pointer",
            border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.4)" }}
        >
          ← {idx > 0 ? SECTIONS[idx - 1].title : "Unser Plan"}
        </button>

        {/* Section dots */}
        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", justifyContent: "center", flex: 1 }}>
          {SECTIONS.map((s, i) => {
            const done = (selectedOptions[s.id]?.length ?? 0) > 0;
            const active = i === idx;
            return (
              <div
                key={s.id}
                onClick={() => goTo(s.id)}
                style={{
                  width: active ? "20px" : "6px",
                  height: "6px",
                  borderRadius: "3px",
                  background: active ? "#00e5ff"
                    : done ? "rgba(0,229,255,0.45)"
                    : "rgba(255,255,255,0.12)",
                  cursor: "pointer",
                  transition: "all 0.25s",
                }}
                title={s.title}
              />
            );
          })}
        </div>

        <button
          onClick={goNext}
          style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em",
            padding: "9px 16px", borderRadius: "8px", cursor: "pointer",
            border: "1px solid rgba(0,229,255,0.35)", background: "rgba(0,229,255,0.1)", color: "#00e5ff" }}
        >
          {idx < SECTIONS.length - 1 ? SECTIONS[idx + 1].title : "Unser Plan →"} →
        </button>
      </div>
    </div>
  );
}
