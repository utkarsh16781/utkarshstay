@echo off
echo Starting UtkarshStay backend and frontend...

if not exist backend\node_modules (
    echo Installing backend dependencies - first run only, this can take a minute...
    cmd /c "cd backend && npm install"
)
if not exist frontend\node_modules (
    echo Installing frontend dependencies - first run only, this can take a minute...
    cmd /c "cd frontend && npm install"
)

start "UtkarshStay backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start "UtkarshStay frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Two windows just opened: one for the backend, one for the frontend.
echo Leave both windows open. Once the frontend window shows a "Local:" link,
echo open http://localhost:5173 in your browser.
pause
