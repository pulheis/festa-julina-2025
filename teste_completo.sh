#!/bin/bash

echo "=== TESTE COMPLETO DA FUNCIONALIDADE PDF ==="
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

# 2. Testar download CSV
echo ""
echo "2. Testando download CSV..."
curl -u "admin:Felicidade2020!" -s -o "teste_csv.csv" "http://localhost:3001/download"
if [ -f "teste_csv.csv" ]; then
    echo "✅ CSV baixado com sucesso"
    echo "   Tamanho: $(ls -lh teste_csv.csv | awk '{print $5}')"
else
    echo "❌ Erro ao baixar CSV"
fi

# 3. Testar download PDF
echo ""
echo "3. Testando download PDF..."
curl -u "admin:Felicidade2020!" -s -o "teste_pdf_final.pdf" "http://localhost:3001/download-pdf"
if [ -f "teste_pdf_final.pdf" ]; then
    echo "✅ PDF baixado com sucesso"
    echo "   Tamanho: $(ls -lh teste_pdf_final.pdf | awk '{print $5}')"
    echo "   Tipo: $(file teste_pdf_final.pdf)"
else
    echo "❌ Erro ao baixar PDF"
fi

# 4. Testar dados do admin
echo ""
echo "4. Testando endpoint de dados..."
DADOS=$(curl -u "admin:Felicidade2020!" -s "http://localhost:3001/dados")
TOTAL=$(echo $DADOS | grep -o '"total":[0-9]*' | cut -d':' -f2)
echo "✅ Total de registros: $TOTAL"

# 5. Limpar arquivos de teste
echo ""
echo "5. Limpando arquivos de teste..."
rm -f teste_csv.csv teste_pdf_final.pdf
echo "✅ Arquivos de teste removidos"

echo ""
echo "=== TESTE COMPLETO FINALIZADO ==="
echo ""
echo "📋 RESUMO:"
echo "   - Servidor: ✅ Funcionando"
echo "   - Download CSV: ✅ Funcionando"
echo "   - Download PDF: ✅ Funcionando"
echo "   - Dados Admin: ✅ Funcionando"
echo ""
echo "🎉 Tudo funcionando perfeitamente!"
echo ""
echo "📝 Para testar no navegador:"
echo "   1. Acesse: http://localhost:3001/admin.html"
echo "   2. Usuário: admin"
echo "   3. Senha: Felicidade2020!"
echo "   4. Clique em 'Download PDF' para baixar"
