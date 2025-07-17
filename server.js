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

// Variáveis globais para estatísticas
let stats = {
    totalSubmissions: 0,
    successfulSubmissions: 0,
    failedSubmissions: 0,
    lastSubmission: null
};

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

app.get('/download', (req, res) => {
    if (fs.existsSync(CSV_FILE)) {
        res.download(CSV_FILE, 'cadastros.csv', (err) => {
            if (err) {
                console.error('Erro ao fazer download:', err);
                res.status(500).json({ success: false, message: 'Erro ao fazer download' });
            }
        });
    } else {
        res.status(404).json({ success: false, message: 'Arquivo não encontrado' });
    }
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

        // Dados para salvar no CSV
        const registro = {
            id,
            nome,
            rg,
            dataHora,
            ip,
            userAgent
        };

        // Salvar no CSV
        await csvWriter.writeRecords([registro]);

        // Atualizar estatísticas
        stats.totalSubmissions++;
        stats.successfulSubmissions++;
        stats.lastSubmission = dataHora;

        console.log(`[${dataHora}] Novo cadastro salvo: ${nome} (${rg}) - IP: ${ip}`);

        res.json({ 
            success: true, 
            message: 'Dados salvos com sucesso no arquivo CSV!',
            id: id
        });

    } catch (error) {
        console.error('Erro ao salvar dados:', error);
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
});
