// Importando o Express (nosso "garçom") e o Cors (segurança)
import express from 'express';
import cors from 'cors';

// Importando a conexão com o banco que VOCÊ criou no arquivo conexao.ts!
import conexao from './conexao';

const app = express();

// Configurando o servidor para entender JSON e permitir acesso do seu HTML
app.use(cors());
app.use(express.json());

// Definindo a porta onde o servidor vai funcionar
const PORTA = 3000;

// Ligando o servidor
app.listen(PORTA, () => {
    console.log(`🚀 Servidor da JCar rodando em http://localhost:${PORTA}`);
});

// ---------------------------------------------------------
// ROTAS DA APLICAÇÃO (A "cozinha" do nosso restaurante)
// ---------------------------------------------------------

// Rota para CADASTRAR um novo carro
app.post('/carros', (req, res) => {
    // 1. Pegamos os dados que o seu Front-end vai enviar
    const { marca, modelo, ano, preco, cor } = req.body;

    // 2. Montamos o comando SQL para inserir no banco de dados
    const comandoSql = 'INSERT INTO carros (marca, modelo, ano, preco, cor) VALUES (?, ?, ?, ?, ?)';

    // 3. Executamos o comando no MySQL
    conexao.query(comandoSql, [marca, modelo, ano, preco, cor], (erro, resultado) => {
        if (erro) {
            console.error('Erro ao cadastrar carro:', erro);
            // Se der erro, devolvemos o erro para a tela
            return res.status(500).json({ mensagem: 'Erro ao cadastrar o carro no banco de dados.' });
        }

        // Se der certo, avisamos que foi um sucesso!
        res.status(201).json({ mensagem: 'Carro da JCar cadastrado com sucesso! 🚗' });
    });
});
app.get('/carros', (req, res) => {
    const comandoSql = 'SELECT * FROM carros';

    conexao.query(comandoSql, (erro, resultados) => {
        if (erro) {
            console.error('Erro ao buscar os carros da JCar:', erro);
            return res.status(500).json({ mensagem: 'Erro ao buscar os carros no banco.' });
        }
        res.status(200).json(resultados);
    });
});
// ---------------------------------------------------------
// Rota para DELETAR um carro do banco de dados
// ---------------------------------------------------------
// O ":id" na URL é uma variável. Se o front-end mandar /carros/5, o ID será 5.
app.delete('/carros/:id', (req, res) => {
    // 1. Pegamos o número de identificação do carro que veio na URL
    const idDoCarro = req.params.id;

    // 2. Montamos o comando SQL para deletar
    const comandoSql = 'DELETE FROM carros WHERE id = ?';

    // 3. Executamos no banco de dados
    conexao.query(comandoSql, [idDoCarro], (erro, resultados) => {
        if (erro) {
            console.error('❌ Erro ao deletar o carro:', erro);
            return res.status(500).json({ mensagem: 'Erro ao deletar o carro no banco.' });
        }

        // Se deu certo, avisamos a tela!
        res.status(200).json({ mensagem: 'Carro excluído com sucesso!' });
    });
});

// ---------------------------------------------------------
// Rota para ATUALIZAR (Editar) um carro existente
// ---------------------------------------------------------
app.put('/carros/:id', (req, res) => {
    // 1. Pegamos o ID do carro na URL e os dados novos no corpo (body)
    const idDoCarro = req.params.id;
    const { marca, modelo, ano, preco, cor } = req.body;

    // 2. Montamos o comando SQL de atualização (UPDATE)
    const comandoSql = 'UPDATE carros SET marca = ?, modelo = ?, ano = ?, preco = ?, cor = ? WHERE id = ?';

    // 3. Executamos no banco de dados (Atenção à ordem das variáveis!)
    conexao.query(comandoSql, [marca, modelo, ano, preco, cor, idDoCarro], (erro, resultados) => {
        if (erro) {
            console.error('❌ Erro ao atualizar o carro:', erro);
            return res.status(500).json({ mensagem: 'Erro ao atualizar o carro no banco.' });
        }

        res.status(200).json({ mensagem: 'Carro atualizado com sucesso!' });
    });
});

// =========================================================
// ROTAS PARA CLIENTES (A nova "cozinha" para os clientes)
// =========================================================

// ---------------------------------------------------------
// Rota para BUSCAR todos os clientes (GET)
// ---------------------------------------------------------
app.get('/clientes', (req, res) => {
    const comandoSql = 'SELECT * FROM clientes';

    conexao.query(comandoSql, (erro, resultados) => {
        if (erro) {
            console.error('Erro ao buscar os clientes da JCar:', erro);
            return res.status(500).json({ mensagem: 'Erro ao buscar os clientes no banco.' });
        }
        res.status(200).json(resultados);
    });
});

// ---------------------------------------------------------
// Rota para CADASTRAR um novo cliente (POST)
// ---------------------------------------------------------
app.post('/clientes', (req, res) => {
    // 1. Pegamos os dados do front-end
    const { nome, documento, data_nascimento, telefone, email, endereco, data_ultima_compra, veiculo_comprado } = req.body;

    // Tratamento rápido: Se a data vier vazia do HTML (""), transformamos em 'null' para o MySQL não reclamar
    const nasc = data_nascimento ? data_nascimento : null;
    const ultimaCompra = data_ultima_compra ? data_ultima_compra : null;

    // 2. Montamos o comando SQL
    const comandoSql = `INSERT INTO clientes (nome, documento, data_nascimento, telefone, email, endereco, data_ultima_compra, veiculo_comprado) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    // 3. Executamos no banco
    conexao.query(comandoSql, [nome, documento, nasc, telefone, email, endereco, ultimaCompra, veiculo_comprado], (erro, resultado) => {
        if (erro) {
            console.error('Erro ao cadastrar cliente:', erro);
            return res.status(500).json({ mensagem: 'Erro ao cadastrar o cliente no banco de dados.' });
        }
        res.status(201).json({ mensagem: 'Cliente JCar cadastrado com sucesso! 👤' });
    });
});

// ---------------------------------------------------------
// Rota para ATUALIZAR (Editar) um cliente existente (PUT)
// ---------------------------------------------------------
app.put('/clientes/:id', (req, res) => {
    // 1. Pegamos o ID na URL e os dados no corpo (body)
    const idDoCliente = req.params.id;
    const { nome, documento, data_nascimento, telefone, email, endereco, data_ultima_compra, veiculo_comprado } = req.body;

    // Tratamento de datas vazias
    const nasc = data_nascimento ? data_nascimento : null;
    const ultimaCompra = data_ultima_compra ? data_ultima_compra : null;

    // 2. Montamos o comando SQL
    const comandoSql = `UPDATE clientes SET nome = ?, documento = ?, data_nascimento = ?, telefone = ?, email = ?, endereco = ?, data_ultima_compra = ?, veiculo_comprado = ? WHERE id = ?`;

    // 3. Executamos no banco
    conexao.query(comandoSql, [nome, documento, nasc, telefone, email, endereco, ultimaCompra, veiculo_comprado, idDoCliente], (erro, resultados) => {
        if (erro) {
            console.error('❌ Erro ao atualizar o cliente:', erro);
            return res.status(500).json({ mensagem: 'Erro ao atualizar o cliente no banco.' });
        }
        res.status(200).json({ mensagem: 'Cliente atualizado com sucesso!' });
    });
});

// ---------------------------------------------------------
// Rota para DELETAR um cliente do banco de dados (DELETE)
// ---------------------------------------------------------
app.delete('/clientes/:id', (req, res) => {
    // 1. Pegamos o ID na URL
    const idDoCliente = req.params.id;

    // 2. Comando SQL
    const comandoSql = 'DELETE FROM clientes WHERE id = ?';

    // 3. Executando no banco
    conexao.query(comandoSql, [idDoCliente], (erro, resultados) => {
        if (erro) {
            console.error('❌ Erro ao deletar o cliente:', erro);
            return res.status(500).json({ mensagem: 'Erro ao deletar o cliente no banco.' });
        }
        res.status(200).json({ mensagem: 'Cliente excluído com sucesso!' });
    });
});