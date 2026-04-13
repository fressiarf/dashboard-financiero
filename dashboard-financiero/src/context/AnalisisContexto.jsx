import { createContext, useContext, useState } from 'react'

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

const AnalisisContexto = createContext(null)

export const ProveedorAnalisis = ({ children }) => {
  const [kpis, setKpis]               = useState(KPI_INICIALES)
  const [modoEdicion, setModoEdicion] = useState(false)
  // Volvemos al Dark Mode como valor principal por defecto
  const [modoOscuro, setModoOscuro]   = useState(true)

  const valor = { kpis, setKpis, modoEdicion, setModoEdicion, modoOscuro, setModoOscuro }

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
