// ==============================================================
// XML em TypeScript — DOMParser (Browser API nativa)
// ==============================================================

// --- Parsing de string XML ---

const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<biblioteca>
  <livro isbn="978-85-333-0227-3">
    <titulo>Dom Casmurro</titulo>
    <autor>Machado de Assis</autor>
    <ano>1899</ano>
  </livro>
  <livro isbn="978-85-359-0277-9">
    <titulo>Grande Sertão: Veredas</titulo>
    <autor>Guimarães Rosa</autor>
    <ano>1956</ano>
  </livro>
</biblioteca>`;

// DOMParser cria um Document XML navegável — mesma API do HTML DOM
const parser = new DOMParser();
const doc = parser.parseFromString(xmlString, "application/xml");

// Verificar erros de parsing — XML não tolera erros de sintaxe
const erroElement = doc.querySelector("parsererror");
if (erroElement) {
  throw new Error(`XML malformado: ${erroElement.textContent}`);
}

// --- Navegando pela árvore ---

interface Livro {
  isbn: string;
  titulo: string;
  autor: string;
  ano: number;
}

// querySelectorAll funciona igual ao HTML
const livroElements = doc.querySelectorAll("livro");
const livros: Livro[] = Array.from(livroElements).map((el) => ({
  isbn: el.getAttribute("isbn") ?? "",
  titulo: el.querySelector("titulo")?.textContent ?? "",
  autor: el.querySelector("autor")?.textContent ?? "",
  ano: Number(el.querySelector("ano")?.textContent ?? 0),
}));

console.log(livros);
// [{ isbn: "978-85-333-0227-3", titulo: "Dom Casmurro", ... }, ...]


// --- Criando XML com XMLSerializer ---

// No navegador, não existe API nativa para criar XML do zero facilmente
// A abordagem mais comum: criar via document.implementation.createDocument
const xmlDoc = document.implementation.createDocument(null, "catalogo", null);
const catalogo = xmlDoc.documentElement;
catalogo.setAttribute("versao", "1.0");

const produto = xmlDoc.createElement("produto");
produto.setAttribute("id", "1");

const nome = xmlDoc.createElement("nome");
nome.textContent = "Camiseta";

const preco = xmlDoc.createElement("preco");
preco.setAttribute("moeda", "BRL");
preco.textContent = "49.90";

produto.appendChild(nome);
produto.appendChild(preco);
catalogo.appendChild(produto);

// Serializar para string
const serializer = new XMLSerializer();
const xmlSaida = serializer.serializeToString(xmlDoc);
console.log(xmlSaida);
// <catalogo versao="1.0"><produto id="1"><nome>Camiseta</nome><preco moeda="BRL">49.90</preco></produto></catalogo>


// --- SVG como XML (caso de uso real no frontend) ---

// Criar elemento SVG programaticamente — precisa do namespace correto
const svgNS = "http://www.w3.org/2000/svg";

// createElement NÃO funciona para SVG — precisa de createElementNS
const svg = document.createElementNS(svgNS, "svg");
svg.setAttribute("width", "100");
svg.setAttribute("height", "100");
svg.setAttribute("viewBox", "0 0 100 100");

const circle = document.createElementNS(svgNS, "circle");
circle.setAttribute("cx", "50");
circle.setAttribute("cy", "50");
circle.setAttribute("r", "40");
circle.setAttribute("fill", "#3b82f6");

svg.appendChild(circle);
document.body.appendChild(svg);


// --- Fetch XML de uma API ---

async function fetchXML(url: string): Promise<Document> {
  const response = await fetch(url);
  const text = await response.text();
  const xmlDoc = new DOMParser().parseFromString(text, "application/xml");

  const erro = xmlDoc.querySelector("parsererror");
  if (erro) {
    throw new Error(`XML inválido da API: ${erro.textContent}`);
  }

  return xmlDoc;
}

// Exemplo: ler RSS feed
async function lerRSS(feedUrl: string): Promise<void> {
  const doc = await fetchXML(feedUrl);
  const items = doc.querySelectorAll("item");

  items.forEach((item) => {
    const titulo = item.querySelector("title")?.textContent;
    const link = item.querySelector("link")?.textContent;
    console.log(`${titulo}: ${link}`);
  });
}
