# TaskFlow

**TaskFlow** é uma aplicação front-end simples para gerenciamento de tarefas por usuário — construída com HTML, CSS e JavaScript puro. O projeto demonstra práticas sólidas de organização de código, uso de armazenamento local (`localStorage`), comunicação entre módulos e atenção à acessibilidade e responsividade.

---

## 🚀 Visão geral

- Aplicação single-page (páginas estáticas) para criar, editar, remover e marcar tarefas como concluídas.
- Cada usuário tem seu próprio conjunto de tarefas, armazenadas em chaves por usuário (ex.: `tasks:<id>` no `localStorage`).
- Módulos organizados por responsabilidade: `tasks`, `dashboard`, `profile`, `auth`, `logout`, `signin-signup`.

---

## 🧩 Recursos principais

- Autenticação local (signup/login) com armazenamento de `currentUser` no `localStorage`.
- Tarefas por usuário (criação, listagem, busca, edição, remoção, marcação como concluída).
- Dashboard com cards de resumo (pendentes/concluídas/projetos/atrasados) e barra de progresso.
- Perfil do usuário com estatísticas e visão geral de tarefas (pendentes, concluídas, projetos agrupados).
- Proteção de páginas: páginas restritas redirecionam para `signup.html` se não houver usuário autenticado.
- Logout robusto (botão no header) que remove `currentUser` e notifica outros módulos/abas.
- Migração automática de dados legados (`tasks` global → `tasks:<id>`).
- Acessibilidade e responsividade aplicadas (focos, outlines, ajustes para mobile).

---

## 🗂 Estrutura do projeto

- `index.html` — página inicial
- `pages/`
  - `signup.html`, `signin.html` — cadastro/login
  - `dashboard.html`, `list-tasks.html`, `create-tasks.html`, `profile.html`
- `js/` — scripts principais
  - `tasks.js` — CRUD de tarefas (por usuário)
  - `dashboard.js` — resumo e progresso
  - `profile.js` — render do perfil e visão de tarefas
  - `signin-signup.js` — fluxo de cadastro/login
  - `logout.js` — logout e delegação de eventos do header
  - `auth.js` — proteção de rotas
- `styles/` — arquivos CSS modularizados por página/componente

---

## 🔬 Modelo de dados (exemplos)

- `currentUser` (armazenado em `localStorage`):

```json
{ "username": "maria", "email": "maria@example.com" }
```

- `tasks:<id>` (array de tarefas do usuário):

```json
[
  {
    "id": "168...",
    "title": "Preparar relatório",
    "subtitle": "Projeto A",
    "urgency": "high",
    "completed": false,
    "createdAt": "2026-02-03T...",
    "updatedAt": "2026-02-03T..."
  }
]
```

> Observação: `id` do usuário é hoje derivado de `user.email`/`user.username`. Recomenda-se gerar um `user.id` único (ex.: `crypto.randomUUID()`) no signup para maior robustez e privacidade.

---

## 🧭 Como rodar / testar localmente

1. Abra a pasta do projeto no seu editor (VS Code recomendado).
2. Sirva o diretório estático (opcional):
   - `npx serve` ou `python -m http.server`
3. Acesse as páginas em `pages/`:
   - `pages/signup.html` — cadastro
   - `pages/signup.html` (login) e `pages/dashboard.html`, `pages/list-tasks.html`, `pages/create-tasks.html`, `pages/profile.html` para rotas protegidas
4. Use o DevTools → Application → Local Storage para inspecionar `currentUser` e `tasks:<id>`

---

## ✅ Boas práticas aplicadas

- Separação de responsabilidades entre scripts e arquivos de estilo.
- Delegação de eventos para performance e dinamismo seguro.
- Uso de fallback e checagens seguras ao acessar `localStorage` (evita crashes em parse).
- Migração de dados legados para não perder conteúdo do usuário.
- Acessibilidade: atributos ARIA, outlines de foco, botões semanticamente corretos.
- CSS responsivo para melhorar experiência em tablets e smartphones.
