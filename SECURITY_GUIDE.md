# 🔒 Guia de Exposição Segura para Internet

## Opções de Exposição Pública

### 1. 🚀 **ngrok (Recomendado para Testes)**

**Vantagens:**
- Fácil e rápido
- HTTPS automático
- Sem configuração de firewall
- Ideal para demonstrações

**Desvantagens:**
- URL muda a cada reinicialização (versão gratuita)
- Limitado em banda
- Dependente de serviço externo

**Como usar:**
```bash
# 1. Obter token em https://dashboard.ngrok.com
# 2. Configurar token
./ngrok config add-authtoken SEU_TOKEN

# 3. Iniciar túnel
./ngrok http 3001
```

**Segurança:**
- Aplicação roda no seu PC
- Túnel criptografado
- Possível adicionar autenticação

---

### 2. ☁️ **Cloudflare Tunnel (Gratuito e Seguro)**

**Vantagens:**
- Gratuito
- Muito seguro
- Proteção DDoS
- URL permanente possível

**Desvantagens:**
- Configuração mais complexa
- Dependente da Cloudflare

**Como usar:**
```bash
# Instalar cloudflared
brew install cloudflared

# Túnel temporário
cloudflared tunnel --url http://localhost:3001

# Configuração permanente
cloudflared tunnel login
cloudflared tunnel create meu-formulario
```

---

### 3. 🌐 **Roteador (Port Forwarding)**

**Vantagens:**
- Controle total
- Sem dependências externas
- Velocidade máxima

**Desvantagens:**
- Expõe seu IP público
- Requer configuração do roteador
- Sem HTTPS automático

**Como configurar:**
1. Acesse o painel do roteador (192.168.1.1)
2. Procure "Port Forwarding"
3. Crie regra: Porta 3001 → Seu IP local
4. Acesse: http://SEU_IP_PUBLICO:3001

**⚠️ IMPORTANTE:** Configure SSL/TLS!

---

### 4. 🏢 **VPS (Servidor Virtual)**

**Vantagens:**
- Máxima segurança
- Domínio próprio
- Controle total
- Escalável

**Desvantagens:**
- Custo mensal
- Configuração complexa
- Manutenção necessária

**Provedores recomendados:**
- DigitalOcean
- AWS Lightsail
- Google Cloud
- Vultr

---

## 🛡️ Medidas de Segurança Implementadas

### Rate Limiting
- Máximo 5 tentativas por 15 minutos
- Proteção contra spam/abuse
- Bloqueio automático de IPs suspeitos

### Validação de Entrada
- Sanitização de dados
- Validação de tipos
- Prevenção de XSS
- Limite de caracteres

### Headers de Segurança
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security (HTTPS)

### Logs de Segurança
- Registro de todas as tentativas
- Monitoramento de IPs
- Detecção de padrões suspeitos

### Autenticação (Opcional)
- Acesso protegido por usuário/senha
- Token de sessão
- Expiração automática

---

## 📊 Monitoramento e Logs

### Visualizar Logs
```bash
# Logs em tempo real
tail -f logs/security.log

# Filtrar por IP
grep "192.168.1.100" logs/security.log

# Contar tentativas por IP
grep "POST /enviar" logs/security.log | cut -d' ' -f5 | sort | uniq -c | sort -nr
```

### Alertas Automáticos
```bash
# Configurar alerta por email
# (Requer configuração adicional)
```

---

## 🔧 Configuração Avançada

### SSL/TLS com Let's Encrypt
```bash
# Instalar certbot
sudo apt install certbot

# Obter certificado
sudo certbot certonly --standalone -d seu-dominio.com

# Configurar renovação automática
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Proxy Reverso com Nginx
```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Firewall (UFW)
```bash
# Configurar firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 🚨 Checklist de Segurança

- [ ] Rate limiting configurado
- [ ] Validação de entrada ativa
- [ ] Headers de segurança aplicados
- [ ] Logs sendo registrados
- [ ] Backup configurado
- [ ] Monitoramento ativo
- [ ] SSL/TLS configurado
- [ ] Firewall configurado
- [ ] Senhas fortes
- [ ] Atualizações regulares

---

## 🆘 Solução de Problemas

### Aplicação não carrega
1. Verificar se o servidor está rodando
2. Testar localhost:3001
3. Verificar logs de erro
4. Confirmar porta disponível

### WhatsApp não conecta
1. Verificar QR Code válido
2. Testar conexão de internet
3. Limpar cache do navegador
4. Reiniciar aplicação

### Muitas tentativas bloqueadas
1. Verificar logs de rate limiting
2. Ajustar limites se necessário
3. Adicionar IP à whitelist
4. Reiniciar aplicação

---

## 📞 Suporte

Para problemas ou dúvidas:
1. Verificar logs em `/logs/`
2. Consultar documentação
3. Verificar status do sistema
4. Contactar administrador

---

**⚠️ LEMBRE-SE:** Sempre mantenha backups e monitore a aplicação regularmente!
