// ==========================================
// 1. VERIFICAR QUEM ESTÁ LOGADO
// ==========================================
const usuarioString = localStorage.getItem('usuarioLogado');
let isAdmin = false;

if (!usuarioString) {
    window.location.href = "login.html"; // Expulsa se não estiver logado
} else {
    const usuario = JSON.parse(usuarioString);
    // Verifica se é o dono (João)
    if (usuario.email === 'joao@evoplan.com') {
        isAdmin = true;
    }
}

// ==========================================
// 2. CARREGAR E RENDERIZAR AS VENDAS
// ==========================================
async function carregarVendidos() {
    try {
        const resposta = await fetch('http://localhost:3000/vendas');
        const vendas = await resposta.json();

        const cabecalho = document.getElementById('cabecalhoTabela');
        const corpoTabela = document.getElementById('corpoTabelaVendidos');

        corpoTabela.innerHTML = '';
        cabecalho.innerHTML = '';

        // DESENHA O CABEÇALHO DEPENDENDO DO ACESSO
        if (isAdmin) {
            cabecalho.innerHTML = `
                <tr>
                    <th style="border-top-left-radius: 8px;">Data</th>
                    <th>Veículo</th>
                    <th>Cliente</th>
                    <th>Condição</th>
                    <th>Valor Total</th>
                    <th style="border-top-right-radius: 8px; text-align: center;">Ação</th>
                </tr>
            `;
        } else {
            // Visão Básica (Para Vendedores Comuns)
            cabecalho.innerHTML = `
                <tr>
                    <th style="border-top-left-radius: 8px;">Data da Venda</th>
                    <th>Veículo Entregue</th>
                    <th style="border-top-right-radius: 8px;">Cliente Comprador</th>
                </tr>
            `;
        }

        // DESENHA AS LINHAS
        vendas.forEach(venda => {
            const linha = document.createElement('tr');

            // Formata Data
            const dataVenda = new Date(venda.data_venda).toLocaleDateString('pt-BR');
            // Formata Valor
            const valorTotalFormatado = Number(venda.valor_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            if (isAdmin) {
                // Linha Completa com Botão de Estorno (ADMIN)
                linha.innerHTML = `
                    <td style="font-weight: bold;">${dataVenda}</td>
                    <td>${venda.marca} ${venda.modelo} (${venda.ano})</td>
                    <td>${venda.cliente_nome}</td>
                    <td style="text-transform: capitalize;">${venda.condicao_pagamento}</td>
                    <td style="color: #10b981; font-weight: bold;">${valorTotalFormatado}</td>
                    <td style="text-align: center;">
                        <button onclick="estornarVenda(${venda.venda_id})" 
                                style="background:#ef4444; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; font-weight: bold;">
                            Estornar
                        </button>
                    </td>
                `;
            } else {
                // Linha Restrita (VENDEDOR COMUM)
                linha.innerHTML = `
                    <td style="font-weight: bold;">${dataVenda}</td>
                    <td>${venda.marca} ${venda.modelo} (${venda.ano})</td>
                    <td>${venda.cliente_nome}</td>
                `;
            }

            corpoTabela.appendChild(linha);
        });

    } catch (erro) {
        console.error('Erro ao carregar vendas:', erro);
    }
}

// ==========================================
// 3. FUNÇÃO PARA ESTORNAR VENDA
// ==========================================
async function estornarVenda(id) {
    if (confirm("⚠️ ATENÇÃO: Deseja cancelar esta venda? O carro voltará para o estoque disponível.")) {
        try {
            const res = await fetch(`http://localhost:3000/vendas/${id}`, { method: 'DELETE' });
            if (res.ok) {
                alert("Venda cancelada com sucesso! O veículo retornou ao estoque.");
                carregarVendidos(); // Recarrega a tabela na hora
            } else {
                alert("Erro ao estornar a venda.");
            }
        } catch (erro) {
            console.error("Erro:", erro);
            alert("Erro de comunicação com o servidor.");
        }
    }
}

window.onload = carregarVendidos;