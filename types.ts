export interface UserProfile {
  id: string;
  name: string;
  lastName: string;
  email: string;
  school: string; // Escuela o Facultad
  program: string; // Carrera
  semester: string;
  photoUrl: string;
  nickname?: string; // Optional nickname
}

export enum ClassType {
  THEORY = 'Tecnología',
  WORKSHOP = 'Taller',
  SEMINAR = 'Seminario',
  LAB = 'Laboratorio'
}

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface Course {
  id: string;
  name: string;
  type: ClassType;
  teacher: string;
  room: string;
  building: string;
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
  location: LocationCoordinates;
}

export interface DailySchedule {
  date: string; // YYYY-MM-DD
  courses: Course[];
}

export type ViewState = 'LOGIN' | 'DASHBOARD' | 'SCANNER' | 'PROFILE' | 'SCHEDULE' | 'MAP';