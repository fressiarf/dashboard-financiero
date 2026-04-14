/**
 * iaSimulada.js
 * Simula una integración con un servicio de IA financiero.
 * Construye un prompt estructurado (como si se enviara a un LLM real),
 * y genera una respuesta analítica natural basada en los datos.
 *
 * RESTRICCIÓN: 100% local, sin APIs externas ni claves.
 */

// ─── Plantillas de frases por contexto ───────────────────────────────────────

const FRASES_APERTURA = [
  'Tras revisar los indicadores del período, el perfil financiero sugiere',
  'El análisis integral de los datos presenta un escenario donde',
  'Con base en los KPIs evaluados, la situación financiera refleja',
  'La lectura financiera del período arroja un panorama donde',
  'Los datos analizados apuntan a un desempeño en el que',
]

const FRASES_CIERRE = [
  'El equipo financiero debería priorizar estas áreas en los próximos 30 días.',
  'Este análisis debe complementarse con una revisión semanal de los indicadores clave.',
  'La implementación oportuna de estas recomendaciones puede marcar una diferencia significativa.',
  'Mantener este diagnóstico como referencia facilitará la toma de decisiones estratégicas.',
  'Se recomienda revisar este informe con el equipo directivo a la brevedad.',
]

const seleccionarAleatorio = (arr) => arr[Math.floor(arr.length * 0.6)]  // Semi-determinista

// ─── Constructor de prompt (como si se enviara a una IA real) ─────────────────

const construirPrompt = (kpis, puntajeSalud) => {
  return {
    modelo: 'financial-analyst-v2',
    temperatura: 0.72,
    maxTokens: 500,
    contexto: 'Eres un analista financiero senior con 15 años de experiencia en PYMES latinoamericanas.',
    instruccion: 'Genera un análisis ejecutivo conciso, directo y accionable. No uses bullet points. Usa prosa natural.',
    datos: {
      puntajeGlobal:    puntajeSalud?.global ?? 0,
      estadoSalud:      puntajeSalud?.estado ?? 'Desconocido',
      margenNeto:       `${kpis.margenNeto?.toFixed(1)}%`,
      margenBruto:      `${kpis.margenBruto?.toFixed(1)}%`,
      ROI:              `${kpis.ROI?.toFixed(1)}%`,
      crecimiento:      `${kpis.crecimientoMensual?.toFixed(1)}%`,
      puntoEquilibrio:  `$${(kpis.puntoEquilibrio ?? 0).toLocaleString('es-MX')}`,
      ingresoTotal:     `$${(kpis.ingresoTotal ?? 0).toLocaleString('es-MX')}`,
      costoTotal:       `$${(kpis.costoTotal ?? 0).toLocaleString('es-MX')}`,
    },
  }
}

// ─── Generador de análisis contextual ────────────────────────────────────────

const analizarMargenes = (kpis) => {
  const mn = kpis.margenNeto ?? 0
  const mb = kpis.margenBruto ?? 0

  if (mn > 20 && mb > 40) {
    return `Los márgenes —neto de ${mn.toFixed(1)}% y bruto de ${mb.toFixed(1)}%— demuestran un control de costos sobresaliente, muy por encima de los promedios sectoriales. Esta fortaleza sugiere que la empresa tiene espacio para reinvertir o expandirse sin comprometer su rentabilidad.`
  }
  if (mn > 10) {
    return `El margen neto del ${mn.toFixed(1)}% refleja una operación sana, aunque el margen bruto del ${mb.toFixed(1)}% indica que aún hay palancas de negociación con proveedores que no se están aprovechando al máximo.`
  }
  if (mn > 0) {
    return `Con un margen neto del ${mn.toFixed(1)}%, la empresa cubre sus costos, pero el colchón de seguridad es estrecho. Una variación del 5% en los ingresos podría comprometer el equilibrio operativo.`
  }
  return `El margen neto negativo del ${mn.toFixed(1)}% es la señal más urgente: los costos superan los ingresos generados. Esto no es sostenible más allá de 60-90 días sin acciones correctivas concretas.`
}

const analizarCrecimiento = (kpis) => {
  const cr = kpis.crecimientoMensual ?? 0
  const pe = kpis.puntoEquilibrio ?? 0
  const va = kpis.ventasActuales ?? 0

  const seguridad = va > 0 ? ((va - pe) / va * 100).toFixed(1) : '0.0'

  if (cr > 10) {
    return `El crecimiento mensual del ${cr.toFixed(1)}% es notable y supera el umbral de expansión dinámica. Con un margen de seguridad operativa del ${seguridad}% sobre el punto de equilibrio, la empresa tiene holgura para invertir en escalabilidad.`
  }
  if (cr >= 5) {
    return `Un crecimiento del ${cr.toFixed(1)}% mensual indica momentum positivo y sostenible. El punto de equilibrio en $${pe.toLocaleString('es-MX')} se cubre con el ${((pe / (va || 1)) * 100).toFixed(1)}% de las ventas actuales, lo que ofrece un margen de maniobra razonable.`
  }
  if (cr >= 0) {
    return `El crecimiento del ${cr.toFixed(1)}% sugiere un mercado en madurez o una estrategia comercial que requiere revisión. El punto de equilibrio de $${pe.toLocaleString('es-MX')} implica que cualquier caída en ventas presionaría rápidamente los resultados.`
  }
  return `La contracción del ${Math.abs(cr).toFixed(1)}% es la señal más crítica en el frente comercial. Con ventas actuales de $${va.toLocaleString('es-MX')} y un break-even en $${pe.toLocaleString('es-MX')}, el margen de seguridad se está erosionando activamente.`
}

const analizarROI = (kpis) => {
  const roi = kpis.ROI ?? 0
  const cap = kpis.capitalInvertido ?? 0

  if (roi > 30) return `El ROI del ${roi.toFixed(1)}% sobre un capital invertido de $${cap.toLocaleString('es-MX')} representa un retorno excepcional que supera con creces el costo promedio del capital en el mercado (estimado en 12-18% anual para PYMES). Esta posición competitiva es difícil de replicar.`
  if (roi > 15) return `Con un ROI del ${roi.toFixed(1)}%, el capital de $${cap.toLocaleString('es-MX')} genera retornos competitivos, comparables a los mercados de capitales regionales. La pregunta estratégica es cómo mantener este ritmo mientras la empresa escala.`
  if (roi > 0)  return `El ROI del ${roi.toFixed(1)}% indica que el capital está trabajando, pero barely. Con $${cap.toLocaleString('es-MX')} invertidos, se esperaría un retorno mínimo del 15% para justificar el riesgo empresarial. Es momento de revisar qué líneas de negocio generan mayor valor.`
  return `Un ROI negativo del ${roi.toFixed(1)}% significa que el capital de $${cap.toLocaleString('es-MX')} está siendo destruido, no multiplicado. Antes de cualquier nueva inversión, conviene diagnosticar con precisión qué segmentos consumen recursos sin generar retorno.`
}

// ─── Función principal de simulación de IA ───────────────────────────────────

/**
 * Simula el envío de un prompt a una IA y devuelve un análisis estructurado.
 * @param {Object} kpis           KPIs completos (post-cálculo)
 * @param {Object} puntajeSalud   Resultado del puntaje de salud financiero
 * @returns {Promise<Object>}     Respuesta simulada con análisis y metadatos
 */
export const consultarIAFinanciera = (kpis, puntajeSalud) => {
  return new Promise((resolve) => {
    // Simular latencia de API (200-600ms realista)
    const latencia = 200 + Math.floor(Math.random() * 400)

    setTimeout(() => {
      const prompt = construirPrompt(kpis, puntajeSalud)

      const apertura  = seleccionarAleatorio(FRASES_APERTURA)
      const cierre    = seleccionarAleatorio(FRASES_CIERRE)
      const estado    = puntajeSalud?.estado ?? 'estado desconocido'
      const puntaje   = puntajeSalud?.global ?? 0

      const bloqueEstado = puntaje >= 80
        ? `un estado de salud óptima (${puntaje}/100), con fortalezas estructurales en rentabilidad y sostenibilidad`
        : puntaje >= 60
          ? `una posición financiera estable con un puntaje de ${puntaje}/100, aunque con áreas de mejora identificables`
          : puntaje >= 40
            ? `un escenario de riesgo moderado (${puntaje}/100) que exige atención en los próximos 30 a 60 días`
            : `una situación de alto riesgo financiero (${puntaje}/100) que requiere intervención estratégica inmediata`

      const analisisMargenes    = analizarMargenes(kpis)
      const analisisCrecimiento = analizarCrecimiento(kpis)
      const analisisROI         = analizarROI(kpis)

      const respuesta = [
        `${apertura} ${bloqueEstado}.`,
        analisisMargenes,
        analisisCrecimiento,
        analisisROI,
        cierre,
      ].join(' ')

      resolve({
        exitoso: true,
        analisis: respuesta,
        prompt,
        metadatos: {
          modelo:          prompt.modelo,
          latenciaMs:      latencia,
          tokensEstimados: Math.round(respuesta.length / 4),
          generadaEn:      new Date().toLocaleString('es-MX'),
          version:         '2.1.0-mock',
        },
      })
    }, latencia)
  })
}
