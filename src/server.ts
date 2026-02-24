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