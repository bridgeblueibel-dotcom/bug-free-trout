import Head from 'next/head'
import Script from 'next/script'
import { useEffect, useState } from 'react'

// ── CONFIGURACIÓN HUBSPOT ──────────────────────────────────────
const HUBSPOT_PORTAL_ID = '147481031'
const HUBSPOT_FORM_ID   = 'eu1-6668-3744-4a6f-8874-88004b125c99'
// ──────────────────────────────────────────────────────────────

export default function Landing() {
  const [formLoaded, setFormLoaded] = useState(false)

  useEffect(() => {
    if (window.hbspt && !formLoaded) {
      window.hbspt.forms.create({
        region: 'eu1',
        portalId: HUBSPOT_PORTAL_ID,
        formId: HUBSPOT_FORM_ID,
        target: '#hubspot-form',
        onFormSubmit: () => {
          if (window.gtag) {
            window.gtag('event', 'conversion', { send_to: 'AW-18059698700' })
            window.gtag('event', 'generate_lead', { currency: 'EUR' })
          }
        },
      })
      setFormLoaded(true)
    }
  }, [formLoaded])

  return (
    <>
      <Head>
        <title>Desert Call · Belleza y bienestar a domicilio 05:00–01:00</title>
        <meta name="description" content="Profesionales verificados en tu hotel o domicilio. Masajes, maquillaje, peluquería y más. Disponible 05:00–01:00. Reserva ahora." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://online.hablamos247.com/landing" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap" rel="stylesheet" />
        {/* No-index para no competir con la home en SEO */}
        <meta name="robots" content="noindex, follow" />
      </Head>

      {/* HubSpot forms script */}
      <Script
        src="//js-eu1.hsforms.net/forms/embed/v2.js"
        strategy="afterInteractive"
        onLoad={() => setFormLoaded(false)} // trigger useEffect re-run
      />

      <style jsx>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Inter',sans-serif; background:#0B0E1F; color:#fff; }

        /* ── HERO ── */
        .hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 60px;
          padding: 60px 80px;
          background: radial-gradient(ellipse at top left, #12183A 0%, #0B0E1F 60%);
        }

        @media(max-width:900px){
          .hero { grid-template-columns:1fr; padding:40px 20px; gap:40px; }
        }

        /* ── LEFT ── */
        .hero-left { max-width: 560px; }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(212,175,55,0.1);
          border: 1px solid rgba(212,175,55,0.4);
          color: #D4AF37;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 28px;
        }

        h1 {
          font-size: clamp(32px, 4.5vw, 58px);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 24px;
        }

        h1 span { color: #D4AF37; }

        .hero-sub {
          font-size: 18px;
          color: rgba(255,255,255,0.7);
          line-height: 1.7;
          margin-bottom: 36px;
        }

        .trust-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 40px;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: rgba(255,255,255,0.7);
        }

        .trust-item span { color: #D4AF37; font-size: 18px; }

        .services-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .service-pill {
          background: #12183A;
          border: 1px solid rgba(212,175,55,0.15);
          border-radius: 10px;
          padding: 14px 16px;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .service-pill .icon { font-size: 20px; }
        .service-pill .price { color: #D4AF37; font-weight: 700; margin-left: auto; font-size: 13px; }

        /* ── RIGHT (FORM) ── */
        .form-card {
          background: #12183A;
          border: 1px solid rgba(212,175,55,0.25);
          border-radius: 20px;
          padding: 48px 40px;
          position: sticky;
          top: 40px;
        }

        @media(max-width:900px){
          .form-card { position:static; padding:32px 24px; }
        }

        .form-card h2 {
          font-size: 24px;
          font-weight: 900;
          margin-bottom: 6px;
          text-align: center;
        }

        .form-card h2 span { color: #D4AF37; }

        .form-sub {
          text-align: center;
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 28px;
        }

        #hubspot-form :global(.hs-form) { font-family: 'Inter', sans-serif !important; }

        #hubspot-form :global(.hs-input) {
          width: 100% !important;
          background: #0B0E1F !important;
          border: 1px solid rgba(212,175,55,0.2) !important;
          border-radius: 8px !important;
          padding: 12px 14px !important;
          color: white !important;
          font-size: 15px !important;
          font-family: 'Inter', sans-serif !important;
        }

        #hubspot-form :global(.hs-input:focus) {
          border-color: #D4AF37 !important;
          outline: none !important;
        }

        #hubspot-form :global(.hs-form-field label) {
          color: #D4AF37 !important;
          font-size: 12px !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
          margin-bottom: 6px !important;
        }

        #hubspot-form :global(.hs-button) {
          width: 100% !important;
          background: linear-gradient(135deg, #D4AF37, #F5D87A, #D4AF37) !important;
          color: #0B0E1F !important;
          font-weight: 900 !important;
          font-size: 16px !important;
          padding: 16px !important;
          border-radius: 8px !important;
          border: none !important;
          cursor: pointer !important;
          font-family: 'Inter', sans-serif !important;
          margin-top: 8px !important;
        }

        #hubspot-form :global(.hs-error-msgs) {
          color: #ff6b6b !important;
          font-size: 12px !important;
          list-style: none !important;
          padding: 0 !important;
        }

        #hubspot-form :global(.submitted-message) {
          text-align: center;
          color: #D4AF37;
          font-size: 18px;
          font-weight: 700;
          padding: 20px 0;
        }

        .privacy-note {
          text-align: center;
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          margin-top: 16px;
        }

        /* ── STRIP INFERIOR ── */
        .bottom-strip {
          background: #07091A;
          border-top: 1px solid rgba(212,175,55,0.15);
          padding: 30px 80px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        @media(max-width:768px){ .bottom-strip { padding:24px 20px; justify-content:center; text-align:center; } }

        .bottom-strip p { font-size: 13px; color: rgba(255,255,255,0.4); }
        .bottom-strip a { color: #D4AF37; text-decoration: none; }

        .phone-cta {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(212,175,55,0.1);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 8px;
          padding: 10px 20px;
          text-decoration: none;
          color: #D4AF37;
          font-weight: 700;
          font-size: 15px;
        }
      `}</style>

      <main>
        <div className="hero">
          {/* ── IZQUIERDA ── */}
          <div className="hero-left">
            <div className="eyebrow">
              <span>⚡</span> Disponible ahora · 05:00–01:00
            </div>

            <h1>
              Belleza y bienestar<br />
              <span>en tu hotel o domicilio.</span>
            </h1>

            <p className="hero-sub">
              Profesionales verificados desplazados a donde estés.
              Masajes, peluquería, maquillaje y más —
              en Las Palmas de Gran Canaria.
            </p>

            <div className="trust-row">
              <div className="trust-item"><span>✓</span> Sin cuotas</div>
              <div className="trust-item"><span>✓</span> Pago seguro Stripe</div>
              <div className="trust-item"><span>✓</span> Confirmación en 1h</div>
              <div className="trust-item"><span>✓</span> Profesionales KYC verificados</div>
            </div>

            <div className="services-grid">
              <div className="service-pill">
                <span className="icon">💆</span>
                <span>Masaje Relajante</span>
                <span className="price">95€</span>
              </div>
              <div className="service-pill">
                <span className="icon">💇</span>
                <span>Peluquería</span>
                <span className="price">80€+</span>
              </div>
              <div className="service-pill">
                <span className="icon">💄</span>
                <span>Maquillaje</span>
                <span className="price">90€+</span>
              </div>
              <div className="service-pill">
                <span className="icon">💅</span>
                <span>Manicura</span>
                <span className="price">70€</span>
              </div>
              <div className="service-pill">
                <span className="icon">✈️</span>
                <span>Jet-Lag Recovery</span>
                <span className="price">150€</span>
              </div>
              <div className="service-pill">
                <span className="icon">🌅</span>
                <span>Pack Amanecer</span>
                <span className="price">120€</span>
              </div>
            </div>
          </div>

          {/* ── DERECHA (FORM HUBSPOT) ── */}
          <div className="form-card">
            <h2>Solicita tu <span>reserva</span></h2>
            <p className="form-sub">Confirmación en menos de 1 hora · Sin compromiso</p>

            {/* HubSpot form se inyecta aquí */}
            <div id="hubspot-form" />

            <p className="privacy-note">
              Al enviar aceptas nuestra política de privacidad.
              Tus datos no se comparten con terceros.
            </p>
          </div>
        </div>

        {/* ── FOOTER STRIP ── */}
        <div className="bottom-strip">
          <p>© 2025 IL Bridge Blue World S.L. · CIF B24909517 · <a href="https://online.hablamos247.com">online.hablamos247.com</a></p>
          <a className="phone-cta" href="tel:+34614067291">
            📞 +34 614 067 291
          </a>
          <p><a href="mailto:contacto@hablamos247.es">contacto@hablamos247.es</a></p>
        </div>
      </main>
    </>
  )
}
