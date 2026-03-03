// js/acessos.js
(() => {
    // ==========================================
    // 1. VERIFICAR ACESSO ADMIN
    // ==========================================
    const sessaoAcessos = localStorage.getItem('usuarioLogado');
    let isGestorAdmin = false;

    if (!sessaoAcessos) {
        return;
    } else {
        const usuarioAcessos = JSON.parse(sessaoAcessos);
        if (usuarioAcessos.email === 'joao@evoplan.com') {
            isGestorAdmin = true;
        }
    }

    if (!isGestorAdmin) return;

    // ==========================================
    // 2. MAPEANDO ELEMENTOS DA TELA
    // ==========================================
    const corpoTabelaUsuarios = document.getElementById('tabelaUsuariosBody');
    const inputBuscaUsuario = document.getElementById('buscaUsuario');

    // Elementos do Modal
    const modalUsuario = document.getElementById('modalUsuario');
    const btnAbrirModalUsuario = document.getElementById('btnAbrirModalUsuario');
    const btnFecharModalUsuario = document.getElementById('btnFecharModalUsuario');
    const btnCancelarModalUsuario = document.getElementById('btnCancelarModalUsuario');
    const btnSalvarUsuario = document.getElementById('btnSalvarUsuario');
    const tituloModalUsuario = document.getElementById('tituloModalUsuario');

    // Botões da Toolbar
    const btnEditarUsuario = document.getElementById('btnEditarUsuarioToolbar');
    const btnExcluirUsuario = document.getElementById('btnExcluirUsuarioToolbar');
    const btnRecarregarUsuarios = document.getElementById('btnRecarregarUsuarios');

    let todosOsUsuarios = [];
    let idUsuarioSendoEditado = null; // Controle de estado (Novo x Edição)

    // ==========================================
    // 3. SELEÇÃO BLINDADA
    // ==========================================
    function obterUsuarioSelecionado() {
        const checkbox = document.querySelector('#tabelaUsuariosBody .check-usuario:checked');
        if (!checkbox) {
            alert("⚠️ Selecione um usuário na tabela de acessos primeiro.");
            return null;
        }
        return {
            id: checkbox.value,
            email: checkbox.getAttribute('data-email')
        };
    }

    // ==========================================
    // 4. LÓGICA DA TOOLBAR
    // ==========================================

    if (inputBuscaUsuario) {
        inputBuscaUsuario.addEventListener('input', (evento) => {
            const termo = evento.target.value.toLowerCase();
            const filtrados = todosOsUsuarios.filter(u => u.email.toLowerCase().includes(termo));
            renderizarTabelaUsuarios(filtrados);
        });
    }

    // --- EDITAR USUÁRIO (AGORA FUNCIONAL!) ---
    if (btnEditarUsuario) {
        btnEditarUsuario.addEventListener('click', () => {
            const selecionado = obterUsuarioSelecionado();
            if (!selecionado) return;

            const usuarioFull = todosOsUsuarios.find(u => u.id == selecionado.id);
            if (usuarioFull) {
                idUsuarioSendoEditado = usuarioFull.id;

                // Preenche os campos
                document.getElementById('cadUsuarioNome').value = usuarioFull.nome || '';
                document.getElementById('cadUsuarioEmail').value = usuarioFull.email;
                document.getElementById('cadUsuarioSenha').value = ''; // Deixa vazio por segurança

                // Muda o visual do modal
                if (tituloModalUsuario) tituloModalUsuario.textContent = 'Editar Acesso';

                modalUsuario.style.display = "flex";
            }
        });
    }

    if (btnExcluirUsuario) {
        btnExcluirUsuario.addEventListener('click', async () => {
            const usuario = obterUsuarioSelecionado();
            if (!usuario) return;

            if (usuario.email === 'joao@evoplan.com') {
                alert("🛡️ Operação Bloqueada: O usuário administrador principal não pode ser excluído.");
                return;
            }

            if (confirm(`Tem certeza que deseja REVOGAR O ACESSO de ${usuario.email}?`)) {
                try {
                    const res = await fetch(`http://localhost:3000/usuarios/${usuario.id}`, { method: 'DELETE' });
                    if (res.ok) {
                        alert("🗑️ Acesso revogado com sucesso!");
                        carregarUsuarios();
                    } else {
                        alert("❌ Erro ao excluir usuário.");
                    }
                } catch (erro) {
                    console.error("Erro na exclusão:", erro);
                }
            }
        });
    }

    if (btnRecarregarUsuarios) {
        btnRecarregarUsuarios.addEventListener('click', () => {
            inputBuscaUsuario.value = '';
            carregarUsuarios();
        });
    }

    // ==========================================
    // 5. MODAL E SALVAMENTO (POST ou PUT)
    // ==========================================
    function limparFormularioUsuario() {
        idUsuarioSendoEditado = null; // Reseta a variável
        if (tituloModalUsuario) tituloModalUsuario.textContent = 'Cadastrar Novo Acesso';
        document.getElementById('cadUsuarioNome').value = '';
        document.getElementById('cadUsuarioEmail').value = '';
        document.getElementById('cadUsuarioSenha').value = '';
    }

    if (btnAbrirModalUsuario) btnAbrirModalUsuario.addEventListener('click', () => {
        limparFormularioUsuario();
        modalUsuario.style.display = "flex";
    });

    if (btnFecharModalUsuario) btnFecharModalUsuario.addEventListener('click', () => modalUsuario.style.display = "none");
    if (btnCancelarModalUsuario) btnCancelarModalUsuario.addEventListener('click', () => modalUsuario.style.display = "none");

    if (btnSalvarUsuario) {
        btnSalvarUsuario.addEventListener('click', async () => {
            const nome = document.getElementById('cadUsuarioNome').value;
            const email = document.getElementById('cadUsuarioEmail').value;
            const senha = document.getElementById('cadUsuarioSenha').value;

            // Validação: Se for novo usuário, senha é obrigatória. Se for edição, pode ser vazia.
            if (!nome || !email || (!senha && idUsuarioSendoEditado === null)) {
                alert("⚠️ Preencha Nome, E-mail e Senha para continuar.");
                return;
            }

            try {
                const pacote = { nome: nome, email: email, password: senha };

                // Define a URL e o Método dependendo se estamos criando ou editando
                const url = idUsuarioSendoEditado
                    ? `http://localhost:3000/usuarios/${idUsuarioSendoEditado}`
                    : 'http://localhost:3000/signup';
                const metodo = idUsuarioSendoEditado ? 'PUT' : 'POST';

                const resposta = await fetch(url, {
                    method: metodo,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(pacote)
                });

                const dados = await resposta.json();

                if (resposta.ok) {
                    alert('✅ ' + (dados.mensagem || 'Operação realizada com sucesso!'));
                    modalUsuario.style.display = "none";
                    limparFormularioUsuario();
                    carregarUsuarios();
                } else {
                    alert('❌ Erro: ' + dados.mensagem);
                }
            } catch (erro) {
                console.error('Erro ao salvar usuário:', erro);
            }
        });
    }

    // ==========================================
    // 6. CARREGAR E RENDERIZAR TABELA
    // ==========================================
    async function carregarUsuarios() {
        try {
            const resposta = await fetch('http://localhost:3000/usuarios');
            todosOsUsuarios = await resposta.json();
            renderizarTabelaUsuarios(todosOsUsuarios);
        } catch (erro) {
            console.error("Erro ao carregar usuários:", erro);
        }
    }

    function renderizarTabelaUsuarios(lista) {
        corpoTabelaUsuarios.innerHTML = '';

        if (lista.length === 0) {
            corpoTabelaUsuarios.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px;">Nenhum usuário encontrado.</td></tr>`;
            return;
        }

        lista.forEach(user => {
            const linha = document.createElement('tr');

            const dataCriacao = user.criado_em ? new Date(user.criado_em).toLocaleDateString('pt-BR') : '---';
            const nivelAcesso = user.email === 'joao@evoplan.com'
                ? '<span class="badge" style="background-color: #6366f1;">ADMINISTRADOR</span>'
                : '<span class="badge" style="background-color: #64748b;">VENDEDOR</span>';

            const checkboxHtml = user.email === 'joao@evoplan.com'
                ? `<input type="checkbox" disabled title="Protegido">`
                : `<input type="checkbox" class="check-usuario" value="${user.id}" data-email="${user.email}">`;

            linha.innerHTML = `
                <td class="col-checkbox">${checkboxHtml}</td>
                <td>${user.id}</td>
                <td style="font-weight: 500; color: #1e293b;">${user.nome || '---'} <br><span style="font-weight: normal; color: #64748b; font-size: 11px;">${user.email}</span></td>
                <td>${dataCriacao}</td>
                <td style="text-align: center;">${nivelAcesso}</td>
            `;

            corpoTabelaUsuarios.appendChild(linha);
        });
    }

    carregarUsuarios();
})();