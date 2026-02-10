# CLAUDE.md — Themelion

## Project Overview

**Themelion** (do grego θεμέλιον, "alicerce" ou "fundação") é uma aplicação local que ensina conceitos fundamentais e atemporais de programação através de duas experiências: Modo Estudo (conteúdo direto ao ponto) e Modo Prática (desafios em containers Docker efêmeros com feedback de performance). Roda 100% na máquina do usuário via `npx themelion`.

## Tech Stack

| Camada | Tecnologia | Motivo |
|---|---|---|
| Frontend | React + Vite + TypeScript | Leve, sem overhead de SSR desnecessário para app local |
| Editor de código | Monaco Editor | Mesmo engine do VS Code, syntax highlight e autocomplete |
| Conteúdo | MDX | Markdown com componentes React interativos inline |
| Backend | Fastify + TypeScript | Rápido, type-safe, WebSocket nativo |
| Banco de dados | SQLite + Drizzle ORM | Zero config, perfeito para app local |
| Containers | Dockerode | SDK Node.js para gerenciar Docker programaticamente |
| Styling | Tailwind CSS | Prototipagem rápida, design system consistente |
| Linter/Formatter | Biome | Rápido, substitui ESLint + Prettier |
| Monorepo | npm workspaces | Simples, sem tooling extra |

## Commands

```bash
npm install              # Instalar dependências de todos os workspaces
npm run dev              # Subir frontend (Vite) + backend (Fastify) em paralelo
npm run build            # Build de produção
npm run lint             # Biome lint
npm run format           # Biome format
npm run db:generate      # Gerar tipos do Drizzle
npm run db:migrate       # Rodar migrations do SQLite
npm run db:studio        # Abrir Drizzle Studio
```

## Project Structure

```
themelion/
├── packages/
│   ├── client/                    # Frontend React + Vite
│   │   ├── src/
│   │   │   ├── shared/            # Código compartilhado globalmente
│   │   │   │   ├── components/    # Componentes UI reutilizáveis
│   │   │   │   │   └── ui/        # Primitivos (Button, Card, Modal...)
│   │   │   │   ├── types/         # Tipos TypeScript
│   │   │   │   ├── utils/         # Utilitários
│   │   │   │   │   ├── formatters/# Formatadores
│   │   │   │   │   │   ├── date.ts    # Formatação de datas
│   │   │   │   │   │   ├── text.ts    # Formatação de textos
│   │   │   │   │   │   ├── number.ts  # Formatação de números
│   │   │   │   │   │   └── index.ts   # Re-export centralizado
│   │   │   │   │   ├── helpers/   # Helpers gerais (funções puras)
│   │   │   │   │   └── utils.ts   # Utilitários gerais (cn, etc.)
│   │   │   │   └── constants/     # Constantes da aplicação
│   │   │   ├── modules/           # Módulos/features da aplicação
│   │   │   │   ├── study/         # Módulo de estudo
│   │   │   │   │   └── components/# Componentes do Modo Estudo
│   │   │   │   ├── practice/      # Módulo de prática
│   │   │   │   │   └── components/# Componentes do Modo Prática
│   │   │   │   ├── roadmaps/      # Módulo de roadmaps
│   │   │   │   │   └── components/
│   │   │   │   ├── mdx/           # Módulo MDX
│   │   │   │   │   └── components/# Componentes MDX customizados
│   │   │   │   └── layout/        # Módulo de layout
│   │   │   │       └── components/# Componentes de layout (Sidebar, Nav...)
│   │   │   ├── routes/            # Páginas/rotas da aplicação
│   │   │   ├── lib/               # Bibliotecas e configurações
│   │   │   │   ├── api/           # Cliente API
│   │   │   │   ├── validators/    # Validadores
│   │   │   │   └── parsers/       # Parsers
│   │   │   ├── hooks/             # React hooks customizados
│   │   │   ├── contexts/          # React contexts
│   │   │   ├── assets/            # Assets estáticos
│   │   │   ├── styles/            # Estilos globais
│   │   │   ├── app/               # Configuração da aplicação (App.tsx, providers, routes)
│   │   │   └── main.tsx           # Entry point
│   │   └── package.json
│   │
│   ├── server/                    # Backend Fastify
│   │   ├── src/
│   │   │   ├── routes/            # Rotas da API (1 arquivo por recurso)
│   │   │   ├── services/          # Lógica de negócio (1 service por domínio)
│   │   │   │   ├── docker/        # Gerenciamento de containers (Dockerode)
│   │   │   │   ├── content/       # Discovery + compilação de conteúdo
│   │   │   │   └── progress/      # Progresso e estatísticas
│   │   │   ├── lib/
│   │   │   │   ├── formatters/    # Mesma estrutura do client
│   │   │   │   ├── validators/
│   │   │   │   ├── parsers/
│   │   │   │   └── constants/
│   │   │   ├── db/                # SQLite + Drizzle schema e migrations
│   │   │   └── types/
│   │   └── package.json
│   │
│   └── shared/                    # Tipos e utilitários compartilhados
│       ├── src/
│       │   ├── types/             # Tipos usados por client e server
│       │   ├── constants/         # Constantes compartilhadas
│       │   └── helpers/           # Helpers puros compartilhados
│       └── package.json
│
├── content/                       # Auto-discovery: qualquer .mdx aqui é detectado automaticamente
│   ├── fundamentos/
│   │   ├── estruturas-de-dados/
│   │   │   ├── arrays/
│   │   │   │   ├── topic.mdx      # Conteúdo teórico (seções obrigatórias)
│   │   │   │   └── examples/      # Exemplos de código por linguagem
│   │   │   │       ├── python.py
│   │   │   │       ├── typescript.ts
│   │   │   │       ├── csharp.cs
│   │   │   │       ├── go.go
│   │   │   │       └── rust.rs
│   │   │   ├── linked-lists/
│   │   │   │   ├── topic.mdx
│   │   │   │   └── examples/
│   │   │   │       ├── python.py
│   │   │   │       └── typescript.ts   # Nem todo tópico precisa de todas as linguagens
│   │   │   └── ...
│   │   ├── algoritmos/
│   │   └── complexidade/
│   ├── frontend/
│   ├── backend/
│   ├── banco-de-dados/
│   ├── devops/
│   ├── engenharia-de-software/
│   └── avancados/
│
├── challenges/                    # Auto-discovery: qualquer .json aqui é detectado automaticamente
│   ├── fundamentos/
│   │   ├── arrays-busca-binaria.json
│   │   └── ...
│   └── ...
│
├── languages/                     # Registro de linguagens suportadas (auto-discovery)
│   ├── python.json                # { "id": "python", "name": "Python", "ext": ".py", "runner": "python-runner", "label": "Sintaxe simples, alto nível" }
│   ├── typescript.json
│   ├── csharp.json
│   ├── go.json
│   ├── rust.json
│   └── cpp.json                   # ← basta criar este arquivo para adicionar C++ ao sistema
│
├── docker/                        # Dockerfiles dos runners (auto-discovery por language.runner)
│   ├── python-runner/
│   │   └── Dockerfile
│   ├── typescript-runner/
│   │   └── Dockerfile
│   ├── csharp-runner/
│   │   └── Dockerfile
│   ├── go-runner/
│   │   └── Dockerfile
│   ├── rust-runner/
│   │   └── Dockerfile
│   └── cpp-runner/                # ← basta criar esta pasta para suportar C++
│       └── Dockerfile
│
├── registry/                      # Metadados: o que DEVE existir (planejado vs implementado)
│   ├── rooms/                     # 1 arquivo por sala de estudo
│   │   ├── fundamentos.yaml
│   │   ├── frontend.yaml
│   │   ├── backend.yaml
│   │   ├── banco-de-dados.yaml
│   │   ├── devops.yaml
│   │   ├── engenharia-de-software.yaml
│   │   └── avancados.yaml
│   └── roadmaps/                  # 1 arquivo por trilha de carreira
│       ├── frontend-developer.yaml
│       ├── backend-developer.yaml
│       ├── fullstack-developer.yaml
│       └── devops-engineer.yaml
│
├── biome.json
├── package.json                   # Root workspace
└── CLAUDE.md
```

## Design Principles

### Princípio 1: Convention over Configuration (Auto-Discovery)

A aplicação é uma **casca dinâmica** que descobre conteúdo automaticamente pela estrutura de pastas e arquivos. Nunca deve existir um registro manual de tópicos, linguagens ou desafios.

**Para adicionar um novo tópico:** criar uma pasta em `content/` com `topic.mdx` + `examples/`. O sistema descobre sozinho.

**Para adicionar uma nova linguagem:** criar um `.json` em `languages/` + um Dockerfile em `docker/`. O componente `<CodeTabs>` detecta automaticamente quais linguagens existem na pasta `examples/` do tópico e renderiza as tabs disponíveis.

**Para adicionar um novo desafio:** criar um `.json` em `challenges/`. O sistema categoriza pelo path da pasta.

**Regra:** se você precisa editar código da aplicação para adicionar conteúdo, a arquitetura está errada.

### Princípio 2: Responsabilidade Única

Cada arquivo tem uma única responsabilidade. Cada pasta agrupa arquivos pela mesma responsabilidade.

```
lib/
├── formatters/     # APENAS formatar dados para exibição
│   ├── date.ts     # Só formata datas
│   ├── text.ts     # Só formata textos (truncate, capitalize, slugify...)
│   ├── number.ts   # Só formata números (bytes, percentual, duração...)
│   └── index.ts    # Só re-exporta
├── validators/     # APENAS validar dados
├── parsers/        # APENAS transformar dados de um formato para outro
├── constants/      # APENAS valores constantes
└── helpers/        # Funções puras que não se encaixam nas categorias acima
```

**Regras:**
- Um arquivo nunca deve ter mais de uma responsabilidade.
- Se uma função não pertence claramente a nenhuma categoria existente, criar uma nova pasta — não enfiar no `helpers/`.
- Funções em `lib/` devem ser puras (sem side effects, sem estado).
- Services em `services/` são o único lugar que pode ter side effects (I/O, DB, Docker).

### Princípio 3: Conteúdo atemporal

O conteúdo ensina **conceitos imutáveis**, não ferramentas que mudam.

**Teste de atemporalidade:** "Se toda ferramenta e framework mencionados aqui desaparecessem amanhã, esse conteúdo ainda seria útil?" Se não, reescrever.

**Regras:**
- Nunca referenciar versões (`ES2024`, `Python 3.12`, `Node 20`).
- Nunca usar APIs de frameworks como exemplo principal (nada de `useState`, `app.get()`, `@Controller`).
- Exemplos de código usam a linguagem como veículo, não como protagonista.
- Quando um conceito envolve ferramentas na prática, usar o componente `<SeeInPractice>` para direcionar à documentação oficial (sempre atualizada).

## Registry (Planejamento de Conteúdo)

A pasta `registry/` contém metadados YAML que mapeiam **todos** os tópicos planejados, suas categorias e trilhas de carreira (roadmaps). O registry é a fonte de verdade sobre o que DEVE existir — a pasta `content/` mostra o que DE FATO existe.

### Terminologia

| Conceito | Termo em código | Onde vive |
|---|---|---|
| Sala de estudo | Room | `registry/rooms/` |
| Subcategoria | Category | Dentro do room YAML |
| Tópico | Topic | Dentro da category |
| Trilha de carreira | Roadmap | `registry/roadmaps/` |
| Fase da trilha | Stage | Dentro do roadmap |
| Identificador | Slug | Único globalmente |

### Como o status é detectado

```
Topic no registry + pasta em content/ existe       → "implemented"
Topic no registry + pasta em content/ NÃO existe   → "planned"
Topic em content/ mas NÃO no registry              → "unregistered" (warning)
```

O path esperado é derivado do registry: `content/<room>/<category>/<slug>/topic.mdx`

### Workflow do autor de conteúdo

**Planejar um tópico** (1 linha em 1 arquivo):
→ Adicionar entry no room YAML → aparece como "Em breve" na UI

**Implementar um tópico** (criar pasta + arquivos, zero edição no registry):
→ Criar `content/<room>/<category>/<slug>/topic.mdx` + `examples/`
→ Status muda automaticamente de "planned" para "implemented"

**Adicionar a um roadmap** (1 linha em 1 arquivo):
→ Adicionar o slug no stage do roadmap YAML → aparece na trilha

### Schema: Room (`registry/rooms/<room>.yaml`)

```yaml
room: fundamentos
name: "Fundamentos da Computação e Algoritmos"
description: "Aprenda as estruturas de dados (arrays, listas, árvores, grafos), algoritmos fundamentais (busca, ordenação, recursão, programação dinâmica) e conceitos essenciais de linguagens que todo desenvolvedor precisa dominar."
icon: "brain"
order: 1

categories:
  - slug: "estruturas-de-dados"
    name: "Estruturas de Dados"
    order: 1
    topics:
      - slug: "arrays"
        title: "Arrays e Strings"
        difficulty: beginner          # beginner | intermediate | advanced
        order: 1
        prerequisites: []            # slugs de outros tópicos
        tags: ["performance", "busca"]
```

### Schema: Roadmap (`registry/roadmaps/<career>.yaml`)

```yaml
roadmap: frontend-developer
name: "Frontend Developer"
description: "Caminho para se tornar um desenvolvedor frontend completo"
icon: "monitor"

stages:
  - slug: "fundamentos-essenciais"
    name: "Fundamentos Essenciais"
    description: "Base sólida antes de tocar em qualquer framework"
    order: 1
    topics:
      - "big-o-notation"             # referência por slug — o sistema resolve room/category
      - "arrays"
      - "hash-tables"
```

### Rooms existentes

| Room | Arquivo | Categorias |
|---|---|---|
| Fundamentos da Computação e Algoritmos | `fundamentos.yaml` | estruturas-de-dados, algoritmos, complexidade, paradigmas, conceitos-de-linguagens |
| Frontend | `frontend.yaml` | fundamentos-web, dom-e-browser-apis, css-fundamentals, performance-frontend, acessibilidade, arquitetura-frontend, design-systems |
| Backend | `backend.yaml` | protocolos-e-comunicacao, apis-e-web-services, autenticacao-e-autorizacao, arquitetura-backend, concorrencia-e-paralelismo, mensageria-e-filas, performance-backend |
| Banco de Dados | `banco-de-dados.yaml` | fundamentos-db, sql-e-bancos-relacionais, nosql, data-modeling, database-operations |
| DevOps | `devops.yaml` | containerizacao, ci-cd, cloud-e-infraestrutura, monitoramento-e-observabilidade, seguranca, networking |
| Engenharia de Software | `engenharia-de-software.yaml` | testes, versionamento-e-colaboracao, qualidade-de-codigo, metodologias-e-processos, soft-skills |
| Avançados | `avancados.yaml` | distributed-systems, data-engineering, machine-learning, web3-e-blockchain |

## Code Style

- Biome para lint e format. Rodar `npm run lint` antes de commitar.
- Código e nomes de variáveis em **inglês**.
- Comentários em **português (pt-BR)**.
- Preferir `const` sobre `let`. Nunca usar `var`.
- Preferir named exports sobre default exports.
- Path aliases: `@client/`, `@server/`, `@shared/`.

## Architecture

### Modo Estudo
- Conteúdo servido como MDX compilado pelo backend.
- Frontend renderiza MDX com componentes interativos (diagramas, snippets com syntax highlight, mini-quizzes).
- Progresso salvo no SQLite local.

### Modo Prática
1. Usuário entra num desafio → backend cria container Docker efêmero via Dockerode.
2. Código do usuário é injetado no container via volume mount temporário.
3. Container executa com resource limits (CPU, memória, timeout).
4. Backend captura stdout/stderr + métricas (tempo de execução, uso de memória) via Docker stats.
5. Compara resultado contra solução de referência e retorna feedback.
6. Container é destruído após o desafio (sempre limpo).
7. Output e métricas são transmitidos em tempo real via WebSocket.

### Fluxo de dados
```
Browser ←→ Fastify API (HTTP + WebSocket) ←→ Docker Engine
                  ↕
              SQLite (progresso, stats)
```

### Auto-Discovery Pipeline

```
Startup / File Change
       │
       ├── Scan languages/*.json → registra linguagens disponíveis
       ├── Scan content/**/topic.mdx → extrai frontmatter → monta árvore de tópicos
       ├── Scan content/**/examples/*.{ext} → associa exemplos ao tópico pela pasta pai
       └── Scan challenges/**/*.json → associa desafios às categorias pelo path
       │
       ▼
   In-memory index (servido via API)
```

## Content Guidelines — Filosofia do Conteúdo

**Regra de ouro:** o aluno deve sair sabendo FAZER, não apenas sabendo LER.

- **Sem enrolação.** Cada tópico deve ser curto, direto e prático. Poucos parágrafos, não dezenas.
- **Linguagem simples e dinâmica.** Escrever como se estivesse explicando para um colega, não escrevendo um paper acadêmico.
- **Foco no resultado.** O aluno precisa entender o que acontece na prática, não decorar definições.
- **Exemplos reais.** Todo conceito deve vir com código que o aluno pode rodar e ver funcionando.

### Frontmatter obrigatório (MDX)

Todo arquivo `topic.mdx` DEVE ter este frontmatter:

```yaml
---
title: "Nome do Tópico"
slug: "arrays"                              # Identificador único, usado em URLs e referências
room: "fundamentos"                         # Sala de estudo (fundamentos, frontend, backend, etc.)
category: "estruturas-de-dados"             # Subcategoria dentro da sala
difficulty: "beginner" | "intermediate" | "advanced"
order: 1                                    # Ordem de exibição dentro da categoria
prerequisites: ["big-o-notation"]           # Slugs dos tópicos que o aluno deve ler antes
tags: ["performance", "busca", "otimização"] # Tags para busca e filtragem
relatedTools:                               # Ferramentas que implementam este conceito (opcional)
  - { name: "Express", searchTerm: "middleware", url: "https://expressjs.com" }
  - { name: "Fastify", searchTerm: "hooks", url: "https://fastify.dev" }
---
```

O campo `prerequisites` é usado pelo sistema para:
- Sugerir ordem de estudo automática ao aluno.
- Renderizar links clicáveis tipo "Antes de começar, leia: Arrays, Big O Notation".
- Bloquear desafios do Modo Prática até que o conteúdo base seja concluído.

O campo `relatedTools` é renderizado pelo componente `<SeeInPractice>` no final do tópico, direcionando o aluno à documentação oficial para ver implementações reais e atualizadas.

### Estrutura obrigatória de cada tópico (6 seções)

```mdx
## O que é
<!-- 1-2 frases. Definição direta, sem rodeios. -->

## Por que importa
<!-- Que problema resolve + que resultado se obtém + por que o aluno deveria se importar. -->
<!-- Mostrar o "antes vs depois": sem isso acontece X, com isso acontece Y. -->

## Como funciona
<!-- O mecanismo por trás. Como a coisa opera por baixo dos panos. -->
<!-- Explicação curta, pode usar diagramas ou componentes visuais. -->

## Na prática
<!-- Componente <CodeTabs> com exemplos de código. -->
<!-- O sistema detecta automaticamente quais arquivos existem em examples/ e renderiza as tabs. -->
<!-- Cada arquivo em examples/ deve ter comentários em português explicando o código. -->

## Quando usar (e quando não usar)
<!-- Contextos certos + contextos errados. -->
<!-- Comparação com alternativas quando fizer sentido (ex: "use HashMap ao invés de Array quando..."). -->

## Erros comuns
<!-- Armadilhas e antipatterns que todo iniciante comete. -->
<!-- Formato direto: "Não faça X porque Y." -->
```

### Linguagens de exemplo

5 linguagens base, cada uma representando uma filosofia diferente:

| Linguagem | Filosofia | Arquivo |
|---|---|---|
| **Python** | Sintaxe simples, alto nível, tipagem dinâmica | `examples/python.py` |
| **TypeScript** | Tipagem estática, ecossistema web | `examples/typescript.ts` |
| **C#** | OOP clássica, tipagem forte, managed memory | `examples/csharp.cs` |
| **Go** | Simplicidade, concorrência nativa, sem herança | `examples/go.go` |
| **Rust** | Baixo nível, ownership, sem garbage collector | `examples/rust.rs` |

**Escalabilidade:** para adicionar uma nova linguagem (ex: C++), basta:
1. Criar `languages/cpp.json` com metadata.
2. Criar `docker/cpp-runner/Dockerfile`.
3. Adicionar `examples/cpp.cpp` nos tópicos desejados.

O sistema detecta automaticamente. Nenhum código da aplicação precisa ser alterado.

**Regra:** nem todo tópico precisa de todas as linguagens. Só adicionar quando fizer sentido. O componente `<CodeTabs>` renderiza apenas as tabs para as quais existem arquivos.

### Regras para escrever conteúdo
- Máximo ~300 palavras por seção. Se passou disso, está enrolando.
- Pelo menos 1 exemplo de código executável por tópico (seção "Na prática").
- Comentários no código em português.
- Se um conceito é simples, a explicação deve ser simples. Não inflar artificialmente.
- Usar componentes interativos do MDX quando agregar valor (diagramas, visualizações), não por enfeite.

### Registro de linguagem (languages/*.json)

Cada arquivo define uma linguagem suportada:

```json
{
  "id": "python",
  "name": "Python",
  "ext": ".py",
  "runner": "python-runner",
  "monacoLanguage": "python",
  "label": "Sintaxe simples, alto nível",
  "icon": "python"
}
```

| Campo | Descrição |
|---|---|
| `id` | Identificador único (deve ser o nome do arquivo sem extensão) |
| `name` | Nome de exibição na UI |
| `ext` | Extensão dos arquivos de exemplo |
| `runner` | Nome da pasta em `docker/` com o Dockerfile do runner |
| `monacoLanguage` | ID da linguagem no Monaco Editor (syntax highlight) |
| `label` | Descrição curta exibida no tooltip da tab |
| `icon` | Ícone da linguagem na UI |

## Database (SQLite)

- Schema gerenciado pelo Drizzle ORM.
- Arquivo `.db` fica na home do usuário: `~/.themelion/data.db`.
- Migrations automáticas no startup da aplicação.
- Armazena: progresso por tópico, histórico de desafios, métricas de performance, preferências.

## Docker

- Imagens base pré-configuradas por linguagem em `docker/`.
- Containers criados com limits: `--memory=256m --cpus=0.5 --network=none`.
- Timeout padrão de 30 segundos por execução.
- Cleanup automático: container removido após cada execução.
- Nunca dar acesso de rede aos containers de prática (segurança).

## Git

- Commits pequenos e focados em uma única mudança.
- Mensagens de commit em inglês.
- Branch naming: `phtoselli/<feature-name>`.

## Distribution

O app será distribuído como pacote npm executável:
```bash
npx themelion   # Sobe backend + serve frontend buildado
```
Pré-requisito: Docker instalado e rodando na máquina do usuário.
