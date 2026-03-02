// ==========================================
// 1. MAPEANDO OS ELEMENTOS DA TELA
// ==========================================
const modalCliente = document.getElementById('modalCliente');
const btnAbrirModal = document.getElementById('btnAbrirModalCliente');
const btnFecharModal = document.getElementById('btnFecharModal');
const btnCancelarModal = document.getElementById('btnCancelarModal');
const btnSalvarCliente = document.getElementById('btnSalvarCliente');
const inputBusca = document.getElementById('buscaCliente');
const corpoTabela = document.getElementById('tabelaClientesBody');

// Botões da Toolbar
const btnEditarToolbar = document.querySelector('button[title="Editar"]');
const btnExcluirToolbar = document.querySelector('button[title="Excluir"]');
const btnRecarregarToolbar = document.querySelector('button[title="Recarregar"]');

let idClienteSendoEditado = null;
let todosOsClientes = [];

// ==========================================
// 2. BUSCA EM TEMPO REAL (Filtro Único)
// ==========================================
inputBusca.addEventListener('input', (evento) => {
    const termo = evento.target.value.toLowerCase();

    const filtrados = todosOsClientes.filter(cliente => {
        const nomeBate = cliente.nome.toLowerCase().includes(termo);
        const docBate = cliente.documento.toLowerCase().includes(termo);
        return nomeBate || docBate; // Busca por nome OU documento
    });

    renderizarTabela(filtrados);
});

// ==========================================
// 3. ABRIR E FECHAR O MODAL
// ==========================================
function limparFormulario() {
    idClienteSendoEditado = null;
    document.getElementById('cadNome').value = '';
    document.getElementById('cadDocumento').value = '';
    document.getElementById('cadTelefone').value = '';
}

btnAbrirModal.addEventListener('click', () => {
    limparFormulario();
    modalCliente.style.display = "flex";
});

btnFecharModal.addEventListener('click', () => modalCliente.style.display = "none");
btnCancelarModal.addEventListener('click', () => modalCliente.style.display = "none");

// ==========================================
// 4. LÓGICA DA TOOLBAR (EDITAR E EXCLUIR VIA CHECKBOX)
// ==========================================
function obterIdSelecionado() {
    // Pega o primeiro checkbox que estiver marcado na tabela
    const checkbox = document.querySelector('.check-cliente:checked');
    if (!checkbox) {
        alert("⚠️ Por favor, selecione um cliente na tabela primeiro!");
        return null;
    }
    return checkbox.value;
}

// Botão Editar da Toolbar
btnEditarToolbar.addEventListener('click', () => {
    const id = obterIdSelecionado();
    if (!id) return;

    const cliente = todosOsClientes.find(c => c.id == id);
    if (cliente) {
        idClienteSendoEditado = cliente.id;
        document.getElementById('cadNome').value = cliente.nome;
        document.getElementById('cadDocumento').value = cliente.documento;
        document.getElementById('cadTelefone').value = cliente.telefone || '';

        modalCliente.style.display = "flex";
    }
});

// Botão Excluir da Toolbar
btnExcluirToolbar.addEventListener('click', async () => {
    const id = obterIdSelecionado();
    if (!id) return;

    if (confirm("Tem certeza que deseja excluir este cliente? Essa ação não pode ser desfeita.")) {
        try {
            const resposta = await fetch(`http://localhost:3000/clientes/${id}`, { method: 'DELETE' });
            if (resposta.ok) {
                alert('🗑️ Cliente excluído com sucesso!');
                carregarClientes();
            } else {
                alert('❌ Erro ao excluir cliente.');
            }
        } catch (erro) {
            console.error('Erro:', erro);
        }
    }
});

// Botão Recarregar da Toolbar
btnRecarregarToolbar.addEventListener('click', () => {
    inputBusca.value = ''; // Limpa a busca
    carregarClientes();
});

// ==========================================
// 5. SALVAR NO BANCO (POST ou PUT)
// ==========================================
btnSalvarCliente.addEventListener('click', async () => {
    const nome = document.getElementById('cadNome').value;
    const documento = document.getElementById('cadDocumento').value;

    if (!nome || !documento) {
        alert("⚠️ O Nome e o CPF/CNPJ são obrigatórios!");
        return;
    }

    // Criando o pacote para enviar (enviando null para os campos que ocultamos no layout limpo)
    const pacoteCliente = {
        nome: nome,
        documento: documento,
        telefone: document.getElementById('cadTelefone').value,
        data_nascimento: null,
        email: null,
        endereco: null,
        data_ultima_compra: null,
        veiculo_comprado: null
    };

    try {
        let resposta;
        if (idClienteSendoEditado !== null) {
            // Editando
            resposta = await fetch(`http://localhost:3000/clientes/${idClienteSendoEditado}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pacoteCliente)
            });
        } else {
            // Criando novo
            resposta = await fetch('http://localhost:3000/clientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pacoteCliente)
            });
        }

        if (resposta.ok) {
            modalCliente.style.display = "none";
            limparFormulario();
            carregarClientes(); // Atualiza a tabela na hora
        } else {
            alert('❌ Erro ao salvar. Verifique se o CPF/CNPJ já existe no sistema.');
        }
    } catch (erro) {
        console.error('Erro:', erro);
    }
});

// ==========================================
// 6. CARREGAR E RENDERIZAR CLIENTES NA TABELA NOVA
// ==========================================
async function carregarClientes() {
    try {
        const resposta = await fetch('http://localhost:3000/clientes');
        todosOsClientes = await resposta.json();
        renderizarTabela(todosOsClientes);
    } catch (erro) {
        console.error('Erro ao carregar os clientes:', erro);
    }
}

function renderizarTabela(lista) {
    corpoTabela.innerHTML = ''; // Limpa os dados falsos do HTML

    if (lista.length === 0) {
        corpoTabela.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px;">Nenhum cliente encontrado.</td></tr>`;
        return;
    }

    lista.forEach(cliente => {
        const linha = document.createElement('tr');

        // Cria a linha exatamente no padrão do app.html
        linha.innerHTML = `
            <td class="col-checkbox"><input type="checkbox" class="check-cliente" value="${cliente.id}"></td>
            <td>${cliente.id}</td>
            <td style="font-weight: 500;">${cliente.nome}</td>
            <td>${cliente.telefone || '-'}</td>
            <td>${cliente.documento}</td>
        `;

        corpoTabela.appendChild(linha);
    });
}

// Inicia carregando os clientes quando a página abre
carregarClientes();