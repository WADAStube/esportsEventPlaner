import { Switch, Route, Router } from "wouter";
import { PlannerProvider } from "./PlannerContext";
import TopNav from "./TopNav";
import SectionView from "./SectionView";
import Team from "./Team";
import Summary from "./Summary";
import References from "./References";
import Notizen from "./Notizen";
import Footer from "./Footer";
import ScrollTopButton from "./ScrollTop";


function AppInner() {
  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{
        background: "#0a0a12",
        backgroundImage: "linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        fontFamily: "'Rajdhani', sans-serif",
        color: "white",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <div style={{ position:"fixed", inset:0, background:"radial-gradient(ellipse at 20% 50%, rgba(168,85,247,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(0,229,255,0.06) 0%, transparent 50%)", pointerEvents:"none", zIndex:0 }} />
      <TopNav />
      <main className="relative z-10 w-full" style={{ flex: 1, paddingBottom: "20px" }}>
        <Switch>
          <Route path="/" component={SectionView} />
          <Route path="/team" component={Team} />
          <Route path="/plan" component={Summary} />
          <Route path="/refs" component={References} />
          <Route path="/notizen" component={Notizen} />
        </Switch>
      </main>
      <Footer />
      <ScrollTopButton />
    </div>
  );
}

export default function App() {
  return (
    <PlannerProvider>
      <Router>
        <AppInner />
      </Router>
    </PlannerProvider>
  );
}
