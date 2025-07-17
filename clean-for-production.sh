#!/bin/bash

# Script para limpar dados de teste e preparar para produção
# Execute: chmod +x clean-for-production.sh && ./clean-for-production.sh

echo "🧹 Limpando dados para produção..."
echo ""

# Criar backup dos dados atuais
if [ -f "data/cadastros.csv" ] && [ -s "data/cadastros.csv" ]; then
    backup_file="data/cadastros_backup_$(date +%Y%m%d_%H%M%S).csv"
    cp "data/cadastros.csv" "$backup_file"
    echo "✅ Backup criado: $backup_file"
else
    echo "ℹ️  Nenhum dado para fazer backup"
fi

# Limpar arquivo CSV
echo -n "" > data/cadastros.csv
echo "✅ Arquivo CSV limpo"

# Verificar se está limpo
if [ -s "data/cadastros.csv" ]; then
    echo "❌ Erro: Arquivo não foi limpo corretamente"
    exit 1
else
    echo "✅ Arquivo está vazio (pronto para produção)"
fi

echo ""
echo "🚀 Preparando para deploy em produção..."

# Adicionar e commitar as mudanças
git add data/cadastros.csv .gitignore
git commit -m "Clean database for production launch"

# Fazer push
git push origin main

echo ""
echo "🎉 Pronto para produção!"
echo "✅ Base de dados limpa"
echo "✅ Backup salvo localmente"
echo "✅ Deploy atualizado no Render"
echo ""
echo "🌐 URL de produção: https://festa-julina-2025.onrender.com"
echo "👨‍💻 Painel admin: https://festa-julina-2025.onrender.com/admin.html"
echo ""
echo "💡 O servidor no Render será reiniciado automaticamente"
echo "   e começará com a base limpa!"
