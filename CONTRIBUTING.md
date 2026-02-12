# Contribuindo para o Themelion

Obrigado por considerar contribuir com o Themelion! Este documento explica como participar do projeto.

> **Status atual:** Estamos estruturando o processo de contribuição. Em breve abriremos as primeiras issues para novos contribuidores. Acompanhe o repositório para ser notificado.

---

## Tipos de Contribuição

O Themelion aceita dois tipos principais de contribuição:

### 1. Conteúdo Técnico

Escrever tópicos de estudo, exemplos de código e conteúdo educacional. Este é o tipo de contribuição mais impactante — cada tópico ajuda diretamente quem está aprendendo.

### 2. Código da Aplicação

Melhorias na plataforma, correções de bugs, novos componentes e funcionalidades.

---

## Antes de Começar

1. **Leia o `CLAUDE.md`** na raiz do projeto. Ele contém toda a documentação técnica, arquitetura, filosofia do conteúdo e diretrizes de escrita.
2. **Explore a aplicação** em [themelion.dev](https://themelion.dev) para entender a experiência do usuário.
3. **Verifique as issues abertas** para ver se alguém já está trabalhando no que você quer fazer.

---

## Setup Local

```bash
# Clone o repositório
git clone https://github.com/phtoselli/themelion.git
cd themelion

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

### Scripts úteis

```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build de produção
npm run lint       # Executar linter (Biome)
npm run format     # Formatar código (Biome)
```

---

## Contribuindo com Conteúdo

### Como criar um novo tópico

1. **Verifique o registry** — O tópico já está planejado? Veja em `data/registry/rooms/` qual sala e categoria ele pertence.
2. **Crie a pasta** em `data/content/<sala>/<categoria>/<slug>/`
3. **Escreva o `topic.mdx`** seguindo a estrutura obrigatória (6 seções):
   - O que é
   - Por que importa
   - Como funciona
   - Na prática
   - Quando usar (e quando não usar)
   - Erros comuns
4. **Adicione exemplos de código** em `examples/` (Python, TypeScript, C#, Go, Rust — não precisa de todas, só as que fizerem sentido)
5. O sistema descobre o tópico automaticamente. Nenhum código da aplicação precisa ser alterado.

### Diretrizes de conteúdo

- **Conteúdo em português (pt-BR)** — Toda a plataforma é em português
- **Código e variáveis em inglês** — Comentários do código em português
- **Conceitos atemporais** — Sem versões, sem frameworks como exemplo principal
- **Alta densidade** — Cada frase deve adicionar informação nova
- **Profundidade progressiva** — Iniciantes param onde precisam, seniores leem tudo

Leia a seção "Content Guidelines" do `CLAUDE.md` para as diretrizes completas.

### Frontmatter obrigatório

```yaml
---
title: "Nome do Tópico"
slug: "nome-do-topico"
room: "fundamentos"
category: "estruturas-de-dados"
difficulty: "beginner"    # beginner | intermediate | advanced
order: 1
prerequisites: []
tags: []
---
```

---

## Contribuindo com Código

### Convenções

- **TypeScript** — Todo código novo deve ser tipado
- **Biome** — Lint e formatação. Rode `npm run lint` antes de abrir PR
- **CSS puro** — Design system via custom properties, sem libs externas
- **Named exports** — Preferir sobre default exports
- **`const` sobre `let`** — Nunca usar `var`
- **Path alias** — Use `@client/*` para imports de `./src/*`

### Processo

1. **Abra uma issue** descrevendo o que você quer fazer (ou comente em uma existente)
2. **Crie uma branch** a partir de `main`: `seu-username/descricao-curta`
3. **Faça commits pequenos e focados** em uma única mudança
4. **Mensagens de commit em inglês**
5. **Abra um Pull Request** preenchendo o template

---

## Pull Requests

### Antes de abrir o PR

- [ ] Código compila sem erros (`npm run build`)
- [ ] Linter passa (`npm run lint`)
- [ ] Testou localmente no dev server
- [ ] Commits são pequenos e focados
- [ ] Branch está atualizada com `main`

### O que esperar

- Um maintainer vai revisar seu PR
- Pode haver pedidos de ajuste — isso é normal e faz parte do processo
- PRs de conteúdo passam por revisão técnica e didática

---

## Código de Conduta

Este projeto segue um [Código de Conduta](./CODE_OF_CONDUCT.md). Ao participar, você concorda em manter um ambiente respeitoso e colaborativo.

---

## Dúvidas?

Abra uma issue com a label `question` ou entre em contato via email: **contato@pedrotoselli.com**
