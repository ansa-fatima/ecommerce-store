Write-Host "Starting Admin Panel on Port 3001..." -ForegroundColor Green
Write-Host ""
Write-Host "Admin Panel: http://localhost:3001/admin-login" -ForegroundColor Cyan
Write-Host "Customer Store: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Admin Credentials:" -ForegroundColor White
Write-Host "Email: admin@azhcollection.com" -ForegroundColor White
Write-Host "Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the admin server" -ForegroundColor Red
Write-Host ""

npm run dev:admin
