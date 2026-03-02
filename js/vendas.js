// ==========================================
// 1. MAPEANDO OS ELEMENTOS DA TELA
// ==========================================
const clienteSelect = document.getElementById('vendaClienteSelect'); // O novo select!
const cpfInput = document.getElementById('vendaCpf');
const btnValidar = document.getElementById('btnValidarCpf');
const nomeInput = document.getElementById('vendaNome');
const scoreBadge = document.getElementById('statusScore');

const carroSelect = document.getElementById('vendaCarro');
const valorCarroInput = document.getElementById('vendaValorCarro');

const formaPagamentoSelect = document.getElementById('vendaFormaPagamento');
const entradaInput = document.getElementById('vendaEntrada');
const parcelasSelect = document.getElementById('vendaParcelas');

// Elementos do Recibo (Lado Direito)
const resCliente = document.getElementById('resumoCliente');
const resCarro = document.getElementById('resumoCarro');
const resValorTabela = document.getElementById('resumoValorTabela');
const resCondicao = document.getElementById('resumoCondicao');
const resEntrada = document.getElementById('resumoEntrada');
const resFinanciado = document.getElementById('resumoFinanciado');
const resParcelasTxt = document.getElementById('resumoParcelasTxt');
const resTotal = document.getElementById('resumoTotal');
const btnConfirmar = document.getElementById('btnConfirmarVenda');

// Variáveis de Memória
let clienteSelecionado = null;
let carroSelecionado = null;
let listaCarros = [];
let listaClientes = []; // Guardará os clientes para acesso rápido
let valorTotalCalculado = 0;

// ==========================================
// 2. CARREGAR DADOS INICIAIS (Estoque e Clientes)
// ==========================================
async function carregarDadosIniciais() {
    try {
        // 1. Carrega os carros disponíveis
        const resCarros = await fetch('http://localhost:3000/carros/disponiveis');
        listaCarros = await resCarros.json();

        carroSelect.innerHTML = '<option value="">-- Selecione um veículo --</option>';
        listaCarros.forEach(carro => {
            const precoFormatado = Number(carro.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            carroSelect.innerHTML += `<option value="${carro.id}">${carro.marca} ${carro.modelo} (${carro.ano}) - ${precoFormatado}</option>`;
        });

        // 2. Carrega os clientes para a lista rápida
        const resClientes = await fetch('http://localhost:3000/clientes');
        listaClientes = await resClientes.json();

        clienteSelect.innerHTML = '<option value="">-- Selecione um cliente ou digite o CPF abaixo --</option>';
        listaClientes.forEach(cliente => {
            clienteSelect.innerHTML += `<option value="${cliente.id}">${cliente.nome} (CPF: ${cliente.documento})</option>`;
        });

    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
    }
}

window.onload = carregarDadosIniciais;

// ==========================================
// 3. SELEÇÃO RÁPIDA DE CLIENTE (Pelo Dropdown)
// ==========================================
clienteSelect.addEventListener('change', (evento) => {
    const idDoCliente = parseInt(evento.target.value);

    if (!idDoCliente) {
        // Se voltar para a opção vazia, limpa tudo
        cpfInput.value = "";
        nomeInput.value = "";
        clienteSelecionado = null;
        resCliente.textContent = "---";
        scoreBadge.textContent = "Aguardando...";
        scoreBadge.className = "badge";
        verificarLiberacaoVenda();
        return;
    }

    // Acha o cliente na memória e preenche os campos magicamente!
    const clienteEncontrado = listaClientes.find(c => c.id === idDoCliente);
    if (clienteEncontrado) {
        clienteSelecionado = clienteEncontrado;
        cpfInput.value = clienteEncontrado.documento; // Preenche o CPF para você
        nomeInput.value = clienteEncontrado.nome;
        resCliente.textContent = clienteEncontrado.nome;

        scoreBadge.textContent = "Aprovado ✅";
        scoreBadge.className = "badge sucesso";

        verificarLiberacaoVenda();
    }
});

// ==========================================
// 4. CONSULTA MANUAL DE CPF (Se o cliente não quiser se cadastrar ainda)
// ==========================================
btnValidar.addEventListener('click', async () => {
    const cpf = cpfInput.value.replace(/\D/g, '');

    if (cpf.length !== 11 && cpf.length !== 14) {
        alert('❌ Digite um CPF ou CNPJ válido com 11 ou 14 números.');
        return;
    }

    try {
        scoreBadge.textContent = "Consultando...";
        scoreBadge.className = "badge";

        const resposta = await fetch(`http://localhost:3000/clientes/cpf/${cpf}`);

        if (!resposta.ok) {
            // Se não achar, ainda permitimos simular, mas avisamos
            scoreBadge.textContent = "Não Cadastrado";
            scoreBadge.className = "badge erro";
            nomeInput.value = "Cliente Avulso (Simulação)";
            resCliente.textContent = "Cliente Avulso";
            clienteSelecionado = { id: null, nome: "Avulso" }; // Um cliente "falso" só pra simular matemática

            alert("Aviso: CPF não encontrado. Você pode simular valores, mas para CONFIRMAR a venda será necessário ir em Clientes e cadastrá-lo.");
            verificarLiberacaoVenda();
            return;
        }

        const cliente = await resposta.json();
        clienteSelecionado = cliente;

        nomeInput.value = cliente.nome;
        resCliente.textContent = cliente.nome;
        clienteSelect.value = cliente.id; // Atualiza o select lá em cima!

        scoreBadge.textContent = "Aprovado ✅";
        scoreBadge.className = "badge sucesso";

        verificarLiberacaoVenda();

    } catch (erro) {
        console.error("Erro ao buscar cliente:", erro);
    }
});

// ==========================================
// 5. SELECIONAR CARRO E ATUALIZAR RECIBO
// ==========================================
carroSelect.addEventListener('change', (evento) => {
    const idDoCarro = parseInt(evento.target.value);
    carroSelecionado = listaCarros.find(c => c.id === idDoCarro);

    if (carroSelecionado) {
        const precoF = Number(carroSelecionado.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        valorCarroInput.value = precoF;
        resCarro.textContent = `${carroSelecionado.marca} ${carroSelecionado.modelo}`;
        resValorTabela.textContent = precoF;
    } else {
        valorCarroInput.value = "";
        resCarro.textContent = "---";
        resValorTabela.textContent = "R$ 0,00";
    }

    calcularMatematica();
    verificarLiberacaoVenda();
});

// ==========================================
// 6. CÁLCULO FINANCEIRO EM TEMPO REAL
// ==========================================
function calcularMatematica() {
    if (!carroSelecionado) return;

    const precoDoCarro = Number(carroSelecionado.preco);
    const forma = formaPagamentoSelect.value;
    let entrada = Number(entradaInput.value) || 0;
    const parcelas = parseInt(parcelasSelect.value) || 12;

    if (forma === 'avista') {
        resCondicao.textContent = "À Vista";
        resEntrada.textContent = "R$ 0,00";
        resFinanciado.textContent = "R$ 0,00";
        resParcelasTxt.textContent = "---";

        valorTotalCalculado = precoDoCarro;
        resTotal.textContent = valorTotalCalculado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    } else {
        if (entrada >= precoDoCarro) {
            alert("A entrada não pode ser maior ou igual ao valor do carro!");
            entradaInput.value = precoDoCarro - 1000;
            entrada = precoDoCarro - 1000;
        }

        const valorFinanciado = precoDoCarro - entrada;
        const taxa = 0.015;
        const valorDaParcela = valorFinanciado * (taxa / (1 - Math.pow(1 + taxa, -parcelas)));

        valorTotalCalculado = entrada + (valorDaParcela * parcelas);

        resCondicao.textContent = "Financiamento";
        resEntrada.textContent = entrada.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        resFinanciado.textContent = valorFinanciado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        resParcelasTxt.textContent = `${parcelas}x de ${valorDaParcela.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
        resTotal.textContent = valorTotalCalculado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
}

formaPagamentoSelect.addEventListener('change', (e) => {
    if (e.target.value === 'avista') {
        entradaInput.disabled = true;
        parcelasSelect.disabled = true;
        entradaInput.value = "";
    } else {
        entradaInput.disabled = false;
        parcelasSelect.disabled = false;
    }
    calcularMatematica();
});

entradaInput.addEventListener('input', calcularMatematica);
parcelasSelect.addEventListener('change', calcularMatematica);

// ==========================================
// 7. FINALIZAR A VENDA (ATUALIZADO COM VENDEDOR)
// ==========================================
function verificarLiberacaoVenda() {
    if (clienteSelecionado && clienteSelecionado.id !== null && carroSelecionado) {
        btnConfirmar.style.display = "block";
    } else {
        btnConfirmar.style.display = "none";
    }
}

btnConfirmar.addEventListener('click', async () => {
    // 1. PEGA O VENDEDOR LOGADO (O crachá que criamos no login.js)
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (!usuarioLogado || !usuarioLogado.id) {
        alert("🚨 Sessão expirada ou usuário não identificado. Faça login novamente.");
        window.location.href = "login.html";
        return;
    }

    // 2. MONTA O PACOTE COM O vendedor_id
    const pacoteDeVenda = {
        cliente_id: clienteSelecionado.id,
        carro_id: carroSelecionado.id,
        valor_total: valorTotalCalculado,
        condicao_pagamento: formaPagamentoSelect.value,
        valor_entrada: Number(entradaInput.value) || 0,
        qtd_parcelas: formaPagamentoSelect.value === 'avista' ? 0 : parseInt(parcelasSelect.value),
        nome_carro: `${carroSelecionado.marca} ${carroSelecionado.modelo}`,
        vendedor_id: usuarioLogado.id // <-- ESSA É A CHAVE QUE ESTAVA FALTANDO!
    };

    try {
        const resposta = await fetch('http://localhost:3000/vendas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pacoteDeVenda)
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            alert(dados.mensagem);

            // 1. Força a tabela de histórico a puxar a nova venda do banco
            if (typeof carregarVendidos === 'function') {
                carregarVendidos();
            }

            // 2. Muda para a tela de Histórico magicamente
            const menuHistorico = document.querySelectorAll('.menu-item')[4];
            mudarTela('sec-historico', menuHistorico);

            // 3. Limpa os campos da venda para a próxima
            document.getElementById('vendaCpf').value = '';
            document.getElementById('vendaNome').value = '';
            document.getElementById('vendaEntrada').value = '';
            document.getElementById('resumoTotal').textContent = 'R$ 0,00';
            btnConfirmar.style.display = 'none';

        } else {
            alert('❌ Erro: ' + dados.mensagem);
        }

    } catch (erro) {
        console.error("Erro ao enviar venda:", erro);
        alert("Erro de comunicação com o servidor.");
    }
});