#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function testarDownloadDireto() {
    console.log('📥 Testando download direto da lista...\n');
    
    let browser;
    try {
        // Configurar diretório de download
        const downloadPath = path.join(__dirname, 'downloads');
        if (!fs.existsSync(downloadPath)) {
            fs.mkdirSync(downloadPath);
        }
        
        browser = await puppeteer.launch({ 
            headless: false, // Visível para debug
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Configurar downloads
        const client = await page.target().createCDPSession();
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: downloadPath
        });
        
        // Configurar autenticação básica
        await page.authenticate({
            username: 'admin',
            password: 'Felicidade2020!'
        });
        
        console.log('📄 Acessando painel admin...');
        await page.goto('http://localhost:3001/admin.html', { 
            waitUntil: 'networkidle2',
            timeout: 15000
        });
        
        // Aguardar carregamento completo
        await page.waitForSelector('#totalConfirmacoes', { timeout: 10000 });
        
        // Verificar se dados foram carregados
        const totalConfirmacoes = await page.$eval('#totalConfirmacoes', el => el.textContent);
        console.log(`✅ Total de confirmações: ${totalConfirmacoes}`);
        
        // Verificar se o botão mudou de texto
        const textoBtn = await page.$eval('#downloadBtn', el => el.textContent.trim());
        console.log(`✅ Texto do botão: "${textoBtn}"`);
        
        console.log('📥 Clicando no botão de download...');
        await page.click('#downloadBtn');
        
        // Aguardar download
        console.log('⏰ Aguardando download...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Verificar se arquivo foi baixado
        const arquivos = fs.readdirSync(downloadPath);
        console.log(`📁 Arquivos na pasta download: ${arquivos.join(', ')}`);
        
        if (arquivos.length > 0) {
            console.log('✅ Download realizado com sucesso!');
            
            // Verificar conteúdo do arquivo
            const arquivoCSV = arquivos.find(f => f.endsWith('.csv'));
            if (arquivoCSV) {
                const conteudo = fs.readFileSync(path.join(downloadPath, arquivoCSV), 'utf8');
                const linhas = conteudo.split('\n').filter(l => l.trim());
                console.log(`📄 Arquivo CSV contém ${linhas.length} linhas`);
                console.log(`📝 Primeira linha: ${linhas[0]}`);
            }
        } else {
            console.log('❌ Nenhum arquivo baixado');
        }
        
        console.log('\n🎉 Teste de download direto concluído!');
        
    } catch (error) {
        console.error('❌ Erro durante teste:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Executar teste
testarDownloadDireto();
