// ==============================================================
// URL em TypeScript — URL API e URLSearchParams (Browser/Node)
// ==============================================================

// --- Parsing de URL ---

const url = new URL(
  "https://loja.com:8443/produtos/livros?categoria=ficção&ordem=preço&page=2#resultados"
);

// URL API decompõe automaticamente — cada propriedade é tipada
console.log(url.protocol);   // "https:"
console.log(url.hostname);   // "loja.com"
console.log(url.port);       // "8443"
console.log(url.pathname);   // "/produtos/livros"
console.log(url.search);     // "?categoria=fic%C3%A7%C3%A3o&ordem=pre%C3%A7o&page=2"
console.log(url.hash);       // "#resultados"
console.log(url.origin);     // "https://loja.com:8443"

// searchParams é um URLSearchParams — iterável e com métodos úteis
console.log(url.searchParams.get("categoria")); // "ficção" (decodificado!)
console.log(url.searchParams.get("page"));      // "2" (sempre string)
console.log(url.searchParams.has("ordem"));     // true


// --- Construção de URL ---

// Construir URL programaticamente — encoding é automático
const apiUrl = new URL("https://api.exemplo.com/v2/busca");

apiUrl.searchParams.set("q", "programação Python");   // Espaços e acentos codificados
apiUrl.searchParams.set("cidade", "São Paulo");
apiUrl.searchParams.set("page", "1");
apiUrl.hash = "resultados";

console.log(apiUrl.toString());
// "https://api.exemplo.com/v2/busca?q=programa%C3%A7%C3%A3o+Python&cidade=S%C3%A3o+Paulo&page=1#resultados"

// append para parâmetros repetidos (arrays)
const filtros = new URL("https://api.com/produtos");
filtros.searchParams.append("tag", "javascript");
filtros.searchParams.append("tag", "frontend");
filtros.searchParams.append("tag", "react");
console.log(filtros.search);
// "?tag=javascript&tag=frontend&tag=react"

// getAll retorna todos os valores de um parâmetro repetido
console.log(filtros.searchParams.getAll("tag"));
// ["javascript", "frontend", "react"]


// --- URLSearchParams independente ---

// Útil para manipular query strings sem URL completo
const params = new URLSearchParams(window.location.search);

// Iterar sobre todos os parâmetros
for (const [chave, valor] of params) {
  console.log(`${chave}: ${valor}`);
}

// Converter para objeto
const paramsObj = Object.fromEntries(params.entries());
console.log(paramsObj);
// { categoria: "ficção", ordem: "preço", page: "2" }

// Construir query string a partir de objeto
const novaQuery = new URLSearchParams({
  q: "café & chá",
  limit: "10",
});
console.log(novaQuery.toString());
// "q=caf%C3%A9+%26+ch%C3%A1&limit=10"


// --- Encoding e decoding ---

// encodeURIComponent — para valores individuais (codifica tudo que é especial)
const valor = "São Paulo & Rio";
console.log(encodeURIComponent(valor));
// "S%C3%A3o%20Paulo%20%26%20Rio"

// encodeURI — para URLs completos (preserva estrutura: /  ?  #  & =)
console.log(encodeURI("https://site.com/busca?q=olá mundo"));
// "https://site.com/busca?q=ol%C3%A1%20mundo"

// decodeURIComponent — reverso
console.log(decodeURIComponent("S%C3%A3o%20Paulo"));
// "São Paulo"

// REGRA: use encodeURIComponent para VALORES de parâmetros
// use encodeURI para URLs COMPLETOS (raro — prefira URL API)


// --- URLs relativos ---

// new URL com base resolve URLs relativos
const base = "https://meusite.com/blog/artigos/";

console.log(new URL("xml.html", base).href);
// "https://meusite.com/blog/artigos/xml.html"

console.log(new URL("../sobre.html", base).href);
// "https://meusite.com/blog/sobre.html"

console.log(new URL("/contato", base).href);
// "https://meusite.com/contato"


// --- Uso com Fetch API ---

async function buscarProdutos(filtros: Record<string, string>): Promise<void> {
  // Construir URL com parâmetros de forma segura
  const url = new URL("/api/produtos", window.location.origin);

  for (const [chave, valor] of Object.entries(filtros)) {
    url.searchParams.set(chave, valor);
  }

  // URL é aceito diretamente pelo fetch
  const response = await fetch(url);
  const dados = await response.json();
  console.log(dados);
}

// Uso — caracteres especiais são codificados automaticamente
buscarProdutos({ categoria: "café & chá", cidade: "São Paulo" });
