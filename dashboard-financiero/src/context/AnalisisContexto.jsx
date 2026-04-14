import { createContext, useContext, useState, useMemo } from 'react'
import { calcularTodosLosKpis, DATOS_BASE_INICIALES } from '../utils/calcularKpis'

const AnalisisContexto = createContext(null)

export const ProveedorAnalisis = ({ children }) => {
  const [datosBase, setDatosBase]         = useState(DATOS_BASE_INICIALES)
  const [modoEdicion, setModoEdicion]     = useState(false)
  const [modoOscuro, setModoOscuro]       = useState(true)

  // Los KPIs completos se calculan automáticamente cuando cambian los datos base
  const kpis = useMemo(() => calcularTodosLosKpis(datosBase), [datosBase])

  const valor = {
    datosBase, setDatosBase,
    kpis,
    modoEdicion, setModoEdicion,
    modoOscuro, setModoOscuro,
  }

  return (
    <AnalisisContexto.Provider value={valor}>
      <div className={modoOscuro ? 'tema-oscuro' : 'tema-claro'}>
        {children}
      </div>
    </AnalisisContexto.Provider>
  )
}

export const useAnalisis = () => {
  const contexto = useContext(AnalisisContexto)
  if (!contexto) throw new Error('useAnalisis debe usarse dentro de un ProveedorAnalisis')
  return contexto
}

export default AnalisisContexto
