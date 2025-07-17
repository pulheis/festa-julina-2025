// Arquivo: admin-script.js
// Script para o painel administrativo da Festa Julina

// Dados globais
let dadosAtuais = [];

// Função para carregar dados
async function carregarDados() {
    try {
        const response = await fetch('/dados');
        
        if (response.status === 401) {
            console.log('Erro 401 - Não autorizado');
            // Parar o intervalo de atualização automática
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            document.getElementById('dadosContainer').innerHTML = `
                <div class="no-data">
                    🔒 Acesso negado<br>
                    <small>Você precisa fazer login para acessar os dados</small>
                </div>
            `;
            return;
        }
        
        const data = await response.json();
        dadosAtuais = data.dados || [];
        
        // Atualizar estatísticas
        document.getElementById('totalConfirmacoes').textContent = data.total;
        document.getElementById('totalSubmissoes').textContent = data.stats.totalSubmissions;
        document.getElementById('ultimaConfirmacao').textContent = 
            data.stats.lastSubmission || 'Nenhuma';
        
        // Atualizar tabela
        atualizarTabela(dadosAtuais);
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        document.getElementById('dadosContainer').innerHTML = `
            <div class="no-data">
                ❌ Erro ao carregar dados<br>
                <small>${error.message}</small>
            </div>
        `;
    }
}

// Função para atualizar tabela
function atualizarTabela(dados) {
    const container = document.getElementById('dadosContainer');
    
    if (dados.length === 0) {
        container.innerHTML = `
            <div class="no-data">
                📝 Nenhuma confirmação ainda<br>
                <small>As confirmações aparecerão aqui conforme forem chegando</small>
            </div>
        `;
        return;
    }

    let html = `
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>RG</th>
                        <th>Data/Hora</th>
                        <th>IP</th>
                    </tr>
                </thead>
                <tbody>
    `;

    dados.forEach(item => {
        html += `
            <tr>
                <td>${item.nome || ''}</td>
                <td>${item.rg || ''}</td>
                <td>${item.dataHora || ''}</td>
                <td>${item.ip || ''}</td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = html;
}

// Função unificada para download que funciona em ambiente externo
function downloadDados() {
    const btn = document.getElementById('downloadBtn');
    const originalText = btn.innerHTML;
    
    console.log('Download iniciado...'); // Debug
    console.log('Dados atuais:', dadosAtuais); // Debug
    
    // Verificar se há dados
    if (!dadosAtuais || dadosAtuais.length === 0) {
        alert('Nenhum dado disponível. Clique em "Atualizar Dados" primeiro.');
        return;
    }
    
    btn.innerHTML = '⏳ Gerando arquivo...';
    btn.disabled = true;
    
    // Tentar gerar PDF primeiro, se falhar usar CSV
    try {
        if (gerarPDFLocal()) {
            console.log('PDF gerado com sucesso via popup!'); // Debug
            alert('Janela de impressão aberta! Use Ctrl+P ou Cmd+P para imprimir/salvar como PDF.');
        } else {
            console.log('Popup falhou, usando download CSV...'); // Debug
            downloadCSVDireto();
        }
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        alert('Erro ao gerar PDF. Baixando como CSV...');
        downloadCSVDireto();
    }
    
    // Restaurar botão
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 2000);
}

// Função para download CSV direto (fallback)
function downloadCSVDireto() {
    console.log('Gerando CSV direto...'); // Debug
    
    // Criar conteúdo CSV
    const csvHeaders = 'Nome Completo,RG,Data/Hora da Confirmação\n';
    const csvData = dadosAtuais.map(item => 
        `"${item.nome || ''}","${item.rg || ''}","${item.dataHora || ''}"`
    ).join('\n');
    
    const csvContent = csvHeaders + csvData;
    
    // Criar blob e download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `confirmacoes_festa_julina_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('CSV baixado com sucesso!'); // Debug
        alert('Lista baixada em formato CSV. Abra no Excel para visualizar.');
    } else {
        alert('Seu navegador não suporta download automático. Tente outro navegador.');
    }
}

// Função para gerar PDF local usando window.print()
function gerarPDFLocal() {
    console.log('Gerando PDF local...'); // Debug
    
    try {
        // Criar conteúdo HTML para impressão
        const dataAtual = new Date().toLocaleString('pt-BR');
        
        console.log('Dados para PDF:', dadosAtuais.length, 'registros'); // Debug
        
        // Criar nova janela para impressão que será salva como PDF
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        
        if (!printWindow) {
            console.log('Popup bloqueado!'); // Debug
            alert('Popup bloqueado! Habilitando download CSV como alternativa...');
            return false;
        }
        
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Lista de Confirmações - Festa Julina</title>
                <style>
                    @page {
                        size: A4;
                        margin: 20mm;
                    }
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 0; 
                        padding: 0;
                        color: #333;
                        line-height: 1.4;
                    }
                    .header { 
                        text-align: center; 
                        margin-bottom: 30px; 
                        border-bottom: 2px solid #ff6b6b;
                        padding-bottom: 20px;
                    }
                    .header h1 { 
                        color: #ff6b6b; 
                        font-size: 24px;
                        margin: 0;
                    }
                    .header h2 { 
                        color: #666; 
                        font-size: 16px;
                        margin: 5px 0;
                    }
                    .info { 
                        background: #f8f9fa;
                        padding: 15px;
                        border-radius: 5px;
                        margin-bottom: 20px;
                        font-size: 14px;
                    }
                    .info strong {
                        color: #ff6b6b;
                    }
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin-top: 20px; 
                    }
                    th, td { 
                        border: 1px solid #ddd; 
                        padding: 10px; 
                        text-align: left; 
                        font-size: 12px;
                    }
                    th { 
                        background-color: #ff6b6b; 
                        color: white; 
                        font-weight: bold;
                    }
                    tr:nth-child(even) { 
                        background-color: #f9f9f9; 
                    }
                    .footer { 
                        margin-top: 30px; 
                        text-align: center; 
                        font-size: 10px; 
                        color: #666; 
                        border-top: 1px solid #ddd;
                        padding-top: 15px;
                    }
                    .no-print { 
                        text-align: center; 
                        margin: 20px 0; 
                    }
                    .no-print button {
                        background: #ff6b6b;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        margin: 0 10px;
                        font-size: 14px;
                    }
                    .no-print button:hover {
                        background: #ff5252;
                    }
                    @media print {
                        .no-print { display: none; }
                        body { font-size: 12px; }
                        table { font-size: 10px; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🎉 3ª Festa Julina da Grande Família</h1>
                    <h2>Lista de Confirmações de Presença</h2>
                </div>
                
                <div class="info">
                    <p><strong>Data de geração:</strong> ${dataAtual}</p>
                    <p><strong>Total de confirmações:</strong> ${dadosAtuais.length}</p>
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th>Nome Completo</th>
                            <th>RG</th>
                            <th>Data/Hora da Confirmação</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${dadosAtuais.map(item => `
                            <tr>
                                <td>${item.nome || ''}</td>
                                <td>${item.rg || ''}</td>
                                <td>${item.dataHora || ''}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="footer">
                    <p>3ª Festa Julina da Grande Família - Lista gerada automaticamente</p>
                    <p>Documento gerado em: ${dataAtual}</p>
                </div>
                
                <div class="no-print">
                    <button onclick="window.print()">🖨️ Imprimir / Salvar PDF</button>
                    <button onclick="window.close()">❌ Fechar</button>
                </div>
            </body>
            </html>
        `;
        
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Focar na nova janela
        printWindow.focus();
        
        console.log('Janela de impressão criada com sucesso!'); // Debug
        return true;
        
    } catch (error) {
        console.error('Erro ao criar janela de impressão:', error);
        return false;
    }
}

// Função para inicializar event listeners
function inicializarEventListeners() {
    const atualizarBtn = document.getElementById('atualizarBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    
    if (atualizarBtn && !atualizarBtn.dataset.listenerAdded) {
        atualizarBtn.addEventListener('click', carregarDados);
        atualizarBtn.dataset.listenerAdded = 'true';
    }
    
    if (downloadBtn && !downloadBtn.dataset.listenerAdded) {
        downloadBtn.addEventListener('click', downloadDados);
        downloadBtn.dataset.listenerAdded = 'true';
    }
}

// Variável para controlar o intervalo
let intervalId = null;

// Inicializar aplicação
function inicializarApp() {
    inicializarEventListeners();
    carregarDados();
    
    // Limpar intervalo anterior se existir
    if (intervalId) {
        clearInterval(intervalId);
    }
    
    // Atualizar automaticamente a cada 30 segundos
    intervalId = setInterval(carregarDados, 30000);
}

// Executar inicialização quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarApp);
} else {
    inicializarApp();
}
