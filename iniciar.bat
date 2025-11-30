@echo off
echo Iniciando App SENATI...
if not exist "node_modules" (
    echo Instalando librerias por primera vez...
    call npm install
)
call npm run dev