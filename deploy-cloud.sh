#!/bin/bash

echo "🎪 Deploy na Cloud - 3ª Festa Julina da Grande Família"
echo "===================================================="

# Verificar se git está inicializado
if [ ! -d ".git" ]; then
    echo "📦 Inicializando Git..."
    git init
    git add .
    git commit -m "Aplicação Festa Julina - Deploy inicial"
    echo "✅ Git inicializado"
else
    echo "✅ Git já está inicializado"
fi

# Verificar se tem remote
if ! git remote get-url origin > /dev/null 2>&1; then
    echo ""
    echo "⚠️  PRÓXIMOS PASSOS:"
    echo "1. Crie um repositório no GitHub"
    echo "2. Execute: git remote add origin https://github.com/SEU_USUARIO/festa-julina.git"
    echo "3. Execute: git push -u origin main"
    echo "4. Acesse: https://render.com"
    echo "5. New > Web Service > Connect GitHub"
    echo "6. Selecione seu repositório"
    echo "7. Configure:"
    echo "   - Name: festa-julina-2025"
    echo "   - Build Command: npm install"
    echo "   - Start Command: npm start"
    echo "8. Deploy!"
    echo ""
    echo "📋 Arquivos preparados para deploy:"
    echo "✅ package.json atualizado"
    echo "✅ render.yaml criado"
    echo "✅ Procfile criado"
    echo "✅ CORS configurado para cloud"
    echo "✅ .env.example criado"
    exit 0
fi

# Se já tem remote, fazer push
echo "📤 Enviando código para GitHub..."
git add .
git commit -m "Deploy $(date '+%Y-%m-%d %H:%M:%S')"
git push origin main

echo ""
echo "✅ Código enviado para GitHub!"
echo ""
echo "🌐 Agora configure no Render:"
echo "1. Acesse: https://render.com"
echo "2. New > Web Service"
echo "3. Connect GitHub repository"
echo "4. Deploy automático será iniciado"
echo ""
echo "⏱️  Deploy leva ~2-3 minutos"
echo "🎉 Sua URL será algo como: https://festa-julina-2025.onrender.com"
