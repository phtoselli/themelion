# CLAUDE.md — Themelion

## Project Overview

**Themelion** (do grego θεμέλιον, "alicerce" ou "fundação") é uma aplicação frontend que ensina conceitos fundamentais e atemporais de programação através de duas experiências: Modo Estudo (conteúdo direto ao ponto) e Modo Prática (desafios interativos com feedback). Roda 100% no navegador como SPA estática, hospedada no Cloudflare Pages em **themelion.dev**.

## Tech Stack

| Camada | Tecnologia | Motivo |
|---|---|---|
| Frontend | React + Vite + TypeScript | Leve, sem overhead de SSR desnecessário |
| Editor de código | Monaco Editor | Mesmo engine do VS Code, syntax highlight e autocomplete |
| Conteúdo | MDX | Markdown com componentes React interativos inline |
| Styling | Tailwind CSS | Prototipagem rápida, design system consistente |
| Linter/Formatter | Biome | Rápido, substitui ESLint + Prettier |
| Persistência | localStorage | Zero config, progresso local do usuário |
| i18n | Custom (sem lib) | Arquivos de locale em `src/i18n/locales/` |

## Commands (Desenvolvimento)

Comandos para desenvolvimento local:

```bash
npm install              # Instalar dependências
npm run dev              # Subir servidor de desenvolvimento local (Vite)
npm run build            # Build de produção
npm run lint             # Biome lint
npm run format           # Biome format
```

**Nota:** A aplicação em produção está hospedada no Cloudflare Pages em **themelion.dev**. Deploy é automático via integração Git.

## Project Structure

```
themelion/
├── src/
│   ├── main.tsx                   # Entry point
│   ├── app/                       # Configuração da aplicação (App.tsx, providers, routes)
│   ├── shared/                    # Código compartilhado globalmente
│   │   ├── components/
│   │   │   └── ui/                # Primitivos (Button, Card, Sidebar...)
│   │   ├── types/                 # Tipos TypeScript
│   │   ├── utils/                 # Utilitários
│   │   │   ├── helpers/           # Helpers gerais (funções puras)
│   │   │   └── utils.ts           # Utilitários gerais (cn, etc.)
│   │   └── constants/             # Constantes da aplicação
│   ├── modules/                   # Módulos/features da aplicação
│   │   ├── study/                 # Módulo de estudo
│   │   │   └── components/        # Componentes do Modo Estudo
│   │   ├── practice/              # Módulo de prática
│   │   │   └── components/        # Componentes do Modo Prática
│   │   ├── roadmaps/              # Módulo de roadmaps
│   │   │   └── components/
│   │   ├── mdx/                   # Módulo MDX
│   │   │   └── components/        # Componentes MDX customizados
│   │   └── layout/                # Módulo de layout
│   │       └── components/        # Componentes de layout (Sidebar, Nav...)
│   ├── routes/                    # Páginas/rotas da aplicação
│   ├── lib/                       # Bibliotecas e configurações
│   │   └── progress.ts            # Progresso do usuário (localStorage)
│   ├── hooks/                     # React hooks customizados
│   ├── contexts/                  # React contexts
│   ├── i18n/                      # Internacionalização
│   │   ├── index.ts               # Config, tipos e exports
│   │   └── locales/               # Arquivos de tradução por idioma
│   │       ├── pt-BR.ts           # Português (Brasil) — idioma padrão
│   │       └── en.ts              # English — placeholder para futuro
│   ├── assets/                    # Assets estáticos
│   └── styles/                    # Estilos globais
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
├── languages/                     # Registro de linguagens suportadas (auto-discovery)
│   ├── python.json
│   ├── typescript.json
│   ├── csharp.json
│   ├── go.json
│   └── rust.json
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
├── plugins/                       # Plugins Vite customizados
├── biome.json
├── package.json
└── CLAUDE.md
```

## Design Principles

### Princípio 1: Convention over Configuration (Auto-Discovery)

A aplicação é uma **casca dinâmica** que descobre conteúdo automaticamente pela estrutura de pastas e arquivos. Nunca deve existir um registro manual de tópicos, linguagens ou desafios.

**Para adicionar um novo tópico:** criar uma pasta em `content/` com `topic.mdx` + `examples/`. O sistema descobre sozinho.

**Para adicionar uma nova linguagem de programação:** criar um `.json` em `languages/`. O componente `<CodeTabs>` detecta automaticamente quais linguagens existem na pasta `examples/` do tópico e renderiza as tabs disponíveis.

**Regra:** se você precisa editar código da aplicação para adicionar conteúdo, a arquitetura está errada.

### Princípio 2: Responsabilidade Única

Cada arquivo tem uma única responsabilidade. Cada pasta agrupa arquivos pela mesma responsabilidade.

```
lib/
├── progress.ts    # APENAS gerenciar progresso (localStorage)
shared/
├── constants/     # APENAS valores constantes
├── utils/
│   ├── helpers/   # Funções puras que não se encaixam nas categorias acima
│   └── utils.ts   # Utilitários gerais (cn, etc.)
```

**Regras:**
- Um arquivo nunca deve ter mais de uma responsabilidade.
- Se uma função não pertence claramente a nenhuma categoria existente, criar uma nova pasta — não enfiar no `helpers/`.
- Funções em `lib/` e `shared/utils/` devem ser puras (sem side effects, sem estado), exceto `progress.ts` que interage com localStorage.

### Princípio 3: Conteúdo atemporal

O conteúdo ensina **conceitos imutáveis**, não ferramentas que mudam.

**Teste de atemporalidade:** "Se toda ferramenta e framework mencionados aqui desaparecessem amanhã, esse conteúdo ainda seria útil?" Se não, reescrever.

**Regras:**
- Nunca referenciar versões (`ES2024`, `Python 3.12`, `Node 20`).
- Nunca usar APIs de frameworks como exemplo principal (nada de `useState`, `app.get()`, `@Controller`).
- Exemplos de código usam a linguagem como veículo, não como protagonista.
- Quando um conceito envolve ferramentas na prática, usar o componente `<SeeInPractice>` para direcionar à documentação oficial (sempre atualizada).

## Progresso do Usuário (localStorage)

O progresso do usuário é armazenado 100% no `localStorage` do navegador. Não existe backend ou banco de dados.

### Storage key

```
themelion:progress
```

### Estrutura do progresso

```typescript
interface TopicProgress {
  completed: boolean;
  completedAt: string | null;   // ISO 8601
  lastVisitedAt: string;        // ISO 8601
}

type ProgressMap = Record<string, TopicProgress>; // key = slug do tópico
```

### Funcionalidades implementadas (`src/lib/progress.ts`)

| Função | Descrição |
|---|---|
| `markTopicVisited(slug)` | Marca que o usuário visitou um tópico |
| `markTopicCompleted(slug)` | Marca um tópico como concluído |
| `getTopicProgress(slug)` | Retorna o progresso de um tópico específico |
| `getAllProgress()` | Retorna todo o progresso do usuário |
| `exportProgress()` | Gera e faz download de um arquivo `.json` com todo o progresso |
| `importProgress(file)` | Valida e importa progresso de um arquivo `.json` |

### Download do progresso

- O usuário pode fazer download do progresso via botão "Download do progresso" na sidebar (Configurações).
- Gera um arquivo `themelion-progresso-YYYY-MM-DD.json` com todo o `ProgressMap`.
- Útil para backup ou migração entre navegadores/máquinas.

### Upload do progresso

- O usuário pode fazer upload de um arquivo `.json` de progresso via botão "Upload do progresso" na sidebar.
- O arquivo é validado rigorosamente antes de ser importado:
  - Tamanho máximo: 1MB
  - Tipo: `application/json`
  - Cada key deve ser um slug válido (`/^[a-z0-9]+(?:-[a-z0-9]+)*$/`)
  - Keys perigosas (`__proto__`, `constructor`, `prototype`) são rejeitadas
  - Cada entry deve ter a estrutura `TopicProgress` correta
  - Máximo de 10.000 entries
- O upload **substitui** todo o progresso atual (não faz merge).

### Regras

- **Nunca** armazenar dados sensíveis no localStorage.
- **Sempre** validar dados importados antes de salvar.
- O progresso é armazenado localmente no navegador do usuário — se trocar de navegador ou dispositivo, precisa exportar/importar manualmente o arquivo `.json` de progresso.

## Internacionalização (i18n)

### Estrutura

```
src/i18n/
├── index.ts                # Config, tipos, exports
└── locales/
    ├── pt-BR.ts            # Português (Brasil) — idioma padrão
    └── en.ts               # English — placeholder para tradução futura
```

### Como funciona

- O idioma padrão é `pt-BR`.
- Todas as strings da UI devem ser definidas nos arquivos de locale em `src/i18n/locales/`.
- O tipo `Locale` é exportado de `pt-BR.ts` e serve como contrato: qualquer novo idioma deve implementar a mesma estrutura.
- `en.ts` importa o tipo `Locale` de `pt-BR.ts` e implementa todas as keys.

### Como adicionar um novo idioma

1. Criar `src/i18n/locales/<locale-code>.ts` (ex: `es.ts`, `fr.ts`).
2. Importar o tipo `Locale` de `pt-BR.ts`.
3. Exportar um objeto que satisfaça o tipo `Locale`.
4. Registrar o novo locale em `src/i18n/index.ts` (adicionar ao `locales` e `localeNames`).

### Organização das keys

As traduções são organizadas por contexto:

| Namespace | Descrição |
|---|---|
| `common` | Termos genéricos usados em múltiplos lugares |
| `nav` | Labels de navegação |
| `sidebar` | Textos da sidebar |
| `difficulty` | Labels de dificuldade |
| `status` | Labels de status de tópicos |
| `homePage` | Textos da página inicial |
| `roomsPage` | Textos da página de salas |
| `roomPage` | Textos da página de uma sala |
| `topicPage` | Textos da página de um tópico |
| `roadmapsPage` | Textos da página de roadmaps |
| `roadmapPage` | Textos da página de um roadmap |
| `progress` | Mensagens de erro de import/export |

### Regras

- **Nunca** deixar strings hardcoded em componentes. Toda string visível ao usuário deve estar nos arquivos de locale.
- Strings que são funções (com parâmetros dinâmicos) usam arrow functions: `(count: number) => \`...\``.
- O arquivo `pt-BR.ts` é a fonte de verdade para o tipo `Locale`. Qualquer nova key adicionada lá será cobrada em todos os outros idiomas pelo TypeScript.

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
- Path alias: `@client/*` → `./src/*`.

## Architecture

### SPA estática (React + Vite)

- Toda a aplicação roda no navegador como Single Page Application.
- Hospedada no Cloudflare Pages em **themelion.dev**.
- Conteúdo MDX é processado em build time pelo Vite e servido como módulos estáticos.
- Não existe backend, API ou banco de dados.
- Progresso do usuário é armazenado no `localStorage` do navegador do usuário.

### Auto-Discovery Pipeline (build time)

```
Vite Build / Dev Server
       │
       ├── Scan languages/*.json → registra linguagens disponíveis
       ├── Scan registry/rooms/*.yaml → monta árvore de salas e tópicos
       ├── Scan registry/roadmaps/*.yaml → monta trilhas de carreira
       ├── Scan content/**/topic.mdx → detecta status (implemented vs planned)
       └── Scan content/**/examples/*.{ext} → associa exemplos ao tópico pela pasta pai
       │
       ▼
   Virtual modules (importados pelo frontend via `virtual:content`)
```

### Fluxo de dados

```
Browser (React SPA)
    ├── Conteúdo: virtual modules gerados em build time
    ├── Progresso: localStorage (leitura/escrita)
    └── Backup: export/import de JSON via download/upload
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
2. Adicionar `examples/cpp.cpp` nos tópicos desejados.

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
| `monacoLanguage` | ID da linguagem no Monaco Editor (syntax highlight) |
| `label` | Descrição curta exibida no tooltip da tab |
| `icon` | Ícone da linguagem na UI |

## Git

- Commits pequenos e focados em uma única mudança.
- Mensagens de commit em inglês.
- Branch naming: `phtoselli/<feature-name>`.

## Distribution

A aplicação está hospedada no **Cloudflare Pages** e disponível publicamente em:

**https://themelion.dev**

### Deploy

- **Plataforma:** Cloudflare Pages
- **Deploy:** Automático via integração Git (main branch)
- **Build command:** `npm run build`
- **Output directory:** `dist/`
- **Domínio:** themelion.dev

O Cloudflare Pages detecta automaticamente pushes na branch principal e faz o build e deploy automaticamente. Não é necessário rodar comandos manuais de deploy.
