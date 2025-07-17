#!/bin/bash

clear
echo "🌐 CONFIGURAÇÃO DE EXPOSIÇÃO PÚBLICA SEGURA"
echo "==========================================="
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}✅ Aplicação criada com sucesso!${NC}"
echo -e "${GREEN}✅ Medidas de segurança implementadas!${NC}"
echo ""

echo "📱 ACESSOS LOCAIS:"
echo "• http://localhost:3001 (principal)"
echo "• http://10.0.0.41:3001 (rede local)"
echo "• http://localhost:3001/dashboard.html (monitoramento)"
echo ""

echo "🌐 OPÇÕES DE EXPOSIÇÃO PÚBLICA:"
echo ""

echo -e "${BLUE}1. NGROK (Recomendado para testes)${NC}"
echo "   • Mais fácil e rápido"
echo "   • HTTPS automático"
echo "   • Ideal para demonstrações"
echo ""
echo "   Como usar:"
echo "   1. Obter token em: https://dashboard.ngrok.com/get-started/your-authtoken"
echo "   2. Executar: ./ngrok config add-authtoken SEU_TOKEN"
echo "   3. Executar: ./start-public.sh"
echo ""

echo -e "${BLUE}2. CLOUDFLARE TUNNEL (Gratuito)${NC}"
echo "   • Completamente gratuito"
echo "   • Muito seguro"
echo "   • Proteção DDoS incluída"
echo ""
echo "   Como usar:"
echo "   1. Instalar: brew install cloudflared"
echo "   2. Executar: cloudflared tunnel --url http://localhost:3001"
echo ""

echo -e "${BLUE}3. PORT FORWARDING (Roteador)${NC}"
echo "   • Sem dependências externas"
echo "   • Velocidade máxima"
echo "   • Requer configuração manual"
echo ""
echo "   Como configurar:"
echo "   1. Acessar: http://192.168.1.1 (painel do roteador)"
echo "   2. Procurar: Port Forwarding"
echo "   3. Criar regra: Porta 3001 → 10.0.0.41:3001"
echo "   4. Acessar: http://$(curl -s http://ipecho.net/plain):3001"
echo ""

echo -e "${BLUE}4. SERVIDOR VPS (Produção)${NC}"
echo "   • Máxima segurança"
echo "   • Domínio próprio"
echo "   • SSL/TLS automático"
echo ""
echo "   Provedores sugeridos:"
echo "   • DigitalOcean (a partir de \$5/mês)"
echo "   • AWS Lightsail (a partir de \$3.50/mês)"
echo "   • Google Cloud (crédito gratuito)"
echo ""

echo -e "${YELLOW}🔒 SEGURANÇA IMPLEMENTADA:${NC}"
echo "• Rate limiting (5 tentativas/15min)"
echo "• Validação e sanitização de dados"
echo "• Headers de segurança (Helmet)"
echo "• Logs de auditoria completos"
echo "• Proteção contra XSS e ataques"
echo "• Validação de origem"
echo ""

echo -e "${YELLOW}📊 MONITORAMENTO:${NC}"
echo "• Dashboard: http://localhost:3001/dashboard.html"
echo "• Logs em tempo real"
echo "• Estatísticas de uso"
echo "• Status do WhatsApp"
echo ""

echo -e "${RED}⚠️  IMPORTANTE:${NC}"
echo "• Sempre monitore os logs"
echo "• Mantenha backups regulares"
echo "• Use HTTPS em produção"
echo "• Configure alertas para tentativas suspeitas"
echo ""

echo "🚀 PRÓXIMOS PASSOS:"
echo "1. Escolher método de exposição"
echo "2. Configurar URL pública"
echo "3. Testar envios"
echo "4. Configurar monitoramento"
echo ""

echo "📚 DOCUMENTAÇÃO:"
echo "• SECURITY_GUIDE.md - Guia completo de segurança"
echo "• EXPOSICAO_PUBLICA.md - Detalhes técnicos"
echo "• README.md - Instruções básicas"
echo ""

echo -e "${GREEN}🎉 Sua aplicação está pronta para uso público seguro!${NC}"
echo ""

read -p "Deseja iniciar a exposição pública agora? (y/n): " answer
if [[ $answer == "y" || $answer == "Y" ]]; then
    echo ""
    echo "Escolha o método:"
    echo "1. ngrok (recomendado)"
    echo "2. Cloudflare Tunnel"
    read -p "Digite sua opção (1-2): " method
    
    case $method in
        1)
            echo "Iniciando ngrok..."
            if [ -f "./ngrok" ]; then
                ./start-public.sh
            else
                echo "ngrok não encontrado. Execute primeiro:"
                echo "curl -Lo ngrok.zip https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-darwin-amd64.zip && unzip ngrok.zip"
            fi
            ;;
        2)
            echo "Iniciando Cloudflare Tunnel..."
            if command -v cloudflared &> /dev/null; then
                cloudflared tunnel --url http://localhost:3001
            else
                echo "Cloudflared não encontrado. Execute primeiro:"
                echo "brew install cloudflared"
            fi
            ;;
        *)
            echo "Opção inválida"
            ;;
    esac
else
    echo "Configuração concluída. Execute ./start-public.sh quando estiver pronto."
fi
