import React, { useEffect, useState } from 'react';
import { X, ScanLine, Loader2, CreditCard } from 'lucide-react';

interface ScannerProps {
  onClose: () => void;
  onScanSuccess: () => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onClose, onScanSuccess }) => {
  const [scanning, setScanning] = useState(true);
  const [message, setMessage] = useState("Escanee su Carnet de Alumno (QR)");

  useEffect(() => {
    // Simulate finding a QR code after 2.5 seconds
    const timer = setTimeout(() => {
      setScanning(false);
      setMessage("¡Datos de Alumno Verificados!");
      setTimeout(() => {
        onScanSuccess();
      }, 1000);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onScanSuccess]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="relative flex-1 bg-black overflow-hidden">
        {/* Camera simulation overlay */}
        <div className="absolute inset-0 opacity-40 bg-[url('https://picsum.photos/800/1200')] bg-cover bg-center"></div>
        
        {/* Scanner UI */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <div className="w-64 h-64 border-2 border-white/50 rounded-3xl relative overflow-hidden bg-white/5 backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-senati-accent rounded-tl-xl"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-senati-accent rounded-tr-xl"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-senati-accent rounded-bl-xl"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-senati-accent rounded-br-xl"></div>
            
            {scanning && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-senati-accent/80 shadow-[0_0_15px_rgba(243,146,0,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
            )}
            
            {/* ID Card Silhouette Hint */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
              <CreditCard size={120} className="text-white" />
            </div>
          </div>
          
          <div className="mt-8 bg-black/70 backdrop-blur-md px-6 py-4 rounded-2xl text-white font-medium flex flex-col items-center border border-white/10 shadow-xl">
            {scanning ? (
              <>
                <div className="flex items-center mb-1">
                  <Loader2 className="animate-spin mr-2 text-senati-accent" size={18} />
                  <span>Buscando QR...</span>
                </div>
                <p className="text-xs text-gray-300">Apunte al código de su carnet</p>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mb-2 animate-bounce">
                  <ScanLine size={24} className="text-white" />
                </div>
                <span className="text-green-400 font-bold text-lg text-center leading-tight">{message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 bg-black/40 text-white p-2 rounded-full backdrop-blur hover:bg-black/60 border border-white/10"
        >
          <X size={24} />
        </button>
      </div>

      <div className="bg-senati-blue text-white p-6 text-center pb-10 z-10">
        <p className="text-sm font-medium opacity-90">
          Mantenga el dispositivo estable para escanear
        </p>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};