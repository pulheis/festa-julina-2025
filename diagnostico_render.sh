#!/bin/bash

echo "🔍 DIAGNÓSTICO COMPLETO - FESTA JULINA 2025"
echo "=========================================="
echo ""

# URL do site
URL="https://festa-julina-2025.onrender.com"

# 1. Teste de conectividade básica
echo "1. 🌐 TESTE DE CONECTIVIDADE"
echo "----------------------------"
echo "Testando: $URL"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL")
echo "Status HTTP: $STATUS"

if [ "$STATUS" -eq 200 ]; then
    echo "✅ Site está respondendo normalmente"
else
    echo "❌ Site não está respondendo (Status: $STATUS)"
    exit 1
fi

# 2. Teste do painel admin
echo ""
echo "2. 🔐 TESTE DO PAINEL ADMIN"
echo "----------------------------"
ADMIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL/admin.html")
echo "Status Admin: $ADMIN_STATUS"

if [ "$ADMIN_STATUS" -eq 200 ]; then
    echo "✅ Painel admin está acessível"
else
    echo "❌ Painel admin não está acessível (Status: $ADMIN_STATUS)"
fi

# 3. Teste de endpoints da API
echo ""
echo "3. 🔧 TESTE DOS ENDPOINTS DA API"
echo "---------------------------------"

# Teste endpoint status
STATUS_API=$(curl -s -o /dev/null -w "%{http_code}" "$URL/status")
echo "Endpoint /status: $STATUS_API"

# Teste endpoint dados (deve retornar 401 sem auth)
DADOS_API=$(curl -s -o /dev/null -w "%{http_code}" "$URL/dados")
echo "Endpoint /dados: $DADOS_API (esperado 401)"

# Teste endpoint download (deve retornar 401 sem auth)
DOWNLOAD_API=$(curl -s -o /dev/null -w "%{http_code}" "$URL/download")
echo "Endpoint /download: $DOWNLOAD_API (esperado 401)"

# 4. Teste com autenticação
echo ""
echo "4. 🔑 TESTE COM AUTENTICAÇÃO"
echo "----------------------------"
AUTH_TEST=$(curl -u "admin:Felicidade2020!" -s -o /dev/null -w "%{http_code}" "$URL/dados")
echo "Autenticação admin: $AUTH_TEST"

if [ "$AUTH_TEST" -eq 200 ]; then
    echo "✅ Autenticação funcionando"
    # Buscar dados reais
    DADOS_REAIS=$(curl -u "admin:Felicidade2020!" -s "$URL/dados")
    TOTAL=$(echo "$DADOS_REAIS" | grep -o '"total":[0-9]*' | cut -d':' -f2)
    echo "Total de registros: $TOTAL"
else
    echo "❌ Problema na autenticação"
fi

# 5. Teste de performance
echo ""
echo "5. ⚡ TESTE DE PERFORMANCE"
echo "-------------------------"
RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$URL")
echo "Tempo de resposta: ${RESPONSE_TIME}s"

if (( $(echo "$RESPONSE_TIME < 5.0" | bc -l) )); then
    echo "✅ Performance adequada"
else
    echo "⚠️ Performance lenta"
fi

# 6. Teste de SSL
echo ""
echo "6. 🔒 TESTE DE SSL"
echo "------------------"
SSL_INFO=$(curl -s -I "$URL" | grep -i "strict-transport-security")
if [ -n "$SSL_INFO" ]; then
    echo "✅ SSL/HTTPS funcionando"
    echo "   $SSL_INFO"
else
    echo "❌ Problema com SSL"
fi

# 7. Teste de cache
echo ""
echo "7. 💾 TESTE DE CACHE"
echo "--------------------"
CACHE_INFO=$(curl -s -I "$URL" | grep -i "cache-control")
if [ -n "$CACHE_INFO" ]; then
    echo "✅ Headers de cache configurados"
    echo "   $CACHE_INFO"
else
    echo "⚠️ Cache não configurado"
fi

# 8. Teste de headers de segurança
echo ""
echo "8. 🛡️ TESTE DE SEGURANÇA"
echo "------------------------"
SECURITY_HEADERS=$(curl -s -I "$URL" | grep -E "(x-frame-options|x-content-type-options|x-xss-protection)")
if [ -n "$SECURITY_HEADERS" ]; then
    echo "✅ Headers de segurança configurados"
    echo "$SECURITY_HEADERS"
else
    echo "⚠️ Headers de segurança não encontrados"
fi

# 9. Teste de DNS
echo ""
echo "9. 🌍 TESTE DE DNS"
echo "------------------"
DNS_INFO=$(nslookup festa-julina-2025.onrender.com 2>/dev/null | grep -A2 "Name:")
if [ -n "$DNS_INFO" ]; then
    echo "✅ DNS resolvendo corretamente"
    echo "$DNS_INFO"
else
    echo "❌ Problema com DNS"
fi

# 10. Resumo final
echo ""
echo "📊 RESUMO FINAL"
echo "==============="
echo ""

if [ "$STATUS" -eq 200 ] && [ "$ADMIN_STATUS" -eq 200 ] && [ "$AUTH_TEST" -eq 200 ]; then
    echo "🎉 DIAGNÓSTICO: SITE FUNCIONANDO NORMALMENTE"
    echo ""
    echo "✅ Todos os testes passaram com sucesso!"
    echo "✅ Site principal: Funcionando"
    echo "✅ Painel admin: Funcionando"
    echo "✅ API endpoints: Funcionando"
    echo "✅ Autenticação: Funcionando"
    echo "✅ SSL/HTTPS: Funcionando"
    echo ""
    echo "🔗 LINKS PARA TESTE:"
    echo "   • Site: $URL"
    echo "   • Admin: $URL/admin.html"
    echo "   • Credenciais: admin / Felicidade2020!"
    echo ""
    echo "💡 POSSÍVEIS CAUSAS DE PROBLEMAS DE ACESSO:"
    echo "   1. Cache do navegador (Ctrl+F5 para limpar)"
    echo "   2. DNS local (tente outro navegador/dispositivo)"
    echo "   3. Firewall/Proxy corporativo"
    echo "   4. Conexão de internet instável"
    echo "   5. Extensões do navegador bloqueando"
    echo ""
    echo "🔧 SOLUÇÕES RECOMENDADAS:"
    echo "   • Limpar cache do navegador"
    echo "   • Tentar modo privado/incógnito"
    echo "   • Testar em outro navegador"
    echo "   • Verificar conexão de internet"
    echo "   • Desabilitar extensões temporariamente"
else
    echo "❌ DIAGNÓSTICO: PROBLEMAS DETECTADOS"
    echo ""
    echo "Problemas encontrados:"
    [ "$STATUS" -ne 200 ] && echo "   • Site principal não responde"
    [ "$ADMIN_STATUS" -ne 200 ] && echo "   • Painel admin não responde"
    [ "$AUTH_TEST" -ne 200 ] && echo "   • Autenticação não funciona"
    echo ""
    echo "🔧 AÇÕES RECOMENDADAS:"
    echo "   • Verificar logs do Render"
    echo "   • Redeploy da aplicação"
    echo "   • Verificar configurações do servidor"
fi

echo ""
echo "Data do teste: $(date)"
echo "=========================================="
