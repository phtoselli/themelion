# CLAUDE.md — Themelion

## Project Overview

**Themelion** (do grego θεμέλιον, "alicerce" ou "fundação") é uma aplicação frontend que ensina conceitos fundamentais e atemporais de programação através de duas experiências: Modo Estudo (conteúdo direto ao ponto) e Modo Prática (desafios interativos com feedback). Roda 100% no navegador como SPA estática, hospedada no Cloudflare Pages em **themelion.dev**.

## Tech Stack

| Camada | Tecnologia | Motivo |
|---|---|---|
| Frontend | React + Vite + TypeScript | Leve, sem overhead de SSR desnecessário |
| Editor de código | Monaco Editor | Mesmo engine do VS Code, syntax highlight e autocomplete |
| Conteúdo | MDX | Markdown com componentes React interativos inline |
| Styling | CSS puro (custom properties + data attributes) | Sem dependências externas, design system via variáveis CSS |
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
├── data/                          # Dados centralizados: conteúdo, registry e linguagens
│   ├── content/                   # Auto-discovery: qualquer .mdx aqui é detectado automaticamente
│   │   ├── fundamentos/
│   │   │   ├── estruturas-de-dados/
│   │   │   │   ├── arrays/
│   │   │   │   │   ├── topic.mdx      # Conteúdo teórico (seções obrigatórias)
│   │   │   │   │   └── examples/      # Exemplos de código por linguagem
│   │   │   │   │       ├── python.py
│   │   │   │   │       ├── typescript.ts
│   │   │   │   │       ├── csharp.cs
│   │   │   │   │       ├── go.go
│   │   │   │   │       └── rust.rs
│   │   │   │   ├── linked-lists/
│   │   │   │   │   ├── topic.mdx
│   │   │   │   │   └── examples/
│   │   │   │   │       ├── python.py
│   │   │   │   │       └── typescript.ts   # Nem todo tópico precisa de todas as linguagens
│   │   │   │   └── ...
│   │   │   ├── algoritmos/
│   │   │   └── complexidade/
│   │   ├── frontend/
│   │   ├── backend/
│   │   ├── banco-de-dados/
│   │   ├── devops/
│   │   ├── engenharia-de-software/
│   │   └── avancados/
│   │
│   ├── languages/                 # Registro de linguagens suportadas (auto-discovery)
│   │   ├── python.json
│   │   ├── typescript.json
│   │   ├── csharp.json
│   │   ├── go.json
│   │   └── rust.json
│   │
│   └── registry/                  # Metadados: o que DEVE existir (planejado vs implementado)
│       ├── rooms/                 # 1 arquivo por sala de estudo
│       │   ├── fundamentos.yaml
│       │   ├── frontend.yaml
│       │   ├── backend.yaml
│       │   ├── banco-de-dados.yaml
│       │   ├── devops.yaml
│       │   ├── engenharia-de-software.yaml
│       │   └── avancados.yaml
│       └── roadmaps/              # 1 arquivo por trilha de carreira
│           ├── frontend-developer.yaml
│           ├── backend-developer.yaml
│           ├── fullstack-developer.yaml
│           └── devops-engineer.yaml
│
├── plugins/                       # Plugins Vite customizados
├── biome.json
├── package.json
└── CLAUDE.md
```

## Design Principles

### Princípio 1: Convention over Configuration (Auto-Discovery)

A aplicação é uma **casca dinâmica** que descobre conteúdo automaticamente pela estrutura de pastas e arquivos. Nunca deve existir um registro manual de tópicos, linguagens ou desafios.

**Para adicionar um novo tópico:** criar uma pasta em `data/content/` com `topic.mdx` + `examples/`. O sistema descobre sozinho.

**Para adicionar uma nova linguagem de programação:** criar um `.json` em `data/languages/`. O componente `<CodeTabs>` detecta automaticamente quais linguagens existem na pasta `examples/` do tópico e renderiza as tabs disponíveis.

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

A pasta `data/registry/` contém metadados YAML que mapeiam **todos** os tópicos planejados, suas categorias e trilhas de carreira (roadmaps). O registry é a fonte de verdade sobre o que DEVE existir — a pasta `data/content/` mostra o que DE FATO existe.

### Terminologia

| Conceito | Termo em código | Onde vive |
|---|---|---|
| Sala de estudo | Room | `data/registry/rooms/` |
| Subcategoria | Category | Dentro do room YAML |
| Tópico | Topic | Dentro da category |
| Trilha de carreira | Roadmap | `data/registry/roadmaps/` |
| Fase da trilha | Stage | Dentro do roadmap |
| Identificador | Slug | Único globalmente |

### Como o status é detectado

```
Topic no registry + pasta em data/content/ existe       → "implemented"
Topic no registry + pasta em data/content/ NÃO existe   → "planned"
Topic em data/content/ mas NÃO no registry              → "unregistered" (warning)
```

O path esperado é derivado do registry: `data/content/<room>/<category>/<slug>/topic.mdx`

### Workflow do autor de conteúdo

**Planejar um tópico** (1 linha em 1 arquivo):
→ Adicionar entry no room YAML → aparece como "Em breve" na UI

**Implementar um tópico** (criar pasta + arquivos, zero edição no registry):
→ Criar `data/content/<room>/<category>/<slug>/topic.mdx` + `examples/`
→ Status muda automaticamente de "planned" para "implemented"

**Adicionar a um roadmap** (1 linha em 1 arquivo):
→ Adicionar o slug no stage do roadmap YAML → aparece na trilha

### Schema: Room (`data/registry/rooms/<room>.yaml`)

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

### Schema: Roadmap (`data/registry/roadmaps/<career>.yaml`)

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
       ├── Scan data/languages/*.json → registra linguagens disponíveis
       ├── Scan data/registry/rooms/*.yaml → monta árvore de salas e tópicos
       ├── Scan data/registry/roadmaps/*.yaml → monta trilhas de carreira
       ├── Scan data/content/**/topic.mdx → detecta status (implemented vs planned)
       └── Scan data/content/**/examples/*.{ext} → associa exemplos ao tópico pela pasta pai
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

### Princípios Fundamentais

**1. Profundidade progressiva (Pyramid of Understanding)**

Estruture o conteúdo em camadas de profundidade crescente:

- **Camada 1 — Conceito核 (Core):** O que é + por que importa (1-2 parágrafos)
- **Camada 2 — Mecânica:** Como funciona internamente, com detalhes técnicos relevantes
- **Camada 3 — Prática:** Implementações reais, casos de uso, trade-offs
- **Camada 4 — Profundidade:** Detalhes de implementação, complexidade, edge cases

Cada camada aprofunda a anterior. Iniciantes param na camada 2-3, seniores leem tudo.

**2. Densidade de informação (Signal-to-Noise Ratio)**

- **SIM:** "Arrays em Python são dinâmicos. Internamente, usam overallocation (alocam mais memória que o necessário) para evitar realocações constantes. Quando a capacidade esgota, o interpretador aloca ~1.125x o tamanho atual."

- **NÃO:** "Arrays são estruturas de dados muito importantes na programação. Eles são usados em muitos lugares. Vamos aprender sobre arrays. Arrays podem guardar vários valores."

Cada frase deve adicionar informação nova. Se você consegue remover uma frase sem perder conteúdo, ela não deveria estar lá.

**3. Concretude sobre abstração**

- **SIM:** "Busca linear: O(n). Percorre elemento por elemento até encontrar. 1 milhão de elementos = até 1 milhão de comparações."

- **NÃO:** "A busca linear é um algoritmo que pode não ser muito eficiente dependendo do contexto."

Use números, exemplos concretos e implicações reais. Abstrações vêm depois dos exemplos, não antes.

**4. Mental Models > Definições**

Não comece com definições acadêmicas. Comece construindo um modelo mental:

- **SIM:** "Imagine um estacionamento com vagas numeradas (0, 1, 2...). Cada vaga guarda um carro. Array funciona assim: memória contígua onde cada posição tem um endereço fixo."

- **NÃO:** "Um array é uma estrutura de dados que armazena elementos do mesmo tipo em posições contíguas de memória, permitindo acesso aleatório em tempo constante."

Definições técnicas vêm depois, quando o leitor já tem uma imagem mental.

**5. Show, don't just tell**

Para cada afirmação técnica, mostre o que acontece:

```python
# ❌ "Inserir no meio é lento"
# ✅ Mostre POR QUE é lento:

lista = [1, 2, 3, 4, 5]
lista.insert(2, 99)  # Inserir 99 na posição 2

# O que Python faz internamente:
# 1. Verificar se há espaço (se não, realocar tudo)
# 2. Mover elementos [3, 4, 5] uma posição à direita
# 3. Colocar 99 na posição 2
# Resultado: O(n) operações para n elementos após o índice
```

**6. Contexto de uso real**

Todo conceito deve responder "quando vou usar isso?":

- **SIM:** "Hash tables são ideais quando você precisa de lookups rápidos por chave (ex: cache de usuários por ID, contagem de frequência de palavras, detecção de duplicatas)."

- **NÃO:** "Hash tables são estruturas de dados eficientes."

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
1. Criar `data/languages/cpp.json` com metadata.
2. Adicionar `examples/cpp.cpp` nos tópicos desejados.

O sistema detecta automaticamente. Nenhum código da aplicação precisa ser alterado.

**Regra:** nem todo tópico precisa de todas as linguagens. Só adicionar quando fizer sentido. O componente `<CodeTabs>` renderiza apenas as tabs para as quais existem arquivos.

### Regras de Escrita

**Estrutura do conteúdo:**

- **Não há limite de palavras.** Se um conceito precisa de 1000 palavras para ser explicado corretamente, use 1000 palavras. Se precisa de 200, use 200.

- **Teste de corte:** Para cada parágrafo, pergunte "se eu remover isso, o leitor perde informação essencial?" Se não, corte.

- **Seções obrigatórias** (mas expansíveis conforme necessário):
  - O que é + Por que importa (modelo mental inicial)
  - Como funciona (mecânica interna, detalhes técnicos)
  - Na prática (implementações, código executável, casos de uso)
  - Trade-offs (quando usar, quando não usar, alternativas)
  - Armadilhas (erros comuns, edge cases, gotchas)

**Profundidade técnica:**

- **Explique implementações reais:** "Arrays em Python (listas) são diferentes de arrays em C. Python usa ponteiros para objetos, C usa valores diretos. Isso significa que `arr[0]` em Python é um ponteiro, em C é o valor em si."

- **Mostre trade-offs com números:** "HashMap: O(1) lookup médio, O(n) pior caso (colisões). Array ordenado + busca binária: O(log n) garantido. Use HashMap quando lookups dominam, array quando range queries são comuns."

- **Cubra edge cases relevantes:** "Strings em Python são imutáveis. `s += 'x'` cria uma nova string. Em um loop de n iterações, isso é O(n²) porque cada concatenação copia tudo de novo."

**Código:**

- **Comentários técnicos, não óbvios:**
  ```python
  # ❌ Comentário óbvio
  x = x + 1  # incrementa x

  # ✅ Comentário que adiciona informação
  capacity *= 2  # Duplicar tamanho = amortizar custo de realocação para O(1) médio
  ```

- **Mostre performance real quando relevante:**
  ```python
  # Concatenação ingênua: O(n²)
  result = ""
  for word in words:
      result += word  # Cada += cria nova string e copia tudo

  # Correto: O(n)
  result = "".join(words)  # Aloca tamanho final de uma vez
  ```

**Linguagem:**

- **Tom conversacional mas preciso:** Escreva como se estivesse explicando para um colega desenvolvedor, não para uma criança nem para um comitê acadêmico.

- **Use termos técnicos corretos:** Não evite jargão, mas explique na primeira vez. "Acesso aleatório (random access) significa pular direto para qualquer posição em O(1), diferente de percorrer sequencialmente."

- **Seja direto:** "Não use linked list para acesso por índice. É O(n) porque precisa percorrer os nós. Use array." Não: "Linked lists podem não ser a melhor escolha em alguns cenários..."

**Progressão de dificuldade:**

Estruture assim:

1. **Introdução:** Modelo mental + exemplo concreto (acessível a todos)
2. **Mecânica:** Como funciona internamente (intermediário)
3. **Implementação:** Detalhes de linguagens específicas (intermediário-avançado)
4. **Edge cases e otimizações:** Armadilhas, complexidade amortizada, etc. (avançado)

Seniores leem tudo, iniciantes param onde precisam.

### Checklist de Qualidade

Antes de publicar um tópico, verifique:

- [ ] **Profundidade:** Um senior conseguiria usar isso como referência técnica?
- [ ] **Clareza:** Um iniciante consegue entender pelo menos as primeiras seções?
- [ ] **Concretude:** Todos os conceitos têm exemplos práticos com código executável?
- [ ] **Densidade:** Todas as frases adicionam informação nova?
- [ ] **Precisão:** Afirmações técnicas estão corretas? Números de complexidade estão certos?
- [ ] **Contexto:** Está claro quando/onde usar isso no mundo real?
- [ ] **Armadilhas:** Erros comuns e edge cases estão cobertos?

### Exemplos de Boa vs. Má Densidade

**❌ Conteúdo raso (baixa densidade):**
```
Arrays são estruturas de dados importantes. Eles podem guardar múltiplos valores.
São muito usados na programação. Vamos aprender sobre arrays.
```

**✅ Conteúdo denso (alta densidade):**
```
Arrays guardam elementos em memória contígua. Isso significa que se arr[0] está
no endereço 1000 e cada elemento ocupa 4 bytes, arr[1] está em 1004, arr[2] em 1008.
Essa contiguidade permite acesso O(1): índice × tamanho_do_tipo = offset exato.
```

**❌ Superficial:**
```
Inserir no meio de um array é lento. Evite fazer isso.
```

**✅ Profundo:**
```
Inserir no meio de um array é O(n): todos os elementos após o índice precisam ser
movidos. Em um array de 1 milhão de elementos, inserir na posição 0 move 1 milhão
de elementos. Se você precisa de inserções frequentes no meio, use uma estrutura
diferente (LinkedList para inserções O(1) se você já tem o nó, ou TreeSet para
manter ordenação com inserções O(log n)).
```

### Anti-patterns a Evitar

- **Prolixo:** Repetir a mesma ideia com palavras diferentes
- **Obviedades:** "Arrays são úteis", "É importante entender isso"
- **Definições sem contexto:** Jogar definição acadêmica sem explicar o que significa
- **Exemplos triviais:** Código que não demonstra o conceito técnico sendo discutido
- **Omitir complexidade:** Falar de algoritmos sem mencionar Big O
- **Generalizar sem dados:** "Geralmente é rápido" → Quanto? O(1)? O(log n)?

### Dicas Adicionais

- **Use diagramas para complexidade espacial/temporal:** Mostre visualmente o que acontece na memória, compare visualmente O(n) vs O(n²)

- **Inclua benchmarks quando relevante:**
  ```python
  # Mostrar diferença real de performance
  # Array de 100k elementos:
  # - Acesso por índice: 0.00001s
  # - Busca linear: 0.001s (100x mais lento)
  ```

- **Links para código de produção:** Exemplo: "Veja como Python implementa list.insert() no CPython: [link para GitHub]"

- **Problemas progressivos:**
  - Iniciante: "Encontre o maior elemento"
  - Intermediário: "Encontre o segundo maior sem ordenar"
  - Avançado: "Encontre os k maiores elementos em O(n log k)"

- **Seção "Aprofundamento" opcional:** Para tópicos complexos, adicione uma seção colapsável "Para curiosos" com detalhes de implementação em baixo nível, teoria dos algoritmos, papers, etc.

## Workflow de Criação de Conteúdo com Agentes Especializados

### Agentes Disponíveis

A plataforma Themelion usa **agentes especializados** para garantir qualidade técnica e didática consistente em três níveis:

1. **Agentes de Escrita:** Cada sala tem um agente especialista que domina profundamente os tópicos da sua área e escreve o conteúdo teórico.
2. **Agentes de Linguagem:** Cada linguagem de programação tem um agente expert que refina exemplos de código aplicando idioms e melhores práticas específicas.
3. **Agente Revisor:** Um único agente revisa todo o conteúdo (teórico + exemplos) quanto a qualidade técnica, didática e linguística.

**Agentes de Escrita** (um por sala):
- **Frontend:** `data/agents/writers/frontend.md`
- **Backend:** `data/agents/writers/backend.md`
- **Banco de Dados:** `data/agents/writers/banco-de-dados.md`
- **DevOps:** `data/agents/writers/devops.md`
- **Engenharia de Software:** `data/agents/writers/engenharia-de-software.md`
- **Fundamentos:** `data/agents/writers/fundamentos.md`
- **Avançados:** `data/agents/writers/avancados.md`

**Agentes de Linguagem** (um por linguagem suportada):
- **Python:** `data/agents/languages/python.md`
- **TypeScript:** `data/agents/languages/typescript.md`
- **C#:** `data/agents/languages/csharp.md`
- **Go:** `data/agents/languages/go.md`
- **Rust:** `data/agents/languages/rust.md`

**Agente Revisor** (único, para todas as salas):
- **Revisor:** `data/agents/reviewer.md`

### Processo de Criação de Conteúdo

**IMPORTANTE:** Sempre que for escrever ou revisar conteúdo técnico, você DEVE seguir este processo:

#### 1. Escrita (Agente Especialista)

Ao criar conteúdo para um tópico:

1. **Identifique a sala** do tópico (fundamentos, frontend, backend, etc.)
2. **Leia o agente correspondente** (`data/agents/writers/<sala>.md`)
3. **Incorpore a persona do agente:**
   - Você é um profissional sênior da área
   - Você domina todos os tópicos relacionados
   - Você tem habilidades excepcionais de didática
4. **Siga rigorosamente:**
   - Os princípios de escrita do `CLAUDE.md`
   - As diretrizes específicas do agente da sala
   - O workflow de criação definido no agente
   - O checklist de qualidade do agente

**Exemplo:**
```
Usuário: "Escreva o conteúdo sobre Flexbox"

Você:
1. Identificar sala: Frontend
2. Ler: data/agents/writers/frontend.md
3. Incorporar persona: Frontend Developer Sênior
4. Escrever conteúdo seguindo todas as diretrizes do agente
```

#### 2. Refinamento de Exemplos de Código (Agentes de Linguagem)

**IMPORTANTE:** Esta etapa é OPCIONAL e só deve ser executada para tópicos que contêm exemplos de código nas 5 linguagens principais.

Após a escrita do conteúdo teórico, se o tópico incluir exemplos de código em `examples/`, invoque os 5 agentes especialistas em linguagens para refinar os exemplos:

1. **Identifique se há exemplos de código** no tópico (pasta `examples/` existe)
2. **Se NÃO houver exemplos:** pule esta etapa e vá direto para a Revisão
3. **Se houver exemplos:** invoque os agentes de linguagem (podem ser em paralelo ou sequencial):

**Ordem de invocação:**
- `data/agents/languages/python.md`
- `data/agents/languages/typescript.md`
- `data/agents/languages/csharp.md`
- `data/agents/languages/go.md`
- `data/agents/languages/rust.md`

**Para cada agente:**
1. **Leia o agente correspondente** (`data/agents/languages/<linguagem>.md`)
2. **Incorpore a persona do agente:**
   - Você é um expert sênior na linguagem
   - Você conhece profundamente idioms, padrões e melhores práticas da linguagem
   - Você sabe quando e como aplicar recursos específicos da linguagem
3. **Revise/refine APENAS os exemplos da sua linguagem:**
   - Verifique correção técnica do código
   - Aplique idioms e padrões específicos da linguagem
   - Adicione comentários técnicos relevantes (em português)
   - Sugira melhorias de clareza e qualidade didática
   - **NÃO modifique exemplos de outras linguagens**
   - **NÃO modifique o conteúdo teórico (topic.mdx)**
4. **Cada agente tem sua própria execução** para revisar e aplicar mudanças
5. **Compile sugestões** e pergunte ao usuário se devem ser aplicadas

**Exemplo de invocação (em paralelo):**
```
Usuário: "Refine os exemplos de código do tópico Arrays"

Claude invoca 5 agentes em paralelo:

→ Agente Python (execução própria):
  [Lê data/agents/languages/python.md]
  [Revisa examples/python.py]
  [Sugere melhorias específicas de Python]

→ Agente TypeScript (execução própria):
  [Lê data/agents/languages/typescript.md]
  [Revisa examples/typescript.ts]
  [Sugere melhorias específicas de TypeScript]

→ Agente C# (execução própria):
  [Lê data/agents/languages/csharp.md]
  [Revisa examples/csharp.cs]
  [Sugere melhorias específicas de C#]

→ Agente Go (execução própria):
  [Lê data/agents/languages/go.md]
  [Revisa examples/go.go]
  [Sugere melhorias específicas de Go]

→ Agente Rust (execução própria):
  [Lê data/agents/languages/rust.md]
  [Revisa examples/rust.rs]
  [Sugere melhorias específicas de Rust]

Cada agente retorna suas sugestões independentemente.
```

**Importante:**
- Cada agente foca APENAS na sua linguagem
- Agentes podem ser invocados **em paralelo** para maior eficiência
- **Cada agente tem sua própria execução independente** para revisar o código da sua linguagem
- Esta etapa é **opcional**: só execute se houver exemplos de código
- Se um tópico não tem exemplo em uma linguagem específica (ex: não tem `rust.rs`), pule o agente dessa linguagem

#### 3. Revisão (Agente Revisor)

Após a escrita (e refinamento de exemplos, se aplicável), **SEMPRE** passe o conteúdo pelo agente revisor:

1. **Leia o agente revisor** (`data/agents/reviewer.md`)
2. **Incorpore a persona do revisor:**
   - Você é um Editor Técnico Sênior
   - Você identifica problemas e sugere melhorias
   - Você é consultivo, não reescreve
3. **Revise o conteúdo** seguindo o workflow do revisor:
   - Gramática e ortografia
   - Clareza e precisão técnica
   - Qualidade didática
   - Densidade de informação
   - Correção de código
   - Estrutura e organização
4. **Compile feedback** em categorias:
   - 🔴 **Crítico** (deve corrigir)
   - 🟡 **Importante** (recomendado corrigir)
   - 🟢 **Sugestão** (opcional)
5. **Apresente o feedback** de forma consultiva e pergunte ao usuário o que faz sentido mudar

**Importante:**
- O revisor **NÃO reescreve** o conteúdo
- O revisor **identifica problemas e sugere soluções**
- O **usuário decide** o que mudar
- Feedback deve ser **específico, construtivo e respeitoso**

#### 4. Iteração

Após o feedback do revisor:

1. **Discuta com o usuário** quais mudanças fazem sentido
2. **Aplique as correções** acordadas
3. **Revise novamente** se necessário (para mudanças grandes)

### Exemplo de Workflow Completo

```
1. Usuário: "Escreva conteúdo sobre Arrays"

2. Claude (Agente de Escrita - Fundamentos):
   [Lê data/agents/writers/fundamentos.md]
   [Escreve conteúdo teórico profundo sobre arrays]
   [Escreve exemplos iniciais em Python, TypeScript, C#, Go, Rust]
   [Entrega o conteúdo]

3. Claude (Refinamento de Exemplos - invocados em paralelo):

   → 5 agentes executam simultaneamente, cada um com sua própria execução:

   Agente Python (execução independente):
   [Lê data/agents/languages/python.md]
   [Revisa examples/python.py]
   [Retorna: usar list comprehension, adicionar type hints]

   Agente TypeScript (execução independente):
   [Lê data/agents/languages/typescript.md]
   [Revisa examples/typescript.ts]
   [Retorna: usar tipos genéricos, adicionar readonly]

   Agente C# (execução independente):
   [Lê data/agents/languages/csharp.md]
   [Revisa examples/csharp.cs]
   [Retorna: usar LINQ, aplicar padrões C# 12]

   Agente Go (execução independente):
   [Lê data/agents/languages/go.md]
   [Revisa examples/go.go]
   [Retorna: seguir convenções Go, simplificar error handling]

   Agente Rust (execução independente):
   [Lê data/agents/languages/rust.md]
   [Revisa examples/rust.rs]
   [Retorna: usar iterators, aplicar lifetimes corretos]

   Usuário revisa todas as sugestões e aprova as mudanças.

4. Claude (Agente Revisor):
   [Lê data/agents/reviewer.md]
   [Revisa o conteúdo teórico + exemplos refinados]
   [Compila feedback em Crítico/Importante/Sugestão]

   "Encontrei os seguintes pontos:

   🔴 Crítico:
   - topic.mdx linha 42: Erro factual sobre complexidade [...]

   🟡 Importante:
   - topic.mdx linha 15: Imprecisão técnica [...]
   - python.py linha 28: Comentário poderia ser mais claro [...]

   🟢 Sugestão:
   - topic.mdx linha 55: Poderia aprofundar em edge cases [...]

   O que você gostaria de mudar?"

5. Usuário: "Corrige o erro crítico e a linha 15"

6. Claude: [Aplica as correções solicitadas]
```

### Regras Importantes

- ✅ **SEMPRE use o agente especialista** ao escrever conteúdo teórico
- ✅ **Use os agentes de linguagem** para refinar exemplos de código (se houver)
- ✅ **Agentes de linguagem podem ser invocados em paralelo** para maior eficiência
- ✅ **Cada agente de linguagem tem sua própria execução independente**
- ✅ **SEMPRE use o agente revisor** após escrever e refinar
- ✅ **Leia os arquivos dos agentes** antes de começar (não assuma que você sabe o que está neles)
- ✅ **Siga rigorosamente** as diretrizes dos agentes
- ✅ **Seja consultivo** na revisão — não force mudanças
- ✅ **Cada agente de linguagem modifica APENAS sua própria linguagem**
- ❌ **Nunca pule** o processo de revisão
- ❌ **Nunca reescreva** sem feedback do revisor ou dos agentes de linguagem
- ❌ **Nunca assuma** que conhece as diretrizes sem ler os agentes

### Registro de linguagem (data/languages/*.json)

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
