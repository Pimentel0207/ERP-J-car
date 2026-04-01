# 🏛️ Plano Diretor: J-Car ERP 2.0 (Modernizado)

Este documento serve como a **Fonte da Verdade** para o desenvolvimento e modernização do sistema J-Car ERP. Ele descreve a arquitetura, segurança, modelagem de dados e o roteiro de execução.

---

## 1. Arquitetura do Sistema
O sistema será transicionado de um MVP monolítico rudimentar para uma arquitetura baseada em serviços modernos com separação clara de responsabilidades.

| Camada | Tecnologia | Papel |
| :--- | :--- | :--- |
| **Frontend** | **React 19 + Vite** | Interface reativa, rápida e componentizada com Tailwind CSS. |
| **Backend** | **Python 3.12+ (FastAPI)** | API RESTful de alta performance com documentação Swagger automática. |
| **Banco de Dados** | **PostgreSQL** | Persistência relacional robusta gerenciada via DBeaver. |
| **Segurança** | **OWASP Top 10** | Middlewares de segurança, JWT (OAuth2) e Bcrypt Hashing. |

---

## 2. Modelagem de Dados (ER)
Estrutura redefinida para o PostgreSQL visando integridade e escalabilidade.

### 2.1 Tabela `usuarios` (Gestão de Acessos)
*   `id`: UUID (Primary Key)
*   `nome`: VARCHAR(100)
*   `email`: VARCHAR(150) UNIQUE
*   `senha_hash`: TEXT (Armazenamento seguro com Salt)
*   `role`: ENUM('admin', 'vendedor')
*   `criado_em`: TIMESTAMP (Default NOW())

### 2.2 Tabela `estoque_veiculos`
*   `id`: SERIAL (PK)
*   `marca`: VARCHAR(50)
*   `modelo`: VARCHAR(50)
*   `ano`: INTEGER
*   `cor`: VARCHAR(30)
*   `preco`: DECIMAL(12, 2)
*   `status`: ENUM('disponivel', 'vendido', 'reservado')
*   `foto_url`: TEXT (Opcional)

### 2.3 Tabela `clientes`
*   `id`: SERIAL (PK)
*   `nome`: VARCHAR(100)
*   `documento`: VARCHAR(20) UNIQUE
*   `email`: VARCHAR(150)
*   `telefone`: VARCHAR(20)
*   `data_ultima_compra`: DATE (Nullable)

### 2.4 Tabela `vendas`
*   `id`: SERIAL (PK)
*   `carro_id`: FK (estoque_veiculos)
*   `cliente_id`: FK (clientes)
*   `vendedor_id`: FK (usuarios)
*   `valor_total`: DECIMAL(12, 2)
*   `valor_entrada`: DECIMAL(12, 2)
*   `comissao_valor`: DECIMAL(10, 2) (1% fixo calculado pelo Backend)
*   `status_comissao`: ENUM('pendente', 'pago')

---

## 3. Implementação de Segurança (OWASP Focus)
1.  **Controle de Acesso**: Rotas do backend protegidas por tokens JWT. Admin tem acesso exclusivo a comissões e exclusão de vendas.
2.  **Validação de Inputs**: Uso do **Pydantic** no FastAPI para garantir que nenhum dado malicioso chegue ao banco.
3.  **Segurança da Informação**: Cabeçalhos de segurança (CORS, HSTS, XSS Protection) configurados via Middleware.

---

## 4. Estrutura de Pastas Profissional
```text
/
├── back/                # FastAPI (Python)
│   ├── src/
│   │   ├── api/         # Rotas e Endpoints
│   │   ├── db/          # Conexão e Migrations
│   │   ├── models/      # Tabelas (SQLAlchemy/SQLModel)
│   │   ├── schemas/     # Validação Pydantic
│   │   └── security/    # JWT e Bcrypt
│   └── requirements.txt
├── front/               # React + Vite
│   ├── src/
│   │   ├── components/  # Componentes reutilizáveis
│   │   ├── pages/       # Telas do sistema
│   │   ├── services/    # Chamadas Axios à API
│   │   └── theme/       # Estilos globais
│   └── package.json
└── README.md
```

---

## 5. Cronograma de Execução (Roadmap)

### META 1: Alicerce (Semana 1)
- [ ] Criação do banco PostgreSQL no DBeaver.
- [ ] Inicialização do Backend (FastAPI + JWT).
- [ ] Inicialização do Frontend (React + Layout Base).

### META 2: Módulos Core (Semana 2)
- [ ] CRUD de Veículos e Clientes.
- [ ] Sistema de Login e Permissões.

### META 3: Inteligência de Negócio (Semana 3)
- [ ] Módulo de Vendas e Baixa de Estoque.
- [ ] Dashboard de Gráficos e Comissões.
