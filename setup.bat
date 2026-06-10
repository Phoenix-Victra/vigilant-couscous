@echo off
cd /d "%~dp0"

echo Installing dependencies...
call npm install
if errorlevel 1 (
  echo ERROR: npm install failed. Make sure Node.js is installed.
  pause
  exit /b 1
)

echo.
echo Registering AI Daily Dashboard to run at Windows startup...
schtasks /create /tn "AI Daily Dashboard" /tr "\"%~dp0start.bat\"" /sc onlogon /rl highest /f
if errorlevel 1 (
  echo WARNING: Could not register startup task. Try running this script as Administrator.
) else (
  echo Startup task registered successfully.
)

echo.
echo Setup complete! Run start.bat to launch the dashboard.
pause
