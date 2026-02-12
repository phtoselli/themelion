// ==============================================================
// Codificação de Caracteres em C#
// ==============================================================
// C# usa UTF-16 internamente para strings (como JavaScript).
// System.Text.Encoding faz conversão entre encodings.

using System.Text;
using System.Globalization;

// --- Strings são UTF-16 internamente ---

var texto = "Olá, São Paulo!";

// .Length conta unidades UTF-16 (char), não grafemas
Console.WriteLine($"Caracteres (UTF-16 units): {texto.Length}"); // 15
Console.WriteLine($"'café'.Length: {"café".Length}");             // 4
Console.WriteLine($"'😀'.Length: {"😀".Length}");                 // 2 (surrogate pair)

// char.IsSurrogatePair detecta emojis e caracteres fora do BMP
Console.WriteLine(char.IsSurrogatePair("😀", 0)); // True


// --- Encoding: string → bytes ---

var utf8Bytes = Encoding.UTF8.GetBytes(texto);
var latin1Bytes = Encoding.Latin1.GetBytes(texto);
var utf16Bytes = Encoding.Unicode.GetBytes(texto); // Unicode = UTF-16 LE em C#

Console.WriteLine($"UTF-8:   {utf8Bytes.Length} bytes → [{string.Join(", ", utf8Bytes)}]");
// UTF-8:   17 bytes → [79, 108, 195, 161, 44, 32, 83, 195, 163, 111, ...]
// 'á' = [195, 161] (2 bytes), 'ã' = [195, 163] (2 bytes)

Console.WriteLine($"Latin-1: {latin1Bytes.Length} bytes");
// Latin-1: 15 bytes (1 byte por caractere — funciona porque só tem chars latinos)

Console.WriteLine($"UTF-16:  {utf16Bytes.Length} bytes");
// UTF-16:  30 bytes (2 bytes por caractere)


// --- Decoding: bytes → string ---

var textoDeVolta = Encoding.UTF8.GetString(utf8Bytes);
Console.WriteLine(textoDeVolta); // "Olá, São Paulo!"

// Decodificar Latin-1 (arquivo legado)
var bytesLegado = new byte[] { 83, 227, 111, 32, 80, 97, 117, 108, 111 };
var textoLatin1 = Encoding.Latin1.GetString(bytesLegado);
Console.WriteLine(textoLatin1); // "São Paulo"


// --- Mojibake ---

var original = "São Paulo";
var bytesUtf8 = Encoding.UTF8.GetBytes(original);

// Decodificar UTF-8 como Latin-1 → mojibake
var errado = Encoding.Latin1.GetString(bytesUtf8);
Console.WriteLine($"Correto: {original}");
Console.WriteLine($"Errado:  {errado}");
// Correto: São Paulo
// Errado:  SÃ£o Paulo


// --- Code points Unicode ---

// Char.ConvertToUtf32 para obter code point de surrogate pairs
var emoji = "😀";
var codePoint = char.ConvertToUtf32(emoji, 0);
Console.WriteLine($"'😀' = U+{codePoint:X4}"); // U+1F600

// Iterar por code points (não por chars UTF-16)
var textoComEmoji = "Olá 😀 🇧🇷";
var enumerator = StringInfo.GetTextElementEnumerator(textoComEmoji);
var grafemas = 0;
while (enumerator.MoveNext())
{
    grafemas++;
}
Console.WriteLine($"Grafemas visuais: {grafemas}"); // 7 (O, l, á, ' ', 😀, ' ', 🇧🇷)
Console.WriteLine($"String.Length:    {textoComEmoji.Length}"); // 11 (unidades UTF-16)


// --- Rune: tipo para code points (C# 8+) ---

// Rune representa um code point Unicode válido (ao contrário de char que é UTF-16)
var rune = new Rune(0x1F600); // 😀
Console.WriteLine(rune);                    // 😀
Console.WriteLine($"UTF-16 units: {rune.Utf16SequenceLength}"); // 2
Console.WriteLine($"UTF-8 bytes:  {rune.Utf8SequenceLength}");  // 4

// Iterar por Runes (code points) — mais seguro que chars
foreach (var r in textoComEmoji.EnumerateRunes())
{
    Console.Write($"U+{r.Value:X4} ");
}
// U+004F U+006C U+00E1 U+0020 U+1F600 U+0020 U+1F1E7 U+1F1F7


// --- Ler arquivo com encoding específico ---

// UTF-8 (padrão moderno — C# usa UTF-8 por padrão no File.ReadAllText)
// var conteudo = File.ReadAllText("dados.json"); // UTF-8 por padrão

// Latin-1 (arquivo legado)
// var legado = File.ReadAllText("legado.csv", Encoding.Latin1);

// Detectar BOM automaticamente
// var comDeteccao = File.ReadAllText("arquivo.txt", Encoding.UTF8);
// Se o arquivo tem BOM, C# detecta e usa o encoding correto


// --- Comparação de tamanho por encoding ---

var textos = new[] { "Hello", "Programação", "日本語", "😀🎉🚀" };

foreach (var t in textos)
{
    var u8 = Encoding.UTF8.GetByteCount(t);
    var u16 = Encoding.Unicode.GetByteCount(t);
    var l1 = 0;
    try { l1 = Encoding.Latin1.GetByteCount(t); } catch { l1 = -1; }

    Console.WriteLine($"'{t,-12}' → UTF-8: {u8,2}B  UTF-16: {u16,2}B  Latin-1: {l1,2}B");
}
// 'Hello'       → UTF-8:  5B  UTF-16: 10B  Latin-1:  5B
// 'Programação' → UTF-8: 13B  UTF-16: 22B  Latin-1: 11B
// '日本語'       → UTF-8:  9B  UTF-16:  6B  Latin-1: -1B (não suporta)
// '😀🎉🚀'      → UTF-8: 12B  UTF-16: 12B  Latin-1: -1B (não suporta)
// UTF-8 é menor para texto latino, UTF-16 é menor para CJK
