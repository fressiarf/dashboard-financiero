import { useState, useMemo } from 'react'
import Icono from '../../components/Icono/Icono'
import { useAnalisis } from '../../context/AnalisisContexto'
import { generarTransaccionesDesdeKpis, agregarTransaccion } from '../../services/clasificadorTransacciones'
import '../Dashboard/Dashboard.css'
import '../../components/EntradaKpis/EntradaKpis.css'
import './Transacciones.css'

// ─── Badge de tipo de transacción ───────────────────────────────────────────

const BadgeTipo = ({ tipo }) => {
  const config = {
    'Ingreso':   { clase: 'badge-ingreso',   label: 'Ingreso'   },
    'Gasto':     { clase: 'badge-gasto',     label: 'Gasto'     },
    'Inversión': { clase: 'badge-inversion', label: 'Inversión' },
  }
  const { clase = 'badge-estado', label = tipo } = config[tipo] ?? {}
  return <span className={`badge-estado ${clase}`}>{label}</span>
}

const BadgeConfianza = ({ confianza }) => {
  if (confianza === 'alta') return null
  return (
    <span className="badge-confianza" title={`Clasificación automática — confianza ${confianza}`}>
      {confianza === 'media' ? '~' : '?'}
    </span>
  )
}

const BadgeEstado = ({ estado }) => (
  <span className={`badge-estado ${estado === 'completado' ? 'badge-completado' : 'badge-pendiente'}`}>
    {estado}
  </span>
)

// ─── Formulario para agregar transacción ────────────────────────────────────

const FormNuevaTransaccion = ({ alAgregar, alCerrar }) => {
  const [form, setForm] = useState({ concepto: '', monto: '' })

  const setCampo = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const enviar = (e) => {
    e.preventDefault()
    const monto = parseFloat(form.monto)
    if (!form.concepto.trim() || isNaN(monto)) return
    alAgregar({ concepto: form.concepto.trim(), monto })
    setForm({ concepto: '', monto: '' })
    alCerrar()
  }

  return (
    <form className="form-nueva-tx" onSubmit={enviar} noValidate>
      <h3 className="form-nueva-tx__titulo">
        <Icono nombre="editar" tamaño={15} clase="nivel-bueno" />
        Nueva Transacción
      </h3>
      <div className="form-nueva-tx__campos">
        <div className="campo-kpi" style={{ flex: 2 }}>
          <label className="campo-kpi__etiqueta" htmlFor="tx-concepto">Concepto / Descripción</label>
          <div className="campo-kpi__input-wrapper">
            <input
              id="tx-concepto"
              className="campo-kpi__input"
              type="text"
              placeholder="Ej: Nómina Quincenal, Abono cliente..."
              value={form.concepto}
              onChange={(e) => setCampo('concepto', e.target.value)}
            />
          </div>
        </div>
        <div className="campo-kpi" style={{ flex: 1 }}>
          <label className="campo-kpi__etiqueta" htmlFor="tx-monto">Monto (positivo=ingreso)</label>
          <div className="campo-kpi__input-wrapper">
            <span className="campo-kpi__prefijo">$</span>
            <input
              id="tx-monto"
              className="campo-kpi__input campo-kpi__input--con-prefijo"
              type="number"
              step="any"
              placeholder="Ej: 5000 o -3000"
              value={form.monto}
              onChange={(e) => setCampo('monto', e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="form-nueva-tx__acciones">
        <button type="button" className="btn-restablecer" onClick={alCerrar}>Cancelar</button>
        <button type="submit" className="btn-analizar" style={{ padding: '8px 20px' }}>
          <Icono nombre="calificacion" tamaño={14} />
          Clasificar y Agregar
        </button>
      </div>
    </form>
  )
}

// ─── Página principal ────────────────────────────────────────────────────────

const Transacciones = () => {
  const { datosBase } = useAnalisis()
  const [mostrarForm, setMostrarForm] = useState(false)
  const [filtro, setFiltro]           = useState('Todos')
  const [txPersonalizadas, setTxPersonalizadas] = useState([])

  // Generar transacciones base desde KPIs del contexto (dinámico)
  const txBase = useMemo(() => generarTransaccionesDesdeKpis(datosBase), [datosBase])

  // Lista completa: personalizadas primero
  const todasTx = useMemo(() => [...txPersonalizadas, ...txBase], [txPersonalizadas, txBase])

  // Filtrar por tipo
  const txFiltradas = useMemo(() => {
    if (filtro === 'Todos') return todasTx
    return todasTx.filter((t) => t.tipo === filtro)
  }, [todasTx, filtro])

  // Totales por tipo
  const totales = useMemo(() => ({
    ingresos:   todasTx.filter((t) => t.tipo === 'Ingreso').reduce((s, t) => s + t.monto, 0),
    gastos:     Math.abs(todasTx.filter((t) => t.tipo === 'Gasto').reduce((s, t) => s + t.monto, 0)),
    inversiones: Math.abs(todasTx.filter((t) => t.tipo === 'Inversión').reduce((s, t) => s + t.monto, 0)),
  }), [todasTx])

  const agregarNueva = (datos) => {
    setTxPersonalizadas((prev) => agregarTransaccion(datos, prev))
  }

  const exportarCSV = () => {
    const cabecera = ['ID', 'Fecha', 'Concepto', 'Categoría', 'Tipo', 'Monto', 'Estado', 'Confianza']
    const filas = txFiltradas.map((t) =>
      [t.id, t.fecha, `"${t.concepto}"`, t.categoria, t.tipo, t.monto, t.estado, t.confianza].join(',')
    )
    const csv = [cabecera.join(','), ...filas].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href     = url
    link.download = `transacciones-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const FILTROS = ['Todos', 'Ingreso', 'Gasto', 'Inversión']

  return (
    <div className="dashboard-page fade-in">
      <header className="page-header">
        <div className="page-header__texto">
          <h2>Transacciones</h2>
          <p className="page-header__dinamico" style={{ padding: '0', background: 'transparent', border: 'none', color: '#cbd5e1' }}>
            Clasificación automática basada en concepto y monto
          </p>
        </div>
        <div className="page-header__acciones">
          <button className="btn-editar-kpis" onClick={() => setMostrarForm(!mostrarForm)}>
            <Icono nombre="editar" tamaño={15} />
            {mostrarForm ? 'Cancelar' : 'Agregar Transacción'}
          </button>
          <button className="btn-editar-kpis" onClick={exportarCSV}>
            <Icono nombre="exportar" tamaño={15} />
            Exportar CSV
          </button>
        </div>
      </header>

      {/* Resumen de totales */}
      <div className="tx-totales">
        <div className="tx-total tx-total--ingreso">
          <Icono nombre="rentabilidad" tamaño={16} />
          <div>
            <span className="tx-total__etiqueta">Total Ingresos</span>
            <span className="tx-total__valor">
              {totales.ingresos.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
        <div className="tx-total tx-total--gasto">
          <Icono nombre="eficiencia" tamaño={16} />
          <div>
            <span className="tx-total__etiqueta">Total Gastos</span>
            <span className="tx-total__valor">
              {totales.gastos.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
        <div className="tx-total tx-total--inversion">
          <Icono nombre="crecimiento" tamaño={16} />
          <div>
            <span className="tx-total__etiqueta">Total Inversiones</span>
            <span className="tx-total__valor">
              {totales.inversiones.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>

      {/* Formulario nueva transacción */}
      {mostrarForm && (
        <div className="card-pantalla-limpia" style={{ animation: 'deslizarAbajo 0.3s ease' }}>
          <FormNuevaTransaccion alAgregar={agregarNueva} alCerrar={() => setMostrarForm(false)} />
        </div>
      )}

      {/* Filtros */}
      <div className="tx-filtros">
        {FILTROS.map((f) => (
          <button
            key={f}
            className={`tx-filtro-btn ${filtro === f ? 'tx-filtro-btn--activo' : ''}`}
            onClick={() => setFiltro(f)}
          >
            {f}
            <span className="tx-filtro-count">
              {f === 'Todos' ? todasTx.length : todasTx.filter((t) => t.tipo === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="card-pantalla-limpia">
        <table className="tabla-limpia">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Concepto</th>
              <th>Tipo IA</th>
              <th>Monto</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {txFiltradas.map((tx) => (
              <tr key={tx.id}>
                <td style={{ color: 'var(--color-texto-muy-suave)', fontWeight: 600, fontSize: '12px' }}>{tx.id}</td>
                <td style={{ color: 'var(--color-texto-suave)', fontSize: '12px', whiteSpace: 'nowrap' }}>{tx.fecha}</td>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--color-texto)' }}>
                    {tx.concepto}
                    <BadgeConfianza confianza={tx.confianza} />
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-texto-muy-suave)', marginTop: '2px' }}>
                    {tx.categoria}
                  </div>
                </td>
                <td><BadgeTipo tipo={tx.tipo} /></td>
                <td style={{ fontWeight: 700, color: tx.monto > 0 ? 'var(--color-excelente)' : 'var(--color-critico)', whiteSpace: 'nowrap' }}>
                  {tx.monto > 0 ? '+' : ''}{tx.monto.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                </td>
                <td><BadgeEstado estado={tx.estado} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {txFiltradas.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--espacio-8)', color: 'var(--color-texto-muy-suave)' }}>
            No hay transacciones de tipo «{filtro}»
          </div>
        )}
      </div>
    </div>
  )
}

export default Transacciones
