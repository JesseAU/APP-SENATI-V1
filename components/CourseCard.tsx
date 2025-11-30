import React from 'react';
import { Course } from '../types';
import { MapPin, Clock, User, Building } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onNavigate: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onNavigate }) => {
  
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'Taller': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Laboratorio': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Seminario': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 transition-transform active:scale-[0.99]">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getBadgeColor(course.type)}`}>
            {course.type}
          </span>
          <h3 className="text-lg font-bold text-gray-800 mt-1 leading-tight">{course.name}</h3>
        </div>
      </div>

      <div className="space-y-2 mt-3">
        <div className="flex items-center text-sm text-gray-600">
          <Clock size={16} className="mr-2 text-senati-blue" />
          <span className="font-medium">{course.startTime} - {course.endTime}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <User size={16} className="mr-2 text-senati-blue" />
          <span>{course.teacher}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Building size={16} className="mr-2 text-senati-blue" />
          <span>{course.building} - <span className="text-gray-900 font-semibold">{course.room}</span></span>
        </div>
      </div>

      <button 
        onClick={() => onNavigate(course)}
        className="mt-4 w-full flex items-center justify-center bg-senati-blue hover:bg-senati-dark text-white py-2.5 rounded-lg font-medium transition-colors shadow-sm active:bg-senati-dark"
      >
        <MapPin size={18} className="mr-2" />
        Ir al Aula
      </button>
    </div>
  );
};