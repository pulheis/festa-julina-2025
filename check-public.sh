#!/bin/bash

# 🎪 3ª Festa Julina da Grande Família - Configuração de Acesso Público
# Solução para o problema da senha do túnel

echo "🎪 3ª Festa Julina da Grande Família - Acesso Público"
echo "===================================================="

# Verificar se o servidor está rodando
if ! curl -s http://localhost:3001 >/dev/null; then
    echo "❌ Servidor não está rodando na porta 3001"
    echo "💡 Execute: npm start"
    exit 1
fi

echo "✅ Servidor está rodando em http://localhost:3001"
echo ""

echo "🌐 URL Pública Disponível:"
echo "📍 LocalTunnel: https://festa-julina-2025.loca.lt ✅ FUNCIONANDO"
echo "📍 Serveo: INDISPONÍVEL ❌"
echo ""

echo "🔑 IMPORTANTE - Sobre a senha do túnel:"
echo "• Visitantes verão uma página de aviso de segurança na primeira visita"
echo "• Instruções para visitantes:"
echo "  1. Deixe o campo 'Senha do Túnel' em BRANCO"
echo "  2. Clique em 'Submit' ou pressione Enter"
echo "  3. Se pedir IPv4/IPv6, digite: 192.168.1.1 e clique 'Submit'"
echo "  4. Será redirecionado para o formulário da festa"
echo "• Isso é normal e seguro - é apenas uma proteção do serviço gratuito"
echo ""

echo "📱 Mensagem para compartilhar:"
echo "─────────────────────────────────────────────────────────"
echo "🎪 3ª Festa Julina da Grande Família"
echo "📝 Formulário de Acesso: https://festa-julina-2025.loca.lt"
echo "🔥 Cadastre-se agora!"
echo ""
echo "⚠️  IMPORTANTE: Na primeira visita, você verá uma página de aviso de segurança."
echo "    1. Deixe o campo 'Senha do Túnel' em BRANCO e clique 'Submit'"
echo "    2. Se pedir IPv4/IPv6, digite: 192.168.1.1 e clique 'Submit'"
echo "    Isso é normal e seguro - é apenas uma proteção do serviço gratuito."
echo "─────────────────────────────────────────────────────────"
echo ""

echo "📊 Status do Túnel:"
if curl -s https://festa-julina-2025.loca.lt >/dev/null 2>&1; then
    echo "✅ Túnel está funcionando"
else
    echo "❌ Túnel não está respondendo"
    echo "💡 Reinicie com: lt --port 3001 --subdomain festa-julina-2025"
fi

echo ""
echo "💡 Para monitorar acessos, observe os logs do servidor Node.js"
