# E-Sports Event — Gruppenplanung
Hochschule Emden/Leer · Medientechnik · Audiovisuelle Produktion · SoSe 2026

---

## Lokal starten

```bash
# 1. Node.js installieren (falls nicht vorhanden): https://nodejs.org
# 2. In diesen Ordner wechseln
cd esports-planner

# 3. Pakete installieren (einmalig)
npm install

# 4. Entwicklungsserver starten
npm run dev
# → öffnet http://localhost:5173
```

---

## Kostenlose Veröffentlichung (24/7 Link)

### Option A — Netlify Drop (einfachster Weg, 2 Minuten)
```bash
npm run build
# → erstellt den Ordner "dist/"
```
1. Gehe zu **https://app.netlify.com/drop**
2. Ziehe den `dist/` Ordner dort hinein
3. Du bekommst sofort eine kostenlose URL wie `https://amazing-name-123.netlify.app`

### Option B — GitHub Pages
1. Repo auf GitHub erstellen
2. Code pushen
3. Settings → Pages → Branch: main → `/root` → Save
4. Fertig — kostenlose URL: `https://deinname.github.io/repo-name`

### Option C — Vercel (schnellste automatische Deployments)
1. https://vercel.com → Import GitHub Repo
2. Fertig — jedes `git push` baut automatisch neu

---

## Dateien

```
esports-planner/
├── index.html          ← Einstiegspunkt
├── package.json        ← Pakete (npm install)
├── vite.config.ts      ← Build-Konfiguration
├── tsconfig.json       ← TypeScript
└── src/
    ├── main.tsx        ← App-Start
    ├── App.tsx         ← Routing
    ├── index.css       ← Styles (Tailwind)
    ├── data.ts         ← ALLE Inhalte (Abschnitte, Team, Rollen)
    ├── PlannerContext.tsx  ← Zustand (Auswahlen, Rollen)
    ├── TopNav.tsx      ← Navigation + Header
    ├── SectionView.tsx ← Planungsabschnitte
    ├── Team.tsx        ← Drag & Drop Rollen
    └── Summary.tsx     ← Master-Plan Übersicht
```

**Inhalte anpassen:** Öffne `src/data.ts` in VS Code — dort sind alle Texte, Optionen, Teammitglieder und Rollen.
