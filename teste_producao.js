#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function testarProducao() {
    console.log('🌐 Testando aplicação em produção...\n');
    
    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Capturar requests para debug
        const requests = [];
        page.on('request', request => {
            if (request.url().includes('/dados') || request.url().includes('/admin')) {
                requests.push({
                    url: request.url(),
                    method: request.method(),
                    headers: request.headers()
                });
            }
        });
        
        // Capturar responses para debug
        const responses = [];
        page.on('response', response => {
            if (response.url().includes('/dados') || response.url().includes('/admin')) {
                responses.push({
                    url: response.url(),
                    status: response.status(),
                    statusText: response.statusText()
                });
            }
        });
        
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
        
        console.log('📄 Acessando painel admin em produção...');
        await page.goto('https://festa-julina-2025.onrender.com/admin.html', { 
            waitUntil: 'networkidle2',
            timeout: 20000
        });
        
        // Aguardar carregamento completo
        await page.waitForSelector('#totalConfirmacoes', { timeout: 10000 });
        
        // Verificar se dados foram carregados
        const totalConfirmacoes = await page.$eval('#totalConfirmacoes', el => el.textContent);
        const totalSubmissoes = await page.$eval('#totalSubmissoes', el => el.textContent);
        const ultimaConfirmacao = await page.$eval('#ultimaConfirmacao', el => el.textContent);
        
        console.log(`✅ Total de confirmações: ${totalConfirmacoes}`);
        console.log(`✅ Total de submissões: ${totalSubmissoes}`);
        console.log(`✅ Última confirmação: ${ultimaConfirmacao}`);
        
        // Verificar se a tabela foi carregada
        const tabela = await page.$('.table-container');
        if (tabela) {
            const linhas = await page.$$eval('tbody tr', rows => rows.length);
            console.log(`✅ Tabela carregada com ${linhas} linhas`);
        } else {
            console.log('❌ Tabela não encontrada');
        }
        
        // Testar botão Atualizar
        console.log('🔄 Testando botão Atualizar...');
        await page.click('#atualizarBtn');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Testar botão Download
        console.log('📥 Testando botão Download...');
        await page.click('#downloadBtn');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Verificar requests feitos
        console.log('\n📊 Requests realizados:');
        requests.forEach(req => {
            console.log(`  - ${req.method} ${req.url}`);
        });
        
        // Verificar responses recebidos
        console.log('\n📋 Responses recebidos:');
        responses.forEach(res => {
            console.log(`  - ${res.status} ${res.statusText} - ${res.url}`);
        });
        
        // Verificar se houve erros
        if (errors.length > 0) {
            console.log('\n❌ Erros encontrados:');
            errors.forEach(error => console.log(`  - ${error}`));
        } else {
            console.log('\n✅ Nenhum erro encontrado!');
        }
        
        console.log('\n🎉 Teste de produção concluído!');
        
    } catch (error) {
        console.error('❌ Erro durante teste:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Executar teste
testarProducao();
