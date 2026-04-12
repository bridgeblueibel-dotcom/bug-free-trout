// List IDs in ClickUp
const CLICKUP_LIST_RESERVAS      = '901522622834' // 📥 ENTRADA — Nuevas Solicitudes del Día (Desert Call)
const CLICKUP_LIST_PROFESIONALES = '901522587806' // 🔴 01 — NUEVO PROFESIONAL (CRM Profesionales)

async function createClickUpTask(listId, name, description) {
  if (!process.env.CLICKUP_API_TOKEN) return
  try {
    await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
      method: 'POST',
      headers: {
        Authorization: process.env.CLICKUP_API_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description, priority: 2 }), // priority 2 = high
    })
  } catch (err) {
    console.error('ClickUp task error:', err)
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, nombre, telefono, tipo, ...rest } = req.body

  if (!email) {
    return res.status(400).json({ error: 'Email requerido' })
  }

  const attributes = {
    FIRSTNAME: nombre || '',
    SMS: telefono || '',
    TIPO_CONTACTO: tipo || '',
  }

  let clickupListId = null
  let clickupTitle = ''
  let clickupDesc = ''

  if (tipo === 'profesional') {
    attributes.ESPECIALIDAD   = rest.especialidad || ''
    attributes.CIUDAD         = rest.ciudad || ''
    attributes.EXPERIENCIA    = rest.experiencia || ''
    attributes.DISPONIBILIDAD = rest.disponibilidad || ''
    attributes.MODALIDAD      = rest.modalidad || ''
    attributes.MENSAJE        = rest.mensaje || ''

    clickupListId = CLICKUP_LIST_PROFESIONALES
    clickupTitle  = `👩‍💼 Nueva profesional: ${nombre || email}`
    clickupDesc   = [
      `**Email:** ${email}`,
      `**Teléfono:** ${telefono || '—'}`,
      `**Especialidad:** ${rest.especialidad || '—'}`,
      `**Ciudad:** ${rest.ciudad || '—'}`,
      `**Experiencia:** ${rest.experiencia || '—'}`,
      `**Disponibilidad:** ${rest.disponibilidad || '—'}`,
      `**Modalidad:** ${rest.modalidad || '—'}`,
      `**Mensaje:** ${rest.mensaje || '—'}`,
    ].join('\n')

  } else if (tipo === 'reserva') {
    attributes.SERVICIO       = rest.servicio || ''
    attributes.FECHA_RESERVA  = rest.fecha || ''
    attributes.HORA_RESERVA   = rest.hora || ''
    attributes.MODALIDAD      = rest.modalidad || ''
    attributes.DIRECCION      = rest.direccion || ''
    attributes.NOTAS          = rest.notas || ''

    clickupListId = CLICKUP_LIST_RESERVAS
    clickupTitle  = `📅 Reserva: ${rest.servicio || 'Servicio'} — ${nombre || email}`
    clickupDesc   = [
      `**Email:** ${email}`,
      `**Teléfono:** ${telefono || '—'}`,
      `**Servicio:** ${rest.servicio || '—'}`,
      `**Fecha:** ${rest.fecha || '—'} a las ${rest.hora || '—'}`,
      `**Modalidad:** ${rest.modalidad || '—'}`,
      `**Dirección:** ${rest.direccion || '—'}`,
      `**Notas:** ${rest.notas || '—'}`,
    ].join('\n')
  }

  // ── Brevo ──────────────────────────────────────────────────────
  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({ email, attributes, updateEnabled: true }),
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      console.error('Brevo API error:', errData)
      return res.status(500).json({ error: 'Error al registrar contacto' })
    }
  } catch (err) {
    console.error('Brevo handler error:', err)
    return res.status(500).json({ error: 'Error interno' })
  }

  // ── ClickUp ────────────────────────────────────────────────────
  if (clickupListId) {
    await createClickUpTask(clickupListId, clickupTitle, clickupDesc)
  }

  return res.status(200).json({ success: true })
}
