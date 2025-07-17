const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
require('dotenv').config();

// Importar middlewares de segurança
const {
    createRateLimiter,
    generalRateLimiter,
    validateInput,
    basicAuth,
    securityLogger,
    helmetConfig,
    checkOrigin
} = require('./security');

const app = express();
const PORT = process.env.PORT || 3001;

// Credenciais do admin
const ADMIN_USER = 'Admin';
const ADMIN_PASSWORD = 'Felicidade2020!';

// Middleware de autenticação admin
const adminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Admin Panel"');
        return res.status(401).json({ error: 'Acesso negado' });
    }
    
    const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const username = credentials[0];
    const password = credentials[1];
    
    // Verificação case-insensitive para o usuário
    if (username.toLowerCase() === ADMIN_USER.toLowerCase() && password === ADMIN_PASSWORD) {
        next();
    } else {
        res.setHeader('WWW-Authenticate', 'Basic realm="Admin Panel"');
        return res.status(401).json({ error: 'Credenciais inválidas' });
    }
};

// Configurar diretório de dados
const DATA_DIR = path.join(__dirname, 'data');
const CSV_FILE = path.join(DATA_DIR, 'cadastros.csv');

// Criar diretório de dados se não existir
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Configurar CSV Writer
const csvWriter = createCsvWriter({
    path: CSV_FILE,
    header: [
        { id: 'id', title: 'ID' },
        { id: 'nome', title: 'Nome' },
        { id: 'rg', title: 'RG' },
        { id: 'dataHora', title: 'Data/Hora' },
        { id: 'ip', title: 'IP' },
        { id: 'userAgent', title: 'User Agent' }
    ],
    append: true
});

// Inicializar arquivo CSV com cabeçalhos se não existir
if (!fs.existsSync(CSV_FILE)) {
    csvWriter.writeRecords([]).then(() => {
        console.log('Arquivo CSV criado com sucesso!');
    });
}

// Configurar proxy reverso (importante para rate limiting)
app.set('trust proxy', 1);

// Middlewares de segurança
app.use(helmetConfig);
app.use(generalRateLimiter);
app.use(securityLogger);

// Middleware básico
app.use(cors({
    origin: [
        'http://localhost:3001',
        'http://10.0.0.41:3001',
        process.env.ALLOWED_ORIGIN,
        // Domínios da cloud
        /\.onrender\.com$/,
        /\.railway\.app$/,
        /\.vercel\.app$/,
        /\.herokuapp\.com$/
    ].filter(Boolean),
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Variáveis globais para estatísticas e dados
let stats = {
    totalSubmissions: 0,
    successfulSubmissions: 0,
    failedSubmissions: 0,
    lastSubmission: null
};

// Array para manter dados em memória (backup para sistemas efêmeros)
let dadosMemoria = [];

// Função para carregar dados existentes
function carregarDados() {
    try {
        if (fs.existsSync(CSV_FILE)) {
            const csvData = fs.readFileSync(CSV_FILE, 'utf8');
            const linhas = csvData.split('\n').filter(linha => linha.trim());
            
            dadosMemoria = linhas.map(linha => {
                const [id, nome, rg, dataHora, ip, userAgent] = linha.split(',');
                return {
                    id: id?.replace(/"/g, ''),
                    nome: nome?.replace(/"/g, ''),
                    rg: rg?.replace(/"/g, ''),
                    dataHora: dataHora?.replace(/"/g, ''),
                    ip: ip?.replace(/"/g, ''),
                    userAgent: userAgent?.replace(/"/g, '')
                };
            });
            
            console.log(`${dadosMemoria.length} registros carregados do arquivo CSV`);
        }
    } catch (error) {
        console.log('Erro ao carregar dados existentes:', error.message);
    }
}

// Carregar dados na inicialização
carregarDados();

// Rotas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/status', (req, res) => {
    res.json({ 
        ready: true, 
        csvFile: fs.existsSync(CSV_FILE),
        totalRecords: stats.totalSubmissions 
    });
});

app.get('/stats', (req, res) => {
    res.json(stats);
});

// Endpoint para download (protegido)
app.get('/download', adminAuth, (req, res) => {
    try {
        // Gerar CSV a partir dos dados em memória
        const csvHeaders = 'ID,Nome,RG,Data/Hora,IP,User-Agent\n';
        const csvData = dadosMemoria.map(item => 
            `"${item.id}","${item.nome}","${item.rg}","${item.dataHora}","${item.ip}","${item.userAgent}"`
        ).join('\n');
        
        const csvContent = csvHeaders + csvData;
        
        // Headers otimizados para download em diferentes navegadores
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', 'attachment; filename="cadastros_festa_julina.csv"');
        res.setHeader('Content-Length', Buffer.byteLength(csvContent, 'utf8'));
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        
        // Enviar o conteúdo
        res.status(200).send(csvContent);
        
        console.log(`Download realizado: ${dadosMemoria.length} registros`);
    } catch (error) {
        console.error('Erro ao gerar download:', error);
        res.status(500).send('Erro ao gerar download');
    }
});

// Endpoint para visualizar dados (protegido)
app.get('/dados', adminAuth, (req, res) => {
    res.json({
        total: dadosMemoria.length,
        dados: dadosMemoria,
        stats: stats
    });
});

// Endpoint para servir página admin (protegido)
app.get('/admin.html', adminAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.post('/enviar', createRateLimiter, validateInput, async (req, res) => {
    const { nome, rg } = req.body;

    try {
        // Gerar ID único
        const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
        
        // Obter informações da requisição
        const ip = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('User-Agent') || 'Unknown';
        const dataHora = new Date().toLocaleString('pt-BR');

        // Dados para salvar
        const registro = {
            id,
            nome,
            rg,
            dataHora,
            ip,
            userAgent
        };

        // Salvar em memória primeiro
        dadosMemoria.push(registro);

        // Tentar salvar no arquivo CSV
        try {
            await csvWriter.writeRecords([registro]);
            console.log(`Dados salvos no arquivo CSV: ${CSV_FILE}`);
        } catch (fileError) {
            console.warn('Aviso: Não foi possível salvar no arquivo CSV (sistema efêmero):', fileError.message);
        }

        // Atualizar estatísticas
        stats.totalSubmissions++;
        stats.successfulSubmissions++;
        stats.lastSubmission = dataHora;

        console.log(`[${dataHora}] Novo cadastro salvo em memória: ${nome} (${rg}) - IP: ${ip}`);
        console.log(`Total de registros: ${dadosMemoria.length}`);

        res.json({ 
            success: true, 
            message: 'Dados salvos com sucesso!',
            id: id,
            total: dadosMemoria.length
        });

    } catch (error) {
        console.error('Erro ao salvar dados:', error);
        stats.totalSubmissions++;
        stats.failedSubmissions++;
        
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao salvar dados: ' + error.message 
        });
    }
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
    console.log(`Para acesso externo: http://seu-ip:${PORT}`);
    console.log(`Arquivo CSV: ${CSV_FILE}`);
    console.log(`Dados em memória: ${dadosMemoria.length} registros`);
    console.log(`Endpoint para dados: /dados`);
    console.log(`Endpoint para download: /download`);
});
