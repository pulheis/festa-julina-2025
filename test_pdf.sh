#!/bin/bash

# Teste do endpoint PDF
echo "Testando endpoint PDF..."

# Fazer requisição com autenticação básica
curl -u "admin:Felicidade2020!" \
     -H "Accept: application/pdf" \
     -o "teste_pdf.pdf" \
     "http://localhost:3001/download-pdf"

if [ $? -eq 0 ]; then
    echo "✅ PDF baixado com sucesso!"
    echo "Arquivo salvo como: teste_pdf.pdf"
    echo "Tamanho do arquivo: $(ls -lh teste_pdf.pdf | awk '{print $5}')"
else
    echo "❌ Erro ao baixar PDF"
fi

# Testar se o arquivo PDF foi criado
if [ -f "teste_pdf.pdf" ]; then
    echo "✅ Arquivo PDF criado com sucesso"
    file teste_pdf.pdf
else
    echo "❌ Arquivo PDF não foi criado"
fi
