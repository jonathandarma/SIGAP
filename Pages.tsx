import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  Flame,
  Info,
  MessageCircle,
  Navigation,
  Pause,
  Play,
  Send,
  Shield,
  ShieldAlert,
  Sparkles,
  Wind,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { airReadings, forecast, hotspots } from "../data/mock";
import type { Hotspot } from "../types";
import { answerFor } from "../services/assistant";

function DemoNote({
  children = "Data simulasi untuk demonstrasi",
}: {
  children?: string;
}) {
  return (
    <div className="demo-note">
      <Info size={14} />
      {children}
    </div>
  );
}
function Title({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {desc && <p>{desc}</p>}
      </div>
    </div>
  );
}
function AQICard({ location }: { location: string }) {
  const air = airReadings[location] ?? airReadings["Pekanbaru, Riau"];
  return (
    <article className="aqi-card">
      <div className="aqi-top">
        <span>
          <Wind size={15} /> Kualitas udara saat ini
        </span>
        <span className="live-pill">
          <i /> DEMO
        </span>
      </div>
      <div className="aqi-main">
        <strong>{air.aqi}</strong>
        <span>
          AQI
          <br />
          <small>PM2.5 {air.pm25} µg/m³</small>
        </span>
      </div>
      <h2>{air.category}</h2>
      <div className="aqi-scale">
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="scale-labels">
        <span>Baik</span>
        <span>Berbahaya</span>
      </div>
      <div className="aqi-watermark">
        <Activity size={110} />
      </div>
    </article>
  );
}

export function HomePage() {
  const location = useOutletContext<string>();
  const air = airReadings[location] ?? airReadings["Pekanbaru, Riau"];
  const tips = [
    "Pakai masker N95/KN95, bukan masker kain",
    "Tutup ventilasi, nyalakan air purifier",
    "Tunda olahraga luar. Waktu lebih baik 06.00–07.30",
  ];
  return (
    <>
      <DemoNote />
      <div className="home-grid">
        <div className="main-column">
          <AQICard location={location} />
          <article className="panel advice-panel">
            <div className="panel-title">
              <div>
                <span className="eyebrow">SARAN UNTUK KAMU HARI INI</span>
                <h3>Jaga kesehatan pernapasan</h3>
              </div>
              <span className="soft-badge">Kualitas udara</span>
            </div>
            <div className="advice-list">
              {tips.map((tip, i) => (
                <div className="advice-row" key={tip}>
                  <span className="advice-icon">
                    {i === 0 ? (
                      <Shield size={17} />
                    ) : i === 1 ? (
                      <Activity size={17} />
                    ) : (
                      <Clock3 size={17} />
                    )}
                  </span>
                  <span>{tip}</span>
                  <ChevronRight size={16} />
                </div>
              ))}
            </div>
          </article>
          <article className="hotspot-summary">
            <div className="hotspot-icon">
              <Flame size={20} />
            </div>
            <div>
              <b>3 indikasi titik panas di sekitar</b>
              <p>Data demonstrasi · jangan mendekati lokasi</p>
            </div>
            <Link to="/peta" className="round-arrow" aria-label="Buka peta">
              <ArrowRight size={17} />
            </Link>
          </article>
        </div>
        <div className="side-column">
          <article className="panel welcome-panel">
            <div className="welcome-icon">
              <Sparkles size={19} />
            </div>
            <div>
              <span className="eyebrow">SELAMAT SORE</span>
              <h3>Cuaca berubah, tetap sigap.</h3>
              <p>
                Pantau kualitas udara dan siapkan rencana aman untuk keluarga.
              </p>
            </div>
          </article>
          <article className="panel mini-panel">
            <div className="panel-title">
              <h3>Ringkasan hari ini</h3>
              <Activity size={18} />
            </div>
            <div className="mini-stat">
              <span>Kualitas udara</span>
              <b
                className={
                  air.category === "Baik" || air.category === "Sedang"
                    ? ""
                    : "red-text"
                }
              >
                {air.category}
              </b>
            </div>
            <div className="mini-stat">
              <span>Indikasi titik panas</span>
              <b>3 terdeteksi</b>
            </div>
            <div className="mini-stat">
              <span>Data diperbarui</span>
              <b>{air.metadata.observedAt}</b>
            </div>
            <div className="source-caption">
              {air.metadata.source} · {air.metadata.note}
            </div>
          </article>
          <Link className="quick-link" to="/rencana">
            <div className="quick-icon">
              <CalendarDaysIcon />
            </div>
            <div>
              <b>Rencana Aman</b>
              <small>Lihat perkiraan dan saran</small>
            </div>
            <ChevronRight size={17} />
          </Link>
          <Link className="quick-link" to="/sigap-ai">
            <div className="quick-icon ai">
              <Sparkles size={17} />
            </div>
            <div>
              <b>Tanya SIGAP AI</b>
              <small>Asisten kesiapsiagaan demo</small>
            </div>
            <ChevronRight size={17} />
          </Link>
        </div>
      </div>
    </>
  );
}
function CalendarDaysIcon() {
  return <Activity size={17} />;
}

export function MapPage() {
  const [selected, setSelected] = useState<Hotspot>(hotspots[0]);
  const [filter, setFilter] = useState<"Semua" | "Tinggi" | "Sedang">("Semua");
  const [zoom, setZoom] = useState(1);
  const [notice, setNotice] = useState("");
  const shown = hotspots.filter(
    (h) => filter === "Semua" || h.level === filter,
  );
  return (
    <>
      <DemoNote>
        Indikasi titik panas simulasi Pekanbaru · bukan konfirmasi kebakaran
      </DemoNote>
      <Title
        eyebrow="PEKANBARU, RIAU"
        title="Peta indikasi titik panas"
        desc="Pilih penanda untuk melihat ringkasan indikasi. Jangan mendekati lokasi."
      />
      <div className="map-layout">
        <section className="map-canvas" aria-label="Peta indikasi titik panas">
          <div className="map-grid" style={{ transform: `scale(${zoom})` }}>
            <div className="river" />
            <div className="road road-a" />
            <div className="road road-b" />
            <div className="road road-c" />
            <div className="map-label label-a">PEKANBARU</div>
            <div className="map-label label-b">PELALAWAN</div>
            <div className="you-marker" title="Lokasi pilihan" />
            <span className="you-label">Kamu</span>
            {shown.map((h) => (
              <button
                key={h.id}
                className={`map-pin ${h.level === "Sedang" ? "medium" : ""} ${selected.id === h.id ? "selected" : ""}`}
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
                onClick={() => setSelected(h)}
                aria-label={`Pilih indikasi ${h.name}`}
              >
                <Flame size={15} />
              </button>
            ))}
          </div>
          <div className="map-controls">
            <button
              onClick={() => setZoom((z) => Math.min(1.35, z + 0.1))}
              aria-label="Perbesar peta"
            >
              <ZoomIn size={17} />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.85, z - 0.1))}
              aria-label="Perkecil peta"
            >
              <ZoomOut size={17} />
            </button>
          </div>
          <div className="map-legend">
            <b>Indikasi</b>
            <span>
              <i className="legend-hot" />
              Tinggi
            </span>
            <span>
              <i className="legend-mid" />
              Sedang
            </span>
            <span>
              <i className="legend-you" />
              Lokasi pilihan
            </span>
          </div>
        </section>
        <aside className="panel map-detail">
          <div className="panel-title">
            <div>
              <span className="eyebrow">DETAIL INDIKASI</span>
              <h3>
                <Flame size={16} className="orange-text" /> {selected.name}
              </h3>
            </div>
            <span className="risk-tag high">{selected.level}</span>
          </div>
          <p className="detail-disclaimer">
            Anomali panas yang terdeteksi tidak otomatis berarti kebakaran.
          </p>
          <div className="detail-row">
            <span>Perkiraan jarak</span>
            <b>{selected.distance} km</b>
          </div>
          <div className="detail-row">
            <span>Waktu indikasi</span>
            <b>{selected.time}</b>
          </div>
          <div className="detail-row">
            <span>Sumber</span>
            <b>{selected.source}</b>
          </div>
          <div className="filter-block">
            <label htmlFor="map-filter">Filter indikasi</label>
            <select
              id="map-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
            >
              <option>Semua</option>
              <option>Tinggi</option>
              <option>Sedang</option>
            </select>
          </div>
          <button
            className="button primary full"
            onClick={() =>
              setNotice(
                "Terima kasih. Fitur pelaporan demonstrasi belum terhubung ke kanal resmi.",
              )
            }
          >
            Laporkan indikasi <ArrowRight size={16} />
          </button>
          <small className="source-caption">
            Peta skematis · lokasi tidak presisi.
          </small>
        </aside>
      </div>
      {notice && (
        <div className="toast" role="status">
          <CheckCircle2 size={16} />
          {notice}
          <button onClick={() => setNotice("")} aria-label="Tutup">
            <X size={15} />
          </button>
        </div>
      )}
    </>
  );
}

export function PlanPage() {
  const [day, setDay] = useState(1);
  const active = forecast[day];
  const air = airReadings["Pekanbaru, Riau"];
  return (
    <>
      <DemoNote>
        Prakiraan contoh Pekanbaru menggunakan data simulasi, bukan prediksi
        kebakaran.
      </DemoNote>
      <Title
        eyebrow="PERSIAPAN LINGKUNGAN"
        title="Rencana aman"
        desc="Tinjau perkiraan risiko dan sesuaikan aktivitas harian."
      />
      <div className="forecast-layout">
        <div className="main-column">
          <article className="panel calendar-panel">
            <div className="panel-title">
              <div>
                <span className="eyebrow">PILIH HARI</span>
                <h3>Perkiraan 7 hari</h3>
              </div>
              <span className="soft-badge">Oktober</span>
            </div>
            <div className="day-strip">
              {forecast.map((d, i) => (
                <button
                  className={day === i ? "active" : ""}
                  key={d.day}
                  onClick={() => setDay(i)}
                >
                  <span>{d.day}</span>
                  <b>{d.date}</b>
                  <i
                    className={`dot-risk ${d.risk === "Tinggi" ? "risk-red" : d.risk === "Sedang" ? "risk-orange" : "risk-green"}`}
                  />
                </button>
              ))}
            </div>
          </article>
          <article className="panel chart-panel">
            <div className="panel-title">
              <div>
                <span className="eyebrow">
                  RINGKASAN {active.day.toUpperCase()} · {active.date} OKT
                </span>
                <h3>Risiko kualitas udara</h3>
              </div>
              <span
                className={`risk-tag ${active.risk === "Tinggi" ? "high" : active.risk === "Sedang" ? "medium" : "low"}`}
              >
                {active.risk}
              </span>
            </div>
            <div className="forecast-number">
              <strong>{active.aqi}</strong>
              <span>
                AQI
                <br />
                <small>nilai contoh</small>
              </span>
              <b className="red-text">
                {active.risk === "Tinggi" ? "Tidak Sehat" : "Perlu dipantau"}
              </b>
            </div>
            <div className="bar-chart" aria-label="Grafik tren kualitas udara">
              {active.bars.map((v, i) => (
                <div key={i} className="bar-col">
                  <i
                    className={
                      v > 75 ? "bar-red" : v > 50 ? "bar-orange" : "bar-yellow"
                    }
                    style={{ height: `${v}%` }}
                  />
                  <small>{["06", "09", "12", "15", "18", "21", "00"][i]}</small>
                </div>
              ))}
            </div>
            <div className="chart-foot">
              <CheckCircle2 size={16} />
              {active.action}
            </div>
          </article>
          <article className="panel explanation">
            <h3>
              <Info size={17} /> Apa yang memengaruhi risiko?
            </h3>
            <p>
              Contoh risiko dihitung dari pola kualitas udara simulasi dan
              jumlah indikasi panas yang tersedia. Kondisi sebenarnya dapat
              berubah cepat; data ini tidak memastikan kapan atau di mana
              kebakaran terjadi.
            </p>
          </article>
        </div>
        <aside className="panel schedule-panel">
          <span className="eyebrow">SARAN HARIAN</span>
          <h3>
            Aktivitas untuk {active.day}, {active.date}
          </h3>
          {[
            [
              "06.30",
              "Perjalanan pagi",
              "Gunakan masker bila kualitas udara buruk.",
            ],
            [
              "12.00",
              "Aktivitas luar",
              "Kurangi aktivitas berat saat udara berasap.",
            ],
            [
              "18.30",
              "Persiapan malam",
              "Tutup celah ventilasi bila asap masuk.",
            ],
          ].map(([time, title, body], i) => (
            <div className="schedule-item" key={time}>
              <span>{time}</span>
              <div>
                <b>{title}</b>
                <p>{i === 1 ? active.action : body}</p>
              </div>
            </div>
          ))}
          <div className="source-caption">
            Simulasi · diperbarui {air.metadata.observedAt}
            <br />
            Bukan informasi prakiraan resmi.
          </div>
          <Link className="button secondary full" to="/sigap-ai">
            Tanya SIGAP AI <ArrowRight size={15} />
          </Link>
        </aside>
      </div>
    </>
  );
}

type Msg = { from: "bot" | "user"; text: string };
export function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      from: "bot",
      text: "Halo! Saya SIGAP AI versi demonstrasi. Saya bisa membantu memahami kualitas udara dan langkah kesiapsiagaan. Apa yang ingin kamu ketahui?",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  function send(value = input) {
    const q = value.trim();
    if (!q || busy) return;
    setMessages((m) => [...m, { from: "user", text: q }]);
    setInput("");
    setBusy(true);
    window.setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", text: answerFor(q) }]);
      setBusy(false);
    }, 350);
  }
  return (
    <>
      <DemoNote>
        Jawaban dihasilkan oleh aturan lokal, bukan model AI atau sumber
        real-time.
      </DemoNote>
      <Title
        eyebrow="ASISTEN KESIAPSIAGAAN"
        title="Tanya SIGAP AI"
        desc="Informasi umum untuk membantu persiapanmu."
      />
      <div className="chat-layout">
        <div className="panel chat-panel">
          <div className="chat-head">
            <span className="ai-avatar">
              <Sparkles size={18} />
            </span>
            <div>
              <b>SIGAP AI</b>
              <small>
                <i /> Aktif · Mode demonstrasi
              </small>
            </div>
          </div>
          <div className="chat-messages" aria-live="polite">
            {messages.map((m, i) => (
              <div className={`message ${m.from}`} key={i}>
                <span className="message-icon">
                  {m.from === "bot" ? <Sparkles size={14} /> : <span>AK</span>}
                </span>
                <p>{m.text}</p>
              </div>
            ))}
            {busy && (
              <div className="typing">SIGAP sedang menyiapkan jawaban…</div>
            )}
          </div>
          <div className="suggestions">
            {[
              "Apa arti AQI 168?",
              "Bagaimana jika ada titik panas?",
              "Apa yang disiapkan saat darurat?",
            ].map((q) => (
              <button key={q} onClick={() => send(q)}>
                {q}
              </button>
            ))}
          </div>
          <form
            className="chat-input"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <input
              aria-label="Tulis pertanyaan"
              placeholder="Tanya tentang udara, api, atau rencana…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button aria-label="Kirim pesan" disabled={!input.trim() || busy}>
              <Send size={17} />
            </button>
          </form>
          <div className="chat-disclaimer">
            Untuk keadaan darurat, ikuti arahan petugas dan sumber resmi.
          </div>
        </div>
        <aside className="panel chat-aside">
          <div className="ai-large">
            <Sparkles size={23} />
          </div>
          <h3>Asisten kesiapsiagaan</h3>
          <p>
            SIGAP AI demo memberi informasi umum seputar kualitas udara dan
            kesiapsiagaan.
          </p>
          <div className="chat-source">
            <CheckCircle2 size={16} />
            Logika jawaban lokal
            <br />
            Tanpa koneksi layanan AI
          </div>
          <Link to="/panduan-darurat" className="button secondary full">
            Buka panduan darurat <ArrowRight size={15} />
          </Link>
        </aside>
      </div>
    </>
  );
}

export function EmergencyPage() {
  const [seconds, setSeconds] = useState(134);
  const [running, setRunning] = useState(true);
  const [ack, setAck] = useState(false);
  useEffect(() => {
    if (!running || seconds <= 0) return;
    const id = window.setInterval(
      () => setSeconds((s) => Math.max(0, s - 1)),
      1000,
    );
    return () => window.clearInterval(id);
  }, [running, seconds]);
  const clock = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  return (
    <div className="emergency-wrap">
      <div className="emergency-screen">
        <div className="emergency-top">
          <span className="brand-mark">
            <Activity size={17} />
          </span>
          <b>SIGAP · MODE SIAGA</b>
          <span className="demo-tag">LOKAL</span>
        </div>
        <div className="emergency-content">
          <span className="emergency-date">MINGGU · 25 OKTOBER</span>
          <div className="countdown" aria-live="polite">
            {clock}
          </div>
          <span className="countdown-caption">
            Hitung mundur lokal demonstrasi
          </span>
          <div className="countdown-actions">
            <button onClick={() => setRunning((v) => !v)}>
              {running ? <Pause size={15} /> : <Play size={15} />}{" "}
              {running ? "Jeda" : "Lanjutkan"}
            </button>
            <button
              onClick={() => {
                setSeconds(134);
                setRunning(true);
              }}
            >
              Atur ulang
            </button>
          </div>
          <div className="emergency-alert">
            <CircleAlert size={17} /> Risiko kualitas udara contoh tinggi ·
            tetap waspada
          </div>
          <article className="emergency-card">
            <span className="eyebrow">PERINGATAN SIGAP · DEMO</span>
            <h2>Periksa kondisi sekitar</h2>
            <p>
              Data kualitas udara dan indikasi titik panas di aplikasi ini
              adalah simulasi. Pastikan situasi melalui sumber resmi setempat.
            </p>
            <div className="emergency-card-actions">
              <Link to="/panduan-darurat" className="button primary">
                Buka panduan
              </Link>
              <button className="button outline" onClick={() => setAck(true)}>
                {ack ? "Saya sudah aman" : "Saya aman"}
              </button>
            </div>
            {ack && (
              <span className="ack-message">
                <Check size={14} /> Status aman dicatat di sesi ini.
              </span>
            )}
          </article>
          <Link to="/pantau" className="back-home">
            ← Kembali ke aplikasi
          </Link>
        </div>
      </div>
      <div className="emergency-side">
        <ShieldAlert size={26} />
        <h2>Mode siaga SIGAP</h2>
        <p>
          Layar ini adalah fitur UI lokal. Aplikasi web tidak mengubah lock
          screen perangkat, pengaturan Jangan Ganggu, atau sistem peringatan
          resmi.
        </p>
        <Link to="/panduan-darurat" className="button primary">
          Lihat panduan keselamatan <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

export function GuidePage() {
  const [safe, setSafe] = useState(false);
  const [notice, setNotice] = useState("");
  function share() {
    if (navigator.share) {
      navigator
        .share({
          title: "Status keselamatan SIGAP",
          text: "Saya sedang memeriksa panduan keselamatan SIGAP.",
        })
        .catch(() => setNotice("Berbagi dibatalkan."));
    } else setNotice("Fitur berbagi tidak tersedia di browser ini.");
  }
  return (
    <>
      <Link className="guide-back" to="/pantau">
        ← Kembali ke Pantau
      </Link>
      <div className="guide-banner">
        <div className="guide-banner-icon">
          <ShieldAlert size={20} />
        </div>
        <div>
          <span>MODE DEMONSTRASI</span>
          <h2>Utamakan keselamatan diri</h2>
          <p>
            Jika ada bahaya nyata, jauhi area terdampak dan ikuti instruksi
            petugas resmi.
          </p>
        </div>
      </div>
      <Title
        eyebrow="LANGKAH KESELAMATAN"
        title="Panduan darurat"
        desc="Langkah singkat yang bisa membantu saat terjadi asap atau keadaan darurat."
      />
      <div className="guide-layout">
        <div className="panel steps-panel">
          {[
            [
              "Jauhi sumber bahaya",
              "Jangan mendekati api atau indikasi titik panas. Bergerak menjauhi asap.",
            ],
            [
              "Lindungi pernapasan",
              "Jika tersedia, gunakan masker yang sesuai. Cari ruang tertutup bila kualitas udara memburuk.",
            ],
            [
              "Ikuti informasi resmi",
              "Dengarkan arahan petugas dan kanal resmi pemerintah setempat.",
            ],
            [
              "Hubungi layanan darurat setempat",
              "Gunakan nomor resmi yang sudah Anda verifikasi untuk wilayah Anda.",
            ],
          ].map(([h, p], i) => (
            <div className="guide-step" key={h}>
              <span className={`step-number ${i === 0 ? "danger" : ""}`}>
                {i + 1}
              </span>
              <div>
                <b>{h}</b>
                <p>{p}</p>
              </div>
            </div>
          ))}
          <div className="guide-actions">
            <button
              className="button primary"
              onClick={() =>
                setNotice(
                  "Pilih layanan navigasi resmi di perangkat Anda; tujuan aman belum tersedia pada data demo.",
                )
              }
            >
              <Navigation size={16} /> Buka navigasi
            </button>
            <button
              className="button outline"
              onClick={() =>
                setNotice(
                  "Nomor kontak resmi tidak disediakan oleh data demonstrasi. Gunakan kontak resmi daerah Anda.",
                )
              }
            >
              <MessageCircle size={16} /> Kontak darurat
            </button>
            <button className="button secondary" onClick={share}>
              <ArrowRight size={16} /> Bagikan status
            </button>
          </div>
          {notice && (
            <div className="inline-status" role="status">
              {notice}
              <button onClick={() => setNotice("")} aria-label="Tutup">
                <X size={14} />
              </button>
            </div>
          )}
        </div>
        <aside className="panel safe-panel">
          <div className="safe-icon">
            <CheckCircle2 size={23} />
          </div>
          <h3>{safe ? "Senang kamu aman" : "Apakah kamu sudah aman?"}</h3>
          <p>
            {safe
              ? "Status aman tercatat untuk sesi ini. Tetap ikuti informasi resmi."
              : "Tandai statusmu bila kamu berada di tempat yang aman."}
          </p>
          <button
            className={`button ${safe ? "secondary" : "primary"} full`}
            onClick={() => setSafe((s) => !s)}
          >
            {safe ? "Ubah status" : "Saya sudah aman"} <Check size={16} />
          </button>
          <div className="source-caption">
            SIGAP tidak mengirim pemberitahuan ke petugas atau kontak lain.
          </div>
        </aside>
      </div>
    </>
  );
}

export function PreviewPage() {
  const links = [
    ["/pantau", "01", "Pantau", "AQI & saran kesehatan", "home"],
    ["/peta", "02", "Peta & Titik Api", "Indikasi dan filter", "map"],
    ["/rencana", "03", "Rencana Aman", "Risiko dan aktivitas", "plan"],
    ["/sigap-ai", "04", "SIGAP AI", "Asisten lokal demo", "chat"],
    ["/darurat", "05", "Mode Siaga", "Countdown lokal", "lock"],
    [
      "/panduan-darurat",
      "06",
      "Panduan Darurat",
      "Langkah keselamatan",
      "guide",
    ],
  ];
  return (
    <>
      <DemoNote>
        Pratinjau komposisi enam layar · klik layar untuk membuka halaman
        interaktif.
      </DemoNote>
      <Title
        eyebrow="DESIGN PREVIEW"
        title="Enam layar SIGAP"
        desc="Tata letak mengikuti storyboard Figma. Setiap layar tetap terhubung ke fitur aplikasinya."
      />
      <div className="preview-board">
        {links.map(([to, num, name, desc, tone]) => (
          <Link to={to} className="preview-item" key={to}>
            <div className={`preview-phone ${tone}`}>
              <div className="phone-status">
                <span>9:41</span>
                <span>● ▰</span>
              </div>
              {tone === "home" ? (
                <>
                  <b className="phone-title">Pekanbaru, Riau</b>
                  <div className="phone-hero">
                    <small>Kualitas udara saat ini</small>
                    <strong>
                      168 <i>AQI</i>
                    </strong>
                    <b>Tidak Sehat</b>
                    <div className="phone-meter" />
                  </div>
                  <div className="phone-card">
                    <b>Saran untuk kamu</b>
                    <i />
                    <i />
                    <i />
                  </div>
                  <div className="phone-card tint">
                    <b>3 titik api aktif</b>
                    <i />
                  </div>
                </>
              ) : tone === "map" ? (
                <>
                  <div className="phone-search">Cari kota atau titik api</div>
                  <div className="phone-map">
                    <i />
                    <i />
                    <i />
                    <span>●</span>
                  </div>
                  <div className="phone-card">
                    <b>Titik api · Pelalawan</b>
                    <i />
                    <i />
                  </div>
                </>
              ) : tone === "plan" ? (
                <>
                  <b className="phone-title">Rencana Aman</b>
                  <div className="phone-dates">
                    <i>24</i>
                    <i>25</i>
                    <i>26</i>
                    <i>27</i>
                    <i>28</i>
                  </div>
                  <div className="phone-card">
                    <b>Tidak Sehat</b>
                    <div className="phone-bars">
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                    </div>
                  </div>
                  <div className="phone-card">
                    <b>Jadwal saran</b>
                    <i />
                    <i />
                    <i />
                  </div>
                </>
              ) : tone === "chat" ? (
                <>
                  <b className="phone-title">✦ SIGAP AI</b>
                  <div className="phone-toggle">Mode Penjaga aktif ●</div>
                  <div className="phone-bubble">
                    Kualitas udara saat ini perlu diwaspadai.
                  </div>
                  <div className="phone-bubble user-bubble">
                    Apa yang harus saya lakukan?
                  </div>
                  <div className="phone-bubble">
                    Batasi aktivitas di luar dan cek info resmi.
                  </div>
                </>
              ) : tone === "lock" ? (
                <>
                  <div className="phone-lock-date">Minggu, 25 Oktober</div>
                  <div className="phone-clock">02:14</div>
                  <div className="phone-lock-alert">
                    Risiko asap tinggi · tetap waspada
                  </div>
                  <div className="phone-lock-card">
                    <b>PERINGATAN SIGAP</b>
                    <strong>Periksa kondisi sekitar</strong>
                    <i />
                    <i />
                    <span>Buka panduan</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="phone-alert-label">DARURAT</div>
                  <div className="phone-guide-title">
                    Periksa kondisi sekitar
                  </div>
                  <b className="phone-title">Lakukan sekarang</b>
                  <div className="phone-steps">
                    <b>1 Jauhi sumber bahaya</b>
                    <b>2 Lindungi pernapasan</b>
                    <b>3 Ikuti arahan resmi</b>
                  </div>
                  <div className="phone-button">Buka panduan</div>
                </>
              )}
              <div className="phone-nav">
                <i />
                <i />
                <i />
                <i />
              </div>
            </div>
            <b className="preview-caption">
              {num} · {name}
            </b>
            <span>{desc}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
