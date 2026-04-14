import Icono from '../Icono/Icono'
import { useAnalisis } from '../../context/AnalisisContexto'
import './Sidebar.css'

const Sidebar = ({ vistaActiva, setVistaActiva }) => {
  const { modoOscuro, setModoOscuro } = useAnalisis()

  const opciones = [
    { id: 'dashboard',     icono: 'rentabilidad', texto: 'Dashboard' },
    { id: 'transacciones', icono: 'dinero',        texto: 'Transacciones' },
    { id: 'reportes',      icono: 'exportar',      texto: 'Reportes' },
    { id: 'chatbot',       icono: 'calificacion',  texto: 'Asistente IA' },
    { id: 'ajustes',       icono: 'eficiencia',    texto: 'Configuración' },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__logo-box">
          <Icono nombre="salud" tamaño={20} />
        </div>
        <div className="sidebar__marca">
          <h1>Aura Finance</h1>
          <p>Analytics Workspace</p>
        </div>
      </div>

      <nav className="sidebar__nav">
        {opciones.map((opc) => (
          <button
            key={opc.id}
            className={`sidebar__link ${vistaActiva === opc.id ? 'sidebar__link--activo' : ''}`}
            onClick={() => setVistaActiva(opc.id)}
          >
            <Icono nombre={opc.icono} tamaño={18} />
            <span>{opc.texto}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="usuario-info">
          <div className="usuario-avatar">MB</div>
          <div className="usuario-detalles">
            <h4>Mi Empresa</h4>
            <span>Plan Enterprise</span>
          </div>
        </div>
        <button 
          className="btn-tema" 
          onClick={() => setModoOscuro(!modoOscuro)}
          title="Cambiar tema visual"
          style={{ width: 36, height: 36 }}
        >
           <Icono nombre={modoOscuro ? 'advertencia' : 'salud'} tamaño={16} />
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
