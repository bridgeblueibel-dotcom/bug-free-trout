import Head from 'next/head'
import { useEffect, useState } from 'react'

export default function Telefonistas() {
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
          tipo: 'telefonista',
          nombre: fd.get('nombre'),
          email: fd.get('email'),
          telefono: fd.get('telefono'),
          disponibilidad: fd.get('disponibilidad'),
          mensaje: fd.get('mensaje'),
        }),
      })
    } catch (e) {
      console.error('Brevo submit error:', e)
    }
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', { send_to: 'AW-18059698700' })
      window.gtag('event', 'sign_up', { method: 'telefonista_form' })
    }
    setSubmitted(true)
  }

  return (
    <>
      <Head>
        <title>Desert Call · Sé Voz Amiga</title>
        <meta name="description" content="Únete a Desert Call como Voz Amiga. Gana 4,50€ por sesión desde casa, con tu propio horario. Acompañamiento telefónico humano." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://online.hablamos247.com/telefonistas" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap" rel="stylesheet" />
      </Head>

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
        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }

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

        nav a {
          color: #D4AF37;
          text-decoration: none;
          font-weight: 700;
          font-size: 14px;
        }

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
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .btn-gold:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(212,175,55,0.5);
        }

        .hero {
          min-height: 75vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 80px 20px;
          background: radial-gradient(ellipse at top, #12183A 0%, #0B0E1F 70%);
        }

        .hero-label {
          font-size: 13px;
          font-weight: 700;
          color: #D4AF37;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .hero h1 {
          font-size: clamp(36px, 6vw, 72px);
          font-weight: 900;
          line-height: 1.05;
          margin-bottom: 20px;
        }

        .hero h1 span { color: #D4AF37; }

        .hero p {
          font-size: 18px;
          color: rgba(255,255,255,0.7);
          max-width: 560px;
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
          padding: 100px 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        h2 {
          font-size: clamp(26px, 4vw, 44px);
          font-weight: 900;
          margin-bottom: 16px;
          text-align: center;
        }

        h2 span { color: #D4AF37; }

        .section-sub {
          text-align: center;
          color: rgba(255,255,255,0.6);
          font-size: 16px;
          max-width: 560px;
          margin: 0 auto 60px auto;
          line-height: 1.7;
        }

        .grid {
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        }

        .card {
          background: #12183A;
          border: 1px solid rgba(212,175,55,0.15);
          border-radius: 16px;
          padding: 30px;
          transition: border-color 0.3s, transform 0.3s;
        }

        .card:hover {
          border-color: #D4AF37;
          transform: translateY(-4px);
        }

        .card-icon { font-size: 30px; margin-bottom: 14px; }

        .card h3 {
          font-size: 17px;
          font-weight: 700;
          margin-bottom: 8px;
          color: #D4AF37;
        }

        .card p {
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          line-height: 1.6;
        }

        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(212,175,55,0.3), transparent);
          margin: 0 40px;
        }

        .earnings-table {
          width: 100%;
          max-width: 600px;
          margin: 0 auto 60px auto;
          border-collapse: collapse;
          background: #12183A;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(212,175,55,0.2);
        }

        .earnings-table thead {
          background: linear-gradient(135deg, #D4AF37, #F5D87A);
        }

        .earnings-table thead th {
          color: #0B0E1F;
          font-weight: 900;
          padding: 16px 24px;
          text-align: left;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .earnings-table tbody tr {
          border-top: 1px solid rgba(212,175,55,0.1);
          transition: background 0.2s;
        }

        .earnings-table tbody tr:hover {
          background: rgba(212,175,55,0.05);
        }

        .earnings-table tbody td {
          padding: 18px 24px;
          font-size: 15px;
          color: rgba(255,255,255,0.85);
        }

        .earnings-table tbody td:last-child {
          color: #D4AF37;
          font-weight: 900;
          font-size: 17px;
        }

        .quote-block {
          max-width: 700px;
          margin: 0 auto 60px auto;
          background: linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.03));
          border: 1px solid rgba(212,175,55,0.25);
          border-radius: 16px;
          padding: 40px;
          text-align: center;
        }

        .quote-block p {
          font-size: 20px;
          font-style: italic;
          color: rgba(255,255,255,0.85);
          line-height: 1.7;
          margin-bottom: 16px;
        }

        .quote-block span {
          font-size: 13px;
          color: #D4AF37;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .form-wrap {
          max-width: 700px;
          margin: 0 auto;
          background: #12183A;
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 20px;
          padding: 60px 50px;
        }

        .form-wrap h3 {
          font-size: 26px;
          font-weight: 900;
          margin-bottom: 8px;
          text-align: center;
        }

        .form-wrap h3 span { color: #D4AF37; }

        .form-sub {
          text-align: center;
          color: rgba(255,255,255,0.5);
          font-size: 14px;
          margin-bottom: 40px;
        }

        .form-group { margin-bottom: 20px; }

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
          padding: 14px 16px;
          color: white;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          transition: border-color 0.3s;
          outline: none;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: #D4AF37;
        }

        .form-group select option { background: #0B0E1F; }

        .form-group textarea { height: 120px; resize: vertical; }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
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

        .submit-wrap { margin-top: 30px; text-align: center; }
        .submit-wrap button { width: 100%; font-size: 17px; padding: 18px; }

        .success-msg {
          text-align: center;
          padding: 40px;
        }

        .success-msg .check { font-size: 60px; margin-bottom: 20px; }

        .success-msg h3 {
          font-size: 26px;
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
          padding: 100px 40px;
          text-align: center;
        }

        footer {
          background: #07091A;
          padding: 60px 40px;
          text-align: center;
          border-top: 1px solid rgba(212,175,55,0.15);
        }

        footer img { height: 80px; margin-bottom: 20px; opacity: 0.9; }

        footer p {
          color: rgba(255,255,255,0.5);
          font-size: 14px;
          line-height: 2;
        }

        footer a { color: #D4AF37; text-decoration: none; }

        .mobile-bar { display: none; }

        @media (max-width: 768px) {
          .form-row { grid-template-columns: 1fr; }
          .form-wrap { padding: 40px 24px; }
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
        <img src="/logo-desert-call.png" alt="Desert Call" />
        <div className="nav-links" style={{display:'flex',gap:30}}>
          <a href="#por-que">Por qué</a>
          <a href="#ganas">Cuánto ganas</a>
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#registro">Apuntarme</a>
        </div>
        <a className="btn-gold" href="#registro">Quiero ser Voz Amiga</a>
      </nav>

      <div className="hero fade-up">
        <p className="hero-label">Desert Call · Voces Amigas</p>
        <h1>¿Sabes<br /><span>escuchar?</span></h1>
        <p>Conviértete en Voz Amiga. Acompaña por teléfono a personas que necesitan una voz humana. Desde casa. Con tu horario. Ganando dinero real.</p>
        <div className="badge-row">
          <span className="badge">4,50 € por sesión</span>
          <span className="badge">Desde casa</span>
          <span className="badge">Tú pones el horario</span>
          <span className="badge">Pagos Stripe</span>
          <span className="badge">Sin cuotas</span>
        </div>
        <a className="btn-gold" href="#registro">Quiero ser Voz Amiga</a>
      </div>

      <div className="divider" />

      <section id="por-que" className="section fade-up">
        <h2>Por qué <span>ser Voz Amiga</span></h2>
        <p className="section-sub">Un trabajo con impacto real. Tú ayudas. Tú ganas. Sin salir de casa.</p>
        <div className="grid">
          <div className="card">
            <div className="card-icon">🏠</div>
            <h3>100% desde casa</h3>
            <p>Sin desplazamientos. Solo necesitas tu teléfono y las ganas de escuchar.</p>
          </div>
          <div className="card">
            <div className="card-icon">🕐</div>
            <h3>Tú decides cuándo</h3>
            <p>Marcas tu disponibilidad. Solo recibes llamadas en los horarios que tú eliges.</p>
          </div>
          <div className="card">
            <div className="card-icon">💛</div>
            <h3>Impacto humano real</h3>
            <p>Cada sesión cambia el día de alguien. No es trabajo vacío — es conexión verdadera.</p>
          </div>
          <div className="card">
            <div className="card-icon">💳</div>
            <h3>Cobro automático</h3>
            <p>Stripe procesa cada sesión. Tus ganancias llegan sin retrasos ni papeleo.</p>
          </div>
          <div className="card">
            <div className="card-icon">📈</div>
            <h3>Crece a tu ritmo</h3>
            <p>Cuantas más sesiones, más ganas. Sin techo. Sin jefe.</p>
          </div>
          <div className="card">
            <div className="card-icon">🔒</div>
            <h3>Plataforma segura</h3>
            <p>Nunca compartes tus datos personales con los clientes. Desert Call protege tu identidad.</p>
          </div>
        </div>
      </section>

      <div className="divider" />

      <section id="ganas" className="section fade-up">
        <h2>Cuánto <span>puedes ganar</span></h2>
        <p className="section-sub">4,50 € por sesión de 30 minutos. Así se acumula.</p>

        <table className="earnings-table">
          <thead>
            <tr>
              <th>Sesiones al mes</th>
              <th>Horas dedicadas</th>
              <th>Ingresos</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>10 sesiones</td>
              <td>~5 horas</td>
              <td>45 €</td>
            </tr>
            <tr>
              <td>40 sesiones</td>
              <td>~20 horas</td>
              <td>180 €</td>
            </tr>
            <tr>
              <td>80 sesiones</td>
              <td>~40 horas</td>
              <td>360 €</td>
            </tr>
          </tbody>
        </table>

        <div className="quote-block">
          <p>"No hace falta ser terapeuta. Hace falta ser humano, empático, y saber estar presente en una conversación."</p>
          <span>— Isabel Liria, fundadora de Desert Call</span>
        </div>
      </section>

      <div className="divider" />

      <section id="como-funciona" className="section fade-up">
        <h2>Cómo <span>funciona</span></h2>
        <p className="section-sub">Cuatro pasos y ya estás activa.</p>
        <div className="grid">
          <div className="card" style={{textAlign:'center'}}>
            <div style={{width:48,height:48,background:'linear-gradient(135deg,#D4AF37,#F5D87A)',color:'#0B0E1F',fontWeight:900,fontSize:20,borderRadius:50,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px auto'}}>1</div>
            <h3>Te apuntas</h3>
            <p>Rellenas el formulario. Te contactamos en 24 horas.</p>
          </div>
          <div className="card" style={{textAlign:'center'}}>
            <div style={{width:48,height:48,background:'linear-gradient(135deg,#D4AF37,#F5D87A)',color:'#0B0E1F',fontWeight:900,fontSize:20,borderRadius:50,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px auto'}}>2</div>
            <h3>Validamos tu perfil</h3>
            <p>Una breve entrevista para conocerte. Sin exámenes ni títulos.</p>
          </div>
          <div className="card" style={{textAlign:'center'}}>
            <div style={{width:48,height:48,background:'linear-gradient(135deg,#D4AF37,#F5D87A)',color:'#0B0E1F',fontWeight:900,fontSize:20,borderRadius:50,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px auto'}}>3</div>
            <h3>Marcas tu horario</h3>
            <p>Configuras cuándo estás disponible. Tú mandas.</p>
          </div>
          <div className="card" style={{textAlign:'center'}}>
            <div style={{width:48,height:48,background:'linear-gradient(135deg,#D4AF37,#F5D87A)',color:'#0B0E1F',fontWeight:900,fontSize:20,borderRadius:50,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px auto'}}>4</div>
            <h3>Recibes llamadas y cobras</h3>
            <p>4,50 € por cada sesión completada. Automático.</p>
          </div>
        </div>
      </section>

      <div className="divider" />

      <section id="registro" className="section fade-up">
        <h2>Apúntate como <span>Voz Amiga</span></h2>
        <p className="section-sub">Te contactamos en menos de 24 horas para empezar.</p>

        <div className="form-wrap">
          {submitted ? (
            <div className="success-msg">
              <div className="check">🎙️</div>
              <h3>¡Ya eres candidata a Voz Amiga!</h3>
              <p>
                Hemos recibido tu solicitud. Isabel o alguien del equipo te contactará en menos de 24 horas.<br /><br />
                ¿Tienes urgencia? Escríbenos:<br />
                <a href="mailto:isabel-liria@hablamos247.com" style={{color:'#D4AF37',fontWeight:700}}>isabel-liria@hablamos247.com</a>
                &nbsp;·&nbsp;
                <a href="tel:+34614067291" style={{color:'#D4AF37',fontWeight:700}}>614 067 291</a>
              </p>
            </div>
          ) : (
            <div>
              <h3>Solicitud <span>Voz Amiga</span></h3>
              <p className="form-sub">Sin compromiso · Sin cuotas · Desde casa</p>

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre completo *</label>
                    <input type="text" name="nombre" placeholder="Tu nombre y apellidos" required />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" name="email" placeholder="tu@email.com" required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Teléfono *</label>
                    <input type="tel" name="telefono" placeholder="+34 600 000 000" required />
                  </div>
                  <div className="form-group">
                    <label>Disponibilidad horaria *</label>
                    <select name="disponibilidad" defaultValue="" required>
                      <option value="" disabled>Seleccionar franja</option>
                      <option>Mañanas (09:00–14:00)</option>
                      <option>Tardes (14:00–20:00)</option>
                      <option>Noches (20:00–01:00)</option>
                      <option>Madrugada (00:00–08:00)</option>
                      <option>Disponibilidad flexible</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>¿Por qué quieres ser Voz Amiga? *</label>
                  <textarea
                    name="mensaje"
                    placeholder="Cuéntanos brevemente quién eres y qué te motiva a acompañar a otras personas por teléfono..."
                    required
                  />
                </div>

                <div className="form-check">
                  <input type="checkbox" id="legal-tel" required />
                  <label htmlFor="legal-tel">
                    Acepto la <a href="#">política de privacidad</a> y entiendo que mi candidatura será revisada por el equipo de Desert Call.
                  </label>
                </div>

                <div className="submit-wrap">
                  <button type="submit" className="btn-gold">Enviar solicitud</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>

      <div className="divider" />

      <div className="cta-band fade-up">
        <h2>¿Tienes dudas antes de apuntarte?</h2>
        <p style={{color:'rgba(255,255,255,0.6)',margin:'16px auto 40px auto',maxWidth:500,fontSize:17,lineHeight:1.7}}>
          Escríbenos. Te respondemos en minutos.
        </p>
        <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap'}}>
          <a className="btn-gold" href="tel:+34614067291">614 067 291</a>
          <a
            href="mailto:isabel-liria@hablamos247.com"
            style={{
              background:'transparent',
              border:'2px solid #D4AF37',
              color:'#D4AF37',
              padding:'14px 30px',
              borderRadius:8,
              fontSize:15,
              fontWeight:700,
              textDecoration:'none',
              display:'inline-block',
            }}
          >
            isabel-liria@hablamos247.com
          </a>
        </div>
      </div>

      <footer>
        <img src="/logo-desert-call.png" alt="Desert Call" />
        <p>
          <a href="mailto:isabel-liria@hablamos247.com">isabel-liria@hablamos247.com</a><br />
          <a href="tel:+34614067291">614 067 291</a><br />
          hablamos247.com
        </p>
        <p style={{marginTop:30,fontSize:12}}>© 2025 IL Bridge Blue World S.L. · CIF B24909517 · online.hablamos247.com/telefonistas</p>
      </footer>

      <div className="mobile-bar">
        <a href="#registro">Quiero ser Voz Amiga</a>
      </div>
    </>
  )
}
