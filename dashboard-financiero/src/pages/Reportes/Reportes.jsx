import React from 'react'
import Icono from '../../components/Icono/Icono'
import '../Dashboard/Dashboard.css' 

const Reportes = () => {
  return (
    <div className="dashboard-page fade-in">
      <header className="page-header">
        <div className="page-header__texto">
          <h2>Centro de Reportes</h2>
          <p className="page-header__dinamico" style={{ padding: '0', background: 'transparent', border: 'none', color: 'var(--color-texto-suave)' }}>
            Descarga documentos financieros trimestrales e informes de auditoría.
          </p>
        </div>
        <div className="page-header__acciones">
          <button className="btn-editar-kpis">
            <Icono nombre="informacion" tamaño={15} />
            Generar Nuevo Reporte
          </button>
        </div>
      </header>

<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '24px', padding: '24px', background: 'var(--color-superficie)', border: '1px solid var(--color-borde)', borderRadius: '12px', maxWidth: '600px' }}>
          <div style={{ background: 'var(--color-superficie-2)', width: '80px', height: '80px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems:'center', justifyContent: 'center', padding: '12px', boxSizing: 'border-box' }}>
              <Icono nombre="imprimir" tamaño={32} clase="nivel-bueno" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: 'var(--tamaño-lg)', marginBottom: 'var(--espacio-2)' }}>No hay reportes recientes</h3>
            <p style={{ color: 'var(--color-texto-suave)' }}>
                Para visualizar la evolución de tendencias y métricas a largo plazo es necesario que se acumulen períodos en el tiempo (mes a mes).
            </p>
          </div>
      </div>
    </div>
  )
}

export default Reportes
