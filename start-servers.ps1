Write-Host "Starting Ecommerce Store Servers..." -ForegroundColor Green
Write-Host ""
Write-Host "Customer Store: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Admin Panel: http://localhost:3001" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Red
Write-Host ""

# Start Customer Store on port 3000
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev" -WindowStyle Normal

# Wait a moment
Start-Sleep -Seconds 3

# Start Admin Panel on port 3001
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev:admin" -WindowStyle Normal

Write-Host "Both servers are starting..." -ForegroundColor Green
Write-Host "Customer Store will be available at http://localhost:3000" -ForegroundColor Cyan
Write-Host "Admin Panel will be available at http://localhost:3001" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor White
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")