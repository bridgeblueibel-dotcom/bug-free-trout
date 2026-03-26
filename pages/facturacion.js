import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const SERVICES = [
  { name: 'Masaje Relajante', price: 95 },
  { name: 'Peluquería Domiciliaria', price: 80 },
  { name: 'Maquillaje Profesional', price: 90 },
  { name: 'Manicura & Estética', price: 70 },
  { name: 'Jet-Lag Recovery', price: 150 },
  { name: 'Pack Amanecer Impecable', price: 120 },
];

const STATUS_COLORS = {
  pendiente: '#D4AF37',
  pagado: '#34D399',
  vencido: '#F87171',
  cancelado: 'rgba(255,255,255,0.3)',
};

function generateInvoiceNumber(index) {
  const year = new Date().getFullYear();
  return `BL-${year}-${String(index + 1).padStart(4, '0')}`;
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (_) {
    return '—';
  }
}

function getDueDate(createdAt, days = 30) {
  const d = new Date(createdAt);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

const SEED_INVOICES = [
  {
    id: 'inv001',
    number: 'BL-2025-0001',
    client: 'María López',
    email: 'maria.lopez@email.com',
    service: 'Masaje Relajante',
    amount: 95,
    iva: 21,
    status: 'pagado',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    dueAt: new Date(Date.now() - 10 * 86400000 + 30 * 86400000).toISOString(),
    paidAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    notes: 'Domicilio cliente',
  },
  {
    id: 'inv002',
    number: 'BL-2025-0002',
    client: 'Carlos Hernández',
    email: 'carlos.h@gmail.com',
    service: 'Jet-Lag Recovery',
    amount: 150,
    iva: 21,
    status: 'pendiente',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    dueAt: getDueDate(new Date(Date.now() - 2 * 86400000).toISOString()),
    paidAt: null,
    notes: 'Hotel Santa Catalina',
  },
  {
    id: 'inv003',
    number: 'BL-2025-0003',
    client: 'Ana Martínez',
    email: 'ana.m@hotmail.com',
    service: 'Pack Amanecer Impecable',
    amount: 120,
    iva: 21,
    status: 'vencido',
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    dueAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    paidAt: null,
    notes: '',
  },
];

function calcTotal(amount, iva) {
  return (amount * (1 + iva / 100)).toFixed(2);
}

export default function Facturacion() {
  const [invoices, setInvoices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(null);
  const [filterStatus, setFilterStatus] = useState('todos');
  const [form, setForm] = useState({
    client: '',
    email: '',
    service: '',
    amount: '',
    iva: '21',
    notes: '',
    status: 'pendiente',
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('blue_invoices');
      if (stored) {
        setInvoices(JSON.parse(stored));
      } else {
        setInvoices(SEED_INVOICES);
        localStorage.setItem('blue_invoices', JSON.stringify(SEED_INVOICES));
      }
    } catch (_) {
      setInvoices(SEED_INVOICES);
    }
  }, []);

  const save = (updated) => {
    setInvoices(updated);
    localStorage.setItem('blue_invoices', JSON.stringify(updated));
  };

  const handleServiceChange = (name) => {
    const svc = SERVICES.find((s) => s.name === name);
    setForm((p) => ({ ...p, service: name, amount: svc ? String(svc.price) : p.amount }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.client.trim()) return;
    const now = new Date().toISOString();
    const newInvoice = {
      id: 'inv' + Date.now(),
      number: 'BL-' + new Date().getFullYear() + '-' + String(invoices.length + 1).padStart(4, '0'),
      client: form.client,
      email: form.email,
      service: form.service,
      amount: Number(form.amount) || 0,
      iva: Number(form.iva) || 21,
      status: form.status,
      createdAt: now,
      dueAt: getDueDate(now),
      paidAt: form.status === 'pagado' ? now : null,
      notes: form.notes,
    };
    save([newInvoice, ...invoices]);
    setShowModal(false);
    setForm({ client: '', email: '', service: '', amount: '', iva: '21', notes: '', status: 'pendiente' });
  };

  const updateStatus = (id, status) => {
    save(
      invoices.map((inv) =>
        inv.id === id
          ? { ...inv, status, paidAt: status === 'pagado' ? new Date().toISOString() : inv.paidAt }
          : inv
      )
    );
  };

  const deleteInvoice = (id) => {
    if (!confirm('¿Eliminar esta factura?')) return;
    save(invoices.filter((inv) => inv.id !== id));
  };

  const filtered = invoices.filter(
    (inv) => filterStatus === 'todos' || inv.status === filterStatus
  );

  const totalPaid = invoices
    .filter((i) => i.status === 'pagado')
    .reduce((s, i) => s + Number(calcTotal(i.amount, i.iva)), 0);

  const totalPending = invoices
    .filter((i) => i.status === 'pendiente')
    .reduce((s, i) => s + Number(calcTotal(i.amount, i.iva)), 0);

  const totalOverdue = invoices
    .filter((i) => i.status === 'vencido')
    .reduce((s, i) => s + Number(calcTotal(i.amount, i.iva)), 0);

  return (
    <>
      <Head>
        <title>Facturación — Blue 24/7</title>
      </Head>

      <div style={{ minHeight: '100vh', background: '#080B1A', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
        {/* Nav */}
        <nav style={{ background: '#0B0E1F', borderBottom: '1px solid rgba(212,175,55,0.2)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#D4AF37', textDecoration: 'none', fontWeight: '700', fontSize: '18px' }}>
            Blue 24/7
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>›</span>
          <span style={{ color: '#fff', fontWeight: '600' }}>Facturación</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
            <Link href="/crm" style={{ color: '#D4AF37', textDecoration: 'none', fontSize: '14px' }}>CRM</Link>
            <Link href="/reservar" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '14px' }}>Reservas</Link>
          </div>
        </nav>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px' }}>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            {[
              { label: 'Total Facturas', value: invoices.length, color: '#fff', icon: '🧾' },
              { label: 'Cobrado', value: totalPaid.toFixed(2) + '€', color: '#34D399', icon: '✅' },
              { label: 'Pendiente', value: totalPending.toFixed(2) + '€', color: '#D4AF37', icon: '⏳' },
              { label: 'Vencido', value: totalOverdue.toFixed(2) + '€', color: '#F87171', icon: '⚠️' },
            ].map((s) => (
              <div key={s.label} style={{ background: '#0F1428', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>{s.icon}</div>
                <div style={{ fontSize: '22px', fontWeight: '800', color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ padding: '9px 14px', background: '#0F1428', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none' }}
            >
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="pagado">Pagado</option>
              <option value="vencido">Vencido</option>
              <option value="cancelado">Cancelado</option>
            </select>
            <button
              onClick={() => setShowModal(true)}
              style={{ padding: '9px 20px', background: 'linear-gradient(135deg, #D4AF37, #B8952A)', border: 'none', borderRadius: '8px', color: '#0B0E1F', fontWeight: '700', fontSize: '14px', cursor: 'pointer', marginLeft: 'auto' }}
            >
              + Nueva Factura
            </button>
          </div>

          {/* Invoices table */}
          <div style={{ background: '#0F1428', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '12px', overflow: 'hidden' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.35)' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🧾</div>
                <div>No hay facturas para este filtro.</div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.15)', color: 'rgba(255,255,255,0.5)', textAlign: 'left' }}>
                      {['Nº Factura', 'Cliente', 'Servicio', 'Base', 'IVA', 'Total', 'Estado', 'Fecha', 'Vence', 'Acciones'].map((h) => (
                        <th key={h} style={{ padding: '12px 14px', fontWeight: '600', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((inv, i) => (
                      <tr
                        key={inv.id}
                        style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212,175,55,0.04)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '12px 14px', fontWeight: '600', color: '#D4AF37', whiteSpace: 'nowrap' }}>{inv.number}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: '600', color: '#fff' }}>{inv.client}</div>
                          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{inv.email}</div>
                        </td>
                        <td style={{ padding: '12px 14px', color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>{inv.service || '—'}</td>
                        <td style={{ padding: '12px 14px', color: 'rgba(255,255,255,0.7)' }}>{inv.amount}€</td>
                        <td style={{ padding: '12px 14px', color: 'rgba(255,255,255,0.5)' }}>{inv.iva}%</td>
                        <td style={{ padding: '12px 14px', fontWeight: '700', color: '#34D399', whiteSpace: 'nowrap' }}>{calcTotal(inv.amount, inv.iva)}€</td>
                        <td style={{ padding: '12px 14px' }}>
                          <select
                            value={inv.status}
                            onChange={(e) => updateStatus(inv.id, e.target.value)}
                            style={{ padding: '3px 8px', borderRadius: '20px', border: '1px solid', borderColor: STATUS_COLORS[inv.status] || '#D4AF37', background: 'transparent', color: STATUS_COLORS[inv.status] || '#D4AF37', fontSize: '11px', cursor: 'pointer', outline: 'none' }}
                          >
                            {['pendiente', 'pagado', 'vencido', 'cancelado'].map((s) => (
                              <option key={s} value={s} style={{ background: '#0F1428', color: '#fff' }}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td style={{ padding: '12px 14px', color: 'rgba(255,255,255,0.4)', fontSize: '11px', whiteSpace: 'nowrap' }}>{formatDate(inv.createdAt)}</td>
                        <td style={{ padding: '12px 14px', color: inv.status === 'vencido' ? '#F87171' : 'rgba(255,255,255,0.4)', fontSize: '11px', whiteSpace: 'nowrap' }}>{formatDate(inv.dueAt)}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => setShowPreview(inv)}
                              style={{ padding: '4px 10px', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.3)', borderRadius: '6px', color: '#60A5FA', fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                            >
                              Ver
                            </button>
                            <button
                              onClick={() => deleteInvoice(inv.id)}
                              style={{ padding: '4px 10px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '6px', color: '#F87171', fontSize: '11px', cursor: 'pointer' }}
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New invoice modal */}
      {showModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div style={{ background: '#0F1428', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ margin: '0 0 20px', color: '#D4AF37', fontSize: '18px' }}>Nueva Factura</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { name: 'client', label: 'Cliente *', type: 'text', required: true },
                { name: 'email', label: 'Email cliente', type: 'email' },
              ].map((f) => (
                <div key={f.name}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>{f.label}</label>
                  <input type={f.type} required={f.required} value={form[f.name]} onChange={(e) => setForm((p) => ({ ...p, [f.name]: e.target.value }))} style={{ width: '100%', padding: '9px 12px', background: '#12183A', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Servicio</label>
                <select value={form.service} onChange={(e) => handleServiceChange(e.target.value)} style={{ width: '100%', padding: '9px 12px', background: '#12183A', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none' }}>
                  <option value="">Seleccionar servicio...</option>
                  {SERVICES.map((s) => <option key={s.name} value={s.name}>{s.name} — {s.price}€</option>)}
                  <option value="Otro">Personalizado</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Base imponible (€) *</label>
                  <input type="number" required min="0" step="0.01" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} style={{ width: '100%', padding: '9px 12px', background: '#12183A', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>IVA (%)</label>
                  <select value={form.iva} onChange={(e) => setForm((p) => ({ ...p, iva: e.target.value }))} style={{ width: '100%', padding: '9px 12px', background: '#12183A', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none' }}>
                    <option value="0">0% (exento)</option>
                    <option value="10">10%</option>
                    <option value="21">21%</option>
                  </select>
                </div>
              </div>
              {form.amount && (
                <div style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#34D399' }}>
                  Total con IVA: <strong>{calcTotal(form.amount, form.iva)}€</strong>
                </div>
              )}
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Estado</label>
                <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} style={{ width: '100%', padding: '9px 12px', background: '#12183A', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none' }}>
                  <option value="pendiente">Pendiente</option>
                  <option value="pagado">Pagado</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Notas</label>
                <textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} rows={2} style={{ width: '100%', padding: '9px 12px', background: '#12183A', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '9px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', fontSize: '14px', cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit" style={{ padding: '9px 24px', background: 'linear-gradient(135deg, #D4AF37, #B8952A)', border: 'none', borderRadius: '8px', color: '#0B0E1F', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                  Crear Factura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice preview modal */}
      {showPreview && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={(e) => e.target === e.currentTarget && setShowPreview(null)}
        >
          <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '520px', color: '#1a1a1a', fontFamily: 'Inter, sans-serif' }}>
            {/* Invoice header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '22px', fontWeight: '900', color: '#4B0082' }}>Blue 24/7</div>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>IL Bridge Blue World S.L.</div>
                <div style={{ fontSize: '11px', color: '#666' }}>CIF: B24909517</div>
                <div style={{ fontSize: '11px', color: '#666' }}>Las Palmas de Gran Canaria</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#4B0082' }}>FACTURA</div>
                <div style={{ fontSize: '14px', fontWeight: '700', marginTop: '4px' }}>{showPreview.number}</div>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>Fecha: {formatDate(showPreview.createdAt)}</div>
                <div style={{ fontSize: '11px', color: '#666' }}>Vence: {formatDate(showPreview.dueAt)}</div>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '0 0 20px' }} />

            {/* Client */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Facturado a</div>
              <div style={{ fontWeight: '700', fontSize: '15px' }}>{showPreview.client}</div>
              {showPreview.email && <div style={{ fontSize: '12px', color: '#666' }}>{showPreview.email}</div>}
            </div>

            {/* Items */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
              <thead>
                <tr style={{ background: '#f9f9f9', borderRadius: '6px' }}>
                  {['Descripción', 'Base', 'IVA', 'Total'].map((h) => (
                    <th key={h} style={{ padding: '8px 10px', textAlign: h === 'Descripción' ? 'left' : 'right', fontSize: '11px', color: '#999', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '10px', fontSize: '13px' }}>{showPreview.service || 'Servicio'}</td>
                  <td style={{ padding: '10px', textAlign: 'right', fontSize: '13px' }}>{showPreview.amount}€</td>
                  <td style={{ padding: '10px', textAlign: 'right', fontSize: '13px' }}>{showPreview.iva}%</td>
                  <td style={{ padding: '10px', textAlign: 'right', fontWeight: '700', fontSize: '13px' }}>{calcTotal(showPreview.amount, showPreview.iva)}€</td>
                </tr>
              </tbody>
              <tfoot>
                <tr style={{ borderTop: '2px solid #eee' }}>
                  <td colSpan={3} style={{ padding: '10px', textAlign: 'right', fontWeight: '700', fontSize: '14px' }}>Total a pagar:</td>
                  <td style={{ padding: '10px', textAlign: 'right', fontWeight: '900', fontSize: '16px', color: '#4B0082' }}>{calcTotal(showPreview.amount, showPreview.iva)}€</td>
                </tr>
              </tfoot>
            </table>

            {/* Status badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', background: showPreview.status === 'pagado' ? '#D1FAE5' : showPreview.status === 'vencido' ? '#FEE2E2' : '#FEF3C7', color: showPreview.status === 'pagado' ? '#065F46' : showPreview.status === 'vencido' ? '#991B1B' : '#92400E' }}>
                {showPreview.status.toUpperCase()}
              </span>
              {showPreview.paidAt && (
                <span style={{ fontSize: '11px', color: '#999' }}>Pagado el {formatDate(showPreview.paidAt)}</span>
              )}
            </div>

            {showPreview.notes && (
              <div style={{ fontSize: '12px', color: '#999', borderTop: '1px solid #eee', paddingTop: '12px' }}>
                Notas: {showPreview.notes}
              </div>
            )}

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => window.print()} style={{ padding: '8px 16px', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '8px', color: '#374151', fontSize: '13px', cursor: 'pointer' }}>
                🖨️ Imprimir
              </button>
              <button onClick={() => setShowPreview(null)} style={{ padding: '8px 16px', background: '#4B0082', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
