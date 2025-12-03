import React, { useState, useRef } from 'react';
import { ViewState, UserProfile, Course } from './types';
import { VALID_ID, VALID_PASS, MOCK_USER, getScheduleForDate } from './constants';
import { BottomNav } from './components/BottomNav';
import { CourseCard } from './components/CourseCard';
import { Scanner } from './components/Scanner';
import { CalendarStrip } from './components/Calendar';
import { MapSimulation } from './components/MapSimulation';
import { Lock, User as UserIcon, LogOut, ChevronRight, Bell, MapPin, School, BookOpen, Clock, Calendar, Edit2, Camera, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<ViewState>('LOGIN');

  // User State (Moved from constants to state to allow editing)
  const [user, setUser] = useState<UserProfile>(MOCK_USER);

  // Login State
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // App State
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempNickname, setTempNickname] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Login Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId === VALID_ID && password === VALID_PASS) {
      setIsAuthenticated(true);
      setCurrentView('DASHBOARD');
      setError('');
    } else {
      setError('Credenciales inválidas. Por favor verifique.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('LOGIN');
    setUserId('');
    setPassword('');
  };

  const handleScanSuccess = () => {
    // Navigate to schedule to show current class info
    setCurrentView('SCHEDULE');
  };

  const handleNavigate = (course: Course) => {
    setActiveCourse(course);
    setCurrentView('MAP');
  };

  // Profile Editing Handlers
  const handleStartEdit = () => {
    setTempNickname(user.nickname || '');
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    setUser(prev => ({
      ...prev,
      nickname: tempNickname
    }));
    setIsEditingProfile(false);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prev => ({
          ...prev,
          photoUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Render Logic
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-senati-blue rounded-b-[40px] shadow-xl z-0"></div>

        <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-white p-2 rounded-xl shadow-md mb-4 flex items-center justify-center border border-gray-100">
              {/* Simulating Senati Logo with Text for now */}
              <span className="text-senati-blue font-black text-2xl tracking-tighter">SENATI</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Bienvenido</h2>
            <p className="text-gray-500 text-sm mt-1">SINFO - Sistema de Información</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-2 ml-1">ID Estudiante</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="000000000"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-senati-blue focus:border-transparent outline-none transition-all text-gray-800 font-medium placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-2 ml-1">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-senati-blue focus:border-transparent outline-none transition-all text-gray-800"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg flex items-center">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-senati-blue hover:bg-senati-dark text-white font-bold py-3.5 rounded-lg shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] mt-4"
            >
              INICIAR SESIÓN
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-gray-400">
            &copy; 2024 SENATI. Todos los derechos reservados.
          </div>
        </div>
      </div>
    );
  }

  // Full Screen Map View
  if (currentView === 'MAP' && activeCourse) {
    return <MapSimulation course={activeCourse} onBack={() => setCurrentView('SCHEDULE')} />;
  }

  // Authenticated Views
  return (
    <div className="min-h-screen bg-gray-50 pb-20 max-w-md mx-auto shadow-2xl relative">

      {/* Header (Hidden on Scanner) */}
      {currentView !== 'SCANNER' && (
        <header className="bg-senati-blue text-white p-6 pb-8 rounded-b-[30px] shadow-lg sticky top-0 z-20">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <img
                src={user.photoUrl}
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-white/30 object-cover"
              />
              <div>
                <h1 className="text-lg font-bold leading-tight">
                  {user.nickname ? user.nickname : user.name}
                </h1>
                <p className="text-blue-200 text-xs">{user.id}</p>
              </div>
            </div>
            <button className="relative p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-senati-accent rounded-full border border-senati-blue"></span>
            </button>
          </div>

          {currentView === 'DASHBOARD' && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <p className="text-blue-100 text-xs mb-1 uppercase tracking-wide opacity-80">Próxima Clase</p>
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="font-bold text-xl">Inteligencia de Negocios</h3>
                  <div className="flex items-center text-sm text-blue-100 mt-1">
                    <Clock size={14} className="mr-1" />
                    10:15 - 12:30
                  </div>
                </div>
                <div className="bg-white text-senati-blue px-3 py-1 rounded-full text-xs font-bold">
                  B-201
                </div>
              </div>
            </div>
          )}
        </header>
      )}

      {/* Main Content Area */}
      <main className="px-4 -mt-4 relative z-10">

        {/* DASHBOARD VIEW */}
        {currentView === 'DASHBOARD' && (
          <div className="space-y-4">
            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setCurrentView('SCHEDULE')}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-2 text-senati-blue">
                  <BookOpen size={20} />
                </div>
                <span className="text-sm font-semibold text-gray-700">Mis Cursos</span>
              </button>

              <button
                onClick={() => setCurrentView('SCANNER')}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center mb-2 text-senati-accent">
                  <MapPin size={20} />
                </div>
                <span className="text-sm font-semibold text-gray-700">Ubicar Aula</span>
              </button>
            </div>

            {/* Today's Summary */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-gray-800 font-bold mb-4 flex items-center">
                <CalendarStrip selectedDate={new Date()} onSelectDate={() => { }} />
                <span className="ml-2 hidden">Hoy</span>
              </h3>

              <div className="space-y-4">
                {getScheduleForDate(new Date()).length > 0 ? (
                  getScheduleForDate(new Date()).slice(0, 2).map((course, idx) => (
                    <div key={idx} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="w-16 flex flex-col items-center mr-3">
                        <span className="text-xs font-bold text-gray-800">{course.startTime}</span>
                        <div className="h-full w-0.5 bg-gray-200 my-1"></div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 text-sm">{course.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{course.building} • {course.room}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No tienes cursos programados para hoy.
                  </div>
                )}
              </div>

              <button
                onClick={() => setCurrentView('SCHEDULE')}
                className="w-full mt-4 text-center text-sm text-senati-blue font-medium py-2 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center"
              >
                Ver horario completo <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* SCHEDULE VIEW */}
        {currentView === 'SCHEDULE' && (
          <div className="bg-white rounded-t-xl min-h-[70vh] shadow-sm">
            <CalendarStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />

            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">
                  {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
                </h2>
                <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded text-gray-600">
                  {getScheduleForDate(selectedDate).length} Cursos
                </span>
              </div>

              {getScheduleForDate(selectedDate).length > 0 ? (
                getScheduleForDate(selectedDate).map((course) => (
                  <CourseCard key={course.id} course={course} onNavigate={handleNavigate} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Calendar size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-gray-800 font-bold">Día Libre</h3>
                  <p className="text-gray-500 text-sm mt-1 max-w-[200px]">
                    No hay cursos programados para esta fecha. ¡Aprovecha para estudiar!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PROFILE VIEW */}
        {currentView === 'PROFILE' && (
          <div className="space-y-4 mt-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">

              {/* Profile Edit Overlay */}
              {isEditingProfile && (
                <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center p-6 animate-in fade-in">
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                  <h3 className="font-bold text-lg mb-6 text-gray-800">Editar Perfil</h3>

                  {/* Photo Edit */}
                  <div className="relative mb-6 group cursor-pointer">
                    <img
                      src={user.photoUrl}
                      alt="Preview"
                      className="w-28 h-28 rounded-full object-cover border-4 border-gray-100"
                    />
                    <div
                      className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="text-white" size={32} />
                    </div>
                    <div className="absolute bottom-0 right-0 bg-senati-accent p-2 rounded-full border-2 border-white pointer-events-none">
                      <Camera size={16} className="text-white" />
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                    />
                  </div>

                  {/* Nickname Edit */}
                  <div className="w-full mb-6">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Apodo (Nickname)</label>
                    <input
                      type="text"
                      value={tempNickname}
                      onChange={(e) => setTempNickname(e.target.value)}
                      placeholder="Ej. El Profe"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-senati-blue outline-none"
                    />
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    className="w-full bg-senati-blue text-white font-bold py-3 rounded-xl flex items-center justify-center"
                  >
                    <Save size={18} className="mr-2" />
                    Guardar Cambios
                  </button>
                </div>
              )}

              <div className="p-6 flex flex-col items-center border-b border-gray-100 relative">
                <button
                  onClick={handleStartEdit}
                  className="absolute top-4 right-4 p-2 bg-gray-50 rounded-full hover:bg-gray-100 text-senati-blue transition-colors"
                >
                  <Edit2 size={18} />
                </button>

                <img
                  src={user.photoUrl}
                  alt="Profile Large"
                  className="w-24 h-24 rounded-full border-4 border-gray-50 shadow-md mb-4 object-cover"
                />

                {/* Name & Nickname Logic */}
                <h2 className="text-xl font-bold text-gray-900 text-center">
                  {user.name} {user.lastName}
                </h2>

                {user.nickname && (
                  <span className="mt-1 px-3 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full border border-yellow-200">
                    "{user.nickname}"
                  </span>
                )}

                <p className="text-senati-blue font-medium bg-blue-50 px-3 py-1 rounded-full text-sm mt-3">ID: {user.id}</p>
              </div>

              <div className="p-4 space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <School className="text-gray-400 mr-3" size={20} />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Escuela</p>
                    <p className="text-gray-800 font-medium text-sm">{user.school}</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <BookOpen className="text-gray-400 mr-3" size={20} />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Carrera</p>
                    <p className="text-gray-800 font-medium text-sm">{user.program}</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Clock className="text-gray-400 mr-3" size={20} />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Semestre Actual</p>
                    <p className="text-gray-800 font-medium text-sm">{user.semester}</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-white border border-red-100 text-red-500 font-medium py-3 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center"
            >
              <LogOut size={18} className="mr-2" />
              Cerrar Sesión
            </button>
          </div>
        )}

      </main>

      {/* Full Screen Scanner Overlay */}
      {currentView === 'SCANNER' && (
        <Scanner onClose={() => setCurrentView('DASHBOARD')} onScanSuccess={handleScanSuccess} />
      )}

      {/* Bottom Navigation */}
      {currentView !== 'SCANNER' && currentView !== 'MAP' && (
        <BottomNav currentView={currentView} setView={setCurrentView} />
      )}
    </div>
  );
};

export default App;