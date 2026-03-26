import { useState, useEffect, useRef, useCallback } from 'react';

const WELCOME_MESSAGE = {
  id: 1,
  role: 'assistant',
  text: '¡Hola! Soy **Indigo**, tu asistente de Blue 24/7 🌙\n\nEstoy aquí para ayudarte con reservas, precios y cualquier consulta — disponible de 05:00 a 01:00 todos los días. ¿En qué puedo ayudarte hoy?',
  time: new Date(),
};

function formatText(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

export default function IndigoBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const [leads, setLeads] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load persisted data
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem('indigo_messages');
      const savedLeads = localStorage.getItem('indigo_leads');
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        if (parsed.length > 0) setMessages(parsed);
      }
      if (savedLeads) setLeads(JSON.parse(savedLeads));
    } catch (_) {}
  }, []);

  // Persist messages
  useEffect(() => {
    try {
      localStorage.setItem('indigo_messages', JSON.stringify(messages));
    } catch (_) {}
  }, [messages]);

  // Persist leads
  useEffect(() => {
    try {
      localStorage.setItem('indigo_leads', JSON.stringify(leads));
    } catch (_) {}
  }, [leads]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Count unread when closed
  useEffect(() => {
    if (!open) {
      const assistantMsgs = messages.filter((m) => m.role === 'assistant');
      setUnread(assistantMsgs.length > 1 ? 1 : 0);
    } else {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, messages]);

  const saveLead = useCallback(
    (leadData) => {
      if (!leadData) return;
      const newLead = {
        ...leadData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        source: 'indigo-bot',
        status: 'nuevo',
      };
      const updated = [newLead, ...leads];
      setLeads(updated);
      // Also persist to CRM leads store
      try {
        const crmLeads = JSON.parse(localStorage.getItem('crm_leads') || '[]');
        localStorage.setItem('crm_leads', JSON.stringify([newLead, ...crmLeads]));
      } catch (_) {}
    },
    [leads]
  );

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { id: Date.now(), role: 'user', text, time: new Date() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    // Build conversation history for API (exclude the welcome message id=1 if it's the only one)
    const history = updatedMessages
      .filter((m) => m.id !== 1)
      .map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.text }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const botMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text: data.message,
        time: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);

      if (data.leadData) {
        saveLead(data.leadData);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: 'Lo siento, tuve un problema técnico. Puedes llamarnos al **+34 614 067 291** y te atendemos de inmediato. 📞',
          time: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, saveLead]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
    localStorage.removeItem('indigo_messages');
  };

  const quickReplies = [
    '¿Qué servicios ofrecéis?',
    '¿Cuáles son los precios?',
    'Quiero reservar una cita',
    '¿Disponéis en hoteles?',
  ];

  const showQuickReplies = messages.length <= 2;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Abrir chat con Indigo"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #4B0082 0%, #6A0DAD 50%, #D4AF37 100%)',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(75,0,130,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 28px rgba(75,0,130,0.7)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(75,0,130,0.5)';
        }}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              fill="white"
            />
          </svg>
        )}
        {!open && unread > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: '#D4AF37',
              fontSize: '10px',
              fontWeight: '700',
              color: '#0B0E1F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {unread}
          </span>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: '96px',
            right: '24px',
            width: '360px',
            maxWidth: 'calc(100vw - 32px)',
            height: '520px',
            maxHeight: 'calc(100vh - 120px)',
            background: '#0B0E1F',
            borderRadius: '16px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 9998,
            overflow: 'hidden',
            border: '1px solid rgba(212,175,55,0.25)',
            animation: 'indigoSlideUp 0.25s ease',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #4B0082 0%, #6A0DAD 100%)',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                flexShrink: 0,
              }}
            >
              🤖
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontWeight: '700', fontSize: '15px' }}>Indigo</div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '11px' }}>
                Blue 24/7 · Asistente IA · Disponible ahora
              </div>
            </div>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#4ADE80',
                boxShadow: '0 0 6px #4ADE80',
              }}
            />
            <button
              onClick={clearChat}
              title="Nueva conversación"
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '2px 6px',
              }}
            >
              ↺
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '14px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '82%',
                    padding: '10px 13px',
                    borderRadius:
                      msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background:
                      msg.role === 'user'
                        ? 'linear-gradient(135deg, #D4AF37, #B8952A)'
                        : '#12183A',
                    color: '#fff',
                    fontSize: '13.5px',
                    lineHeight: '1.5',
                    border: msg.role === 'assistant' ? '1px solid rgba(212,175,55,0.15)' : 'none',
                  }}
                  dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
                />
                <span
                  style={{
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.35)',
                    marginTop: '3px',
                    paddingLeft: msg.role === 'user' ? '0' : '4px',
                    paddingRight: msg.role === 'user' ? '4px' : '0',
                  }}
                >
                  {formatTime(msg.time)}
                </span>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '16px 16px 16px 4px',
                    background: '#12183A',
                    border: '1px solid rgba(212,175,55,0.15)',
                    display: 'flex',
                    gap: '4px',
                    alignItems: 'center',
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: '#D4AF37',
                        display: 'inline-block',
                        animation: `indigoBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quick replies */}
            {showQuickReplies && !loading && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                {quickReplies.map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setInput(q);
                      setTimeout(() => sendMessage(), 0);
                    }}
                    style={{
                      padding: '6px 11px',
                      borderRadius: '20px',
                      border: '1px solid rgba(212,175,55,0.4)',
                      background: 'rgba(212,175,55,0.08)',
                      color: '#D4AF37',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = 'rgba(212,175,55,0.18)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = 'rgba(212,175,55,0.08)')
                    }
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: '10px 12px',
              borderTop: '1px solid rgba(212,175,55,0.15)',
              display: 'flex',
              gap: '8px',
              alignItems: 'flex-end',
              flexShrink: 0,
              background: '#0D1123',
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Escribe tu consulta..."
              rows={1}
              style={{
                flex: 1,
                background: '#12183A',
                border: '1px solid rgba(212,175,55,0.2)',
                borderRadius: '10px',
                color: '#fff',
                padding: '9px 12px',
                fontSize: '13.5px',
                resize: 'none',
                outline: 'none',
                fontFamily: 'Inter, sans-serif',
                lineHeight: '1.4',
                maxHeight: '80px',
                overflowY: 'auto',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.2)')}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background:
                  input.trim() && !loading
                    ? 'linear-gradient(135deg, #D4AF37, #B8952A)'
                    : 'rgba(255,255,255,0.1)',
                border: 'none',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s',
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"
                  stroke={input.trim() && !loading ? '#0B0E1F' : 'rgba(255,255,255,0.3)'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '6px 12px',
              textAlign: 'center',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.25)',
              background: '#0D1123',
            }}
          >
            Powered by Blue 24/7 · IA Indigo
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes indigoSlideUp {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes indigoBounce {
          0%,
          80%,
          100% {
            transform: scale(0.6);
            opacity: 0.4;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
