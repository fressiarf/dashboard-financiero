import { useState } from 'react'
import Icono from '../Icono/Icono'
import { calcularTodosLosKpis, DATOS_BASE_INICIALES } from '../../utils/calcularKpis'
import './EntradaKpis.css'

// ─── Grupos de campos base (solo inputs del usuario) ────────────────────────

const GRUPOS_CAMPOS = [
  {
    titulo: 'Ingresos del Período',
    icono: 'rentabilidad',
    descripcionGrupo: 'Datos de ventas y liquidez',
    campos: [
      { clave: 'ingresos',       etiqueta: 'Ingresos Totales',   prefijo: '$', descripcion: 'Total de ventas brutas del período' },
      { clave: 'ventasAnterior', etiqueta: 'Ventas Período Ant.', prefijo: '$', descripcion: 'Total de ventas del período previo' },
      { clave: 'flujoEfectivo',  etiqueta: 'Flujo de Efectivo',  prefijo: '$', descripcion: 'Efectivo neto generado en el período' },
    ],
  },
  {
    titulo: 'Estructura de Costos',
    icono: 'eficiencia',
    descripcionGrupo: 'Costos fijos y variables',
    campos: [
      { clave: 'costosFijos',     etiqueta: 'Costos Fijos',     prefijo: '$', descripcion: 'Renta, nómina base, seguros (no cambian con ventas)' },
      { clave: 'costosVariables', etiqueta: 'Costos Variables', prefijo: '$', descripcion: 'Materiales, comisiones, envíos (proporcionales a ventas)' },
    ],
  },
  {
    titulo: 'Capital e Inversión',
    icono: 'dinero',
    descripcionGrupo: 'Recursos y estructura financiera',
    campos: [
      { clave: 'capitalInvertido', etiqueta: 'Capital Invertido', prefijo: '$', descripcion: 'Total de capital propio + financiado' },
      { clave: 'activos',          etiqueta: 'Activos Totales',   prefijo: '$', descripcion: 'Suma de todos los activos de la empresa' },
    ],
  },
  {
    titulo: 'Deuda y Pasivos',
    icono: 'sostenibilidad',
    descripcionGrupo: 'Sostenibilidad financiera',
    campos: [
      { clave: 'pasivos', etiqueta: 'Pasivos Totales',  prefijo: '$', descripcion: 'Suma de todas las obligaciones y deudas' },
      { clave: 'deuda',   etiqueta: 'Deuda Financiera', prefijo: '$', descripcion: 'Préstamos y créditos bancarios vigentes' },
    ],
  },
]

// ─── Sub-componente: Campo individual ───────────────────────────────────────

const CampoKpi = ({ campo, valor, alCambiar }) => (
  <div className="campo-kpi">
    <label className="campo-kpi__etiqueta" htmlFor={`campo-${campo.clave}`}>{campo.etiqueta}</label>
    {campo.descripcion && <span className="campo-kpi__descripcion">{campo.descripcion}</span>}
    <div className="campo-kpi__input-wrapper">
      {campo.prefijo && <span className="campo-kpi__prefijo">{campo.prefijo}</span>}
      <input
        id={`campo-${campo.clave}`}
        type="number"
        step="any"
        min="0"
        value={valor}
        onChange={(e) => alCambiar(campo.clave, parseFloat(e.target.value) || 0)}
        className={`campo-kpi__input ${campo.prefijo ? 'campo-kpi__input--con-prefijo' : ''}`}
      />
    </div>
  </div>
)

// ─── Sub-componente: Preview de KPI derivado ────────────────────────────────

const KpiDerivado = ({ etiqueta, valor, icono, positivo }) => (
  <div className={`kpi-derivado ${positivo ? 'kpi-derivado--positivo' : 'kpi-derivado--neutro'}`}>
    <Icono nombre={icono} tamaño={14} />
    <div className="kpi-derivado__info">
      <span className="kpi-derivado__etiqueta">{etiqueta}</span>
      <span className="kpi-derivado__valor">{valor}</span>
    </div>
  </div>
)

// ─── Componente principal ────────────────────────────────────────────────────

const EntradaKpis = ({ alEnviar, alCancelar, datosBaseIniciales = DATOS_BASE_INICIALES }) => {
  const [valores, setValores] = useState({ ...datosBaseIniciales })

  const actualizarCampo = (clave, valor) =>
    setValores((prev) => ({ ...prev, [clave]: valor }))

  const restablecer = () => setValores({ ...DATOS_BASE_INICIALES })

  const enviar = (e) => {
    e.preventDefault()
    if (typeof alEnviar === 'function') alEnviar(valores)
  }

  // Vista previa de KPIs en tiempo real mientras el usuario escribe
  const preview = calcularTodosLosKpis(valores)

  const kpisPreview = [
    { etiqueta: 'Margen Bruto',       valor: `${preview.margenBruto.toFixed(1)}%`,                  icono: 'rentabilidad',  positivo: preview.margenBruto > 20 },
    { etiqueta: 'Margen Neto',        valor: `${preview.margenNeto.toFixed(1)}%`,                   icono: 'rentabilidad',  positivo: preview.margenNeto > 10 },
    { etiqueta: 'ROI',                valor: `${preview.ROI.toFixed(1)}%`,                          icono: 'calificacion',  positivo: preview.ROI > 15 },
    { etiqueta: 'Punto de Equilibrio',valor: `$${preview.puntoEquilibrio.toLocaleString('es-MX')}`, icono: 'eficiencia',    positivo: preview.puntoEquilibrio < preview.ingresoTotal },
    { etiqueta: 'Crecimiento',        valor: `${preview.crecimientoMensual.toFixed(1)}%`,           icono: 'crecimiento',   positivo: preview.crecimientoMensual > 0 },
  ]

  return (
    <section className="entrada-kpis" aria-label="Formulario de entrada de datos financieros">
      <form onSubmit={enviar} noValidate>
        <div className="entrada-kpis__encabezado">
          <div>
            <h2 className="entrada-kpis__titulo">
              <Icono nombre="editar" tamaño={20} clase="nivel-bueno" />
              Datos Financieros Base
            </h2>
            <p className="entrada-kpis__subtitulo">
              Ingresa los datos del período — los KPIs se calculan automáticamente
            </p>
          </div>
        </div>

        {/* Preview en tiempo real de KPIs derivados */}
        <div className="entrada-kpis__preview">
          <p className="entrada-kpis__preview-titulo">
            <Icono nombre="calificacion" tamaño={13} />
            KPIs calculados automáticamente
          </p>
          <div className="entrada-kpis__preview-grid">
            {kpisPreview.map((k) => (
              <KpiDerivado key={k.etiqueta} {...k} />
            ))}
          </div>
        </div>

        <div className="entrada-kpis__grupos">
          {GRUPOS_CAMPOS.map((grupo) => (
            <div key={grupo.titulo} className="grupo-campos">
              <h3 className="grupo-campos__titulo">
                <Icono nombre={grupo.icono} tamaño={14} />
                {grupo.titulo}
                <span className="grupo-campos__desc">{grupo.descripcionGrupo}</span>
              </h3>
              {grupo.campos.map((campo) => (
                <CampoKpi
                  key={campo.clave}
                  campo={campo}
                  valor={valores[campo.clave] ?? 0}
                  alCambiar={actualizarCampo}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="entrada-kpis__acciones">
          {typeof alCancelar === 'function' && (
            <button type="button" className="btn-restablecer" onClick={alCancelar}>
              <Icono nombre="cerrar" tamaño={14} />
              Cancelar
            </button>
          )}
          <button type="button" className="btn-restablecer" onClick={restablecer}>
            <Icono nombre="editar" tamaño={14} />
            Restablecer
          </button>
          <button id="btn-analizar" type="submit" className="btn-analizar">
            <Icono nombre="calificacion" tamaño={15} />
            Ejecutar Análisis
          </button>
        </div>
      </form>
    </section>
  )
}

export default EntradaKpis
