// ==========================================
// 1. VERIFICAR ACESSO
// ==========================================
const usuarioString = localStorage.getItem('usuarioLogado');
if (!usuarioString) {
    window.location.href = "login.html";
}
const logado = JSON.parse(usuarioString);
const isAdmin = logado.email === 'joao@evoplan.com';

// ==========================================
// 2. CARREGAR DADOS DE COMISSÃO
// ==========================================
async function carregarComissoes() {
    try {
        const resposta = await fetch('http://localhost:3000/comissoes');
        let dados = await resposta.json();

        const corpo = document.getElementById('corpoTabelaComissoes');
        const resumoVendido = document.getElementById('resumoTotalVendido');
        const resumoComissao = document.getElementById('resumoComissao');
        const titulo = document.getElementById('tituloPagina');

        corpo.innerHTML = '';

        // Se NÃO for admin, filtra os dados para mostrar apenas os dele
        if (!isAdmin) {
            dados = dados.filter(d => d.vendedor_id === logado.id);
            titulo.textContent = "Minhas Comissões";
        } else {
            titulo.textContent = "Ranking Geral de Comissões (Admin)";
        }

        let somaVendido = 0;
        let somaComissao = 0;

        dados.forEach(item => {
            const linha = document.createElement('tr');

            const totalF = Number(item.total_vendido).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            const comissaoF = Number(item.comissao_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            somaVendido += Number(item.total_vendido);
            somaComissao += Number(item.comissao_total);

            linha.innerHTML = `
                <td style="font-weight: bold; color: #1f2937;">${item.vendedor}</td>
                <td style="text-align: center;">${item.qtd_vendas}</td>
                <td>${totalF}</td>
                <td style="color: #10b981; font-weight: bold;">${comissaoF}</td>
            `;
            corpo.appendChild(linha);
        });

        // Atualiza os cards de resumo
        resumoVendido.textContent = somaVendido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        resumoComissao.textContent = somaComissao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    } catch (erro) {
        console.error("Erro ao carregar comissões:", erro);
    }
}

window.onload = carregarComissoes;