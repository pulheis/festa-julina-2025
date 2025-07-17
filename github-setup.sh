#!/bin/bash

# Script para subir o projeto para o GitHub
# Execute: chmod +x github-setup.sh && ./github-setup.sh

echo "🚀 Configurando repositório no GitHub..."
echo ""

# Verificar se o usuário forneceu o nome de usuário do GitHub
if [ -z "$1" ]; then
    echo "❌ Erro: Você precisa fornecer seu nome de usuário do GitHub"
    echo "Uso: ./github-setup.sh SEU_USUARIO_GITHUB"
    echo "Exemplo: ./github-setup.sh thamirespulheis"
    exit 1
fi

GITHUB_USER=$1
REPO_NAME="festa-julina-2025"
GITHUB_URL="https://github.com/$GITHUB_USER/$REPO_NAME.git"

echo "👤 Usuário GitHub: $GITHUB_USER"
echo "📁 Repositório: $REPO_NAME"
echo "🔗 URL: $GITHUB_URL"
echo ""

# Verificar se já existe um remote origin
if git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  Remote origin já existe. Removendo..."
    git remote remove origin
fi

# Adicionar o remote
echo "🔗 Adicionando remote origin..."
git remote add origin $GITHUB_URL

# Verificar se a branch main existe
if ! git show-ref --verify --quiet refs/heads/main; then
    echo "🌿 Criando branch main..."
    git checkout -b main
fi

# Push para o GitHub
echo "📤 Enviando código para o GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Sucesso! Código enviado para o GitHub"
    echo "🌐 Acesse: https://github.com/$GITHUB_USER/$REPO_NAME"
    echo ""
    echo "🎯 Próximos passos:"
    echo "1. Acesse https://render.com"
    echo "2. Faça login com sua conta do GitHub"
    echo "3. Clique em 'New +' > 'Web Service'"
    echo "4. Conecte o repositório '$REPO_NAME'"
    echo "5. Use as configurações do arquivo render.yaml"
    echo ""
    echo "📖 Guia completo em: DEPLOY_RENDER.md"
else
    echo ""
    echo "❌ Erro ao enviar código para o GitHub"
    echo "Verifique se:"
    echo "- O repositório existe no GitHub"
    echo "- Você tem permissão de escrita"
    echo "- Sua autenticação está configurada"
    echo ""
    echo "💡 Dica: Configure token de acesso pessoal no GitHub"
fi
