import { usePlanner } from "./PlannerContext";
import { SECTIONS, ROLES, TEAM_MEMBERS, PROFESSORS } from "./data";
import { useLocation } from "wouter";
import GeneratePlan from "./GeneratePlan";

const COLOR_MAP: Record<string, string> = {
  purple: "#a855f7", teal: "#00e5ff", coral: "#f97316", amber: "#f59e0b", blue: "#3b82f6",
};
const ROLE_COLOR: Record<string, string> = {
  Leadership: "#a855f7", Technical: "#00e5ff", Creative: "#f97316", Talent: "#22c55e",
};

export default function Summary() {
  const [, navigate] = useLocation();
  const { selectedOptions, selectedSubs, customText, assignments, setActiveSectionId } = usePlanner();
  const decidedSections = SECTIONS.filter(s => (selectedOptions[s.id]?.length ?? 0) > 0).length;
  const progressPct = Math.round((decidedSections / SECTIONS.length) * 100);

  function goEdit(sectionId: string) {
    setActiveSectionId(sectionId);
    navigate("/");
  }

  return (
    <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "0 1rem 4rem" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px" }}>
        <div>
          <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "22px", fontWeight: 900, background: "linear-gradient(90deg, #fff, #00e5ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "4px" }}>
            Master-Plan
          </h2>
          <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>
            Die gesammelte Übersicht aller Entscheidungen.
          </p>
        </div>
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "22px", fontWeight: 900, color: progressPct === 100 ? "#00e5ff" : "#a855f7" }}>
          {progressPct}%
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "40px" }}>
        {SECTIONS.map(sec => {
          const selectedIds = selectedOptions[sec.id] || [];
          const secSubs = selectedSubs[sec.id] || [];
          const hasCustom = selectedIds.includes("__custom__");
          const regularIds = selectedIds.filter(id => id !== "__custom__");
          const decided = selectedIds.length > 0;

          return (
            <div key={sec.id} className="rounded-xl transition-all"
              style={{
                border: decided ? "1.5px solid rgba(0,229,255,0.2)" : "1px dashed rgba(255,255,255,0.08)",
                background: decided ? "rgba(0,229,255,0.04)" : "rgba(255,255,255,0.01)",
              }}>
              <div className="flex items-start justify-between gap-4 p-4">
                <div className="flex-1">
                  <div className="text-[10px] tracking-widest font-bold mb-2 uppercase"
                    style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Orbitron', sans-serif" }}>{sec.title}</div>
                  {decided ? (
                    <div className="space-y-2">
                      {regularIds.map(optId => {
                        const opt = sec.options.find(o => o.id === optId);
                        if (!opt) return null;
                        const accent = COLOR_MAP[opt.color];
                        const optSubs = opt.subs.filter(sub => secSubs.includes(sub.id));
                        return (
                          <div key={optId} className="rounded-lg p-3" style={{ background: `${accent}12`, borderLeft: `3px solid ${accent}` }}>
                            <div className="font-bold text-sm text-white" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                              {opt.label}
                              <span className="ml-2 text-[9px] tracking-widest px-1.5 py-0.5 rounded"
                                style={{ background: `${accent}22`, color: accent, fontFamily: "'Orbitron', sans-serif" }}>{opt.badge}</span>
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: "'Rajdhani', sans-serif" }}>👥 {opt.teamSize}</div>
                            {optSubs.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {optSubs.map(sub => (
                                  <span key={sub.id} className="text-[10px] px-2 py-0.5 rounded"
                                    style={{ background: `${accent}18`, color: accent, fontFamily: "'Rajdhani', sans-serif" }}>{sub.label}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {hasCustom && customText[sec.id] && (
                        <div className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.04)", borderLeft: "3px solid rgba(255,255,255,0.3)" }}>
                          <div className="text-[9px] tracking-widest font-bold mb-1" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Orbitron', sans-serif" }}>EIGENE IDEE</div>
                          <div className="text-sm text-white" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{customText[sec.id]}</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600 italic" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Noch nicht entschieden</div>
                  )}
                </div>
                <button onClick={() => goEdit(sec.id)}
                  className="text-xs px-3 py-1.5 rounded shrink-0 transition-all"
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    background: "transparent",
                    color: decided ? "#00e5ff" : "rgba(255,255,255,0.3)",
                    border: `1px solid ${decided ? "rgba(0,229,255,0.3)" : "rgba(255,255,255,0.1)"}`,
                    cursor: "pointer",
                  }}>
                  {decided ? "BEARBEITEN" : "ENTSCHEIDEN →"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <h3 className="text-sm font-bold mb-4" style={{ fontFamily: "'Orbitron', sans-serif", color: "rgba(255,255,255,0.5)" }}>TEAM-ROLLEN</h3>

        <div className="mb-4">
          <div className="text-[9px] tracking-widest mb-2" style={{ color: "rgba(168,85,247,0.6)", fontFamily: "'Orbitron', sans-serif" }}>DOZENTEN</div>
          <div className="space-y-1.5">
            {PROFESSORS.map(p => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-300" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{p.name}</span>
                <span className="text-xs px-2 py-0.5 rounded"
                  style={{ background: "rgba(168,85,247,0.12)", color: "#a855f7", fontFamily: "'Rajdhani', sans-serif" }}>{p.role}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-[9px] tracking-widest mb-2" style={{ color: "rgba(0,229,255,0.5)", fontFamily: "'Orbitron', sans-serif" }}>STUDIERENDE</div>
        <div className="space-y-1.5">
          {TEAM_MEMBERS.map(member => {
            const roleIds = assignments[member.id] || [];
            const roles = roleIds.map(id => ROLES.find(r => r.id === id)).filter(Boolean) as typeof ROLES;
            return (
              <div key={member.id} className="flex items-start justify-between gap-3 text-sm py-0.5">
                <span className="text-gray-300 shrink-0" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{member.name}</span>
                {roles.length > 0 ? (
                  <div className="flex flex-wrap gap-1 justify-end">
                    {roles.map(role => {
                      const rColor = ROLE_COLOR[role.category];
                      return (
                        <span key={role.id} className="text-xs px-2 py-0.5 rounded"
                          style={{ background: `${rColor}18`, color: rColor, fontFamily: "'Rajdhani', sans-serif" }}>{role.title}</span>
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-xs text-gray-600 italic" style={{ fontFamily: "'Rajdhani', sans-serif" }}>nicht zugewiesen</span>
                )}
              </div>
            );
          })}
        </div>

        {Object.keys(assignments).length > 0 && (
          <button onClick={() => navigate("/team")}
            className="mt-4 text-xs px-3 py-1.5 rounded"
            style={{ fontFamily: "'Orbitron', sans-serif", background: "transparent", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}>
            ROLLEN BEARBEITEN →
          </button>
        )}
      </div>
      <GeneratePlan />
    </div>
  );
}
