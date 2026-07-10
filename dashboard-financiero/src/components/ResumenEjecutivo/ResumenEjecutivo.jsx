import { useState, useEffect, useCallback } from 'react'
import useAnalisisFinanciero from '../../utils/useAnalisisFinanciero'
import { consultarIAFinanciera } from '../../services/iaSimulada'
import Icono from '../Icono/Icono'
import './ResumenEjecutivo.css'

const ICONOS_CATEGORIA = {
  rentabilidad:   'rentabilidad',
  eficiencia:     'eficiencia',
  crecimiento:    'crecimiento',
  sostenibilidad: 'sostenibilidad',
}

const ETIQUETAS_CATEGORIA = {
  rentabilidad:   'Rentabilidad',
  eficiencia:     'Eficiencia',
  crecimiento:    'Crecimiento',
  sostenibilidad: 'Sostenibilidad',
}

const claseEstado = (estado) => {
  const mapa = {
    'Salud Óptima':    'estado-optimo',
    'Bajo Riesgo':     'estado-bajo-riesgo',
    'Riesgo Moderado': 'estado-moderado',
    'Alto Riesgo':     'estado-alto-riesgo',
  }
  return mapa[estado] ?? 'estado-moderado'
}

const claseNivel = (nivel) => `nivel-${nivel}`

const calcularOffset = (puntaje) => {
  const circunferencia = 2 * Math.PI * 65
  return circunferencia - (puntaje / 100) * circunferencia
}

const clasesCirculo = (nivel) => `score-${nivel}`

const colorBarra = (nivel) => {
  const mapa = {
    excelente:   'var(--color-excelente)',
    bueno:       'var(--color-bueno)',
    advertencia: 'var(--color-advertencia)',
    critico:     'var(--color-critico)',
  }
  return mapa[nivel] ?? 'var(--color-primario)'
}

const CirculoScore = ({ puntaje, nivel }) => {
  const circunferencia = 2 * Math.PI * 65
  const offset = calcularOffset(puntaje)
  return (
    <div className="circulo-score" aria-label={`Puntaje de salud: ${puntaje} de 100`}>
      <svg viewBox="0 0 160 160" width="160" height="160">
        <circle className="circulo-score__fondo" cx="80" cy="80" r="65" />
        <circle
          className={`circulo-score__progreso ${clasesCirculo(nivel)}`}
          cx="80" cy="80" r="65"
          strokeDasharray={circunferencia}
          strokeDashoffset={offset}
          style={{ strokeDashoffset: offset }}
        />
      </svg>
      <div className="circulo-score__texto">
        <span className={`circulo-score__numero ${claseNivel(nivel)}`}>{puntaje}</span>
        <span className="circulo-score__label">/ 100</span>
      </div>
    </div>
  )
}

const TarjetaPerspectiva = ({ perspectiva }) => (
  <div className={`tarjeta-perspectiva tarjeta-perspectiva--${perspectiva.nivel}`}>
    <div className="tarjeta-perspectiva__fila-superior">
      <span className="tarjeta-perspectiva__metrica">{perspectiva.metrica}</span>
      <span className={`tarjeta-perspectiva__valor ${claseNivel(perspectiva.nivel)}`}>{perspectiva.valor}</span>
    </div>
    <span className="tarjeta-perspectiva__mensaje">{perspectiva.mensaje}</span>
    <span className="tarjeta-perspectiva__detalle">{perspectiva.detalle}</span>
  </div>
)

const CategoriaColapsable = ({ nombreClave, datos }) => {
  const [expandida, setExpandida] = useState(true)
  return (
    <div className={`categoria-perspectiva categoria-perspectiva--${datos.nivel} categoria-${nombreClave} ${expandida ? 'categoria-perspectiva--expandida' : ''}`}>
      <button
        className="categoria-perspectiva__cabecera"
        onClick={() => setExpandida(!expandida)}
        aria-expanded={expandida}
        id={`cabecera-${nombreClave}`}
      >
        <div className="categoria-perspectiva__izquierda">
          <Icono nombre={ICONOS_CATEGORIA[nombreClave]} tamaño={18} clase={claseNivel(datos.nivel)} />
          <span className="categoria-perspectiva__nombre">{ETIQUETAS_CATEGORIA[nombreClave]}</span>
          <span className="categoria-perspectiva__puntaje">{datos.puntaje}/100</span>
        </div>
        <Icono nombre={expandida ? 'colapsar' : 'expandir'} tamaño={16} clase="categoria-perspectiva__chevron" />
      </button>
      {expandida && (
        <div className="categoria-perspectiva__contenido" role="region" aria-labelledby={`cabecera-${nombreClave}`}>
          {datos.perspectivas.map((perspectiva, indice) => (
            <TarjetaPerspectiva key={indice} perspectiva={perspectiva} />
          ))}
        </div>
      )}
    </div>
  )
}

const TarjetaRecomendacion = ({ recomendacion }) => (
  <article className={`tarjeta-recomendacion tarjeta-recomendacion--${recomendacion.prioridad}`}>
    <div className="recomendacion__cabecera">
      <span className="recomendacion__categoria">{recomendacion.categoria}</span>
      <span className={`recomendacion__prioridad recomendacion__prioridad--${recomendacion.prioridad}`}>
        Prioridad {recomendacion.prioridad}
      </span>
    </div>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--espacio-4)' }}>
      <Icono nombre="recomendacion" tamaño={16} clase="nivel-bueno" />
      <p className="recomendacion__accion">{recomendacion.accion}</p>
    </div>
    <p className="recomendacion__razonamiento">{recomendacion.razonamiento}</p>
    <div className="recomendacion__impacto">
      <Icono nombre="excelente" tamaño={14} />
      <span>{recomendacion.impactoEsperado}</span>
    </div>
  </article>
)

const RiesgoItem = ({ riesgo }) => (
  <div className="riesgo-item">
    <div className={`riesgo-item__icono riesgo-item__icono--${riesgo.nivel}`}>
      <Icono nombre={riesgo.nivel === 'critico' ? 'alerta' : 'advertencia'} tamaño={18} />
    </div>
    <div className="riesgo-item__cuerpo">
      <div className="riesgo-item__cabecera">
        <span className="riesgo-item__factor">{riesgo.factor}</span>
        <span className={`riesgo-item__valor riesgo-item__valor--${riesgo.nivel}`}>{riesgo.valor}</span>
      </div>
      <p className="riesgo-item__descripcion">{riesgo.descripcion}</p>
      <span className="riesgo-item__categoria">{riesgo.categoria}</span>
    </div>
  </div>
)

const exportarJSON = (analisis) => {
  const contenido = JSON.stringify(analisis, null, 2)
  const blob = new Blob([contenido], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = `analisis-financiero-${new Date().toISOString().slice(0, 10)}.json`
  enlace.click()
  URL.revokeObjectURL(url)
}

// ─── Panel de Análisis IA ───────────────────────────────────────────────────

const PanelIA = ({ kpis, puntajeSalud }) => {
  const [estado, setEstado]   = useState('idle') // 'idle' | 'cargando' | 'listo'
  const [respuesta, setRespuesta] = useState(null)

  const consultar = useCallback(async () => {
    if (!kpis || !puntajeSalud) return
    setEstado('cargando')
    try {
      const result = await consultarIAFinanciera(kpis, puntajeSalud)
      setRespuesta(result)
      setEstado('listo')
    } catch {
      setEstado('idle')
    }
  }, [kpis, puntajeSalud])

  // Re-run automatically when kpis change and panel is already open
  useEffect(() => {
    if (estado === 'listo') {
      setEstado('idle')
      setRespuesta(null)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(kpis)])

  return (
    <section className="panel-ia" aria-labelledby="titulo-ia">
      <div className="panel-ia__cabecera">
        <div className="panel-ia__titulo-wrap">
          <div className="panel-ia__icono-wrap">
            <Icono nombre="calificacion" tamaño={16} />
          </div>
          <div>
            <h2 className="panel-ia__titulo" id="titulo-ia">Análisis con Inteligencia Artificial</h2>
            <p className="panel-ia__subtitulo">Motor analítico - Procesamiento en tiempo real</p>
          </div>
        </div>
        <button
          id="btn-consultar-ia"
          className={`panel-ia__btn ${estado === 'cargando' ? 'panel-ia__btn--cargando' : ''}`}
          onClick={consultar}
          disabled={estado === 'cargando'}
        >
          {estado === 'cargando' ? (
            <><div className="spinner-mini" aria-hidden="true" /> Analizando...</>
          ) : (
            <><Icono nombre="calificacion" tamaño={14} /> {respuesta ? 'Regenerar Análisis' : 'Consultar IA'}</>
          )}
        </button>
      </div>

      {estado === 'idle' && !respuesta && (
        <div className="panel-ia__placeholder">
          <Icono nombre="informacion" tamaño={32} clase="panel-ia__placeholder-icono" />
          <p>Haz clic en <strong>Consultar IA</strong> para obtener un análisis ejecutivo generado automáticamente a partir de los datos financieros del período.</p>
        </div>
      )}

      {estado === 'cargando' && (
        <div className="panel-ia__cargando">
          <div className="panel-ia__dots">
            <span /><span /><span />
          </div>
          <p>El motor financiero está procesando los indicadores...</p>
        </div>
      )}

      {estado === 'listo' && respuesta && (
        <div className="panel-ia__respuesta">
          <p className="panel-ia__texto">{respuesta.analisis}</p>
          <div className="panel-ia__meta">
            <span><Icono nombre="eficiencia" tamaño={11} /> Modelo: {respuesta.metadatos.modelo}</span>
            <span><Icono nombre="informacion" tamaño={11} /> Latencia simulada: {respuesta.metadatos.latenciaMs}ms</span>
            <span><Icono nombre="calificacion" tamaño={11} /> ~{respuesta.metadatos.tokensEstimados} tokens</span>
            <span><Icono nombre="editar" tamaño={11} /> {respuesta.metadatos.generadaEn}</span>
          </div>
        </div>
      )}
    </section>
  )
}

const ResumenEjecutivo = ({ kpis, alAnalisisCompleto }) => {
  const { analisis, cargando, error } = useAnalisisFinanciero(kpis)

  useEffect(() => {
    if (analisis && typeof alAnalisisCompleto === 'function') {
      alAnalisisCompleto(analisis)
    }
  }, [analisis, alAnalisisCompleto])

  if (cargando) {
    return (
      <div className="resumen-cargando">
        <div className="spinner" aria-hidden="true" />
        <span>Generando análisis financiero...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="riesgo-item" style={{ background: 'var(--color-critico-bg)', border: '1px solid var(--color-critico)' }}>
        <div className="riesgo-item__icono riesgo-item__icono--critico">
          <Icono nombre="alerta" tamaño={18} />
        </div>
        <div className="riesgo-item__cuerpo">
          <span className="riesgo-item__factor">Error en el análisis</span>
          <p className="riesgo-item__descripcion">{error}</p>
        </div>
      </div>
    )
  }

  if (!analisis) return null

  const { resumen, puntajeSalud, analisisDetallado, recomendaciones, factoresRiesgo, metadatos } = analisis
  const parrafos = resumen.split('\n\n')

  return (
    <section className="resumen-ejecutivo" aria-label="Resumen ejecutivo financiero">

      <header className="resumen-encabezado">
        <div className="resumen-encabezado__izquierda">
          <Icono nombre="calificacion" tamaño={28} clase="nivel-excelente" />
          <div>
            <h1 className="resumen-encabezado__titulo">Resumen Ejecutivo</h1>
            <p className="resumen-encabezado__subtitulo">Análisis financiero generado el {metadatos.generadoEn}</p>
          </div>
        </div>
        <div className="resumen-encabezado__acciones">
          <button id="btn-exportar" className="btn-accion" onClick={() => exportarJSON(analisis)} title="Exportar análisis como JSON">
            <Icono nombre="exportar" tamaño={15} />
            Exportar JSON
          </button>
          <button id="btn-imprimir" className="btn-accion btn-accion--primario" onClick={() => window.print()} title="Imprimir análisis">
            <Icono nombre="imprimir" tamaño={15} />
            Imprimir
          </button>
        </div>
      </header>

      <section className="medidor-salud" aria-labelledby="titulo-salud">
        <h2 className="medidor-salud__titulo" id="titulo-salud">
          <Icono nombre="salud" tamaño={20} clase="nivel-excelente" />
          Salud Financiera
        </h2>
        <div className="medidor-salud__contenedor">
          <CirculoScore puntaje={puntajeSalud.global} nivel={puntajeSalud.factores[0]?.nivel ?? 'bueno'} />
          <div className="medidor-salud__factores">
            {puntajeSalud.factores.map((factor) => (
              <div key={factor.nombre} className="factor-salud">
                <span className="factor-salud__nombre">{factor.nombre}</span>
                <div className="factor-salud__barra-fondo">
                  <div
                    className="factor-salud__barra-relleno"
                    style={{ width: `${factor.puntaje}%`, background: colorBarra(factor.nivel) }}
                    aria-valuenow={factor.puntaje}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    role="progressbar"
                  />
                </div>
                <span className={`factor-salud__puntaje ${claseNivel(factor.nivel)}`}>{factor.puntaje}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={`medidor-salud__estado ${claseEstado(puntajeSalud.estado)}`}>
          {puntajeSalud.estado} — {puntajeSalud.global}/100
        </div>
      </section>

      {/* Panel de IA simulada */}
      <PanelIA kpis={kpis} puntajeSalud={puntajeSalud} />

      <section className="narrativa" aria-labelledby="titulo-narrativa">
        <h2 className="narrativa__titulo" id="titulo-narrativa">
          <Icono nombre="informacion" tamaño={18} clase="nivel-bueno" />
          Análisis Ejecutivo
        </h2>
        {parrafos.map((parrafo, indice) => (
          <p key={indice} className="narrativa__parrafo">{parrafo}</p>
        ))}
      </section>

      <section className="perspectivas" aria-labelledby="titulo-perspectivas">
        <h2 className="perspectivas__titulo" id="titulo-perspectivas">Perspectivas por Categoría</h2>
        <div className="perspectivas__grid">
          {Object.entries(analisisDetallado).map(([clave, datos]) => (
            <CategoriaColapsable key={clave} nombreClave={clave} datos={datos} />
          ))}
        </div>
      </section>

      <section className="recomendaciones" aria-labelledby="titulo-recomendaciones">
        <h2 className="recomendaciones__titulo" id="titulo-recomendaciones">
          <Icono nombre="recomendacion" tamaño={18} clase="nivel-bueno" />
          Recomendaciones Accionables
        </h2>
        <div className="recomendaciones__grid">
          {recomendaciones.map((rec, indice) => (
            <TarjetaRecomendacion key={indice} recomendacion={rec} indice={indice} />
          ))}
        </div>
      </section>

      <section className="riesgos" aria-labelledby="titulo-riesgos">
        <h2 className="riesgos__titulo" id="titulo-riesgos">
          <Icono nombre="riesgo" tamaño={18} clase="nivel-critico" />
          Factores de Riesgo Identificados
        </h2>
        <div className="riesgos__lista">
          {factoresRiesgo.length === 0 ? (
            <div className="sin-riesgos">
              <Icono nombre="excelente" tamaño={18} />
              No se identificaron factores de riesgo significativos. Los indicadores están en niveles óptimos.
            </div>
          ) : (
            factoresRiesgo.map((riesgo, indice) => (
              <RiesgoItem key={indice} riesgo={riesgo} />
            ))
          )}
        </div>
      </section>

      <footer className="metadatos" aria-label="Metadatos del análisis">

        {metadatos.advertencias.length > 0 && (
          <span className="metadatos__item nivel-advertencia">
            <Icono nombre="advertencia" tamaño={12} />
            {metadatos.advertencias.length} advertencia(s) de validación
          </span>
        )}
      </footer>

    </section>
  )
}

export default ResumenEjecutivo
