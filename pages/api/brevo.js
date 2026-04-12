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

  if (tipo === 'profesional') {
    attributes.ESPECIALIDAD = rest.especialidad || ''
    attributes.CIUDAD = rest.ciudad || ''
    attributes.EXPERIENCIA = rest.experiencia || ''
    attributes.DISPONIBILIDAD = rest.disponibilidad || ''
    attributes.MODALIDAD = rest.modalidad || ''
    attributes.MENSAJE = rest.mensaje || ''
  } else if (tipo === 'reserva') {
    attributes.SERVICIO = rest.servicio || ''
    attributes.FECHA_RESERVA = rest.fecha || ''
    attributes.HORA_RESERVA = rest.hora || ''
    attributes.MODALIDAD = rest.modalidad || ''
    attributes.DIRECCION = rest.direccion || ''
    attributes.NOTAS = rest.notas || ''
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        attributes,
        updateEnabled: true,
      }),
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      console.error('Brevo API error:', errData)
      return res.status(500).json({ error: 'Error al registrar contacto' })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Brevo handler error:', err)
    return res.status(500).json({ error: 'Error interno' })
  }
}
