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

// Função para download direto da lista
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
    
    btn.innerHTML = '⏳ Baixando...';
    btn.disabled = true;
    
    // Fazer download direto via endpoint do servidor
    try {
        // Criar um link temporário para download
        const link = document.createElement('a');
        link.href = '/download';
        link.download = `confirmacoes_festa_julina_${new Date().toISOString().split('T')[0]}.csv`;
        
        // Adicionar ao DOM temporariamente
        document.body.appendChild(link);
        
        // Simular clique para iniciar download
        link.click();
        
        // Remover do DOM
        document.body.removeChild(link);
        
        console.log('Download iniciado com sucesso!'); // Debug
        
    } catch (error) {
        console.error('Erro ao iniciar download:', error);
        // Fallback para download CSV local
        downloadCSVDireto();
    }
    
    // Restaurar botão
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 1000);
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
