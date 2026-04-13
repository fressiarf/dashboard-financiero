import React from 'react'
import Icono from '../../components/Icono/Icono'
import '../Dashboard/Dashboard.css' // Reutilizamos los layouts del header

const Transacciones = () => {
  // Datos dummy financieros
  const transacciones = [
    { id: 'TRX-9821', fecha: 'Hoy, 10:42 AM', concepto: 'Pago Factura AWS', categoria: 'Infraestructura', monto: -1250.00, estado: 'completado' },
    { id: 'TRX-9820', fecha: 'Hoy, 09:15 AM', concepto: 'Abono Cliente Enterprise SA', categoria: 'Ingresos B2B', monto: 18500.00, estado: 'completado' },
    { id: 'TRX-9819', fecha: 'Ayer, 16:30 PM', concepto: 'Nómina Quincenal', categoria: 'Recursos Humanos', monto: -42000.00, estado: 'completado' },
    { id: 'TRX-9818', fecha: 'Ayer, 11:20 AM', concepto: 'Suscripciones Stripe MRR', categoria: 'Suscripciones', monto: 8400.00, estado: 'pendiente' },
    { id: 'TRX-9817', fecha: '11 Abr, 14:00 PM', concepto: 'Publicidad Google Ads', categoria: 'Marketing', monto: -3500.00, estado: 'completado' }
  ]

  return (
    <div className="dashboard-page fade-in">
      <header className="page-header">
        <div className="page-header__texto">
          <h2>Transacciones Recientes</h2>
          <p className="page-header__dinamico" style={{ padding: '0', background: 'transparent', border: 'none', color: 'var(--color-texto-suave)' }}>
            Revisa y concilia los últimos movimientos bancarios.
          </p>
        </div>
        <div className="page-header__acciones">
          <button className="btn-editar-kpis">
            <Icono nombre="exportar" tamaño={15} />
            Exportar CSV
          </button>
        </div>
      </header>

      <div className="card-pantalla-limpia">
        <table className="tabla-limpia">
           <thead>
             <tr>
               <th>ID Transacción</th>
               <th>Fecha</th>
               <th>Concepto</th>
               <th>Monto</th>
               <th>Estado</th>
             </tr>
           </thead>
           <tbody>
             {transacciones.map(tx => (
               <tr key={tx.id}>
                 <td style={{ color: 'var(--color-texto-muy-suave)', fontWeight: 600 }}>{tx.id}</td>
                 <td style={{ color: 'var(--color-texto-suave)' }}>{tx.fecha}</td>
                 <td style={{ fontWeight: 600, color: 'var(--color-texto)' }}>
                    {tx.concepto}
                    <div style={{ fontSize: '11px', color: 'var(--color-texto-muy-suave)', marginTop: '2px', fontWeight: 500 }}>{tx.categoria}</div>
                 </td>
                 <td style={{ fontWeight: 700, color: tx.monto > 0 ? 'var(--color-excelente)' : 'var(--color-texto)' }}>
                   {tx.monto > 0 ? '+' : ''}{tx.monto.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                 </td>
                 <td>
                   <span className={`badge-estado ${tx.estado === 'completado' ? 'badge-completado' : 'badge-pendiente'}`}>
                      {tx.estado}
                   </span>
                 </td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>
    </div>
  )
}

export default Transacciones
