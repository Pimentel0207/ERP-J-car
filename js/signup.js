// 1. Captura os elementos da tela
const nome = document.getElementById("nome"); // 🚨 NOVO CAMPO CAPTURADO
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const form = document.getElementById("formSignup");
const erro = document.querySelector(".erro");
const sucesso = document.querySelector(".sucesso");

form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    erro.style.display = "none";
    sucesso.style.display = "none";

    // Validação básica rápida no Front-end
    if (password.value !== confirmPassword.value) {
        erro.textContent = "As senhas não conferem";
        erro.style.display = "block";
        return;
    }

    try {
        // Envia os dados para o Backend validar e salvar
        const resposta = await fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: nome.value,     // 🚨 ENVIANDO O NOME PARA O BANCO!
                email: email.value,
                password: password.value
            })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            sucesso.textContent = dados.mensagem;
            sucesso.style.display = "block";

            // Aguarda 2 segundos e manda pro login
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
        } else {
            erro.textContent = dados.mensagem;
            erro.style.display = "block";
        }
    } catch (error) {
        erro.textContent = "Erro de conexão com o servidor.";
        erro.style.display = "block";
    }
});