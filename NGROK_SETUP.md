# 🌐 Guia Completo: Acesso Público via ngrok

## 📋 Pré-requisitos

1. **Conta no ngrok**: Acesse https://dashboard.ngrok.com/signup e crie uma conta gratuita
2. **Servidor rodando**: Certifique-se que `npm start` está executando na porta 3001

## 🔧 Configuração Passo a Passo

### 1. Obter o Token de Autenticação

1. Acesse: https://dashboard.ngrok.com/get-started/your-authtoken
2. Copie seu token único
3. Execute no terminal:

```bash
ngrok config add-authtoken SEU_TOKEN_AQUI
```

### 2. Iniciar o Túnel

```bash
ngrok http 3001
```

### 3. Resultado Esperado

```
ngrok                                         (Ctrl+C to quit)
                                                                
Session Status                online                            
Account                       [seu-email]                       
Version                       3.24.0                           
Region                        United States (us)                
Latency                       -                                
Web Interface                 http://127.0.0.1:4040            
Forwarding                    https://1234-abcd-efgh.ngrok.io -> http://localhost:3001
                                                                
Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

### 4. Acessar Publicamente

- **URL Pública**: `https://1234-abcd-efgh.ngrok.io`
- **Interface Web**: `http://127.0.0.1:4040` (monitoramento)

## 🔄 STATUS ATUAL DOS TÚNEIS

### ✅ **LocalTunnel FUNCIONANDO:**
```
https://festa-julina-2025.loca.lt
```

### ❌ **Serveo INDISPONÍVEL:**
```
https://c227250353d85657d26c2aaefa2f7c1d.serveo.net (não funcionando)
```

### 🎯 **Solução Recomendada:**
Use o **LocalTunnel** com as instruções de verificação abaixo.

## 🔐 SOLUÇÃO PARA SENHA DO TÚNEL (LocalTunnel)

### ⚠️ Problema: LocalTunnel pede senha

Quando os visitantes acessam `https://festa-julina-2025.loca.lt`, podem ver:

```
Você está prestes a visitar:
https://festa-julina-2025.loca.lt
Este site é servido gratuitamente através de um túnel local.

Você só deve visitar este site se confiar em quem lhe enviou este link.

Tenha cuidado ao desistir de detalhes pessoais ou financeiros, como senhas, 
cartões de crédito, números de telefone, e-mails, etc. As páginas de phishing 
geralmente se parecem com páginas de bancos conhecidos, redes sociais, portais 
de e-mail ou outras instituições confiáveis, a fim de adquirir informações 
pessoais, como nomes de usuário, senhas ou detalhes de cartão de crédito.

Por favor, proceda com cautela.

Para acessar o site, digite a senha do túnel abaixo.
Se você não sabe o que é, pergunte a quem você recebeu este link.
Senha do Túnel: [campo vazio]
```

### ✅ Solução para Visitantes:

1. **Deixe o campo "Senha do Túnel" VAZIO**
2. **Clique em "Submit"** ou pressione Enter
3. **Se pedir IPv4/IPv6, digite um endereço válido:**
   - IPv4: `192.168.1.1` ou `8.8.8.8`
   - IPv6: `::1` ou `2001:db8::1`
4. **Clique em "Submit" novamente**
5. **Será redirecionado** para o formulário da festa

### 📱 Mensagem para Compartilhar:

```
🎪 3ª Festa Julina da Grande Família
📝 Formulário de Acesso: https://festa-julina-2025.loca.lt
🔥 Cadastre-se agora!

⚠️  IMPORTANTE: Na primeira visita, você verá uma página de aviso de segurança.
    1. Deixe o campo "Senha do Túnel" em BRANCO e clique "Submit"
    2. Se pedir IPv4/IPv6, digite: 192.168.1.1 e clique "Submit"
    Isso é normal e seguro - é apenas uma proteção do serviço gratuito.
```

### 🛠️ Script de Verificação:

```bash
# Execute para verificar status
./check-public.sh
```

## 🔒 Configurações de Segurança

### Atualizar CORS no servidor:

```javascript
// Em server.js
app.use(cors({
    origin: [
        'http://localhost:3001',
        'https://1234-abcd-efgh.ngrok.io', // Substitua pela sua URL
        process.env.ALLOWED_ORIGIN
    ].filter(Boolean),
    credentials: true
}));
```

### Configurar variável de ambiente:

```bash
# .env
ALLOWED_ORIGIN=https://1234-abcd-efgh.ngrok.io
```

## 🚀 Scripts Automatizados

### Script para iniciar tudo:

```bash
#!/bin/bash
# start-public.sh

echo "🔥 Iniciando 3ª Festa Julina da Grande Família - Acesso Público"
echo "================================================="

# Iniciar servidor
echo "📡 Iniciando servidor Node.js..."
npm start &
SERVER_PID=$!

# Aguardar servidor iniciar
sleep 3

# Iniciar ngrok
echo "🌐 Iniciando túnel ngrok..."
ngrok http 3001 &
NGROK_PID=$!

echo "✅ Aplicação iniciada!"
echo "📍 Local: http://localhost:3001"
echo "🌍 Público: Verifique a URL no ngrok (pressione Ctrl+C para parar)"

# Função para cleanup
cleanup() {
    echo "🛑 Parando aplicação..."
    kill $SERVER_PID 2>/dev/null
    kill $NGROK_PID 2>/dev/null
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT

# Aguardar
wait
```

### Tornar executável:

```bash
chmod +x start-public.sh
./start-public.sh
```

## 🔧 Alternativas ao ngrok

### 1. localtunnel (mais simples) ✅ RECOMENDADO

```bash
# Instalar
npm install -g localtunnel

# Usar com subdomain personalizado
lt --port 3001 --subdomain festa-julina-2025
```

#### 🔐 Sobre a Senha do Túnel:
O localtunnel pode solicitar uma senha de túnel por segurança. Quando isso acontecer:

1. **Primeira visita**: Visitantes verão uma página pedindo senha
2. **Senha padrão**: Geralmente é vazia (apenas clique "Submit")
3. **Senha personalizada**: Você pode definir uma senha específica

#### 🌐 URL Atual Funcionando:
```
https://festa-julina-2025.loca.lt
```

#### 💡 Dicas para Visitantes:
- Se pedir senha, deixe em branco e clique "Submit"
- Ou use a senha: `festa2025` (se configurada)
- Após a primeira visita, não pedirá senha novamente

#### 🔄 Configurar Senha Personalizada:
```bash
# Com senha específica (opcional)
lt --port 3001 --subdomain festa-julina-2025 --password festa2025
```

### 2. serveo (sem instalação - SEM SENHA)

```bash
ssh -R 80:localhost:3001 serveo.net
```

## 📊 Monitoramento

### Verificar Status:
```bash
# Verificar se servidor está rodando
curl -I http://localhost:3001

# Verificar logs
tail -f server.log
```

### Interface Web ngrok:
- Acesse: http://127.0.0.1:4040
- Veja requisições em tempo real
- Monitore performance

## 🎯 Dicas Importantes

1. **URL Temporária**: A URL do ngrok muda a cada reinicialização (plano gratuito)
2. **Limites**: Plano gratuito tem limite de conexões simultâneas
3. **Segurança**: Sempre monitore o acesso público
4. **Backup**: Mantenha backup dos dados CSV

## 🛠️ Troubleshooting

### Problema: "authentication failed"
```bash
# Verificar token
ngrok config check
# Reinstalar token
ngrok config add-authtoken SEU_TOKEN
```

### Problema: "port already in use"
```bash
# Verificar processo na porta
lsof -i :3001
# Parar processo
kill -9 PID_DO_PROCESSO
```

### Problema: CORS errors
```bash
# Adicionar origem no server.js
# Reiniciar servidor
```

## 📱 Compartilhamento

### QR Code para acesso móvel:
```bash
# Gerar QR Code da URL
qrencode -t UTF8 "https://sua-url.ngrok.io"
```

### Enviar por WhatsApp/Email:
```
🎪 3ª Festa Julina da Grande Família
📝 Formulário de Acesso: https://sua-url.ngrok.io
🔥 Cadastre-se agora!
```

---

## 🎉 Pronto para a Festa!

Sua aplicação agora está acessível publicamente na internet! Qualquer pessoa pode acessar o formulário e se cadastrar para a festa julina.

**Lembre-se**: Monitore o acesso e mantenha o servidor rodando durante o período de cadastros.
