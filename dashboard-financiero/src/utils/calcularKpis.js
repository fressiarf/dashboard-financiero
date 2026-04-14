/**
 * calcularKpis.js
 * Calcula todos los KPIs derivados a partir de datos base.
 * El usuario solo ingresa: ingresos, costos fijos, costos variables,
 * capital invertido, ventas del período anterior, activos, pasivos, deuda y flujo de efectivo.
 */

const dividirSeguro = (num, den, def = 0) => (!den || !isFinite(den) ? def : num / den)

/**
 * Calcula el margen bruto (%).
 * Margen Bruto = (Ingresos - Costos Variables) / Ingresos × 100
 */
export const calcularMargenBruto = (ingresos, costosVariables) => {
  const gananciaB = ingresos - costosVariables
  return dividirSeguro(gananciaB, ingresos) * 100
}

/**
 * Calcula el margen neto (%).
 * Margen Neto = (Ingresos - Costos Totales) / Ingresos × 100
 */
export const calcularMargenNeto = (ingresos, costosFijos, costosVariables) => {
  const costoTotal = costosFijos + costosVariables
  const gananciaN = ingresos - costoTotal
  return dividirSeguro(gananciaN, ingresos) * 100
}

/**
 * Calcula el ROI (%).
 * ROI = (Ganancia Neta / Capital Invertido) × 100
 */
export const calcularROI = (ingresos, costosFijos, costosVariables, capitalInvertido) => {
  const gananciaN = ingresos - (costosFijos + costosVariables)
  return dividirSeguro(gananciaN, capitalInvertido) * 100
}

/**
 * Calcula el punto de equilibrio en unidades monetarias.
 * PE = Costos Fijos / Margen de Contribución
 * Margen de Contribución = (Ingresos - Costos Variables) / Ingresos
 */
export const calcularPuntoEquilibrio = (costosFijos, ingresos, costosVariables) => {
  const margenContribucion = dividirSeguro(ingresos - costosVariables, ingresos)
  if (margenContribucion <= 0) return 0
  return Math.round(costosFijos / margenContribucion)
}

/**
 * Calcula el crecimiento mensual (%).
 * Crecimiento = (Ventas Actuales - Ventas Anterior) / Ventas Anterior × 100
 */
export const calcularCrecimientoMensual = (ventasActuales, ventasAnterior) => {
  return dividirSeguro(ventasActuales - ventasAnterior, ventasAnterior) * 100
}

/**
 * Función principal: recibe datos base y devuelve todos los KPIs completos
 * listos para ser consumidos por el analizadorFinanciero.
 *
 * @param {Object} datosBase
 * @returns {Object} kpis completos
 */
export const calcularTodosLosKpis = (datosBase) => {
  const {
    ingresos          = 0,
    costosFijos       = 0,
    costosVariables   = 0,
    capitalInvertido  = 0,
    ventasAnterior    = 0,
    activos           = 0,
    pasivos           = 0,
    deuda             = 0,
    flujoEfectivo     = 0,
  } = datosBase

  const costoTotal  = costosFijos + costosVariables
  const margenBruto = calcularMargenBruto(ingresos, costosVariables)
  const margenNeto  = calcularMargenNeto(ingresos, costosFijos, costosVariables)
  const ROI         = calcularROI(ingresos, costosFijos, costosVariables, capitalInvertido)
  const puntoEquilibrio   = calcularPuntoEquilibrio(costosFijos, ingresos, costosVariables)
  const crecimientoMensual = calcularCrecimientoMensual(ingresos, ventasAnterior)

  return {
    // Ingresos y costos
    ingresoTotal:       ingresos,
    costoTotal,
    costosFijos,
    costosVariables,

    // KPIs derivados (calculados automáticamente)
    margenBruto:        parseFloat(margenBruto.toFixed(2)),
    margenNeto:         parseFloat(margenNeto.toFixed(2)),
    ROI:                parseFloat(ROI.toFixed(2)),
    puntoEquilibrio,

    // Ventas y crecimiento
    ventasActuales:     ingresos,
    ventasAnterior,
    crecimientoMensual: parseFloat(crecimientoMensual.toFixed(2)),

    // Inversión y sostenibilidad
    capitalInvertido,
    activos,
    pasivos,
    deuda,
    flujoEfectivo,
  }
}

/**
 * Valores demo para inicio del dashboard.
 */
export const DATOS_BASE_INICIALES = {
  ingresos:         50000,
  costosFijos:      12000,
  costosVariables:  23000,
  capitalInvertido: 100000,
  ventasAnterior:   47500,
  activos:          150000,
  pasivos:          50000,
  deuda:            30000,
  flujoEfectivo:    8000,
}
