#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function monitorarLoop() {
    console.log('🔍 Monitorando se há loop infinito...\n');
    
    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Capturar requests para admin.html
        let requestCount = 0;
        page.on('request', (request) => {
            if (request.url().includes('admin.html')) {
                requestCount++;
                console.log(`Request ${requestCount}: ${request.url()}`);
            }
        });
        
        // Configurar autenticação básica
        await page.authenticate({
            username: 'admin',
            password: 'Felicidade2020!'
        });
        
        console.log('📄 Acessando painel admin...');
        await page.goto('http://localhost:3001/admin.html', { 
            waitUntil: 'networkidle2',
            timeout: 10000
        });
        
        console.log('⏰ Aguardando 10 segundos para monitorar...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        console.log(`\n📊 Resultado: ${requestCount} requests para admin.html`);
        
        if (requestCount === 1) {
            console.log('✅ Sem loop infinito! Apenas 1 request como esperado.');
        } else if (requestCount > 1) {
            console.log(`❌ Possível loop infinito detectado! ${requestCount} requests.`);
        }
        
    } catch (error) {
        console.error('❌ Erro durante monitoramento:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Executar monitoramento
monitorarLoop();
