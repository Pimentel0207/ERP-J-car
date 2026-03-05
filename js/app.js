// 1. Pega os dados do usuário que logou
const usuarioString = localStorage.getItem('usuarioLogado');
const usuario = JSON.parse(usuarioString);

// 2. Mostra o nome e libera o menu do admin (se for o caso)
document.getElementById('nomeUsuarioLogado').textContent = usuario.nome || usuario.email;

if (usuario.email === 'joao@evoplan.com') {
    document.getElementById('btnAdmin').style.display = "flex";
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

// Função global para fechar o modal de detalhes
function fecharModalDetalhes() {
    document.getElementById('modalDetalhes').style.display = 'none';
}

// Função mestra para montar o conteúdo do modal baseado no tipo de dado
function abrirVisualizacao(tipo, dados) {
    const conteudo = document.getElementById('detalheConteudo');
    const titulo = document.getElementById('detalheTitulo');
    conteudo.innerHTML = ''; // Limpa o que tinha antes

    if (tipo === 'venda') {
        titulo.innerText = "Detalhes da Venda";
        conteudo.innerHTML = `
            <div class="campo"><label>ID da Venda</label><input class="input-padrao" value="${dados.id}" readonly></div>
            <div class="campo"><label>Data/Hora</label><input class="input-padrao" value="${dados.data}" readonly></div>
            <div class="campo"><label>Vendedor</label><input class="input-padrao" value="${dados.vendedor}" readonly></div>
            <div class="campo"><label>Veículo</label><input class="input-padrao" value="${dados.veiculo}" readonly></div>
            <div class="campo"><label>Valor Total</label><input class="input-padrao" value="R$ ${dados.valor}" readonly></div>
            <div class="campo"><label>Comissão</label><input class="input-padrao" value="R$ ${dados.comissao}" readonly></div>
            <div class="campo" style="grid-column: span 2;"><label>Observações</label><textarea class="input-padrao" readonly>${dados.obs || 'Nenhuma observação.'}</textarea></div>
        `;
    }

    else if (tipo === 'estoque') {
        titulo.innerText = "Ficha Técnica do Veículo";
        conteudo.innerHTML = `
            <div class="campo"><label>Marca/Modelo</label><input class="input-padrao" value="${dados.modelo}" readonly></div>
            <div class="campo"><label>Placa</label><input class="input-padrao" value="${dados.placa}" readonly></div>
            <div class="campo"><label>Ano</label><input class="input-padrao" value="${dados.ano}" readonly></div>
            <div class="campo"><label>Cor</label><input class="input-padrao" value="${dados.cor}" readonly></div>
            <div class="campo"><label>KM Atual</label><input class="input-padrao" value="${dados.km}" readonly></div>
            <div class="campo"><label>Preço de Venda</label><input class="input-padrao" value="R$ ${dados.preco}" readonly></div>
        `;
    }

    document.getElementById('modalDetalhes').style.display = 'flex';

}





function abrirVisualizacaoCliente(dados) {
    const conteudo = document.getElementById('detalheConteudo');
    const titulo = document.getElementById('detalheTitulo');

    titulo.innerText = "Ficha do Cliente";
    conteudo.innerHTML = `
        <div class="campo"><label>Nome Completo</label><input class="input-padrao" value="${dados.nome}" readonly></div>
        <div class="campo"><label>CPF/CNPJ</label><input class="input-padrao" value="${dados.documento}" readonly></div>
        <div class="campo"><label>Telefone</label><input class="input-padrao" value="${dados.telefone || 'Não informado'}" readonly></div>
        <div class="campo" style="grid-column: span 2;"><label>E-mail</label><input class="input-padrao" value="${dados.email || 'Não cadastrado'}" readonly></div>
        <div class="campo" style="grid-column: span 2;"><label>Histórico/Observações</label><textarea class="input-padrao" readonly>Cliente cadastrado no sistema J-CAR.</textarea></div>
    `;

    document.getElementById('modalDetalhes').style.display = 'flex';
}

document.getElementById('btnMenuMobile').addEventListener('click', () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('mobile-aberto');
});

// Fecha o menu automaticamente ao clicar em qualquer item (melhora a navegação mobile)
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelector('.sidebar').classList.remove('mobile-aberto');
    });
});