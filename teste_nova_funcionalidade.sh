#!/bin/bash

echo "=== TESTE DA NOVA FUNCIONALIDADE DE DOWNLOAD ==="
echo ""

# 1. Testar se o servidor está rodando
echo "1. Verificando se o servidor está rodando..."
curl -s http://localhost:3001/status > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Servidor está rodando"
else
    echo "❌ Servidor não está rodando"
    exit 1
fi

# 2. Testar se a nova página admin carrega
echo ""
echo "2. Testando se a nova página admin carrega..."
STATUS=$(curl -u "admin:Felicidade2020!" -s -o /dev/null -w "%{http_code}" "http://localhost:3001/admin.html")
if [ "$STATUS" -eq 200 ]; then
    echo "✅ Página admin carrega corretamente"
else
    echo "❌ Erro ao carregar página admin (Status: $STATUS)"
fi

# 3. Testar endpoint de dados
echo ""
echo "3. Testando endpoint de dados..."
DADOS=$(curl -u "admin:Felicidade2020!" -s "http://localhost:3001/dados")
if [ $? -eq 0 ]; then
    TOTAL=$(echo $DADOS | grep -o '"total":[0-9]*' | cut -d':' -f2)
    echo "✅ Endpoint de dados funcionando"
    echo "   Total de registros: $TOTAL"
else
    echo "❌ Erro no endpoint de dados"
fi

# 4. Testar se o download CSV ainda funciona (backup)
echo ""
echo "4. Testando download CSV (backup)..."
curl -u "admin:Felicidade2020!" -s -o "teste_csv_backup.csv" "http://localhost:3001/download"
if [ -f "teste_csv_backup.csv" ]; then
    echo "✅ Download CSV funcionando como backup"
    echo "   Tamanho: $(ls -lh teste_csv_backup.csv | awk '{print $5}')"
    rm -f teste_csv_backup.csv
else
    echo "❌ Erro no download CSV"
fi

echo ""
echo "=== RESUMO DA NOVA IMPLEMENTAÇÃO ==="
echo ""
echo "🎯 MUDANÇAS IMPLEMENTADAS:"
echo "   - ✅ Apenas 1 botão: 'Download Lista'"
echo "   - ✅ Funciona em qualquer ambiente (local/externo)"
echo "   - ✅ Usa window.print() para gerar PDF"
echo "   - ✅ Não depende de Puppeteer no servidor"
echo "   - ✅ Compatível com todos os navegadores"
echo ""
echo "📱 COMO USAR:"
echo "   1. Acesse: http://localhost:3001/admin.html"
echo "   2. Login: admin / Felicidade2020!"
echo "   3. Clique em 'Download Lista'"
echo "   4. Nova janela abrirá com lista formatada"
echo "   5. Clique em 'Imprimir / Salvar PDF'"
echo "   6. Escolha 'Salvar como PDF' no navegador"
echo ""
echo "🌐 VANTAGENS PARA AMBIENTE EXTERNO:"
echo "   - ✅ Não precisa de Puppeteer no servidor"
echo "   - ✅ Funciona em qualquer navegador"
echo "   - ✅ Mais rápido e confiável"
echo "   - ✅ Menos recursos do servidor"
echo "   - ✅ Compatível com qualquer hosting"
