import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Activity,
  CalendarDays,
  Sparkles,
  ShieldAlert,
  Map,
  Bell,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { places } from "../data/mock";

const nav = [
  { to: "/pantau", label: "Pantau", icon: Activity },
  { to: "/peta", label: "Peta", icon: Map },
  { to: "/rencana", label: "Rencana", icon: CalendarDays },
  { to: "/sigap-ai", label: "SIGAP AI", icon: Sparkles },
];
const title: Record<string, string> = {
  "/pantau": "Pantau",
  "/peta": "Peta & Titik Api",
  "/rencana": "Rencana Aman",
  "/sigap-ai": "SIGAP AI",
  "/darurat": "Mode Siaga",
  "/panduan-darurat": "Panduan Darurat",
  "/preview": "Pratinjau layar",
};

export function Layout() {
  const route = useLocation().pathname;
  const [menu, setMenu] = useState(false);
  const [location, setLocation] = useState(
    () => localStorage.getItem("sigap-location") || "Pekanbaru, Riau",
  );
  const immersive = route === "/darurat" || route === "/panduan-darurat";
  return (
    <div className={`app-shell ${immersive ? "immersive" : ""}`}>
      <aside className="sidebar">
        <NavLink to="/pantau" className="brand">
          <span className="brand-mark">
            <Activity size={19} />
          </span>
          <span>
            SIGAP<small>Siaga untuk sekitar</small>
          </span>
        </NavLink>
        <div className="side-caption">MENU UTAMA</div>
        <nav className="side-nav">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="side-caption second">KESELAMATAN</div>
        <nav className="side-nav">
          <NavLink to="/darurat">
            <Bell size={18} />
            Mode Siaga
          </NavLink>
          <NavLink to="/panduan-darurat">
            <ShieldAlert size={18} />
            Panduan Darurat
          </NavLink>
        </nav>
        <div className="side-bottom">
          <span className="source-dot" />
          Seluruh informasi adalah
          <br />
          data demonstrasi.
          <br />
          <a href="/preview">Lihat pratinjau 6 layar →</a>
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            aria-label="Buka menu"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
          <div>
            <div className="crumb">
              SIGAP <span>/</span> {title[route] || "Pantau"}
            </div>
            <h1>{title[route] || "Pantau"}</h1>
          </div>
          <label className="location-select">
            <Map size={16} />
            <select
              aria-label="Pilih lokasi"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                localStorage.setItem("sigap-location", e.target.value);
              }}
            >
              {places.map((place) => (
                <option
                  key={place.id}
                >{`${place.name}, ${place.region}`}</option>
              ))}
            </select>
            <ChevronDown size={14} />
          </label>
          <NavLink to="/darurat" className="alert-shortcut">
            <span />
            Mode Siaga
          </NavLink>
        </header>
        {menu && (
          <nav className="mobile-drawer">
            {nav.map(({ to, label, icon: Icon }) => (
              <NavLink onClick={() => setMenu(false)} key={to} to={to}>
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
            <NavLink onClick={() => setMenu(false)} to="/panduan-darurat">
              <ShieldAlert size={18} />
              Panduan Darurat
            </NavLink>
          </nav>
        )}
        <section className="content">
          <Outlet context={location} />
        </section>
        <footer className="page-footer">
          SIGAP • Versi demonstrasi · Data tidak real-time · Ikuti arahan
          instansi resmi.
        </footer>
        <nav className="bottom-nav">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to}>
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </main>
    </div>
  );
}
