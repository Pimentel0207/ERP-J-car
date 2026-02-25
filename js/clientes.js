// ==========================================
// 1. VARIÁVEIS E MEMÓRIA
// ==========================================
const modal = document.getElementById('modalCadastro');
const btnAbrir = document.getElementById('btnAbrirModal');
const btnFechar = document.getElementById('btnFecharModal');
const form = document.getElementById('formCadastrarCliente');

let idClienteSendoEditado = null;

// ==========================================
// 2. MODAL (Abrir e Fechar)
// ==========================================
btnAbrir.onclick = () => {
    idClienteSendoEditado = null;
    form.reset();
    modal.style.display = "flex";
};

btnFechar.onclick = () => {
    modal.style.display = "none";
};

// ==========================================
// 3. PREPARAR EDIÇÃO
// ==========================================
function prepararEdicao(id, nome, documento, data_nascimento, telefone, email, endereco, data_ultima_compra, veiculo_comprado) {
    idClienteSendoEditado = id;

    document.getElementById('cadNome').value = nome;
    document.getElementById('cadDoc').value = documento;
    // O banco devolve a data num formato ISO longo. Precisamos pegar só a parte "YYYY-MM-DD" pro input type="date"
    document.getElementById('cadNascimento').value = data_nascimento ? data_nascimento.split('T')[0] : '';
    document.getElementById('cadTelefone').value = telefone || '';
    document.getElementById('cadEmail').value = email || '';
    document.getElementById('cadEndereco').value = endereco || '';
    document.getElementById('cadUltimaCompra').value = data_ultima_compra ? data_ultima_compra.split('T')[0] : '';
    document.getElementById('cadVeiculo').value = veiculo_comprado || '';

    modal.style.display = "flex";
}

// ==========================================
// 4. SALVAR NO BANCO (POST ou PUT)
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
// 5. CARREGAR CLIENTES (GET)
// ==========================================
async function carregarClientes() {
    try {
        const resposta = await fetch('http://localhost:3000/clientes');
        const clientesDoBanco = await resposta.json();

        const corpoTabela = document.getElementById('corpoTabelaClientes');
        corpoTabela.innerHTML = '';

        clientesDoBanco.forEach(cliente => {
            const linha = document.createElement('tr');

            // Formatando datas para o formato brasileiro (DD/MM/YYYY)
            const formataData = (dataSql) => {
                if (!dataSql) return '—';
                const dataObj = new Date(dataSql);
                // Ajuste de fuso horário simples
                dataObj.setMinutes(dataObj.getMinutes() + dataObj.getTimezoneOffset());
                return dataObj.toLocaleDateString('pt-BR');
            };

            const dataNasc = formataData(cliente.data_nascimento);
            const dataCompra = formataData(cliente.data_ultima_compra);

            linha.innerHTML = `
                <td style="font-weight: bold;">${cliente.nome}</td>
                <td>${cliente.documento}</td>
                <td>${dataNasc}</td>
                <td>${cliente.telefone || '-'}</td>
                <td>${cliente.email || '-'}</td>
                <td>${cliente.endereco || '-'}</td>
                <td>${dataCompra}</td>
                <td>${cliente.veiculo_comprado || '-'}</td>
                
                <td><button onclick="prepararEdicao(${cliente.id}, '${cliente.nome}', '${cliente.documento}', '${cliente.data_nascimento || ''}', '${cliente.telefone || ''}', '${cliente.email || ''}', '${cliente.endereco || ''}', '${cliente.data_ultima_compra || ''}', '${cliente.veiculo_comprado || ''}')" style="background:#f59e0b; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">Editar</button></td>
                
                <td><button onclick="deletarCliente(${cliente.id})" style="background:#ef4444; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">Excluir</button></td>
            `;

            corpoTabela.appendChild(linha);
        });

    } catch (erro) {
        console.error('Erro ao carregar os clientes:', erro);
    }
}

// ==========================================
// 6. EXCLUIR CLIENTE (DELETE)
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

// Carrega os clientes ao abrir a página
window.onload = carregarClientes;