# CHANGES.md — Registro de decisões tomadas automaticamente

Este arquivo documenta decisões tomadas durante a criação em massa de conteúdo para a trilha **Fullstack Developer — Júnior**.

## Decisões

### 1. Slug mismatch no roadmap: `one-to-many` vs `one-to-many-relationships`
- **Problema:** O roadmap `fullstack-developer-junior.yaml` referencia o slug `one-to-many`, mas o registry `banco-de-dados.yaml` define o tópico como `one-to-many-relationships`.
- **Decisão:** Criei o conteúdo usando o slug do registry (`one-to-many-relationships`), que é a fonte de verdade para paths de conteúdo. O roadmap pode precisar ser atualizado para `one-to-many-relationships` para que o sistema resolva corretamente.
- **Ação necessária:** Verificar se o sistema resolve slugs de roadmap contra o registry ou contra os paths de conteúdo. Se for contra o registry, atualizar o roadmap.

### 2. Tópico `password-hashing` — Salt, Pepper e KDF em um só
- **Problema:** O roadmap menciona "Password Hashing: Salt, Pepper, KDF" como um tópico, mas o registry tem dois tópicos separados: `password-hashing` e `salt-e-pepper`.
- **Decisão:** Criei o conteúdo como `password-hashing` incluindo Salt, Pepper e KDF em um único tópico, já que o registry tem `password-hashing` como tópico principal. O tópico `salt-e-pepper` pode receber seu próprio conteúdo mais tarde se necessário.

### 3. Tópicos sem exemplos em 5 linguagens
- **Decisão:** Tópicos conceituais que não envolvem código de programação propriamente dito (ex: Git, CORS, Semantic HTML, DevOps, etc.) NÃO receberam exemplos nas 5 linguagens. Apenas tópicos que fazem sentido com código de programação multi-linguagem receberam a pasta `examples/`.
- **Tópicos COM exemplos (5 linguagens):** big-o-notation, hash-tables, tipos-de-dados-primitivos, tipos-compostos, scope, pure-functions, callbacks, asynchronous-programming, promises-futures, async-await, error-handling, pagination, unit-testing, integration-testing
- **Tópicos SEM exemplos multi-linguagem:** git-fundamentals, branching-strategies, pull-request-workflow, http-https, http-methods, http-status-codes, cors, cookies, local-storage, semantic-html, box-model, flexbox, positioning, media-queries, dom-manipulation, event-loop, event-delegation, rest, restful-principles, api-documentation, authentication-vs-authorization, session-based-auth, token-based-auth, password-hashing, acid-properties, primary-keys, foreign-keys, joins, one-to-many-relationships, orm-concepts, linting, debugging-sistematico, containers-vs-vms, environment-variables, deployment-strategies

### 4. Conteúdo do arrays já existia
- **Decisão:** Não reescrevi o conteúdo de `arrays` pois já estava implementado com qualidade.

### 5. Tópicos de Frontend (DOM, Event Loop, Event Delegation) com exemplos JavaScript/TypeScript
- **Decisão:** Estes tópicos são intrinsecamente ligados ao navegador. Em vez de exemplos nas 5 linguagens, incluí exemplos inline no MDX (JavaScript/TypeScript) já que são conceitos browser-specific.

### 6. Status de implementação — Todos os 49 topic.mdx concluídos
- **Decisão:** Todos os 49 tópicos da trilha Fullstack Developer — Júnior tiveram seus arquivos `topic.mdx` criados. Os exemplos de código nas 5 linguagens (`examples/`) ainda não foram implementados para os tópicos que precisam deles (listados no item 3).
- **Tópicos implementados por stage:**
  - Stage 1 (Fundamentos Essenciais): 7 novos + 1 pré-existente (arrays) = 8 total
  - Stage 2 (Git e Versionamento): 3 tópicos
  - Stage 3 (Como a Web Funciona): 6 tópicos
  - Stage 4 (Frontend Básico): 8 tópicos
  - Stage 5 (Backend Básico): 8 tópicos
  - Stage 6 (Autenticação Básica): 4 tópicos
  - Stage 7 (Banco de Dados): 6 tópicos
  - Stage 8 (Testes e Qualidade): 4 tópicos
  - Stage 9 (DevOps Essencial): 3 tópicos

### 7. Próximos passos pendentes
- Criar exemplos de código nas 5 linguagens (Python, TypeScript, C#, Go, Rust) para os ~14 tópicos que precisam deles
- Rodar agentes de linguagem para refinar exemplos
- Rodar agente revisor em todo o conteúdo

---
*Gerado automaticamente durante criação de conteúdo em massa.*
