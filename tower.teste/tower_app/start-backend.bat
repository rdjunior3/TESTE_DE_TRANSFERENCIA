@echo off
cd /d "%~dp0"
echo ========================================
echo  INICIANDO BACKEND TOWER APP
echo ========================================
echo.
echo  Backend iniciando na porta 5001...
echo  Aguarde...
echo.
node backend-mock.js
pause


