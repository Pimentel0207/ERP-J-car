# 🚀 Cronograma de Execução: Fases e Prioridades

Este documento define a ordem de implementação para a modernização do **J-Car ERP 2.0**. O objetivo é garantir que as funcionalidades críticas (Segurança e Core) sejam entregues primeiro.

---

## 🎯 Prioridades de Implementação (Matriz de Valor)

1.  **P1 (Crítica)**: Autenticação Segura (JWT) e Cadastro de Usuários (LGPD/Segurança).
2.  **P2 (Alta)**: Gestão de Estoque (CRUD de Veículos) - o coração do negócio.
3.  **P3 (Média)**: CRM (Cadastro de Clientes) e Linkagem com Vendas.
4.  **P4 (Média)**: Registro de Vendas e Baixa Automática.
5.  **P5 (Visual)**: Dashboard, Gráficos e Relatórios de Comissões.

---

## 📅 Fases do Projeto

### Fase 1: Alicerce Técnico (Iniciação)
*Foco: Infraestrutura e Segurança*
- [ ] **Ambiente**: Criação das pastas `/front` e `/back` e configuração dos arquivos `.env.example`.
- [ ] **DevOps**: Setup do **Docker Compose** para gerenciar o PostgreSQL em container.
- [ ] **Backend**: Setup FastAPI + Conexão DB + Migrations + **Pytest** para automação de testes.
- [ ] **Frontend**: Setup `npm create vite@latest` + React + Tailwind + Estrutura de Rotas.
- [ ] **Segurança (OWASP)**: Implementação de Bcrypt (Hash) e JWT (Tokens).
- [ ] **Login**: Tela de login funcional integrada ao backend (Primeiro teste Pytest).
### Fase 2: Gestão de Ativos (Módulo Estoque)
*Foco: O Produto*
- [ ] **Banco**: Tabela `veiculos` finalizada no PostgreSQL (DBeaver).
- [ ] **Backend**: Endpoints de Listagem, Cadastro, Edição e Exclusão.
- [ ] **Frontend**: Tela de Inventário com filtros por status (Disponível/Vendido).
- [ ] **Upload**: Lógica inicial para fotos dos veículos.

### Fase 3: Relacionamento e Vendas (Módulo CRM/PDV)
*Foco: A Operação*
- [ ] **CRM**: CRUD de Clientes com histórico de compras.
- [ ] **PDV**: Fluxo de venda (Seleção de Carro + Cliente + Forma de Pagamento).
- [ ] **Business Logic**: Cálculo automático de 1% de comissão no backend.
- [ ] **Estoque**: Gatilho para mudar status do veículo para "Vendido".

### Fase 4: Dashboards e Refinamento
*Foco: Decisão e UX*
- [ ] **Dashboard**: Gráficos de vendas mensais (Chart.js ou Recharts).
- [ ] **Comissões**: Relatório para administradores darem baixa em pagamentos.
- [ ] **Polish**: Micro-animações, Modo Escuro/Claro e polimento de UI.

---

## 🛠️ Próximas Ações Imediatas
1.  Estruturação de Pastas e repositório.
2.  Criação do `docker-compose.yml` para rodar o PostgreSQL de imediato.
3.  Executar `npm create vite@latest front` e `python -m venv back/venv`.
