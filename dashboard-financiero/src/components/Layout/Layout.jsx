import Sidebar from '../Sidebar/Sidebar'
import './Layout.css'

const Layout = ({ children, vistaActiva, setVistaActiva }) => {
  return (
    <div className="app-layout">
      {/* Nuevo menú lateral recibe los controles de navegación */}
      <Sidebar vistaActiva={vistaActiva} setVistaActiva={setVistaActiva} />
      
      {/* Área principal donde se renderizan las páginas temporalmente */}
      <main className="app-main">
        {children}
      </main>
    </div>
  )
}

export default Layout
