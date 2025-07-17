document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cadastro-form');
    const loading = document.getElementById('loading');
    const message = document.getElementById('message');
    const statusText = document.getElementById('status-text');
    const csvStatus = document.getElementById('csv-status');
    const submitBtn = document.querySelector('.submit-btn');
    const successScreen = document.getElementById('success-screen');

    // Máscara para RG
    const rgInput = document.getElementById('rg');
    rgInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 9) {
            value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
        }
        e.target.value = value;
    });

    // Função para verificar status do sistema
    function checkSystemStatus() {
        fetch('/status')
            .then(response => response.json())
            .then(data => {
                if (data.ready) {
                    statusText.textContent = `Pronto para receber suas informações!`;
                    csvStatus.className = 'status-item';
                    submitBtn.disabled = false;
                } else {
                    statusText.textContent = 'Sistema indisponível';
                    csvStatus.className = 'status-item status-error';
                    submitBtn.disabled = true;
                }
            })
            .catch(error => {
                console.error('Erro ao verificar status:', error);
                statusText.textContent = 'Erro ao verificar sistema';
                csvStatus.className = 'status-item status-error';
                submitBtn.disabled = true;
            });
    }

    // Verificar status inicial
    checkSystemStatus();

    // Função para mostrar tela de sucesso
    function showSuccessScreen() {
        successScreen.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Esconder tela de sucesso após 5 segundos
        setTimeout(() => {
            successScreen.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 5000);
    }

    // Função para mostrar mensagem
    function showMessage(text, type) {
        message.textContent = text;
        message.className = `message ${type}`;
        message.style.display = 'block';
        
        // Rolar para a mensagem
        message.scrollIntoView({ behavior: 'smooth' });
        
        // Esconder mensagem após 5 segundos se for sucesso
        if (type === 'success') {
            setTimeout(() => {
                message.style.display = 'none';
            }, 5000);
        }
    }

    // Função para validar RG brasileiro
    function validarRG(rg) {
        // Remove caracteres não numéricos
        const rgLimpo = rg.replace(/\D/g, '');
        
        // Verifica se tem 9 dígitos
        if (rgLimpo.length !== 9) {
            return false;
        }
        
        // Verifica se não são todos os dígitos iguais
        if (/^(\d)\1{8}$/.test(rgLimpo)) {
            return false;
        }
        
        // Cálculo do dígito verificador
        let soma = 0;
        for (let i = 0; i < 8; i++) {
            soma += parseInt(rgLimpo[i]) * (9 - i);
        }
        
        let resto = soma % 11;
        let digitoVerificador = resto < 2 ? 0 : 11 - resto;
        
        // Verifica se o último dígito está correto
        return parseInt(rgLimpo[8]) === digitoVerificador;
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

    // Função para validar formulário
    function validateForm() {
        const nome = document.getElementById('nome').value.trim();
        const rg = document.getElementById('rg').value.trim();

        if (!nome) {
            showMessage('Por favor, preencha o nome completo', 'error');
            return false;
        }

        if (!validarNomeCompleto(nome)) {
            showMessage('Digite seu nome completo (nome e sobrenome)', 'error');
            return false;
        }

        if (!rg) {
            showMessage('Por favor, preencha o RG', 'error');
            return false;
        }

        if (!validarRG(rg)) {
            showMessage('RG inválido. Verifique se está correto.', 'error');
            return false;
        }

        return true;
    }

    // Evento de submissão do formulário
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        // Mostrar loading
        loading.style.display = 'block';
        message.style.display = 'none';
        submitBtn.disabled = true;

        // Coletar dados do formulário
        const formData = {
            nome: document.getElementById('nome').value.trim(),
            rg: document.getElementById('rg').value.trim()
        };

        try {
            const response = await fetch('/enviar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                showSuccessScreen();
                form.reset(); // Limpar formulário
                checkSystemStatus(); // Atualizar status
            } else {
                showMessage(result.message, 'error');
            }

        } catch (error) {
            console.error('Erro:', error);
            showMessage('Erro ao salvar dados. Tente novamente.', 'error');
        } finally {
            loading.style.display = 'none';
            submitBtn.disabled = false;
        }
    });

    // Adicionar efeitos visuais nos campos
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });

    // Adicionar contador de caracteres para RG
    rgInput.addEventListener('input', function() {
        const cleanValue = this.value.replace(/\D/g, '');
        if (cleanValue.length > 0) {
            this.style.borderColor = cleanValue.length >= 7 ? '#28a745' : '#ffc107';
        }
    });
});
