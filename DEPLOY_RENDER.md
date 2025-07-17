# 🚀 Guia de Deploy no Render - Festa Julina

## Passo a Passo para Subir sua Aplicação no Render

### 1. Criar Conta no GitHub (se não tiver)
- Acesse: https://github.com
- Clique em "Sign up"
- Crie sua conta gratuitamente

### 2. Criar Repositório no GitHub
- Faça login no GitHub
- Clique no botão "+" no canto superior direito
- Selecione "New repository"
- Nome: `festa-julina-2025`
- Descrição: `Formulário web para a 3ª Festa Julina da Grande Família`
- Deixe como **Público**
- **NÃO** marque "Add a README file" (já temos um)
- Clique em "Create repository"

### 3. Conectar seu Projeto Local ao GitHub
No seu terminal, execute:
```bash
cd /Users/thamirespulheis/forms
git remote add origin https://github.com/SEU_USUARIO/festa-julina-2025.git
git branch -M main
git push -u origin main
```

**Substitua "SEU_USUARIO" pelo seu nome de usuário do GitHub**

### 4. Deploy no Render
- Acesse: https://render.com
- Clique em "Get Started for Free"
- Faça login com sua conta do GitHub
- Clique em "New +"
- Selecione "Web Service"
- Conecte seu repositório `festa-julina-2025`
- Configure:
  - **Name**: `festa-julina-2025`
  - **Environment**: `Node`
  - **Build Command**: `npm install`
  - **Start Command**: `npm start`
  - **Instance Type**: `Free`
- Clique em "Create Web Service"

### 5. Aguardar o Deploy
- O Render irá automaticamente fazer o build e deploy
- Aguarde alguns minutos (5-10 minutos)
- Quando concluído, você receberá uma URL como:
  `https://festa-julina-2025.onrender.com`

### 6. Testar a Aplicação
- Acesse a URL fornecida pelo Render
- Teste o formulário
- Compartilhe a URL com os convidados

## 🎉 Pronto!
Sua aplicação estará disponível na internet **24/7**, **gratuita** e **sem precisar de senha ou IP** para os visitantes!

## 📱 Compartilhamento
Use este texto para compartilhar:

---
🎉 **3ª Festa Julina da Grande Família** 🎉

Confirme sua presença através do nosso formulário online:
👉 https://festa-julina-2025.onrender.com

Precisamos apenas do seu:
✅ Nome completo
✅ RG

Aguardamos você! 🌽🎊
---

## ⚠️ Observações Importantes
- **Gratuito**: O plano gratuito do Render pode "dormir" após 15 minutos de inatividade
- **Ativação**: Quando alguém acessar, ele "acorda" em 30-60 segundos
- **Dados**: Os dados ficam salvos no CSV local
- **Backup**: Faça backup do arquivo `data/cadastros.csv` regularmente

## 🆘 Suporte
Se precisar de ajuda, você tem:
- Este guia
- Documentação completa em `FESTA_JULINA_GUIDE.md`
- Logs no painel do Render para debug
