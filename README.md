SENATI App - Documentación del Proyecto

📱 Resumen Ejecutivo
SENATI App es una aplicación móvil progresiva (PWA) diseñada para estudiantes del SENATI, que facilita la gestión académica diaria mediante funcionalidades de horarios, navegación en el campus y gestión de perfil.


🎯 Objetivo del Proyecto
Desarrollar una solución digital que mejore la experiencia estudiantil en SENATI mediante:
Acceso rápido a horarios de clases
Navegación asistida por GPS en el campus
Gestión de perfil personalizada
Sistema de escaneo QR para asistencia

🏗️ Arquitectura Técnica

Stack Tecnológico
Categoría	Tecnología	Versión
Frontend	React	18.2.0
Lenguaje	TypeScript	5.2.2
Build Tool	Vite	5.1.6
UI Icons	Lucide React	0.344.0
Estilos	Tailwind CSS	(via config)

Estructura del Proyecto

APP-SENATI-V1/
├── components/          # Componentes React reutilizables
│   ├── BottomNav.tsx   # Navegación inferior
│   ├── Calendar.tsx    # Selector de fechas
│   ├── CourseCard.tsx  # Tarjeta de curso
│   ├── MapSimulation.tsx # Sistema de navegación
│   └── Scanner.tsx     # Escáner QR
├── App.tsx             # Componente principal
├── types.ts            # Definiciones TypeScript
├── constants.ts        # Datos mock y configuración
└── index.tsx           # Punto de entrada
