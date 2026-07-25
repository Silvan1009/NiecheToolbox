#!/usr/bin/env pwsh
<#
.SYNOPSIS
Startet den Entwicklungsserver von Nützlich.

.DESCRIPTION
Installiert Dependencies falls nötig und startet npm run dev auf Port 3000.
#>

Write-Host "🚀 Nützlich wird gestartet..." -ForegroundColor Cyan
Write-Host ""

# Check ob node_modules existiert
if (-not (Test-Path "node_modules")) {
  Write-Host "📦 Dependencies installieren..." -ForegroundColor Yellow
  npm install
  if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install fehlgeschlagen" -ForegroundColor Red
    exit 1
  }
}

Write-Host "✅ Dev-Server läuft auf http://localhost:3000" -ForegroundColor Green
Write-Host ""

npm run dev
