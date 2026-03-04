const email = document.getElementById("email");
const password = document.getElementById("password");
const form = document.querySelector("form");
const erro = document.querySelector(".erro");

// PROTEÇÃO: Só adiciona o evento se o formulário existir na tela
if (form) {
    form.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        if (erro) erro.style.display = "none";

        try {
            // Pede permissão para o Backend
            const resposta = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email.value,
                    password: password.value
                })
            });

            const dados = await resposta.json();

            if (resposta.ok) {
                // ✅ Salva no navegador
                localStorage.setItem('usuarioLogado', JSON.stringify(dados.usuario));

                // ✅ A PORTA DE ENTRADA CORRETA:
                window.location.href = "app.html";
            } else {
                // 🚨 Mostra o erro se o usuário ou senha estiverem errados!
                if (erro) {
                    erro.textContent = dados.mensagem || "E-mail ou senha incorretos.";
                    erro.style.display = "block";
                }
            }
        } catch (error) {
            if (erro) {
                erro.textContent = "Erro de conexão com o servidor.";
                erro.style.display = "block";
            }
        }
    });
}