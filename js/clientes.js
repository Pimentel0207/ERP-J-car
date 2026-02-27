// ==========================================
// 1. VARIÁVEIS E MEMÓRIA
// ==========================================
const modal = document.getElementById('modalCadastro');
const btnAbrir = document.getElementById('btnAbrirModal');
const btnFechar = document.getElementById('btnFecharModal');
const form = document.getElementById('formCadastrarCliente');

let idClienteSendoEditado = null;
let todosOsClientes = []; // NOVA: Memória para guardar os dados do banco

// Elementos dos Filtros (IDs que estão no seu HTML)
const inputNome = document.getElementById('filtroNome');
const inputDoc = document.getElementById('filtroDoc');

// ==========================================
// 2. EVENTOS DE FILTRO (Tempo Real)
// ==========================================
inputNome.addEventListener('input', filtrarClientes);
inputDoc.addEventListener('input', filtrarClientes);

function filtrarClientes() {
    const termoNome = inputNome.value.toLowerCase();
    const termoDoc = inputDoc.value.toLowerCase();

    // Filtra a lista guardada na memória
    const filtrados = todosOsClientes.filter(cliente => {
        const nomeBate = cliente.nome.toLowerCase().includes(termoNome);
        const docBate = cliente.documento.toLowerCase().includes(termoDoc);
        return nomeBate && docBate;
    });

    renderizarTabela(filtrados); // Desenha apenas os que sobraram
}

// ==========================================
// 3. MODAL (Abrir e Fechar)
// ==========================================
btnAbrir.onclick = () => {
    idClienteSendoEditado = null;
    form.reset();
    modal.style.display = "flex";
};

btnFechar.onclick = () => {
    modal.style.display = "none";
};

// 👉 NOVO: Lógica do botão "Cancelar" (Cinza)
document.getElementById('btnCancelarCliente').addEventListener('click', () => {
    modal.style.display = 'none';
});

// ==========================================
// 4. PREPARAR EDIÇÃO
// ==========================================
function prepararEdicao(id, nome, documento, data_nascimento, telefone, email, endereco, data_ultima_compra, veiculo_comprado) {
    idClienteSendoEditado = id;

    document.getElementById('cadNome').value = nome;
    document.getElementById('cadDoc').value = documento;
    document.getElementById('cadNascimento').value = data_nascimento ? data_nascimento.split('T')[0] : '';
    document.getElementById('cadTelefone').value = telefone || '';
    document.getElementById('cadEmail').value = email || '';
    document.getElementById('cadEndereco').value = endereco || '';
    document.getElementById('cadUltimaCompra').value = data_ultima_compra ? data_ultima_compra.split('T')[0] : '';
    document.getElementById('cadVeiculo').value = veiculo_comprado || '';

    modal.style.display = "flex";
}

// ==========================================
// 5. SALVAR NO BANCO (POST ou PUT)
// ==========================================
form.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const pacoteCliente = {
        nome: document.getElementById('cadNome').value,
        documento: document.getElementById('cadDoc').value,
        data_nascimento: document.getElementById('cadNascimento').value || null,
        telefone: document.getElementById('cadTelefone').value,
        email: document.getElementById('cadEmail').value,
        endereco: document.getElementById('cadEndereco').value,
        data_ultima_compra: document.getElementById('cadUltimaCompra').value || null,
        veiculo_comprado: document.getElementById('cadVeiculo').value
    };

    try {
        let resposta;
        if (idClienteSendoEditado !== null) {
            resposta = await fetch(`http://localhost:3000/clientes/${idClienteSendoEditado}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pacoteCliente)
            });
        } else {
            resposta = await fetch('http://localhost:3000/clientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pacoteCliente)
            });
        }

        if (resposta.ok) {
            alert('🎉 Cliente salvo com sucesso!');
            modal.style.display = "none";
            form.reset();
            idClienteSendoEditado = null;
            carregarClientes();
        } else {
            alert('❌ Erro ao salvar. Verifique se o CPF/CNPJ já não está cadastrado.');
        }
    } catch (erro) {
        console.error('Erro:', erro);
    }
});

// ==========================================
// 6. CARREGAR E RENDERIZAR CLIENTES
// ==========================================
async function carregarClientes() {
    try {
        const resposta = await fetch('http://localhost:3000/clientes');
        todosOsClientes = await resposta.json(); // Guarda o resultado na variável global
        renderizarTabela(todosOsClientes); // Desenha a tabela completa no início
    } catch (erro) {
        console.error('Erro ao carregar os clientes:', erro);
    }
}

function renderizarTabela(lista) {
    const corpoTabela = document.getElementById('corpoTabelaClientes');
    corpoTabela.innerHTML = '';

    lista.forEach(cliente => {
        const linha = document.createElement('tr');

        const formataData = (dataSql) => {
            if (!dataSql) return '—';
            const dataObj = new Date(dataSql);
            dataObj.setMinutes(dataObj.getMinutes() + dataObj.getTimezoneOffset());
            return dataObj.toLocaleDateString('pt-BR');
        };

        linha.innerHTML = `
            <td style="font-weight: bold;">${cliente.nome}</td>
            <td>${cliente.documento}</td>
            <td>${formataData(cliente.data_nascimento)}</td>
            <td>${cliente.telefone || '-'}</td>
            <td>${cliente.email || '-'}</td>
            <td>${cliente.endereco || '-'}</td>
            <td>${formataData(cliente.data_ultima_compra)}</td>
            <td>${cliente.veiculo_comprado || '-'}</td>
            
            <td><button onclick="prepararEdicao(${cliente.id}, '${cliente.nome}', '${cliente.documento}', '${cliente.data_nascimento || ''}', '${cliente.telefone || ''}', '${cliente.email || ''}', '${cliente.endereco || ''}', '${cliente.data_ultima_compra || ''}', '${cliente.veiculo_comprado || ''}')" style="background:#f59e0b; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">Editar</button></td>
            
            <td><button onclick="deletarCliente(${cliente.id})" style="background:#ef4444; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">Excluir</button></td>
        `;

        corpoTabela.appendChild(linha);
    });
}

// ==========================================
// 7. EXCLUIR CLIENTE
// ==========================================
async function deletarCliente(id) {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
        try {
            const resposta = await fetch(`http://localhost:3000/clientes/${id}`, { method: 'DELETE' });
            if (resposta.ok) {
                alert('🗑️ Cliente excluído!');
                carregarClientes();
            }
        } catch (erro) {
            console.error('Erro:', erro);
        }
    }
}

window.onload = carregarClientes;