import { useState } from 'react'
import Icono from '../Icono/Icono'
import './EntradaKpis.css'

const KPI_INICIALES = {
  ingresoTotal:       50000,
  costoTotal:         35000,
  margenNeto:         30,
  margenBruto:        45,
  ROI:                42.5,
  puntoEquilibrio:    15000,
  ventasActuales:     50000,
  ventasAnterior:     47500,
  crecimientoMensual: 5.2,
  costosFijos:        12000,
  costosVariables:    23000,
  capitalInvertido:   100000,
  activos:            150000,
  pasivos:            50000,
  deuda:              30000,
  flujoEfectivo:      8000,
}

const GRUPOS_CAMPOS = [
  {
    titulo: 'Ingresos y Márgenes',
    icono: 'rentabilidad',
    campos: [
      { clave: 'ingresoTotal',  etiqueta: 'Ingreso Total',   prefijo: '$', descripcion: 'Ventas brutas del período' },
      { clave: 'costoTotal',    etiqueta: 'Costo Total',     prefijo: '$', descripcion: 'Suma de todos los costos' },
      { clave: 'margenNeto',    etiqueta: 'Margen Neto',     sufijo:  '%', descripcion: 'Ganancia neta / Ingresos × 100' },
      { clave: 'margenBruto',   etiqueta: 'Margen Bruto',    sufijo:  '%', descripcion: 'Ganancia bruta / Ingresos × 100' },
    ],
  },
  {
    titulo: 'Costos y Estructura',
    icono: 'eficiencia',
    campos: [
      { clave: 'costosFijos',     etiqueta: 'Costos Fijos',     prefijo: '$', descripcion: 'Renta, nómina base, seguros' },
      { clave: 'costosVariables', etiqueta: 'Costos Variables', prefijo: '$', descripcion: 'Materiales, comisiones, envíos' },
      { clave: 'puntoEquilibrio', etiqueta: 'Punto de Equilibrio', prefijo: '$', descripcion: 'Ventas mínimas para no perder' },
    ],
  },
  {
    titulo: 'Crecimiento y Ventas',
    icono: 'crecimiento',
    campos: [
      { clave: 'ventasActuales',     etiqueta: 'Ventas Actuales',      prefijo: '$', descripcion: 'Total ventas del período actual' },
      { clave: 'ventasAnterior',     etiqueta: 'Ventas Período Ant.',  prefijo: '$', descripcion: 'Total ventas período anterior' },
      { clave: 'crecimientoMensual', etiqueta: 'Crecimiento Mensual',  sufijo:  '%', descripcion: '(Actual - Anterior) / Anterior × 100' },
    ],
  },
  {
    titulo: 'Capital e Inversión',
    icono: 'dinero',
    campos: [
      { clave: 'capitalInvertido', etiqueta: 'Capital Invertido', prefijo: '$', descripcion: 'Total de capital propio + financiado' },
      { clave: 'activos',          etiqueta: 'Activos Totales',   prefijo: '$', descripcion: 'Suma de todos los activos' },
      { clave: 'ROI',              etiqueta: 'ROI',               sufijo:  '%', descripcion: 'Ganancia neta / Capital invertido × 100' },
      { clave: 'flujoEfectivo',    etiqueta: 'Flujo de Efectivo', prefijo: '$', descripcion: 'Efectivo neto generado en el período' },
    ],
  },
  {
    titulo: 'Deuda y Sostenibilidad',
    icono: 'sostenibilidad',
    campos: [
      { clave: 'pasivos', etiqueta: 'Pasivos Totales',  prefijo: '$', descripcion: 'Suma de todas las obligaciones' },
      { clave: 'deuda',   etiqueta: 'Deuda Financiera', prefijo: '$', descripcion: 'Préstamos y créditos bancarios' },
    ],
  },
]

const CampoKpi = ({ campo, valor, alCambiar }) => {
  const tienePrefijo = !!campo.prefijo
  const tieneSufijo  = !!campo.sufijo
  return (
    <div className="campo-kpi">
      <label className="campo-kpi__etiqueta" htmlFor={`campo-${campo.clave}`}>{campo.etiqueta}</label>
      {campo.descripcion && <span className="campo-kpi__descripcion">{campo.descripcion}</span>}
      <div className="campo-kpi__input-wrapper">
        {tienePrefijo && <span className="campo-kpi__prefijo">{campo.prefijo}</span>}
        <input
          id={`campo-${campo.clave}`}
          type="number"
          step="any"
          value={valor}
          onChange={(e) => alCambiar(campo.clave, parseFloat(e.target.value) || 0)}
          className={['campo-kpi__input', tienePrefijo ? 'campo-kpi__input--con-prefijo' : '', tieneSufijo ? 'campo-kpi__input--con-sufijo' : ''].join(' ')}
        />
        {tieneSufijo && <span className="campo-kpi__sufijo">{campo.sufijo}</span>}
      </div>
    </div>
  )
}

const EntradaKpis = ({ alEnviar, alCancelar, kpisIniciales = KPI_INICIALES }) => {
  const [valoresLocales, setValoresLocales] = useState({ ...kpisIniciales })

  const actualizarCampo = (clave, valor) => {
    setValoresLocales((prev) => ({ ...prev, [clave]: valor }))
  }

  const restablecer = () => setValoresLocales({ ...KPI_INICIALES })

  const enviarAnalisis = (e) => {
    e.preventDefault()
    if (typeof alEnviar === 'function') alEnviar(valoresLocales)
  }

  return (
    <section className="entrada-kpis" aria-label="Formulario de entrada de KPIs">
      <form onSubmit={enviarAnalisis} noValidate>
        <div className="entrada-kpis__encabezado">
          <div>
            <h2 className="entrada-kpis__titulo">
              <Icono nombre="editar" tamaño={20} clase="nivel-bueno" />
              Configurar KPIs
            </h2>
            <p className="entrada-kpis__subtitulo">Ingresa los indicadores financieros del período a analizar</p>
          </div>
        </div>

        <div className="entrada-kpis__grupos">
          {GRUPOS_CAMPOS.map((grupo) => (
            <div key={grupo.titulo} className="grupo-campos">
              <h3 className="grupo-campos__titulo">
                <Icono nombre={grupo.icono} tamaño={14} />
                {grupo.titulo}
              </h3>
              {grupo.campos.map((campo) => (
                <CampoKpi
                  key={campo.clave}
                  campo={campo}
                  valor={valoresLocales[campo.clave] ?? 0}
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
            Restablecer valores
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
