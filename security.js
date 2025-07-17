const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const validator = require('validator');
const crypto = require('crypto');

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

    // Validar nome
    if (!nome || typeof nome !== 'string' || nome.trim().length < 2) {
        return res.status(400).json({
            success: false,
            message: 'Nome deve ter pelo menos 2 caracteres'
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

    const rgNumbers = rg.replace(/\D/g, '');
    if (rgNumbers.length < 7 || rgNumbers.length > 12) {
        return res.status(400).json({
            success: false,
            message: 'RG deve ter entre 7 e 12 dígitos'
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
            scriptSrc: ["'self'", "'unsafe-inline'"], // Adicionado unsafe-inline
            connectSrc: ["'self'"],
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
    checkOrigin
};
