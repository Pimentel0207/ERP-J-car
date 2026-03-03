// js/vendidos.js
(() => {
    // ==========================================
    // 1. VERIFICAR QUEM ESTÁ LOGADO (ADMIN/VENDEDOR)
    // ==========================================
    const sessaoVendas = localStorage.getItem('usuarioLogado');
    let isAdmin = false;

    if (!sessaoVendas) {
        window.location.href = "login.html";
        return; // Interrompe a execução se não estiver logado
    } else {
        const usuarioVendas = JSON.parse(sessaoVendas);
        if (usuarioVendas.email === 'joao@evoplan.com') {
            isAdmin = true;
        }
    }

    // ==========================================
    // 2. MAPEANDO ELEMENTOS DA TELA
    // ==========================================
    const cabecalhoHistorico = document.getElementById('cabecalhoTabelaHistorico');
    const corpoTabelaHistorico = document.getElementById('tabelaHistoricoBody');
    const inputBuscaHistorico = document.getElementById('buscaHistorico');

    // Botões Toolbar
    const btnImprimirHistorico = document.getElementById('btnImprimirHistorico');
    const btnVisualizarHistorico = document.querySelector('#sec-historico button[title="Visualizar Detalhes"]');
    const btnEstornarToolbar = document.getElementById('btnEstornarVendaToolbar');
    const btnRecarregarHistorico = document.getElementById('btnRecarregarHistorico');
    const btnAbrirFiltrosHistorico = document.getElementById('btnAbrirFiltrosHistorico');

    // Elementos do Filtro
    const painelFiltrosHistorico = document.getElementById('painelFiltrosHistorico');
    const btnAplicarFiltroHistorico = document.getElementById('btnAplicarFiltroHistorico');
    const inputFiltroMes = document.getElementById('filtroHistoricoMes');
    const inputFiltroValor = document.getElementById('filtroHistoricoValor');

    let todasAsVendas = [];

    // ==========================================
    // 3. FUNÇÃO DE SELEÇÃO BLINDADA
    // ==========================================
    function obterIdVendaSelecionada() {
        const checkbox = corpoTabelaHistorico.querySelector('input[type="checkbox"]:checked');
        if (!checkbox) {
            alert("⚠️ Selecione uma venda no histórico primeiro.");
            return null;
        }
        return checkbox.value;
    }

    // ==========================================
    // 4. LÓGICA DA TOOLBAR (PROTEÇÃO CONTRA NULL)
    // ==========================================

    // --- BUSCA RÁPIDA (TEXTO) ---
    if (inputBuscaHistorico) {
        inputBuscaHistorico.addEventListener('input', (evento) => {
            const termo = evento.target.value.toLowerCase();
            const filtrados = todasAsVendas.filter(venda => {
                const clienteBate = venda.cliente_nome.toLowerCase().includes(termo);
                const veiculoBate = `${venda.marca} ${venda.modelo}`.toLowerCase().includes(termo);
                return clienteBate || veiculoBate;
            });
            renderizarTabelaHistorico(filtrados);
        });
    }

    // --- IMPRIMIR ---
    if (btnImprimirHistorico) {
        btnImprimirHistorico.addEventListener('click', () => {
            const mes = inputFiltroMes?.value || "Geral";
            const tituloOriginal = document.title;
            document.title = `Relatorio_Vendas_JCAR_${mes}`;
            window.print();
            document.title = tituloOriginal;
        });
    }

    // --- VISUALIZAR DETALHES ---
    if (btnVisualizarHistorico) {
        btnVisualizarHistorico.addEventListener('click', () => {
            const idVenda = obterIdVendaSelecionada();
            if (!idVenda) return;

            const venda = todasAsVendas.find(v => v.venda_id == idVenda);
            if (venda && typeof abrirVisualizacao === 'function') {
                const dadosDaVenda = {
                    id: venda.venda_id,
                    data: new Date(venda.data_venda).toLocaleString('pt-BR'),
                    vendedor: "Vendedor da Venda",
                    veiculo: `${venda.marca} ${venda.modelo} (${venda.ano})`,
                    valor: Number(venda.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
                    comissao: (Number(venda.valor_total) * 0.01).toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
                    obs: `Forma de Pgto: ${venda.condicao_pagamento.toUpperCase()} | Entrada: R$ ${Number(venda.valor_entrada).toLocaleString('pt-BR')}`
                };
                abrirVisualizacao('venda', dadosDaVenda);
            }
        });
    }

    // --- ESTORNAR (ADMIN ONLY) ---
    if (btnEstornarToolbar) {
        btnEstornarToolbar.addEventListener('click', async () => {
            if (!isAdmin) return alert("🔒 Acesso Negado: Apenas administradores podem estornar vendas.");
            const idVenda = obterIdVendaSelecionada();
            if (idVenda && confirm("⚠️ ATENÇÃO: Deseja cancelar esta venda? O carro voltará para o estoque disponível.")) {
                try {
                    const res = await fetch(`http://localhost:3000/vendas/${idVenda}`, { method: 'DELETE' });
                    if (res.ok) { alert("✅ Venda cancelada!"); carregarVendidos(); }
                } catch (erro) { console.error("Erro:", erro); }
            }
        });
    }

    // --- RECARREGAR ---
    if (btnRecarregarHistorico) {
        btnRecarregarHistorico.addEventListener('click', () => {
            if (inputBuscaHistorico) inputBuscaHistorico.value = '';
            carregarVendidos();
        });
    }

    // --- FILTROS AVANÇADOS (ABRIR MODAL) ---
    if (btnAbrirFiltrosHistorico) {
        btnAbrirFiltrosHistorico.addEventListener('click', () => {
            if (painelFiltrosHistorico) {
                painelFiltrosHistorico.style.display = painelFiltrosHistorico.style.display === 'none' ? 'flex' : 'none';
            }
        });
    }

    // --- APLICAR FILTRO ---
    if (btnAplicarFiltroHistorico) {
        btnAplicarFiltroHistorico.addEventListener('click', async () => {
            const mes = inputFiltroMes?.value;
            const valorMin = inputFiltroValor?.value;
            let url = `http://localhost:3000/vendas?mes=${mes}&valorMin=${valorMin}`;
            try {
                const res = await fetch(url);
                todasAsVendas = await res.json();
                renderizarTabelaHistorico(todasAsVendas);
            } catch (err) { console.error("Erro ao filtrar:", err); }
        });
    }

    // ==========================================
    // 5. CARREGAR E RENDERIZAR TABELA
    // ==========================================
    async function carregarVendidos() {
        try {
            const resposta = await fetch('http://localhost:3000/vendas');
            todasAsVendas = await resposta.json();

            // Monta o Cabeçalho Baseado no Perfil
            if (isAdmin) {
                cabecalhoHistorico.innerHTML = `
                    <tr>
                        <th class="col-checkbox" style="width: 30px;"><input type="checkbox" disabled></th>
                        <th>Data ↕</th>
                        <th>Veículo ↕</th>
                        <th>Cliente ↕</th>
                        <th>Condição ↕</th>
                        <th>Valor Total ↕</th>
                    </tr>
                `;
            } else {
                cabecalhoHistorico.innerHTML = `
                    <tr>
                        <th class="col-checkbox" style="width: 30px;"><input type="checkbox" disabled></th>
                        <th>Data ↕</th>
                        <th>Veículo ↕</th>
                        <th>Cliente ↕</th>
                    </tr>
                `;
                // Esconde botão para vendedores
                if (btnEstornarToolbar) btnEstornarToolbar.style.display = 'none';
            }

            renderizarTabelaHistorico(todasAsVendas);

        } catch (erro) {
            console.error('Erro ao carregar vendas:', erro);
        }
    }

    function renderizarTabelaHistorico(lista) {
        corpoTabelaHistorico.innerHTML = '';

        if (lista.length === 0) {
            const colunasSpan = isAdmin ? 6 : 4;
            corpoTabelaHistorico.innerHTML = `<tr><td colspan="${colunasSpan}" style="text-align: center; padding: 20px;">Nenhuma venda encontrada para o filtro.</td></tr>`;
            return;
        }

        lista.forEach(venda => {
            const linha = document.createElement('tr');

            // Corrige o timezone da data
            const dataObjeto = new Date(venda.data_venda);
            const dataVenda = new Date(dataObjeto.getTime() + Math.abs(dataObjeto.getTimezoneOffset() * 60000)).toLocaleDateString('pt-BR');

            if (isAdmin) {
                const valorTotalFormatado = Number(venda.valor_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                linha.innerHTML = `
                    <td class="col-checkbox"><input type="checkbox" class="check-venda" value="${venda.venda_id}"></td>
                    <td style="font-weight: 500;">${dataVenda}</td>
                    <td>${venda.marca} ${venda.modelo} (${venda.ano})</td>
                    <td>${venda.cliente_nome}</td>
                    <td style="text-transform: capitalize;">${venda.condicao_pagamento}</td>
                    <td style="color: #047857; font-weight: 600;">${valorTotalFormatado}</td>
                `;
            } else {
                linha.innerHTML = `
                    <td class="col-checkbox"><input type="checkbox" class="check-venda" value="${venda.venda_id}"></td>
                    <td style="font-weight: 500;">${dataVenda}</td>
                    <td>${venda.marca} ${venda.modelo} (${venda.ano})</td>
                    <td>${venda.cliente_nome}</td>
                `;
            }

            corpoTabelaHistorico.appendChild(linha);
        });
    }

    // Inicia a carga de dados ao abrir a tela
    carregarVendidos();
})();