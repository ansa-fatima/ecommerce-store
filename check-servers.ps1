Write-Host "Checking Server Status..." -ForegroundColor Green
Write-Host ""

# Check Port 3000 (Customer Store)
$port3000 = netstat -an | findstr :3000
if ($port3000) {
    Write-Host "✅ Customer Store (Port 3000): RUNNING" -ForegroundColor Green
    Write-Host "   URL: http://localhost:3000" -ForegroundColor Cyan
} else {
    Write-Host "❌ Customer Store (Port 3000): NOT RUNNING" -ForegroundColor Red
    Write-Host "   Run: npm run dev" -ForegroundColor Yellow
}

Write-Host ""

# Check Port 3001 (Admin Panel)
$port3001 = netstat -an | findstr :3001
if ($port3001) {
    Write-Host "✅ Admin Panel (Port 3001): RUNNING" -ForegroundColor Green
    Write-Host "   URL: http://localhost:3001/admin/login" -ForegroundColor Cyan
    Write-Host "   Credentials: admin@azhcollection.com / admin123" -ForegroundColor Yellow
} else {
    Write-Host "❌ Admin Panel (Port 3001): NOT RUNNING" -ForegroundColor Red
    Write-Host "   Run: npm run dev:admin" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor White
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

