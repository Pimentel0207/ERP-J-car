const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const form = document.querySelector("form"); // Captura o formulário
const erro = document.querySelector(".erro");
const sucesso = document.querySelector(".sucesso");

form.addEventListener("submit", (evento) => {
    evento.preventDefault(); // Impede a página de recarregar

    if (password.value !== confirmPassword.value) {
        erro.style.display = "block";
        sucesso.style.display = "none";
        return;
    }

    erro.style.display = "none";

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const newUser = {
        email: email.value,
        password: password.value,
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    sucesso.style.display = "block";

    // Limpa os campos após 2 segundos e manda para o login
    setTimeout(() => {
        email.value = "";
        password.value = "";
        confirmPassword.value = "";
        window.location.href = "login.html";
    }, 2000);
});