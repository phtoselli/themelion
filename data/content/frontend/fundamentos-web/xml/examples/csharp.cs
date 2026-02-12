// ==============================================================
// XML em C# — System.Xml.Linq (LINQ to XML)
// ==============================================================

using System.Xml.Linq;

// --- Parsing de string XML ---

var xmlString = """
<?xml version="1.0" encoding="UTF-8"?>
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
</biblioteca>
""";

// XDocument é a API moderna de XML em C# — fluente e integrada com LINQ
var doc = XDocument.Parse(xmlString);

// --- Navegando com LINQ ---

// LINQ permite queries expressivas sobre a árvore XML
var livros = doc.Descendants("livro").Select(livro => new
{
    Isbn = livro.Attribute("isbn")?.Value,
    Titulo = livro.Element("titulo")?.Value,
    Autor = livro.Element("autor")?.Value,
    // (int) faz cast automático — XElement implementa conversão explícita
    Ano = (int?)livro.Element("ano") ?? 0
});

foreach (var livro in livros)
{
    Console.WriteLine($"[{livro.Isbn}] {livro.Titulo} — {livro.Autor} ({livro.Ano})");
}

// Filtrar com LINQ — livros antes de 1900
var classicos = doc.Descendants("livro")
    .Where(l => (int?)l.Element("ano") < 1900)
    .Select(l => l.Element("titulo")?.Value);

Console.WriteLine($"Clássicos: {string.Join(", ", classicos)}");
// Clássicos: Dom Casmurro


// --- Criando XML programaticamente ---

// API funcional — a estrutura do código espelha a estrutura do XML
var catalogo = new XDocument(
    new XDeclaration("1.0", "utf-8", null),
    new XElement("catalogo",
        new XAttribute("versao", "1.0"),
        new XElement("produto",
            new XAttribute("id", 1),
            new XElement("nome", "Camiseta"),
            new XElement("preco",
                new XAttribute("moeda", "BRL"),
                49.90m  // decimal para precisão financeira
            )
        )
    )
);

Console.WriteLine(catalogo);
// <?xml version="1.0" encoding="utf-8"?>
// <catalogo versao="1.0">
//   <produto id="1">
//     <nome>Camiseta</nome>
//     <preco moeda="BRL">49.90</preco>
//   </produto>
// </catalogo>


// --- Modificando XML ---

var biblioteca = XDocument.Parse(xmlString);

// Adicionar elemento
var primeiroLivro = biblioteca.Descendants("livro").First();
primeiroLivro.Add(new XElement("editora", "Editora Garnier"));

// Remover elementos que satisfazem condição
biblioteca.Descendants("livro")
    .Where(l => (int?)l.Element("ano") < 1900)
    .Select(l => l.Element("ano"))
    .Remove(); // Remove todos os elementos <ano> de livros antes de 1900


// --- Namespaces ---

// Namespaces em C# usam XNamespace — operador + concatena namespace + nome local
XNamespace svg = "http://www.w3.org/2000/svg";

var svgDoc = new XElement(svg + "svg",
    new XAttribute("width", 100),
    new XAttribute("height", 100),
    new XElement(svg + "circle",
        new XAttribute("cx", 50),
        new XAttribute("cy", 50),
        new XAttribute("r", 40),
        new XAttribute("fill", "#3b82f6")
    )
);

Console.WriteLine(svgDoc);
// <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
//   <circle cx="50" cy="50" r="40" fill="#3b82f6" />
// </svg>


// --- Caracteres especiais ---

// LINQ to XML escapa automaticamente — nunca faça escape manual
var texto = new XElement("texto", "Condição: x < 10 && nome = \"João\"");
Console.WriteLine(texto);
// <texto>Condição: x &lt; 10 &amp;&amp; nome = "João"</texto>
