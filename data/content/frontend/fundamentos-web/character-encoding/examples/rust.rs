// ==============================================================
// Codificação de Caracteres em Rust
// ==============================================================
// Rust strings (String/&str) são SEMPRE UTF-8 válido — garantido pelo compilador.
// char é um code point Unicode (4 bytes). &[u8] é bytes crus.

fn main() {
    // --- Strings são UTF-8 garantido ---

    let texto = "Olá, São Paulo!";

    // .len() retorna bytes UTF-8, não caracteres
    println!("Bytes: {}", texto.len());          // 17
    println!("Chars: {}", texto.chars().count()); // 15

    // Iterar por caracteres (code points)
    for (i, c) in texto.char_indices() {
        if !c.is_ascii() {
            println!("  Byte {}: '{}' (U+{:04X}, {} bytes UTF-8)",
                i, c, c as u32, c.len_utf8());
        }
    }
    // Byte 2: 'á' (U+00E1, 2 bytes UTF-8)
    // Byte 7: 'ã' (U+00E3, 2 bytes UTF-8)


    // --- char vs u8 (byte) ---

    // char = code point Unicode (até U+10FFFF), sempre 4 bytes em memória
    // u8 = 1 byte (0-255)
    let c: char = '😀';
    println!("'😀' = U+{:04X}", c as u32);     // U+1F600
    println!("UTF-8 bytes: {}", c.len_utf8());  // 4
    println!("UTF-16 units: {}", c.len_utf16()); // 2

    // String → bytes UTF-8
    let bytes: &[u8] = texto.as_bytes();
    println!("Primeiros 5 bytes: {:?}", &bytes[..5]);
    // [79, 108, 195, 161, 44]
    // 'á' = [195, 161] em UTF-8

    // bytes → String (pode falhar se não for UTF-8 válido)
    let de_volta = std::str::from_utf8(bytes).unwrap();
    println!("{}", de_volta); // "Olá, São Paulo!"

    // from_utf8 retorna Err se bytes não são UTF-8 válido
    let invalido = vec![0xff, 0xfe];
    match std::str::from_utf8(&invalido) {
        Ok(s) => println!("Válido: {}", s),
        Err(e) => println!("Inválido: {}", e),
        // Inválido: invalid utf-8 sequence of 1 bytes from index 0
    }


    // --- Indexação: bytes, não caracteres ---

    // Rust NÃO permite str[i] porque seria O(n) para UTF-8
    // Isso é proposital: força o programador a pensar em encoding

    let texto = "café";
    // texto[3] ← ERRO DE COMPILAÇÃO!
    // byte index 3 é o meio do 'é' (2 bytes: [195, 169])

    // Para acessar por posição, converter para Vec<char> primeiro (O(n))
    let chars: Vec<char> = texto.chars().collect();
    println!("Posição 3: '{}'", chars[3]); // 'é'

    // Ou usar fatias de bytes (precisa garantir fronteiras de caractere)
    println!("Bytes 0..3: {}", &texto[0..3]); // "caf" ✅
    // println!("{}", &texto[0..4]); // "café" ✅ (4 = início do próximo char)
    // println!("{}", &texto[0..5]); // PANIC! byte 5 está no meio de 'é'


    // --- Emojis e grafemas ---

    let emoji = "😀";
    let bandeira = "🇧🇷";
    let familia = "👨\u{200D}👩\u{200D}👧\u{200D}👦";

    println!("'{}' → bytes: {}, chars: {}",
        emoji, emoji.len(), emoji.chars().count());
    // '😀' → bytes: 4, chars: 1

    println!("'{}' → bytes: {}, chars: {}",
        bandeira, bandeira.len(), bandeira.chars().count());
    // '🇧🇷' → bytes: 8, chars: 2

    println!("'{}' → bytes: {}, chars: {}",
        familia, familia.len(), familia.chars().count());
    // '👨‍👩‍👧‍👦' → bytes: 25, chars: 7

    // Para grafemas visuais, usar unicode-segmentation crate:
    // use unicode_segmentation::UnicodeSegmentation;
    // bandeira.graphemes(true).count() → 1


    // --- Conversão de encoding ---

    // Rust garante que String/&str são UTF-8, mas dados externos podem não ser
    // Para outros encodings, usar encoding_rs crate

    // Exemplo conceitual com encoding_rs:
    // use encoding_rs::WINDOWS_1252;
    //
    // let bytes_latin1: &[u8] = &[83, 227, 111, 32, 80, 97, 117, 108, 111];
    // let (texto, _encoding, _had_errors) = WINDOWS_1252.decode(bytes_latin1);
    // println!("{}", texto); // "São Paulo"
    //
    // // UTF-8 → Latin-1
    // let (bytes_encoded, _encoding, _had_errors) = WINDOWS_1252.encode("São Paulo");


    // --- Escapes Unicode em strings ---

    println!("{}", '\u{0041}');   // 'A'
    println!("{}", '\u{00E9}');   // 'é'
    println!("{}", '\u{00E3}');   // 'ã'
    println!("{}", '\u{1F600}');  // '😀'

    // String com escapes
    let saudacao = "Ol\u{00E1}, S\u{00E3}o Paulo!";
    println!("{}", saudacao); // "Olá, São Paulo!"


    // --- Comparação de tamanho por encoding ---

    let textos = ["Hello", "Programação", "日本語", "😀🎉🚀"];

    for t in &textos {
        println!("'{:<12}' → bytes: {:2}, chars: {:2}",
            t, t.len(), t.chars().count());
    }
    // 'Hello'        → bytes:  5, chars:  5
    // 'Programação'  → bytes: 13, chars: 11
    // '日本語'        → bytes:  9, chars:  3
    // '😀🎉🚀'       → bytes: 12, chars:  3


    // --- Por que Rust garante UTF-8 ---

    // String e &str são SEMPRE UTF-8 válido — isso é garantido pelo tipo.
    // Não existe "mojibake" com strings Rust porque:
    // 1. String::from_utf8() valida na construção
    // 2. str literais são validados em compilação
    // 3. Operações de fatia fazem panic se cortam no meio de um caractere
    //
    // Para dados potencialmente inválidos, use:
    // - Vec<u8> ou &[u8] para bytes crus
    // - String::from_utf8_lossy() para substituir bytes inválidos por '�'

    let bytes_mistos = vec![72, 101, 108, 108, 111, 0xFF, 0xFE, 33];
    let com_lossy = String::from_utf8_lossy(&bytes_mistos);
    println!("{}", com_lossy); // "Hello��!" — bytes inválidos viram '�'
}
