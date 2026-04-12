import Head from 'next/head'
import { useEffect, useState } from 'react'

export default function Profesionales() {
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
          tipo: 'profesional',
          nombre: fd.get('nombre'),
          email: fd.get('email'),
          telefono: fd.get('telefono'),
          especialidad: fd.get('especialidad'),
          ciudad: fd.get('ciudad'),
          experiencia: fd.get('experiencia'),
          disponibilidad: fd.get('disponibilidad'),
          modalidad: fd.get('modalidad'),
          mensaje: fd.get('mensaje'),
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
        <title>Desert Call · Registro Profesionales</title>
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
          min-height: 70vh;
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
          font-size: clamp(30px, 5vw, 60px);
          font-weight: 900;
          line-height: 1.1;
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

        .form-group textarea { height: 100px; resize: vertical; }

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
          display: none;
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
        <img src="YOUR_LOGO_URL" alt="Desert Call" />
        <div className="nav-links" style={{display:'flex',gap:30}}>
          <a href="#beneficios">Beneficios</a>
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#registro">Registro</a>
        </div>
        <a className="btn-gold" href="#registro">Unirme ahora</a>
      </nav>

      <div className="hero fade-up">
        <img className="logo" src="YOUR_LOGO_URL" alt="Desert Call" />
        <h1>Más clientes.<br /><span>Sin cuotas. Sin riesgos.</span></h1>
        <p>Únete a Desert Call y empieza a recibir reservas en horario ampliado. Solo comisión por servicio realizado.</p>
        <div className="badge-row">
          <span className="badge">Sin cuotas mensuales</span>
          <span className="badge">Solo comisión</span>
          <span className="badge">Agenda automática</span>
          <span className="badge">Pagos Stripe</span>
          <span className="badge">05:00–01:00</span>
        </div>
        <a className="btn-gold" href="#registro">Activar cuenta profesional</a>
      </div>

      <div className="divider" />

      <section id="beneficios" className="section fade-up">
        <h2>Qué obtienes como <span>profesional Desert Call</span></h2>
        <p className="section-sub">Una plataforma que trabaja por ti mientras tú te dedicas a tu oficio.</p>
        <div className="grid">
          <div className="card">
            <div className="card-icon">📲</div>
            <h3>Captación automática</h3>
            <p>Recibe clientes sin invertir en publicidad ni redes sociales.</p>
          </div>
          <div className="card">
            <div className="card-icon">📅</div>
            <h3>Agenda gestionada</h3>
            <p>Citas organizadas automáticamente. Sin llamadas ni WhatsApps.</p>
          </div>
          <div className="card">
            <div className="card-icon">💳</div>
            <h3>Cobro automático</h3>
            <p>Stripe procesa el pago. Recibes tu ingreso al finalizar el servicio.</p>
          </div>
          <div className="card">
            <div className="card-icon">🕐</div>
            <h3>Horario ampliado</h3>
            <p>Trabaja en franjas de alta demanda que otros no cubren.</p>
          </div>
          <div className="card">
            <div className="card-icon">📍</div>
            <h3>Tú eliges dónde</h3>
            <p>Hotel, domicilio o centro. Selecciona tu radio y disponibilidad.</p>
          </div>
          <div className="card">
            <div className="card-icon">📈</div>
            <h3>Más facturación real</h3>
            <p>Convierte horas vacías en ingresos. Sin inversión inicial.</p>
          </div>
        </div>
      </section>

      <div className="divider" />

      <section id="como-funciona" className="section fade-up">
        <h2>Cómo <span>funciona</span></h2>
        <p className="section-sub">Proceso simple. Activación inmediata.</p>
        <div className="grid">
          <div className="card" style={{textAlign:'center'}}>
            <div style={{width:48,height:48,background:'linear-gradient(135deg,#D4AF37,#F5D87A)',color:'#0B0E1F',fontWeight:900,fontSize:20,borderRadius:50,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px auto'}}>1</div>
            <p>Te registras en Desert Call</p>
          </div>
          <div className="card" style={{textAlign:'center'}}>
            <div style={{width:48,height:48,background:'linear-gradient(135deg,#D4AF37,#F5D87A)',color:'#0B0E1F',fontWeight:900,fontSize:20,borderRadius:50,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px auto'}}>2</div>
            <p>Verificamos tu perfil KYC</p>
          </div>
          <div className="card" style={{textAlign:'center'}}>
            <div style={{width:48,height:48,background:'linear-gradient(135deg,#D4AF37,#F5D87A)',color:'#0B0E1F',fontWeight:900,fontSize:20,borderRadius:50,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px auto'}}>3</div>
            <p>Empiezas a recibir reservas</p>
          </div>
          <div className="card" style={{textAlign:'center'}}>
            <div style={{width:48,height:48,background:'linear-gradient(135deg,#D4AF37,#F5D87A)',color:'#0B0E1F',fontWeight:900,fontSize:20,borderRadius:50,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px auto'}}>4</div>
            <p>Realizas el servicio</p>
          </div>
          <div className="card" style={{textAlign:'center'}}>
            <div style={{width:48,height:48,background:'linear-gradient(135deg,#D4AF37,#F5D87A)',color:'#0B0E1F',fontWeight:900,fontSize:20,borderRadius:50,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px auto'}}>5</div>
            <p>Ingreso automático vía Stripe</p>
          </div>
        </div>
      </section>

      <div className="divider" />

      <section id="registro" className="section fade-up">
        <h2>Alta <span>Profesional</span></h2>
        <p className="section-sub">Rellena el formulario. Te contactamos en menos de 24 horas.</p>

        <div className="form-wrap">
          {submitted ? (
            <div className="success-msg" id="success-pro">
              <div className="check">✅</div>
              <h3>Solicitud recibida</h3>
              <p>Te contactamos en menos de 24 horas para completar tu verificación KYC y activar tu cuenta.<br /><br />
              ¿Tienes urgencia? Llámanos:<br />
              <a href="tel:+34614067291" style={{color:'#D4AF37',fontWeight:700}}>+34 614 067 291</a></p>
            </div>
          ) : (
            <div id="form-content">
              <h3>Registro <span>Desert Call</span></h3>
              <p className="form-sub">Sin compromiso · Sin cuotas · Activación inmediata</p>

              <form id="pro-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre completo *</label>
                    <input type="text" name="nombre" placeholder="Nombre y apellidos" required />
                  </div>
                  <div className="form-group">
                    <label>Especialidad *</label>
                    <select name="especialidad" defaultValue="" required>
                      <option value="" disabled>Seleccionar</option>
                      <option>Peluquería</option>
                      <option>Maquillaje</option>
                      <option>Estética & Manicura</option>
                      <option>Masajes & Wellness</option>
                      <option>Varias especialidades</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" name="email" placeholder="tu@email.com" required />
                  </div>
                  <div className="form-group">
                    <label>Teléfono *</label>
                    <input type="tel" name="telefono" placeholder="+34 600 000 000" required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Ciudad *</label>
                    <input type="text" name="ciudad" placeholder="Las Palmas de Gran Canaria" required />
                  </div>
                  <div className="form-group">
                    <label>Años de experiencia *</label>
                    <select name="experiencia" defaultValue="" required>
                      <option value="" disabled>Seleccionar</option>
                      <option>Menos de 1 año</option>
                      <option>1–3 años</option>
                      <option>3–5 años</option>
                      <option>Más de 5 años</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Disponibilidad horaria *</label>
                  <select name="disponibilidad" defaultValue="" required>
                    <option value="" disabled>Seleccionar franja principal</option>
                    <option>Madrugada 05:00–09:00</option>
                    <option>Mañana 09:00–14:00</option>
                    <option>Tarde 14:00–20:00</option>
                    <option>Noche 20:00–01:00</option>
                    <option>Disponibilidad total</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Modalidad de trabajo *</label>
                  <select name="modalidad" defaultValue="" required>
                    <option value="" disabled>Seleccionar</option>
                    <option>Domicilio del cliente</option>
                    <option>Hotel</option>
                    <option>Mi propio centro</option>
                    <option>Todas las modalidades</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Cuéntanos algo sobre ti</label>
                  <textarea name="mensaje" placeholder="Experiencia, certificaciones, servicios que ofreces..."></textarea>
                </div>

                <div className="form-check">
                  <input type="checkbox" id="legal-pro" required />
                  <label htmlFor="legal-pro">Acepto la <a href="#">política de privacidad</a> y el proceso de verificación KYC.</label>
                </div>

                <div className="submit-wrap">
                  <button type="submit" className="btn-gold">Enviar solicitud de alta</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>

      <div className="divider" />

      <div className="cta-band fade-up">
        <img src="YOUR_LOGO_URL" alt="Desert Call" style={{height:90,marginBottom:30,filter:'drop-shadow(0 0 20px rgba(212,175,55,0.4))'}} />
        <h2>¿Tienes dudas antes de registrarte?</h2>
        <p style={{color:'rgba(255,255,255,0.6)',margin:'16px auto 40px auto',maxWidth:500,fontSize:17}}>Escríbenos o llámanos. Te respondemos en minutos.</p>
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
        <a href="#registro">Activar cuenta profesional</a>
      </div>
    </>
  )
}