@echo off
echo Starting Ecommerce Store Servers...
echo.
echo Customer Store: http://localhost:3000
echo Admin Panel: http://localhost:3001
echo.
echo Press Ctrl+C to stop both servers
echo.

start "Customer Store" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul
start "Admin Panel" cmd /k "npm run dev:admin"

echo Both servers are starting...
echo Customer Store will be available at http://localhost:3000
echo Admin Panel will be available at http://localhost:3001
echo.
pause

