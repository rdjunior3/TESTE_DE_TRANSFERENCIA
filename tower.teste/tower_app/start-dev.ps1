# Script de inicialização do Tower App
# Inicia Backend Mock e Frontend Vite

Write-Host "🚀 Iniciando Tower App..." -ForegroundColor Cyan
Write-Host ""

# Verifica se está no diretório correto
if (!(Test-Path "package.json")) {
    Write-Host "❌ Erro: Execute este script do diretório tower_app" -ForegroundColor Red
    exit 1
}

# Inicia o backend
Write-Host "📡 Iniciando Backend Mock (porta 5001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run backend"
Start-Sleep -Seconds 2

# Inicia o frontend
Write-Host "🌐 Iniciando Frontend Vite (porta 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "✅ Servidores iniciados com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Acesse a aplicação em: http://localhost:5173" -ForegroundColor Cyan
Write-Host "📍 API Mock em: http://localhost:5001" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔐 Credenciais de Admin:" -ForegroundColor Magenta
Write-Host "   Email: admin@tower.com" -ForegroundColor White
Write-Host "   Senha: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Pressione qualquer tecla para fechar este script..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

