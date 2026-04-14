import { useAnalisis } from '../../context/AnalisisContexto'
import ResumenEjecutivo from '../../components/ResumenEjecutivo/ResumenEjecutivo'
import EntradaKpis from '../../components/EntradaKpis/EntradaKpis'
import GraficoIngresos from '../../components/GraficoIngresos/GraficoIngresos'
import Icono from '../../components/Icono/Icono'
import { useState } from 'react'
import './Dashboard.css'

const Dashboard = () => {
  const { kpis, datosBase, setDatosBase, modoEdicion, setModoEdicion } = useAnalisis()
  const [salud, setSalud] = useState(null)

  const manejarNuevosDatos = (nuevosDatosBase) => {
    setDatosBase(nuevosDatosBase)
    setModoEdicion(false)
  }

  const manejarAnalisisCompleto = (analisis) => {
    setSalud(analisis.puntajeSalud)
  }

  const obtenerMensajeBienvenida = () => {
    if (!salud) return "Calculando la salud de tu negocio..."
    if (salud.global >= 80) return "Tus finanzas lucen excepcionales hoy. Excelente trabajo manteniendo a raya los costos."
    if (salud.global >= 60) return "Tu empresa es estable, pero el radar de Aura indica que hay margen de optimización."
    if (salud.global >= 40) return "Atención: algunos de los indicadores principales requieren ajustes operativos pronto."
    return "Alerta Crítica: Tu salud financiera requiere de estrategias correctivas inmediatas."
  }

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <div className="page-header__texto">
          <h2>Bienvenido al panel de control</h2>
          <p className={`page-header__dinamico ${salud?.estado ? 'estado-' + salud.estado.toLowerCase().replace(/ /g, '-') : ''}`}>
             <Icono nombre="informacion" tamaño={14} style={{ opacity: 0.8 }} />
             {obtenerMensajeBienvenida()}
          </p>
        </div>
        
        <div className="page-header__acciones">
          <button
            className={`btn-editar-kpis ${modoEdicion ? 'activo' : ''}`}
            onClick={() => setModoEdicion(!modoEdicion)}
          >
            <Icono nombre="editar" tamaño={15} />
            {modoEdicion ? 'Ocultar Datos' : 'Actualizar Datos'}
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {modoEdicion && (
          <div className="dashboard__panel-edicion">
            <EntradaKpis
              datosBaseIniciales={datosBase}
              alEnviar={manejarNuevosDatos}
              alCancelar={() => setModoEdicion(false)}
            />
          </div>
        )}

        {/* Gráfico de Ingresos vs Gastos */}
        <GraficoIngresos kpis={kpis} />

        <ResumenEjecutivo kpis={kpis} alAnalisisCompleto={manejarAnalisisCompleto} />
      </div>
    </div>
  )
}

export default Dashboard
