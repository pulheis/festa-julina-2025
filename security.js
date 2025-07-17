const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const validator = require('validator');
const crypto = require('crypto');

// Função para validar RG brasileiro
function validarRG(rg) {
    // Remove caracteres não numéricos
    const rgLimpo = rg.replace(/\D/g, '');
    
    // Verifica se tem entre 7 e 9 dígitos (RG pode variar por estado)
    if (rgLimpo.length < 7 || rgLimpo.length > 9) {
        return false;
    }
    
    // Verifica se não são todos os dígitos iguais
    if (/^(\d)\1+$/.test(rgLimpo)) {
        return false;
    }
    
    // Verifica sequências óbvias inválidas
    if (/^(0123456789|9876543210|1234567890)/.test(rgLimpo)) {
        return false;
    }
    
    // Para RGs com 9 dígitos, faz validação do dígito verificador apenas se for SP
    // (outros estados têm regras diferentes ou não usam dígito verificador)
    if (rgLimpo.length === 9) {
        // Validação mais flexível - aceita se não for obviamente inválido
        const primeiroDigito = parseInt(rgLimpo[0]);
        const ultimoDigito = parseInt(rgLimpo[8]);
        
        // Rejeita apenas casos obviamente inválidos
        if (primeiroDigito === 0 && ultimoDigito === 0) {
            return false;
        }
    }
    
    // Aceita RGs com 7, 8 ou 9 dígitos que passaram nos testes básicos
    return true;
}

// Função para validar nome completo
function validarNomeCompleto(nome) {
    const nomeNormalizado = nome.trim();
    
    // Verifica se tem pelo menos 2 palavras
    const palavras = nomeNormalizado.split(/\s+/);
    if (palavras.length < 2) {
        return false;
    }
    
    // Verifica se cada palavra tem pelo menos 2 caracteres
    for (let palavra of palavras) {
        if (palavra.length < 2) {
            return false;
        }
    }
    
    // Verifica se contém apenas letras, espaços e acentos
    const regexNome = /^[a-zA-ZÀ-ÿ\s]+$/;
    return regexNome.test(nomeNormalizado);
}

// Rate limiting - limita tentativas de envio
const createRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // máximo 5 tentativas por IP por janela
    message: {
        success: false,
        message: 'Muitas tentativas. Tente novamente em 15 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiting para rotas gerais
const generalRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 100, // máximo 100 requests por IP por minuto
    message: {
        success: false,
        message: 'Muitas requisições. Tente novamente em 1 minuto.'
    }
});

// Middleware de validação de entrada
const validateInput = (req, res, next) => {
    const { nome, rg } = req.body;

    // Validar nome completo
    if (!nome || typeof nome !== 'string' || nome.trim().length < 2) {
        return res.status(400).json({
            success: false,
            message: 'Nome completo é obrigatório'
        });
    }

    // Validar se é nome completo (nome + sobrenome)
    if (!validarNomeCompleto(nome)) {
        return res.status(400).json({
            success: false,
            message: 'Digite seu nome completo (nome e sobrenome)'
        });
    }

    // Sanitizar nome (remover caracteres especiais perigosos)
    const sanitizedNome = validator.escape(nome.trim());
    if (sanitizedNome.length > 100) {
        return res.status(400).json({
            success: false,
            message: 'Nome muito longo (máximo 100 caracteres)'
        });
    }

    // Validar RG
    if (!rg || typeof rg !== 'string') {
        return res.status(400).json({
            success: false,
            message: 'RG é obrigatório'
        });
    }

    // Validar formato do RG brasileiro
    if (!validarRG(rg)) {
        return res.status(400).json({
            success: false,
            message: 'RG inválido. Verifique se está correto.'
        });
    }

    // Aplicar dados sanitizados
    req.body.nome = sanitizedNome;
    req.body.rg = validator.escape(rg.trim());

    next();
};

// Middleware de autenticação básica (opcional)
const basicAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Acesso negado. Autenticação necessária.'
        });
    }

    const token = authHeader.split(' ')[1];
    const credentials = Buffer.from(token, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    // Credenciais simples (em produção, use um banco de dados)
    const validUsername = process.env.ADMIN_USER || 'admin';
    const validPassword = process.env.ADMIN_PASS || 'admin123';

    if (username === validUsername && password === validPassword) {
        next();
    } else {
        res.status(401).json({
            success: false,
            message: 'Credenciais inválidas'
        });
    }
};

// Middleware de log de segurança
const securityLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent') || 'Unknown';
    
    console.log(`[${timestamp}] ${req.method} ${req.url} - IP: ${ip} - UA: ${userAgent}`);
    
    next();
};

// Configuração do Helmet para segurança
const helmetConfig = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            connectSrc: ["'self'"],
            scriptSrcAttr: ["'unsafe-inline'"], // Permitir event handlers inline
            baseUri: ["'self'"],
            formAction: ["'self'"],
            frameAncestors: ["'self'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
    crossOriginEmbedderPolicy: false,
});

// Middleware de verificação de origem
const checkOrigin = (req, res, next) => {
    const allowedOrigins = [
        'http://localhost:3001',
        'http://10.0.0.41:3001',
        process.env.ALLOWED_ORIGIN
    ].filter(Boolean);

    const origin = req.get('Origin');
    
    if (!origin || allowedOrigins.includes(origin)) {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Origem não permitida'
        });
    }
};

module.exports = {
    createRateLimiter,
    generalRateLimiter,
    validateInput,
    basicAuth,
    securityLogger,
    helmetConfig,
    checkOrigin,
    validarRG,
    validarNomeCompleto
};
