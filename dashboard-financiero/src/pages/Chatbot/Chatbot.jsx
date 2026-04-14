import { useState, useRef, useEffect, useCallback } from 'react'
import { useAnalisis } from '../../context/AnalisisContexto'
import { procesarMensaje, MENSAJE_BIENVENIDA, SUGERENCIAS } from '../../services/chatbotFinanciero'
import Icono from '../../components/Icono/Icono'
import '../Dashboard/Dashboard.css'
import './Chatbot.css'

// ─── Renderizador de texto Markdown ligero ───────────────────────────────────

const TextoFormateado = ({ texto }) => {
  const lineas = texto.split('\n')

  return (
    <div className="chat-texto">
      {lineas.map((linea, i) => {
        if (linea.startsWith('**') && linea.endsWith('**') && linea.length > 4) {
          return <strong key={i} className="chat-texto__titulo">{linea.slice(2, -2)}</strong>
        }
        if (linea.startsWith('• ')) {
          return <p key={i} className="chat-texto__bullet">• {formatearNegrita(linea.slice(2))}</p>
        }
        if (linea.startsWith('|') && linea.includes('|')) {
          if (linea.includes('---')) return null
          const celdas = linea.split('|').filter(Boolean).map(c => c.trim())
          const esEncabezado = linea.includes('Indicador')
          return (
            <div key={i} className={`chat-tabla__fila ${esEncabezado ? 'chat-tabla__fila--header' : ''}`}>
              {celdas.map((c, j) => <span key={j} className="chat-tabla__celda">{formatearNegrita(c)}</span>)}
            </div>
          )
        }
        if (linea.startsWith('*') && linea.endsWith('*')) {
          return <p key={i} className="chat-texto__nota">{linea.slice(1, -1)}</p>
        }
        if (linea.trim() === '') return <div key={i} className="chat-texto__espacio" />
        return <p key={i}>{formatearNegrita(linea)}</p>
      })}
    </div>
  )
}

const formatearNegrita = (texto) => {
  const partes = texto.split(/(\*\*[^*]+\*\*)/g)
  return partes.map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i}>{p.slice(2, -2)}</strong>
      : p
  )
}

// ─── Burbuja de mensaje ───────────────────────────────────────────────────────

const BurbujaMensaje = ({ mensaje }) => {
  const esBot = mensaje.autor === 'bot'
  return (
    <div className={`burbuja ${esBot ? 'burbuja--bot' : 'burbuja--usuario'}`}>
      {esBot && (
        <div className="burbuja__avatar-bot" aria-hidden="true">
          <Icono nombre="calificacion" tamaño={14} />
        </div>
      )}
      <div className={`burbuja__contenido ${esBot ? 'burbuja__contenido--bot' : 'burbuja__contenido--usuario'}`}>
        {esBot ? (
          <TextoFormateado texto={mensaje.texto} />
        ) : (
          <p>{mensaje.texto}</p>
        )}
        <span className="burbuja__hora">{mensaje.hora}</span>
      </div>
    </div>
  )
}

// ─── Indicador de escritura ────────────────────────────────────────────────────

const IndicadorEscritura = () => (
  <div className="burbuja burbuja--bot">
    <div className="burbuja__avatar-bot" aria-hidden="true">
      <Icono nombre="calificacion" tamaño={14} />
    </div>
    <div className="burbuja__contenido burbuja__contenido--bot burbuja__contenido--typing">
      <div className="typing-dots">
        <span /><span /><span />
      </div>
    </div>
  </div>
)

// ─── Página principal del Chatbot ────────────────────────────────────────────

const Chatbot = () => {
  const { kpis } = useAnalisis()
  const [mensajes, setMensajes] = useState([MENSAJE_BIENVENIDA])
  const [entrada, setEntrada] = useState('')
  const [escribiendo, setEscribiendo] = useState(false)
  const listaRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (listaRef.current) {
      listaRef.current.scrollTop = listaRef.current.scrollHeight
    }
  }, [mensajes, escribiendo])

  const generarId = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`

  const obtenerHora = () =>
    new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })

  const enviarMensaje = useCallback(async (texto) => {
    const textoLimpio = texto.trim()
    if (!textoLimpio || escribiendo) return

    const msgUsuario = {
      id: generarId(),
      autor: 'usuario',
      texto: textoLimpio,
      hora: obtenerHora(),
    }

    setMensajes((prev) => [...prev, msgUsuario])
    setEntrada('')
    setEscribiendo(true)

    try {
      const respuesta = await procesarMensaje(textoLimpio, kpis)
      setMensajes((prev) => [
        ...prev,
        { id: generarId(), autor: 'bot', texto: respuesta, hora: obtenerHora() },
      ])
    } finally {
      setEscribiendo(false)
      inputRef.current?.focus()
    }
  }, [kpis, escribiendo])

  const manejarEnvio = (e) => {
    e.preventDefault()
    enviarMensaje(entrada)
  }

  const limpiarChat = () => {
    setMensajes([MENSAJE_BIENVENIDA])
    setEntrada('')
    inputRef.current?.focus()
  }

  return (
    <div className="dashboard-page fade-in">
      <header className="page-header">
        <div className="page-header__texto">
          <h2>Asistente Financiero</h2>
          <p className="page-header__dinamico" style={{ background: 'transparent', border: 'none', color: '#cbd5e1', padding: 0 }}>
            Aura — IA conectada a tus datos en tiempo real
          </p>
        </div>
        <div className="page-header__acciones">
          <button className="btn-editar-kpis" onClick={limpiarChat} title="Limpiar conversación">
            <Icono nombre="restablecer" tamaño={15} />
            Limpiar chat
          </button>
        </div>
      </header>

      <div className="chatbot-wrapper">
        {/* Panel de conversación */}
        <section className="chatbot-panel" aria-label="Conversación con Aura">
          <div className="chatbot-panel__header">
            <div className="chatbot-panel__avatar">
              <Icono nombre="calificacion" tamaño={18} />
            </div>
            <div>
              <p className="chatbot-panel__nombre">Aura</p>
              <p className="chatbot-panel__estado">
                <span className="chatbot-panel__punto" />
                Conectada · Datos en tiempo real
              </p>
            </div>
          </div>

          {/* Lista de mensajes */}
          <div className="chatbot-mensajes" ref={listaRef} role="log" aria-live="polite">
            {mensajes.map((msg) => (
              <BurbujaMensaje key={msg.id} mensaje={msg} />
            ))}
            {escribiendo && <IndicadorEscritura />}
          </div>

          {/* Sugerencias rápidas */}
          <div className="chatbot-sugerencias" aria-label="Preguntas sugeridas">
            {SUGERENCIAS.map((s) => (
              <button
                key={s}
                className="chat-sugerencia"
                onClick={() => enviarMensaje(s)}
                disabled={escribiendo}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <form className="chatbot-input-form" onSubmit={manejarEnvio}>
            <div className="chatbot-input-wrapper">
              <input
                ref={inputRef}
                id="chat-input"
                type="text"
                className="chatbot-input"
                placeholder="Pregunta sobre tus finanzas..."
                value={entrada}
                onChange={(e) => setEntrada(e.target.value)}
                disabled={escribiendo}
                autoComplete="off"
                maxLength={200}
                aria-label="Escribe tu pregunta"
              />
              <button
                type="submit"
                className="chatbot-btn-enviar"
                disabled={!entrada.trim() || escribiendo}
                title="Enviar mensaje"
                id="btn-enviar-chat"
              >
                <Icono nombre="exportar" tamaño={16} />
              </button>
            </div>
          </form>
        </section>

        {/* Panel lateral de contexto */}
        <aside className="chatbot-contexto" aria-label="Datos financieros actuales">
          <h3 className="chatbot-contexto__titulo">
            <Icono nombre="rentabilidad" tamaño={16} />
            Datos del período
          </h3>
          <div className="chatbot-kpi-lista">
            {[
              { label: 'Ingresos', valor: kpis.ingresoTotal.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }), color: 'var(--color-excelente)' },
              { label: 'Costos', valor: kpis.costoTotal.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }), color: 'var(--color-critico)' },
              { label: 'Margen Bruto', valor: `${kpis.margenBruto.toFixed(1)}%`, color: 'var(--color-primario-claro)' },
              { label: 'Margen Neto', valor: `${kpis.margenNeto.toFixed(1)}%`, color: kpis.margenNeto >= 0 ? 'var(--color-excelente)' : 'var(--color-critico)' },
              { label: 'ROI', valor: `${kpis.ROI.toFixed(1)}%`, color: kpis.ROI >= 0 ? 'var(--color-excelente)' : 'var(--color-critico)' },
              { label: 'Pto. Equilibrio', valor: kpis.puntoEquilibrio.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }), color: 'var(--color-advertencia)' },
              { label: 'Crecimiento', valor: `${kpis.crecimientoMensual.toFixed(1)}%`, color: kpis.crecimientoMensual >= 0 ? 'var(--color-excelente)' : 'var(--color-critico)' },
            ].map(({ label, valor, color }) => (
              <div key={label} className="chatbot-kpi-item">
                <span className="chatbot-kpi-item__label">{label}</span>
                <span className="chatbot-kpi-item__valor" style={{ color }}>{valor}</span>
              </div>
            ))}
          </div>

          <div className="chatbot-contexto__nota">
            <Icono nombre="informacion" tamaño={12} />
            Los datos se actualizan automáticamente con tu configuración en el Dashboard.
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Chatbot
