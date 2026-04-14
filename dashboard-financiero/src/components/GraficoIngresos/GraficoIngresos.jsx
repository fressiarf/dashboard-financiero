import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
} from 'recharts'
import Icono from '../Icono/Icono'
import './GraficoIngresos.css'

// ─── Tooltip personalizado ──────────────────────────────────────────────────

const TooltipPersonalizado = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="grafico-tooltip">
      <p className="grafico-tooltip__titulo">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="grafico-tooltip__fila">
          <span className="grafico-tooltip__dot" style={{ background: entry.color }} />
          <span className="grafico-tooltip__nombre">{entry.name}</span>
          <span className="grafico-tooltip__valor">
            {Number(entry.value).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Leyenda personalizada ──────────────────────────────────────────────────

const LeyendaPersonalizada = ({ payload }) => (
  <div className="grafico-leyenda">
    {payload?.map((entry) => (
      <div key={entry.value} className="grafico-leyenda__item">
        <span className="grafico-leyenda__color" style={{ background: entry.color }} />
        <span>{entry.value}</span>
      </div>
    ))}
  </div>
)

// ─── Formateador de eje Y ───────────────────────────────────────────────────

const formatearEjeY = (valor) => {
  if (valor >= 1_000_000) return `$${(valor / 1_000_000).toFixed(1)}M`
  if (valor >= 1_000)     return `$${(valor / 1_000).toFixed(0)}K`
  return `$${valor}`
}

// ─── Componente principal ───────────────────────────────────────────────────

const GraficoIngresos = ({ kpis }) => {
  if (!kpis) return null

  const {
    ingresoTotal      = 0,
    costoTotal        = 0,
    costosFijos       = 0,
    costosVariables   = 0,
    puntoEquilibrio   = 0,
    margenBruto       = 0,
    margenNeto        = 0,
    ventasAnterior    = 0,
  } = kpis

  const gananciaB = ingresoTotal - costosVariables
  const gananciaN = ingresoTotal - costoTotal

  // Datos para el gráfico de barras comparativo
  const datosBarras = [
    {
      nombre: 'Período Ant.',
      Ingresos: ventasAnterior,
      Gastos:   ventasAnterior * (costoTotal / (ingresoTotal || 1)),
    },
    {
      nombre: 'Actual',
      Ingresos: ingresoTotal,
      Gastos:   costoTotal,
    },
  ]

  // Datos para la distribución de costos
  const datosComposicion = [
    { nombre: 'Costos Fijos',     valor: costosFijos,     porcentaje: ingresoTotal > 0 ? ((costosFijos / ingresoTotal) * 100).toFixed(1) : 0 },
    { nombre: 'Costos Variables', valor: costosVariables,  porcentaje: ingresoTotal > 0 ? ((costosVariables / ingresoTotal) * 100).toFixed(1) : 0 },
    { nombre: 'Ganancia Bruta',  valor: Math.max(0, gananciaB), porcentaje: ingresoTotal > 0 ? Math.max(0, margenBruto).toFixed(1) : 0 },
  ]

  // Tarjetas KPI del gráfico
  const tarjetas = [
    {
      etiqueta: 'Ingresos',
      valor: ingresoTotal.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }),
      color: 'var(--color-primario-claro)',
      icono: 'rentabilidad',
    },
    {
      etiqueta: 'Gastos Totales',
      valor: costoTotal.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }),
      color: 'var(--color-critico)',
      icono: 'eficiencia',
    },
    {
      etiqueta: 'Ganancia Neta',
      valor: gananciaN.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }),
      color: gananciaN >= 0 ? 'var(--color-excelente)' : 'var(--color-critico)',
      icono: 'crecimiento',
      resaltar: true,
    },
    {
      etiqueta: 'Pto. Equilibrio',
      valor: puntoEquilibrio.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }),
      color: 'var(--color-advertencia)',
      icono: 'sostenibilidad',
    },
  ]

  return (
    <section className="grafico-ingresos" aria-labelledby="titulo-grafico">
      {/* Encabezado */}
      <div className="grafico-ingresos__header">
        <div className="grafico-ingresos__titulo-wrap">
          <Icono nombre="crecimiento" tamaño={20} clase="nivel-bueno" />
          <div>
            <h2 id="titulo-grafico" className="grafico-ingresos__titulo">Ingresos vs. Gastos</h2>
            <p className="grafico-ingresos__subtitulo">Comparativa del período actual vs anterior</p>
          </div>
        </div>
        <div className="grafico-ingresos__badges">
          <span className={`grafico-badge ${margenNeto > 0 ? 'grafico-badge--positivo' : 'grafico-badge--negativo'}`}>
            Margen Neto {margenNeto.toFixed(1)}%
          </span>
          <span className={`grafico-badge ${margenBruto > 20 ? 'grafico-badge--positivo' : 'grafico-badge--neutro'}`}>
            Margen Bruto {margenBruto.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Tarjetas KPI rápidas */}
      <div className="grafico-kpis">
        {tarjetas.map((t) => (
          <div key={t.etiqueta} className={`grafico-kpi-card ${t.resaltar ? 'grafico-kpi-card--resaltado' : ''}`}
               style={{ '--card-color': t.color }}>
            <Icono nombre={t.icono} tamaño={14} style={{ color: t.color }} />
            <div>
              <span className="grafico-kpi-card__etiqueta">{t.etiqueta}</span>
              <span className="grafico-kpi-card__valor" style={{ color: t.color }}>{t.valor}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Gráfico de barras */}
      <div className="grafico-ingresos__chart-wrap">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={datosBarras} margin={{ top: 10, right: 20, left: 10, bottom: 5 }} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="nombre"
              tick={{ fill: 'var(--color-texto-suave)', fontSize: 12, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatearEjeY}
              tick={{ fill: 'var(--color-texto-muy-suave)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={70}
            />
            <Tooltip content={<TooltipPersonalizado />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Legend content={<LeyendaPersonalizada />} />
            <ReferenceLine
              y={puntoEquilibrio}
              stroke="var(--color-advertencia)"
              strokeDasharray="5 4"
              strokeWidth={1.5}
              label={{ value: 'PE', fill: 'var(--color-advertencia)', fontSize: 10, fontWeight: 700 }}
            />
            <Bar dataKey="Ingresos" radius={[6, 6, 0, 0]} maxBarSize={80}>
              {datosBarras.map((_, i) => (
                <Cell key={i} fill={i === 1 ? '#4c6ef5' : 'rgba(76,110,245,0.4)'} />
              ))}
            </Bar>
            <Bar dataKey="Gastos" radius={[6, 6, 0, 0]} maxBarSize={80}>
              {datosBarras.map((_, i) => (
                <Cell key={i} fill={i === 1 ? '#f43f5e' : 'rgba(244,63,94,0.4)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Distribución de costos */}
      <div className="grafico-composicion">
        <p className="grafico-composicion__titulo">
          <Icono nombre="eficiencia" tamaño={13} />
          Composición del ingreso
        </p>
        <div className="grafico-composicion__barra-fondo">
          {datosComposicion.map((item, i) => {
            const colores = ['var(--color-critico)', 'var(--color-advertencia)', 'var(--color-excelente)']
            return (
              <div
                key={item.nombre}
                className="grafico-composicion__segmento"
                style={{ width: `${item.porcentaje}%`, background: colores[i] }}
                title={`${item.nombre}: ${item.porcentaje}%`}
              />
            )
          })}
        </div>
        <div className="grafico-composicion__leyenda">
          {datosComposicion.map((item, i) => {
            const colores = ['var(--color-critico)', 'var(--color-advertencia)', 'var(--color-excelente)']
            return (
              <div key={item.nombre} className="grafico-composicion__item">
                <span className="grafico-composicion__dot" style={{ background: colores[i] }} />
                <span>{item.nombre}</span>
                <strong style={{ color: colores[i] }}>{item.porcentaje}%</strong>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default GraficoIngresos
