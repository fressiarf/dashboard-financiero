# Dashboard Financiero (React + Vite)

Este repositorio contiene la implementación completa de Aura Finance, una plataforma de gestión y análisis inteligente de indicadores financieros (KPIs), desarrollada con un enfoque en la privacidad de los datos, procesamiento local inmediato y una experiencia de usuario premium.

---

## Estado del Proyecto: Fase de Consolidación y Optimización

Actualmente, el proyecto ha superado la implementación del núcleo del motor de análisis local en JavaScript y se encuentra en fase de integración y refinamiento de la interfaz de usuario en el Frontend.

---

## Componentes del Sistema

### Motor Analítico (Lógica de Negocio en JavaScript)
* **Cálculos Financieros Detallados**: Implementación de fórmulas deterministas para el cálculo automático de margen bruto, margen neto, ROI, punto de equilibrio y crecimiento mensual.
* **Diagnóstico Automatizado**: Algoritmos de clasificación semántica para evaluar la salud financiera global de la organización en cuatro niveles: Excelente, Bueno, Advertencia y Crítico.
* **Clasificación de Transacciones**: Reglas heurísticas y procesamiento de palabras clave para agrupar movimientos contables en categorías de Ingreso, Gasto o Inversión, asignando un grado de confianza a la asignación.
* **Simulador de Inteligencia Artificial**: Motor de inferencia local que modela el comportamiento de un analista financiero senior mediante plantillas y análisis de datos en prosa natural, logrando respuestas detalladas sin latencia de red.
* **Asistente Conversacional (Chatbot)**: Procesamiento y normalización de lenguaje natural offline para responder de manera interactiva a preguntas sobre el estado de los KPIs financieros.

### Frontend (React + Vite)
* **Interfaz Visual Premium**: Aplicación de página única (SPA) responsiva basada en Glassmorphic Design, con soporte nativo para temas claro y oscuro, variables dinámicas en CSS3 y micro-animaciones.
* **Visualización Gráfica**: Integración con la librería Recharts para la proyección interactiva de ingresos, costos variables, costos fijos y tendencias del período.
* **Gestión de Estado Centralizada**: Arquitectura fundamentada en el Context API (AnalisisContexto) para propagar de manera reactiva cualquier modificación de los KPIs a través de toda la aplicación.
* **Navegación Fluida**: Enrutamiento interno modular controlado por el estado local de la SPA para transiciones eficientes y sin recarga de página.

---

## Documentación Técnica

Para entender a profundidad la estructura de la aplicación y la jerarquía de los componentes, consulte el siguiente árbol de directorios del proyecto:

```
dashboard-financiero/
├── public/                 # Recursos públicos (iconos SVG y fondos)
├── src/
│   ├── assets/             # Imágenes y recursos del frontend
│   ├── components/         # Componentes modulares reutilizables (Sidebar, Layout, EntradaKpis)
│   ├── constants/          # Constantes y umbrales de negocio financiero
│   ├── context/            # Proveedor de estado global (AnalisisContexto)
│   ├── pages/              # Vistas de la SPA (Dashboard, Transacciones, Reportes, Ajustes, Chatbot)
│   ├── routing/            # Sistema de navegación y rutas internas
│   ├── services/           # Lógica del motor analítico y chatbot local
│   ├── utils/              # Funciones auxiliares de cálculo y custom hooks
│   ├── App.jsx             # Componente raíz de la aplicación
│   └── index.css           # Hoja de estilos global y variables del tema
└── package.json            # Configuración de dependencias y scripts de Vite
```

---

## Guía de Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/fressiarf/dashboard-financiero.git
cd dashboard-financiero/dashboard-financiero
```

### 2. Instalación de Dependencias
Instale los paquetes necesarios listados en el archivo package.json mediante npm:
```bash
npm install
```

### 3. Ejecución en Entorno de Desarrollo
Inicie el servidor de desarrollo local provisto por Vite:
```bash
npm run dev
```

El servidor local se desplegará usualmente en `http://localhost:5173`.

---

## Control de Calidad y Verificación

El proyecto está configurado para garantizar buenas prácticas de desarrollo y validar la consistencia sintáctica del código mediante reglas estrictas.

### Ejecutar Linting
```bash
npm run lint
```

### Cobertura de Verificación
* **Estándar ECMAScript**: Validación sintáctica del código a través de ESLint.
* **Buenas Prácticas de React**: Aplicación de reglas para el uso adecuado de Hooks mediante los plugins oficiales de ESLint.
* **Verificación de Construcción**: Simulación del build de producción para validar la integridad del empaquetado final:
  ```bash
  npm run build
  ```

---

## Evidencias de Desarrollo

Puede revisar los archivos de configuración eslint.config.js y vite.config.js localizados en la raíz del proyecto para validar los parámetros de compilación, empaquetado y reglas de codificación.

---

## Tecnologías Utilizadas

| Capa | Tecnologías |
| --- | --- |
| Frontend | React 19, Vite 8, CSS Vanilla (Design System) |
| Gráficos y Visualización | Recharts |
| Motor de Análisis y Chatbot | JavaScript ES6+ (Procesamiento Local) |
| Estado Global | Context API |
| Herramientas | ESLint, npm |

---

Desarrollado por fressiarf