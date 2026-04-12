import Head from 'next/head'
import Script from 'next/script'
import { useEffect, useState } from 'react'

export default function Reservar() {
  const [submitted, setSubmitted] = useState(false)

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

  const handleSubmit = async (event) => {
    event.preventDefault()
    const fd = new FormData(event.target)
    try {
      await fetch('/api/brevo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: 'reserva',
          nombre: fd.get('nombre'),
          telefono: fd.get('telefono'),
          email: fd.get('email'),
          servicio: fd.get('servicio'),
          fecha: fd.get('fecha'),
          hora: fd.get('hora'),
          modalidad: fd.get('modalidad'),
          direccion: fd.get('direccion'),
          notas: fd.get('notas'),
        }),
      })
    } catch (e) {
      console.error('Brevo submit error:', e)
    }
    setSubmitted(true)
  }

  return (
    <>
      <Head>
        <title>Desert Call · Reservar Servicio</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap" rel="stylesheet" />
      </Head>
      <Script src="https://js.stripe.com/v3/buy-button.js" />
      <style jsx>{`
        * { margin:0; padding:0; box-sizing:border-box; }

        body {
          font-family: 'Inter', sans-serif;
          background: #0B0E1F;
          color: #FFFFFF;
        }

        .fade-up {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .fade-up.visible { opacity:1; transform:translateY(0); }

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

        nav img { height: 60px; }

        .btn-gold {
          background: linear-gradient(135deg, #D4AF37, #F5D87A, #D4AF37);
          color: #0B0E1F;
          padding: 14px 30px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 900;
          text-decoration: none;
          display: inline-block;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(212,175,55,0.3);
          transition: transform 0.2s;
        }

        .btn-gold:hover { transform: translateY(-2px); }

        .hero {
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 80px 20px;
          background: radial-gradient(ellipse at top, #12183A 0%, #0B0E1F 70%);
        }

        .hero img.logo {
          width: 160px;
          margin-bottom: 30px;
          filter: drop-shadow(0 0 30px rgba(212,175,55,0.4));
        }

        .hero h1 {
          font-size: clamp(28px, 5vw, 58px);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 20px;
        }

        .hero h1 span { color: #D4AF37; }

        .hero p {
          font-size: 17px;
          color: rgba(255,255,255,0.7);
          max-width: 520px;
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

        .section {
          padding: 80px 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        h2 {
          font-size: clamp(24px, 4vw, 42px);
          font-weight: 900;
          margin-bottom: 16px;
          text-align: center;
        }

        h2 span { color: #D4AF37; }

        .section-sub {
          text-align: center;
          color: rgba(255,255,255,0.6);
          font-size: 16px;
          max-width: 540px;
          margin: 0 auto 50px auto;
          line-height: 1.7;
        }

        .catalog-grid {
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }

        .service-card {
          background: #12183A;
          border: 1px solid rgba(212,175,55,0.15);
          border-radius: 16px;
          padding: 30px;
          transition: border-color 0.3s, transform 0.3s;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .service-card:hover {
          border-color: #D4AF37;
          transform: translateY(-4px);
        }

        .service-card .icon { font-size: 32px; }

        .service-card h3 {
          font-size: 18px;
          font-weight: 700;
          color: #D4AF37;
        }

        .service-card p {
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          line-height: 1.6;
          flex: 1;
        }

        .price-tag {
          font-size: 22px;
          font-weight: 900;
          color: white;
        }

        .price-tag span {
          font-size: 14px;
          color: rgba(255,255,255,0.4);
          font-weight: 400;
        }

        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(212,175,55,0.3), transparent);
          margin: 0 40px;
        }

        .form-wrap {
          max-width: 680px;
          margin: 0 auto;
          background: #12183A;
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 20px;
          padding: 60px 50px;
        }

        .form-wrap h3 {
          font-size: 24px;
          font-weight: 900;
          margin-bottom: 8px;
          text-align: center;
        }

        .form-wrap h3 span { color: #D4AF37; }

        .form-sub {
          text-align: center;
          color: rgba(255,255,255,0.5);
          font-size: 14px;
          margin-bottom: 36px;
        }

        .form-group { margin-bottom: 18px; }

        .form-group label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #D4AF37;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          background: #0B0E1F;
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 8px;
          padding: 13px 16px;
          color: white;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          outline: none;
          transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: #D4AF37;
        }

        .form-group select option { background: #0B0E1F; }
        .form-group textarea { height: 90px; resize: vertical; }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .form-check {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-top: 10px;
        }

        .form-check input[type="checkbox"] {
          width: 18px;
          height: 18px;
          margin-top: 2px;
          accent-color: #D4AF37;
          flex-shrink: 0;
        }

        .form-check label {
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          line-height: 1.5;
        }

        .form-check label a { color: #D4AF37; text-decoration: none; }

        .submit-wrap { margin-top: 28px; text-align: center; }
        .submit-wrap button { width: 100%; font-size: 17px; padding: 18px; }

        .stripe-wrap {
          margin-top: 30px;
          text-align: center;
          padding-top: 24px;
          border-top: 1px solid rgba(212,175,55,0.1);
        }

        .stripe-wrap p {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 16px;
        }

        .success-msg {
          display: none;
          text-align: center;
          padding: 40px;
        }

        .success-msg .check { font-size: 60px; margin-bottom: 20px; }

        .success-msg h3 {
          font-size: 24px;
          font-weight: 900;
          color: #D4AF37;
          margin-bottom: 12px;
        }

        .success-msg p {
          color: rgba(255,255,255,0.6);
          font-size: 15px;
          line-height: 1.7;
        }

        .cta-band {
          background: linear-gradient(135deg, #12183A, #0B0E1F);
          border-top: 1px solid rgba(212,175,55,0.2);
          border-bottom: 1px solid rgba(212,175,55,0.2);
          padding: 80px 40px;
          text-align: center;
        }

        footer {
          background: #07091A;
          padding: 60px 40px;
          text-align: center;
          border-top: 1px solid rgba(212,175,55,0.15);
        }

        footer img { height: 80px; margin-bottom: 20px; opacity: 0.9; }
        footer p { color: rgba(255,255,255,0.5); font-size: 14px; line-height: 2; }
        footer a { color: #D4AF37; text-decoration: none; }

        .mobile-bar { display: none; }

        @media (max-width: 768px) {
          .form-row { grid-template-columns: 1fr; }
          .form-wrap { padding: 36px 20px; }
          nav { padding: 16px 20px; }
          .nav-links { display: none !important; }

          .mobile-bar {
            display: block;
            position: fixed;
            bottom: 0; left: 0; right: 0;
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
        }
      `}</style>

      <nav>
        <img src="YOUR_LOGO_URL" alt="Desert Call" />
        <div className="nav-links" style={{display:'flex',gap:30}}>
          <a href="#servicios" style={{color:'#D4AF37',textDecoration:'none',fontWeight:700,fontSize:14}}>Servicios</a>
          <a href="#reservar" style={{color:'#D4AF37',textDecoration:'none',fontWeight:700,fontSize:14}}>Reservar</a>
        </div>
        <a className="btn-gold" href="#reservar">Reservar ahora</a>
      </nav>

      <div className="hero fade-up">
        <img className="logo" src="YOUR_LOGO_URL" alt="Desert Call" />
        <h1>Belleza y bienestar<br /><span>donde estés. Cuando lo necesitas.</span></h1>
        <p>Profesionales verificados en tu hotel, domicilio o centro. Disponible de 05:00 a 01:00. Pago seguro y financiación Klarna.</p>
        <div className="badge-row">
          <span className="badge">Hotel · Domicilio · Centro</span>
          <span className="badge">05:00–01:00</span>
          <span className="badge">Pago seguro Stripe</span>
          <span className="badge">Financiación Klarna</span>
          <span className="badge">Profesionales verificados</span>
        </div>
        <a className="btn-gold" href="#reservar">Reservar ahora</a>
      </div>

      <div className="divider" />

      <section id="servicios" className="section fade-up">
        <h2>Nuestros <span>Servicios</span></h2>
        <p className="section-sub">Elige el servicio que necesitas. Te asignamos el profesional disponible en tu zona.</p>

        <div className="catalog-grid">
          <div className="service-card">
            <div className="icon">💆</div>
            <h3>Masaje Relajante</h3>
            <p>Desconecta totalmente. Masaje terapéutico relajante en tu espacio.</p>
            <div className="price-tag">95€ <span>/ sesión</span></div>
          </div>
          <div className="service-card">
            <div className="icon">💇</div>
            <h3>Peluquería en domicilio</h3>
            <p>Corte, color y peinado. El profesional llega con todo el material.</p>
            <div className="price-tag">Desde 80€</div>
          </div>
          <div className="service-card">
            <div className="icon">💄</div>
            <h3>Maquillaje profesional</h3>
            <p>Para eventos, galas o simplemente para ti. Resultado de alto nivel.</p>
            <div className="price-tag">Desde 90€</div>
          </div>
          <div className="service-card">
            <div className="icon">💅</div>
            <h3>Manicura & Estética</h3>
            <p>Manicura de guante blanco. Tratamientos de belleza a domicilio.</p>
            <div className="price-tag">70€ <span>/ sesión</span></div>
          </div>
          <div className="service-card">
            <div className="icon">✈️</div>
            <h3>Jet-Lag Recovery</h3>
            <p>Ritual express de recuperación para viajeros. En tu hotel o domicilio.</p>
            <div className="price-tag">150€ <span>/ ritual</span></div>
          </div>
          <div className="service-card">
            <div className="icon">🌅</div>
            <h3>Pack Amanecer Impecable</h3>
            <p>Masaje + peluquería o maquillaje. Disponible 05:00–08:00.</p>
            <div className="price-tag">120€ <span>/ pack</span></div>
          </div>
        </div>
      </section>

      <div className="divider" />

      <section id="reservar" className="section fade-up">
        <h2>Hacer una <span>Reserva</span></h2>
        <p className="section-sub">Rellena el formulario. Te confirmamos disponibilidad en menos de 1 hora.</p>

        <div className="form-wrap">
          {submitted ? (
            <div className="success-msg" id="success-reserva">
              <div className="check">✅</div>
              <h3>Reserva recibida</h3>
              <p>Te confirmamos disponibilidad en menos de 1 hora por email y teléfono.<br /><br />
              ¿Necesitas confirmación urgente?<br />
              <a href="tel:+34614067291" style={{color:'#D4AF37',fontWeight:700}}>+34 614 067 291</a></p>
            </div>
          ) : (
            <div id="reserva-content">
              <h3>Solicitar <span>reserva</span></h3>
              <p className="form-sub">Confirmación en menos de 1 hora · Pago seguro · Profesional verificado</p>

              <form id="reserva-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre *</label>
                    <input type="text" name="nombre" placeholder="Tu nombre" required />
                  </div>
                  <div className="form-group">
                    <label>Teléfono *</label>
                    <input type="tel" name="telefono" placeholder="+34 600 000 000" required />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" name="email" placeholder="tu@email.com" required />
                </div>

                <div className="form-group">
                  <label>Servicio *</label>
                  <select name="servicio" defaultValue="" required>
                    <option value="" disabled>Seleccionar servicio</option>
                    <option>Masaje Relajante · 95€</option>
                    <option>Peluquería en domicilio · desde 80€</option>
                    <option>Maquillaje profesional · desde 90€</option>
                    <option>Manicura & Estética · 70€</option>
                    <option>Jet-Lag Recovery · 150€</option>
                    <option>Pack Amanecer Impecable · 120€</option>
                    <option>Otro / Consultar</option>
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha *</label>
                    <input type="date" name="fecha" required />
                  </div>
                  <div className="form-group">
                    <label>Hora preferida *</label>
                    <input type="time" name="hora" required />
                  </div>
                </div>

                <div className="form-group">
                  <label>Modalidad *</label>
                  <select name="modalidad" defaultValue="" required>
                    <option value="" disabled>Seleccionar</option>
                    <option>Domicilio</option>
                    <option>Hotel</option>
                    <option>Centro asociado</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Dirección o nombre del hotel</label>
                  <input type="text" name="direccion" placeholder="Dirección completa o nombre del hotel" />
                </div>

                <div className="form-group">
                  <label>Notas adicionales</label>
                  <textarea name="notas" placeholder="Preferencias, alergias u observaciones..."></textarea>
                </div>

                <div className="form-check">
                  <input type="checkbox" id="legal-res" required />
                  <label htmlFor="legal-res">Acepto la <a href="#">política de privacidad</a> y las condiciones del servicio.</label>
                </div>

                <div className="submit-wrap">
                  <button type="submit" className="btn-gold">Solicitar reserva</button>
                </div>

                <div className="stripe-wrap">
                  <p>Pago seguro al confirmar la reserva</p>
                  <stripe-buy-button
                    buy-button-id="buy_btn_1TAU1jPmA9vRXLOeamYcRwBg"
                    publishable-key="pk_live_51T3RPCPmA9vRXLOegJ40fxehxJrEYd0n9y4rLi4HlRJVnJB5OlxGfXFBnZQZDZk8n7QyAa5kM4KVU3HuiqpVgFgh008lMoWFfV">
                  </stripe-buy-button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>

      <div className="divider" />

      <div className="cta-band fade-up">
        <h2>¿Prefieres reservar por teléfono?</h2>
        <p style={{color:'rgba(255,255,255,0.6)',margin:'16px auto 40px auto',maxWidth:480,fontSize:17}}>Llámanos y gestionamos tu reserva en minutos.</p>
        <a className="btn-gold" href="tel:+34614067291">+34 614 067 291</a>
      </div>

      <footer>
        <img src="YOUR_LOGO_URL" alt="Desert Call" />
        <p>
          <a href="mailto:contacto@hablamos247.es">contacto@hablamos247.es</a><br />
          <a href="tel:+34614067291">+34 614 067 291</a><br />
          Las Palmas de Gran Canaria
        </p>
        <p style={{marginTop:30,fontSize:12}}>© 2025 IL Bridge Blue World S.L. · CIF B24909517 · hablamos247.com</p>
      </footer>

      <div className="mobile-bar">
        <a href="#reservar">Reservar ahora</a>
      </div>
    </>
  )
}