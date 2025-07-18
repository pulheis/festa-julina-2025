#!/bin/bash

echo "🧪 Testando endpoints da aplicação em produção..."
echo

# Teste 1: Verificar se o servidor está ativo
echo "1️⃣ Testando se o servidor está ativo..."
response=$(curl -s -o /dev/null -w "%{http_code}" https://festa-julina-2025.onrender.com)
if [ "$response" -eq 200 ]; then
    echo "✅ Servidor ativo (HTTP $response)"
else
    echo "❌ Servidor com problema (HTTP $response)"
fi

echo

# Teste 2: Verificar autenticação do admin
echo "2️⃣ Testando autenticação do admin..."
response=$(curl -s -o /dev/null -w "%{http_code}" https://festa-julina-2025.onrender.com/admin.html)
if [ "$response" -eq 401 ]; then
    echo "✅ Autenticação funcionando (HTTP $response)"
else
    echo "❌ Autenticação com problema (HTTP $response)"
fi

echo

# Teste 3: Verificar acesso com credenciais
echo "3️⃣ Testando acesso com credenciais..."
response=$(curl -s -o /dev/null -w "%{http_code}" -u "admin:Felicidade2020!" https://festa-julina-2025.onrender.com/admin.html)
if [ "$response" -eq 200 ]; then
    echo "✅ Acesso com credenciais funcionando (HTTP $response)"
else
    echo "❌ Acesso com credenciais com problema (HTTP $response)"
fi

echo

# Teste 4: Verificar endpoint de dados
echo "4️⃣ Testando endpoint de dados..."
data=$(curl -s -u "admin:Felicidade2020!" https://festa-julina-2025.onrender.com/dados)
total=$(echo "$data" | jq -r '.total' 2>/dev/null)
if [ "$total" != "null" ] && [ "$total" != "" ]; then
    echo "✅ Endpoint de dados funcionando (Total: $total)"
else
    echo "❌ Endpoint de dados com problema"
    echo "Resposta: $data"
fi

echo

# Teste 5: Verificar endpoint de download
echo "5️⃣ Testando endpoint de download..."
response=$(curl -s -o /dev/null -w "%{http_code}" -u "admin:Felicidade2020!" https://festa-julina-2025.onrender.com/download)
if [ "$response" -eq 200 ]; then
    echo "✅ Endpoint de download funcionando (HTTP $response)"
else
    echo "❌ Endpoint de download com problema (HTTP $response)"
fi

echo
echo "🎉 Testes concluídos!"
