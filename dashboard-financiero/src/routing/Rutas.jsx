import { useState } from 'react'
import Layout from '../components/Layout/Layout'
import Dashboard from '../pages/Dashboard/Dashboard'
import Transacciones from '../pages/Transacciones/Transacciones'
import Reportes from '../pages/Reportes/Reportes'
import Ajustes from '../pages/Ajustes/Ajustes'

const Rutas = () => {
  // Estado que controla qué pantalla estamos viendo simulando un Router
  const [vistaActiva, setVistaActiva] = useState('dashboard')

  // Renderizador condicional de pantallas
  const renderizarPantalla = () => {
    switch (vistaActiva) {
      case 'transacciones': return <Transacciones />
      case 'reportes':      return <Reportes />
      case 'ajustes':       return <Ajustes />
      case 'dashboard':
      default:
        return <Dashboard />
    }
  }

  return (
    <Layout vistaActiva={vistaActiva} setVistaActiva={setVistaActiva}>
      {renderizarPantalla()}
    </Layout>
  )
}

export default Rutas
