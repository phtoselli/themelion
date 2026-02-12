// ==============================================================
// Codificação de Caracteres em TypeScript
// ==============================================================
// JavaScript/TypeScript usa UTF-16 internamente para strings.
// TextEncoder/TextDecoder fazem conversão para/de UTF-8.

// --- Strings em JavaScript usam UTF-16 internamente ---

// .length conta unidades de código UTF-16, NÃO caracteres visuais
console.log("hello".length); // 5 — ASCII, 1 unidade cada
console.log("café".length); // 4 — 'é' cabe em 1 unidade UTF-16
console.log("😀".length); // 2 — emoji precisa de surrogate pair (2 unidades UTF-16)
console.log("🇧🇷".length); // 4 — bandeira = 2 regional indicators × 2 unidades

// charCodeAt retorna a unidade UTF-16 (não o code point para surrogate pairs)
console.log("A".charCodeAt(0)); // 65
console.log("é".charCodeAt(0)); // 233 (U+00E9, cabe em 16 bits)
console.log("😀".charCodeAt(0)); // 55357 (0xD83D — high surrogate, não é o code point!)

// codePointAt retorna o code point Unicode correto
console.log("😀".codePointAt(0)); // 128512 (0x1F600 — code point real)
console.log("A".codePointAt(0)); // 65 (0x0041)


// --- Contar caracteres visuais (grafemas) ---

// Spread operator itera por code points (melhor que .length para emojis simples)
console.log([..."café"].length); // 4 ✅
console.log([..."😀"].length); // 1 ✅ (1 code point)
console.log([..."🇧🇷"].length); // 2 ❌ (2 code points, mas 1 grafema visual)
console.log([..."👨‍👩‍👧‍👦"].length); // 7 ❌ (7 code points, mas 1 grafema visual)

// Intl.Segmenter conta grafemas corretamente (standard moderno)
const segmenter = new Intl.Segmenter("pt-BR", { granularity: "grapheme" });

function contarGrafemas(texto: string): number {
  return [...segmenter.segment(texto)].length;
}

console.log(contarGrafemas("café")); // 4 ✅
console.log(contarGrafemas("😀")); // 1 ✅
console.log(contarGrafemas("🇧🇷")); // 1 ✅
console.log(contarGrafemas("👨‍👩‍👧‍👦")); // 1 ✅


// --- TextEncoder: string → bytes UTF-8 ---

const encoder = new TextEncoder(); // Sempre produz UTF-8

const texto = "Olá, São Paulo!";
const bytes = encoder.encode(texto);

console.log(bytes);
// Uint8Array [79, 108, 195, 161, 44, 32, 83, 195, 163, 111, ...]
// 'á' = [195, 161] (2 bytes), 'ã' = [195, 163] (2 bytes)

console.log(`Caracteres: ${texto.length}`); // 15
console.log(`Bytes UTF-8: ${bytes.length}`); // 17 (2 extras para á e ã)


// --- TextDecoder: bytes → string ---

const decoder = new TextDecoder("utf-8"); // Especificar encoding

// Decodificar UTF-8
const textoDeVolta = decoder.decode(bytes);
console.log(textoDeVolta); // "Olá, São Paulo!"

// Decodificar Latin-1 (para arquivos legados)
const decoderLatin1 = new TextDecoder("iso-8859-1");
const bytesLatin1 = new Uint8Array([83, 227, 111, 32, 80, 97, 117, 108, 111]);
console.log(decoderLatin1.decode(bytesLatin1)); // "São Paulo"

// Opção fatal: true lança erro em bytes inválidos (ao invés de substituir por �)
const decoderStrict = new TextDecoder("utf-8", { fatal: true });
try {
  decoderStrict.decode(new Uint8Array([0xff, 0xfe])); // Bytes inválidos em UTF-8
} catch (e) {
  console.error("Bytes inválidos para UTF-8");
}


// --- Mojibake: demonstração do problema ---

// Simular: texto UTF-8 lido como Latin-1
const original = "São Paulo";
const bytesUtf8 = new TextEncoder().encode(original);
// [83, 195, 163, 111, 32, 80, 97, 117, 108, 111]

const errado = new TextDecoder("iso-8859-1").decode(bytesUtf8);
console.log(`Correto: ${original}`);
console.log(`Errado:  ${errado}`);
// Correto: São Paulo
// Errado:  SÃ£o Paulo
// 'ã' UTF-8 [0xC3, 0xA3] → Latin-1 lê como 'Ã' (0xC3) + '£' (0xA3)


// --- Code points e escapes Unicode ---

// \u para BMP (4 dígitos hex)
console.log("\u0041"); // 'A'
console.log("\u00e9"); // 'é'
console.log("\u00e3"); // 'ã'

// \u{} para qualquer code point (incluindo supplementary)
console.log("\u{1F600}"); // '😀'
console.log("\u{1F1E7}\u{1F1F7}"); // '🇧🇷' (2 regional indicators)

// String.fromCodePoint cria string a partir de code points
console.log(String.fromCodePoint(0x1f600)); // '😀'
console.log(String.fromCodePoint(65, 66, 67)); // 'ABC'


// --- Uso prático: ler arquivo com encoding específico ---

async function lerArquivoComEncoding(
  url: string,
  encoding: string
): Promise<string> {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const decoder = new TextDecoder(encoding);
  return decoder.decode(buffer);
}

// UTF-8 (padrão moderno)
// const texto = await lerArquivoComEncoding("/api/dados.json", "utf-8");

// Latin-1 (arquivo legado)
// const textoLegado = await lerArquivoComEncoding("/dados/legado.csv", "iso-8859-1");
