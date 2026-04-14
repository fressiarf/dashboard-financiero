/**
 * clasificadorTransacciones.js
 * Clasifica automáticamente transacciones financieras en:
 * - Ingreso
 * - Gasto
 * - Inversión
 *
 * Basado en palabras clave de la descripción y reglas de monto.
 */

const PALABRAS_INGRESO = [
  'pago cliente', 'abono cliente', 'cobro', 'venta', 'ingreso', 'factura cobrada',
  'transferencia recibida', 'deposito', 'depósito', 'mrr', 'suscripcion', 'suscripción',
  'honorarios recibidos', 'comision recibida', 'comisión recibida', 'reembolso',
  'dividendo', 'renta cobrada', 'liquidacion', 'liquidación',
]

const PALABRAS_INVERSION = [
  'equipo', 'servidor', 'infraestructura', 'aws', 'azure', 'gcp', 'hosting',
  'licencia', 'software', 'herramienta', 'capacitacion', 'capacitación', 'curso',
  'maquinaria', 'activo', 'instalacion', 'instalación', 'mejora', 'upgrade',
  'remodelacion', 'remodelación', 'adquisicion', 'adquisición', 'pyme', 'expansión',
]

const PALABRAS_GASTO = [
  'nomina', 'nómina', 'renta', 'electricidad', 'agua', 'gas', 'telefono', 'teléfono',
  'internet', 'seguro', 'marketing', 'publicidad', 'google ads', 'facebook ads',
  'mantenimiento', 'limpieza', 'papeleria', 'papelería', 'suministros', 'viaje',
  'transporte', 'comida', 'alimentacion', 'alimentación', 'servicio', 'suscripcion tech',
  'stripe', 'impuesto', 'multa', 'proveedor', 'material',
]

const normalizar = (texto) => texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

/**
 * Clasifica una transacción individual.
 * @param {{ concepto: string, monto: number }} transaccion
 * @returns {{ tipo: 'Ingreso'|'Gasto'|'Inversión', confianza: 'alta'|'media'|'baja' }}
 */
export const clasificarTransaccion = (transaccion) => {
  const texto = normalizar(transaccion.concepto || '')
  const monto = transaccion.monto ?? 0

  // Regla 1: Monto positivo implica ingreso, negativo implica salida
  const esEntrada = monto > 0
  const esSalida  = monto < 0

  // Verificar coincidencias de palabras clave
  const coincideIngreso   = PALABRAS_INGRESO.some((p)   => texto.includes(normalizar(p)))
  const coincideInversion = PALABRAS_INVERSION.some((p) => texto.includes(normalizar(p)))
  const coincideGasto     = PALABRAS_GASTO.some((p)     => texto.includes(normalizar(p)))

  // Lógica de clasificación con confianza
  if (esEntrada && coincideIngreso)     return { tipo: 'Ingreso',   confianza: 'alta' }
  if (esEntrada && !coincideInversion)  return { tipo: 'Ingreso',   confianza: monto > 5000 ? 'alta' : 'media' }

  if (esSalida && coincideInversion)    return { tipo: 'Inversión', confianza: 'alta' }
  if (esSalida && coincideGasto)        return { tipo: 'Gasto',     confianza: 'alta' }

  // Si es salida grande, probablemente inversión; pequeña, gasto
  if (esSalida) {
    const montoAbs = Math.abs(monto)
    if (montoAbs > 20000) return { tipo: 'Inversión', confianza: 'media' }
    return { tipo: 'Gasto', confianza: 'media' }
  }

  // Fallback
  return { tipo: monto >= 0 ? 'Ingreso' : 'Gasto', confianza: 'baja' }
}

/**
 * Genera un ID único para transacciones
 */
const generarId = (indice) => `TRX-${String(9900 - indice).padStart(4, '0')}`

/**
 * Construye una lista dinámica de transacciones a partir de los datos base del dashboard.
 * Genera transacciones representativas del período analizado.
 *
 * @param {Object} datosBase - { ingresos, costosFijos, costosVariables, flujoEfectivo, ... }
 * @returns {Array} Lista de transacciones clasificadas
 */
export const generarTransaccionesDesdeKpis = (datosBase) => {
  const { ingresos = 0, costosFijos = 0, costosVariables = 0, flujoEfectivo = 0 } = datosBase

  const plantilla = [
    { concepto: 'Abono Cliente Enterprise SA',    categoria: 'Ingresos B2B',       monto:  ingresos * 0.37,           estado: 'completado', fecha: 'Hoy, 10:42 AM' },
    { concepto: 'Suscripciones MRR Plataforma',  categoria: 'Suscripciones',       monto:  ingresos * 0.25,           estado: 'completado', fecha: 'Hoy, 09:15 AM' },
    { concepto: 'Pago Factura Servicios Cloud',   categoria: 'Infraestructura',     monto: -(costosFijos * 0.15),      estado: 'completado', fecha: 'Ayer, 16:30 PM' },
    { concepto: 'Nómina Quincenal',               categoria: 'Recursos Humanos',    monto: -(costosFijos * 0.55),      estado: 'completado', fecha: 'Ayer, 11:20 AM' },
    { concepto: 'Publicidad Google Ads',          categoria: 'Marketing',           monto: -(costosVariables * 0.12),  estado: 'completado', fecha: 'Hace 2 días' },
    { concepto: 'Cobro Proyecto Desarrollo',      categoria: 'Servicios',           monto:  ingresos * 0.20,           estado: 'pendiente',  fecha: 'Hace 2 días' },
    { concepto: 'Licencias Software Equipo',      categoria: 'Infraestructura',     monto: -(costosVariables * 0.08),  estado: 'completado', fecha: 'Hace 3 días' },
    { concepto: 'Renta Oficinas',                 categoria: 'Costos Fijos',        monto: -(costosFijos * 0.25),      estado: 'completado', fecha: 'Hace 3 días' },
    { concepto: 'Ingreso Consultoría Externa',    categoria: 'Honorarios',          monto:  ingresos * 0.10,           estado: 'completado', fecha: 'Hace 4 días' },
    { concepto: 'Suministros y Materiales',       categoria: 'Operaciones',         monto: -(costosVariables * 0.15),  estado: 'completado', fecha: 'Hace 4 días' },
    { concepto: 'Transferencia recibida cliente', categoria: 'Ingresos',            monto:  ingresos * 0.08,           estado: 'pendiente',  fecha: 'Hace 5 días' },
    { concepto: 'Flujo neto período anterior',    categoria: 'Liquidez',            monto:  flujoEfectivo,             estado: 'completado', fecha: 'Hace 7 días' },
  ]

  return plantilla
    .filter((t) => Math.abs(t.monto) > 1)
    .map((t, i) => {
      const clasificacion = clasificarTransaccion(t)
      return {
        ...t,
        id: generarId(i),
        monto: parseFloat(t.monto.toFixed(2)),
        tipo: clasificacion.tipo,
        confianza: clasificacion.confianza,
      }
    })
}

/**
 * Agrega una nueva transacción personalizada, la clasifica y la retorna.
 * @param {Object} datosTransaccion - { concepto, monto, fecha? }
 * @returns {Object} Transacción clasificada
 */
export const agregarTransaccion = (datosTransaccion, listaActual = []) => {
  const clasificacion = clasificarTransaccion(datosTransaccion)
  const nueva = {
    id: generarId(listaActual.length),
    fecha: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
    estado: 'pendiente',
    categoria: clasificacion.tipo,
    ...datosTransaccion,
    tipo: clasificacion.tipo,
    confianza: clasificacion.confianza,
  }
  return [nueva, ...listaActual]
}
