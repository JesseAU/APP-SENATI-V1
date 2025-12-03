import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Navigation, Locate, Compass, Building, Warehouse, MapPin } from 'lucide-react';
import { Course } from '../types';

interface MapSimulationProps {
  course: Course;
  onBack: () => void;
}

export const MapSimulation: React.FC<MapSimulationProps> = ({ course, onBack }) => {
  const [navigating, setNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [instruction, setInstruction] = useState("Dirígete al Ingreso Principal");
  const [heading, setHeading] = useState(0); // For compass rotation

  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Parse location based on room code
  const isTowerA = course.room.includes("TA");
  const isTowerB = course.room.includes("TB");
  const isTowerC = course.room.includes("TC");

  // Parse floor
  const roomNumber = course.room.split('-')[1]?.trim() || "101";
  const floor = roomNumber.length >= 3 ? roomNumber.substring(0, roomNumber.length - 2) : "1";

  // --- WAYPOINT SYSTEM FOR OBSTACLE AVOIDANCE ---
  // Map Coordinate System: 0-100% X, 0-100% Y
  // Entrance: Top Center (50, 2)
  // Main Avenue Intersection: (50, 75) - Go down past everything
  // Towers Access Road: Y = 75

  const startPoint = { x: 50, y: 2 };
  const mainIntersection = { x: 50, y: 75 }; // Moved up to align with new road position

  // Destination Coordinates (Bottom Right area)
  let towerX = 72; // Default
  if (isTowerA) towerX = 70; // Leftmost tower
  if (isTowerB) towerX = 82; // Middle tower
  if (isTowerC) towerX = 94; // Rightmost tower

  const towerAccessPoint = { x: towerX, y: 75 }; // Point on the road aligned with tower
  const destinationPoint = { x: towerX, y: 85 }; // Actual door of the tower (Moved up)

  // Define Path Segments (Polyline)
  const pathPoints = [
    startPoint,           // 0: Start
    mainIntersection,     // 1: Walk down main avenue
    towerAccessPoint,     // 2: Turn right to specific tower column
    destinationPoint      // 3: Arrive at door
  ];

  // Calculate total path length for smooth progress
  const getDistance = (p1: { x: number, y: number }, p2: { x: number, y: number }) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };

  const segmentLengths = [
    getDistance(pathPoints[0], pathPoints[1]),
    getDistance(pathPoints[1], pathPoints[2]),
    getDistance(pathPoints[2], pathPoints[3])
  ];

  const totalLength = segmentLengths.reduce((a, b) => a + b, 0);

  // Determine current position based on global progress (0-100)
  const getCurrentPosition = (prog: number) => {
    const currentDist = (prog / 100) * totalLength;

    let accumulatedDist = 0;
    for (let i = 0; i < segmentLengths.length; i++) {
      if (currentDist <= accumulatedDist + segmentLengths[i]) {
        // We are in this segment
        const segmentProgress = (currentDist - accumulatedDist) / segmentLengths[i];
        const p1 = pathPoints[i];
        const p2 = pathPoints[i + 1];

        // Linear interpolation
        const x = p1.x + (p2.x - p1.x) * segmentProgress;
        const y = p1.y + (p2.y - p1.y) * segmentProgress;

        // Calculate angle for this segment
        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI) + 90;

        // Determine instruction based on segment
        let instr = "";
        if (i === 0) instr = "Avanza recto por la Avenida Principal";
        else if (i === 1) instr = "Gira a la izquierda hacia las Torres Tecnológicas";
        else if (i === 2) instr = `Ingresa a la Torre ${isTowerA ? 'A' : isTowerB ? 'B' : 'C'}`;

        return { x, y, angle, instr };
      }
      accumulatedDist += segmentLengths[i];
    }
    return { x: destinationPoint.x, y: destinationPoint.y, angle: 0, instr: "¡Has llegado!" };
  };

  const { x: currentX, y: currentY, angle: currentAngle, instr: currentInstruction } = getCurrentPosition(progress);

  useEffect(() => {
    if (navigating) {
      setInstruction(currentInstruction);
    }
  }, [currentInstruction, navigating]);

  useEffect(() => {
    // Device Orientation Handler
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setHeading(event.alpha);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);

    // Animation Loop
    let interval: number;
    if (navigating) {
      interval = window.setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setInstruction(`¡Llegaste! ${course.room} (Piso ${floor})`);
            return 100;
          }
          return prev + 0.15; // Speed of walking
        });
      }, 30);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      clearInterval(interval);
    };
  }, [navigating, course.room, floor]);

  useEffect(() => {
    // Center map on mount
    if (mapContainerRef.current) {
      // Center of 1200px is 600px.
      // We want to center that in the viewport.
      // Approximate center scroll:
      const scrollX = (1200 - mapContainerRef.current.clientWidth) / 2;
      if (scrollX > 0) {
        mapContainerRef.current.scrollTo({ top: 0, left: 300, behavior: 'smooth' });
      } else {
        // If viewport is wider than map, it will be centered by mx-auto, so scroll to 0 is fine or irrelevant
        // But if we want to ensure we start at the top
        mapContainerRef.current.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }

      // Better approach for mobile: Scroll to the road (center of map)
      // Road is at 50% of 1200 = 600px.
      // Viewport center = clientWidth / 2.
      // ScrollLeft = 600 - clientWidth / 2.
      const centerX = 600 - (mapContainerRef.current.clientWidth / 2);
      mapContainerRef.current.scrollTo({ top: 0, left: Math.max(0, centerX), behavior: 'smooth' });
    }
  }, []);

  const handleStartNavigation = () => {
    setNavigating(true);
    setProgress(0);
    // Center map roughly
    if (mapContainerRef.current) {
      const centerX = 600 - (mapContainerRef.current.clientWidth / 2);
      mapContainerRef.current.scrollTo({ top: 0, left: Math.max(0, centerX), behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-md p-4 pt-safe z-30 flex items-center sticky top-0">
        <button
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-600"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="ml-2 flex-1">
          <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Navegación Campus</div>
          <h2 className="text-lg font-bold text-senati-blue leading-none">{course.building}</h2>
          <div className="text-xs font-semibold text-senati-accent mt-0.5">{course.room} • Piso {floor}</div>
        </div>
        <div className="bg-gray-100 p-2 rounded-full">
          <Compass className={`text-senati-blue transition-transform duration-500`} style={{ transform: `rotate(${heading}deg)` }} size={24} />
        </div>
      </div>

      {/* Map Viewport - SCROLLABLE CONTAINER with extra padding to avoid HUD overlap */}
      <div ref={mapContainerRef} className="flex-1 relative overflow-auto bg-[#eef2f6] touch-pan-x touch-pan-y pb-48">

        {/* LARGE MAP CANVAS */}
        <div className="relative w-[1200px] h-[900px] bg-white shadow-2xl m-4 border-8 border-gray-300 rounded-xl overflow-hidden mx-auto">

          {/* --- BACKGROUND (Concrete/Road) --- */}
          <div className="absolute inset-0 bg-gray-100"></div>

          {/* --- ROADS / PATHS --- */}
          {/* Main Avenue Vertical */}
          <div className="absolute top-0 left-[45%] w-[10%] h-[75%] bg-gray-200 border-x-2 border-dashed border-white/50"></div>
          {/* Bottom Access Road Horizontal */}
          <div className="absolute top-[73%] left-[20%] right-[5%] h-[5%] bg-gray-200 border-y-2 border-dashed border-white/50"></div>

          {/* --- PANAMERICANA NORTE (Top Entrance) --- */}
          <div className="absolute top-0 left-0 right-0 h-[3%] bg-blue-500 flex items-center justify-center z-10 shadow-md">
            <span className="text-[12px] font-bold text-white tracking-[0.5em]">AV. PANAMERICANA NORTE - INGRESO SENATI</span>
          </div>
          {/* Entrance Gate */}
          <div className="absolute top-[3%] left-[50%] -translate-x-1/2 w-[120px] h-[10px] bg-gray-700 z-10"></div>
          <div className="absolute top-[3%] left-[50%] -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[15px] border-t-red-500 z-20 animate-bounce"></div>


          {/* --- LEFT SECTOR BUILDINGS --- */}

          {/* Parking (Moved to Top Left) */}
          <div className="absolute top-[12%] left-[15%] w-[30%] h-[12%] bg-blue-600 rounded-lg shadow-lg flex items-center justify-center border-b-4 border-blue-800">
            <span className="text-xs text-white font-bold uppercase">Playa de Estacionamiento</span>
          </div>

          {/* Comedor (Moved to Far Left) */}
          <div className="absolute top-[28%] left-[2%] w-[15%] h-[15%] bg-blue-600 rounded-lg shadow-lg flex flex-col items-center justify-center border-b-4 border-blue-800">
            <Warehouse className="text-white/80 mb-1" size={32} />
            <span className="text-sm text-white font-bold">COMEDOR</span>
          </div>

          {/* Auditoria (Moved to Left Center next to Comedor) */}
          <div className="absolute top-[28%] left-[20%] w-[20%] h-[15%] bg-blue-600 rounded-lg shadow-lg flex flex-col items-center justify-center border-b-4 border-blue-800">
            <Building className="text-white/80 mb-1" size={24} />
            <span className="text-sm text-white font-bold">AUDITORIA</span>
          </div>

          {/* Football Field (Estadio) */}
          <div className="absolute top-[48%] left-[10%] w-[30%] h-[20%] bg-green-600 rounded-lg border-4 border-white/80 shadow-inner flex items-center justify-center overflow-hidden">
            {/* Field markings */}
            <div className="absolute inset-4 border-2 border-white/40"></div>
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/40"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-white/40"></div>
            <span className="text-xs text-white/90 font-bold z-10 bg-green-700/50 px-2 rounded">ESTADIO</span>
          </div>

          {/* Aulas ETI (Moved Down) */}
          <div className="absolute top-[72%] left-[10%] w-[30%] h-[10%] bg-yellow-400 rounded-md shadow-md flex items-center justify-center border border-yellow-500">
            <span className="text-xs text-yellow-900 font-bold px-2">AULAS ETI (ESTUDIOS GENERALES)</span>
          </div>

          {/* Salones (New Bottom Left Block) */}
          <div className="absolute top-[85%] left-[15%] w-[20%] h-[10%] bg-blue-600 rounded-lg shadow-lg flex flex-col items-center justify-center border-b-4 border-blue-800">
            <span className="text-sm text-white font-bold">SALONES</span>
          </div>


          {/* --- RIGHT SECTOR BUILDINGS --- */}

          {/* Large Top Block */}
          <div className="absolute top-[12%] left-[55%] w-[35%] h-[18%] bg-blue-600 rounded-lg shadow-lg border-b-4 border-blue-800"></div>

          {/* Salones (Middle Block) */}
          <div className="absolute top-[35%] left-[55%] w-[25%] h-[12%] bg-blue-600 rounded-lg shadow-lg flex flex-col items-center justify-center border-b-4 border-blue-800">
            <Building className="text-white/80 mb-1" size={20} />
            <span className="text-sm text-white font-bold">SALONES</span>
          </div>

          {/* Two Side-by-Side Blocks */}
          <div className="absolute top-[52%] left-[55%] w-[16%] h-[20%] bg-blue-600 rounded-lg shadow-lg border-b-4 border-blue-800"></div>
          <div className="absolute top-[52%] left-[74%] w-[16%] h-[20%] bg-blue-600 rounded-lg shadow-lg border-b-4 border-blue-800"></div>


          {/* --- TORRES TECNOLÓGICAS (Bottom Right) --- */}

          {/* Zone Label */}
          <div className="absolute bottom-[20%] left-[65%] text-xs font-bold text-gray-400 tracking-widest uppercase">
            Complejo Tecnológico
          </div>

          {/* TORRE A */}
          <div className={`absolute bottom-[5%] left-[66%] w-[10%] h-[12%] flex flex-col items-center justify-center rounded-lg shadow-lg border-2 transition-all ${isTowerA ? 'bg-yellow-300 ring-4 ring-senati-accent scale-105 z-20' : 'bg-yellow-400 border-yellow-600'}`}>
            <span className="text-2xl font-black text-yellow-900 opacity-20 absolute">A</span>
            <span className="text-xs font-bold text-yellow-900 relative">TORRE A</span>
            <span className="text-[8px] text-yellow-800">60TA</span>
          </div>

          {/* TORRE B */}
          <div className={`absolute bottom-[5%] left-[78%] w-[10%] h-[12%] flex flex-col items-center justify-center rounded-lg shadow-lg border-2 transition-all ${isTowerB ? 'bg-yellow-300 ring-4 ring-senati-accent scale-105 z-20' : 'bg-yellow-400 border-yellow-600'}`}>
            <span className="text-2xl font-black text-yellow-900 opacity-20 absolute">B</span>
            <span className="text-xs font-bold text-yellow-900 relative">TORRE B</span>
            <span className="text-[8px] text-yellow-800">60TB</span>
          </div>

          {/* TORRE C */}
          <div className={`absolute bottom-[5%] left-[90%] w-[10%] h-[12%] flex flex-col items-center justify-center rounded-lg shadow-lg border-2 transition-all ${isTowerC ? 'bg-yellow-300 ring-4 ring-senati-accent scale-105 z-20' : 'bg-yellow-400 border-yellow-600'}`}>
            <span className="text-2xl font-black text-yellow-900 opacity-20 absolute">C</span>
            <span className="text-xs font-bold text-yellow-900 relative">TORRE C</span>
            <span className="text-[8px] text-yellow-800">60TC</span>
          </div>


          {/* --- DYNAMIC PATH RENDERING --- */}
          {navigating && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Path Line */}
              <polyline
                points={pathPoints.map(p => `${p.x}% ${p.y}%`).join(', ')}
                fill="none"
                stroke="#F39200"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-40"
              />
              <polyline
                points={pathPoints.map(p => `${p.x}% ${p.y}%`).join(', ')}
                fill="none"
                stroke="#F39200"
                strokeWidth="4"
                strokeDasharray="12 6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse"
                filter="url(#glow)"
              />

              {/* Start Dot */}
              <circle cx={`${startPoint.x}%`} cy={`${startPoint.y}%`} r="6" fill="#004B8D" />

              {/* Destination Marker */}
              <g transform={`translate(${destinationPoint.x * 12}, ${destinationPoint.y * 9})`}>
                {/* Note: Translate uses px approx, handled better via percent css in div */}
              </g>
            </svg>
          )}

          {/* Destination Pin (Using Div for easier positioning) */}
          {navigating && (
            <div
              className="absolute z-30 -translate-x-1/2 -translate-y-full"
              style={{ left: `${destinationPoint.x}%`, top: `${destinationPoint.y}%` }}
            >
              <div className="relative">
                <MapPin size={48} className="text-red-500 drop-shadow-lg animate-bounce" fill="currentColor" />
              </div>
            </div>
          )}

          {/* --- USER POSITION MARKER --- */}
          <div
            className="absolute z-40 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-linear"
            style={{ left: `${currentX}%`, top: `${currentY}%` }}
          >
            <div className="relative flex flex-col items-center">
              {/* Vision Cone (Optional) */}
              <div
                className="absolute bottom-1/2 w-32 h-32 bg-gradient-to-t from-transparent to-senati-accent/20 rounded-full blur-md origin-bottom transform -translate-x-1/2 pointer-events-none"
                style={{ transform: `rotate(${heading}deg)` }}
              ></div>

              <div
                className="w-10 h-10 bg-senati-blue border-[3px] border-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.3)]"
                style={{ transform: `rotate(${navigating ? currentAngle - 180 : 0}deg)` }}
              >
                {/* If navigating, arrow points to path. If not, arrow points N or User Bearing? 
                            Let's map the arrow to the movement direction. */}
                <Navigation size={18} className="text-white fill-current" />
              </div>

              {/* Name Tag */}
              <div className="mt-1 bg-black/70 backdrop-blur px-2 py-0.5 rounded text-[10px] text-white font-bold whitespace-nowrap">
                Tú
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* HUD Controls */}
      <div className="absolute bottom-6 left-4 right-4 z-40">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <div>
              <div className="text-xs text-gray-400 uppercase font-bold">Tiempo estimado</div>
              <div className="text-xl font-black text-gray-800 tracking-tight">
                {navigating ? Math.ceil((100 - progress) / 20) : 5} min <span className="text-base text-gray-500 font-normal">a pie</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-gray-400 uppercase font-bold">Distancia</div>
              <div className="text-lg font-bold text-gray-700">350 m</div>
            </div>
          </div>

          {navigating ? (
            <div className="bg-senati-blue text-white rounded-xl p-3 flex items-center shadow-lg transition-all duration-300">
              <div className="bg-white/20 p-2 rounded-full mr-3 animate-pulse">
                <Navigation size={20} className="text-white" fill="currentColor" style={{ transform: `rotate(${currentAngle - 180}deg)` }} />
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-blue-200 font-bold uppercase">Siguiente Paso</div>
                <div className="text-sm font-bold leading-tight">{instruction}</div>
              </div>
            </div>
          ) : (
            <button
              onClick={handleStartNavigation}
              className="w-full bg-senati-accent hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl shadow-lg transition-colors flex items-center justify-center active:scale-[0.98]"
            >
              <Locate size={20} className="mr-2" />
              INICIAR RUTA
            </button>
          )}
        </div>
      </div>
    </div>
  );
};