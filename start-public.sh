#!/bin/bash

echo "🚀 Iniciando exposição pública segura..."
echo "========================================"

# Verificar se o servidor está rodando
if ! lsof -i :3001 > /dev/null 2>&1; then
    echo "❌ Servidor não está rodando na porta 3001"
    echo "Execute: npm start"
    exit 1
fi

echo "✅ Servidor rodando na porta 3001"

# Verificar se ngrok existe
if [ ! -f "./ngrok" ]; then
    echo "❌ ngrok não encontrado"
    echo "Execute: curl -Lo ngrok.zip https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-darwin-amd64.zip && unzip ngrok.zip"
    exit 1
fi

echo "✅ ngrok encontrado"

# Iniciar ngrok
echo "🌐 Iniciando túnel público..."
./ngrok http 3001 --log=stdout &
NGROK_PID=$!

echo "🔗 Aguarde alguns segundos para obter a URL pública..."
sleep 10

# Tentar obter URL
URL=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | grep -o 'https://[^"]*\.ngrok\.io' | head -1)

if [ ! -z "$URL" ]; then
    echo ""
    echo "🎉 SUCESSO! Sua aplicação está disponível publicamente em:"
    echo "📱 $URL"
    echo ""
    echo "🔒 Medidas de segurança ativas:"
    echo "   • Rate limiting (5 tentativas/15min)"
    echo "   • Validação de entrada"
    echo "   • Headers de segurança"
    echo "   • Logs de auditoria"
    echo ""
    echo "⚠️  IMPORTANTE:"
    echo "   • Mantenha este terminal aberto"
    echo "   • Monitore os logs regularmente"
    echo "   • URL muda a cada reinicialização"
    echo ""
    echo "🛑 Para parar: Ctrl+C"
else
    echo "❌ Erro ao obter URL pública"
    echo "Verifique se o ngrok está configurado corretamente"
    echo "Visite: https://dashboard.ngrok.com/get-started/your-authtoken"
fi

# Aguardar sinal para parar
wait $NGROK_PID
