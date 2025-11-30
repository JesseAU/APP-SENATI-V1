import React from 'react';
import { Home, Calendar, QrCode, User } from 'lucide-react';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'DASHBOARD', icon: Home, label: 'Inicio' },
    { id: 'SCHEDULE', icon: Calendar, label: 'Horario' },
    { id: 'SCANNER', icon: QrCode, label: 'Escanear', highlight: true },
    { id: 'PROFILE', icon: User, label: 'Perfil' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe pt-2 px-2 z-50">
      <div className="flex justify-around items-end pb-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          
          if (item.highlight) {
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id as ViewState)}
                className="relative -top-5 flex flex-col items-center justify-center group"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform ${isActive ? 'bg-senati-dark scale-110' : 'bg-senati-blue hover:bg-senati-dark'}`}>
                  <Icon size={24} className="text-white" />
                </div>
                <span className="text-xs font-medium text-senati-blue mt-1">{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewState)}
              className={`flex flex-col items-center justify-center w-16 py-1 ${isActive ? 'text-senati-blue' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};