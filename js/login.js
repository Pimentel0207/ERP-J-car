const email = document.getElementById("email");
const password = document.getElementById("password");
const form = document.querySelector("form"); // Mudamos para capturar o formulário
const erro = document.querySelector(".erro");

// Cria o usuário padrão se não existir
let users = JSON.parse(localStorage.getItem("users")) || [];
const defaultUser = { email: "joao@evoplan.com", password: "joao1234" };
if (!users.find(user => user.email === defaultUser.email)) {
    users.push(defaultUser);
    localStorage.setItem("users", JSON.stringify(users));
}

// Agora escutamos o 'submit' do form
form.addEventListener("submit", (evento) => {
    evento.preventDefault(); // Isso impede a página de recarregar!

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === email.value && u.password === password.value);

    if (user) {
        window.location.href = "menu.html";
    } else {
        erro.style.display = "block";
    }
});