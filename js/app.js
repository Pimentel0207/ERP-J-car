// 1. Verifica Acesso e Boas-Vindas
const usuarioString = localStorage.getItem('usuarioLogado');

if (!usuarioString) {
    window.location.href = "login.html";
} else {
    const usuario = JSON.parse(usuarioString);
    document.getElementById('nomeUsuarioLogado').textContent = usuario.nome || usuario.email;

    if (usuario.email === 'joao@evoplan.com') {
        document.getElementById('btnAdmin').style.display = "flex";
    }
}

// 2. A Mágica de Navegar (SPA) - BLINDADA
function mudarTela(idSecaoAlvo, elementoClicado) {
    // 1. Esconde todas as seções
    const todasSecoes = document.querySelectorAll('.secao-tela');
    todasSecoes.forEach(secao => {
        secao.classList.remove('ativa');
    });

    // 2. Remove a cor azul de todos os botões do menu
    const todosItensMenu = document.querySelectorAll('.menu-item');
    todosItensMenu.forEach(item => {
        item.classList.remove('ativo');
    });

    // 3. Mostra a seção alvo (se ela existir)
    const secaoAlvo = document.getElementById(idSecaoAlvo);
    if (secaoAlvo) {
        secaoAlvo.classList.add('ativa');
    }

    // 4. Pinta o menu de azul e atualiza o topo (se o elemento foi passado)
    if (elementoClicado) {
        elementoClicado.classList.add('ativo');
        const nomeDaTela = elementoClicado.textContent.trim() || "Módulo";
        document.getElementById('caminhoTela').textContent = `Home > ${nomeDaTela}`;
    } else {
        document.getElementById('caminhoTela').textContent = `Home > Sistema`;
    }
}

// 3. Sair do Sistema
document.getElementById('btnSair').addEventListener('click', () => {
    localStorage.removeItem('usuarioLogado');
    window.location.href = "login.html";
});