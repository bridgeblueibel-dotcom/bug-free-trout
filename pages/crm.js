import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const SERVICES = [
  'Masaje Relajante',
  'Peluquería Domiciliaria',
  'Maquillaje Profesional',
  'Manicura & Estética',
  'Jet-Lag Recovery',
  'Pack Amanecer Impecable',
  'Otro',
];

const STATUS_OPTIONS = ['nuevo', 'contactado', 'reservado', 'completado', 'perdido'];

const STATUS_COLORS = {
  nuevo: '#D4AF37',
  contactado: '#60A5FA',
  reservado: '#34D399',
  completado: '#A78BFA',
  perdido: '#F87171',
};

const SOURCE_LABELS = {
  'indigo-bot': '🤖 Indigo Bot',
  manual: '✍️ Manual',
  formulario: '📋 Formulario',
  telefono: '📞 Teléfono',
};

function generateId() {
  return 'c' + Date.now() + Math.random().toString(36).slice(2, 6);
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch (_) {
    return '—';
  }
}

const SEED_CLIENTS = [
  {
    id: 'c001',
    name: 'María López',
    email: 'maria.lopez@email.com',
    phone: '+34 612 345 678',
    service: 'Masaje Relajante',
    status: 'completado',
    source: 'indigo-bot',
    notes: 'Cliente habitual. Prefiere sábados.',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    value: 95,
  },
  {
    id: 'c002',
    name: 'Carlos Hernández',
    email: 'carlos.h@gmail.com',
    phone: '+34 654 987 321',
    service: 'Jet-Lag Recovery',
    status: 'reservado',
    source: 'formulario',
    notes: 'Viajero frecuente. Hotel Santa Catalina.',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    value: 150,
  },
  {
    id: 'c003',
    name: 'Ana Martínez',
    email: 'ana.m@hotmail.com',
    phone: '+34 698 111 222',
    service: 'Pack Amanecer Impecable',
    status: 'contactado',
    source: 'indigo-bot',
    notes: 'Interesada en boda. Llamar el martes.',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    value: 120,
  },
  {
    id: 'c004',
    name: 'Luis Torres',
    email: 'ltorres@empresa.es',
    phone: '+34 611 333 444',
    service: 'Maquillaje Profesional',
    status: 'nuevo',
    source: 'indigo-bot',
    notes: 'Para evento corporativo.',
    createdAt: new Date().toISOString(),
    value: 90,
  },
];

export default function CRM() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [activeTab, setActiveTab] = useState('clientes');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    status: 'nuevo',
    source: 'manual',
    notes: '',
    value: '',
  });

  // Load data
  useEffect(() => {
    try {
      const stored = localStorage.getItem('crm_clients');
      if (stored) {
        setClients(JSON.parse(stored));
      } else {
        setClients(SEED_CLIENTS);
        localStorage.setItem('crm_clients', JSON.stringify(SEED_CLIENTS));
      }
    } catch (_) {
      setClients(SEED_CLIENTS);
    }
  }, []);

  // Merge bot leads into clients on tab change
  useEffect(() => {
    if (activeTab === 'leads') {
      try {
        const botLeads = JSON.parse(localStorage.getItem('crm_leads') || '[]');
        if (botLeads.length > 0) {
          setClients((prev) => {
            const existingIds = new Set(prev.map((c) => c.id));
            const newLeads = botLeads
              .filter((l) => !existingIds.has(String(l.id)))
              .map((l) => ({
                ...l,
                id: String(l.id),
                value: 0,
                status: l.status || 'nuevo',
              }));
            if (newLeads.length === 0) return prev;
            const merged = [...newLeads, ...prev];
            localStorage.setItem('crm_clients', JSON.stringify(merged));
            localStorage.removeItem('crm_leads');
            return merged;
          });
        }
      } catch (_) {}
    }
  }, [activeTab]);

  const save = (updated) => {
    setClients(updated);
    localStorage.setItem('crm_clients', JSON.stringify(updated));
  };

  const openNew = () => {
    setEditingClient(null);
    setForm({ name: '', email: '', phone: '', service: '', status: 'nuevo', source: 'manual', notes: '', value: '' });
    setShowModal(true);
  };

  const openEdit = (client) => {
    setEditingClient(client);
    setForm({ ...client, value: String(client.value || '') });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editingClient) {
      const updated = clients.map((c) =>
        c.id === editingClient.id ? { ...c, ...form, value: Number(form.value) || 0 } : c
      );
      save(updated);
    } else {
      const newClient = {
        ...form,
        id: generateId(),
        createdAt: new Date().toISOString(),
        value: Number(form.value) || 0,
      };
      save([newClient, ...clients]);
    }
    setShowModal(false);
  };

  const deleteClient = (id) => {
    if (!confirm('¿Eliminar este contacto?')) return;
    save(clients.filter((c) => c.id !== id));
  };

  const updateStatus = (id, status) => {
    save(clients.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const filtered = clients.filter((c) => {
    const matchSearch =
      !search ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search);
    const matchStatus = filterStatus === 'todos' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const leads = filtered.filter((c) => c.status === 'nuevo' || c.status === 'contactado');
  const pipeline = filtered.filter((c) => c.status === 'reservado');
  const completed = filtered.filter((c) => c.status === 'completado');

  const totalRevenue = clients
    .filter((c) => c.status === 'completado')
    .reduce((sum, c) => sum + (Number(c.value) || 0), 0);

  const pipelineValue = clients
    .filter((c) => c.status === 'reservado')
    .reduce((sum, c) => sum + (Number(c.value) || 0), 0);

  const botLeads = clients.filter((c) => c.source === 'indigo-bot').length;

  const displayList = activeTab === 'leads' ? leads : activeTab === 'pipeline' ? pipeline : activeTab === 'completados' ? completed : filtered;

  return (
    <>
      <Head>
        <title>CRM — Blue 24/7</title>
      </Head>

      <div style={{ minHeight: '100vh', background: '#080B1A', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
        {/* Top nav */}
        <nav style={{ background: '#0B0E1F', borderBottom: '1px solid rgba(212,175,55,0.2)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#D4AF37', textDecoration: 'none', fontWeight: '700', fontSize: '18px' }}>
            Blue 24/7
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>›</span>
          <span style={{ color: '#fff', fontWeight: '600' }}>CRM</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
            <Link href="/facturacion" style={{ color: '#D4AF37', textDecoration: 'none', fontSize: '14px' }}>Facturación</Link>
            <Link href="/reservar" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '14px' }}>Reservas</Link>
          </div>
        </nav>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            {[
              { label: 'Total Contactos', value: clients.length, color: '#D4AF37', icon: '👥' },
              { label: 'Leads Nuevos', value: clients.filter((c) => c.status === 'nuevo').length, color: '#D4AF37', icon: '🆕' },
              { label: 'En Pipeline', value: pipelineValue + '€', color: '#34D399', icon: '📈' },
              { label: 'Ingresos Confirmados', value: totalRevenue + '€', color: '#A78BFA', icon: '💰' },
              { label: 'Leads via Indigo', value: botLeads, color: '#60A5FA', icon: '🤖' },
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
            <input
              type="text"
              placeholder="Buscar por nombre, email o teléfono..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: '200px', padding: '9px 14px', background: '#0F1428', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none' }}
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ padding: '9px 14px', background: '#0F1428', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none' }}
            >
              <option value="todos">Todos los estados</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <button
              onClick={openNew}
              style={{ padding: '9px 20px', background: 'linear-gradient(135deg, #D4AF37, #B8952A)', border: 'none', borderRadius: '8px', color: '#0B0E1F', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}
            >
              + Nuevo Contacto
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: '#0F1428', padding: '4px', borderRadius: '10px', width: 'fit-content', flexWrap: 'wrap' }}>
            {[
              { key: 'clientes', label: `Todos (${filtered.length})` },
              { key: 'leads', label: `Leads (${leads.length})` },
              { key: 'pipeline', label: `Pipeline (${pipeline.length})` },
              { key: 'completados', label: `Completados (${completed.length})` },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '7px',
                  border: 'none',
                  background: activeTab === t.key ? 'linear-gradient(135deg, #D4AF37, #B8952A)' : 'transparent',
                  color: activeTab === t.key ? '#0B0E1F' : 'rgba(255,255,255,0.6)',
                  fontWeight: activeTab === t.key ? '700' : '400',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div style={{ background: '#0F1428', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '12px', overflow: 'hidden' }}>
            {displayList.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.35)' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>👤</div>
                <div>No hay contactos en esta categoría.</div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.15)', color: 'rgba(255,255,255,0.5)', textAlign: 'left' }}>
                      {['Contacto', 'Servicio', 'Estado', 'Fuente', 'Valor', 'Fecha', 'Acciones'].map((h) => (
                        <th key={h} style={{ padding: '12px 16px', fontWeight: '600' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {displayList.map((c, i) => (
                      <tr
                        key={c.id}
                        style={{ borderBottom: i < displayList.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', transition: 'background 0.15s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212,175,55,0.04)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: '600', color: '#fff' }}>{c.name || '—'}</div>
                          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>{c.email || c.phone || ''}</div>
                        </td>
                        <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.7)' }}>{c.service || '—'}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <select
                            value={c.status || 'nuevo'}
                            onChange={(e) => updateStatus(c.id, e.target.value)}
                            style={{
                              padding: '3px 8px',
                              borderRadius: '20px',
                              border: '1px solid',
                              borderColor: STATUS_COLORS[c.status] || '#D4AF37',
                              background: 'transparent',
                              color: STATUS_COLORS[c.status] || '#D4AF37',
                              fontSize: '11px',
                              cursor: 'pointer',
                              outline: 'none',
                            }}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s} style={{ background: '#0F1428', color: '#fff' }}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>
                          {SOURCE_LABELS[c.source] || c.source || '—'}
                        </td>
                        <td style={{ padding: '12px 16px', color: '#34D399', fontWeight: '600' }}>
                          {c.value ? c.value + '€' : '—'}
                        </td>
                        <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>
                          {formatDate(c.createdAt)}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => openEdit(c)}
                              style={{ padding: '4px 10px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '6px', color: '#D4AF37', fontSize: '11px', cursor: 'pointer' }}
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => deleteClient(c.id)}
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

        {/* Modal */}
        {showModal && (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <div style={{ background: '#0F1428', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto' }}>
              <h2 style={{ margin: '0 0 20px', color: '#D4AF37', fontSize: '18px' }}>
                {editingClient ? 'Editar Contacto' : 'Nuevo Contacto'}
              </h2>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { name: 'name', label: 'Nombre *', type: 'text', required: true },
                  { name: 'email', label: 'Email', type: 'email' },
                  { name: 'phone', label: 'Teléfono', type: 'tel' },
                  { name: 'value', label: 'Valor (€)', type: 'number' },
                ].map((f) => (
                  <div key={f.name}>
                    <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>{f.label}</label>
                    <input
                      type={f.type}
                      required={f.required}
                      value={form[f.name]}
                      onChange={(e) => setForm((p) => ({ ...p, [f.name]: e.target.value }))}
                      style={{ width: '100%', padding: '9px 12px', background: '#12183A', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Servicio</label>
                  <select value={form.service} onChange={(e) => setForm((p) => ({ ...p, service: e.target.value }))} style={{ width: '100%', padding: '9px 12px', background: '#12183A', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none' }}>
                    <option value="">Seleccionar...</option>
                    {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Estado</label>
                    <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} style={{ width: '100%', padding: '9px 12px', background: '#12183A', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none' }}>
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Fuente</label>
                    <select value={form.source} onChange={(e) => setForm((p) => ({ ...p, source: e.target.value }))} style={{ width: '100%', padding: '9px 12px', background: '#12183A', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none' }}>
                      {Object.entries(SOURCE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Notas</label>
                  <textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} rows={3} style={{ width: '100%', padding: '9px 12px', background: '#12183A', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <button type="button" onClick={() => setShowModal(false)} style={{ padding: '9px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', fontSize: '14px', cursor: 'pointer' }}>
                    Cancelar
                  </button>
                  <button type="submit" style={{ padding: '9px 24px', background: 'linear-gradient(135deg, #D4AF37, #B8952A)', border: 'none', borderRadius: '8px', color: '#0B0E1F', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                    {editingClient ? 'Guardar cambios' : 'Crear contacto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
