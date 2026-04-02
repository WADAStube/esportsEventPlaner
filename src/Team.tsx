import { useState } from "react";
import { usePlanner } from "./PlannerContext";
import { TEAM_MEMBERS, ROLES, PROFESSORS } from "./data";

const COLOR_MAP: Record<string, string> = {
  Leadership: "#a855f7",
  Technical:  "#00e5ff",
  Creative:   "#f97316",
  Talent:     "#22c55e",
};

function RolePicker({ memberId, onClose }: { memberId: string; onClose: () => void }) {
  const { assignments, setAssignment } = usePlanner();
  const assignedIds = assignments[memberId] || [];
  const categories = ["Leadership", "Technical", "Creative", "Talent"] as const;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "16px",
    }} onClick={onClose}>
      <div style={{
        background: "#13131f",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "16px",
        padding: "24px",
        maxWidth: "480px",
        width: "100%",
        maxHeight: "80vh",
        overflowY: "auto",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "13px", color: "#00e5ff", letterSpacing: "0.2em" }}>
            ROLLE AUSWÄHLEN
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "18px" }}>✕</button>
        </div>
        {categories.map(cat => (
          <div key={cat} style={{ marginBottom: "16px" }}>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", color: COLOR_MAP[cat], letterSpacing: "0.2em", marginBottom: "8px" }}>
              — {cat.toUpperCase()}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {ROLES.filter(r => r.category === cat).map(role => {
                const isAssigned = assignedIds.includes(role.id);
                const color = COLOR_MAP[cat];
                return (
                  <button
                    key={role.id}
                    onClick={() => setAssignment(memberId, role.id)}
                    style={{
                      background: isAssigned ? `${color}20` : "rgba(255,255,255,0.03)",
                      border: `1px solid ${isAssigned ? color : "rgba(255,255,255,0.08)"}`,
                      borderRadius: "8px",
                      padding: "10px 14px",
                      color: isAssigned ? color : "rgba(255,255,255,0.7)",
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "left",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>{role.title}</span>
                    {isAssigned && <span style={{ fontSize: "12px" }}>✓ ZUGEWIESEN</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MemberCard({ member }: { member: (typeof TEAM_MEMBERS)[0] }) {
  const { assignments, setAssignment } = usePlanner();
  const [pickerOpen, setPickerOpen] = useState(false);
  const assignedIds = assignments[member.id] || [];
  const assignedRoles = assignedIds.map(id => ROLES.find(r => r.id === id)).filter(Boolean) as typeof ROLES;
  const initial = member.name.split(",")[0]?.[0] ?? "?";

  return (
    <>
      {pickerOpen && <RolePicker memberId={member.id} onClose={() => setPickerOpen(false)} />}
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "12px",
        padding: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.2)",
            color: "#00e5ff", fontFamily: "'Orbitron', sans-serif", fontSize: "14px", fontWeight: 700,
            flexShrink: 0,
          }}>{initial}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "14px", fontWeight: 700, color: "white" }}>
              {member.name}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
              {(member.interests || []).slice(0, 2).map(i => (
                <span key={i} style={{
                  fontSize: "9px", padding: "2px 6px", borderRadius: "4px",
                  background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)",
                }}>{i}</span>
              ))}
            </div>
          </div>
        </div>

        {assignedRoles.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "10px" }}>
            {assignedRoles.map(role => {
              const color = COLOR_MAP[role.category];
              return (
                <div key={role.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: `${color}12`, border: `1px solid ${color}33`,
                  borderRadius: "6px", padding: "6px 10px",
                }}>
                  <div>
                    <div style={{ fontSize: "8px", color, fontFamily: "'Orbitron', sans-serif", letterSpacing: "0.15em", fontWeight: 700 }}>
                      {role.category.toUpperCase()}
                    </div>
                    <div style={{ fontSize: "12px", color: "white", fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>
                      {role.title}
                    </div>
                  </div>
                  <button
                    onClick={() => setAssignment(member.id, role.id)}
                    style={{ background: "none", border: "none", color: "rgba(255,100,100,0.7)", cursor: "pointer", fontSize: "12px", padding: "0 4px" }}
                  >✕</button>
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={() => setPickerOpen(true)}
          style={{
            width: "100%",
            background: "transparent",
            border: "1px dashed rgba(0,229,255,0.25)",
            borderRadius: "8px",
            padding: "8px",
            color: "rgba(0,229,255,0.6)",
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "10px",
            letterSpacing: "0.15em",
            cursor: "pointer",
          }}
        >
          {assignedRoles.length > 0 ? "+ WEITERE ROLLE" : "+ ROLLE ZUWEISEN"}
        </button>
      </div>
    </>
  );
}

export default function Team() {
  const { clearAllAssignments } = usePlanner();

  return (
    <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1rem 4rem" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h2 style={{
            fontFamily: "'Orbitron', sans-serif", fontSize: "24px", fontWeight: 900,
            background: "linear-gradient(90deg, #fff, #00e5ff)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            marginBottom: "6px",
          }}>Team &amp; Rollen</h2>
          <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
            Rolle zuweisen → auf "+ ROLLE ZUWEISEN" klicken. Mehrere Rollen pro Person möglich.
          </p>
        </div>
        <button
          onClick={clearAllAssignments}
          style={{
            fontFamily: "'Rajdhani', sans-serif", fontSize: "12px",
            padding: "8px 14px", borderRadius: "8px", cursor: "pointer",
            background: "transparent", color: "rgba(255,80,80,0.8)",
            border: "1px solid rgba(255,80,80,0.3)",
          }}
        >ALLE ZURÜCKSETZEN</button>
      </div>

      <div style={{ marginBottom: "28px" }}>
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "10px", letterSpacing: "0.2em", color: "rgba(168,85,247,0.75)", marginBottom: "12px" }}>
          — DOZENTEN (FESTE ROLLEN)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
          {PROFESSORS.map(p => (
            <div key={p.id} style={{
              background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.2)",
              borderRadius: "12px", padding: "16px",
              display: "flex", alignItems: "center", gap: "12px",
            }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.35)",
                color: "#a855f7", fontFamily: "'Orbitron', sans-serif", fontSize: "14px", fontWeight: 700,
              }}>D</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "4px" }}>
                  {p.name}
                </div>
                <span style={{
                  fontSize: "10px", padding: "2px 8px", borderRadius: "4px",
                  background: "rgba(168,85,247,0.15)", color: "#a855f7",
                  fontFamily: "'Rajdhani', sans-serif",
                }}>{p.role}</span>
              </div>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "8px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em" }}>DOZENT</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "10px", letterSpacing: "0.2em", color: "rgba(0,229,255,0.6)", marginBottom: "12px" }}>
          — STUDIERENDE (13 PERSONEN)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "12px" }}>
          {TEAM_MEMBERS.map(m => <MemberCard key={m.id} member={m} />)}
        </div>
      </div>
    </div>
  );
}
