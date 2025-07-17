#!/bin/bash

echo "🚀 Configuração de Exposição Segura para Internet"
echo "================================================"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir com cores
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[i]${NC} $1"
}

echo ""
echo "Escolha uma opção de exposição:"
echo "1. ngrok (Fácil e rápido)"
echo "2. Cloudflare Tunnel (Gratuito e seguro)"
echo "3. Configurar roteador (Manual)"
echo "4. Servidor VPS (Avançado)"
echo ""

read -p "Digite sua escolha (1-4): " choice

case $choice in
    1)
        echo ""
        print_info "Configurando ngrok..."
        
        # Verificar se ngrok existe
        if [ ! -f "./ngrok" ]; then
            print_error "ngrok não encontrado. Execute o script de instalação primeiro."
            exit 1
        fi
        
        # Configurar ngrok
        read -p "Digite seu token do ngrok (obtenha em https://dashboard.ngrok.com/get-started/your-authtoken): " token
        
        if [ ! -z "$token" ]; then
            ./ngrok config add-authtoken $token
            print_status "Token do ngrok configurado!"
        fi
        
        # Iniciar túnel ngrok
        print_info "Iniciando túnel ngrok na porta 3001..."
        ./ngrok http 3001 &
        NGROK_PID=$!
        
        sleep 5
        
        # Obter URL público
        curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url' > ngrok_url.txt
        
        if [ -f "ngrok_url.txt" ]; then
            URL=$(cat ngrok_url.txt)
            print_status "Aplicação disponível em: $URL"
            print_warning "Mantenha este terminal aberto para manter o túnel ativo"
        fi
        ;;
        
    2)
        echo ""
        print_info "Configurando Cloudflare Tunnel..."
        
        # Verificar se cloudflared existe
        if ! command -v cloudflared &> /dev/null; then
            print_info "Instalando cloudflared..."
            
            # Detectar sistema operacional
            if [[ "$OSTYPE" == "darwin"* ]]; then
                # macOS
                if command -v brew &> /dev/null; then
                    brew install cloudflared
                else
                    print_error "Homebrew não encontrado. Instale manualmente: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/"
                    exit 1
                fi
            else
                # Linux
                wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
                sudo dpkg -i cloudflared-linux-amd64.deb
            fi
        fi
        
        print_status "Cloudflared instalado!"
        print_info "Executando túnel temporário..."
        
        # Criar túnel temporário
        cloudflared tunnel --url http://localhost:3001 &
        CLOUDFLARE_PID=$!
        
        print_warning "Mantenha este terminal aberto para manter o túnel ativo"
        print_info "Para configuração permanente, siga: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/"
        ;;
        
    3)
        echo ""
        print_info "Configuração manual do roteador:"
        echo ""
        echo "1. Acesse o painel do seu roteador (geralmente 192.168.1.1 ou 192.168.0.1)"
        echo "2. Procure por 'Port Forwarding' ou 'Redirecionamento de Porta'"
        echo "3. Crie uma regra:"
        echo "   - Porta Externa: 3001"
        echo "   - Porta Interna: 3001"
        echo "   - IP Interno: $(ipconfig getifaddr en0 2>/dev/null || hostname -I | cut -d' ' -f1)"
        echo "   - Protocolo: TCP"
        echo ""
        echo "4. Seu IP público: $(curl -s http://ipecho.net/plain)"
        echo "5. Acesse: http://$(curl -s http://ipecho.net/plain):3001"
        echo ""
        print_warning "IMPORTANTE: Isso expõe sua aplicação diretamente na internet!"
        print_warning "Certifique-se de que todas as medidas de segurança estão ativas."
        ;;
        
    4)
        echo ""
        print_info "Configuração VPS (Servidor Virtual Privado):"
        echo ""
        echo "1. Contrate um VPS (DigitalOcean, AWS, Google Cloud, etc.)"
        echo "2. Instale Node.js no servidor"
        echo "3. Faça upload dos arquivos da aplicação"
        echo "4. Configure SSL/TLS com Let's Encrypt"
        echo "5. Configure firewall (apenas portas 80, 443, 22)"
        echo "6. Configure proxy reverso (Nginx/Apache)"
        echo ""
        print_info "Exemplo de configuração Nginx:"
        echo "server {"
        echo "    listen 80;"
        echo "    server_name seu-dominio.com;"
        echo "    location / {"
        echo "        proxy_pass http://localhost:3001;"
        echo "        proxy_set_header Host \$host;"
        echo "        proxy_set_header X-Real-IP \$remote_addr;"
        echo "    }"
        echo "}"
        ;;
        
    *)
        print_error "Opção inválida!"
        exit 1
        ;;
esac

echo ""
print_info "Medidas de segurança implementadas:"
echo "• Rate limiting (máximo 5 tentativas por 15 minutos)"
echo "• Validação e sanitização de entrada"
echo "• Headers de segurança (Helmet)"
echo "• Logs de segurança"
echo "• Validação de origem"
echo "• Proteção contra ataques XSS"
echo ""
print_warning "Sempre monitore os logs para atividades suspeitas!"
