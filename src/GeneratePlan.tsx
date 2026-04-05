import { useState } from "react";
import type React from "react";
import { usePlanner } from "./PlannerContext";
import { SECTIONS, ROLES, TEAM_MEMBERS } from "./data";

// ─── Types ─────────────────────────────────────────────────────────────────
interface WorkflowBereich {
  bereich: string;
  auswahl: string;
  was_das_bedeutet: string;
  zusammenspiel: string;
  aufgaben: string[];
  verantwortlich: string;
  hinweise: string[];
}
interface EventTagSchritt {
  uhrzeit: string;
  aktion: string;
  wer: string;
  details: string;
}
interface TeamAufgabe {
  name: string;
  rolle: string;
  aufgaben: string[];
  deadline: string;
  hinweise: string[];
}
interface Meilenstein {
  datum: string;
  titel: string;
  wer: string;
  aufgaben: string[];
  deliverable: string;
}
interface InternPlan {
  titel: string;
  zusammenfassung: string;
  produktions_workflow: WorkflowBereich[];
  event_tag_ablauf: EventTagSchritt[];
  team_aufgaben: TeamAufgabe[];
  meilensteine: Meilenstein[];
  checkliste: { kategorie: string; punkte: string[] }[];
  interne_hinweise: string[];
}
interface SponsorenPaket { name: string; was_wir_bieten: string[]; was_wir_brauchen: string; }
interface ExternPlan {
  projekt_titel: string;
  tagline: string;
  executive_summary: string;
  event_konzept: string;
  zielgruppe: string;
  event_highlights: string[];
  warum_mitmachen: string[];
  was_wir_leisten: string[];
  sponsoren_pakete: SponsorenPaket[];
  influencer_pitch: string;
  reichweite: string;
  unser_team: string;
  kontakt_cta: string;
  naechste_schritte: string[];
}
interface DualPlan {
  intern: InternPlan;
  extern: ExternPlan;
}
interface SavedPlan {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  plan: DualPlan;
  selectionsSnapshot: string;
}

// ─── API Key resolution ───────────────────────────────────────────────────────
// Priority: 1) Vite env var (set in Vercel → always works for everyone)
//           2) localStorage (fallback for local dev / manual entry)
const ENV_KEY = (import.meta as { env?: Record<string, string> }).env?.VITE_OPENAI_KEY ?? "";

function getStoredKey(): string {
  if (ENV_KEY && ENV_KEY.length > 20) return ENV_KEY;
  try { return localStorage.getItem("openai_key") || ""; } catch { return ""; }
}
function saveKey(k: string) {
  if (ENV_KEY) return; // env var takes priority, don't overwrite
  try { localStorage.setItem("openai_key", k); } catch {}
}
function clearKey() {
  if (ENV_KEY) return;
  try { localStorage.removeItem("openai_key"); } catch {}
}
const STORAGE_KEY = "esports_saved_plans";

function loadSavedPlans(): SavedPlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function persistPlans(plans: SavedPlan[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}
function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("de-DE", {
    weekday: "short", day: "2-digit", month: "short",
    year: "numeric", hour: "2-digit", minute: "2-digit"
  });
}
function formatDateShort(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

// ─── Colours ────────────────────────────────────────────────────────────────
const C = { cyan:"#00e5ff", purple:"#a855f7", amber:"#f59e0b", coral:"#f97316", green:"#22c55e", blue:"#3b82f6" };
const BEREICH_COLORS = ["#00e5ff","#a855f7","#f59e0b","#f97316","#22c55e","#3b82f6","#ec4899","#14b8a6","#8b5cf6","#f43f5e"];

// ─── API call (non-streaming, reliable) ────────────────────────────────────
async function callGPT(apiKey: string, prompt: string, maxTokens = 2000): Promise<string> {
  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-4o",
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!resp.ok) {
    const j = await resp.json().catch(()=>({}));
    const msg = j.error?.message || resp.statusText;
    if (resp.status === 401) throw new Error("API_401");
    if (resp.status === 429) throw new Error("API_429");
    throw new Error(`API_${resp.status}: ${msg}`);
  }
  const data = await resp.json();
  const content = data.choices?.[0]?.message?.content || "";
  return content.replace(/```json\s*/g,"").replace(/```\s*$/g,"").trim();
}

function parseJSON<T>(raw: string): T {
  // Strip any markdown fences and trim
  let cleaned = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/g, "").trim();
  // Find first { and last } to extract just the JSON object
  const start = cleaned.indexOf("{");
  const end   = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    cleaned = cleaned.slice(start, end + 1);
  }
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error("JSON_PARSE");
  }
}

// ─── Build context string ───────────────────────────────────────────────────
function buildContext(
  selectedOptions: Record<string,string[]>,
  selectedSubs: Record<string,string[]>,
  customText: Record<string,string>,
  assignments: Record<string,string[]>
): { selectionText: string; teamText: string; unassigned: string } {
  const memberNames: Record<string,string> = {};
  TEAM_MEMBERS.forEach(m => { memberNames[m.id] = m.name; });
  const roleNames: Record<string,string> = {};
  ROLES.forEach(r => { roleNames[r.id] = r.title; });

  const selections: Record<string,{label:string;subs:string[]}[]> = {};
  for (const sec of SECTIONS) {
    const ids = selectedOptions[sec.id] || [];
    if (!ids.length) continue;
    selections[sec.title] = ids.map(id => {
      if (id === "__custom__") return { label:`Eigene Idee: ${customText[sec.id]||""}`, subs:[] };
      const opt = sec.options.find(o=>o.id===id);
      const subs = (selectedSubs[sec.id]||[]).filter(sid=>opt?.subs.find(s=>s.id===sid)).map(sid=>opt?.subs.find(s=>s.id===sid)?.label||sid);
      return { label:opt?.label||id, subs };
    });
  }

  const selectionText = Object.entries(selections)
    .map(([s,opts])=>`${s}: ${opts.map(o=>`${o.label}${o.subs.length?` (${o.subs.join(", ")})`:"" }`).join(", ")}`)
    .join("\n");

  const teamText = Object.entries(assignments)
    .map(([mid,rids])=>`${memberNames[mid]||mid}: ${rids.map(r=>roleNames[r]||r).join(", ")}`)
    .join("\n");

  const unassigned = TEAM_MEMBERS.filter(m=>!Object.keys(assignments).includes(m.id)).map(m=>m.name).join(", ");

  return { selectionText: selectionText||"Noch keine Auswahl.", teamText: teamText||"Keine Zuweisungen.", unassigned: unassigned||"alle zugewiesen" };
}

// ─── API Key Modal ──────────────────────────────────────────────────────────
function ApiKeyModal({ onSave }: { onSave: (k: string) => void }) {
  const [val, setVal] = useState("");
  const save = () => { const k=val.trim(); if(k.length>20){ saveKey(k); onSave(k); } };
  return (
    <div style={{ padding:"20px", background:"rgba(0,229,255,0.04)", border:"1px solid rgba(0,229,255,0.15)", borderRadius:"14px", marginBottom:"20px" }}>
      <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"10px", color:C.cyan, letterSpacing:"0.2em", marginBottom:"10px" }}>— OPENAI API KEY EINRICHTEN</div>
      <p style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:"13px", color:"rgba(255,255,255,0.5)", marginBottom:"12px", lineHeight:"1.6" }}>
        Einmalig euren OpenAI Key eingeben — wird nur lokal gespeichert.{" "}
        <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener" style={{ color:C.cyan }}>platform.openai.com/api-keys</a>
      </p>
      <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
        <input type="password" placeholder="sk-..." value={val} onChange={e=>setVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&save()}
          style={{ flex:1, minWidth:"200px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:"8px", padding:"9px 12px", color:"white", fontFamily:"'Rajdhani',sans-serif", fontSize:"14px" }} />
        <button onClick={save} style={{ background:"rgba(0,229,255,0.15)", border:"1px solid rgba(0,229,255,0.35)", borderRadius:"8px", padding:"9px 18px", color:C.cyan, fontFamily:"'Orbitron',sans-serif", fontSize:"10px", fontWeight:700, cursor:"pointer", letterSpacing:"0.1em" }}>SPEICHERN</button>
      </div>
    </div>
  );
}

// ─── Kleine Helpers ─────────────────────────────────────────────────────────
function Tag({ label, color=C.cyan }: { label:string; color?:string }) {
  return <span style={{ display:"inline-block", background:`${color}18`, color, border:`1px solid ${color}28`, borderRadius:"6px", padding:"2px 8px", fontSize:"10px", fontFamily:"'Orbitron',sans-serif", letterSpacing:"0.05em" }}>{label}</span>;
}
function SH({ icon, title, sub, color=C.cyan }: { icon:string; title:string; sub?:string; color?:string }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"12px", marginTop:"20px" }}>
      <div style={{ width:"32px", height:"32px", borderRadius:"9px", background:`${color}18`, border:`1px solid ${color}35`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", flexShrink:0 }}>{icon}</div>
      <div>
        <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"10px", fontWeight:900, color, letterSpacing:"0.12em" }}>{title}</div>
        {sub&&<div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:"11px", color:"rgba(255,255,255,0.3)", marginTop:"1px" }}>{sub}</div>}
      </div>
    </div>
  );
}
function Card({ children, accent="rgba(255,255,255,0.025)", border="rgba(255,255,255,0.07)" }: { children:React.ReactNode; accent?:string; border?:string }) {
  return <div style={{ background:accent, border:`1px solid ${border}`, borderRadius:"10px", padding:"12px 16px", marginBottom:"9px" }}>{children}</div>;
}
function Bul({ text, color=C.cyan }: { text:string; color?:string }) {
  return (
    <div style={{ display:"flex", gap:"8px", alignItems:"flex-start", marginBottom:"5px" }}>
      <span style={{ color, marginTop:"4px", flexShrink:0, fontSize:"8px" }}>▸</span>
      <span style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:"13px", color:"rgba(255,255,255,0.8)", lineHeight:"1.5" }}>{text}</span>
    </div>
  );
}
function PdfBtn({ label, onClick }: { label:string; onClick:()=>void }) {
  return (
    <button onClick={onClick} style={{ display:"flex", alignItems:"center", gap:"6px", background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.3)", borderRadius:"8px", padding:"8px 16px", cursor:"pointer", fontFamily:"'Orbitron',sans-serif", fontSize:"10px", fontWeight:700, color:C.green, letterSpacing:"0.08em" }}>
      ↓ {label}
    </button>
  );
}

// ─── PDF helpers ─────────────────────────────────────────────────────────────
async function fetchLogoBase64(): Promise<string> {
  try {
    const r = await fetch(`${window.location.origin}/hsel-logo.png`);
    if (!r.ok) return "";
    const blob = await r.blob();
    return new Promise<string>(res => { const fr=new FileReader(); fr.onloadend=()=>res(fr.result as string); fr.readAsDataURL(blob); });
  } catch { return ""; }
}
function esc(s:string){ return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

function openPDF(html: string) {
  // Blob URL approach — works on iOS/Android (no popup needed)
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href   = url;
  a.target = "_blank";
  a.rel    = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Revoke after a delay to allow the browser to load it
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

function pdfCard(content:string, col="#0ea5e9"): string {
  return `<div style="break-inside:avoid;page-break-inside:avoid;margin-bottom:7px;background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid ${col};border-radius:0 7px 7px 0;padding:10px 12px">${content}</div>`;
}
function pdfBul(text:string): string {
  return `<div style="margin-bottom:3px;font-size:10.5px;color:#334155;line-height:1.5;padding-left:12px;text-indent:-12px"><span style="color:#0ea5e9;font-weight:700">›</span> ${esc(text)}</div>`;
}
function pdfST(icon:string, title:string): string {
  return `<div class="st"><span class="b"></span>${icon} ${esc(title)}</div>`;
}

async function downloadInternPDF(plan: DualPlan) {
  const logo = await fetchLogoBase64();
  const students = TEAM_MEMBERS.map(m=>m.name).join(" · ");
  const milCols = ["#0ea5e9","#7c3aed","#059669","#d97706","#dc2626","#0891b2","#7c3aed","#16a34a","#ea580c","#8b5cf6"];
  const wfCols  = ["#0ea5e9","#7c3aed","#059669","#d97706","#dc2626","#0891b2","#ec4899","#14b8a6","#8b5cf6","#f43f5e"];

  const wfHtml = (plan.intern.produktions_workflow||[]).map((w,i)=>{
    const col=wfCols[i%wfCols.length];
    return `<div style="break-inside:avoid;page-break-inside:avoid;margin-bottom:10px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:7px;overflow:hidden">
<div style="background:${col}10;border-bottom:2px solid ${col}25;padding:9px 12px">
<div style="font-size:8px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${col};margin-bottom:2px">${esc(w.bereich)}</div>
<div style="font-size:12px;font-weight:700;color:#0f172a;margin-bottom:2px">${esc(w.auswahl)}</div>
<div style="font-size:10px;color:#475569;line-height:1.5">${esc(w.was_das_bedeutet)}</div>
</div>
<div style="padding:9px 12px">
<div style="font-size:9.5px;color:#5b21b6;margin-bottom:5px"><b>🔗 Zusammenspiel:</b> ${esc(w.zusammenspiel)}</div>
${w.aufgaben.map(a=>pdfBul(a)).join("")}
<table style="width:100%;border-collapse:collapse;margin-top:7px"><tbody><tr>
<td style="width:50%;vertical-align:top;padding-right:7px"><div style="font-size:8px;font-weight:700;color:#7c3aed;margin-bottom:3px">VERANTWORTLICH</div><div style="font-size:10px;color:#334155">${esc(w.verantwortlich)}</div></td>
${w.hinweise.length?`<td style="width:50%;vertical-align:top;padding-left:7px;border-left:1px solid #e2e8f0"><div style="font-size:8px;font-weight:700;color:#d97706;margin-bottom:3px">HINWEISE</div>${w.hinweise.map(h=>`<div style="font-size:9.5px;color:#475569;margin-bottom:2px;padding-left:11px;text-indent:-11px"><span style="color:#d97706">★</span> ${esc(h)}</div>`).join("")}</td>`:""}
</tr></tbody></table></div></div>`;
  }).join("");

  const etHtml = (plan.intern.event_tag_ablauf||[]).map(s=>
    `<div style="break-inside:avoid;page-break-inside:avoid;margin-bottom:5px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:5px;overflow:hidden;display:table;width:100%">
<table style="width:100%;border-collapse:collapse"><tbody><tr>
<td style="width:52px;vertical-align:top;text-align:center;padding:7px;background:#0f172a;border-radius:5px 0 0 5px"><div style="font-size:10px;font-weight:700;color:#00e5ff;font-family:monospace">${esc(s.uhrzeit)}</div></td>
<td style="vertical-align:top;padding:7px 11px"><div style="font-size:11px;font-weight:700;color:#0f172a;margin-bottom:1px">${esc(s.aktion)}</div><div style="font-size:9.5px;color:#475569;line-height:1.4">${esc(s.details)}</div></td>
<td style="width:auto;vertical-align:top;white-space:nowrap;padding:7px 9px;text-align:right"><div style="font-size:8.5px;font-weight:700;color:#7c3aed;background:#f3e8ff;border:1px solid #c084fc;border-radius:3px;padding:2px 5px;display:inline-block">${esc(s.wer)}</div></td>
</tr></tbody></table></div>`
  ).join("");

  const taHtml = plan.intern.team_aufgaben.map((t,i)=>{
    const col=milCols[i%milCols.length];
    return `<div style="break-inside:avoid;page-break-inside:avoid;margin-bottom:9px;background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid ${col};border-radius:0 7px 7px 0;padding:10px 12px">
<table style="width:100%;border-collapse:collapse;margin-bottom:7px"><tbody><tr>
<td><div style="font-size:12px;font-weight:700;color:#0f172a">${esc(t.name)}</div><div style="font-size:9px;font-weight:700;color:${col};margin-top:2px">${esc(t.rolle)}</div></td>
${t.deadline?`<td style="width:auto;vertical-align:top;text-align:right;white-space:nowrap;padding-left:8px"><div style="font-size:8.5px;font-weight:700;color:#0369a1;background:#e0f2fe;border-radius:3px;padding:2px 6px;display:inline-block">bis ${esc(t.deadline)}</div></td>`:""}
</tr></tbody></table>
<div style="font-size:8px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${col};border-bottom:1px solid ${col}20;padding-bottom:2px;margin-bottom:5px">AUFGABEN</div>
${t.aufgaben.map(a=>pdfBul(a)).join("")}
${t.hinweise.length?`<div style="margin-top:7px;font-size:8px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#d97706;border-bottom:1px solid #d9780620;padding-bottom:2px;margin-bottom:4px">HINWEISE</div>${t.hinweise.map(h=>`<div style="font-size:9.5px;color:#475569;margin-bottom:2px;padding-left:12px;text-indent:-12px"><span style="color:#d97706">★</span> ${esc(h)}</div>`).join("")}`:""}
</div>`;
  }).join("");

  const msHtml = plan.intern.meilensteine.map((m,i)=>{
    const col=milCols[i%milCols.length];
    return `<div style="break-inside:avoid;page-break-inside:avoid;margin-bottom:8px;background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid ${col};border-radius:0 7px 7px 0;padding:10px 12px">
<table style="width:100%;border-collapse:collapse;margin-bottom:6px"><tbody><tr>
<td style="width:28px;vertical-align:top;padding-right:8px"><div style="width:24px;height:24px;border-radius:50%;background:${col};color:white;text-align:center;line-height:24px;font-size:10px;font-weight:700">${i+1}</div></td>
<td><div style="font-size:8.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:${col};margin-bottom:1px">${esc(m.datum)}</div><div style="font-size:12px;font-weight:700;color:#0f172a">${esc(m.titel)}</div></td>
${m.wer?`<td style="width:auto;vertical-align:top;text-align:right;padding-left:7px;white-space:nowrap"><div style="font-size:8.5px;font-weight:700;color:#7c3aed;background:#f3e8ff;border:1px solid #c084fc;border-radius:3px;padding:2px 6px;display:inline-block">${esc(m.wer)}</div></td>`:""}
</tr></tbody></table>
<div style="padding-left:32px">${m.aufgaben.map(a=>pdfBul(a)).join("")}${m.deliverable?`<div style="margin-top:6px;padding:5px 8px;background:#fff;border:1px dashed #94a3b8;border-radius:4px"><span style="font-size:8px;font-weight:700;color:#0369a1;text-transform:uppercase;letter-spacing:.05em">Deliverable</span> <span style="font-size:10.5px;color:#1e40af;font-weight:600">${esc(m.deliverable)}</span></div>`:""}</div>
</div>`;
  }).join("");

  const clHtml = plan.intern.checkliste.map((cat,i)=>{
    const cols=["#7c3aed","#0ea5e9","#059669","#d97706","#dc2626"]; const col=cols[i%cols.length];
    return `<div style="break-inside:avoid;page-break-inside:avoid;margin-bottom:7px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:7px">
<div style="padding:6px 11px;background:${col}0e;border-bottom:1px solid ${col}20;border-radius:7px 7px 0 0"><div style="font-size:8px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${col}">${esc(cat.kategorie)}</div></div>
<div style="padding:8px 11px">${cat.punkte.map(p=>`<div style="margin-bottom:4px;padding-left:20px;text-indent:-20px;font-size:10.5px;color:#334155;line-height:1.5"><span style="display:inline-block;width:11px;height:11px;border:1.5px solid #94a3b8;border-radius:2px;vertical-align:middle;margin-right:8px"></span>${esc(p)}</div>`).join("")}</div></div>`;
  }).join("");

  const body = `
<div class="cover">
<div class="kicker">Hochschule Emden/Leer · Medientechnik · SS 2026 · INTERN</div>
<h1>${esc(plan.intern.titel)}</h1>
<div class="sub">Interner Produktionsplan — vertraulich</div>
<div class="sum">${esc(plan.intern.zusammenfassung)}</div>
</div>
${pdfST("⚙️","Produktions-Workflow — Alle Bereiche im Zusammenspiel")}${wfHtml}
${pdfST("🕐","Event-Tag Ablauf")}${etHtml}
${pdfST("👥","Team-Aufgaben")}${taHtml}
${pdfST("🏁","Meilensteine")}${msHtml}
${plan.intern.checkliste.length?pdfST("✅","Checklisten")+clHtml:""}
${plan.intern.interne_hinweise.length?pdfST("💡","Hinweise & Tipps")+pdfCard(plan.intern.interne_hinweise.map(h=>pdfBul(h)).join(""),"#f59e0b"):""}`;

  openPDF(pdfShell(logo, plan.intern.titel, `Interner Projektplan · ${formatDateShort(new Date().toISOString())}`, body, students));
}

async function downloadExternPDF(plan: DualPlan) {
  const logo = await fetchLogoBase64();
  const students = TEAM_MEMBERS.map(m=>m.name).join(" · ");
  const pakCols=["#0ea5e9","#7c3aed","#059669"];

  const hlHtml = plan.extern.event_highlights.map(h=>
    `<div style="display:inline-block;margin:3px;padding:6px 10px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:5px;font-size:10px;color:#334155">✦ ${esc(h)}</div>`
  ).join("");

  const pakHtml = plan.extern.sponsoren_pakete.map((p,i)=>{
    const col=pakCols[i%pakCols.length];
    return `<div style="break-inside:avoid;page-break-inside:avoid;margin-bottom:9px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:7px;overflow:hidden">
<div style="background:${col}12;border-bottom:2px solid ${col}28;padding:9px 12px;display:flex;justify-content:space-between;align-items:center">
<div style="font-family:'Source Serif 4',Georgia,serif;font-size:12px;font-weight:700;color:#0f172a">${esc(p.name)}</div>
<div style="font-size:8.5px;font-weight:700;color:${col};background:${col}12;border:1px solid ${col}35;border-radius:3px;padding:2px 7px">Wir brauchen: ${esc(p.was_wir_brauchen)}</div>
</div>
<div style="padding:9px 12px"><div style="font-size:8px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${col};margin-bottom:5px">WAS WIR BIETEN</div>${p.was_wir_bieten.map(item=>pdfBul(item)).join("")}</div>
</div>`;
  }).join("");

  const nsHtml = plan.extern.naechste_schritte.map((s,i)=>
    `<div style="break-inside:avoid;page-break-inside:avoid;margin-bottom:5px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:5px;padding:8px 11px;display:flex;align-items:flex-start;gap:9px">
<div style="width:20px;height:20px;border-radius:4px;background:#0f172a;color:white;text-align:center;line-height:20px;font-size:9px;font-weight:700;flex-shrink:0">${i+1}</div>
<div style="font-size:10.5px;color:#334155;line-height:1.5">${esc(s)}</div></div>`
  ).join("");

  const body = `
<div class="cover">
<div class="kicker">Hochschule Emden/Leer · Medientechnik · SS 2026</div>
<h1>${esc(plan.extern.projekt_titel)}</h1>
<div class="sub">&bdquo;${esc(plan.extern.tagline)}&ldquo;</div>
<div class="sum">${esc(plan.extern.executive_summary)}</div>
</div>
${pdfST("🎯","Eventkonzept")}${pdfCard(`<div style="font-size:11px;color:#334155;line-height:1.7">${esc(plan.extern.event_konzept)}</div>`,"#0ea5e9")}
<table style="width:100%;border-collapse:collapse;margin-bottom:10px"><tbody><tr>
<td style="width:50%;vertical-align:top;padding-right:5px">${pdfST("👥","Zielgruppe")}${pdfCard(`<div style="font-size:10.5px;color:#334155;line-height:1.6">${esc(plan.extern.zielgruppe)}</div>`,"#7c3aed")}</td>
<td style="width:50%;vertical-align:top;padding-left:5px">${pdfST("📡","Reichweite")}${pdfCard(`<div style="font-size:10.5px;color:#334155;line-height:1.6">${esc(plan.extern.reichweite)}</div>`,"#0ea5e9")}</td>
</tr></tbody></table>
${pdfST("⚡","Event-Highlights")}<div style="break-inside:avoid;margin-bottom:9px">${hlHtml}</div>
${pdfST("🏆","Warum mitmachen?")}${pdfCard(plan.extern.warum_mitmachen.map(w=>pdfBul(w)).join(""),"#059669")}
${pdfST("🎬","Was wir leisten")}${pdfCard(plan.extern.was_wir_leisten.map(w=>pdfBul(w)).join(""),"#0ea5e9")}
${pdfST("💎","Partner-Pakete")}${pakHtml}
${pdfST("📣","Für Influencer & Creator")}${pdfCard(`<div style="font-size:11px;color:#334155;line-height:1.7">${esc(plan.extern.influencer_pitch)}</div>`,"#7c3aed")}
${pdfST("👨‍🎓","Das Team")}${pdfCard(`<div style="font-size:11px;color:#334155;line-height:1.7">${esc(plan.extern.unser_team)}</div>`,"#0ea5e9")}
${pdfST("🚀","Nächste Schritte")}${nsHtml}
<div style="break-inside:avoid;margin-top:14px;background:linear-gradient(135deg,#eff6ff,#faf5ff);border:2px solid #0ea5e9;border-radius:9px;padding:14px 16px;text-align:center">
<div style="font-size:9px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#0369a1;margin-bottom:7px">KONTAKT & KOOPERATION</div>
<div style="font-size:11px;color:#334155;line-height:1.7">${esc(plan.extern.kontakt_cta)}</div></div>`;

  openPDF(pdfShell(logo, plan.extern.projekt_titel, `Projektdokumentation · ${formatDateShort(new Date().toISOString())}`, body, students));
}


// ─── EditableField helper ─────────────────────────────────────────────────────
function EField({ value, onChange, multiline=false, style={} }: {
  value: string; onChange:(v:string)=>void; multiline?:boolean; style?: React.CSSProperties;
}) {
  const base: React.CSSProperties = {
    background:"rgba(255,255,255,0.06)", border:"1px solid rgba(0,229,255,0.25)", borderRadius:"6px",
    padding:"6px 10px", color:"white", fontFamily:"'Rajdhani',sans-serif", fontSize:"13px",
    lineHeight:"1.6", outline:"none", width:"100%", boxSizing:"border-box", resize:"vertical" as const, ...style
  };
  return multiline
    ? <textarea rows={3} value={value} onChange={e=>onChange(e.target.value)} style={base} />
    : <input value={value} onChange={e=>onChange(e.target.value)} style={{ ...base, resize:undefined }} />;
}

// ─── Intern View ─────────────────────────────────────────────────────────────
function InternView({ data, editing, onUpdate }: {
  data: InternPlan;
  editing: boolean;
  onUpdate: (updated: InternPlan) => void;
}) {
  const [openTask, setOpenTask] = useState<number|null>(null);

  function upd<K extends keyof InternPlan>(key: K, val: InternPlan[K]) {
    onUpdate({ ...data, [key]: val });
  }
  function updWf(i: number, field: keyof WorkflowBereich, val: string | string[]) {
    const wf = [...(data.produktions_workflow||[])];
    wf[i] = { ...wf[i], [field]: val };
    upd("produktions_workflow", wf);
  }
  function updMs(i: number, field: keyof Meilenstein, val: string | string[]) {
    const ms = [...data.meilensteine];
    ms[i] = { ...ms[i], [field]: val };
    upd("meilensteine", ms);
  }
  function updTa(i: number, field: keyof TeamAufgabe, val: string | string[]) {
    const ta = [...data.team_aufgaben];
    ta[i] = { ...ta[i], [field]: val };
    upd("team_aufgaben", ta);
  }

  return (
    <div>
      <div style={{ background:"linear-gradient(135deg,rgba(0,229,255,0.07),rgba(168,85,247,0.04))", border:"1px solid rgba(0,229,255,0.16)", borderRadius:"14px", padding:"18px", marginBottom:"20px" }}>
        <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"8px", color:C.cyan, letterSpacing:"0.3em", marginBottom:"7px" }}>INTERN — NUR FÜR DAS TEAM</div>
        {editing
          ? <EField value={data.titel} onChange={v=>upd("titel",v)} style={{ fontWeight:700, fontSize:"15px", marginBottom:"8px" }} />
          : <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"15px", fontWeight:900, color:"white", marginBottom:"7px" }}>{data.titel}</div>}
        {editing
          ? <EField value={data.zusammenfassung} onChange={v=>upd("zusammenfassung",v)} multiline style={{ marginTop:"6px" }} />
          : <p style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:"13px", color:"rgba(255,255,255,0.65)", lineHeight:"1.7", margin:0 }}>{data.zusammenfassung}</p>}
      </div>

      <SH icon="⚙️" title="PRODUKTIONS-WORKFLOW" sub="Alle ausgewählten Bereiche — wie sie zusammenspielen" color={C.cyan} />
      <div style={{ display:"flex", flexDirection:"column", gap:"9px", marginBottom:"18px" }}>
        {(data.produktions_workflow||[]).map((w,i)=>{
          const col=BEREICH_COLORS[i%BEREICH_COLORS.length];
          return (
            <div key={i} style={{ borderRadius:"10px", overflow:"hidden", border:`1px solid ${col}25`, background:`${col}04` }}>
              <div style={{ padding:"11px 14px", borderBottom:`1px solid ${col}18`, background:`${col}08` }}>
                <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"8px", color:col, letterSpacing:"0.15em", marginBottom:"3px" }}>{w.bereich.toUpperCase()}</div>
                {editing
                  ? <><EField value={w.auswahl} onChange={v=>updWf(i,"auswahl",v)} style={{ fontWeight:700, marginBottom:"5px" }} />
                     <EField value={w.was_das_bedeutet} onChange={v=>updWf(i,"was_das_bedeutet",v)} multiline /></>
                  : <><div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:"14px", fontWeight:700, color:"white", marginBottom:"3px" }}>{w.auswahl}</div>
                    <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:"12px", color:"rgba(255,255,255,0.55)", lineHeight:"1.5" }}>{w.was_das_bedeutet}</div></>}
              </div>
              <div style={{ padding:"9px 14px" }}>
                <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:"11px", color:C.purple, marginBottom:"7px" }}>
                  <span style={{ fontWeight:700 }}>🔗 Zusammenspiel:</span>{" "}
                  {editing
                    ? <EField value={w.zusammenspiel} onChange={v=>updWf(i,"zusammenspiel",v)} />
                    : <span style={{ color:"rgba(255,255,255,0.55)" }}>{w.zusammenspiel}</span>}
                </div>
                {editing ? (
                  <div>
                    <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"8px", color:"rgba(255,255,255,0.3)", letterSpacing:"0.15em", marginBottom:"5px" }}>AUFGABEN (eine pro Zeile)</div>
                    <textarea rows={4} value={w.aufgaben.join("\n")} onChange={e=>updWf(i,"aufgaben",e.target.value.split("\n"))}
                      style={{ width:"100%", boxSizing:"border-box", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(0,229,255,0.2)", borderRadius:"6px", padding:"8px 10px", color:"white", fontFamily:"'Rajdhani',sans-serif", fontSize:"12px", resize:"vertical", outline:"none" }} />
                  </div>
                ) : (
                  <div>{w.aufgaben.map((a,j)=><Bul key={j} text={a} color={col} />)}</div>
                )}
                <div style={{ marginTop:"7px", display:"flex", gap:"8px", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap" }}>
                  {editing
                    ? <EField value={w.verantwortlich} onChange={v=>updWf(i,"verantwortlich",v)} style={{ maxWidth:"200px" }} />
                    : <Tag label={w.verantwortlich} color={col} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {(data.event_tag_ablauf||[]).length>0&&<>
        <SH icon="🕐" title="EVENT-TAG ABLAUF" color={C.purple} />
        <div style={{ marginBottom:"18px" }}>
          {data.event_tag_ablauf.map((s,i)=>(
            <div key={i} style={{ display:"flex", gap:"0", marginBottom:"5px", borderRadius:"9px", overflow:"hidden", border:"1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ background:"rgba(0,229,255,0.1)", padding:"9px 12px", display:"flex", alignItems:"center", justifyContent:"center", minWidth:"62px", borderRight:"1px solid rgba(0,229,255,0.12)" }}>
                <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"10px", color:C.cyan, fontWeight:900 }}>{s.uhrzeit}</span>
              </div>
              <div style={{ flex:1, padding:"9px 12px" }}>
                <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:"13px", fontWeight:700, color:"white" }}>{s.aktion}</div>
                {editing
                  ? <EField value={s.details} onChange={v=>{ const a=[...data.event_tag_ablauf]; a[i]={...a[i],details:v}; upd("event_tag_ablauf",a); }} style={{ marginTop:"3px" }} />
                  : <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:"11px", color:"rgba(255,255,255,0.4)", marginTop:"1px" }}>{s.details}</div>}
              </div>
              <div style={{ padding:"9px 10px", display:"flex", alignItems:"center" }}>
                {editing
                  ? <EField value={s.wer} onChange={v=>{ const a=[...data.event_tag_ablauf]; a[i]={...a[i],wer:v}; upd("event_tag_ablauf",a); }} style={{ width:"90px" }} />
                  : <Tag label={s.wer} color={C.purple} />}
              </div>
            </div>
          ))}
        </div>
      </>}

      <SH icon="👥" title="WER MACHT WAS" sub="Aufklappen für Details" color={C.amber} />
      <div style={{ display:"flex", flexDirection:"column", gap:"6px", marginBottom:"18px" }}>
        {data.team_aufgaben.map((t,i)=>(
          <div key={i} style={{ borderRadius:"9px", overflow:"hidden", border:`1px solid ${openTask===i?"rgba(245,158,11,0.3)":"rgba(255,255,255,0.07)"}`, transition:"border-color 0.2s" }}>
            <button onClick={()=>setOpenTask(openTask===i?null:i)}
              style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 13px", background:openTask===i?"rgba(245,158,11,0.05)":"transparent", cursor:"pointer", border:"none", gap:"7px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap" }}>
                <span style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:"13px", fontWeight:700, color:"white" }}>{t.name}</span>
                <Tag label={t.rolle} color={C.amber} />
                {t.deadline&&<span style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:"10px", color:"rgba(255,255,255,0.28)" }}>bis {t.deadline}</span>}
              </div>
              <span style={{ color:C.amber, fontSize:"9px", flexShrink:0 }}>{openTask===i?"▲":"▼"}</span>
            </button>
            {openTask===i&&(
              <div style={{ padding:"3px 13px 13px" }}>
                <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"7px", color:"rgba(245,158,11,0.55)", letterSpacing:"0.2em", marginBottom:"6px" }}>AUFGABEN</div>
                {editing ? (
                  <textarea rows={4} value={t.aufgaben.join("\n")} onChange={e=>updTa(i,"aufgaben",e.target.value.split("\n"))}
                    style={{ width:"100%", boxSizing:"border-box", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(245,158,11,0.2)", borderRadius:"6px", padding:"8px 10px", color:"white", fontFamily:"'Rajdhani',sans-serif", fontSize:"12px", resize:"vertical", outline:"none" }} />
                ) : (
                  t.aufgaben.map((a,j)=><Bul key={j} text={a} color={C.amber} />)
                )}
                {t.hinweise.length>0&&<>
                  <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"7px", color:"rgba(0,229,255,0.5)", letterSpacing:"0.2em", marginBottom:"6px", marginTop:"9px" }}>HINWEISE</div>
                  {editing ? (
                    <textarea rows={2} value={t.hinweise.join("\n")} onChange={e=>updTa(i,"hinweise",e.target.value.split("\n"))}
                      style={{ width:"100%", boxSizing:"border-box", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(0,229,255,0.2)", borderRadius:"6px", padding:"8px 10px", color:"white", fontFamily:"'Rajdhani',sans-serif", fontSize:"12px", resize:"vertical", outline:"none" }} />
                  ) : (
                    t.hinweise.map((h,j)=><Bul key={j} text={h} color={C.cyan} />)
                  )}
                </>}
              </div>
            )}
          </div>
        ))}
      </div>

      <SH icon="📅" title="MEILENSTEINE" color={C.green} />
      <div style={{ position:"relative", marginBottom:"18px", paddingLeft:"18px" }}>
        <div style={{ position:"absolute", left:"5px", top:0, bottom:0, width:"2px", background:"linear-gradient(180deg,rgba(0,229,255,0.4),rgba(168,85,247,0.1))" }} />
        {data.meilensteine.map((m,i)=>(
          <div key={i} style={{ position:"relative", marginBottom:"9px" }}>
            <div style={{ position:"absolute", left:"-17px", top:"12px", width:"8px", height:"8px", borderRadius:"50%", background:C.cyan, boxShadow:`0 0 6px ${C.cyan}88` }} />
            <Card accent="rgba(0,229,255,0.02)" border="rgba(0,229,255,0.1)">
              <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:"4px", marginBottom:"6px" }}>
                <div style={{ display:"flex", gap:"8px", alignItems:"center", flexWrap:"wrap" }}>
                  <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"9px", color:C.cyan, fontWeight:900 }}>{m.datum}</span>
                  {editing
                    ? <EField value={m.titel} onChange={v=>updMs(i,"titel",v)} style={{ fontWeight:700 }} />
                    : <span style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:"13px", color:"white", fontWeight:700 }}>{m.titel}</span>}
                </div>
                {editing
                  ? <EField value={m.wer} onChange={v=>updMs(i,"wer",v)} style={{ maxWidth:"120px" }} />
                  : <Tag label={m.wer} color="rgba(255,255,255,0.35)" />}
              </div>
              {editing ? (
                <textarea rows={3} value={m.aufgaben.join("\n")} onChange={e=>updMs(i,"aufgaben",e.target.value.split("\n"))}
                  style={{ width:"100%", boxSizing:"border-box", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(0,229,255,0.15)", borderRadius:"6px", padding:"7px 10px", color:"white", fontFamily:"'Rajdhani',sans-serif", fontSize:"12px", resize:"vertical", outline:"none" }} />
              ) : (
                m.aufgaben.map((a,j)=><Bul key={j} text={a} color="rgba(255,255,255,0.4)" />)
              )}
              {editing
                ? <EField value={m.deliverable} onChange={v=>updMs(i,"deliverable",v)} style={{ marginTop:"6px", color:C.green }} />
                : m.deliverable&&<div style={{ marginTop:"6px", padding:"4px 9px", background:"rgba(34,197,94,0.07)", border:"1px solid rgba(34,197,94,0.18)", borderRadius:"5px", fontFamily:"'Rajdhani',sans-serif", fontSize:"11px", color:C.green }}>✓ {m.deliverable}</div>}
            </Card>
          </div>
        ))}
      </div>

      <SH icon="✅" title="INTERNE CHECKLISTE" color={C.cyan} />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:"8px", marginBottom:"18px" }}>
        {data.checkliste.map((cat,i)=>(
          <Card key={i} accent="rgba(0,229,255,0.02)" border="rgba(255,255,255,0.06)">
            <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"7px", color:BEREICH_COLORS[i%BEREICH_COLORS.length], letterSpacing:"0.2em", marginBottom:"8px" }}>{cat.kategorie}</div>
            {editing ? (
              <textarea rows={5} value={cat.punkte.join("\n")} onChange={e=>{const c=[...data.checkliste];c[i]={...c[i],punkte:e.target.value.split("\n")};upd("checkliste",c);}}
                style={{ width:"100%", boxSizing:"border-box", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"5px", padding:"6px 8px", color:"white", fontFamily:"'Rajdhani',sans-serif", fontSize:"12px", resize:"vertical", outline:"none" }} />
            ) : (
              cat.punkte.map((p,j)=>(
                <div key={j} style={{ display:"flex", gap:"6px", alignItems:"flex-start", marginBottom:"4px" }}>
                  <span style={{ color:"rgba(255,255,255,0.18)", fontSize:"11px", flexShrink:0 }}>☐</span>
                  <span style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:"12px", color:"rgba(255,255,255,0.62)" }}>{p}</span>
                </div>
              ))
            )}
          </Card>
        ))}
      </div>

      <SH icon="💡" title="HINWEISE & TIPPS" color={C.amber} />
      <Card accent="rgba(245,158,11,0.04)" border="rgba(245,158,11,0.14)">
        {editing ? (
          <textarea rows={6} value={data.interne_hinweise.join("\n")} onChange={e=>upd("interne_hinweise",e.target.value.split("\n"))}
            style={{ width:"100%", boxSizing:"border-box", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(245,158,11,0.2)", borderRadius:"6px", padding:"8px 10px", color:"white", fontFamily:"'Rajdhani',sans-serif", fontSize:"12px", resize:"vertical", outline:"none" }} />
        ) : (
          data.interne_hinweise.map((h,i)=><Bul key={i} text={h} color={C.amber} />)
        )}
      </Card>
    </div>
  );
}

// ─── Extern View ──────────────────────────────────────────────────────────────
function ExternView({ data, editing, onUpdate }: {
  data: ExternPlan;
  editing: boolean;
  onUpdate: (updated: ExternPlan) => void;
}) {
  function upd<K extends keyof ExternPlan>(key: K, val: ExternPlan[K]) {
    onUpdate({ ...data, [key]: val });
  }
  function updPaket(i: number, field: keyof SponsorenPaket, val: string | string[]) {
    const p = [...data.sponsoren_pakete];
    p[i] = { ...p[i], [field]: val };
    upd("sponsoren_pakete", p);
  }

  const EditText = ({ field, multiline=false }: { field: keyof ExternPlan; multiline?: boolean }) => (
    editing
      ? <EField value={data[field] as string} onChange={v=>upd(field,v)} multiline={multiline} style={{ marginBottom:"4px" }} />
      : null
  );
  const ShowText = ({ field, style={} }: { field: keyof ExternPlan; style?: React.CSSProperties }) =>
    editing ? null : <p style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:"13px", color:"rgba(255,255,255,0.78)", lineHeight:"1.8", margin:0, ...style }}>{data[field] as string}</p>;

  return (
    <div>
      <div style={{ background:"linear-gradient(135deg,rgba(168,85,247,0.09),rgba(245,158,11,0.04))", border:"1px solid rgba(168,85,247,0.18)", borderRadius:"14px", padding:"24px", marginBottom:"20px", textAlign:"center" }}>
        <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"8px", color:C.purple, letterSpacing:"0.3em", marginBottom:"8px" }}>PROJEKTDOKUMENTATION — FÜR PARTNER & SPONSOREN</div>
        {editing
          ? <EField value={data.projekt_titel} onChange={v=>upd("projekt_titel",v)} style={{ fontSize:"18px", fontWeight:900, textAlign:"center", marginBottom:"8px" }} />
          : <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"18px", fontWeight:900, background:"linear-gradient(90deg,#fff,#a855f7)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:"7px" }}>{data.projekt_titel}</div>}
        {editing
          ? <EField value={data.tagline} onChange={v=>upd("tagline",v)} style={{ textAlign:"center", color:C.amber, fontStyle:"italic", marginBottom:"10px" }} />
          : <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:"14px", color:C.amber, fontStyle:"italic", marginBottom:"14px" }}>„{data.tagline}"</div>}
        {editing
          ? <EField value={data.executive_summary} onChange={v=>upd("executive_summary",v)} multiline />
          : <p style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:"13px", color:"rgba(255,255,255,0.7)", lineHeight:"1.8", margin:0 }}>{data.executive_summary}</p>}
      </div>

      <SH icon="🎯" title="EVENTKONZEPT" color={C.cyan} />
      <Card accent="rgba(0,229,255,0.03)" border="rgba(0,229,255,0.13)">
        {editing ? <EField value={data.event_konzept} onChange={v=>upd("event_konzept",v)} multiline /> : <ShowText field="event_konzept" />}
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"9px" }}>
        <div><SH icon="👥" title="ZIELGRUPPE" color={C.purple} />
          <Card accent="rgba(168,85,247,0.04)" border="rgba(168,85,247,0.13)">
            {editing ? <EField value={data.zielgruppe} onChange={v=>upd("zielgruppe",v)} multiline /> : <ShowText field="zielgruppe" style={{ fontSize:"12px" }} />}
          </Card></div>
        <div><SH icon="📡" title="REICHWEITE" color={C.blue} />
          <Card accent="rgba(59,130,246,0.04)" border="rgba(59,130,246,0.13)">
            {editing ? <EField value={data.reichweite} onChange={v=>upd("reichweite",v)} multiline /> : <ShowText field="reichweite" style={{ fontSize:"12px" }} />}
          </Card></div>
      </div>

      <SH icon="⚡" title="EVENT HIGHLIGHTS" color={C.amber} />
      {editing ? (
        <Card>
          <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"8px", color:"rgba(255,255,255,0.3)", letterSpacing:"0.15em", marginBottom:"6px" }}>HIGHLIGHTS (eine pro Zeile)</div>
          <textarea rows={7} value={data.event_highlights.join("\n")} onChange={e=>upd("event_highlights",e.target.value.split("\n"))}
            style={{ width:"100%", boxSizing:"border-box", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(245,158,11,0.2)", borderRadius:"6px", padding:"8px 10px", color:"white", fontFamily:"'Rajdhani',sans-serif", fontSize:"12px", resize:"vertical", outline:"none" }} />
        </Card>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:"7px", marginBottom:"9px" }}>
          {data.event_highlights.map((h,i)=>(
            <div key={i} style={{ background:`${C.amber}07`, border:`1px solid ${C.amber}1e`, borderRadius:"9px", padding:"10px 12px", fontFamily:"'Rajdhani',sans-serif", fontSize:"12px", color:"rgba(255,255,255,0.73)", lineHeight:"1.5", display:"flex", gap:"6px" }}>
              <span style={{ color:C.amber, flexShrink:0 }}>✦</span>{h}
            </div>
          ))}
        </div>
      )}

      <SH icon="🏆" title="WARUM MITMACHEN?" color={C.green} />
      <Card accent="rgba(34,197,94,0.04)" border="rgba(34,197,94,0.13)">
        {editing ? (
          <textarea rows={6} value={data.warum_mitmachen.join("\n")} onChange={e=>upd("warum_mitmachen",e.target.value.split("\n"))}
            style={{ width:"100%", boxSizing:"border-box", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:"6px", padding:"8px 10px", color:"white", fontFamily:"'Rajdhani',sans-serif", fontSize:"12px", resize:"vertical", outline:"none" }} />
        ) : (
          data.warum_mitmachen.map((w,i)=><Bul key={i} text={w} color={C.green} />)
        )}
      </Card>

      <SH icon="🎬" title="WAS WIR LEISTEN" color={C.cyan} />
      <Card accent="rgba(0,229,255,0.03)" border="rgba(0,229,255,0.11)">
        {editing ? (
          <textarea rows={6} value={data.was_wir_leisten.join("\n")} onChange={e=>upd("was_wir_leisten",e.target.value.split("\n"))}
            style={{ width:"100%", boxSizing:"border-box", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(0,229,255,0.2)", borderRadius:"6px", padding:"8px 10px", color:"white", fontFamily:"'Rajdhani',sans-serif", fontSize:"12px", resize:"vertical", outline:"none" }} />
        ) : (
          data.was_wir_leisten.map((w,i)=><Bul key={i} text={w} color={C.cyan} />)
        )}
      </Card>

      <SH icon="💎" title="PARTNER-PAKETE" color={C.purple} />
      <div style={{ display:"flex", flexDirection:"column", gap:"8px", marginBottom:"9px" }}>
        {data.sponsoren_pakete.map((p,i)=>(
          <div key={i} style={{ borderRadius:"10px", overflow:"hidden", border:`1px solid ${BEREICH_COLORS[i]}28` }}>
            <div style={{ background:`${BEREICH_COLORS[i]}0e`, padding:"9px 13px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"5px" }}>
              <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"10px", color:BEREICH_COLORS[i], fontWeight:900 }}>{p.name}</span>
              {editing
                ? <EField value={p.was_wir_brauchen} onChange={v=>updPaket(i,"was_wir_brauchen",v)} style={{ maxWidth:"220px" }} />
                : <Tag label={`Wir brauchen: ${p.was_wir_brauchen}`} color={C.amber} />}
            </div>
            <div style={{ padding:"10px 13px", background:"rgba(255,255,255,0.01)" }}>
              {editing ? (
                <textarea rows={3} value={p.was_wir_bieten.join("\n")} onChange={e=>updPaket(i,"was_wir_bieten",e.target.value.split("\n"))}
                  style={{ width:"100%", boxSizing:"border-box", background:"rgba(255,255,255,0.04)", border:`1px solid ${BEREICH_COLORS[i]}20`, borderRadius:"6px", padding:"7px 10px", color:"white", fontFamily:"'Rajdhani',sans-serif", fontSize:"12px", resize:"vertical", outline:"none" }} />
              ) : (
                p.was_wir_bieten.map((item,j)=><Bul key={j} text={item} color={BEREICH_COLORS[i]} />)
              )}
            </div>
          </div>
        ))}
      </div>

      <SH icon="📣" title="FÜR INFLUENCER & CREATOR" color={C.coral} />
      <Card accent="rgba(249,115,22,0.04)" border="rgba(249,115,22,0.16)">
        {editing ? <EField value={data.influencer_pitch} onChange={v=>upd("influencer_pitch",v)} multiline /> : <ShowText field="influencer_pitch" />}
      </Card>

      <SH icon="👨‍🎓" title="DAS TEAM" color={C.purple} />
      <Card accent="rgba(168,85,247,0.04)" border="rgba(168,85,247,0.11)">
        {editing ? <EField value={data.unser_team} onChange={v=>upd("unser_team",v)} multiline /> : <ShowText field="unser_team" />}
      </Card>

      <SH icon="🚀" title="NÄCHSTE SCHRITTE" color={C.green} />
      {editing ? (
        <Card>
          <textarea rows={5} value={data.naechste_schritte.join("\n")} onChange={e=>upd("naechste_schritte",e.target.value.split("\n"))}
            style={{ width:"100%", boxSizing:"border-box", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:"6px", padding:"8px 10px", color:"white", fontFamily:"'Rajdhani',sans-serif", fontSize:"12px", resize:"vertical", outline:"none" }} />
        </Card>
      ) : (
        <div style={{ marginBottom:"16px" }}>
          {data.naechste_schritte.map((s,i)=>(
            <div key={i} style={{ display:"flex", gap:"10px", marginBottom:"7px", alignItems:"flex-start" }}>
              <div style={{ width:"22px", height:"22px", borderRadius:"5px", background:`${C.green}15`, border:`1px solid ${C.green}35`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Orbitron',sans-serif", fontSize:"9px", color:C.green, flexShrink:0, fontWeight:900 }}>{i+1}</div>
              <span style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:"13px", color:"rgba(255,255,255,0.78)", lineHeight:"1.5" }}>{s}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ background:"linear-gradient(135deg,rgba(168,85,247,0.1),rgba(0,229,255,0.05))", border:"1px solid rgba(168,85,247,0.2)", borderRadius:"12px", padding:"20px", textAlign:"center" }}>
        <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"8px", color:C.purple, letterSpacing:"0.25em", marginBottom:"9px" }}>KONTAKT & KOOPERATION</div>
        {editing
          ? <EField value={data.kontakt_cta} onChange={v=>upd("kontakt_cta",v)} multiline style={{ textAlign:"center" }} />
          : <p style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:"13px", color:"rgba(255,255,255,0.68)", lineHeight:"1.75", margin:0 }}>{data.kontakt_cta}</p>}
      </div>
    </div>
  );
}
// ─── Saved Plans List ─────────────────────────────────────────────────────────
function SavedPlansList({ plans, onLoad, onDelete }: {
  plans: SavedPlan[];
  onLoad: (p: SavedPlan) => void;
  onDelete: (id: string) => void;
}) {
  if (!plans.length) return null;
  return (
    <div style={{ marginTop:"32px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"14px", marginBottom:"14px" }}>
        <div style={{ flex:1, height:"1px", background:"linear-gradient(90deg,transparent,rgba(245,158,11,0.3))" }} />
        <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"9px", color:"rgba(245,158,11,0.6)", letterSpacing:"0.25em" }}>
          GESPEICHERTE PLÄNE ({plans.length})
        </span>
        <div style={{ flex:1, height:"1px", background:"linear-gradient(90deg,rgba(245,158,11,0.3),transparent)" }} />
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
        {plans.slice().reverse().map(sp => {
          const wasEdited = sp.updatedAt !== sp.createdAt;
          return (
            <div key={sp.id} style={{
              background:"rgba(255,255,255,0.025)",
              border:"1px solid rgba(255,255,255,0.07)",
              borderRadius:"12px",
              overflow:"hidden",
              display:"flex",
              alignItems:"stretch",
            }}>
              {/* Date badge on the left */}
              <div style={{
                background:"rgba(245,158,11,0.07)",
                borderRight:"1px solid rgba(245,158,11,0.12)",
                padding:"12px 14px",
                display:"flex",
                flexDirection:"column",
                alignItems:"center",
                justifyContent:"center",
                minWidth:"54px",
                flexShrink:0,
              }}>
                <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"14px", fontWeight:900, color:C.amber, lineHeight:1 }}>
                  {new Date(sp.createdAt).getDate().toString().padStart(2,"0")}
                </div>
                <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:"10px", color:"rgba(245,158,11,0.6)", marginTop:"2px", letterSpacing:"0.05em" }}>
                  {new Date(sp.createdAt).toLocaleDateString("de-DE",{month:"short"})}
                </div>
                <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:"10px", color:"rgba(255,255,255,0.25)" }}>
                  {new Date(sp.createdAt).getFullYear()}
                </div>
              </div>

              {/* Content */}
              <div style={{ flex:1, padding:"10px 14px", minWidth:0 }}>
                <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:"14px", fontWeight:700, color:"white", marginBottom:"3px",
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {sp.title}
                </div>
                <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:"11px", color:"rgba(255,255,255,0.3)", marginBottom:"3px" }}>
                  Erstellt {formatDate(sp.createdAt)}
                  {wasEdited && (
                    <span style={{ marginLeft:"8px", color:"rgba(0,229,255,0.45)" }}>
                      · Bearbeitet {formatDate(sp.updatedAt)}
                    </span>
                  )}
                </div>
                {sp.selectionsSnapshot && (
                  <div style={{
                    fontFamily:"'Rajdhani',sans-serif", fontSize:"10px",
                    color:"rgba(255,255,255,0.2)", overflow:"hidden",
                    textOverflow:"ellipsis", whiteSpace:"nowrap",
                  }}>
                    {sp.selectionsSnapshot}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display:"flex", flexDirection:"column", gap:"4px", padding:"10px 10px", justifyContent:"center", flexShrink:0 }}>
                <button onClick={()=>onLoad(sp)} style={{
                  fontFamily:"'Orbitron',sans-serif", fontSize:"8px", fontWeight:700,
                  padding:"6px 10px", borderRadius:"6px", cursor:"pointer",
                  border:"1px solid rgba(0,229,255,0.3)", background:"rgba(0,229,255,0.1)",
                  color:C.cyan, letterSpacing:"0.08em",
                }}>LADEN</button>
                <button onClick={()=>onDelete(sp.id)} style={{
                  fontFamily:"'Orbitron',sans-serif", fontSize:"8px", fontWeight:700,
                  padding:"6px 10px", borderRadius:"6px", cursor:"pointer",
                  border:"1px solid rgba(255,80,80,0.15)", background:"transparent",
                  color:"rgba(255,80,80,0.4)", letterSpacing:"0.08em",
                }}>✕ LÖSCHEN</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function GeneratePlan() {
  const { selectedOptions, selectedSubs, customText, assignments } = usePlanner();
  const [apiKey,    setApiKey]    = useState(()=>getStoredKey());
  const [phase,     setPhase]     = useState<"idle"|"intern"|"extern"|"done"|"error">("idle");
  const [errorMsg,  setErrorMsg]  = useState("");
  const [plan,      setPlan]      = useState<DualPlan|null>(null);
  const [activeTab, setActiveTab] = useState<"intern"|"extern">("intern");
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>(()=>loadSavedPlans());
  const [editingTitle, setEditingTitle] = useState(false);
  const [planTitle, setPlanTitle] = useState("");
  const [currentSavedId, setCurrentSavedId] = useState<string|null>(null);
  const [editMode, setEditMode] = useState(false);

  const hasSelections = SECTIONS.some(s=>(selectedOptions[s.id]?.length??0)>0);

  // Derive a snapshot label from current selections
  function snapshotLabel(): string {
    return SECTIONS.filter(s=>(selectedOptions[s.id]?.length??0)>0)
      .map(s=>{
        const ids=selectedOptions[s.id]||[];
        const labels=ids.map(id=>{ const opt=s.options.find(o=>o.id===id); return opt?.label||id; }).join("+");
        return `${s.title}: ${labels}`;
      }).join(" · ").slice(0,120);
  }

  async function generatePlan() {
    if (!apiKey) return;
    setPlan(null); setErrorMsg(""); setPhase("intern"); setCurrentSavedId(null);

    const ctx = buildContext(selectedOptions, selectedSubs, customText, assignments);

    try {
      // ── Call 1: Intern plan ──────────────────────────────────────────────
      setPhase("intern");
      const internPrompt = `Du bist ein E-Sports Event-Produzent. Erstelle einen internen Projektplan auf Deutsch.

Kontext: Hochschule Emden/Leer, FB Medientechnik, SS 2026 (April–Juli).
Betreuer: Herr T. Lemke, Herr C. Frerichs.
Team: ${TEAM_MEMBERS.map(m=>m.name).join(", ")}.

Ausgewählte Optionen:
${ctx.selectionText}

Team-Rollen:
${ctx.teamText}

Antworte AUSSCHLIESSLICH mit einem validen JSON-Objekt. KEIN Text davor oder danach. KEINE Markdown-Backticks.

{
  "titel": "string",
  "zusammenfassung": "string (3 Sätze)",
  "produktions_workflow": [
    {"bereich":"string","auswahl":"string","was_das_bedeutet":"string","zusammenspiel":"string","aufgaben":["s1","s2","s3"],"verantwortlich":"string","hinweise":["s1","s2"]}
  ],
  "event_tag_ablauf": [
    {"uhrzeit":"08:00","aktion":"string","wer":"string","details":"string"}
  ],
  "team_aufgaben": [
    {"name":"string","rolle":"string","aufgaben":["s1","s2","s3"],"deadline":"string","hinweise":["s1"]}
  ],
  "meilensteine": [
    {"datum":"string","titel":"string","wer":"string","aufgaben":["s1","s2"],"deliverable":"string"}
  ],
  "checkliste": [
    {"kategorie":"string","punkte":["s1","s2","s3","s4"]}
  ],
  "interne_hinweise": ["s1","s2","s3","s4","s5"]
}

Fülle alle Felder aus. Erstelle: 1 workflow-Eintrag pro ausgewähltem Bereich (mind. 4), 8 event_tag Einträge, 5 team_aufgaben (mit echten Teamnamen), 6 Meilensteine, 4 Checklisten-Kategorien, 5 Hinweise.`;

      const internRaw = await callGPT(apiKey, internPrompt, 3000);
      const intern = parseJSON<InternPlan>(internRaw);

      // ── Call 2: Extern plan ──────────────────────────────────────────────
      setPhase("extern");
      const externPrompt = `Du bist ein E-Sports Event-Produzent. Erstelle eine externe Projektdokumentation für Sponsoren auf Deutsch.

Kontext: Hochschule Emden/Leer, FB Medientechnik, SS 2026.
Ausgewählte Optionen: ${ctx.selectionText}

Antworte AUSSCHLIESSLICH mit einem validen JSON-Objekt. KEIN Text davor oder danach. KEINE Markdown-Backticks.

{
  "projekt_titel": "string",
  "tagline": "string",
  "executive_summary": "string (3-4 Sätze)",
  "event_konzept": "string (4 Sätze)",
  "zielgruppe": "string (2-3 Sätze)",
  "event_highlights": ["s1","s2","s3","s4","s5","s6"],
  "warum_mitmachen": ["s1","s2","s3","s4","s5"],
  "was_wir_leisten": ["s1","s2","s3","s4","s5"],
  "sponsoren_pakete": [
    {"name":"GOLD PARTNER","was_wir_bieten":["s1","s2","s3"],"was_wir_brauchen":"string"},
    {"name":"SILVER PARTNER","was_wir_bieten":["s1","s2","s3"],"was_wir_brauchen":"string"},
    {"name":"MEDIA PARTNER","was_wir_bieten":["s1","s2"],"was_wir_brauchen":"string"}
  ],
  "influencer_pitch": "string (2-3 Sätze)",
  "reichweite": "string (2 Sätze mit Zahlen)",
  "unser_team": "string (2-3 Sätze)",
  "kontakt_cta": "string",
  "naechste_schritte": ["s1","s2","s3","s4"]
}`;

      const externRaw = await callGPT(apiKey, externPrompt, 2000);
      const extern = parseJSON<ExternPlan>(externRaw);

      const result: DualPlan = { intern, extern };
      setPlan(result);
      setPhase("done");

      // Auto-save
      const title = extern.projekt_titel || intern.titel || "Neuer Plan";
      setPlanTitle(title);
      const newId = `plan_${Date.now()}`;
      setCurrentSavedId(newId);
      const newEntry: SavedPlan = {
        id: newId,
        title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        plan: result,
        selectionsSnapshot: snapshotLabel(),
      };
      const updated = [...savedPlans, newEntry];
      setSavedPlans(updated);
      persistPlans(updated);

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === "API_401") setErrorMsg("Ungültiger API Key (401). Bitte zurücksetzen.");
      else if (msg === "API_429") setErrorMsg("Rate-Limit erreicht (429). Bitte 30 Sekunden warten, dann nochmal.");
      else if (msg === "JSON_PARSE") setErrorMsg(`KI-Antwort konnte nicht verarbeitet werden (${phase === "intern" ? "Team-Plan" : "Projektdoku"}). Bitte nochmal versuchen — manchmal klappt es beim zweiten Versuch.`);
      else setErrorMsg(`Fehler: ${msg}`);
      setPhase("error");
    }
  }

  function loadPlan(sp: SavedPlan) {
    setPlan(sp.plan);
    setPlanTitle(sp.title);
    setCurrentSavedId(sp.id);
    setPhase("done");
    setActiveTab("intern");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deletePlan(id: string) {
    const updated = savedPlans.filter(p=>p.id!==id);
    setSavedPlans(updated);
    persistPlans(updated);
    if (currentSavedId === id) { setPlan(null); setPhase("idle"); setCurrentSavedId(null); }
  }

  function saveTitle() {
    if (!currentSavedId || !planTitle.trim()) return;
    const updated = savedPlans.map(p=>p.id===currentSavedId ? { ...p, title:planTitle.trim(), updatedAt:new Date().toISOString() } : p);
    setSavedPlans(updated);
    persistPlans(updated);
    setEditingTitle(false);
  }

  const phaseLabel = phase==="intern"?"SCHRITT 1/2: TEAM-PLAN WIRD ERSTELLT…" : phase==="extern"?"SCHRITT 2/2: PROJEKTDOKUMENTATION WIRD ERSTELLT…" : "";

  return (
    <div style={{ marginTop:"40px" }}>
      {/* Divider */}
      <div style={{ display:"flex", alignItems:"center", gap:"14px", marginBottom:"20px" }}>
        <div style={{ flex:1, height:"1px", background:"linear-gradient(90deg,transparent,rgba(0,229,255,0.28))" }} />
        <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"8px", color:"rgba(0,229,255,0.45)", letterSpacing:"0.3em" }}>KI-PLAN GENERATOR</span>
        <div style={{ flex:1, height:"1px", background:"linear-gradient(90deg,rgba(0,229,255,0.28),transparent)" }} />
      </div>

      {!apiKey && !ENV_KEY && <ApiKeyModal onSave={k=>{setApiKey(k);}} />}

      {/* Generate area */}
      {apiKey && phase !== "done" && (
        <div style={{ textAlign:"center", marginBottom:"20px" }}>
          {(phase==="intern"||phase==="extern") && (
            <div style={{ marginBottom:"14px" }}>
              <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"9px", color:C.cyan, letterSpacing:"0.2em", marginBottom:"7px" }}>{phaseLabel}</div>
              <div style={{ display:"flex", gap:"4px", justifyContent:"center", marginBottom:"6px" }}>
                {["intern","extern"].map((p,i)=>(
                  <div key={p} style={{ height:"3px", width:"60px", borderRadius:"2px", background: phase===p ? C.cyan : i===0&&phase==="extern" ? C.green : "rgba(255,255,255,0.08)" }} />
                ))}
              </div>
              <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:"11px", color:"rgba(255,255,255,0.25)" }}>
                {phase==="intern"?"Team-Workflow, Aufgaben und Meilensteine werden aufgebaut…":"Sponsoren-Dokumentation und Partnerpakete werden erstellt…"}
              </div>
            </div>
          )}
          {phase==="error" && (
            <div style={{ background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:"9px", padding:"11px", marginBottom:"11px", color:"#ef4444", fontFamily:"'Rajdhani',sans-serif", fontSize:"13px" }}>
              ⚠ {errorMsg}
              {!ENV_KEY && (
                <button onClick={()=>{clearKey();setApiKey("");setPhase("idle");}}
                  style={{ marginLeft:"9px", background:"transparent", border:"none", color:"#ef4444", textDecoration:"underline", cursor:"pointer", fontFamily:"'Rajdhani',sans-serif", fontSize:"13px" }}>Key zurücksetzen</button>
              )}
            </div>
          )}
          <button onClick={generatePlan} disabled={phase==="intern"||phase==="extern"||!hasSelections}
            style={{ background:(phase==="intern"||phase==="extern")?"rgba(255,255,255,0.04)":"linear-gradient(135deg,rgba(0,229,255,0.16),rgba(168,85,247,0.1))", border:`1px solid ${(phase==="intern"||phase==="extern")?"rgba(255,255,255,0.07)":"rgba(0,229,255,0.3)"}`, borderRadius:"11px", padding:"13px 30px", cursor:(phase==="intern"||phase==="extern")||!hasSelections?"not-allowed":"pointer", fontFamily:"'Orbitron',sans-serif", fontSize:"12px", fontWeight:900, color:(phase==="intern"||phase==="extern")?"rgba(255,255,255,0.22)":C.cyan, letterSpacing:"0.14em" }}>
            {(phase==="intern"||phase==="extern") ? "WIRD GENERIERT…" : phase==="error" ? "NOCHMAL VERSUCHEN" : "✦ PLAN GENERIEREN"}
          </button>
          {!hasSelections&&<div style={{ marginTop:"8px", fontFamily:"'Rajdhani',sans-serif", fontSize:"11px", color:"rgba(255,255,255,0.22)" }}>Bitte zuerst in mindestens einem Bereich auswählen.</div>}
        </div>
      )}

      {/* Result */}
      {phase==="done" && plan && (
        <div>
          {/* Plan title + date */}
          <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"16px", flexWrap:"wrap" }}>
            {editingTitle ? (
              <>
                <input value={planTitle} onChange={e=>setPlanTitle(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveTitle()}
                  style={{ flex:1, minWidth:"200px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(0,229,255,0.3)", borderRadius:"7px", padding:"7px 11px", color:"white", fontFamily:"'Rajdhani',sans-serif", fontSize:"14px" }} />
                <button onClick={saveTitle} style={{ background:"rgba(0,229,255,0.15)", border:"1px solid rgba(0,229,255,0.3)", borderRadius:"7px", padding:"7px 14px", cursor:"pointer", fontFamily:"'Orbitron',sans-serif", fontSize:"9px", color:C.cyan, letterSpacing:"0.1em" }}>SPEICHERN</button>
                <button onClick={()=>setEditingTitle(false)} style={{ background:"transparent", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"7px", padding:"7px 12px", cursor:"pointer", fontFamily:"'Orbitron',sans-serif", fontSize:"9px", color:"rgba(255,255,255,0.35)", letterSpacing:"0.08em" }}>ABBRECHEN</button>
              </>
            ) : (
              <>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:"14px", fontWeight:700, color:"white" }}>{planTitle}</div>
                  {currentSavedId && (() => {
                    const saved = savedPlans.find(p=>p.id===currentSavedId);
                    return saved ? (
                      <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:"11px", color:"rgba(255,255,255,0.3)", marginTop:"3px", display:"flex", gap:"8px", flexWrap:"wrap" }}>
                        <span>📅 Erstellt: {formatDate(saved.createdAt)}</span>
                        {saved.updatedAt !== saved.createdAt &&
                          <span style={{ color:"rgba(0,229,255,0.45)" }}>· Bearbeitet: {formatDate(saved.updatedAt)}</span>}
                      </div>
                    ) : null;
                  })()}
                </div>
                <button onClick={()=>setEditingTitle(true)} style={{ background:"transparent", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"7px", padding:"6px 12px", cursor:"pointer", fontFamily:"'Orbitron',sans-serif", fontSize:"9px", color:"rgba(255,255,255,0.35)", letterSpacing:"0.08em" }}>✏ UMBENENNEN</button>
              </>
            )}
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", gap:"5px", marginBottom:"5px", background:"rgba(255,255,255,0.02)", borderRadius:"11px", padding:"4px" }}>
            {([
              {key:"intern" as const, icon:"👥", label:"TEAM-INTERN", color:C.cyan},
              {key:"extern" as const, icon:"📋", label:"PROJEKTDOKUMENTATION", color:C.purple},
            ]).map(tab=>(
              <button key={tab.key} onClick={()=>setActiveTab(tab.key)}
                style={{ flex:1, padding:"9px 6px", borderRadius:"7px", border:"none", cursor:"pointer", background:activeTab===tab.key?`${tab.color}15`:"transparent", color:activeTab===tab.key?tab.color:"rgba(255,255,255,0.32)", fontFamily:"'Orbitron',sans-serif", fontSize:"9px", fontWeight:900, letterSpacing:"0.07em", borderTop:`2px solid ${activeTab===tab.key?tab.color:"transparent"}`, transition:"all 0.18s" }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Toolbar: edit toggle + PDF */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"18px", flexWrap:"wrap", gap:"8px" }}>
            <button onClick={()=>setEditMode(e=>!e)}
              style={{ display:"flex", alignItems:"center", gap:"6px", background:editMode?"rgba(245,158,11,0.15)":"rgba(255,255,255,0.04)", border:`1px solid ${editMode?"rgba(245,158,11,0.4)":"rgba(255,255,255,0.1)"}`, borderRadius:"8px", padding:"8px 16px", cursor:"pointer", fontFamily:"'Orbitron',sans-serif", fontSize:"9px", fontWeight:900, color:editMode?C.amber:"rgba(255,255,255,0.4)", letterSpacing:"0.1em" }}>
              {editMode ? "✓ BEARBEITUNG AKTIV" : "✏ BEARBEITEN"}
              {editMode && <span style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:"10px", color:"rgba(245,158,11,0.6)", fontWeight:400 }}>— Felder direkt anklicken & ändern</span>}
            </button>
            <div style={{ display:"flex", gap:"7px" }}>
              {editMode && (
                <button onClick={()=>{
                  if (!currentSavedId || !plan) return;
                  const updated = savedPlans.map(p=>p.id===currentSavedId ? { ...p, plan, updatedAt:new Date().toISOString() } : p);
                  setSavedPlans(updated); persistPlans(updated); setEditMode(false);
                }} style={{ background:"rgba(34,197,94,0.15)", border:"1px solid rgba(34,197,94,0.35)", borderRadius:"8px", padding:"8px 16px", cursor:"pointer", fontFamily:"'Orbitron',sans-serif", fontSize:"9px", color:C.green, letterSpacing:"0.08em" }}>
                  💾 ÄNDERUNGEN SPEICHERN
                </button>
              )}
              {activeTab==="intern"
                ? <PdfBtn label="ALS PDF" onClick={()=>downloadInternPDF(plan)} />
                : <PdfBtn label="ALS PDF" onClick={()=>downloadExternPDF(plan)} />}
            </div>
          </div>

          {activeTab==="intern" && (
            <InternView
              data={plan.intern}
              editing={editMode}
              onUpdate={updated=>setPlan(p=>p ? { ...p, intern:updated } : p)}
            />
          )}
          {activeTab==="extern" && (
            <ExternView
              data={plan.extern}
              editing={editMode}
              onUpdate={updated=>setPlan(p=>p ? { ...p, extern:updated } : p)}
            />
          )}

          {/* Bottom actions */}
          <div style={{ display:"flex", justifyContent:"center", marginTop:"28px", gap:"8px", flexWrap:"wrap" }}>
            {activeTab==="intern"
              ? <PdfBtn label="INTERNEN PLAN ALS PDF" onClick={()=>downloadInternPDF(plan)} />
              : <PdfBtn label="PROJEKTDOKU ALS PDF" onClick={()=>downloadExternPDF(plan)} />}
            <button onClick={generatePlan} style={{ background:"transparent", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"9px", padding:"9px 18px", cursor:"pointer", fontFamily:"'Orbitron',sans-serif", fontSize:"9px", color:"rgba(255,255,255,0.32)", letterSpacing:"0.1em" }}>↻ NOCHMAL GENERIEREN</button>
            {!ENV_KEY && (
              <button onClick={()=>{clearKey();setApiKey("");setPhase("idle");setPlan(null);setCurrentSavedId(null);}}
                style={{ background:"transparent", border:"1px solid rgba(239,68,68,0.16)", borderRadius:"9px", padding:"9px 18px", cursor:"pointer", fontFamily:"'Orbitron',sans-serif", fontSize:"9px", color:"rgba(239,68,68,0.38)", letterSpacing:"0.08em" }}>KEY ENTFERNEN</button>
            )}
          </div>
        </div>
      )}

      {/* Show generate button again when done */}
      {phase==="done" && (
        <div style={{ textAlign:"center", marginTop:"16px" }}>
          <button onClick={()=>{ setPlan(null); setPhase("idle"); setCurrentSavedId(null); }}
            style={{ background:"transparent", border:"1px solid rgba(0,229,255,0.2)", borderRadius:"9px", padding:"8px 18px", cursor:"pointer", fontFamily:"'Orbitron',sans-serif", fontSize:"9px", color:"rgba(0,229,255,0.5)", letterSpacing:"0.1em" }}>+ NEUEN PLAN ERSTELLEN</button>
        </div>
      )}

      {/* Saved Plans */}
      <SavedPlansList plans={savedPlans} onLoad={loadPlan} onDelete={deletePlan} />
    </div>
  );
}
