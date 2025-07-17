# 🎪 Formulário de Acesso - 3ª Festa Julina da Grande Família

## 🎉 Sobre a Aplicação

Esta é uma aplicação web criada especialmente para a **3ª Festa Julina da Grande Família**! Com um design colorido e festivo, permite que os convidados se cadastrem de forma rápida e segura.

## ✨ Características

### 🎨 Design Temático
- **Cores vibrantes** inspiradas na festa julina
- **Animações divertidas** com bandeirinhas e fogueiras
- **Fonte especial** Fredoka One para títulos
- **Fundo animado** com gradiente colorido
- **Estrelas piscando** no fundo
- **Totalmente responsivo** para mobile e desktop

### 🔒 Segurança
- Rate limiting (máximo 5 tentativas por 15 minutos)
- Validação rigorosa de dados
- Sanitização de entrada
- Logs de auditoria
- Headers de segurança

### 💾 Funcionamento
- **Dados salvos em CSV** para fácil acesso
- **Tela de agradecimento** após envio
- **Validação em tempo real**
- **Máscaras automáticas** para RG

## 🚀 Como Usar

### 1. Acessar a Aplicação
- **Local**: http://localhost:3001
- **Rede**: http://10.0.0.41:3001

### 2. Preenchimento
1. **Nome Completo**: Digite o nome completo do convidado
2. **RG**: Digite o RG (será formatado automaticamente)
3. Clique em **"Enviar"**

### 3. Confirmação
- Aparecerá uma tela de **"Obrigado!"**
- Mostra que as informações foram enviadas com sucesso
- Inclui emojis festivos e mensagem personalizada

## 📁 Arquivo CSV

### Localização
```
/Users/thamirespulheis/forms/data/cadastros.csv
```

### Formato do Arquivo
```csv
ID,Nome,RG,Data/Hora,IP,User Agent
abc123,João Silva,12.345.678-9,17/07/2025 14:30:45,192.168.1.100,Mozilla/5.0...
```

### Campos Salvos
- **ID**: Identificador único gerado automaticamente
- **Nome**: Nome completo do convidado
- **RG**: RG formatado
- **Data/Hora**: Timestamp do cadastro
- **IP**: Endereço IP do usuário
- **User Agent**: Informações do navegador

## 🎯 Funcionalidades Especiais

### 🎪 Animações
- **Fogueiras piscando** no cabeçalho
- **Bandeirinhas balançando** coloridas
- **Título saltitante** com efeito bounce
- **Botão com efeito hover** elevado
- **Gradiente animado** no fundo

### 📱 Responsividade
- **Design adaptativo** para todos os tamanhos de tela
- **Fontes escaláveis** para melhor legibilidade
- **Botões otimizados** para touch
- **Layout flexível** que se ajusta automaticamente

### ✅ Validação
- **Nome mínimo**: 2 caracteres
- **RG válido**: 7 a 12 dígitos
- **Formatação automática**: RG no formato XX.XXX.XXX-X
- **Feedback visual**: Bordas coloridas indicam status

## 🔧 Configuração Técnica

### Dependências
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "express-rate-limit": "^7.1.5",
  "helmet": "^7.1.0",
  "validator": "^13.11.0",
  "dotenv": "^16.3.1",
  "csv-writer": "^1.6.0"
}
```

### Inicialização
```bash
# Instalar dependências
npm install

# Iniciar servidor
npm start
```

### Estrutura de Arquivos
```
forms/
├── public/
│   ├── index.html      # Interface da festa
│   ├── style.css       # Estilos temáticos
│   └── script.js       # Lógica do frontend
├── data/
│   └── cadastros.csv   # Dados salvos
├── server.js           # Servidor principal
├── security.js         # Middlewares de segurança
└── package.json        # Configurações
```

## 🎈 Personalização

### Cores da Festa
- **Laranja**: #ff6b35 (principal)
- **Rosa**: #d63384 (secundária)
- **Amarelo**: #ffd23f (bandeirinhas)
- **Verde**: #28a745 (sucesso)
- **Azul**: #007bff (detalhes)

### Fontes
- **Títulos**: Fredoka One (divertida)
- **Texto**: Quicksand (moderna e legível)

## 🎊 Dicas de Uso

### Para o Evento
1. **Teste antes** do evento
2. **Monitore** o arquivo CSV
3. **Tenha backup** do sistema
4. **Verifique** a conexão de internet

### Para os Convidados
1. **Preencha** todos os campos
2. **Aguarde** a confirmação
3. **Não** reenvie se já enviou
4. **Contate** o organizador se houver problemas

## 🛡️ Segurança

### Medidas Implementadas
- ✅ Rate limiting para prevenir spam
- ✅ Validação de entrada rigorosa
- ✅ Sanitização de dados
- ✅ Headers de segurança
- ✅ Logs de auditoria
- ✅ Proteção contra XSS

### Monitoramento
- **Logs**: Todas as tentativas são registradas
- **IPs**: Endereços são monitorados
- **Timestamps**: Horários são salvos
- **User Agents**: Navegadores são identificados

## 📞 Suporte

### Em caso de problemas:
1. **Verificar** se o servidor está rodando
2. **Testar** no localhost primeiro
3. **Consultar** logs de erro
4. **Reiniciar** a aplicação se necessário

### Comandos úteis:
```bash
# Verificar servidor
lsof -i :3001

# Ver logs
tail -f logs/access.log

# Reiniciar
pkill -f "node server.js" && npm start
```

## 🎉 Conclusão

A aplicação está pronta para receber os convidados da **3ª Festa Julina da Grande Família**! 

Com seu design colorido, animações divertidas e segurança robusta, proporcionará uma experiência agradável para todos os participantes.

**Que a festa seja um sucesso!** 🎪🌽🎵💃🕺

---

*Desenvolvido com ❤️ para a Grande Família*
