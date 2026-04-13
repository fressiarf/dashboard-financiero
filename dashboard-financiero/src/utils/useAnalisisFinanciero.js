import { useState, useEffect, useMemo } from 'react'
import { generarAnalisisFinanciero } from '../services/analizadorFinanciero'

const useAnalisisFinanciero = (kpis) => {
  const [analisis, setAnalisis] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  const kpisMemorizados = useMemo(() => kpis, [JSON.stringify(kpis)])

  useEffect(() => {
    if (!kpisMemorizados || typeof kpisMemorizados !== 'object') {
      setError('No se proporcionaron KPIs válidos para el análisis.')
      return
    }
    setCargando(true)
    setError(null)
    try {
      const resultado = generarAnalisisFinanciero(kpisMemorizados)
      setAnalisis(resultado)
    } catch (excepcion) {
      console.error('[useAnalisisFinanciero] Error al generar análisis:', excepcion)
      setError(`Error al procesar el análisis: ${excepcion.message}`)
      setAnalisis(null)
    } finally {
      setCargando(false)
    }
  }, [kpisMemorizados])

  return { analisis, cargando, error }
}

export default useAnalisisFinanciero
