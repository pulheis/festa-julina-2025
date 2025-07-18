#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function testarBotoes() {
    console.log('🔍 Testando funcionalidade dos botões...\n');
    
    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Capturar erros
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });
        
        // Configurar autenticação básica
        await page.authenticate({
            username: 'admin',
            password: 'Felicidade2020!'
        });
        
        console.log('📄 Acessando painel admin...');
        await page.goto('https://festa-julina-2025.onrender.com/admin.html', { 
            waitUntil: 'networkidle2',
            timeout: 15000
        });
        
        // Aguardar carregamento completo
        await page.waitForSelector('#totalConfirmacoes', { timeout: 5000 });
        
        // Verificar se dados foram carregados
        const totalConfirmacoes = await page.$eval('#totalConfirmacoes', el => el.textContent);
        console.log(`✅ Total de confirmações: ${totalConfirmacoes}`);
        
        // Testar botão Atualizar
        console.log('🔄 Testando botão Atualizar...');
        await page.click('#atualizarBtn');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Testar botão Download
        console.log('📥 Testando botão Download...');
        await page.click('#downloadBtn');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Verificar se houve erros
        if (errors.length > 0) {
            console.log('❌ Erros encontrados:');
            errors.forEach(error => console.log(`  - ${error}`));
        } else {
            console.log('✅ Nenhum erro encontrado!');
        }
        
        console.log('\n🎉 Teste dos botões concluído!');
        
    } catch (error) {
        console.error('❌ Erro durante teste:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Executar teste
testarBotoes();
