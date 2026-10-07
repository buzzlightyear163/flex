@echo off
setlocal
title RFLX - dev server
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo [!] Node.js hittades inte. Installera Node 20 eller senare fran https://nodejs.org och kor start.bat igen.
  pause
  exit /b 1
)

if not exist "node_modules\.bin\vite.cmd" (
  echo Installerar beroenden ^(npm install^)...
  call npm install
  if errorlevel 1 (
    echo [!] npm install misslyckades.
    pause
    exit /b 1
  )
)

echo Startar dev-servern pa http://localhost:5190 ...
call npm run dev
pause
