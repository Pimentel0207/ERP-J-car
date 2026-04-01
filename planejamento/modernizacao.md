# 🏗️ Planejamento: Migração e Segurança (OWASP)

Este documento descreve os próximos passos para a evolução do **J-Car ERP 2.0**, focando em modernização tecnológica e padrões de segurança de nível industrial.

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
| **A01: Controle de Acesso** | Implementação de JWT (JSON Web Tokens) e Roles (Admin/User). |
| **A02: Falhas Criptográficas** | Criptografia de senhas com `Bcrypt` (atualmente em texto puro). |
| **A03: Injeção** | Validação rigorosa de inputs com `Zod` e uso de queries parametrizadas. |
| **A04: Design Inseguro** | Implementação de logs de erro e monitoramento de atividades suspeitas. |
| **A05: Configuração Incorreta** | Uso de `Helmet.js` para proteger cabeçalhos HTTP. |

---

## Próximos Passos (Checklist)
- [ ] Criar a estrutura de pastas `back/` e `front/`.
- [ ] Setup do **Vite + React** na pasta `front/`.
- [ ] Iniciar o servidor **Python (FastAPI ou Flask)** na pasta `back/`.
- [ ] Migrar a lógica de segurança (OWASP) para o novo backend Python.
- [ ] Criar a primeira tela (Login) integrada com a API Python.
