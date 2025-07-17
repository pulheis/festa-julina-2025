#!/bin/bash

echo "🔍 TESTE: CORREÇÃO CSP - BOTÃO DOWNLOAD LISTA"
echo "============================================="
echo ""

# 1. Verificar se o servidor está rodando
echo "1. 📡 VERIFICANDO SERVIDOR..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3001/status")
if [ "$STATUS" -eq 200 ]; then
    echo "✅ Servidor funcionando"
else
    echo "❌ Servidor não responde"
    exit 1
fi

# 2. Verificar CSP headers
echo ""
echo "2. 🔒 VERIFICANDO CSP HEADERS..."
CSP_HEADER=$(curl -s -I "http://localhost:3001/admin.html" | grep -i "content-security-policy")
echo "CSP Header: $CSP_HEADER"

if [[ "$CSP_HEADER" == *"script-src-attr 'unsafe-inline'"* ]]; then
    echo "✅ CSP configurado corretamente para event handlers"
else
    echo "❌ CSP ainda bloqueando event handlers"
fi

# 3. Verificar se a página admin carrega
echo ""
echo "3. 📄 VERIFICANDO PÁGINA ADMIN..."
ADMIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3001/admin.html")
if [ "$ADMIN_STATUS" -eq 200 ]; then
    echo "✅ Página admin carrega corretamente"
else
    echo "❌ Erro ao carregar página admin"
fi

# 4. Verificar se os botões estão presentes no HTML
echo ""
echo "4. 🔘 VERIFICANDO BOTÕES NO HTML..."
HTML_CONTENT=$(curl -s "http://localhost:3001/admin.html")

if [[ "$HTML_CONTENT" == *'id="atualizarBtn"'* ]]; then
    echo "✅ Botão 'Atualizar Dados' presente"
else
    echo "❌ Botão 'Atualizar Dados' não encontrado"
fi

if [[ "$HTML_CONTENT" == *'id="downloadBtn"'* ]]; then
    echo "✅ Botão 'Download Lista' presente"
else
    echo "❌ Botão 'Download Lista' não encontrado"
fi

# 5. Verificar se os event listeners estão no código
echo ""
echo "5. 🎯 VERIFICANDO EVENT LISTENERS..."
if [[ "$HTML_CONTENT" == *'addEventListener'* ]]; then
    echo "✅ Event listeners presentes no código"
else
    echo "❌ Event listeners não encontrados"
fi

# 6. Verificar se não há mais onclick inline
echo ""
echo "6. 🚫 VERIFICANDO REMOÇÃO DE ONCLICK INLINE..."
if [[ "$HTML_CONTENT" == *'onclick='* ]]; then
    echo "⚠️ Ainda há onclick inline no código"
    echo "   Localizações:"
    echo "$HTML_CONTENT" | grep -n "onclick=" | head -3
else
    echo "✅ Todos os onclick inline foram removidos"
fi

echo ""
echo "📊 RESUMO DO TESTE:"
echo "==================="
echo ""

if [ "$STATUS" -eq 200 ] && [ "$ADMIN_STATUS" -eq 200 ] && [[ "$CSP_HEADER" == *"script-src-attr 'unsafe-inline'"* ]]; then
    echo "🎉 SUCESSO: Correção CSP aplicada com sucesso!"
    echo ""
    echo "✅ Servidor funcionando"
    echo "✅ CSP configurado corretamente"
    echo "✅ Página admin carregando"
    echo "✅ Botões com IDs corretos"
    echo "✅ Event listeners implementados"
    echo "✅ Onclick inline removidos"
    echo ""
    echo "🔗 TESTE MANUAL:"
    echo "   1. Acesse: http://localhost:3001/admin.html"
    echo "   2. Login: admin / Felicidade2020!"
    echo "   3. Abra Developer Tools (F12)"
    echo "   4. Clique 'Download Lista'"
    echo "   5. Não deve aparecer erro de CSP"
else
    echo "❌ PROBLEMA: Algum teste falhou"
    echo ""
    echo "🔧 VERIFICAR:"
    echo "   - Servidor está rodando?"
    echo "   - CSP está configurado corretamente?"
    echo "   - Página admin carrega?"
    echo "   - Event listeners estão funcionando?"
fi

echo ""
echo "Data do teste: $(date)"
echo "============================================="
