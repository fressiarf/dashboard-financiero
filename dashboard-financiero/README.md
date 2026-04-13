# Aura Finance — Analytics Workspace

Aura Finance es una plataforma SaaS de alto impacto diseñada para la gestión y el análisis inteligente de indicadores financieros (KPIs). Construida con una arquitectura modular y un diseño de vanguardia tipo fintech, Aura proporciona claridad inmediata sobre la salud financiera de cualquier organización.

---

## Identidad del Producto
Aura Finance no es solo un dashboard; es un espacio de trabajo diseñado para la toma de decisiones estratégicas.
- **Concepto**: "Claridad para tus decisiones".
- **Estética**: Diseño Glassmorphism de última generación sobre un fondo corporativo profundo, con tipografía Inter y una paleta de colores optimizada para el análisis de alto nivel.

---

## Características Principales

- **Dashboard Inteligente**: Visualización inmediata de la salud financiera global (0-100).
- **Interfaz Glassmorphism**: Efectos de cristal translúcido y desenfoque (blur) dinámico para una experiencia de usuario premium.
- **Mensajería Predictiva**: El sistema genera saludos y estados basados en el análisis matemático real de los datos.
- **Navegación Interactiva**: Sidebar persistente con secciones funcionales de Dashboard, Transacciones, Reportes y Configuración.
- **Motor de Análisis 100% Local**: Procesamiento de datos en menos de 100ms sin depender de APIs externas o IA, garantizando privacidad y velocidad.
- **Visualización de KPIs**: Tarjetas de indicadores con tendencias, colores semánticos y barras de progreso animadas.
- **Multi-vistas**:
  - **Dashboard**: Resumen ejecutivo y salud financiera.
  - **Transacciones**: Libro de movimientos contables con estados dinámicos.
  - **Reportes**: Centro de descarga de informes trimestrales.
  - **Configuración**: Gestión de preferencias de moneda y alertas.

---

## Stack Tecnológico

- **Core**: React 19 + Vite
- **Estado**: Context API (Global State Management)
- **Estilos**: Vanilla CSS con variables CSS3, Glassmorphism y Flexbox/Grid.
- **Iconos**: Sistema modular de SVG Sprites (sin emojis, iconos vectoriales puros).

---

## Estructura del Proyecto

```
dashboard-financiero/
├── public/                 # Assets públicos (Iconos SVG, Fondos)
├── src/
│   ├── components/         # Componentes reutilizables (Sidebar, Icono, Layout)
│   ├── constants/          # Reglas de negocio y umbrales financieros
│   ├── context/            # Estado global (AnalisisContexto)
│   ├── pages/              # Pantallas (Dashboard, Transacciones, Reportes, Ajustes)
│   ├── routing/            # Sistema de navegación interno
│   ├── services/           # Motor de análisis (Lógica pura JS)
│   ├── utils/              # Hooks personalizados y helpers
│   ├── App.jsx             # Punto de entrada React
│   └── index.css           # Design System y variables de tema
└── package.json            # Dependencias
```

---

## Instalación y Ejecución

1. Entra en la carpeta del proyecto:
   ```bash
   cd dashboard-financiero
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia Aura Finance en modo desarrollo:
   ```bash
   npm run dev
   ```

La aplicación estará disponible en `http://localhost:5173`

---

## KPIs y Análisis
El motor de Aura evalúa:
- **Rentabilidad**: Margen Neto, Bruto y ROI.
- **Eficiencia**: Relación de costos fijos y punto de equilibrio.
- **Crecimiento**: Variación mensual y tendencias de ventas.
- **Sostenibilidad**: Ratio deuda/activos y flujo de efectivo neto.

---

## Notas de Privacidad
Aura Finance es una solución "Privacy-First". Todo el análisis se realiza localmente en el navegador del usuario. Ninguna información financiera sale jamás de la máquina local.

---
*Desarrollado para la excelencia financiera académica y profesional.*