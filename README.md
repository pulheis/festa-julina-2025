# 🎉 3ª Festa Julina da Grande Família - Formulário Web

Uma aplicação web temática para coleta de dados dos convidados da 3ª Festa Julina da Grande Família.

## 🌟 Características

- **Design temático animado** com fogueiras, bandeirinhas e animações CSS
- **Formulário simples** com Nome Completo e RG
- **Salvamento em CSV** local para controle de convidados
- **Responsivo** para mobile e desktop
- **Segurança** com rate limiting e validação de dados
- **Tela de agradecimento** animada após envio

## 🚀 Deploy

Esta aplicação está configurada para deploy automático no Render.com:

1. Conecte este repositório ao Render
2. A aplicação será automaticamente construída e implantada
3. Acesse através da URL fornecida pelo Render

## 📱 Uso

1. Acesse a URL da aplicação
2. Preencha o formulário com Nome Completo e RG
3. Clique em "Confirmar Presença"
4. Receba a confirmação animada

## 🛠️ Tecnologias

- **Backend**: Node.js + Express
- **Frontend**: HTML5, CSS3 (animado), JavaScript
- **Segurança**: Helmet, CORS, Rate Limiting
- **Validação**: Validator.js
- **Armazenamento**: CSV local
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

## 📋 Estrutura

```
├── server.js           # Servidor principal
├── security.js         # Middleware de segurança
├── public/             # Arquivos estáticos
│   ├── index.html      # Página principal
│   ├── style_animated.css  # Estilos animados
│   └── script.js       # JavaScript do frontend
├── data/               # Dados salvos
│   └── cadastros.csv   # Arquivo de cadastros
├── docs/               # Documentação
└── render.yaml         # Configuração do Render
```

## 🎭 Tema Julina

O design inclui:
- Fogueiras animadas
- Bandeirinhas coloridas
- Fundo com padrão xadrez
- Animações suaves
- Cores típicas de festa junina

---

**Feito com ❤️ para a 3ª Festa Julina da Grande Família**

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
