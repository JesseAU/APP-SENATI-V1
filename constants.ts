import { ClassType, UserProfile, Course } from './types';

// SENATI Credentials
export const VALID_ID = "001592647";
export const VALID_PASS = "60322680%UJK";

export const MOCK_USER: UserProfile = {
  id: VALID_ID,
  name: "DIEGO LEONARDO ZAID",
  lastName: "URIARTE ORDOÑEZ",
  email: "001592647@senati.pe",
  school: "Escuela de Tecnologías de la Información",
  program: "Ingeniería de Software con IA",
  semester: "IV Semestre",
  photoUrl: "https://randomuser.me/api/portraits/men/32.jpg",
  nickname: "" // Default empty
};

// Coordinates for simulation (Senati Independencia approx)
const CENTER_LAT = -11.9904;
const CENTER_LNG = -77.0628;

// Function to generate schedule based on date
export const getScheduleForDate = (date: Date): Course[] => {
  const day = date.getDay(); // 0 = Sun, 1 = Mon, etc.
  
  // Sunday or Saturday - Free days
  if (day === 0) return [];
  if (day === 6) return [];

  const baseCourses: Course[] = [
    {
      id: "C001",
      name: "Desarrollo de Aplicaciones Móviles",
      type: ClassType.WORKSHOP,
      teacher: "Ing. Roberto M.",
      room: "60TA - 601", // Torre A, Piso 6
      building: "Torre Tecnológica",
      startTime: "07:45",
      endTime: "10:00",
      location: { lat: CENTER_LAT + 0.0002, lng: CENTER_LNG + 0.0001 }
    },
    {
      id: "C002",
      name: "Inteligencia de Negocios",
      type: ClassType.THEORY,
      teacher: "Lic. Ana G.",
      room: "60TB - 200", // Torre B, Piso 2
      building: "Torre Tecnológica",
      startTime: "10:15",
      endTime: "12:30",
      location: { lat: CENTER_LAT - 0.0003, lng: CENTER_LNG - 0.0002 }
    },
    {
      id: "C003",
      name: "Seguridad Informática",
      type: ClassType.LAB,
      teacher: "Ing. Pedro S.",
      room: "60TC - 504", // Torre C, Piso 5
      building: "Torre Tecnológica",
      startTime: "14:00",
      endTime: "16:15",
      location: { lat: CENTER_LAT + 0.0005, lng: CENTER_LNG - 0.0005 }
    }
  ];

  // Rotate courses based on day to make it look dynamic
  if (day === 1 || day === 3) { // Mon, Wed
    return [baseCourses[0], baseCourses[1]];
  } else if (day === 2 || day === 4) { // Tue, Thu
    return [baseCourses[2], {
      ...baseCourses[0], 
      id: "C004", 
      name: "Seminario de Tesis I", 
      type: ClassType.SEMINAR,
      startTime: "16:30",
      endTime: "18:00",
      room: "60TA - 304"
    }];
  } else { // Fri
    return [baseCourses[1], baseCourses[2]];
  }
};