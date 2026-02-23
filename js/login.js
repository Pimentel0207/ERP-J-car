const email = document.getElementById("email");
const password = document.getElementById("password");
const btn = document.querySelector(".btn-fake");
const erro = document.querySelector(".erro");

// Add default user if not present
let users = JSON.parse(localStorage.getItem("users")) || [];
const defaultUser = { email: "joao@evoplan.com", password: "joao1234" };
if (!users.find(user => user.email === defaultUser.email)) {
    users.push(defaultUser);
    localStorage.setItem("users", JSON.stringify(users));
}

btn.addEventListener("click", () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === email.value && u.password === password.value);

    if (user) {
        window.location.href = "menu.html";
    } else {
        erro.style.display = "block";
    }
});
