# Formulário WhatsApp

Aplicação web para coleta de dados (Nome e RG) com envio automático para WhatsApp.

## Características

- Interface moderna e responsiva
- Validação de campos em tempo real
- Máscaras para RG e telefone
- Conexão com WhatsApp Web
- QR Code para autenticação
- Envio automático de mensagens formatadas

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Execute a aplicação:
```bash
npm start
```

3. Acesse no navegador:
- Local: http://localhost:3000
- Rede: http://seu-ip:3000

## Primeira Configuração

1. Ao iniciar a aplicação, será exibido um QR Code
2. Abra o WhatsApp no seu celular
3. Vá em Menu (3 pontinhos) > WhatsApp Web
4. Escaneie o QR Code exibido na tela
5. Aguarde a confirmação de conexão

## Como Usar

1. Preencha o Nome completo
2. Digite o RG (será formatado automaticamente)
3. Informe o número do WhatsApp (com DDD)
4. Clique em "Enviar para WhatsApp"

## Tecnologias Utilizadas

- **Backend**: Node.js, Express
- **Frontend**: HTML5, CSS3, JavaScript
- **WhatsApp**: whatsapp-web.js
- **QR Code**: qrcode
- **Estilos**: Font Awesome, Google Fonts

## Acesso Externo

Para acessar a aplicação de outros dispositivos na rede:

1. Descubra seu IP local:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

2. Acesse: http://SEU-IP:3000

## Estrutura do Projeto

```
forms/
├── public/
│   ├── index.html      # Interface principal
│   ├── style.css       # Estilos da aplicação
│   └── script.js       # Lógica do frontend
├── server.js           # Servidor Express
├── package.json        # Dependências
└── README.md          # Este arquivo
```

## Funcionalidades

- ✅ Formulário responsivo
- ✅ Validação de campos
- ✅ Máscaras de entrada
- ✅ Conexão WhatsApp Web
- ✅ QR Code automático
- ✅ Mensagens formatadas
- ✅ Status de conexão
- ✅ Feedback visual

## Segurança

- Validação no frontend e backend
- Sanitização de dados
- Verificação de números válidos
- Tratamento de erros

## Suporte

Em caso de problemas:
1. Verifique se o WhatsApp Web está funcionando
2. Certifique-se de que as portas estão liberadas
3. Verifique a conexão com a internet
4. Reescaneie o QR Code se necessário
