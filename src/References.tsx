import { useState } from "react";

type RefType = "artikel" | "youtube" | "tool" | "template" | "beispiel";
type Lang    = "de" | "en";

interface Ref {
  title: string;
  desc:  string;
  url:   string;
  type:  RefType;
  lang:  Lang;
}

interface RefCategory {
  id:    string;
  label: string;
  color: string;
  icon:  string;
  refs:  Ref[];
}

const CATEGORIES: RefCategory[] = [
  {
    id: "general", label: "Allgemein", color: "#00e5ff", icon: "🎮",
    refs: [
      { title: "Esports Production Guide 2025", desc: "Vollständiges Handbuch für Turnier-Broadcasts und Event-Produktion.", url: "https://esportsproduction.quest/esports-production-guide", type: "artikel", lang: "en" },
      { title: "Behind the Broadcast: Event Production", desc: "Esports Insider – Einblick hinter die Kulissen von Broadcast-Produktionen.", url: "https://esportsinsider.com/2024/04/behind-the-broadcast-part-2-production", type: "artikel", lang: "en" },
      { title: "Esports Event Management: Complete Guide", desc: "Schritt-für-Schritt-Anleitung von der Idee bis zur Durchführung.", url: "https://bigcreative.education/esports-event-management-guide-how-to-plan-and-manage-esports-events/", type: "artikel", lang: "en" },
      { title: "EventsAir: Gaming Event Management", desc: "Professioneller Überblick über Planung und Logistik von Gaming-Events.", url: "https://www.eventsair.com/blog/esports-gaming-event-management", type: "artikel", lang: "en" },
      { title: "▶ YouTube: Esports Event Production", desc: "Tutorials und Behind-the-Scenes zu Event-Produktion auf YouTube suchen.", url: "https://www.youtube.com/results?search_query=esports+event+production+tutorial+behind+the+scenes", type: "youtube", lang: "en" },
      { title: "▶ YouTube: Esports Event organisieren (DE)", desc: "Deutsche Tutorials und Guides zu E-Sports-Veranstaltungen.", url: "https://www.youtube.com/results?search_query=esports+event+organisieren+tutorial+deutsch", type: "youtube", lang: "de" },
    ],
  },
  {
    id: "format", label: "Spielformat & Turnier", color: "#a855f7", icon: "🏆",
    refs: [
      { title: "Popular Tournament Formats in Esports", desc: "Luckbox: Single Elimination, Double Elimination, Swiss – Vergleich und Empfehlung.", url: "https://luckbox.com/esports-news/article/popular-tournament-formats-in-esports-a-complete-guide/", type: "artikel", lang: "en" },
      { title: "Elimination Bracket Guide (Turnio)", desc: "Erklärt Seeding, Bracket-Logik und wann welches Format passt.", url: "https://turnio.net/elimination-bracket-tournament-guide/", type: "artikel", lang: "en" },
      { title: "Double Elimination erklärt (BracketsNinja)", desc: "Visuell aufbereitete Erklärung des Double-Elimination-Systems.", url: "https://www.bracketsninja.com/types/double-elimination-bracket", type: "artikel", lang: "en" },
      { title: "PlayRez – Kostenloser Bracket Generator", desc: "Online-Tool zum Erstellen von Single/Double Elimination und Swiss Brackets.", url: "https://playrez.com/tools/bracket-generator", type: "tool", lang: "en" },
      { title: "▶ YouTube: Tournament Bracket Format", desc: "Erklärvideo zu den gängigen Turnierformaten im Esports.", url: "https://www.youtube.com/results?search_query=esports+tournament+bracket+format+explained+single+double+elimination", type: "youtube", lang: "en" },
      { title: "▶ YouTube: Turnier organisieren (DE)", desc: "Wie man ein Turnier aufbaut – deutschsprachige Guides.", url: "https://www.youtube.com/results?search_query=esports+turnier+organisieren+tutorial+deutsch", type: "youtube", lang: "de" },
    ],
  },
  {
    id: "streaming", label: "Streaming / OBS", color: "#00e5ff", icon: "📡",
    refs: [
      { title: "OBS Studio – Quick Start Guide (Offiziell)", desc: "Offizielle Schnellstart-Anleitung von OBS Project.", url: "https://obsproject.com/kb/quick-start-guide", type: "artikel", lang: "en" },
      { title: "OBS Studio Stream Layout Tutorial", desc: "Offizielles OBS Tutorial: Game Screen als Streaming-Basis.", url: "https://obsproject.com/kb/stream-tutorial-1-game", type: "artikel", lang: "en" },
      { title: "OBS Studio Anleitung Deutsch (Einsteiger)", desc: "Aufnehmen und Streamen mit OBS – vollständige deutsche Anleitung.", url: "https://www.anleitungsportal.de/obs-studio-anleitung-aufnehmen-und-streamen-fuer-einsteiger/", type: "artikel", lang: "de" },
      { title: "OBS Studio für Livestreams einrichten (DE)", desc: "Schritt-für-Schritt deutsch: Szenen, Quellen, Encoder, Output.", url: "https://www.videolyser.de/artikel/obs-studio-livestreams-einrichten", type: "artikel", lang: "de" },
      { title: "Startklar zum Streamen – OBS Guide (DE)", desc: "Anfänger-freundlicher German Guide für OBS Setup.", url: "https://streamkingz.de/obs-studio-stream-einrichten/", type: "artikel", lang: "de" },
      { title: "OBS Streaming Guide: Pro Setup Tips 2025", desc: "Fortgeschrittene Einstellungen, Bitrate, Encoder für professionelle Streams.", url: "https://www.nearstream.us/blog/obs-streaming-guide-live-setup", type: "artikel", lang: "en" },
      { title: "▶ YouTube: OBS Tutorial Deutsch", desc: "OBS Studio vollständig auf Deutsch erklärt – Anfänger bis Fortgeschrittene.", url: "https://www.youtube.com/results?search_query=OBS+Studio+Tutorial+deutsch+streaming+anfaenger+2024", type: "youtube", lang: "de" },
      { title: "▶ YouTube: OBS Esports Stream Setup", desc: "Professionelles Esports Streaming Setup mit OBS.", url: "https://www.youtube.com/results?search_query=OBS+esports+stream+setup+tournament+overlay", type: "youtube", lang: "en" },
    ],
  },
  {
    id: "projektmapping", label: "Projektmapping", color: "#f97316", icon: "🖥️",
    refs: [
      { title: "Resolume Arena – Offizielle Trainings", desc: "Die offizielle Lernplattform für Resolume Avenue & Arena – Projection Mapping.", url: "https://resolume.com/training", type: "artikel", lang: "en" },
      { title: "Resolume: Projection Mapping Modul", desc: "Direkter Link zum Projection-Mapping-Kapitel im Resolume Training.", url: "https://resolume.com/training/2/14/80", type: "artikel", lang: "en" },
      { title: "Resolume Blog – Tutorials", desc: "Offizielle Tutorial-Beiträge direkt von Resolume.", url: "https://www.resolume.com/blog/category/tutorials", type: "artikel", lang: "en" },
      { title: "MapMap – Open Source Projection Mapping", desc: "Kostenloses Open-Source-Tool für Projection Mapping (Windows, Mac, Linux).", url: "https://mapmapteam.github.io/", type: "tool", lang: "en" },
      { title: "Projection Mapping Central – Software Übersicht", desc: "Vergleich aller verfügbaren Projection-Mapping-Softwares.", url: "https://projection-mapping.org/software/", type: "artikel", lang: "en" },
      { title: "Free Projection Mapping Software Vergleich", desc: "Kostenlose Alternativen zu Resolume im direkten Vergleich.", url: "https://lm3x.com/blog/free-projection-mapping-software/", type: "artikel", lang: "en" },
      { title: "▶ YouTube: Projection Mapping Tutorial", desc: "Einstieg in Projection Mapping – Grundlagen visuell erklärt.", url: "https://www.youtube.com/results?search_query=projection+mapping+tutorial+beginner+resolume+arena", type: "youtube", lang: "en" },
      { title: "▶ YouTube: Resolume Tutorial Deutsch", desc: "Resolume Arena auf Deutsch erklärt.", url: "https://www.youtube.com/results?search_query=resolume+arena+tutorial+deutsch", type: "youtube", lang: "de" },
    ],
  },
  {
    id: "audio", label: "Audio & Ton", color: "#22c55e", icon: "🎧",
    refs: [
      { title: "PA System Setup Tutorial (Audio University)", desc: "Schritt-für-Schritt: Wie baut man ein PA-System für Live-Events auf.", url: "https://audiouniversityonline.com/pa-system-setup/", type: "artikel", lang: "en" },
      { title: "Audio Mixer Setup: Beginner's Guide", desc: "Grundlagen des Mischpult-Setups – Eingänge, Ausgänge, EQ, Gain.", url: "https://audiouniversityonline.com/audio-mixer-setup-a-beginners-guide/", type: "artikel", lang: "en" },
      { title: "Live Stream Audio Setup Guide", desc: "Audio Interface und Mikrofon für professionelle Live-Streams einrichten.", url: "https://audiouniversityonline.com/live-stream-audio/", type: "artikel", lang: "en" },
      { title: "Sweetwater: Mixer Quickstart Guide", desc: "Einstieg in die Mischpult-Bedienung von Sweetwater.", url: "https://www.sweetwater.com/sweetcare/articles/mixer-quickstart-guide/", type: "artikel", lang: "en" },
      { title: "Tontechnik Grundlagen (DE – PDF)", desc: "Deutsche Einführung in den Aufbau und die Grundlagen einer Tonanlage.", url: "https://www.willowcreek.de/uploads/pdf/TA17_TG1_Tontechnik_Grundlagen_final.pdf", type: "artikel", lang: "de" },
      { title: "Grundlagen Veranstaltungstechnik (DE)", desc: "Allgemeine technische Grundlagen für Veranstaltungen auf Deutsch.", url: "https://frag-amu.de/grundlagen-veranstaltungstechnik/", type: "artikel", lang: "de" },
      { title: "▶ YouTube: Tonanlage aufbauen (DE)", desc: "Wie man eine Tonanlage für eine Veranstaltung aufbaut – deutsch.", url: "https://www.youtube.com/results?search_query=Tonanlage+aufbauen+Veranstaltung+Tutorial+deutsch", type: "youtube", lang: "de" },
      { title: "▶ YouTube: Live Event Audio Setup", desc: "Mikrofon, Mixer, PA-System für Live-Events professionell einrichten.", url: "https://www.youtube.com/results?search_query=live+event+audio+setup+tutorial+microphone+mixer+PA", type: "youtube", lang: "en" },
    ],
  },
  {
    id: "licht", label: "Licht & Bühne", color: "#f59e0b", icon: "💡",
    refs: [
      { title: "Bühnenlicht mit wenigen Mitteln (DE)", desc: "StageAid: Mit einfachen LEDs eindrucksvolles Bühnenlicht erzeugen.", url: "https://www.stageaid.de/so-macht-ihr-mit-wenigen-richtigen-mitteln-eindrucksvolles-buehnenlicht/", type: "artikel", lang: "de" },
      { title: "LED-Lichttechnik für die Bühne (DE)", desc: "Delamar: Kaufratgeber und Erklärung zu LED-Bühnentechnik.", url: "https://www.delamar.de/lichttechnik/led-lichttechnik-47102/", type: "artikel", lang: "de" },
      { title: "Bühnenbeleuchtung: Scheinwerfer richtig positionieren (DE)", desc: "Production Partner: Wo und wie man Scheinwerfer für maximale Wirkung platziert.", url: "https://www.production-partner.de/basics/wohin-mit-meinen-scheinwerfern/", type: "artikel", lang: "de" },
      { title: "Beginner's Guide to Lighting for Live Streams", desc: "BoxCast: Beleuchtungs-Grundlagen für Video-Produktion und Streams.", url: "https://www.boxcast.com/blog/a-beginners-guide-to-lighting-for-live-streams", type: "artikel", lang: "en" },
      { title: "Stage Lighting Guide (On Stage Lighting)", desc: "Umfassendes englisches Nachschlagewerk zu Bühnenlicht-Typen und Technik.", url: "https://www.onstagelighting.co.uk/stage-lighting-guides-help/", type: "artikel", lang: "en" },
      { title: "Stage Lighting Design Guide (Gear4Music)", desc: "Von Grundbegriffen bis zum kompletten Bühnendesign.", url: "https://www.gear4music.com/blog/stage-lighting-design/", type: "artikel", lang: "en" },
      { title: "LED Walls für Stage Setup (Rentforevent)", desc: "Design von Bühnen-Setup mit LED-Wänden und Panels.", url: "https://rentforevent.com/blog/designing-the-perfect-stage-setup-with-led-walls/", type: "artikel", lang: "en" },
      { title: "▶ YouTube: Bühnenlicht Tutorial (DE)", desc: "Einführung in Bühnenlicht auf Deutsch – Grundlagen und Praxis.", url: "https://www.youtube.com/results?search_query=Buehnenlicht+LED+Veranstaltung+Tutorial+Einsteiger+deutsch", type: "youtube", lang: "de" },
      { title: "▶ YouTube: Stage Lighting Tutorial", desc: "Stage Lighting für Live-Events und Esports professionell gestalten.", url: "https://www.youtube.com/results?search_query=stage+lighting+tutorial+LED+live+event+beginner", type: "youtube", lang: "en" },
    ],
  },
  {
    id: "kamera", label: "Kamera", color: "#3b82f6", icon: "🎥",
    refs: [
      { title: "Multi-Camera Live Shoot Guide (Videomaker)", desc: "Professioneller Ratgeber für Multi-Kamera Live-Produktionen.", url: "https://www.videomaker.com/article/f5/10988-how-to-conduct-a-live-multi-camera-shoot/", type: "artikel", lang: "en" },
      { title: "Multi-Camera Live Streaming Setup (Filmora)", desc: "Hardware, Software und Workflow für mehrere Kameras beim Live-Streaming.", url: "https://filmora.wondershare.com/ai-efficiency/multi-camera-live-streaming-youtube.html", type: "artikel", lang: "en" },
      { title: "Top Multi-Camera Live Streaming Solutions", desc: "TVU Networks: Überblick über professionelle Multi-Cam-Lösungen.", url: "https://www.tvunetworks.com/guides/mutli-camera-live-streaming-solutions/", type: "artikel", lang: "en" },
      { title: "Optimizing a Multi-Camera Setup (Ikan)", desc: "Technische Optimierung von Multi-Kamera-Rigs für Video-Produktion.", url: "https://ikancorp.com/optimizing-multi-camera-setup/", type: "artikel", lang: "en" },
      { title: "▶ YouTube: Multi-Cam Live Production", desc: "Tutorial: Multi-Kamera Setup für Live-Events und Esports.", url: "https://www.youtube.com/results?search_query=multi+camera+live+production+esports+tutorial+setup", type: "youtube", lang: "en" },
      { title: "▶ YouTube: Kamera Livestream Setup (DE)", desc: "Kamera richtig für Livestream einrichten – deutsch.", url: "https://www.youtube.com/results?search_query=Kamera+Livestream+Setup+Tutorial+deutsch+Einsteiger", type: "youtube", lang: "de" },
    ],
  },
  {
    id: "cidesign", label: "CI & Design", color: "#ec4899", icon: "🎨",
    refs: [
      { title: "7 E-Sports Brand Identities – The Brand Identity", desc: "Inspirierende Übersicht echter Esports-Branding-Projekte von Top-Studios.", url: "https://the-brandidentity.com/project/get-set-go-7-identities-that-showcase-the-power-of-branding-in-the-world-of-gaming-and-esport", type: "beispiel", lang: "en" },
      { title: "Esports Branding Inspiration (99designs)", desc: "Über 35 echte Esports Brand Identity Designs als Inspiration.", url: "https://99designs.com/inspiration/branding/esport", type: "beispiel", lang: "en" },
      { title: "Esports Branding Strategies (Champlain)", desc: "Wie führende Esports-Marken ihre Identität aufbauen und Fans binden.", url: "https://online.champlain.edu/blog/esports-marketing-branding", type: "artikel", lang: "en" },
      { title: "Envato: Esports Branding Templates", desc: "Fertige Grafik-Templates für Esports-Branding zum Download.", url: "https://elements.envato.com/learn/esports-branding", type: "tool", lang: "en" },
      { title: "▶ YouTube: Esports Logo Design Tutorial", desc: "Wie man ein professionelles Esports-Logo und Branding gestaltet.", url: "https://www.youtube.com/results?search_query=esports+logo+branding+design+tutorial+photoshop+illustrator", type: "youtube", lang: "en" },
      { title: "▶ YouTube: Event Branding Design (DE)", desc: "Grafik-Design für Events und Markenidentität auf Deutsch.", url: "https://www.youtube.com/results?search_query=event+branding+design+tutorial+deutsch+logo+CI", type: "youtube", lang: "de" },
    ],
  },
  {
    id: "marketing", label: "Marketing", color: "#f97316", icon: "📣",
    refs: [
      { title: "9 Best Esports Marketing Strategies", desc: "Influencer Marketing Hub: Bewährte Strategien für Esports-Event-Marketing.", url: "https://influencermarketinghub.com/esports-marketing-strategies/", type: "artikel", lang: "en" },
      { title: "Comprehensive Esports Marketing Strategies", desc: "Digital Agency Network: Vollständiger Guide für Esports-Promotion.", url: "https://digitalagencynetwork.com/esports-marketing-strategies/", type: "artikel", lang: "en" },
      { title: "Esports Marketing & Social Media (Walls.io)", desc: "Wie Esports-Brands Social Media effektiv einsetzen.", url: "https://blog.walls.io/showcases/esports-marketing-and-social-media/", type: "artikel", lang: "en" },
      { title: "16 Esports Marketing Strategies (Penji)", desc: "Visuelle und praktische Marketing-Tipps speziell für Esports-Events.", url: "https://penji.co/esports-marketing/", type: "artikel", lang: "en" },
      { title: "▶ YouTube: Esports Event Marketing", desc: "Wie man ein Esports-Event auf Social Media promotet.", url: "https://www.youtube.com/results?search_query=esports+event+marketing+social+media+promotion+strategy", type: "youtube", lang: "en" },
      { title: "▶ YouTube: Event Werbung Social Media (DE)", desc: "Social-Media-Marketing für Veranstaltungen auf Deutsch.", url: "https://www.youtube.com/results?search_query=Event+Marketing+Social+Media+Werbung+Veranstaltung+deutsch", type: "youtube", lang: "de" },
    ],
  },
  {
    id: "timeline", label: "Zeitplan", color: "#00e5ff", icon: "📅",
    refs: [
      { title: "Airtable: Esports Tournament Planning Template", desc: "Kostenloses Airtable-Template für vollständige Turnierplanung.", url: "https://www.airtable.com/templates/esports-tournament-planning/expAP67oGAjGdskB7", type: "template", lang: "en" },
      { title: "Instagantt: Esports Tournament Timeline", desc: "Gantt-Chart Template speziell für Esports-Turniere.", url: "https://www.instagantt.com/project-templates/esports-tournament-timeline", type: "template", lang: "en" },
      { title: "Meegle: Esports Event Development Timeline", desc: "Kostenloses Template für die komplette Event-Entwicklungs-Timeline.", url: "https://www.meegle.com/en_us/advanced-templates/game_industry_software_development/esports_event_development_timeline", type: "template", lang: "en" },
      { title: "Stackby: Esports Tournament Management", desc: "Fertige Datenbank-Vorlage für Turniermanagement.", url: "https://stackby.com/templates/esport-tournament", type: "template", lang: "en" },
      { title: "▶ YouTube: Event Zeitplan erstellen (DE)", desc: "Wie man einen professionellen Veranstaltungs-Zeitplan aufbaut.", url: "https://www.youtube.com/results?search_query=Veranstaltung+Zeitplan+erstellen+Projektplanung+deutsch", type: "youtube", lang: "de" },
    ],
  },
  {
    id: "beispiele", label: "Referenz-Events", color: "#a855f7", icon: "⭐",
    refs: [
      { title: "Riot Games – Worlds 2024 Broadcast", desc: "SVG Europe: Technischer Blick hinter die Kulissen der LoL World Championship 2024.", url: "https://www.svgeurope.org/blog/headlines/tech-eye-view-inside-the-epic-remote-production-for-riot-games-league-of-legends-world-championships-finals-2024/", type: "beispiel", lang: "en" },
      { title: "Riot Esports: Worlds 2022 Global Broadcast", desc: "Wie Riot Games die Weltmeisterschaft global ausgestrahlt hat – technischer Insight.", url: "https://www.riotgames.com/en/news/riot-esports-delivering-custom-global-broadcasts-worlds-2022", type: "beispiel", lang: "en" },
      { title: "LoL 2019 World Championship Opening Ceremony", desc: "Hinter den Kulissen der epischen Opening Ceremony – Licht, Ton, Projection Mapping.", url: "https://www.livedesignonline.com/concerts/behind-scenes-league-legends-2019-opening-ceremony", type: "beispiel", lang: "en" },
      { title: "GitHub: LoL Esports Broadcasting Guide", desc: "Open-Source Broadcast-Guide für League of Legends Esports.", url: "https://github.com/SolitudeRA/LoL-Esports-Broadcasting-Guide", type: "artikel", lang: "en" },
      { title: "ScreenSkills: Esports Producer Job Profile", desc: "Was macht ein Esports Producer? Offizielle Job-Beschreibung der UK Games Industry.", url: "https://www.screenskills.com/job-profiles/browse/games/production/esports-producer/", type: "artikel", lang: "en" },
      { title: "▶ YouTube: Behind the Scenes Esports Events", desc: "Behind-the-Scenes Videos von professionellen Esports-Produktionen.", url: "https://www.youtube.com/results?search_query=esports+event+behind+the+scenes+production+setup", type: "youtube", lang: "en" },
      { title: "▶ YouTube: LoL World Championship Production", desc: "Hinter den Kulissen der League of Legends World Championships.", url: "https://www.youtube.com/results?search_query=league+of+legends+world+championship+production+behind+the+scenes", type: "youtube", lang: "en" },
    ],
  },
];

const TYPE_CONFIG: Record<RefType, { label: string; color: string; bg: string }> = {
  artikel:  { label: "Artikel",   color: "#00e5ff", bg: "rgba(0,229,255,0.1)"    },
  youtube:  { label: "▶ YouTube", color: "#ff4444", bg: "rgba(255,68,68,0.12)"   },
  tool:     { label: "Tool",      color: "#22c55e", bg: "rgba(34,197,94,0.1)"    },
  template: { label: "Template",  color: "#f59e0b", bg: "rgba(245,158,11,0.1)"   },
  beispiel: { label: "Beispiel",  color: "#a855f7", bg: "rgba(168,85,247,0.1)"   },
};

function RefCard({ item: r, accent }: { item: Ref; accent: string }) {
  const t = TYPE_CONFIG[r.type];
  return (
    <a
      href={r.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl p-4 transition-all group"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        textDecoration: "none",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${accent}44`; (e.currentTarget as HTMLElement).style.background = `${accent}08`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)"; }}
    >
      <div className="flex items-start gap-2 mb-2">
        <span className="text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded shrink-0"
          style={{ background: t.bg, color: t.color, fontFamily: "'Orbitron', sans-serif" }}>{t.label}</span>
        <span className="text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded shrink-0"
          style={{ background: r.lang === "de" ? "rgba(255,215,0,0.12)" : "rgba(255,255,255,0.06)", color: r.lang === "de" ? "#ffd700" : "rgba(255,255,255,0.35)", fontFamily: "'Orbitron', sans-serif" }}>
          {r.lang === "de" ? "DE" : "EN"}
        </span>
      </div>
      <div className="text-sm font-bold text-white mb-1 leading-tight group-hover:text-current transition-colors"
        style={{ fontFamily: "'Rajdhani', sans-serif", color: r.type === "youtube" ? "#ff7777" : "white" }}>
        {r.title}
      </div>
      <p className="text-xs text-gray-400 leading-relaxed" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{r.desc}</p>
      <div className="mt-2 text-[10px] font-bold tracking-widest transition-colors"
        style={{ color: accent, fontFamily: "'Orbitron', sans-serif" }}>
        ÖFFNEN →
      </div>
    </a>
  );
}

export default function References() {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filtered = activeFilter === "all"
    ? CATEGORIES
    : CATEGORIES.filter(c => c.id === activeFilter);

  const totalRefs = CATEGORIES.reduce((s, c) => s + c.refs.length, 0);

  return (
    <div style={{ maxWidth: "64rem", margin: "0 auto", padding: "0 1rem 5rem" }}>
      <div className="mb-8">
        <h2 className="text-2xl font-black" style={{
          fontFamily: "'Orbitron', sans-serif",
          background: "linear-gradient(90deg, #fff, #00e5ff)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>Referenzen & Ressourcen</h2>
        <p className="text-sm text-gray-400 mt-1" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
          {totalRefs} kuratierte Links — Artikel, Tutorials, Tools und Beispiele aus dem ganzen Internet.
        </p>
      </div>

      {/* Filter */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "32px" }}>
        <button
          onClick={() => setActiveFilter("all")}
          className="px-3 py-1.5 rounded text-xs font-bold tracking-widest transition-all"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            background: activeFilter === "all" ? "rgba(0,229,255,0.2)" : "transparent",
            color: activeFilter === "all" ? "#00e5ff" : "rgba(255,255,255,0.4)",
            border: activeFilter === "all" ? "1px solid rgba(0,229,255,0.4)" : "1px solid rgba(255,255,255,0.08)",
            cursor: "pointer",
          }}
        >ALLE ({totalRefs})</button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveFilter(activeFilter === cat.id ? "all" : cat.id)}
            className="px-3 py-1.5 rounded text-xs font-bold tracking-widest transition-all"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              background: activeFilter === cat.id ? `${cat.color}20` : "transparent",
              color: activeFilter === cat.id ? cat.color : "rgba(255,255,255,0.4)",
              border: activeFilter === cat.id ? `1px solid ${cat.color}44` : "1px solid rgba(255,255,255,0.08)",
              cursor: "pointer",
            }}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Categories */}
      <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
        {filtered.map(cat => (
          <div key={cat.id}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <span style={{ fontSize: "20px" }}>{cat.icon}</span>
              <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "13px", fontWeight: 900, letterSpacing: "0.15em", textTransform: "uppercase", color: cat.color, margin: 0 }}>
                {cat.label}
              </h3>
              <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg, ${cat.color}33, transparent)` }} />
              <span style={{ fontSize: "10px", fontWeight: 700, color: `${cat.color}77`, fontFamily: "'Orbitron', sans-serif" }}>
                {cat.refs.length} Links
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" }}>
              {cat.refs.map((r, i) => <RefCard key={i} item={r} accent={cat.color} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
