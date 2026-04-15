// List IDs in ClickUp
const CLICKUP_LIST_RESERVAS      = '901522622834' // 📥 ENTRADA — Nuevas Solicitudes del Día (Desert Call)
const CLICKUP_LIST_PROFESIONALES = '901522587806' // 🔴 01 — NUEVO PROFESIONAL (CRM Profesionales)
const CLICKUP_LIST_CONTACTO      = '901522587814' // 📥 ENTRADA — Nuevas Solicitudes del Día (Bridge Blue)
const CLICKUP_LIST_TELEFONISTAS  = '901522587582' // 🎙️ CRM Voces Amigas — Captación & Onboarding

const PIPEDRIVE_BASE = 'https://api.pipedrive.com/v1'

async function createClickUpTask(listId, name, description) {
  if (!process.env.CLICKUP_API_TOKEN) return
  try {
    await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
      method: 'POST',
      headers: {
        Authorization: process.env.CLICKUP_API_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description, priority: 2 }),
    })
  } catch (err) {
    console.error('ClickUp task error:', err)
  }
}

async function pipedrivePerson(nombre, email, telefono) {
  const token = process.env.PIPEDRIVE_API_TOKEN
  if (!token) return null
  try {
    const r = await fetch(`${PIPEDRIVE_BASE}/persons?api_token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: nombre || email,
        email: [{ value: email, primary: true }],
        phone: telefono ? [{ value: telefono, primary: true }] : undefined,
      }),
    })
    const data = await r.json()
    return data?.data?.id || null
  } catch (err) {
    console.error('Pipedrive person error:', err)
    return null
  }
}

async function pipedriveDeal(title, personId, note) {
  const token = process.env.PIPEDRIVE_API_TOKEN
  if (!token) return
  try {
    const r = await fetch(`${PIPEDRIVE_BASE}/deals?api_token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        person_id: personId,
        status: 'open',
      }),
    })
    const deal = await r.json()
    // Add note with full details
    if (deal?.data?.id && note) {
      await fetch(`${PIPEDRIVE_BASE}/notes?api_token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: note, deal_id: deal.data.id }),
      })
    }
  } catch (err) {
    console.error('Pipedrive deal error:', err)
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
  let clickupTitle  = ''
  let clickupDesc   = ''
  let pipedriveNote = ''
  let pipedriveDealTitle = ''

  if (tipo === 'profesional') {
    attributes.ESPECIALIDAD   = rest.especialidad || ''
    attributes.CIUDAD         = rest.ciudad || ''
    attributes.EXPERIENCIA    = rest.experiencia || ''
    attributes.DISPONIBILIDAD = rest.disponibilidad || ''
    attributes.MODALIDAD      = rest.modalidad || ''
    attributes.MENSAJE        = rest.mensaje || ''

    clickupListId  = CLICKUP_LIST_PROFESIONALES
    clickupTitle   = `👩‍💼 Nueva profesional: ${nombre || email}`
    clickupDesc    = [
      `Email: ${email}`,
      `Teléfono: ${telefono || '—'}`,
      `Especialidad: ${rest.especialidad || '—'}`,
      `Ciudad: ${rest.ciudad || '—'}`,
      `Experiencia: ${rest.experiencia || '—'}`,
      `Disponibilidad: ${rest.disponibilidad || '—'}`,
      `Modalidad: ${rest.modalidad || '—'}`,
      `Mensaje: ${rest.mensaje || '—'}`,
    ].join('\n')

    pipedriveNote      = clickupDesc
    pipedriveDealTitle = `Profesional: ${nombre || email} — ${rest.especialidad || 'Sin especialidad'}`

  } else if (tipo === 'reserva') {
    attributes.SERVICIO      = rest.servicio || ''
    attributes.FECHA_RESERVA = rest.fecha || ''
    attributes.HORA_RESERVA  = rest.hora || ''
    attributes.MODALIDAD     = rest.modalidad || ''
    attributes.DIRECCION     = rest.direccion || ''
    attributes.NOTAS         = rest.notas || ''

    clickupListId  = CLICKUP_LIST_RESERVAS
    clickupTitle   = `📅 Reserva: ${rest.servicio || 'Servicio'} — ${nombre || email}`
    clickupDesc    = [
      `Email: ${email}`,
      `Teléfono: ${telefono || '—'}`,
      `Servicio: ${rest.servicio || '—'}`,
      `Fecha: ${rest.fecha || '—'} a las ${rest.hora || '—'}`,
      `Modalidad: ${rest.modalidad || '—'}`,
      `Dirección: ${rest.direccion || '—'}`,
      `Notas: ${rest.notas || '—'}`,
    ].join('\n')

    pipedriveNote      = clickupDesc
    pipedriveDealTitle = `Reserva: ${rest.servicio || 'Servicio'} — ${rest.fecha || ''} ${rest.hora || ''}`

  } else if (tipo === 'contacto') {
    attributes.MENSAJE = rest.mensaje || ''

    clickupListId  = CLICKUP_LIST_CONTACTO
    clickupTitle   = `✉️ Contacto: ${nombre || email}`
    clickupDesc    = [
      `Email: ${email}`,
      `Teléfono: ${telefono || '—'}`,
      `Mensaje: ${rest.mensaje || '—'}`,
    ].join('\n')

    pipedriveNote      = clickupDesc
    pipedriveDealTitle = `Contacto: ${nombre || email}`

  } else if (tipo === 'telefonista') {
    attributes.DISPONIBILIDAD = rest.disponibilidad || ''
    attributes.MENSAJE        = rest.mensaje || ''

    clickupListId  = CLICKUP_LIST_TELEFONISTAS
    clickupTitle   = `🎙️ Nueva Voz Amiga: ${nombre || email}`
    clickupDesc    = [
      `Email: ${email}`,
      `Teléfono: ${telefono || '—'}`,
      `Disponibilidad: ${rest.disponibilidad || '—'}`,
      `Por qué quiere unirse: ${rest.mensaje || '—'}`,
    ].join('\n')

    pipedriveNote      = clickupDesc
    pipedriveDealTitle = `Voz Amiga: ${nombre || email}`
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

  // ── ClickUp + Pipedrive (en paralelo) ─────────────────────────
  const personId = await pipedrivePerson(nombre, email, telefono)

  await Promise.all([
    clickupListId
      ? createClickUpTask(clickupListId, clickupTitle, clickupDesc)
      : Promise.resolve(),
    personId && pipedriveDealTitle
      ? pipedriveDeal(pipedriveDealTitle, personId, pipedriveNote)
      : Promise.resolve(),
  ])

  return res.status(200).json({ success: true })
}
