#!/bin/bash
# Startet den Entwicklungsserver von Nützlich

echo "🚀 Nützlich wird gestartet..."
echo ""

# Check ob node_modules existiert
if [ ! -d "node_modules" ]; then
  echo "📦 Dependencies installieren..."
  npm install
  if [ $? -ne 0 ]; then
    echo "❌ npm install fehlgeschlagen"
    exit 1
  fi
fi

echo "✅ Dev-Server läuft auf http://localhost:3000"
echo ""

npm run dev
