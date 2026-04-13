import React from 'react'
import Icono from '../../components/Icono/Icono'
import '../Dashboard/Dashboard.css'

const Ajustes = () => {
  return (
    <div className="dashboard-page fade-in">
      <header className="page-header">
        <div className="page-header__texto">
          <h2>Configuración del Espacio</h2>
          <p className="page-header__dinamico" style={{ padding: '0', background: 'transparent', border: 'none', color: 'var(--color-texto-suave)' }}>
            Administra las preferencias de facturación y notificaciones.
          </p>
        </div>
        <div className="page-header__acciones">
          <button className="btn-editar-kpis activo">
            Guardar Cambios
          </button>
        </div>
      </header>

      <div className="card-pantalla-limpia" style={{ maxWidth: '800px', margin: '0' }}>
         <h3 style={{ fontSize: 'var(--tamaño-lg)', marginBottom: 'var(--espacio-4)', paddingBottom: 'var(--espacio-3)', borderBottom: '1px solid var(--color-borde-suave)' }}>Configuración de la Cuenta</h3>
         
         <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--espacio-5)' }}>
            <div className="campo-kpi">
               <label className="campo-kpi__etiqueta">Correo de Notificaciones</label>
               <input type="text" className="campo-kpi__input" defaultValue="admin@miempresa.com" />
            </div>

            <div className="campo-kpi">
               <label className="campo-kpi__etiqueta">Moneda Base</label>
               <select className="campo-kpi__input">
                  <option>MXN - Peso Mexicano</option>
                  <option>USD - Dólar Estadounidense</option>
                  <option>EUR - Euro</option>
               </select>
            </div>
            
            <div className="campo-kpi">
               <label className="campo-kpi__etiqueta">Frecuencia de Alertas Financieras</label>
               <select className="campo-kpi__input">
                  <option>Semanalmente</option>
                  <option>Diariamente</option>
                  <option>Solo en caso crítico</option>
               </select>
            </div>
         </div>
      </div>
    </div>
  )
}

export default Ajustes
