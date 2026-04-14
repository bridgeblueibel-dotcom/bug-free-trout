import Head from 'next/head'
import { useEffect, useState } from 'react'

const SERVICIOS = [
  'Masaje Relajante · 95€',
  'Peluquería en domicilio · desde 80€',
  'Maquillaje profesional · desde 90€',
  'Manicura & Estética · 70€',
  'Jet-Lag Recovery · 150€',
  'Pack Amanecer Impecable · 120€',
]

function formatDate(date) {
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function ReporteDiario() {
  const today = new Date()
  const dateLabel = formatDate(today)
  const shortDate = today.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })

  const [clientes, setClientes] = useState(0)
  const [profesionales, setProfesionales] = useState(0)
  const [estadoSistema, setEstadoSistema] = useState('100% operativo')
  const [focoDia, setFocoDia] = useState('Pasar de la "Construcción" a la "Adquisición". Inyectar tráfico a las landing pages.')
  const [notaCEO, setNotaCEO] = useState('La máquina está lista. Misión de hoy: traer ojos a la web y reactivar las campañas.')
  const [copied, setCopied] = useState(false)

  const reportText = `🏛️ REPORTE DIARIO: BLUE 24/7 — [${shortDate}]

Recuento Exacto: ${clientes} Clientes / ${profesionales} Profesionales.

Estado del Sistema: ${estadoSistema}.

Foco del Día: ${focoDia}

Nota de la CEO: ${notaCEO}`

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.1 }
    )
    document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Head>
        <title>Blue 24/7 · Reporte Diario</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap" rel="stylesheet" />
      </Head>

      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: 'Inter', sans-serif;
          background: #0B0E1F;
          color: #FFFFFF;
          min-height: 100vh;
        }

        .fade-up {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .fade-up.visible { opacity: 1; transform: translateY(0); }

        /* ── NAV ── */
        nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 40px;
          background: #0B0E1F;
          position: sticky;
          top: 0;
          z-index: 100;
          border-bottom: 1px solid rgba(212,175,55,0.2);
        }
        nav a.brand {
          color: #D4AF37;
          text-decoration: none;
          font-weight: 900;
          font-size: 18px;
          letter-spacing: 1px;
        }
        nav a.back {
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: color 0.2s;
        }
        nav a.back:hover { color: #D4AF37; }

        /* ── HEADER ── */
        .page-header {
          background: radial-gradient(ellipse at top, #12183A 0%, #0B0E1F 70%);
          padding: 60px 20px 50px;
          text-align: center;
        }
        .page-header .eyebrow {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2px;
          color: #D4AF37;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .page-header h1 {
          font-size: clamp(28px, 4vw, 50px);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 10px;
        }
        .page-header h1 span { color: #D4AF37; }
        .page-header .date-label {
          font-size: 15px;
          color: rgba(255,255,255,0.45);
          font-style: italic;
          text-transform: capitalize;
        }

        /* ── LAYOUT ── */
        .container {
          max-width: 960px;
          margin: 0 auto;
          padding: 60px 20px 100px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        /* ── METRIC CARDS ── */
        .metrics-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .metric-card {
          background: #12183A;
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 16px;
          padding: 32px 28px;
          text-align: center;
        }
        .metric-card .metric-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-bottom: 16px;
        }
        .metric-card .counter-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }
        .counter-btn {
          width: 36px;
          height: 36px;
          background: rgba(212,175,55,0.1);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 8px;
          color: #D4AF37;
          font-size: 20px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
        .counter-btn:hover { background: rgba(212,175,55,0.2); }
        .counter-value {
          font-size: 56px;
          font-weight: 900;
          color: #D4AF37;
          min-width: 70px;
          line-height: 1;
        }

        /* ── STATUS CARD ── */
        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.3);
          border-radius: 20px;
          padding: 6px 16px;
          font-size: 13px;
          font-weight: 700;
          color: #4ade80;
        }
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4ade80;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* ── SECTION CARD ── */
        .section-card {
          background: #12183A;
          border: 1px solid rgba(212,175,55,0.15);
          border-radius: 16px;
          padding: 32px;
        }
        .section-card .card-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #D4AF37;
          margin-bottom: 16px;
        }
        .editable-field {
          width: 100%;
          background: #0B0E1F;
          border: 1px solid rgba(212,175,55,0.15);
          border-radius: 8px;
          padding: 14px 16px;
          color: white;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          line-height: 1.6;
          resize: vertical;
          outline: none;
          transition: border-color 0.3s;
          min-height: 80px;
        }
        .editable-field:focus { border-color: #D4AF37; }

        /* ── PREVIEW ── */
        .preview-card {
          background: #07091A;
          border: 1px solid rgba(212,175,55,0.25);
          border-radius: 16px;
          padding: 32px;
        }
        .preview-card .card-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-bottom: 20px;
        }
        .preview-text {
          font-size: 14px;
          color: rgba(255,255,255,0.75);
          line-height: 2;
          white-space: pre-wrap;
          font-family: 'Inter', monospace;
        }
        .copy-btn {
          margin-top: 24px;
          width: 100%;
          background: linear-gradient(135deg, #D4AF37, #F5D87A, #D4AF37);
          color: #0B0E1F;
          padding: 16px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 900;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(212,175,55,0.3);
          transition: transform 0.2s, box-shadow 0.2s;
          letter-spacing: 0.3px;
        }
        .copy-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(212,175,55,0.5);
        }
        .copy-btn.copied {
          background: linear-gradient(135deg, #4ade80, #22c55e);
        }

        /* ── DIVIDER ── */
        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(212,175,55,0.25), transparent);
        }

        /* ── MOBILE ── */
        @media (max-width: 640px) {
          nav { padding: 16px 20px; }
          .metrics-row { grid-template-columns: 1fr; }
          .counter-value { font-size: 44px; }
          .section-card, .preview-card { padding: 24px 20px; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav>
        <a className="brand" href="/">Blue 24/7</a>
        <a className="back" href="/">Volver al inicio</a>
      </nav>

      {/* ── HEADER ── */}
      <div className="page-header fade-up">
        <div className="eyebrow">Operaciones internas</div>
        <h1>Reporte <span>Diario</span></h1>
        <div className="date-label">{dateLabel}</div>
      </div>

      <div className="container">

        {/* ── METRICS ── */}
        <div className="metrics-row fade-up">
          <div className="metric-card">
            <div className="metric-label">Clientes activos</div>
            <div className="counter-wrap">
              <button
                className="counter-btn"
                onClick={() => setClientes(Math.max(0, clientes - 1))}
                aria-label="Reducir clientes"
              >−</button>
              <div className="counter-value">{clientes}</div>
              <button
                className="counter-btn"
                onClick={() => setClientes(clientes + 1)}
                aria-label="Aumentar clientes"
              >+</button>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Profesionales registrados</div>
            <div className="counter-wrap">
              <button
                className="counter-btn"
                onClick={() => setProfesionales(Math.max(0, profesionales - 1))}
                aria-label="Reducir profesionales"
              >−</button>
              <div className="counter-value">{profesionales}</div>
              <button
                className="counter-btn"
                onClick={() => setProfesionales(profesionales + 1)}
                aria-label="Aumentar profesionales"
              >+</button>
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* ── SYSTEM STATUS ── */}
        <div className="section-card fade-up">
          <div className="card-title">Estado del sistema</div>
          <div style={{ marginBottom: 16 }}>
            <span className="status-pill">
              <span className="status-dot" />
              Ecosistema operativo
            </span>
          </div>
          <input
            className="editable-field"
            style={{ minHeight: 'unset', height: 48 }}
            value={estadoSistema}
            onChange={(e) => setEstadoSistema(e.target.value)}
            placeholder="Estado del sistema..."
          />
        </div>

        {/* ── FOCUS OF THE DAY ── */}
        <div className="section-card fade-up">
          <div className="card-title">Foco del dia</div>
          <textarea
            className="editable-field"
            value={focoDia}
            onChange={(e) => setFocoDia(e.target.value)}
            placeholder="¿Cuál es la prioridad de hoy?"
          />
        </div>

        {/* ── CEO NOTE ── */}
        <div className="section-card fade-up">
          <div className="card-title">Nota de la CEO</div>
          <textarea
            className="editable-field"
            value={notaCEO}
            onChange={(e) => setNotaCEO(e.target.value)}
            placeholder="Nota directiva del día..."
          />
        </div>

        <div className="divider" />

        {/* ── PREVIEW + COPY ── */}
        <div className="preview-card fade-up">
          <div className="card-title">Vista previa para ClickUp</div>
          <div className="preview-text">{reportText}</div>
          <button
            className={`copy-btn${copied ? ' copied' : ''}`}
            onClick={handleCopy}
          >
            {copied ? '✓ Copiado al portapapeles' : 'Copiar reporte para ClickUp'}
          </button>
        </div>

      </div>
    </>
  )
}
