# 🏗️ Planejamento: Migração e Segurança (OWASP)

Este documento descreve os objetivos de alto nível. Para especificações técnicas detalhadas (DB Schema, API, Segurança), acesse o [Plano Diretor](plano_diretor.md).

## 1. Migração para React + Vite
Atualmente, o projeto utiliza HTML/JS puro. A migração para React trará:
- **Componentização**: Interface mais fácil de manter e reutilizar.
- **Estado Global**: Melhor gerenciamento de dados entre telas (ex: Carrinho de Venda e Dashboard).
- **Performance**: Vite oferece um ambiente de desenvolvimento ultra-rápido.
- **Ecossistema**: Acesso a bibliotecas profissionais como `Lucide React` (ícones), `Shadcn/UI` (componentes) e `TanStack Query` (gerenciamento de API).

## 2. Nova Estrutura de Pastas (Padrão Profissional)
Para suportar o crescimento do sistema, adotaremos uma estrutura limpa de responsabilidades:

```text
/
├── back/                # Servidor Python (API Monolítica)
├── front/               # Aplicação React (Interface + Vite)
├── docs/                # Documentação técnica
├── planejamento/        # Roteiros e planos de ação
└── README.md
```

## 3. Implementação OWASP Top 10
Segurança não é opcional. Vamos focar nos seguintes pontos do OWASP:

| Risco OWASP | Ação de Mitigação |
| :--- | :--- |
| **A01: Controle de Acesso** | Implementação de OAuth2 no FastAPI com JWT. |
| **A02: Falhas Criptográficas** | Criptografia de senhas com `Bcrypt/Passlib`. |
| **A03: Injeção** | Uso obrigatório de Pydantic e SQLAlchemy (PostgreSQL). |
| **A04: Design Inseguro** | Middleware de Logging e Monitoramento no Backend. |
| **A05: Configurações** | Gerenciamento de envs e segurança de headers. |

---

### Próximos Passos (Estrutura)
Para o cronograma detalhado das entregas, acesse o nosso guia de [Fases e Prioridades](fases_prioridades.md).
