@echo off
setlocal
title RFLX - verify (install + typecheck + build)
cd /d "%~dp0"
set LOG=verify.log
echo === verify %date% %time% > %LOG%

where node >> %LOG% 2>&1
if errorlevel 1 (
  echo NO_NODE >> %LOG%
  echo [!] Node.js hittades inte. Installera Node 20+ fran https://nodejs.org
  pause
  exit /b 1
)
node -v >> %LOG% 2>&1
call npm -v >> %LOG% 2>&1

echo Installerar beroenden...
echo === npm install >> %LOG%
call npm install --no-audit --no-fund >> %LOG% 2>&1
echo npm_install_exit=%errorlevel% >> %LOG%

echo Typecheck (tsc -b)...
echo === tsc -b >> %LOG%
call npx tsc -b >> %LOG% 2>&1
echo tsc_exit=%errorlevel% >> %LOG%

echo Produktionsbuild...
echo === npm run build >> %LOG%
call npm run build >> %LOG% 2>&1
echo build_exit=%errorlevel% >> %LOG%

echo === DONE >> %LOG%
echo Klart. Resultat i verify.log
timeout /t 3 >nul
