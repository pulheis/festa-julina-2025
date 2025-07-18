#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function testarDownload() {
    console.log('📥 Testando funcionalidade de download...\n');
    
    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: false, // Não headless para ver o que acontece
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            slowMo: 1000 // Desacelerar para debug
        });
        
        const page = await browser.newPage();
        
        // Configurar autenticação básica
        await page.authenticate({
            username: 'admin',
            password: 'Felicidade2020!'
        });
        
        console.log('📄 Acessando painel admin...');
        await page.goto('https://festa-julina-2025.onrender.com/admin.html', { 
            waitUntil: 'networkidle2',
            timeout: 20000
        });
        
        // Aguardar carregamento completo
        await page.waitForSelector('#totalConfirmacoes', { timeout: 10000 });
        
        console.log('⏰ Aguardando 3 segundos para estabilizar...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Verificar se dados foram carregados
        const totalConfirmacoes = await page.$eval('#totalConfirmacoes', el => el.textContent);
        console.log(`✅ Total de confirmações: ${totalConfirmacoes}`);
        
        // Testar botão Download com timeout maior
        console.log('📥 Clicando no botão Download...');
        
        // Configurar listener para popups
        page.on('popup', popup => {
            console.log('✅ Popup detectado:', popup.url());
        });
        
        await page.click('#downloadBtn');
        
        console.log('⏰ Aguardando 10 segundos para processar...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        console.log('🎉 Teste de download concluído!');
        
    } catch (error) {
        console.error('❌ Erro durante teste:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Executar teste
testarDownload();
