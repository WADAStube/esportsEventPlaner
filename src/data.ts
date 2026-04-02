export interface SubOption {
  id: string;
  label: string;
  desc: string;
}

export interface SectionOption {
  id: string;
  label: string;
  badge: string;
  color: 'purple' | 'teal' | 'coral' | 'amber' | 'blue';
  short: string;
  details: string[];
  subs: SubOption[];
  teamSize: string;
}

export interface PlanningSection {
  id: string;
  title: string;
  question: string;
  options: SectionOption[];
  suggestions: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  interests?: string[];
}

export interface Professor {
  id: string;
  name: string;
  role: string;
}

export interface Role {
  id: string;
  title: string;
  category: 'Leadership' | 'Technical' | 'Creative' | 'Talent';
}

export const PROFESSORS: Professor[] = [
  { id: "prof1", name: "Herr T. Lemke",    role: "Modulverantwortlich / Betreuer" },
  { id: "prof2", name: "Herr C. Frerichs", role: "Co-Betreuer / Technische Leitung" },
];

export const TEAM_MEMBERS: TeamMember[] = [
  { id: "adrian",   name: "Adrian Scheele" },
  { id: "alina",    name: "Alina Piepke" },
  { id: "antonia",  name: "Antonia Volk" },
  { id: "chiara",   name: "Chiara Anschütz" },
  { id: "finn",     name: "Finn-Andrik Meister" },
  { id: "issam",    name: "Issam Selmi" },
  { id: "klara",    name: "Klara König" },
  { id: "lennart",  name: "Lennart Popp" },
  { id: "lennert",  name: "Lennert Schildgen" },
  { id: "linus",    name: "Linus Thesing" },
  { id: "samuel",   name: "Samuel Blümcke" },
  { id: "stephan",  name: "Stephan Pfefferkorn" },
  { id: "svenja",   name: "Svenja Gajewsky" },
];

export const ROLES: Role[] = [
  { id: "r1",  title: "Producer / Projektleitung",           category: "Leadership" },
  { id: "r2",  title: "Technical Director / Tech. Leitung",  category: "Technical" },
  { id: "r3",  title: "Stream Operator / Streaming",         category: "Technical" },
  { id: "r4",  title: "Camera Operator / Kamera",            category: "Technical" },
  { id: "r5",  title: "Audio Engineer / Ton",                category: "Technical" },
  { id: "r6",  title: "Lighting Technician / Licht",         category: "Technical" },
  { id: "r7",  title: "Vision Mixer / Bildregie",            category: "Technical" },
  { id: "r8",  title: "Graphics / Overlay Designer",         category: "Creative" },
  { id: "r9",  title: "3D Animation",                        category: "Creative" },
  { id: "r10", title: "Social Media Manager",                category: "Creative" },
  { id: "r11", title: "Marketing Manager",                   category: "Leadership" },
  { id: "r12", title: "Host / Moderator",                    category: "Talent" },
  { id: "r13", title: "Commentator / Kommentator",           category: "Talent" },
];

export const SECTIONS: PlanningSection[] = [
  {
    id: 'spiel',
    title: 'Spiel',
    question: 'Für welches Spiel entscheiden wir uns?',
    suggestions: [
      'Fortnite — Battle Royale, massentauglich',
      'FIFA / EA Sports FC — Fußball, jeder versteht es',
      'Overwatch 2 — Team-Shooter, kostenlos',
      'Street Fighter 6 — Fighting Game, spektakulär 1v1',
      'Minecraft — Kreativ-Events oder Speedruns',
      'PUBG — Battle Royale Klassiker',
      'Eigenes Hybrid-Format (zwei Spiele abwechselnd)',
    ],
    options: [
      {
        id: 'valorant',
        label: 'Valorant',
        badge: 'Futuristisch',
        color: 'purple',
        teamSize: '3–4 Personen (Spectator, Observer, Technik)',
        short: 'Moderner Tactical-Shooter, neon-ästhetisch — passt perfekt zur CI-Idee die wir anpeilen.',
        details: [
          'Spectator-Client direkt eingebaut, stabil und professionell nutzbar',
          'Passt perfekt zur futuristischen Neon-CI — visuell ein Match',
          'Sehr einfach zu kommentieren: klare Rundziele, jeder Kill zählt',
          'Große Bekanntheit bei 18–25-Jährigen — genau unsere Zielgruppe',
          'Match-Dauer ca. 30–45 min — gut kalkulierbar im Zeitplan',
        ],
        subs: [
          { id: 'val_t', label: '5v5 Turnier (4–8 Teams)', desc: 'Klassisch, mehrere Runden, viel Content' },
          { id: 'val_s', label: 'Showmatch + Mini-Turnier', desc: 'Bekannte Person als Gast einladen' },
        ],
      },
      {
        id: 'cs2',
        label: 'CS2',
        badge: 'Klassiker',
        color: 'amber',
        teamSize: '3–4 Personen',
        short: 'Der weltbekannteste Shooter. Kein Gaming-Vorwissen beim Publikum nötig — alle kennen es.',
        details: [
          'HLTV Observer-Tool für absolut professionelle Spectator-Ansicht',
          'Kein Gaming-Vorwissen nötig — Publikum versteht sofort worum es geht',
          'Dramatische Spannung durch das Runden-System ideal für Kommentar',
          'Viele lokale Teams vorhanden — leichter Teilnehmer zu finden',
          'Match-Dauer ca. 45–60 min, gut kalkulierbar',
        ],
        subs: [
          { id: 'cs_t', label: '5v5 Turnier', desc: 'Standard K.O.-Format' },
          { id: 'cs_d', label: 'Dozenten-Showmatch', desc: 'Garantierter Unterhaltungswert' },
        ],
      },
      {
        id: 'rl',
        label: 'Rocket League',
        badge: 'Publikumsfreundlich',
        color: 'teal',
        teamSize: '2–3 Personen',
        short: 'Jeder versteht Fußball. Kurze intense Matches, spektakuläre Momente — perfekt für Crowd.',
        details: [
          'Null Gaming-Vorwissen nötig — Publikum versteht sofort die Regeln',
          'Matches nur 5 min — sehr viel Action in kurzer Zeit',
          '3v3 Format erlaubt viele Teams und kurze Wartezeiten zwischen Matches',
          'Spektakuläre visuelle Momente: Aerial Goals, Last-Second-Saves',
          'Einfachste Spectator-Ansicht aller Optionen',
        ],
        subs: [
          { id: 'rl_t', label: '3v3 Turnier', desc: 'Viele Teams, schnelles Format' },
          { id: 'rl_s', label: '1v1 Showmatches', desc: 'Extrem intensiv für das Publikum' },
        ],
      },
      {
        id: 'lol',
        label: 'League of Legends',
        badge: 'Esport-Standard',
        color: 'blue',
        teamSize: '4–5 Personen (komplex)',
        short: 'Unser Vorbild (LoL Worlds). Riesige Community, bildgewaltig, professionell.',
        details: [
          'LoL Worlds 2024 ist unser Best-Practice-Vorbild — wir kennen das Format gut',
          'Spectator-Client stabil, Observer-Mode direkt eingebaut',
          'Sehr bildgewaltig — perfekt für das Projektmapping-Konzept',
          'Setzt etwas Gaming-Vorkenntnisse beim Publikum voraus',
          'Matches dauern 30–60 min — Timing etwas schwieriger zu planen',
        ],
        subs: [
          { id: 'lol_t', label: '5v5 mit Pick & Ban Phase', desc: 'Professionell, mehr Showcharakter' },
          { id: 'lol_s', label: 'Showmatch 5v5', desc: 'Fokus auf Entertainment' },
        ],
      },
    ],
  },

  {
    id: 'format',
    title: 'Format',
    question: 'Wie strukturieren wir den Event-Ablauf?',
    suggestions: [
      'Open Bracket — jeder kann mitspielen, keine Voranmeldung',
      'Round Robin + Finale',
      'Double-Elimination Bracket',
      'Bo3 (Best of 3) für alle Spiele',
      'Showmatch-only (kein Turnier, nur Entertainment)',
      'Mixed-Format: Turnier + Gameshow-Elemente (Challenges, Quizze)',
    ],
    options: [
      {
        id: 'vor',
        label: 'Vorentscheid + Finale',
        badge: 'Professionell',
        color: 'purple',
        teamSize: '5–6 Personen (zwei Events)',
        short: 'Qualifikation im Mai, Vor-Ort-Finale Anfang Juni. Zwei Events = doppelte Übungszeit für uns.',
        details: [
          'Vorentscheid ist gleichzeitig unsere technische Generalprobe für den Stream',
          'Spannungsaufbau durch Qualifikationsdrama — wer schafft es ins Finale?',
          'Mehr Content für Social Media über mehrere Wochen aufgebaut',
          'Höherer Organisationsaufwand, aber maximale Lernkurve',
          'Finalisten sind am großen Event-Tag bereits eingespielt',
        ],
        subs: [
          { id: 'vor_on', label: 'Vorentscheid online', desc: 'Spieler spielen von zuhause' },
          { id: 'vor_cp', label: 'Vorentscheid auf Campus', desc: 'Kleiner Rahmen, mehr Kontrolle' },
        ],
      },
      {
        id: 'single',
        label: 'Single-Day Turnier',
        badge: 'Kompakt & Sicher',
        color: 'teal',
        teamSize: '3–4 Personen',
        short: 'Gruppenphase morgens, K.O. nachmittags, Finale + Show abends. Alles an einem Tag.',
        details: [
          'Weniger Organisationsaufwand — alles konzentriert an einem einzigen Tag',
          'Klarer Zeitrahmen — gut planbar im Semester',
          'Stream morgens als Soft-Test nutzen, abends volle Power',
          'Publikum kommt gezielt abends zum Finale',
          'Empfehlung: max 8 Teams für reibungslosen Ablauf',
        ],
        subs: [
          { id: 'sd_8', label: '8 Teams', desc: 'Gruppenphase 2×4, dann K.O.' },
          { id: 'sd_4', label: '4 Teams', desc: 'Kompakter, direkt K.O.-Format' },
        ],
      },
      {
        id: 'show',
        label: 'Showmatch + Mini-Turnier',
        badge: 'Entertainment',
        color: 'coral',
        teamSize: '2–3 Personen',
        short: 'Kleines Turnier als Aufwärmer, dann das große Showmatch als emotionaler Höhepunkt.',
        details: [
          'Garantierter Unterhaltungswert durch das Showmatch-Element',
          'Dozenten oder bekannte Persönlichkeit als Gäste ideal einsetzbar',
          'Weniger Turnier-Komplexität, mehr Fokus auf die Show selbst',
          'Ideal wenn die Teilnehmer-Zahl unsicher ist',
          'Showmatch als absoluter Crowd-Pleaser am Ende planbar',
        ],
        subs: [
          { id: 'sh_d', label: 'Dozenten vs. Studierende', desc: 'Immer unterhaltsam, große Lacher garantiert' },
          { id: 'sh_k', label: 'Bekannte Person einladen', desc: 'Hannover / lokale Esport-Persönlichkeit' },
        ],
      },
      {
        id: 'swiss',
        label: 'Swiss System',
        badge: 'Fair & Modern',
        color: 'blue',
        teamSize: '3–5 Personen',
        short: 'Jeder spielt gleich viele Runden. Kein frühes Ausscheiden — alle bleiben aktiv bis zum Ende.',
        details: [
          'Keine Gruppe scheidet frühzeitig aus — alle Teams spielen gleich viele Matches',
          'Fairstes Turnier-Format für unterschiedliche Skill-Level',
          'Beliebt in CS2 und LoL-Profi-Liga (z.B. Worlds Groups)',
          'Gut planbar: feste Rundenanzahl, keine Überraschungen',
          'Ideal wenn wir viele Teams haben aber Zeit begrenzt ist',
        ],
        subs: [
          { id: 'sw_3', label: '3 Runden Swiss', desc: 'Schnell, ideal für 8+ Teams' },
          { id: 'sw_5', label: '5 Runden Swiss', desc: 'Ausgewogen, klares Ranking am Ende' },
        ],
      },
    ],
  },

  {
    id: 'location',
    title: 'Location',
    question: 'Wo findet unser Event statt?',
    suggestions: [
      'Hochschul-Außengelände / Campus Outdoor',
      'Coworking Space in Emden',
      'Kulturzentrum / Bürgerhaus',
      'Industrie-Halle (Loft-Style, markant)',
      'Sportsporthalle (große Fläche, viel Platz)',
    ],
    options: [
      {
        id: 'tech',
        label: 'Technikum / G28',
        badge: 'Sicher & Praktisch',
        color: 'teal',
        teamSize: '2–3 Personen Aufbau',
        short: 'Wir kennen den Raum, Equipment vor Ort, keine Mietkosten. Solide und sichere Basis.',
        details: [
          'Keine Mietkosten — Genehmigungen deutlich einfacher',
          'Hochschul-Equipment direkt nutzbar — weniger Beschaffungsaufwand',
          'Wir kennen den Raum — keine bösen Überraschungen am Event-Tag',
          'Projektmapping an Wänden gut umsetzbar',
          'Publikumsgröße ca. 50–100 Personen realistisch',
        ],
        subs: [
          { id: 'tc_a', label: 'Arena-Style Layout', desc: 'Spieler auf Bühne, Publikum davor' },
          { id: 'tc_s', label: 'Studio-Style Layout', desc: 'TV-Aufbau, besser für Kamera-Optik' },
        ],
      },
      {
        id: 'mensa',
        label: 'Mensa / Aula',
        badge: 'Zentral',
        color: 'amber',
        teamSize: '4–5 Personen Aufbau',
        short: 'Größerer Campus-Raum, mehr Publikum möglich, zentralerer Standort.',
        details: [
          'Mehr Platz für Publikum (100–200 Personen)',
          'Zentraler Standort — mehr Laufpublikum vom Campus möglich',
          'Höherer Umbauaufwand nötig',
          'Akustik-Check wichtig — Nachhall kann problematisch sein',
          'Verpflegung durch Mensa eventuell möglich',
        ],
        subs: [
          { id: 'mn_e', label: 'Abend-Event (18–22 Uhr)', desc: 'Mensa frei, viel mehr Atmosphäre' },
          { id: 'mn_w', label: 'Wochenend-Event', desc: 'Mehr Aufbauzeit, kein Lehrplan-Konflikt' },
        ],
      },
      {
        id: 'fest',
        label: 'Festspielhaus / Nordseehalle',
        badge: 'Maximaler Impact',
        color: 'purple',
        teamSize: '6+ Personen Aufbau',
        short: 'Professionelle Bühne — größtes WOW-Potenzial, aber auch aufwändigste Option.',
        details: [
          'Profi-Bühneninfrastruktur vorhanden — würde absolut beeindruckend aussehen',
          'Maximaler Eindruck für Publikum und Stream',
          'Mietkosten und Genehmigungen nötig — Budget muss geklärt werden',
          'Equipment-Transport aufwändig — früh planen',
          'Ideal für großflächiges Projektmapping',
          'Empfehlung: nur wenn Budget und Zeit wirklich reichen',
        ],
        subs: [
          { id: 'fs_f', label: 'Volle Bühnennutzung', desc: 'Maximaler Eindruck, mehr Aufwand' },
          { id: 'fs_p', label: 'Teilbereich mieten', desc: 'Günstiger, oft ausreichend für uns' },
        ],
      },
      {
        id: 'hybrid',
        label: 'Hybrid-Location',
        badge: 'Flexibel',
        color: 'coral',
        teamSize: '3–4 Personen Koordination',
        short: 'Zwei Räume: Spieler im Nebenraum, Caster + Publikum im Hauptraum. Professioneller Look.',
        details: [
          'Spieler in separatem ruhigen Raum = keine Crowd-Ablenkung, fair für alle',
          'Hauptraum für Publikum, Caster, Projektion und Licht-Show',
          'Wirkt visuell professioneller als alle auf einer Bühne',
          'Technik-Aufwand: Kabel zwischen Räumen oder Netzwerk-Setup',
          'Braucht gute Kommunikation zwischen Technik-Teams beider Räume',
          'Ideal wenn wir Technikum + benachbarten Seminarraum haben',
        ],
        subs: [
          { id: 'hyb_c', label: 'Soundproofing', desc: 'Spieler hören kein Crowd-Noise' },
          { id: 'hyb_s', label: 'Screen-Übertragung im Spielraum', desc: 'Spieler sehen den Stream-Output' },
        ],
      },
    ],
  },

  {
    id: 'mapping',
    title: 'Projektmapping',
    question: 'Was ist unser Mapping-Konzept?',
    suggestions: [
      'Spieler-Portraits / Player Cards werden projiziert',
      'Scoreboard als Projektion an der Wand',
      'Intro-Video Countdown-Animation',
      'Live-Generative Visuals (TouchDesigner reagiert auf Musik)',
      'Kein Mapping — Fokus auf Licht und Screens',
    ],
    options: [
      {
        id: 'map_i',
        label: 'Eröffnungs-Show Mapping',
        badge: 'Höchster Impact',
        color: 'purple',
        teamSize: '2–3 Personen (Produktion + Operator)',
        short: 'Spektakuläre 2–3 Min Opening mit Countdown und Logo-Enthüllung auf der Projektionsfläche.',
        details: [
          'Konzentrierter Aufwand: nur 2–3 Min Content produzieren, dafür perfekt poliert',
          'Maximaler Ersteindruck — dieser Moment macht das Event unvergesslich',
          'Countdown läuft über die gesamte Projektionsfläche, building up',
          'Logo-Enthüllung als absoluter Showstopper zum Start',
          'Danach: Ambient-Loop als entspannter Dauerhintergrund',
        ],
        subs: [
          { id: 'mp_r', label: 'Resolume Arena', desc: 'Industrie-Standard, Trial verfügbar' },
          { id: 'mp_m', label: 'MadMapper Lite', desc: 'Kostenlos, einsteigerfreundlicher Einstieg' },
        ],
      },
      {
        id: 'map_a',
        label: 'Ambient-Dauermapping',
        badge: 'Konstant Stark',
        color: 'teal',
        teamSize: '1–2 Personen',
        short: 'Animierter Hintergrund läuft durchgehend — CI-Farben, Partikel, Game-Elemente.',
        details: [
          'Kein Timing-Druck: läuft einfach kontinuierlich im Hintergrund',
          'Weniger Produktionsaufwand als reaktives Mapping',
          'Konstant visuell beeindruckend — immer etwas auf der Fläche los',
          'Einfacher zu realisieren mit wenig Mapping-Erfahrung',
          'Ideal als Einstieg oder als Basis für die anderen Konzepte',
        ],
        subs: [
          { id: 'mp_g', label: 'Game-Elemente & Charaktere', desc: 'Passend zum gewählten Spiel' },
          { id: 'mp_ab', label: 'Abstrakt / CI-Geometrie', desc: 'Einfacher zu produzieren, immer passend' },
        ],
      },
      {
        id: 'map_r',
        label: 'Reaktives Event-Mapping',
        badge: 'Innovativ',
        color: 'coral',
        teamSize: '3–4 Personen (Produktion, Operator, Sync)',
        short: 'Mapping-Szenen werden live getriggert — Kill, Sieg, Spannung, Pause — alles reagiert.',
        details: [
          'Höchster WOW-Faktor: das Mapping reagiert sichtbar auf das Spielgeschehen',
          'Kill → Explosion auf der Wand, Sieg → Konfetti-Mapping, Pause → ambient',
          'Enge Abstimmung mit Audio & Licht von Anfang an zwingend nötig',
          'Operator reagiert live während des Events — braucht volle Konzentration',
          'Empfehlung: Ambient als Basis + reaktive Trigger obendrauf ergänzen',
        ],
        subs: [
          { id: 'mp_td', label: 'TouchDesigner', desc: 'Mächtig für Echtzeit, steilere Lernkurve' },
          { id: 'mp_rv', label: 'Resolume Arena', desc: 'Gut für manuelles Triggern von Szenen' },
        ],
      },
      {
        id: 'map_c',
        label: 'Kombiniertes Full-Show Mapping',
        badge: 'Alles drin',
        color: 'amber',
        teamSize: '4–5 Personen',
        short: 'Opening-Animation + Ambient-Loop + reaktive Trigger kombiniert. Das Komplettpaket.',
        details: [
          'Kombination aus allen drei Konzepten: Opening, Ambient und reaktiv',
          'Bestes Ergebnis — aber auch höchster Planungs- und Produktionsaufwand',
          'Klare Aufgabenteilung im Team absolut wichtig',
          'Generalprobe mindestens 2× mit vollem Tech-Setup',
          'Empfehlung: in Kleingruppen entwickeln, dann zusammenführen',
          'Wenn es klappt: wirkt wie ein echter professioneller Esport-Event',
        ],
        subs: [
          { id: 'mp_ca', label: 'After Effects + Resolume', desc: 'Bestes Produktions-Workflow' },
          { id: 'mp_cm', label: 'Mehrere Projektoren', desc: 'Für großflächigere Projektionsflächen' },
        ],
      },
    ],
  },

  {
    id: 'audio',
    title: 'Audio',
    question: 'Wie komplex ist unser Audio-Setup?',
    suggestions: [
      'Podcast-Setup für Caster (Rode PodMic o.ä.)',
      'Drahtlose Headsets für Moderator',
      'Live-DJ zwischen den Matches',
      'Crowd-Mikrofon für Stimmungsmessung',
      'Separate In-Ear Monitoring für Spieler',
      'Hardware-Equalizer für Ingame-Sound',
    ],
    options: [
      {
        id: 'au_b',
        label: 'Solides Basis-Setup',
        badge: 'Professionell',
        color: 'blue',
        teamSize: '2–3 Personen (Audio-Team)',
        short: 'PA, FOH, Caster-Mikros, Intercom, Ingame-Audio. Alles was wir wirklich brauchen.',
        details: [
          'PA-System + FOH-Mischpult — zuerst bei Hochschule anfragen!',
          '2 Caster-Headsets mit eigenem Monitor-Mix damit sie Ingame-Sound hören',
          'Intercom für Regie-Kommunikation (Funk oder Discord-Kanal)',
          'Ingame-Audio vom Spectator-PC in FOH gerouted',
          'Noise-Cancelling Headsets für alle Spieler — wichtig für Konzentration',
          'GEMA-freie Musik für Stream und Venue besorgen',
        ],
        subs: [
          { id: 'au_bi', label: 'Dediziertes Interview-Mikro', desc: 'Für Pre/Post-Match Interviews auf der Bühne' },
          { id: 'au_bc', label: 'Crowd-Mikro', desc: 'Publikumsreaktionen im Stream hörbar machen' },
        ],
      },
      {
        id: 'au_s',
        label: 'Soundboard + Einspieler',
        badge: 'Mehr Entertainment',
        color: 'teal',
        teamSize: '3–4 Personen',
        short: 'Basis + Stream Deck mit vordefinierten Sound-Einspielern auf Knopfdruck.',
        details: [
          'Alles aus Basis-Setup dazu',
          'Stream Deck oder Soundboard-Software mit 10–15 vordefinierten Sounds',
          'Kill-Sound, Crowd-Fanfare, Suspense-Stinger, Siegesfanfare auf Knopfdruck',
          'Kann mit Lichteffekten synchronisiert werden — hoher Mehrwert',
          'Operator braucht Einarbeitungszeit, lohnt sich aber absolut',
          'Hoher Entertainment-Mehrwert für Stream-Zuschauer und Vor-Ort-Publikum',
        ],
        subs: [
          { id: 'au_sl', label: 'Sync mit Licht', desc: 'Soundboard-Trigger = gleichzeitiges Lichtmakro' },
          { id: 'au_sm', label: 'Sync mit Mapping', desc: 'Soundboard-Trigger = Mapping-Szene wechselt' },
        ],
      },
      {
        id: 'au_f',
        label: 'Voll-synchronisiertes System',
        badge: 'Maximum Impact',
        color: 'purple',
        teamSize: '4–5 Personen (alle Bereiche)',
        short: 'Ein Trigger aktiviert gleichzeitig Sound + Licht + Mapping. Hochprofessionell.',
        details: [
          'Alles aus Soundboard-Setup dazu',
          'Ein Knopfdruck: Sound + Lichtmakro + Mapping-Szene gleichzeitig',
          'Enge Abstimmung aller drei Teams von Woche 1 an zwingend nötig',
          'Generalprobe unverzichtbar — mindestens 2 vollständige Probe-Läufe',
          'Wenn es klappt: wirkt absolut professionell und sehr beeindruckend',
          'Risiko: höhere Komplexität = mehr mögliche Fehlerquellen live',
        ],
        subs: [
          { id: 'au_fd', label: 'Elgato Stream Deck', desc: 'Bestes Tool für den Trigger-Operator' },
          { id: 'au_fm', label: 'MIDI-Controller', desc: 'Flexibler, aber komplexer zu konfigurieren' },
        ],
      },
      {
        id: 'au_dj',
        label: 'Live-DJ + Basis',
        badge: 'Atmosphäre',
        color: 'coral',
        teamSize: '3–4 Personen (inkl. DJ)',
        short: 'DJ spielt live zwischen Matches — maximale Stimmung im Venue, authentisches Event-Feeling.',
        details: [
          'Live-DJ zwischen den Matches hält die Energie oben',
          'Keine GEMA-Probleme wenn DJ eigene Tracks / Royalty-Free spielt',
          'DJ kann auf die Crowd reagieren — flexibel und spontan',
          'Braucht eigenes DJ-Setup (Controller, Laptop, ggf. extra PA)',
          'Perfekter Übergang zwischen technischen Pausen',
          'Optional: DJ macht auch Intro-Sound für das Opening',
        ],
        subs: [
          { id: 'au_djl', label: 'DJ aus Studierendenschaft', desc: 'Günstiger, authentischer Campus-Vibe' },
          { id: 'au_djm', label: 'DJ + Visualizer-Setup', desc: 'DJ-Booth mit eigenem LED-Visualizer' },
        ],
      },
    ],
  },

  {
    id: 'licht',
    title: 'Licht',
    question: 'Was ist unser Lichtdesign-Konzept?',
    suggestions: [
      'LED-Strips hinter Gaming-Setups (Budget-freundlich)',
      'Lasershow zwischen den Matches',
      'Follow-Spot für Moderator/Host',
      'Beamer-Wash als Ersatz für Moving Heads',
      'UV-Schwarzlicht für atmosphärische Wirkung',
    ],
    options: [
      {
        id: 'li_t',
        label: 'Team-Farben Konzept',
        badge: 'Klar lesbar',
        color: 'blue',
        teamSize: '2 Personen (Licht-Team)',
        short: 'Jedes Team bekommt eine Lichtfarbe — Publikum sieht sofort wer gerade dominiert.',
        details: [
          'Visuell sofort lesbar: Blau vs. Rot oder Grün vs. Orange',
          'Spielerstationen werden in der jeweiligen Teamfarbe beleuchtet',
          'Bei Kill oder wichtigem Moment: kurzer Blitz in der Siegerfarbe',
          'Leicht umsetzbar mit programmierbaren Moving Heads',
          'Gut für Publikums-Immersion und sieht im Stream sehr stark aus',
        ],
        subs: [
          { id: 'li_tm', label: 'Moving Heads (4–6)', desc: 'Dynamisch, flexibel überall einsetzbar' },
          { id: 'li_tl', label: 'LED-Panels hinter Spielern', desc: 'Günstig, immer im Kamera-Bild sichtbar' },
        ],
      },
      {
        id: 'li_p',
        label: 'Phasenbezogenes Licht',
        badge: 'Dramatisch',
        color: 'amber',
        teamSize: '2–3 Personen',
        short: 'Licht ändert sich je nach Spielphase — Spannung baut sich visuell auf.',
        details: [
          'Neutral/Warm in Wartezeiten und Interviews',
          'Cool-Blau/Lila in aktiven Spielphasen',
          'Intensive Farben + Strobo beim Finale-Moment',
          'Gold/Warm für die Siegerehrung am Ende',
          'Vorprogrammierte DMX-Szenen, manuell ausgelöst — sicher und planbar',
        ],
        subs: [
          { id: 'li_pd', label: 'DMX-Controller mit Szenen', desc: 'Vorprogrammiert, live sicher auslösbar' },
          { id: 'li_ph', label: 'Hazer / Nebelmaschine', desc: 'Macht Lichtstrahlen sichtbar — sehr cineastisch' },
        ],
      },
      {
        id: 'li_s',
        label: 'Audio-Sync Licht',
        badge: 'Innovativ',
        color: 'purple',
        teamSize: '3 Personen (Audio + Licht eng koordiniert)',
        short: 'Soundboard-Trigger aktivieren gleichzeitig vorprogrammierte Lichtmakros.',
        details: [
          'Stärkste visuelle Wirkung im Zusammenspiel mit Audio',
          'Kill → roter Blitz, Sieg → volle Light-Show, Pause → ambient',
          'Braucht enge Abstimmung zwischen Audio- und Licht-Team von Anfang an',
          'Generalprobe unbedingt nötig — kein Improvisieren live möglich',
          'Referenz: Adrians Video-Beispiel zeigt genau diese Art von Setup',
        ],
        subs: [
          { id: 'li_ss', label: 'Via Stream Deck', desc: 'Trigger von der Audio-Position aus bedienen' },
          { id: 'li_sd', label: 'Via DMX-Software direkt', desc: 'Direktere Licht-Kontrolle ohne Umweg' },
        ],
      },
      {
        id: 'li_arch',
        label: 'Architektur-Licht + Akzente',
        badge: 'Elegant',
        color: 'coral',
        teamSize: '2 Personen',
        short: 'RGBW-Strips, Uplights und Gobos verwandeln den Raum — ohne teure Moving Heads.',
        details: [
          'LED Uplights an den Wänden für Raumstimmung (günstiger als Moving Heads)',
          'Gobo-Projektor für Muster an den Wänden (Logos, geometrische Formen)',
          'RGBW-Strips unter und hinter Gaming-Desks — sehr fotogen',
          'Einfacheres DMX-Setup als bei Moving Heads',
          'Gut kombinierbar mit Projektmapping',
          'Budget-freundlichste Option mit professionellem Look',
        ],
        subs: [
          { id: 'li_ag', label: 'Gobo-Logo-Projektion', desc: 'Event-Logo an die Wand projizieren' },
          { id: 'li_au', label: 'Uplights in CI-Farben', desc: 'Raumstimmung passend zum Event-Design' },
        ],
      },
    ],
  },

  {
    id: 'kamera',
    title: 'Kamera',
    question: 'Wie groß ist unser Kamera-Setup?',
    suggestions: [
      'Webcam-Array statt professioneller Kameras (Budget-Option)',
      'Gimbal-Kamera für dynamische Moves',
      'GoPro an Spieler-Setups',
      'Slow-Motion Kamera für Highlights',
      'Overhead-Rig (Spinnenkamera)',
    ],
    options: [
      {
        id: 'ca_m',
        label: 'Minimal – 3 Kameras',
        badge: 'Gut handhabbar',
        color: 'teal',
        teamSize: '2 Personen Kamera',
        short: 'Caster-Cam, Spieler-Übersicht, eine mobile Kamera. Funktioniert auch mit kleinem Team.',
        details: [
          '1× Caster-Kamera (fest, Stativ)',
          '1× Spieler-Übersicht (fest, Wide-Shot auf alle)',
          '1× Mobile Springer-Cam für Publikum, Reaktionen und Interviews',
          '4 Schnitt-Optionen: 3 Cams + Ingame-Feed',
          'Empfehlung wenn unser Kamera-Team kleiner ist',
        ],
        subs: [
          { id: 'ca_mo', label: 'OBS Studio (kostenlos)', desc: 'Gut für simples Setup, wir kennen es' },
          { id: 'ca_mv', label: 'vMix Trial', desc: 'Professioneller, mehr Schnitt-Optionen' },
        ],
      },
      {
        id: 'ca_s',
        label: 'Standard – 5 Kameras',
        badge: 'Empfohlen',
        color: 'purple',
        teamSize: '3 Personen Kamera + Bildregie',
        short: 'Zusätzlich: Interview-Cam + Spieler-Nahaufnahme. Professionelles Bild für Stream.',
        details: [
          'Alles aus Minimal +',
          '1× stationäre Interview-Kamera (eigene Zone, immer bereit)',
          '1× POV/Nahaufnahme einzelner Spieler für emotionale Momente',
          '6 Schnitt-Optionen: 5 Cams + Ingame-Feed',
          'Braucht mindestens 3 Kamera-Operatoren',
          'Unser empfohlenes Setup für das Event',
        ],
        subs: [
          { id: 'ca_sr', label: 'Instant Replay', desc: 'Highlights direkt nochmal zeigen' },
          { id: 'ca_ss', label: 'Split-Screen Reaktionen', desc: 'Spieler + Ingame gleichzeitig im Bild' },
        ],
      },
      {
        id: 'ca_p',
        label: 'Pro – 6+ Kameras',
        badge: 'Maximum',
        color: 'coral',
        teamSize: '4–5 Personen Kamera',
        short: 'Zusätzlich: Overhead-Cam, POV-Webcams. Optional: Drohnen-Shot für Opening.',
        details: [
          'Alles aus Standard +',
          '1× Overhead-Cam auf das komplette Gaming-Setup',
          'POV-Webcams auf einzelne Spieler (Webcam-Qualität reicht)',
          'Optional: Indoor-Drohne für Opening/Siegerehrung (Genehmigung beachten!)',
          'Braucht erfahreneren Bildregie-Operator',
          'Maximaler Content für Highlights und VODs',
        ],
        subs: [
          { id: 'ca_pd', label: 'Indoor-Drohne', desc: 'Spektakuläre Fly-Throughs' },
          { id: 'ca_pg', label: 'Gimbal für Springer-Cam', desc: 'Wackelfreie, dynamische Bewegung' },
        ],
      },
      {
        id: 'ca_h',
        label: 'Hybrid (Cam + Screen-Capture)',
        badge: 'Kreativ',
        color: 'amber',
        teamSize: '2–3 Personen',
        short: 'Wenige physische Kameras, aber maximaler Ingame-Content durch clevere Screen-Captures.',
        details: [
          '2× physische Kameras + maximale Ingame-Ansichten',
          'OBS Spectator-Capture für Übersichtskarte, Kills, Score live',
          'Split-Screen und Picture-in-Picture im Stream-Design',
          'Weniger Kamera-Personal nötig — ideal für unser Teamgröße',
          'Sehr professioneller Look durch gutes Overlay-Design',
          'Spart Budget und Aufwand bei der Kameratechnik',
        ],
        subs: [
          { id: 'ca_hi', label: 'Ingame-Übersichtskarte', desc: 'Live-Map immer sichtbar im Stream' },
          { id: 'ca_hk', label: 'Kill-Cam Highlights', desc: 'Automatisches Highlight-Capture' },
        ],
      },
    ],
  },

  {
    id: 'streaming',
    title: 'Streaming',
    question: 'Wo und wie streamen wir unser Event?',
    suggestions: [
      'Nur Vor-Ort (kein Stream) — Fokus auf Live-Publikum',
      'Interner Stream (nur Hochschul-Netzwerk)',
      'LinkedIn Live (professionelles Netzwerk, gut für Modul-Dokumentation)',
      'Privater YouTube-Link (nur Eingeladene schauen)',
      'Hochschul-Website einbetten',
    ],
    options: [
      {
        id: 'st_t',
        label: 'Twitch',
        badge: 'Esport-Standard',
        color: 'purple',
        teamSize: '2 Personen (Streaming + Overlay)',
        short: 'Die Plattform für Gaming. Interaktiver Chat, Emotes, etabliertes Publikum.',
        details: [
          'Absoluter Standard für Esport-Übertragungen',
          'Chat-Kultur mit Emotes ist wichtig für das Feeling',
          'Zuschauer finden leichter Gaming-Content',
          'Einfach aufzusetzen, OBS-Integration perfekt',
          'VODs bleiben 14 Tage (müssen manuell exportiert werden)',
        ],
        subs: [
          { id: 'st_te', label: 'Eigene Emotes', desc: 'Campus/Event-spezifische Emotes erstellen' },
          { id: 'st_tp', label: 'Twitch Predictions', desc: 'Zuschauer tippen auf den Sieger' },
        ],
      },
      {
        id: 'st_y',
        label: 'YouTube Live',
        badge: 'Archiv-Fokus',
        color: 'amber',
        teamSize: '2 Personen',
        short: 'VOD bleibt dauerhaft als Video erhalten — perfekt für Portfolio und Modulabgabe.',
        details: [
          'Qualität oft stabiler bei höheren Bitraten',
          'Stream wird direkt danach als permanentes Video gespeichert',
          'Kein manueller Export nötig für das Modul-Archiv',
          'Weniger organische Gaming-Zuschauer als Twitch',
          'Zurückspulen während des Live-Streams möglich (DVR-Feature)',
        ],
        subs: [
          { id: 'st_yc', label: 'Kapitel-Marker (Live)', desc: 'Matches markieren für VOD-Zuschauer' },
          { id: 'st_y4', label: '1440p/4K Stream', desc: 'Wenn Internetverbindung es zulässt' },
        ],
      },
      {
        id: 'st_m',
        label: 'Multistream (Restream)',
        badge: 'Maximale Reichweite',
        color: 'teal',
        teamSize: '2–3 Personen',
        short: 'Twitch + YouTube gleichzeitig. Maximale Reichweite auf allen Kanälen.',
        details: [
          'Erreicht Nutzer auf beiden Plattformen gleichzeitig',
          'Braucht Drittanbieter-Tool wie Restream.io (oder OBS Plugin)',
          'Chat-Moderation komplexer (welchen Chat zeigt man on-stream?)',
          'Höherer CPU-Anspruch an den Streaming-PC falls lokal codiert',
          'Für unser erstes Event vielleicht unnötig komplex',
        ],
        subs: [
          { id: 'st_mo', label: 'OBS Multi-RTMP', desc: 'Kostenloses Plugin, braucht doppelt Upload' },
          { id: 'st_mr', label: 'Restream.io', desc: 'Cloud-Dienst, kostet monatlich für Custom' },
        ],
      },
      {
        id: 'st_lo',
        label: 'Nur Vor-Ort / Lokaler Stream',
        badge: 'Einfach',
        color: 'coral',
        teamSize: '1–2 Personen',
        short: 'Kein öffentlicher Stream — voller Fokus auf das Live-Publikum. Einfach, ohne Druck.',
        details: [
          'Kein Streaming-Druck — Technik-Fehler treffen kein Online-Publikum',
          'Volle Energie und Fokus auf das Vor-Ort-Erlebnis',
          'Trotzdem: Lokaler HDMI-Screen oder Beamer im Raum',
          'Highlights können nachträglich als VOD produziert werden',
          'Optional: Making-Of Video wird nach dem Event fertiggestellt',
          'Empfehlung für erstes Event wenn Stream-Setup unsicher ist',
        ],
        subs: [
          { id: 'st_loh', label: 'Highlight-Reel danach', desc: 'Best-Of Video für Social Media' },
          { id: 'st_lok', label: 'Kein Stream — Kürzere Vorbereitung', desc: 'Fokus auf Live-Produktion' },
        ],
      },
    ],
  },

  {
    id: 'ci',
    title: 'CI & Design',
    question: 'Welche visuelle Identität bekommt unser Event?',
    suggestions: [
      'Retrowave / Synthwave Ästhetik (80er Jahre Neon)',
      'Anime / Manga Illustrationsstil',
      'Militär / Tactical (dunkelgrün, brutal, ernst)',
      'Space / Sci-Fi (Sterne, Planeten, galaktisch)',
      'Dual-Theme (Team A vs. Team B haben eigene Farben)',
    ],
    options: [
      {
        id: 'ci_c',
        label: 'Cyberpunk / Neon',
        badge: 'Trendy',
        color: 'teal',
        teamSize: '2–3 Personen Design',
        short: 'Dunkelblau, Neon-Cyan, Pink. Sehr gängig im Esport, sieht immer gut aus.',
        details: [
          'Farben: Deep Navy, Cyan (#00f5ff), Magenta (#ff006e)',
          'Schriftarten: Orbitron oder Rajdhani — technisch und modern',
          'Viel Glow-Effekte, Glitch-Übergänge, Raster-Muster',
          'Passt perfekt zu Valorant oder CS2',
          'Sehr dankbar für Licht- und Mapping-Design umzusetzen',
        ],
        subs: [
          { id: 'ci_cg', label: 'Glitch-Transitions', desc: 'Animierte Übergänge im Stream' },
          { id: 'ci_ch', label: 'Hologram-Look', desc: 'Für Player-Cards und Overlays' },
        ],
      },
      {
        id: 'ci_m',
        label: 'Minimalistisch / Clean',
        badge: 'Hochwertig',
        color: 'blue',
        teamSize: '2 Personen Design',
        short: 'Weiß, Schwarz, eine kräftige Akzentfarbe. Apple/Swiss-Design meets Esport.',
        details: [
          'Farben: Weiß, Off-Black, z.B. leuchtendes Orange oder Blau als Akzent',
          'Schriftarten: Inter, Roboto — extrem clean und lesbar',
          'Weniger "Gamer-Klischees", wirkt seriöser und erwachsener',
          'Fokus auf hervorragende Typografie und viel Whitespace',
          'Sehr elegant für Overlays — verdeckt wenig vom Spiel',
        ],
        subs: [
          { id: 'ci_mo', label: 'Glassmorphism', desc: 'Milchglas-Effekte für UI-Elemente' },
          { id: 'ci_mc', label: 'Kinetische Typografie', desc: 'Große, bewegte Schriften als Hintergrund' },
        ],
      },
      {
        id: 'ci_u',
        label: 'Hochschul-Branding',
        badge: 'Offiziell',
        color: 'coral',
        teamSize: '2 Personen Design',
        short: 'Nutzung der offiziellen Hochschul-Farben, modern interpretiert.',
        details: [
          'Farben: Blau/Grau der HS Emden/Leer (oder FB Technik)',
          'Wirkt hochoffiziell — gut für Sponsoren und Modul-Präsentation',
          'Schriftarten aus dem offiziellen CD der Hochschule',
          'Gefahr: könnte weniger "cool" oder nach Esport aussehen',
          'Lösung: HS-Farben nehmen aber deutlich dunkler und mit Leuchteffekten versehen',
        ],
        subs: [
          { id: 'ci_uo', label: 'Offizielles Logo', desc: 'In alle Overlays integrieren' },
          { id: 'ci_um', label: 'Maskottchen entwerfen', desc: 'Campus-Bezug spielerisch einbringen' },
        ],
      },
      {
        id: 'ci_r',
        label: 'Retrowave / Synthwave',
        badge: 'Unique',
        color: 'purple',
        teamSize: '2–3 Personen Design',
        short: '80er Jahre Neon-Ästhetik: Lila, Magenta, Gitternetz, Retro-Sounds. Sehr einzigartig.',
        details: [
          'Farben: Deep Purple, Hot Magenta, Electric Blue + Gitternetz-Muster',
          'Schriftarten: Outrun-Style, Retrowave Fonts (kostenlos verfügbar)',
          'Sofort wiedererkennbar — sehr starker Instagram/TikTok Effekt',
          'Passt gut zu Retroklassikern wie SF oder älteren Spielen',
          'Großartig für Projektmapping: Gitternetz-Horizon-Effekte',
          'Differenziert uns von typischen Esport-Events',
        ],
        subs: [
          { id: 'ci_rg', label: 'Gitternetz-Projektmapping', desc: 'Klassischer Retrowave-Horizon-Effekt' },
          { id: 'ci_rs', label: 'Synthwave-Soundtrack', desc: 'Stimmungsvolle Hintergrundmusik im Venue' },
        ],
      },
    ],
  },

  {
    id: 'marketing',
    title: 'Marketing',
    question: 'Wie bewerben wir das Event?',
    suggestions: [
      'Discord-Server für Event-Community aufbauen',
      'WhatsApp-Gruppe für Ankündigungen',
      'Campus-Radio (falls vorhanden)',
      'Kooperation mit Studierendenschaft (AStA/FSR)',
      'Plakate in der Stadt Emden',
      'Digitaler Countdown auf Hochschul-Website',
      'Influencer aus lokalem Gaming-Umfeld einladen',
    ],
    options: [
      {
        id: 'mk_c',
        label: 'Campus-Flyer & Aushänge',
        badge: 'Einfach',
        color: 'amber',
        teamSize: '1–2 Personen Marketing',
        short: 'Poster an der Hochschule, FSR/MT-Account, Flyer.',
        details: [
          'Einfach umzusetzen, Design-Team erstellt Vorlage',
          'QR-Code auf Plakat für Event-Infos',
          'Kosten ca. 50€ für Druck',
          'Schnell verteilt über Hochschulnetzwerk',
          'Kombination mit Campus-Screens für digitale Sichtbarkeit',
        ],
        subs: [
          { id: 'mk_cs', label: 'Hochschul-Social-Media', desc: 'MT- und FSR-Accounts nutzen' },
          { id: 'mk_cd', label: 'Campus-Screens', desc: 'Digitale Anzeigetafeln' },
        ],
      },
      {
        id: 'mk_s',
        label: 'Social Media Kampagne',
        badge: 'Reichweite',
        color: 'teal',
        teamSize: '2–3 Personen Marketing',
        short: 'Instagram Reels, TikTok, Countdown-Posts über mehrere Wochen.',
        details: [
          'Mehrere Wochen Vorlauf für maximale Reichweite',
          'Countdown-Posts steigern Spannung',
          'Teaser-Video zeigt Produktions-Behind-the-Scenes',
          'Story-Updates und Umfragen für Engagement',
          'Zielgruppe 18–25 — genau auf Instagram/TikTok',
        ],
        subs: [
          { id: 'mk_si', label: 'Instagram Reels + Stories', desc: 'Täglich in der letzten Woche' },
          { id: 'mk_st', label: 'TikTok Teaser', desc: 'Viraler Kurzclip-Format' },
        ],
      },
      {
        id: 'mk_v',
        label: 'Vollkampagne + Sponsoren',
        badge: 'Profi-Level',
        color: 'purple',
        teamSize: '3–4 Personen Marketing',
        short: 'Pressemitteilung, Sponsorenanfragen, lokale Medien, professionelles Teaser-Video.',
        details: [
          'Sponsor-Deck erstellen — zeigt Reichweite und Professionalität',
          'Lokale Unternehmen ansprechen (Gaming-Shops, Tech-Firmen)',
          'Pressemitteilung an Hochschulzeitung und lokale Medien',
          'Making-Of Dokument für Social Media und Modul-Abgabe',
          'Animierter Teaser als Social-Media-Werbung',
        ],
        subs: [
          { id: 'mk_vs', label: 'Sponsor-Anfragen', desc: 'Lokale Gaming & Tech Firmen' },
          { id: 'mk_vl', label: 'Lokale Presse', desc: 'Hochschulzeitung + Emder Zeitung' },
        ],
      },
      {
        id: 'mk_g',
        label: 'Guerilla Marketing',
        badge: 'Kreativ',
        color: 'coral',
        teamSize: '2–3 Personen',
        short: 'Überraschungsmomente auf dem Campus — QR-Codes, Sticker, Mini-Events als Teaser.',
        details: [
          'Spontane Mini-Events auf dem Campus (1v1 Challenge in der Mensa)',
          'Auffällige QR-Code-Sticker an strategischen Stellen platzieren',
          'Countdown-Timer als Bildschirmschoner auf Campus-Rechnern',
          'Gerüchte und Hype durch Mystery-Posts auf Social Media',
          'Sehr geringe Kosten, hoher Aufmerksamkeitswert',
          'Perfekt als Ergänzung zu klassischem Marketing',
        ],
        subs: [
          { id: 'mk_gm', label: 'Mystery-Teaser Posts', desc: 'Langsam Infos enthüllen auf Instagram' },
          { id: 'mk_gc', label: 'Campus-Challenge', desc: '1v1 Voranmeldungs-Turnier als Hype' },
        ],
      },
    ],
  },

  {
    id: 'timeline',
    title: 'Timeline',
    question: 'Wie planen wir die Zeit bis zum Event?',
    suggestions: [
      'Wöchentliche Statusmeetings (jeden Montag 15 Min)',
      'Geteilter Google-Kalender für alle Deadlines',
      'Notion oder Confluence als Projekt-Wiki',
      'Trello/Jira für Task-Tracking',
      'Vorab-Budget-Freigabe einholen (2 Wochen vor Event)',
      'Tech-Probe mindestens 2 Tage vor Event',
    ],
    options: [
      {
        id: 'tl_2',
        label: '2-Wochen-Sprint',
        badge: 'Intensiv',
        color: 'coral',
        teamSize: 'Alle 13 Personen (hohe Intensität)',
        short: 'Intensiver 2-Wochen-Plan direkt vor dem Event.',
        details: [
          'Woche 1: Konzept final, Technik testen, Overlays fertig',
          'Woche 2: Aufbau, Generalprobe, Event-Durchführung',
          'Riskant — wenig Puffer für Probleme',
          'Empfehlung: nur wenn Konzept vorher ausführlich besprochen',
        ],
        subs: [
          { id: 'tl_2d', label: 'Tägliche Stand-ups', desc: '15-Min Check-in jeden Tag' },
          { id: 'tl_2b', label: 'Aufgaben-Board', desc: 'Trello oder Notion für Überblick' },
        ],
      },
      {
        id: 'tl_4',
        label: '4-Wochen-Phasenplan',
        badge: 'Empfohlen',
        color: 'blue',
        teamSize: 'Alle 13 Personen (strukturiert)',
        short: '4 Wochen mit klaren Phasen — unser empfohlener Ansatz.',
        details: [
          'Woche 1: Konzept, Spielwahl, Location final',
          'Woche 2: Technische Planung, Rollen fix',
          'Woche 3: Overlays, Marketing-Start, Technik-Test',
          'Woche 4: Aufbau, Probe, Event',
          'Genug Zeit für Korrekturen ohne Stress',
          'Unser empfohlener Ansatz',
        ],
        subs: [
          { id: 'tl_4v', label: 'Vorentscheid im Mai', desc: 'Kleine Version als Generalprobe' },
          { id: 'tl_4w', label: 'Wöchentliche Treffen', desc: 'Jede Woche gemeinsamer Status-Call' },
        ],
      },
      {
        id: 'tl_8',
        label: '8-Wochen Vollplanung',
        badge: 'Maximum',
        color: 'teal',
        teamSize: 'Alle 13 Personen (strukturiert + iterativ)',
        short: 'Professionelle Planung ab sofort bis zum Event — maximale Qualität.',
        details: [
          'Monat 1: Konzept, Rollen, Location, Sponsoren',
          'Monat 2: Technik, Marketing, Probe, Finale',
          'Vorentscheid Ende Mai als echter Test',
          'Zeit für iteratives Verbessern aller Bereiche',
          'Maximale Qualität — perfekt für Modulabgabe',
        ],
        subs: [
          { id: 'tl_8v', label: 'Vorentscheid Mitte Mai', desc: 'Echter Testlauf vor dem Finale' },
          { id: 'tl_8m', label: 'Making-Of Dokumentation', desc: 'Für Modulabgabe und Portfolio' },
        ],
      },
      {
        id: 'tl_agil',
        label: 'Agiles Scrum-Modell',
        badge: 'Modern',
        color: 'purple',
        teamSize: 'Alle 13 Personen in Teilteams',
        short: 'Sprint-basiert mit Backlog, Daily Stand-ups und Review-Sessions — wie in echten Studios.',
        details: [
          'Teilteams (Audio, Licht, Stream, Design) arbeiten parallel in Sprints',
          'Sprint-Länge: 1 Woche, Product Owner = Projektleitung',
          'Backlog mit priorisierten Tasks in Jira oder Notion',
          'Wöchentliches Review: jedes Team zeigt Fortschritt',
          'Maximale Flexibilität für Änderungen während der Planung',
          'Lehrreichste Methodik — wie professionelle Produktionsstudios arbeiten',
        ],
        subs: [
          { id: 'tl_aj', label: 'Jira / Linear als Tool', desc: 'Sprint-Tracking wie im Studio' },
          { id: 'tl_ar', label: 'Retrospektiven', desc: 'Jede Woche: was lief gut, was nicht?' },
        ],
      },
    ],
  },

  {
    id: 'gaming',
    title: 'Gaming',
    question: 'Wie präsentieren wir uns als Team und was brauchen wir für die Gaming-Atmosphäre?',
    suggestions: [
      'Team-Outfit schon früh planen — Lieferzeiten beachten',
      'Intro-Video spätestens 2 Wochen vor Event fertig haben',
      'High-End PCs frühzeitig bei Sponsoren anfragen',
      'Cosplayer oder VTuber frühzeitig kontaktieren (brauchen Vorlauf)',
      'Hologramm-Setup mit Projektmapping-Team koordinieren',
      'Fotoecke als Social-Media-Moment einplanen',
    ],
    options: [
      {
        id: 'g_outfit_intro',
        label: 'Team Outfit & Intro',
        badge: 'Auftritt',
        color: 'purple',
        teamSize: '2–3 Personen (Konzept + Produktion)',
        short: 'Einheitliches Team-Outfit + professionelles Intro-Video für jeden Spieler. Macht uns sofort erkennbar.',
        details: [
          'Einheitliches Outfit: T-Shirts, Hoodies oder Jacken im Event-CI-Design',
          'Intro-Video für jeden Spieler: kurzes Reel-Format (15–30 Sek.) mit Stats & Name',
          'Interview-Format: Spieler stellen sich vor — für Social Media und Stream',
          'Vertragliche Regelung: Bildrechte klären, Social-Media-Posts einplanen',
          'Outfit kann durch Sponsoren finanziert werden — gutes Gegengeschäft',
          'Auf dem Intro aufbauen: Same Ästhetik wie CI & Design des gesamten Events',
        ],
        subs: [
          { id: 'g_oi_reel', label: 'Reel-Format Intro', desc: 'Je 15-30 Sek. pro Spieler — Instagram & TikTok' },
          { id: 'g_oi_outfit', label: 'Custom Outfit Design', desc: 'CI-konformes Teamoutfit entwerfen lassen' },
        ],
      },
      {
        id: 'g_highend_setup',
        label: 'High-End PC Setup & Design',
        badge: 'Hardware',
        color: 'teal',
        teamSize: '2–3 Personen (Tech + Setup)',
        short: 'High-End Gaming-PCs leihen (Sponsoren!), professionelles Setup-Design mit LED, Tischen, Branding.',
        details: [
          'High-End PCs leihen: Anfrage bei lokalen Gaming-Shops oder Tech-Sponsoren',
          'Einheitliche Gaming-Tische und Stühle für professionellen Look',
          'RGB/LED-Beleuchtung am Setup — passend zur CI-Farbpalette',
          'PC-Cases mit Event-Branding (Aufkleber, Panels) personalisieren',
          'Alle Geräte vorher auf Patch-Stand bringen, Performance testen',
          'Verkabelung verdecken: sauberes Setup sieht professionell aus',
          'Backup-Hardware durch Leih-Partner absichern',
        ],
        subs: [
          { id: 'g_hs_sponsor', label: 'Sponsor-Anfrage Hardware', desc: 'PCs + Peripherie als Sachspende' },
          { id: 'g_hs_led', label: 'LED Ambiance Setup', desc: 'RGB-Beleuchtung im CI-Farbschema' },
        ],
      },
      {
        id: 'g_deko_atmosphaere',
        label: 'Deko & Atmosphäre',
        badge: 'Experience',
        color: 'amber',
        teamSize: '3–4 Personen (Aufbau + Betreuung)',
        short: 'Aufsteller, Fotoecke, Roboter-Deko-Animation — macht den Venue zu einem echten Esport-Erlebnis.',
        details: [
          'Aufsteller mit Team-Fotos und Spieler-Infos (5 Aufsteller empfohlen)',
          'Fotoecke: CI-Backdrop, Requisiten, guter Spot für Social-Media-Fotos der Gäste',
          'Deko-Roboter-Animation: animierte Display-Screens oder mechanische Props',
          'Persönliche Ansprache: Jemand begrüßt Gäste und führt sie zur Fotoecke',
          'Balloon-Arches oder LED-Tore als Eingang-Statement',
          'Printmaterial: Roll-Ups, Flyer, Namens-Banner der Sponsoren',
        ],
        subs: [
          { id: 'g_da_photo', label: 'Fotoecke CI-Themed', desc: 'Backdrop + Props für Social Media' },
          { id: 'g_da_aufsteller', label: 'Team-Aufsteller (5+)', desc: 'Lebensgroße Spieler-Displays' },
        ],
      },
      {
        id: 'g_hologramm_vtuber',
        label: 'Hologramm & V-Tuber',
        badge: 'High-Tech',
        color: 'blue',
        teamSize: '2–3 Personen (Tech + Animation)',
        short: 'Aktives Hologramm + Kommentator-VTuber: das absolute Highlight — visuell unforgettable.',
        details: [
          'Hologramm: Pepper\'s Ghost Effekt oder LED-Fan-Display für 3D-Illusion',
          'Aktives Hologramm: Live-Performer hinter Folie erscheint "virtuell" auf der Bühne',
          'Hologramm → Animation: vorproduzierte 3D-Charakter-Animation wird abgespielt',
          'Kommentator V-Tuber: Kommentiert das Match als virtueller Avatar (Tracking via Webcam)',
          'V-Tuber braucht eigenen PC für Tracking-Software (VTube Studio o.Ä.)',
          'Koordination mit Projektmapping-Team für maximalen visuellen Effekt',
        ],
        subs: [
          { id: 'g_hv_hologram', label: 'Aktives Hologramm', desc: 'Live-Performer oder vorproduziert' },
          { id: 'g_hv_vtuber', label: 'Kommentator V-Tuber', desc: 'Virtueller Avatar kommentiert live' },
        ],
      },
      {
        id: 'g_cosplay_performance',
        label: 'Cosplay & Live Performance',
        badge: 'Entertainment',
        color: 'coral',
        teamSize: '2–3 Personen (Koordination)',
        short: 'Cosplayer, Tanz-/Musik-Performance — Live-Entertainment das Pausen füllt und Energie bringt.',
        details: [
          'Cosplayer passend zum Spiel (Valorant, LoL etc.) — echte Wow-Momente für Fotos',
          'Tanz-/Musik-Performance in Pausen: energetische Show zwischen den Matches',
          'Koordination mit Musik-Team für passenden Soundtrack der Performance',
          'Cosplayer können Gäste begrüßen, Fotos machen — sehr social-media-wirksam',
          'Performance vorher proben und mit Zeitplan abstimmen',
          'Optional: Dance-Battle oder spontane Crowd-Interaktion',
        ],
        subs: [
          { id: 'g_cp_cosplay', label: 'Game-Cosplayer', desc: 'Passend zum gewählten Spiel' },
          { id: 'g_cp_perf', label: 'Tanz/Musik Performance', desc: 'Live-Show in Pausen' },
        ],
      },
    ],
  },

  {
    id: 'video',
    title: 'Video',
    question: 'Welche Videoelemente setzen wir für den cinematischen Effekt ein?',
    suggestions: [
      'Drohne frühzeitig anmelden — Genehmigung beim Ordnungsamt einholen',
      'Spidercam-System mit Kamera-Team abstimmen',
      'Teaser-Video 2 Wochen vor Event fertigstellen',
      'LED-Wände mit Location-Technik koordinieren',
      'Einlauf-Choreografie mit Ton-Team abstimmen (Musikstart)',
      'Alle Videos vorher auf Abspiel-PC testen (Codec, Auflösung)',
    ],
    options: [
      {
        id: 'v_drone_spider',
        label: 'Drohne / Spidercam',
        badge: 'Cinematic',
        color: 'teal',
        teamSize: '2–3 Personen (Pilot + Operator)',
        short: 'Drohne oder Spidercam für spektakuläre Einspieler und Teaser — professionellste Kameraführung.',
        details: [
          'Drohne: Outdoor-Shots für Teaser-Video und Social-Media-Content vor dem Event',
          'Spidercam (Seilkamera) für Indoor: fliegt über die Spieler und das Publikum',
          'Produzierte Einspieler: kurze Clip-Pakete für Stream-Übergänge',
          'Teaser-Video: Drohne + Ground-Level Mix für maximale Wirkung',
          'Drohne braucht Genehmigung — frühzeitig beim Ordnungsamt beantragen',
          'Spidercam braucht stabile Befestigungspunkte in der Halle',
        ],
        subs: [
          { id: 'v_ds_drone', label: 'Drohnen-Teaser', desc: 'Außenaufnahmen für Pre-Event Content' },
          { id: 'v_ds_spider', label: 'Spidercam Indoor', desc: 'Dynamische Overhead-Shots live' },
          { id: 'v_ds_einspieler', label: 'Produzierte Einspieler', desc: 'Clip-Pakete für Stream-Übergänge' },
        ],
      },
      {
        id: 'v_cinematic_einlauf',
        label: 'Cinematischer Einlauf',
        badge: 'Highlight',
        color: 'purple',
        teamSize: '3–4 Personen (Video + Licht + Audio)',
        short: 'Spieler laufen unter LED-Wänden ein — cinematische Atmosphäre wie bei einem echten Esport-Major.',
        details: [
          'LED-Wände links und rechts des Einlauf-Tunnels: Flames, Team-Logo, Partikeleffekte',
          'Synchronisiert mit Audio: Musik-Drop zum exakten Einlauf-Moment',
          'Spotlights auf den Spieler beim Einlauf (Kamera + Licht im Zusammenspiel)',
          'Koordination zwischen Kamera, Ton und Licht muss geprobt werden',
          'Content für die LED-Wände: fertige Loops oder reaktives Echtzeit-Mapping',
          'Macht selbst ohne professionelle Kamera schon einen enormen Eindruck',
          'Kann auch mit Projektmapping-System statt LED-Wänden realisiert werden',
        ],
        subs: [
          { id: 'v_ce_led', label: 'LED-Wände Einlauf', desc: 'Tunnel aus LED-Panels mit CI-Content' },
          { id: 'v_ce_sync', label: 'Audio-Video-Sync', desc: 'Musik-Drop + Effekte im Takt' },
          { id: 'v_ce_mapping', label: 'Projektmapping statt LED', desc: 'Alternative wenn keine LED verfügbar' },
        ],
      },
      {
        id: 'v_teaser_trailer',
        label: 'Teaser Trailer',
        badge: 'Marketing',
        color: 'amber',
        teamSize: '2–3 Personen (Schnitt + Motion)',
        short: 'Professioneller Teaser-Trailer für Social Media — baut Vorfreude auf und zieht Publikum an.',
        details: [
          'Kurzer Trailer (30–60 Sek.) mit Event-Datum, Location, Spiel und Team-Teaser',
          'Motion Graphics passend zur CI: animiertes Logo, Countdown, Spieler-Silhouetten',
          'Drohne / Spidercam-Footage kann direkt hier eingebaut werden',
          'Musik-Lizenz klären oder Royalty-Free Tracks nutzen (Epidemic Sound, Artlist)',
          'Vertrieb: Instagram Reels, TikTok, YouTube Shorts — mehrere Formate schneiden',
          '1–2 Wochen vor Event hochladen für maximale organische Reichweite',
        ],
        subs: [
          { id: 'v_tt_short', label: 'Short-Form (30 Sek.)', desc: 'TikTok / Instagram Reel' },
          { id: 'v_tt_long', label: 'Cinematic Trailer (60 Sek.)', desc: 'YouTube + Stream-Opener' },
        ],
      },
    ],
  },
];
