#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function testarCorrecoes() {
    console.log('🔍 Testando correções do painel admin...\n');
    
    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Capturar erros de console
        const consoleErrors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });
        
        // Capturar erros de JavaScript
        const jsErrors = [];
        page.on('pageerror', error => {
            jsErrors.push(error.message);
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
        
        // Aguardar carregamento completo
        await page.waitForSelector('#totalConfirmacoes', { timeout: 5000 });
        
        // Verificar se os dados foram carregados
        const totalConfirmacoes = await page.$eval('#totalConfirmacoes', el => el.textContent);
        console.log(`✅ Total de confirmações carregado: ${totalConfirmacoes}`);
        
        // Verificar se os botões existem
        const botaoAtualizar = await page.$('#atualizarBtn');
        const botaoDownload = await page.$('#downloadBtn');
        
        console.log(`✅ Botão Atualizar existe: ${botaoAtualizar ? 'SIM' : 'NÃO'}`);
        console.log(`✅ Botão Download existe: ${botaoDownload ? 'SIM' : 'NÃO'}`);
        
        // Testar clique no botão atualizar
        console.log('🔄 Testando botão Atualizar...');
        await page.click('#atualizarBtn');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Testar clique no botão download
        console.log('📥 Testando botão Download...');
        await page.click('#downloadBtn');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Verificar se houve erros
        if (consoleErrors.length > 0) {
            console.log('❌ Erros no console:');
            consoleErrors.forEach(error => console.log(`  - ${error}`));
        } else {
            console.log('✅ Nenhum erro no console');
        }
        
        if (jsErrors.length > 0) {
            console.log('❌ Erros JavaScript:');
            jsErrors.forEach(error => console.log(`  - ${error}`));
        } else {
            console.log('✅ Nenhum erro JavaScript');
        }
        
        // Verificar CSP
        console.log('🔒 Verificando CSP...');
        const response = await page.goto('http://localhost:3001/admin.html');
        const cspHeader = response.headers()['content-security-policy'];
        
        if (cspHeader) {
            console.log('✅ CSP Header encontrado');
            console.log(`📋 CSP: ${cspHeader.substring(0, 100)}...`);
        } else {
            console.log('❌ CSP Header não encontrado');
        }
        
        console.log('\n🎉 Teste concluído com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro durante o teste:', error.message);
        process.exit(1);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Executar teste
testarCorrecoes();
