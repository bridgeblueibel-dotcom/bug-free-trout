import Head from 'next/head'
import Script from 'next/script'
import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.15 }
    )

    document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Head>
        <title>Blue 24/7 · hablamos247.com</title>
        <meta name="description" content="Plataforma logística estética 05:00–01:00. Profesionales verificados en hotel, domicilio o centro. Pago seguro Stripe." />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap" rel="stylesheet" />
      </Head>
      <Script src="https://js.stripe.com/v3/buy-button.js" />
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Inter', sans-serif;
          background: #0B0E1F;
          color: #FFFFFF;
        }
        /* ─── ANIMACIONES ─── */
        .fade-up {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
        /* ─── NAV ─── */
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
        nav img {
          height: 60px;
        }
        nav a {
          color: #D4AF37;
          text-decoration: none;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 1px;
        }
        /* ─── HERO ─── */
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 80px 20px;
          background: radial-gradient(ellipse at top, #12183A 0%, #0B0E1F 70%);
        }
        .hero img.logo {
          width: 200px;
          margin-bottom: 30px;
          filter: drop-shadow(0 0 30px rgba(212,175,55,0.4));
        }
        .hero h1 {
          font-size: clamp(36px, 6vw, 72px);
          font-weight: 900;
          color: #FFFFFF;
          line-height: 1.1;
          margin-bottom: 20px;
        }
        .hero h1 span {
          color: #D4AF37;
        }
        .hero p {
          font-size: 18px;
          color: rgba(255,255,255,0.7);
          max-width: 580px;
          margin: 0 auto 40px auto;
          line-height: 1.7;
        }
        .badge-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 40px;
        }
        .badge {
          background: rgba(212,175,55,0.1);
          border: 1px solid rgba(212,175,55,0.4);
          color: #D4AF37;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
        }
        /* ─── BOTONES ─── */
        .btn-gold {
          background: linear-gradient(135deg, #D4AF37, #F5D87A, #D4AF37);
          color: #0B0E1F;
          padding: 16px 36px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 900;
          text-decoration: none;
          display: inline-block;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 20px rgba(212,175,55,0.3);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-gold:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(212,175,55,0.5);
        }
        .btn-outline {
          border: 2px solid #D4AF37;
          color: #D4AF37;
          padding: 14px 32px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 700;
          text-decoration: none;
          display: inline-block;
          transition: background 0.2s, color 0.2s;
        }
        .btn-outline:hover {
          background: #D4AF37;
          color: #0B0E1F;
        }
        /* ─── SECCIONES ─── */
        section {
          padding: 100px 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        section.full {
          max-width: 100%;
          padding: 100px 40px;
        }
        h2 {
          font-size: clamp(28px, 4vw, 48px);
          font-weight: 900;
          margin-bottom: 16px;
          text-align: center;
        }
        h2 span {
          color: #D4AF37;
        }
        .section-sub {
          text-align: center;
          color: rgba(255,255,255,0.6);
          font-size: 17px;
          max-width: 560px;
          margin: 0 auto 60px auto;
          line-height: 1.7;
        }
        /* ─── GRID CARDS ─── */
        .grid {
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        }
        .card {
          background: #12183A;
          border: 1px solid rgba(212,175,55,0.15);
          border-radius: 16px;
          padding: 32px;
          transition: border-color 0.3s, transform 0.3s;
        }
        .card:hover {
          border-color: #D4AF37;
          transform: translateY(-4px);
        }
        .card-icon {
          font-size: 32px;
          margin-bottom: 16px;
        }
        .card h3 {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 10px;
          color: #D4AF37;
        }
        .card p {
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          line-height: 1.6;
        }
        /* ─── SERVICIOS CON IMAGEN ─── */
        .card-img-wrap {
          height: 160px;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 16px;
        }
        .card-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s;
        }
        .card:hover .card-img-wrap img {
          transform: scale(1.05);
        }
        /* ─── STEPS ─── */
        .steps {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: center;
          counter-reset: step;
        }
        .step {
          background: #12183A;
          border: 1px solid rgba(212,175,55,0.15);
          border-radius: 16px;
          padding: 30px;
          text-align: center;
          flex: 1 1 180px;
          max-width: 200px;
        }
        .step-num {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #D4AF37, #F5D87A);
          color: #0B0E1F;
          font-weight: 900;
          font-size: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px auto;
        }
        /* ─── DIVISOR ─── */
        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(212,175,55,0.3), transparent);
          margin: 0 40px;
        }
        /* ─── CTA FINAL ─── */
        .cta-band {
          background: linear-gradient(135deg, #12183A, #0B0E1F);
          border-top: 1px solid rgba(212,175,55,0.2);
          border-bottom: 1px solid rgba(212,175,55,0.2);
          padding: 100px 40px;
          text-align: center;
        }
        /* ─── FOOTER ─── */
        footer {
          background: #07091A;
          padding: 60px 40px;
          text-align: center;
          border-top: 1px solid rgba(212,175,55,0.15);
        }
        footer img {
          height: 80px;
          margin-bottom: 20px;
          opacity: 0.9;
        }
        footer p {
          color: rgba(255,255,255,0.5);
          font-size: 14px;
          line-height: 2;
        }
        footer a {
          color: #D4AF37;
          text-decoration: none;
        }
        /* ─── MOBILE CTA FIJO ─── */
        .mobile-bar {
          display: none;
        }
        @media (max-width: 768px) {
          .mobile-bar {
            display: block;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #0B0E1F;
            border-top: 1px solid rgba(212,175,55,0.3);
            padding: 12px 20px;
            z-index: 999;
            text-align: center;
          }
          .mobile-bar a {
            display: block;
            background: linear-gradient(135deg, #D4AF37, #F5D87A);
            color: #0B0E1F;
            font-weight: 900;
            font-size: 15px;
            padding: 14px;
            border-radius: 8px;
            text-decoration: none;
          }
          nav {
            padding: 16px 20px;
          }
          nav .nav-links {
            display: none;
          }
        }
      `}</style>
      {/* ── NAV ── */}
      <nav>
        <img src="YOUR_LOGO_URL" alt="Blue 24/7" />
        <div className="nav-links" style={{display:'flex',gap:30}}>
          <a href="#profesionales">Profesionales</a>
          <a href="#hoteles">Hoteles</a>
          <a href="#servicios">Servicios</a>
          <a href="#contacto">Contacto</a>
        </div>
        <a className="btn-gold" href="https://buy.stripe.com/fZu14p5DX9JE2wCf7CcEw01">Activar cuenta</a>
      </nav>
      {/* ── HERO ── */}
      <div className="hero fade-up">
        <img className="logo" src="YOUR_LOGO_URL" alt="Blue 24/7" />
        <h1>La plataforma que llena tu agenda<br /><span>cuando todos están cerrados.</span></h1>
        <p>Logística completa para servicios de estética fuera de horario.<br />Disponibilidad 05:00–01:00 · Sin cuotas · Solo comisión.</p>
        <div className="badge-row">
          <span className="badge">05:00–01:00</span>
          <span className="badge">Stripe · Klarna</span>
          <span className="badge">Profesionales verificados</span>
          <span className="badge">Hotel · Domicilio · Centro</span>
        </div>
        <stripe-buy-button
          buy-button-id="buy_btn_1TAU1jPmA9vRXLOeamYcRwBg"
          publishable-key="pk_live_51T3RPCPmA9vRXLOegJ40fxehxJrEYd0n9y4rLi4HlRJVnJB5OlxGfXFBnZQZDZk8n7QyAa5kM4KVU3HuiqpVgFgh008lMoWFfV"
        ></stripe-buy-button>
      </div>
      <div className="divider" />
      {/* ── PROFESIONALES ── */}
      <section id="profesionales" className="fade-up">
        <h2>Para <span>Profesionales & Centros</span></h2>
        <p className="section-sub">Sin cuotas mensuales. Sin permanencia. Solo comisión por servicio realizado. Nosotros gestionamos todo lo demás.</p>
        <div className="grid">
          <div className="card">
            <div className="card-icon">📲</div>
            <h3>Captación automática</h3>
            <p>Recibe clientes en horarios de alta demanda sin invertir en publicidad.</p>
          </div>
          <div className="card">
            <div className="card-icon">📅</div>
            <h3>Agenda 24/7</h3>
            <p>Gestión inteligente de citas sin llamadas ni administración manual.</p>
          </div>
          <div className="card">
            <div className="card-icon">💳</div>
            <h3>Pagos automáticos</h3>
            <p>Cobros procesados por Stripe. Ingresos directos al finalizar cada servicio.</p>
          </div>
          <div className="card">
            <div className="card-icon">📍</div>
            <h3>Donde tú trabajes</h3>
            <p>Hotel, domicilio o centro asociado. Tú eliges tu radio y tus franjas.</p>
          </div>
          <div className="card">
            <div className="card-icon">📈</div>
            <h3>Más ingresos reales</h3>
            <p>Convierte horas muertas en facturación. Sin inversión inicial.</p>
          </div>
        </div>
        <div style={{textAlign:'center',marginTop:50}}>
          <a className="btn-gold" href="https://buy.stripe.com/fZu14p5DX9JE2wCf7CcEw01">Activar cuenta profesional</a>
        </div>
      </section>
      <div className="divider" />
      {/* ── HOTELES ── */}
      <section id="hoteles" className="fade-up">
        <h2>Para <span>Hoteles 5★</span></h2>
        <p className="section-sub">Bienestar premium para tus huéspedes sin ampliar plantilla ni asumir costes fijos.</p>
        <div className="grid">
          <div className="card">
            <div className="card-icon">🏨</div>
            <h3>Servicio en suite</h3>
            <p>Profesionales desplazados al hotel bajo demanda del huésped.</p>
          </div>
          <div className="card">
            <div className="card-icon">⚡</div>
            <h3>Disponibilidad inmediata</h3>
            <p>Operativa de 05:00 a 01:00. Ideal para viajeros y ejecutivos.</p>
          </div>
          <div className="card">
            <div className="card-icon">🤝</div>
            <h3>Sin coste para el hotel</h3>
            <p>Integración rápida. El servicio se factura directamente al huésped.</p>
          </div>
          <div className="card">
            <div className="card-icon">⭐</div>
            <h3>Experiencia 5 estrellas</h3>
            <p>Profesionales verificados. Materiales premium. Servicio discreto.</p>
          </div>
        </div>
        <div style={{textAlign:'center',marginTop:50}}>
          <a className="btn-outline" href="tel:+34614067291">Integrar Blue 24/7 en mi hotel</a>
        </div>
      </section>
      <div className="divider" />
      {/* ── SERVICIOS ── */}
      <section id="servicios" className="fade-up">
        <h2><span>Servicios</span> Gestionados</h2>
        <p className="section-sub">Belleza, bienestar y estética. Disponibles fuera del horario convencional.</p>
        <div className="grid">
          <div className="card">
            <div className="card-img-wrap">
              <img src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&q=80" alt="Belleza" />
            </div>
            <h3>Belleza & Peluquería</h3>
            <p>Corte, color, peinado. En hotel o domicilio con todo el material.</p>
          </div>
          <div className="card">
            <div className="card-img-wrap">
              <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80" alt="Maquillaje" />
            </div>
            <h3>Maquillaje</h3>
            <p>Maquillaje profesional para eventos, galas y compromisos.</p>
          </div>
          <div className="card">
            <div className="card-img-wrap">
              <img src="https://images.unsplash.com/photo-1609787253338-e1c6c04c3f7d?w=600&q=80" alt="Manicura" />
            </div>
            <h3>Estética & Manicura</h3>
            <p>Tratamientos de alto nivel con profesionales certificados.</p>
          </div>
          <div className="card">
            <div className="card-img-wrap">
              <img src="https://images.unsplash.com/photo-1556228578-8a9ea1adaae1?w=600&q=80" alt="Masajes" />
            </div>
            <h3>Masajes · Wellness</h3>
            <p>Terapéutico, relajante, descontracturante. En tu espacio.</p>
          </div>
          <div className="card">
            <div className="card-img-wrap">
              <img src="https://images.unsplash.com/photo-1501117716987-c8e1ecb210d9?w=600&q=80" alt="Viajeros" />
            </div>
            <h3>Servicios express para viajeros</h3>
            <p>Servicios rápidos en hotel para huéspedes exigentes.</p>
          </div>
        </div>
      </section>
      <div className="divider" />
      {/* ── CÓMO FUNCIONA ── */}
      <section className="fade-up">
        <h2>Cómo <span>Funciona</span></h2>
        <p className="section-sub">Un proceso limpio, automático y sin fricción.</p>
        <div className="steps">
          <div className="step">
            <div className="step-num">1</div>
            <p>El cliente reserva</p>
          </div>
          <div className="step">
            <div className="step-num">2</div>
            <p>Asignamos profesional</p>
          </div>
          <div className="step">
            <div className="step-num">3</div>
            <p>Pago seguro</p>
          </div>
          <div className="step">
            <div className="step-num">4</div>
            <p>Servicio realizado</p>
          </div>
          <div className="step">
            <div className="step-num">5</div>
            <p>Ingreso automático al profesional</p>
          </div>
        </div>
      </section>
      <div className="divider" />
      {/* ── CTA FINAL ── */}
      <div className="cta-band fade-up">
        <img src="YOUR_LOGO_URL" alt="Blue 24/7" style={{height:100,marginBottom:30,filter:'drop-shadow(0 0 20px rgba(212,175,55,0.4))'}} />
        <h2>Listo para activar tus ingresos?</h2>
        <p style={{color:'rgba(255,255,255,0.6)',margin:'16px auto 40px auto',maxWidth:500}}>Sin cuotas. Sin riesgos. Sin excusas.</p>
        <a className="btn-gold" href="https://buy.stripe.com/fZu14p5DX9JE2wCf7CcEw01">Activar cuenta ahora</a>
      </div>
      {/* ── FOOTER ── */}
      <footer id="contacto">
        <img src="YOUR_LOGO_URL" alt="Blue 24/7" />
        <p>
          <a href="mailto:contacto@hablamos247.es">contacto@hablamos247.es</a><br />
          <a href="tel:+34614067291">+34 614 067 291</a><br />
          Las Palmas de Gran Canaria
        </p>
        <p style={{marginTop:30,fontSize:12}}>
          © 2025 IL Bridge Blue World S.L. · CIF B24909517 · hablamos247.com · Todos los derechos reservados.
        </p>
      </footer>
      {/* ── MOBILE CTA FIJO ── */}
      <div className="mobile-bar">
        <a href="https://buy.stripe.com/fZu14p5DX9JE2wCf7CcEw01">Activar cuenta profesional</a>
      </div>
    </>
  )
}
