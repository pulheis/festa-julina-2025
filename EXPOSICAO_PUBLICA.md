# 🌐 Configuração para Exposição Pública Segura

## Opções Disponíveis

### 1. 🚀 ngrok (RECOMENDADO para início)
```bash
# Executar automaticamente
./start-public.sh

# Ou manualmente
./ngrok http 3001
```

### 2. ☁️ Cloudflare Tunnel
```bash
# Instalar cloudflared primeiro
brew install cloudflared

# Iniciar túnel
cloudflared tunnel --url http://localhost:3001
```

### 3. 🏠 Port Forwarding no Roteador
1. Acesse: http://192.168.1.1 (ou IP do seu roteador)
2. Configure Port Forwarding:
   - Porta Externa: 3001
   - IP Interno: 10.0.0.41
   - Porta Interna: 3001
3. Seu IP público: $(curl -s http://ipecho.net/plain)

## 🔒 Medidas de Segurança Implementadas

✅ **Rate Limiting**
- 5 tentativas máximas por 15 minutos
- Bloqueio automático de IPs abusivos

✅ **Validação de Entrada**
- Sanitização de dados
- Validação de tipos e tamanhos
- Prevenção de XSS e SQL Injection

✅ **Headers de Segurança**
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Proteção contra clickjacking

✅ **Logs de Auditoria**
- Registro de todas as tentativas
- Monitoramento de IPs
- Timestamp completo

✅ **Validação de Origem**
- Verificação de domínios permitidos
- Bloqueio de requisições suspeitas

## 📊 Monitoramento

### Verificar Status
```bash
# Verificar se está rodando
lsof -i :3001

# Ver logs em tempo real
tail -f logs/access.log
```

### Estatísticas de Uso
```bash
# Contar acessos por IP
grep "POST /enviar" logs/access.log | cut -d' ' -f1 | sort | uniq -c | sort -nr

# Tentativas bloqueadas
grep "rate limit" logs/access.log | wc -l
```

## 🆘 Solução de Problemas

### Aplicação não carrega
1. Verificar se servidor está rodando: `lsof -i :3001`
2. Testar local: `curl http://localhost:3001`
3. Verificar logs: `tail logs/error.log`

### WhatsApp não conecta
1. Verificar QR Code na aplicação
2. Limpar cache do navegador
3. Reiniciar aplicação

### Muitas tentativas bloqueadas
1. Verificar IP: `grep "sua-ip" logs/access.log`
2. Ajustar rate limit se necessário
3. Reiniciar aplicação

## 🔧 Configuração Avançada

### SSL/TLS (Para produção)
```bash
# Com Let's Encrypt
certbot certonly --standalone -d seu-dominio.com

# Atualizar server.js para usar HTTPS
```

### Proxy Reverso (Nginx)
```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Firewall (macOS)
```bash
# Ativar firewall
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on

# Permitir aplicação
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node
```

## 📞 URLs de Acesso

### Local
- http://localhost:3001
- http://10.0.0.41:3001

### Público (após configuração)
- ngrok: https://random-id.ngrok.io
- Cloudflare: https://random-id.trycloudflare.com
- IP Público: http://seu-ip-publico:3001

## ⚠️ IMPORTANTE

1. **Sempre monitore os logs**
2. **Mantenha backups regulares**
3. **Atualize dependências regularmente**
4. **Use HTTPS em produção**
5. **Configure alertas para tentativas suspeitas**

## 🎯 Próximos Passos

1. Escolher método de exposição
2. Configurar domínio próprio (opcional)
3. Implementar SSL/TLS
4. Configurar monitoramento
5. Implementar backups automáticos
