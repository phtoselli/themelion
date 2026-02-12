// ==============================================================
// URL em C# — System.Uri e HttpUtility
// ==============================================================

using System.Web;

// --- Parsing de URL ---

var url = new Uri("https://loja.com:8443/produtos/livros?categoria=ficção&ordem=preço&page=2#resultados");

// Uri decompõe automaticamente — propriedades tipadas
Console.WriteLine(url.Scheme);      // "https"
Console.WriteLine(url.Host);        // "loja.com"
Console.WriteLine(url.Port);        // 8443
Console.WriteLine(url.AbsolutePath); // "/produtos/livros"
Console.WriteLine(url.Query);       // "?categoria=fic%C3%A7%C3%A3o&ordem=pre%C3%A7o&page=2"
Console.WriteLine(url.Fragment);    // "#resultados"

// HttpUtility.ParseQueryString transforma query em NameValueCollection
var queryParams = HttpUtility.ParseQueryString(url.Query);
Console.WriteLine(queryParams["categoria"]); // "ficção" (decodificado)
Console.WriteLine(queryParams["page"]);      // "2"


// --- Construção de URL com UriBuilder ---

// UriBuilder é a forma segura de montar URLs — evita concatenação manual
var builder = new UriBuilder("https", "api.exemplo.com", 443, "/v2/busca");

// Construir query string com HttpUtility.ParseQueryString
var query = HttpUtility.ParseQueryString(string.Empty);
query["q"] = "programação C#";    // Encoding automático
query["cidade"] = "São Paulo";
query["page"] = "1";
builder.Query = query.ToString();
builder.Fragment = "resultados";

Console.WriteLine(builder.Uri);
// "https://api.exemplo.com/v2/busca?q=programa%C3%A7%C3%A3o+C%23&cidade=S%C3%A3o+Paulo&page=1#resultados"


// --- Encoding e decoding ---

// Uri.EscapeDataString — equivalente a encodeURIComponent (codifica tudo)
Console.WriteLine(Uri.EscapeDataString("São Paulo & Rio"));
// "S%C3%A3o%20Paulo%20%26%20Rio"

// Uri.UnescapeDataString — decodifica
Console.WriteLine(Uri.UnescapeDataString("S%C3%A3o%20Paulo"));
// "São Paulo"

// HttpUtility.UrlEncode — usa + para espaços (padrão de formulários)
Console.WriteLine(HttpUtility.UrlEncode("São Paulo & Rio"));
// "S%c3%a3o+Paulo+%26+Rio"

// Codificar URL completo como parâmetro
var destino = "https://outro.com/pagina?id=1&tipo=A";
var redirect = $"https://meu.com/redirect?destino={Uri.EscapeDataString(destino)}";
Console.WriteLine(redirect);
// "https://meu.com/redirect?destino=https%3A%2F%2Foutro.com%2Fpagina%3Fid%3D1%26tipo%3DA"


// --- URLs relativos ---

var baseUri = new Uri("https://meusite.com/blog/artigos/");

Console.WriteLine(new Uri(baseUri, "xml.html"));        // https://meusite.com/blog/artigos/xml.html
Console.WriteLine(new Uri(baseUri, "../sobre.html"));    // https://meusite.com/blog/sobre.html
Console.WriteLine(new Uri(baseUri, "/contato"));         // https://meusite.com/contato


// --- Validação de URL ---

// Uri.TryCreate para validação segura sem exceções
bool valido = Uri.TryCreate("https://exemplo.com/pagina", UriKind.Absolute, out Uri? resultado);
Console.WriteLine($"Válido: {valido}, URL: {resultado}"); // Válido: True

bool invalido = Uri.TryCreate("não é url", UriKind.Absolute, out _);
Console.WriteLine($"Válido: {invalido}"); // Válido: False

// Verificar se é HTTP/HTTPS
bool isHttp = resultado?.Scheme is "http" or "https";


// --- Uso com HttpClient ---

// HttpClient aceita Uri diretamente
using var client = new HttpClient { BaseAddress = new Uri("https://api.exemplo.com") };

var requestQuery = HttpUtility.ParseQueryString(string.Empty);
requestQuery["categoria"] = "café & chá";
requestQuery["limit"] = "10";

// Combinar path + query
var requestUri = $"/api/produtos?{requestQuery}";
var response = await client.GetAsync(requestUri);
var dados = await response.Content.ReadAsStringAsync();
