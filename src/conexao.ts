// Importando o "tradutor" para falar com o MySQL
import mysql from 'mysql2';

// Criando a conexão com o banco de dados da JCar
const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '24681379', // A sua senha correta já está aqui!
    database: 'jcarDB'
});

// Executando a conexão e testando
conexao.connect((erro) => {
    if (erro) {
        console.error('❌ Erro ao conectar com o banco de dados da JCar:', erro.message);
        return;
    }
    console.log('✅ Sucesso! Conectado ao banco de dados da JCar! 🚗💨');
});

// A MÁGICA ACONTECE AQUI 👇
// Estamos "exportando" a conexão para que o arquivo server.ts possa usá-la!
export default conexao;