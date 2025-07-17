const puppeteer = require('puppeteer');
const fs = require('fs');

async function testPDF() {
    try {
        console.log('Testando geração de PDF...');
        
        const browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();
        await page.setContent('<h1>Teste PDF</h1><p>Este é um teste simples.</p>', { waitUntil: 'networkidle0' });

        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true
        });

        await browser.close();

        // Salvar o PDF
        fs.writeFileSync('teste_simples.pdf', pdf);
        console.log('PDF simples criado com sucesso!');
        console.log('Tamanho:', pdf.length, 'bytes');
        console.log('Tipo:', typeof pdf);
        console.log('É Buffer?', Buffer.isBuffer(pdf));

    } catch (error) {
        console.error('Erro:', error);
    }
}

testPDF();
