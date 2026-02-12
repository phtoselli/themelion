// ==============================================================
// JSON em C# — System.Text.Json (stdlib moderna)
// ==============================================================

using System.Text.Json;
using System.Text.Json.Serialization;

// --- Desserialização tipada: JSON → objeto ---

var jsonString = """
{
  "nome": "Maria Silva",
  "idade": 28,
  "desenvolvedor": true,
  "linguagens": ["TypeScript", "Python", "Go"],
  "endereco": {
    "cidade": "São Paulo",
    "estado": "SP"
  }
}
""";

// Definir record para mapear a estrutura JSON
record Endereco(string Cidade, string Estado);

record Usuario(
    string Nome,
    int Idade,
    bool Desenvolvedor,
    string[] Linguagens,
    Endereco Endereco
);

// Opções para mapear camelCase do JSON → PascalCase do C#
var opcoes = new JsonSerializerOptions
{
    PropertyNameCaseInsensitive = true, // "nome" casa com propriedade "Nome"
    // PropertyNamingPolicy = JsonNamingPolicy.CamelCase // Para serialização
};

// Deserialize<T> faz parsing + validação de tipos em uma operação
var usuario = JsonSerializer.Deserialize<Usuario>(jsonString, opcoes)!;

Console.WriteLine(usuario.Nome);               // "Maria Silva"
Console.WriteLine(usuario.Linguagens[0]);      // "TypeScript"
Console.WriteLine(usuario.Endereco.Cidade);    // "São Paulo"


// --- Serialização: objeto → JSON ---

var config = new
{
    Tema = "escuro",
    Idioma = "pt-BR",
    FontSize = 16,
};

// Opções de serialização
var opcoesEscrita = new JsonSerializerOptions
{
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,  // PascalCase → camelCase
    WriteIndented = true,  // JSON formatado com indentação
    // Encoder permite caracteres não-ASCII sem escape (\u00e3 → ã)
    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
};

var json = JsonSerializer.Serialize(config, opcoesEscrita);
Console.WriteLine(json);
// {
//   "tema": "escuro",
//   "idioma": "pt-BR",
//   "fontSize": 16
// }


// --- Parsing dinâmico (sem tipo definido) ---

// JsonDocument para quando você não conhece a estrutura em compilação
using var doc = JsonDocument.Parse(jsonString);
var root = doc.RootElement;

// Navegar pela árvore JSON dinamicamente
var nome = root.GetProperty("nome").GetString();
var idade = root.GetProperty("idade").GetInt32();
var primeiraLinguagem = root.GetProperty("linguagens")[0].GetString();

Console.WriteLine($"{nome}, {idade} anos — {primeiraLinguagem}");


// --- Tratamento de erros ---

var jsonInvalido = """{"nome": "Maria", "idade": 28,}"""; // Trailing comma

try
{
    var dados = JsonSerializer.Deserialize<Usuario>(jsonInvalido, opcoes);
}
catch (JsonException ex)
{
    Console.WriteLine($"JSON inválido: {ex.Message}");
    // JSON inválido: '}' is invalid after a value. Path: $ | LineNumber: 0
}


// --- Serialização customizada de DateTime ---

// System.Text.Json serializa DateTime como ISO 8601 automaticamente
record Evento(string Nome, DateTime Data, string[] Tags);

var evento = new Evento(
    Nome: "Deploy v2.0",
    Data: new DateTime(2025, 1, 15, 14, 30, 0, DateTimeKind.Utc),
    Tags: ["producao", "release"]
);

var eventoJson = JsonSerializer.Serialize(evento, opcoesEscrita);
Console.WriteLine(eventoJson);
// {
//   "nome": "Deploy v2.0",
//   "data": "2025-01-15T14:30:00Z",
//   "tags": ["producao", "release"]
// }

// Desserializar restaura DateTime automaticamente (diferente de JavaScript!)
var eventoParseado = JsonSerializer.Deserialize<Evento>(eventoJson, opcoes)!;
Console.WriteLine(eventoParseado.Data.Kind); // Utc


// --- Atributos para controle fino ---

record Produto(
    [property: JsonPropertyName("product_id")]  // Nome customizado no JSON
    int Id,

    string Nome,

    [property: JsonIgnore]  // Não serializar esta propriedade
    string SegredoInterno,

    [property: JsonPropertyName("preco")]
    decimal Preco
);

var produto = new Produto(1, "Camiseta", "valor-secreto", 49.90m);
Console.WriteLine(JsonSerializer.Serialize(produto, opcoesEscrita));
// {"product_id":1,"nome":"Camiseta","preco":49.90}
// SegredoInterno foi ignorado pelo JsonIgnore
