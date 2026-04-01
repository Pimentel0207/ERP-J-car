# 🚗 J-Car ERP 2.0 | Sistema de Gestão Automotiva Full-Stack

![Logo J-Car](fotos/logo.png)

## 📖 Visão Geral
O **J-Car ERP 2.0** é uma solução completa para gestão de concessionárias e lojas de veículos. O sistema nasceu como um MVP (Minimum Viable Product) desenvolvido em "código cru" (Vanilla JS e Node.js básico) para validar as regras de negócio e evoluiu para uma ferramenta robusta que gerencia estoque, clientes, vendas e comissionamento.

> [!NOTE]
> **Estado Atual do Projeto:** O código presente na raiz (arquivos `.js` e pastas `HTML`/`CSS`) representa a base inicial funcional. Estamos agora iniciando uma fase de **refatoração profunda** para padrões profissionais de arquitetura e segurança.

---

## 🚀 Próxima Fronteira: Modernização e Segurança

Estamos migrando o sistema para uma arquitetura escalável e segura, focando em:

### ⚛️ Front-end (React + Vite)
- **Componentização Profissional:** Transição do DOM manual para componentes React.
- **Vite:** Build ultra-rápido e DX modernizada.

### 🐍 Back-end (Python + FastAPI)
- **API Monolítica:** Arquitetura sólida, moderna e de alto desempenho.
- **Segurança Nativa:** Proteção OWASP total via Pydantic e JWT.
- **Auto-Documentação:** Swagger automático (`/docs`) para fácil desenvolvimento.

### 🐘 Banco de Dados (PostgreSQL)
- **DBeaver:** Gestor oficial do banco de dados do sistema.
- **Relacional:** Maior robustez e integridade de dados para gestão automotiva.

---

## 📊 Funcionalidades Core (Em Refatoração)
- **Dashboard de BI:** Visão geral de faturamento e performance em tempo real.
- **PDV Inteligente:** Processamento de vendas com baixa automática de estoque.
- **CRM Completo:** Gestão de clientes e histórico de compras.
- **Financeiro:** Cálculo automático de comissões e gestão de metas.

### 📂 Estrutura de Pastas (Front & Back)
O projeto será dividido de forma clara para separar responsabilidades:
```text
/
├── back/                # FastAPI (Python 3.10+)
├── front/               # React + Vite
├── docs/                # Documentação técnica
├── planejamento/        # Roteiros de migração e arquitetura
└── README.md
```
---

## 🛠️ Stack Tecnológica Atual (Legado)
- **Front-end:** Vanilla JS, HTML5, CSS3, Chart.js.
- **Back-end:** Node.js, Express.js.
- **DB:** MySQL.

---

## 📑 Planejamento Detalhado
Para uma visão completa da arquitetura (ER Model, FastAPI, React e Segurança), consulte o nosso [Plano Diretor](planejamento/plano_diretor.md).

---
*Desenvolvido por João - Focando em qualidade, segurança e performance.*
