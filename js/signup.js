const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const btn = document.getElementById("btn-signup");
const erro = document.querySelector(".erro");
const sucesso = document.querySelector(".sucesso");

btn.addEventListener("click", () => {
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

    // Clear fields after 2 seconds and redirect to login
    setTimeout(() => {
        email.value = "";
        password.value = "";
        confirmPassword.value = "";
        window.location.href = "login.html";
    }, 2000);
});
