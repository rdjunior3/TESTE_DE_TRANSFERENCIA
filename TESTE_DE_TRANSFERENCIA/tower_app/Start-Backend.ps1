Write-Host "========================================" -ForegroundColor Cyan
Write-Host " TOWER APP - BACKEND API" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Iniciando servidor backend na porta 5001..." -ForegroundColor Green
Write-Host ""

try {
    node backend-mock.js
} catch {
    Write-Host "ERRO ao iniciar backend:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "Pressione qualquer tecla para fechar..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")


