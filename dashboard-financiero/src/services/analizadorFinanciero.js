import { UMBRALES, PESOS_PUNTAJE, NIVELES } from '../constants/umbralesFinancieros.js'

const dividirSeguro = (numerador, denominador, valorPorDefecto = 0) => {
  if (!denominador || !isFinite(denominador)) return valorPorDefecto
  return numerador / denominador
}

const clasificarNivel = (puntaje) => {
  if (puntaje >= 80) return NIVELES.EXCELENTE
  if (puntaje >= 60) return NIVELES.BUENO
  if (puntaje >= 40) return NIVELES.ADVERTENCIA
  return NIVELES.CRITICO
}

export const validarKpis = (kpis) => {
  const advertencias = []
  const camposRequeridos = [
    'ingresoTotal', 'costoTotal', 'margenNeto', 'margenBruto',
    'ROI', 'puntoEquilibrio', 'ventasActuales', 'ventasAnterior',
    'crecimientoMensual', 'costosFijos', 'costosVariables',
    'capitalInvertido', 'activos', 'pasivos', 'deuda', 'flujoEfectivo',
  ]
  const kpisSanitizados = {}
  camposRequeridos.forEach((campo) => {
    const valor = kpis?.[campo]
    if (valor === undefined || valor === null) {
      advertencias.push(`El campo '${campo}' no fue proporcionado. Se usará 0.`)
      kpisSanitizados[campo] = 0
    } else if (typeof valor !== 'number' || isNaN(valor)) {
      advertencias.push(`El campo '${campo}' no es un número válido (valor: ${valor}). Se usará 0.`)
      kpisSanitizados[campo] = 0
    } else {
      kpisSanitizados[campo] = valor
    }
  })
  return { validos: advertencias.length === 0, kpisSanitizados, advertencias }
}

export const analizarRentabilidad = (kpis) => {
  const { margenNeto, margenBruto, ROI } = kpis
  const perspectivas = []
  let puntajeAcumulado = 0
  let cantidad = 0

  let puntajeMargenNeto, mensajeMargenNeto, detalleMargenNeto
  if (margenNeto > UMBRALES.margenNeto.excepcional) {
    puntajeMargenNeto = 100
    mensajeMargenNeto = 'Rentabilidad excepcional'
    detalleMargenNeto = `El margen neto del ${margenNeto.toFixed(1)}% supera el umbral del 20%, indicando eficiencia muy por encima del promedio del mercado.`
  } else if (margenNeto >= UMBRALES.margenNeto.sano) {
    puntajeMargenNeto = 75
    mensajeMargenNeto = 'Rentabilidad sana'
    detalleMargenNeto = `El margen neto del ${margenNeto.toFixed(1)}% indica una operación equilibrada y competitiva en el rango 10-20%.`
  } else if (margenNeto >= UMBRALES.margenNeto.bajo) {
    puntajeMargenNeto = 45
    mensajeMargenNeto = 'Rentabilidad baja'
    detalleMargenNeto = `El margen neto del ${margenNeto.toFixed(1)}% es ajustado (5-10%). Se recomienda revisar la estructura de costos operativos.`
  } else {
    puntajeMargenNeto = 15
    mensajeMargenNeto = 'Rentabilidad muy baja'
    detalleMargenNeto = `Un margen neto del ${margenNeto.toFixed(1)}% (menor al 5%) es crítico. Alta exposición a pérdidas ante variaciones menores del mercado.`
  }
  perspectivas.push({ metrica: 'Margen Neto', valor: `${margenNeto.toFixed(1)}%`, nivel: clasificarNivel(puntajeMargenNeto), mensaje: mensajeMargenNeto, detalle: detalleMargenNeto })
  puntajeAcumulado += puntajeMargenNeto
  cantidad++

  let puntajeMargenBruto, mensajeMargenBruto, detalleMargenBruto
  if (margenBruto > UMBRALES.margenBruto.robusto) {
    puntajeMargenBruto = 100
    mensajeMargenBruto = 'Margen bruto robusto'
    detalleMargenBruto = `El margen bruto del ${margenBruto.toFixed(1)}% indica bajo peso de costos directos sobre los ingresos.`
  } else if (margenBruto >= UMBRALES.margenBruto.moderado) {
    puntajeMargenBruto = 60
    mensajeMargenBruto = 'Margen bruto moderado'
    detalleMargenBruto = `El margen bruto del ${margenBruto.toFixed(1)}% (20-40%) tiene espacio para mejorar mediante negociación con proveedores.`
  } else {
    puntajeMargenBruto = 20
    mensajeMargenBruto = 'Presión alta en costos directos'
    detalleMargenBruto = `El margen bruto del ${margenBruto.toFixed(1)}% (menor al 20%) indica que los costos directos consumen la mayor parte del ingreso.`
  }
  perspectivas.push({ metrica: 'Margen Bruto', valor: `${margenBruto.toFixed(1)}%`, nivel: clasificarNivel(puntajeMargenBruto), mensaje: mensajeMargenBruto, detalle: detalleMargenBruto })
  puntajeAcumulado += puntajeMargenBruto
  cantidad++

  let puntajeROI, mensajeROI, detalleROI
  if (ROI > UMBRALES.ROI.excelente) {
    puntajeROI = 100
    mensajeROI = 'Retorno de inversión excelente'
    detalleROI = `El ROI del ${ROI.toFixed(1)}% supera el 30%, generando valor muy por encima del costo promedio del capital.`
  } else if (ROI >= UMBRALES.ROI.competitivo) {
    puntajeROI = 70
    mensajeROI = 'ROI competitivo'
    detalleROI = `El ROI del ${ROI.toFixed(1)}% (15-30%) es comparable con los rendimientos del mercado de capitales.`
  } else if (ROI >= 0) {
    puntajeROI = 35
    mensajeROI = 'ROI bajo'
    detalleROI = `El ROI del ${ROI.toFixed(1)}% (0-15%) cubre el costo del capital pero con escaso margen de seguridad.`
  } else {
    puntajeROI = 5
    mensajeROI = 'ROI negativo'
    detalleROI = `Con un ROI del ${ROI.toFixed(1)}%, la inversión está destruyendo valor. Se requiere revisión urgente del modelo de negocio.`
  }
  perspectivas.push({ metrica: 'ROI', valor: `${ROI.toFixed(1)}%`, nivel: clasificarNivel(puntajeROI), mensaje: mensajeROI, detalle: detalleROI })
  puntajeAcumulado += puntajeROI
  cantidad++

  const puntaje = Math.round(puntajeAcumulado / cantidad)
  return { puntaje, nivel: clasificarNivel(puntaje), perspectivas, analisis: `Rentabilidad con puntaje ${puntaje}/100. ${mensajeMargenNeto}. ${mensajeROI}.` }
}

export const analizarEficiencia = (kpis) => {
  const { costosFijos, ingresoTotal, puntoEquilibrio, ventasActuales } = kpis
  const perspectivas = []
  let puntajeAcumulado = 0
  let cantidad = 0

  const relacionCostosFijos = dividirSeguro(costosFijos, ingresoTotal)
  let puntajeCF, mensajeCF, detalleCF
  if (relacionCostosFijos < UMBRALES.costosFijos.eficiente) {
    puntajeCF = 90
    mensajeCF = 'Estructura de costos eficiente'
    detalleCF = `Los costos fijos representan el ${(relacionCostosFijos * 100).toFixed(1)}% de los ingresos (menor al 25%). Excelente apalancamiento operativo.`
  } else if (relacionCostosFijos < UMBRALES.costosFijos.moderado) {
    puntajeCF = 55
    mensajeCF = 'Costos fijos manejables'
    detalleCF = `Los costos fijos del ${(relacionCostosFijos * 100).toFixed(1)}% son aceptables (25-50%) pero tienen margen de optimización.`
  } else {
    puntajeCF = 15
    mensajeCF = 'Costos fijos excesivos'
    detalleCF = `Con costos fijos al ${(relacionCostosFijos * 100).toFixed(1)}% de los ingresos (más del 50%), la empresa tiene alto riesgo operativo ante caídas en ventas.`
  }
  perspectivas.push({ metrica: 'Relación Costos Fijos', valor: `${(relacionCostosFijos * 100).toFixed(1)}%`, nivel: clasificarNivel(puntajeCF), mensaje: mensajeCF, detalle: detalleCF })
  puntajeAcumulado += puntajeCF
  cantidad++

  const relacionBreakEven = dividirSeguro(puntoEquilibrio, ventasActuales)
  let puntajeBE, mensajeBE, detalleBE
  if (relacionBreakEven < UMBRALES.breakEven.accesible) {
    puntajeBE = 95
    mensajeBE = 'Break-even muy accesible'
    detalleBE = `El punto de equilibrio ($${puntoEquilibrio.toLocaleString('es-MX')}) es el ${(relacionBreakEven * 100).toFixed(1)}% de las ventas actuales. Alta seguridad operativa.`
  } else if (relacionBreakEven < UMBRALES.breakEven.moderado) {
    puntajeBE = 55
    mensajeBE = 'Break-even moderado'
    detalleBE = `El break-even representa el ${(relacionBreakEven * 100).toFixed(1)}% de las ventas (50-80%). Margen de seguridad operativa limitado.`
  } else {
    puntajeBE = 10
    mensajeBE = 'Break-even crítico'
    detalleBE = `El punto de equilibrio supera el 80% de las ventas actuales (${(relacionBreakEven * 100).toFixed(1)}%). Una caída menor en ventas generaría pérdidas inmediatas.`
  }
  perspectivas.push({ metrica: 'Punto de Equilibrio', valor: `${(relacionBreakEven * 100).toFixed(1)}% de ventas`, nivel: clasificarNivel(puntajeBE), mensaje: mensajeBE, detalle: detalleBE })
  puntajeAcumulado += puntajeBE
  cantidad++

  const puntaje = Math.round(puntajeAcumulado / cantidad)
  return { puntaje, nivel: clasificarNivel(puntaje), perspectivas, analisis: `Eficiencia operativa con puntaje ${puntaje}/100. ${mensajeCF}.` }
}

export const analizarCrecimiento = (kpis) => {
  const { crecimientoMensual, ventasActuales, ventasAnterior } = kpis
  const perspectivas = []
  let puntajeAcumulado = 0
  let cantidad = 0

  let puntajeCM, mensajeCM, detalleCM
  if (crecimientoMensual > UMBRALES.crecimiento.acelerado) {
    puntajeCM = 100
    mensajeCM = 'Crecimiento acelerado'
    detalleCM = `El crecimiento del ${crecimientoMensual.toFixed(1)}% mensual supera el 10%. Señal de expansión dinámica o temporada alta sostenida.`
  } else if (crecimientoMensual >= UMBRALES.crecimiento.solido) {
    puntajeCM = 75
    mensajeCM = 'Crecimiento sólido'
    detalleCM = `Un crecimiento del ${crecimientoMensual.toFixed(1)}% mensual (5-10%) indica un ritmo saludable y probablemente sostenible.`
  } else if (crecimientoMensual >= UMBRALES.crecimiento.moderado) {
    puntajeCM = 50
    mensajeCM = 'Crecimiento moderado'
    detalleCM = `El crecimiento del ${crecimientoMensual.toFixed(1)}% mensual (0-5%) puede indicar madurez de mercado o subutilización de capacidad comercial.`
  } else {
    puntajeCM = 10
    mensajeCM = 'Contracción de ventas'
    detalleCM = `El crecimiento negativo del ${crecimientoMensual.toFixed(1)}% requiere análisis urgente: mercado, producto, precio o estrategia comercial.`
  }
  perspectivas.push({ metrica: 'Crecimiento Mensual', valor: `${crecimientoMensual.toFixed(1)}%`, nivel: clasificarNivel(puntajeCM), mensaje: mensajeCM, detalle: detalleCM })
  puntajeAcumulado += puntajeCM
  cantidad++

  const variacionVentas = ventasActuales - ventasAnterior
  const variacionPorcentual = dividirSeguro(variacionVentas, ventasAnterior) * 100
  const puntajeVariacion = variacionVentas >= 0 ? 70 : 20
  perspectivas.push({
    metrica: 'Variación de Ventas',
    valor: `$${Math.abs(variacionVentas).toLocaleString('es-MX')}`,
    nivel: variacionVentas >= 0 ? NIVELES.BUENO : NIVELES.CRITICO,
    mensaje: variacionVentas >= 0 ? `Incremento de $${variacionVentas.toLocaleString('es-MX')}` : `Decremento de $${Math.abs(variacionVentas).toLocaleString('es-MX')}`,
    detalle: `Las ventas ${variacionVentas >= 0 ? 'crecieron' : 'cayeron'} un ${Math.abs(variacionPorcentual).toFixed(1)}% respecto al período anterior.`,
  })
  puntajeAcumulado += puntajeVariacion
  cantidad++

  const puntaje = Math.round(puntajeAcumulado / cantidad)
  return { puntaje, nivel: clasificarNivel(puntaje), perspectivas, analisis: `Crecimiento con puntaje ${puntaje}/100. ${mensajeCM}.` }
}

export const analizarSostenibilidad = (kpis) => {
  const { deuda, activos, pasivos, flujoEfectivo } = kpis
  const perspectivas = []
  let puntajeAcumulado = 0
  let cantidad = 0

  const ratioDeuda = dividirSeguro(deuda, activos)
  let puntajeRD, mensajeRD, detalleRD
  if (ratioDeuda < UMBRALES.deuda.saludable) {
    puntajeRD = 95
    mensajeRD = 'Ratio deuda/activos saludable'
    detalleRD = `La deuda representa el ${(ratioDeuda * 100).toFixed(1)}% de los activos (menor al 30%). Solvencia sólida y bajo riesgo crediticio.`
  } else if (ratioDeuda < UMBRALES.deuda.moderado) {
    puntajeRD = 55
    mensajeRD = 'Apalancamiento moderado'
    detalleRD = `El ratio deuda/activos del ${(ratioDeuda * 100).toFixed(1)}% (30-60%) es aceptable en empresas en crecimiento, pero requiere monitoreo.`
  } else {
    puntajeRD = 10
    mensajeRD = 'Apalancamiento peligroso'
    detalleRD = `Con un ratio deuda/activos del ${(ratioDeuda * 100).toFixed(1)}% (mayor al 60%), el riesgo de insolvencia es elevado.`
  }
  perspectivas.push({ metrica: 'Ratio Deuda/Activos', valor: `${(ratioDeuda * 100).toFixed(1)}%`, nivel: clasificarNivel(puntajeRD), mensaje: mensajeRD, detalle: detalleRD })
  puntajeAcumulado += puntajeRD
  cantidad++

  const ratioEndeudamiento = dividirSeguro(pasivos, activos)
  let puntajeRE, mensajeRE, detalleRE
  if (ratioEndeudamiento < 0.40) {
    puntajeRE = 90
    mensajeRE = 'Endeudamiento controlado'
    detalleRE = `Los pasivos representan el ${(ratioEndeudamiento * 100).toFixed(1)}% de los activos. Estructura financiera conservadora y resiliente.`
  } else if (ratioEndeudamiento < UMBRALES.deuda.endeudamientoCritico) {
    puntajeRE = 50
    mensajeRE = 'Endeudamiento elevado'
    detalleRE = `Los pasivos son el ${(ratioEndeudamiento * 100).toFixed(1)}% de los activos (40-70%). Vigilar la capacidad de cobertura de deuda.`
  } else {
    puntajeRE = 10
    mensajeRE = 'Endeudamiento crítico'
    detalleRE = `Con pasivos al ${(ratioEndeudamiento * 100).toFixed(1)}% de los activos (mayor al 70%), la empresa muestra alta vulnerabilidad financiera.`
  }
  perspectivas.push({ metrica: 'Ratio de Endeudamiento', valor: `${(ratioEndeudamiento * 100).toFixed(1)}%`, nivel: clasificarNivel(puntajeRE), mensaje: mensajeRE, detalle: detalleRE })
  puntajeAcumulado += puntajeRE
  cantidad++

  let puntajeFE, mensajeFE, detalleFE
  if (flujoEfectivo > UMBRALES.flujoEfectivo.solido) {
    puntajeFE = 95
    mensajeFE = 'Flujo de efectivo sólido'
    detalleFE = `El flujo positivo de $${flujoEfectivo.toLocaleString('es-MX')} garantiza liquidez suficiente para operaciones e inversiones estratégicas.`
  } else if (flujoEfectivo > 0) {
    puntajeFE = 60
    mensajeFE = 'Flujo positivo'
    detalleFE = `El flujo positivo de $${flujoEfectivo.toLocaleString('es-MX')} es favorable pero moderado. Se recomienda monitorear la tendencia mensual.`
  } else {
    puntajeFE = 5
    mensajeFE = 'Flujo negativo'
    detalleFE = `El flujo negativo de $${flujoEfectivo.toLocaleString('es-MX')} compromete la operación diaria. Se requiere acción inmediata en gestión de cobros.`
  }
  perspectivas.push({ metrica: 'Flujo de Efectivo', valor: `$${flujoEfectivo.toLocaleString('es-MX')}`, nivel: clasificarNivel(puntajeFE), mensaje: mensajeFE, detalle: detalleFE })
  puntajeAcumulado += puntajeFE
  cantidad++

  const puntaje = Math.round(puntajeAcumulado / cantidad)
  return { puntaje, nivel: clasificarNivel(puntaje), perspectivas, analisis: `Sostenibilidad con puntaje ${puntaje}/100. ${mensajeFE}.` }
}

export const calcularPuntajeSalud = (analisisCompleto) => {
  const { rentabilidad, eficiencia, crecimiento, sostenibilidad } = analisisCompleto
  const puntajeGlobal = Math.min(100, Math.max(5, Math.round(
    (rentabilidad.puntaje  * PESOS_PUNTAJE.rentabilidad) +
    (eficiencia.puntaje    * PESOS_PUNTAJE.eficiencia) +
    (crecimiento.puntaje   * PESOS_PUNTAJE.crecimiento) +
    (sostenibilidad.puntaje * PESOS_PUNTAJE.sostenibilidad)
  )))
  let estado
  if (puntajeGlobal >= 80) estado = 'Salud Óptima'
  else if (puntajeGlobal >= 60) estado = 'Bajo Riesgo'
  else if (puntajeGlobal >= 40) estado = 'Riesgo Moderado'
  else estado = 'Alto Riesgo'
  return {
    global: puntajeGlobal,
    estado,
    factores: [
      { nombre: 'Rentabilidad',   puntaje: rentabilidad.puntaje,   nivel: rentabilidad.nivel,   peso: PESOS_PUNTAJE.rentabilidad },
      { nombre: 'Eficiencia',     puntaje: eficiencia.puntaje,     nivel: eficiencia.nivel,     peso: PESOS_PUNTAJE.eficiencia },
      { nombre: 'Crecimiento',    puntaje: crecimiento.puntaje,    nivel: crecimiento.nivel,    peso: PESOS_PUNTAJE.crecimiento },
      { nombre: 'Sostenibilidad', puntaje: sostenibilidad.puntaje, nivel: sostenibilidad.nivel, peso: PESOS_PUNTAJE.sostenibilidad },
    ],
  }
}

export const identificarFactoresRiesgo = (kpis, analisisCompleto) => {
  const riesgos = []
  const categorias = ['rentabilidad', 'eficiencia', 'crecimiento', 'sostenibilidad']
  categorias.forEach((categoria) => {
    const analisis = analisisCompleto[categoria]
    analisis.perspectivas.forEach((perspectiva) => {
      if (perspectiva.nivel === NIVELES.CRITICO || perspectiva.nivel === NIVELES.ADVERTENCIA) {
        riesgos.push({
          nivel: perspectiva.nivel,
          factor: perspectiva.metrica,
          descripcion: perspectiva.detalle,
          valor: perspectiva.valor,
          categoria: categoria.charAt(0).toUpperCase() + categoria.slice(1),
        })
      }
    })
  })
  const ordenPrioridad = { [NIVELES.CRITICO]: 0, [NIVELES.ADVERTENCIA]: 1 }
  return riesgos.sort((a, b) => ordenPrioridad[a.nivel] - ordenPrioridad[b.nivel])
}

export const generarRecomendaciones = (analisisCompleto, factoresRiesgo) => {
  const catalogoRecomendaciones = {
    'Margen Neto': { categoria: 'Rentabilidad', accion: 'Revisar y reducir costos operativos mediante análisis de valor agregado por área', razonamiento: 'Un margen neto bajo indica que los costos consumen excesivamente los ingresos netos generados.', impactoEsperado: 'Incremento del margen neto en 3-5 puntos porcentuales en los próximos 90 días' },
    'Margen Bruto': { categoria: 'Costos Directos', accion: 'Negociar mejores condiciones con proveedores y optimizar procesos de producción o entrega', razonamiento: 'El margen bruto bajo indica presión en los costos directos del producto o servicio ofrecido.', impactoEsperado: 'Reducción de costos directos en 10-15% dentro de 60 días' },
    'ROI': { categoria: 'Gestión de Inversiones', accion: 'Evaluar rentabilidad por línea de negocio y reasignar capital hacia las más productivas', razonamiento: 'El capital invertido no genera el retorno mínimo esperado por el mercado.', impactoEsperado: 'Mejora del ROI en 5-10 puntos porcentuales en 6 meses' },
    'Relación Costos Fijos': { categoria: 'Eficiencia Operativa', accion: 'Convertir costos fijos a variables mediante outsourcing selectivo y contratos flexibles', razonamiento: 'Reducir la carga fija mejora el punto de equilibrio y aumenta la resiliencia ante caídas en ventas.', impactoEsperado: 'Reducción del punto de equilibrio en 15-20%' },
    'Punto de Equilibrio': { categoria: 'Volumen de Operaciones', accion: 'Incrementar volumen de ventas con estrategias de precio, canales adicionales o nuevos segmentos', razonamiento: 'Un break-even crítico requiere ventas muy altas para evitar pérdidas ante cualquier variación.', impactoEsperado: 'Ampliar el margen de seguridad operativa en un 20%' },
    'Crecimiento Mensual': { categoria: 'Estrategia Comercial', accion: 'Implementar plan de adquisición de clientes y programa de fidelización con incentivos medibles', razonamiento: 'La contracción requiere acción inmediata en canales comerciales y oferta de valor al cliente.', impactoEsperado: 'Retorno a crecimiento positivo en 2-3 meses' },
    'Variación de Ventas': { categoria: 'Desempeño Comercial', accion: 'Analizar causas de la variación y activar acciones correctivas en el equipo de ventas', razonamiento: 'La variación negativa en ventas absolutas impacta directamente el flujo de efectivo.', impactoEsperado: 'Recuperación del nivel de ventas previo en 45-60 días' },
    'Ratio Deuda/Activos': { categoria: 'Reestructuración Financiera', accion: 'Reducir deuda con flujo de efectivo y evaluar venta de activos no estratégicos', razonamiento: 'El alto apalancamiento reduce la capacidad de obtener financiamiento futuro y aumenta el riesgo.', impactoEsperado: 'Reducción del ratio de deuda en 10 puntos porcentuales en 12 meses' },
    'Ratio de Endeudamiento': { categoria: 'Estructura de Capital', accion: 'Negociar reestructuración de pasivos y evaluar inyección de capital propio', razonamiento: 'Un ratio de endeudamiento alto compromete la imagen crediticia y la capacidad de maniobra.', impactoEsperado: 'Mejora de la calificación crediticia interna en 6-12 meses' },
    'Flujo de Efectivo': { categoria: 'Gestión de Liquidez', accion: 'Implementar política de cobros acelerados, reducir plazos de crédito y revisar inventarios', razonamiento: 'El flujo negativo compromete el pago de nómina, proveedores y obligaciones financieras.', impactoEsperado: 'Recuperar flujo positivo en los próximos 30-60 días' },
  }
  const recomendaciones = []
  factoresRiesgo.forEach((riesgo) => {
    const mapeo = catalogoRecomendaciones[riesgo.factor]
    if (mapeo) recomendaciones.push({ prioridad: riesgo.nivel === NIVELES.CRITICO ? 'alta' : 'media', ...mapeo })
  })
  if (recomendaciones.length === 0) {
    recomendaciones.push({ prioridad: 'baja', categoria: 'Mejora Continua', accion: 'Mantener los indicadores actuales e invertir en innovación y expansión de mercado', razonamiento: 'Con KPIs en niveles óptimos, el siguiente paso natural es la expansión estratégica.', impactoEsperado: 'Consolidación de la posición competitiva en 6-12 meses' })
  }
  return recomendaciones
}

export const generarNarrativa = (kpis, analisisCompleto, puntajeSalud) => {
  const { rentabilidad, sostenibilidad } = analisisCompleto
  const { global, estado } = puntajeSalud

  const parrafo1 = `La empresa presenta un estado de salud financiera de "${estado}" con un puntaje compuesto de ${global}/100, basado en la evaluación de cuatro dimensiones clave: rentabilidad, eficiencia operativa, crecimiento y sostenibilidad. ${
    rentabilidad.nivel === NIVELES.EXCELENTE || rentabilidad.nivel === NIVELES.BUENO
      ? `Los márgenes financieros reflejan una gestión de costos sólida, con un margen neto del ${kpis.margenNeto.toFixed(1)}% y un margen bruto del ${kpis.margenBruto.toFixed(1)}%, indicadores que posicionan favorablemente a la empresa dentro de su industria.`
      : `Se identifican presiones en los márgenes financieros: el margen neto del ${kpis.margenNeto.toFixed(1)}% y el margen bruto del ${kpis.margenBruto.toFixed(1)}% sugieren la necesidad de una revisión prioritaria en la estructura de costos.`
  }`

  const parrafo2 = `En términos de dinámica comercial, las ventas ${
    kpis.crecimientoMensual >= 0
      ? `muestran una tasa de crecimiento mensual positiva del ${kpis.crecimientoMensual.toFixed(1)}%`
      : `registran una contracción mensual del ${Math.abs(kpis.crecimientoMensual).toFixed(1)}%, lo que demanda atención estratégica inmediata`
  }, con ingresos totales de $${kpis.ingresoTotal.toLocaleString('es-MX')} en el período analizado. El punto de equilibrio se sitúa en $${kpis.puntoEquilibrio.toLocaleString('es-MX')}, representando el ${((kpis.puntoEquilibrio / kpis.ventasActuales) * 100).toFixed(1)}% de las ventas actuales. El ROI del ${kpis.ROI.toFixed(1)}% ${
    kpis.ROI > UMBRALES.ROI.competitivo
      ? 'posiciona favorablemente a la empresa frente al costo de oportunidad del capital invertido.'
      : 'indica que los recursos invertidos generan retornos por debajo del promedio esperado por el mercado.'
  }`

  const parrafo3 = `Desde la perspectiva de sostenibilidad financiera, ${
    sostenibilidad.nivel === NIVELES.EXCELENTE || sostenibilidad.nivel === NIVELES.BUENO
      ? `la empresa mantiene una estructura de capital equilibrada con un ratio de endeudamiento del ${((kpis.pasivos / kpis.activos) * 100).toFixed(1)}% y un flujo de efectivo positivo de $${kpis.flujoEfectivo.toLocaleString('es-MX')}, condiciones que garantizan continuidad operativa.`
      : `la empresa enfrenta desafíos estructurales en su estructura de capital que requieren atención estratégica para garantizar la continuidad del negocio.`
  } ${
    global >= 60
      ? 'El perfil financiero global permite proyectar estabilidad y crecimiento moderado en el mediano plazo, sujeto a la implementación de las recomendaciones priorizadas en este informe.'
      : 'Se recomienda implementar un plan de mejora financiera integral a corto plazo para fortalecer la posición competitiva y reducir la exposición al riesgo.'
  }`

  return [parrafo1, parrafo2, parrafo3].join('\n\n')
}

export const generarAnalisisFinanciero = (kpis) => {
  const tiempoInicio = performance.now()
  const { kpisSanitizados, advertencias } = validarKpis(kpis)

  const rentabilidad   = analizarRentabilidad(kpisSanitizados)
  const eficiencia     = analizarEficiencia(kpisSanitizados)
  const crecimiento    = analizarCrecimiento(kpisSanitizados)
  const sostenibilidad = analizarSostenibilidad(kpisSanitizados)
  const analisisCompleto = { rentabilidad, eficiencia, crecimiento, sostenibilidad }

  const puntajeSalud   = calcularPuntajeSalud(analisisCompleto)
  const factoresRiesgo = identificarFactoresRiesgo(kpisSanitizados, analisisCompleto)
  const recomendaciones = generarRecomendaciones(analisisCompleto, factoresRiesgo)
  const resumen        = generarNarrativa(kpisSanitizados, analisisCompleto, puntajeSalud)

  const perspectivas = [
    ...rentabilidad.perspectivas,
    ...eficiencia.perspectivas,
    ...crecimiento.perspectivas,
    ...sostenibilidad.perspectivas,
  ]

  const tiempoProcesamiento = performance.now() - tiempoInicio
  if (tiempoProcesamiento > 100) {
    console.warn(`[AnalizadorFinanciero] El análisis tardó ${tiempoProcesamiento.toFixed(2)}ms (límite recomendado: 100ms)`)
  }

  return {
    resumen,
    perspectivas,
    recomendaciones,
    puntajeSalud,
    factoresRiesgo,
    analisisDetallado: analisisCompleto,
    metadatos: {
      generadoEn: new Date().toLocaleString('es-MX'),
      tiempoProcesamiento: `${tiempoProcesamiento.toFixed(2)}ms`,
      advertencias,
    },
  }
}
