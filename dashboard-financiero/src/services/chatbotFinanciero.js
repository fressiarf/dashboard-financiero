/**
 * chatbotFinanciero.js
 * Motor de respuestas del chatbot financiero.
 * Procesa preguntas en lenguaje natural y responde con datos reales del dashboard.
 */

// ─── Base de conocimiento de preguntas y respuestas ──────────────────────────

const SALUDOS = ['hola', 'buenos', 'buenas', 'hi', 'hey', 'buen', 'saludos']
const DESPEDIDAS = ['adios', 'adiós', 'bye', 'chau', 'hasta', 'gracias', 'thank']

// Palabras clave para detectar temas
const TEMAS = {
  margenBruto:      ['margen bruto', 'margen de bruto', 'ganancia bruta', 'gross margin'],
  margenNeto:       ['margen neto', 'ganancia neta', 'utilidad neta', 'net margin'],
  roi:              ['roi', 'retorno', 'return on investment', 'rentabilidad de inversión', 'retorno de inversión'],
  puntoEquilibrio:  ['punto de equilibrio', 'break even', 'breakeven', 'equilibrio', 'punto equilibrio'],
  ingresos:         ['ingresos', 'ventas', 'revenue', 'entradas', 'cobros'],
  costos:           ['costos', 'gastos', 'egresos', 'costes', 'expenses'],
  crecimiento:      ['crecimiento', 'growth', 'aumento', 'tendencia', 'evolución', 'mensual'],
  salud:            ['salud financiera', 'salud', 'estado financiero', 'situación', 'como estoy', 'cómo estoy'],
  capitalInvertido: ['capital', 'inversión', 'invertido', 'activos', 'patrimonio'],
  deuda:            ['deuda', 'pasivos', 'obligaciones', 'préstamos'],
  flujo:            ['flujo', 'efectivo', 'cash flow', 'liquidez', 'caja'],
  kpis:             ['kpi', 'indicadores', 'métricas', 'indicador'],
  recomendacion:    ['qué hago', 'que hago', 'recomienda', 'consejo', 'sugerencia', 'cómo mejorar', 'como mejorar', 'qué debo', 'que debo'],
  ayuda:            ['ayuda', 'help', 'qué puedes', 'que puedes', 'qué haces', 'que haces', 'comandos'],
}

const normalizar = (texto) =>
  texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const detectarTema = (texto) => {
  const t = normalizar(texto)
  for (const [tema, palabras] of Object.entries(TEMAS)) {
    if (palabras.some((p) => t.includes(normalizar(p)))) return tema
  }
  return null
}

const fmt = (n, moneda = true) =>
  moneda
    ? n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })
    : `${n.toFixed(2)}%`

// ─── Generadores de respuesta por tema ──────────────────────────────────────

const respuestas = {
  saludo: () =>
    `¡Hola! Soy **Aura**, tu asistente financiero inteligente. 👋\n\nPuedo responder preguntas sobre:\n• Margen bruto y neto\n• ROI y rentabilidad\n• Punto de equilibrio\n• Ingresos y costos del período\n• Crecimiento mensual\n• Flujo de efectivo y deuda\n\n¿En qué te puedo ayudar hoy?`,

  despedida: () =>
    `¡Hasta pronto! 👋 Si tienes más dudas financieras, estaré aquí para ayudarte. ¡Éxito con tus finanzas!`,

  ayuda: () =>
    `Puedo responder preguntas sobre los datos financieros del período actual. Algunos ejemplos:\n\n• *"¿Cuál es mi margen bruto?"*\n• *"¿Cómo está mi ROI?"*\n• *"¿Cuánto es el punto de equilibrio?"*\n• *"¿Cuánto tengo de ingresos?"*\n• *"¿Cómo está mi salud financiera?"*\n• *"¿Qué me recomiendas?"*\n\nHablo español natural, así que pregúntame con tus propias palabras.`,

  margenBruto: (kpis) => {
    const mb = kpis.margenBruto
    const estado = mb > 40 ? 'excelente' : mb > 25 ? 'aceptable' : 'bajo, requiere atención'
    return `**Margen Bruto: ${fmt(mb, false)}**\n\nEste indicador mide cuánto de tus ingresos queda después de cubrir los costos variables.\n\nTu margen bruto actual es **${estado}**. ${
      mb > 40
        ? 'Estás controlando bien tus costos variables en relación a tus ventas.'
        : mb > 25
        ? 'Hay margen de mejora. Considera negociar mejores precios con proveedores.'
        : 'El margen es estrecho. Revisa urgentemente tus costos variables y estructura de precios.'
    }\n\n📊 *Fórmula: (Ingresos − Costos Variables) / Ingresos × 100*`
  },

  margenNeto: (kpis) => {
    const mn = kpis.margenNeto
    const estado = mn > 20 ? 'muy sólido' : mn > 10 ? 'saludable' : mn > 0 ? 'positivo pero ajustado' : 'negativo — operación en pérdida'
    return `**Margen Neto: ${fmt(mn, false)}**\n\nEste es el indicador más importante de rentabilidad. Mide cuánto ganas después de todos los costos y gastos.\n\nTu situación: **${estado}**. ${
      mn > 10
        ? 'La empresa está generando utilidades reales sobre sus ventas.'
        : mn > 0
        ? 'Cubres costos, pero el colchón es delgado. Una caída del 5% en ventas podría llevarte a pérdidas.'
        : 'Los costos superan los ingresos. Se necesitan acciones correctivas inmediatas.'
    }\n\n📊 *Fórmula: (Ingresos − Costos Totales) / Ingresos × 100*`
  },

  roi: (kpis) => {
    const roi = kpis.ROI
    const cap = fmt(kpis.capitalInvertido)
    const estado = roi > 30 ? 'excepcional' : roi > 15 ? 'competitivo' : roi > 0 ? 'positivo pero bajo' : 'negativo'
    return `**ROI: ${fmt(roi, false)}**\n\nEl Retorno sobre Inversión mide la rentabilidad del capital que has invertido (${cap}).\n\nTu ROI es **${estado}**. ${
      roi > 15
        ? 'El capital está trabajando bien y generando retornos atractivos.'
        : roi > 0
        ? 'El capital genera retorno, pero por debajo del umbral recomendado del 15-20% para PYMES.'
        : 'El capital invertido está generando pérdidas. Analiza qué áreas no están siendo rentables.'
    }\n\n📊 *Fórmula: (Ganancia Neta / Capital Invertido) × 100*`
  },

  puntoEquilibrio: (kpis) => {
    const pe = fmt(kpis.puntoEquilibrio)
    const va = kpis.ventasActuales
    const margenSeg = va > 0 ? (((va - kpis.puntoEquilibrio) / va) * 100).toFixed(1) : 0
    const arriba = va >= kpis.puntoEquilibrio
    return `**Punto de Equilibrio: ${pe}**\n\nEste es el nivel mínimo de ventas necesario para no perder ni ganar dinero.\n\nTus ventas actuales ${arriba ? 'están **por encima**' : 'están **por debajo**'} del punto de equilibrio.${
      arriba
        ? ` Tienes un margen de seguridad del **${margenSeg}%** sobre el break-even. Bien posicionado.`
        : ` Estás operando por debajo del umbral de sostenibilidad. Necesitas aumentar ventas o reducir costos fijos.`
    }\n\n📊 *Fórmula: Costos Fijos / Margen de Contribución*`
  },

  ingresos: (kpis) => {
    const ing = fmt(kpis.ingresoTotal)
    const ant = fmt(kpis.ventasAnterior)
    const crec = kpis.crecimientoMensual
    const tendencia = crec > 0 ? `📈 subieron un **${crec.toFixed(1)}%**` : `📉 bajaron un **${Math.abs(crec).toFixed(1)}%**`
    return `**Ingresos del período: ${ing}**\n\nComparado con el período anterior (${ant}), los ingresos ${tendencia} respecto al mes anterior.\n\n${
      crec > 5
        ? 'El crecimiento es positivo y sostenible. Buen desempeño comercial.'
        : crec >= 0
        ? 'Crecimiento modesto. Considera estrategias para acelerar las ventas.'
        : 'La contracción de ingresos es una señal de alerta. Revisa tus estrategias de ventas.'
    }`
  },

  costos: (kpis) => {
    const ct = fmt(kpis.costoTotal)
    const cf = fmt(kpis.costosFijos)
    const cv = fmt(kpis.costosVariables)
    const pcf = kpis.ingresoTotal > 0 ? ((kpis.costosFijos / kpis.ingresoTotal) * 100).toFixed(1) : 0
    const pcv = kpis.ingresoTotal > 0 ? ((kpis.costosVariables / kpis.ingresoTotal) * 100).toFixed(1) : 0
    return `**Estructura de Costos — Total: ${ct}**\n\n• 🏗️ Costos Fijos: **${cf}** (${pcf}% de los ingresos)\n• 📦 Costos Variables: **${cv}** (${pcv}% de los ingresos)\n\n${
      kpis.costoTotal < kpis.ingresoTotal
        ? 'Los costos totales están por debajo de los ingresos. La operación es rentable.'
        : 'Los costos superan los ingresos. Es crítico reducir gastos o aumentar ventas de forma urgente.'
    }`
  },

  crecimiento: (kpis) => {
    const cr = kpis.crecimientoMensual
    const va = fmt(kpis.ventasActuales)
    const vant = fmt(kpis.ventasAnterior)
    return `**Crecimiento Mensual: ${fmt(cr, false)}**\n\n• Ventas actuales: **${va}**\n• Ventas período anterior: **${vant}**\n\n${
      cr > 10
        ? '🚀 Crecimiento acelerado. Excelente momentum comercial.'
        : cr > 5
        ? '📈 Crecimiento sólido y sostenible.'
        : cr > 0
        ? '➡️ Crecimiento lento. Considera acciones para dinamizar ventas.'
        : '📉 Contracción de ventas. Acción comercial urgente requerida.'
    }`
  },

  salud: (kpis) => {
    const mn = kpis.margenNeto
    const roi = kpis.ROI
    const cr = kpis.crecimientoMensual
    const score = Math.round((Math.max(0, Math.min(mn, 30)) / 30 * 40) + (Math.max(0, Math.min(roi, 30)) / 30 * 35) + (Math.max(0, Math.min(cr, 15)) / 15 * 25))
    const estado = score >= 75 ? '🟢 Salud Óptima' : score >= 50 ? '🟡 Estable' : score >= 30 ? '🟠 Riesgo Moderado' : '🔴 Alto Riesgo'
    return `**Diagnóstico de Salud Financiera**\n\nEstado general: **${estado}**\n\nResumen de los tres pilares:\n• Rentabilidad (Margen Neto): **${fmt(mn, false)}** ${mn > 10 ? '✅' : '⚠️'}\n• Eficiencia (ROI): **${fmt(roi, false)}** ${roi > 15 ? '✅' : '⚠️'}\n• Momentum (Crecimiento): **${fmt(cr, false)}** ${cr > 5 ? '✅' : '⚠️'}\n\n${
      score >= 75
        ? 'La empresa está en una posición financiera sólida. Buen trabajo.'
        : score >= 50
        ? 'La situación es estable pero con áreas de mejora importantes.'
        : 'Se detectan señales de alerta. Revisa el análisis IA para recomendaciones detalladas.'
    }`
  },

  capitalInvertido: (kpis) => {
    const cap = fmt(kpis.capitalInvertido)
    const act = fmt(kpis.activos)
    const pas = fmt(kpis.pasivos)
    return `**Estructura de Capital**\n\n• 💰 Capital Invertido: **${cap}**\n• 📊 Activos Totales: **${act}**\n• 🏦 Pasivos: **${pas}**\n\nLa relación activos/pasivos indica ${kpis.activos > kpis.pasivos * 1.5 ? 'buena solidez patrimonial' : 'un nivel de apalancamiento que merece atención'}.\n\nROI sobre ese capital: **${fmt(kpis.ROI, false)}**`
  },

  deuda: (kpis) => {
    const deu = fmt(kpis.deuda)
    const act = kpis.activos
    const ratioDeuda = act > 0 ? ((kpis.deuda / act) * 100).toFixed(1) : 0
    return `**Nivel de Deuda: ${deu}**\n\nRatio Deuda/Activos: **${ratioDeuda}%**\n\n${
      ratioDeuda < 30
        ? '✅ Nivel de endeudamiento saludable. La empresa tiene buena capacidad de pago.'
        : ratioDeuda < 60
        ? '⚠️ Endeudamiento moderado. Mantén bajo control el crecimiento de deuda.'
        : '🔴 Alto endeudamiento. Prioriza la reducción de deuda para mejorar resiliencia financiera.'
    }`
  },

  flujo: (kpis) => {
    const fe = fmt(kpis.flujoEfectivo)
    return `**Flujo de Efectivo: ${fe}**\n\n${
      kpis.flujoEfectivo > 0
        ? `✅ Flujo positivo. Tienes **${fe}** disponibles en caja, lo que da flexibilidad operativa y de inversión.`
        : `🔴 Flujo negativo. La empresa está saliendo más efectivo del que entra. Esto puede afectar el pago de obligaciones a corto plazo.`
    }\n\nEl flujo de efectivo es distinto a la utilidad: puedes tener ganancias contables pero poco efectivo disponible.`
  },

  kpis: (kpis) => {
    return `**KPIs del Período Actual**\n\n| Indicador | Valor |\n|-----------|-------|\n| 💰 Ingresos | ${fmt(kpis.ingresoTotal)} |\n| 💸 Costos Totales | ${fmt(kpis.costoTotal)} |\n| 📈 Margen Bruto | ${fmt(kpis.margenBruto, false)} |\n| 📊 Margen Neto | ${fmt(kpis.margenNeto, false)} |\n| 🎯 ROI | ${fmt(kpis.ROI, false)} |\n| ⚖️ Pto. Equilibrio | ${fmt(kpis.puntoEquilibrio)} |\n| 📉 Crecimiento | ${fmt(kpis.crecimientoMensual, false)} |`
  },

  recomendacion: (kpis) => {
    const recs = []
    if (kpis.margenNeto < 10) recs.push('• **Mejorar margen neto**: Revisa la estructura de costos fijos y variables. Considera si puedes ajustar precios.')
    if (kpis.ROI < 15) recs.push('• **Optimizar ROI**: Identifica qué líneas de negocio generan mayor retorno y potencia esas áreas.')
    if (kpis.crecimientoMensual < 5) recs.push('• **Impulsar ventas**: El crecimiento mensual es bajo. Considera acciones comerciales, marketing o nuevos canales.')
    if (kpis.deuda > kpis.activos * 0.5) recs.push('• **Reducir deuda**: El ratio de endeudamiento es alto. Prioriza el pago de obligaciones antes de nuevas inversiones.')
    if (kpis.flujoEfectivo < 0) recs.push('• **Mejorar flujo de caja**: Optimiza el ciclo de cobros y considera extensión de plazos de pago a proveedores.')
    if (kpis.puntoEquilibrio > kpis.ventasActuales) recs.push('• **Alcanzar el break-even**: Tus ventas actuales no cubren el punto de equilibrio. Necesitas aumentar ventas o reducir costos fijos urgentemente.')

    return recs.length > 0
      ? `**Recomendaciones Basadas en tus KPIs Actuales:**\n\n${recs.join('\n\n')}\n\n💡 *Para un análisis más profundo, visita el Dashboard y usa el botón "Consultar IA".*`
      : `✅ **¡Excelente estado financiero!**\n\nTodos tus indicadores están en rangos saludables. Algunas sugerencias para mantener el rumbo:\n\n• Sigue monitoreando el margen neto mensualmente\n• Considera reinvertir parte de las utilidades\n• Diversifica fuentes de ingresos para mayor resiliencia`
  },

  noEntiendo: () =>
    `No estoy seguro de entender tu pregunta. 🤔\n\nPuedo ayudarte con temas como:\n\n• Margen bruto o neto\n• ROI y rentabilidad\n• Punto de equilibrio\n• Ingresos y costos\n• Crecimiento mensual\n• Flujo de efectivo\n• Recomendaciones financieras\n\nIntenta reformular tu pregunta o escribe **"ayuda"** para ver ejemplos.`,
}

// ─── Función principal del chatbot ──────────────────────────────────────────

/**
 * Procesa un mensaje del usuario y devuelve una respuesta financiera.
 * @param {string} mensaje  - Texto del usuario
 * @param {Object} kpis     - KPIs actuales del dashboard
 * @returns {Promise<string>} Respuesta en texto (Markdown ligero)
 */
export const procesarMensaje = (mensaje, kpis) => {
  return new Promise((resolve) => {
    const latencia = 400 + Math.floor(Math.random() * 600)

    setTimeout(() => {
      const t = normalizar(mensaje.trim())

      // Saludos
      if (SALUDOS.some((s) => t.includes(s))) return resolve(respuestas.saludo())
      // Despedidas
      if (DESPEDIDAS.some((d) => t.includes(d))) return resolve(respuestas.despedida())

      // Detectar tema
      const tema = detectarTema(t)

      if (tema && respuestas[tema]) {
        const fn = respuestas[tema]
        resolve(fn.length > 0 ? fn(kpis) : fn())
      } else {
        resolve(respuestas.noEntiendo())
      }
    }, latencia)
  })
}

/**
 * Mensaje de bienvenida inicial del chatbot
 */
export const MENSAJE_BIENVENIDA = {
  id: 'bienvenida',
  autor: 'bot',
  texto: '¡Hola! Soy **Aura**, tu asistente financiero. 💡\n\nEstoy conectado a los datos en tiempo real de tu dashboard. Puedes preguntarme sobre ingresos, costos, KPIs, ROI, punto de equilibrio y mucho más.\n\n¿En qué te puedo ayudar hoy?',
  hora: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
}

/**
 * Sugerencias rápidas de preguntas
 */
export const SUGERENCIAS = [
  '¿Cuál es mi margen neto?',
  '¿Cómo está mi ROI?',
  '¿Cuál es el punto de equilibrio?',
  'Dame todas las KPIs',
  '¿Qué me recomiendas?',
  '¿Cómo está mi salud financiera?',
]
