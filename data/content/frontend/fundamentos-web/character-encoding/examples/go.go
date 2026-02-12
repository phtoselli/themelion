// ==============================================================
// Codificação de Caracteres em Go
// ==============================================================
// Go usa UTF-8 nativamente — strings são sequências de bytes UTF-8.
// rune é o tipo para code points Unicode (alias de int32).

package main

import (
	"fmt"
	"unicode/utf8"

	"golang.org/x/text/encoding/charmap"
	"golang.org/x/text/transform"
	"strings"
	"io"
)

func main() {
	// --- Strings são UTF-8 por padrão ---

	texto := "Olá, São Paulo!"

	// len() retorna bytes, não caracteres
	fmt.Println("Bytes:", len(texto))                    // 17
	fmt.Println("Runes:", utf8.RuneCountInString(texto)) // 15

	// range itera por runes (code points), não por bytes
	for i, r := range texto {
		if r > 127 { // Caracteres não-ASCII
			fmt.Printf("  Posição byte %d: '%c' (U+%04X, %d bytes)\n",
				i, r, r, utf8.RuneLen(r))
		}
	}
	// Posição byte 2: 'á' (U+00E1, 2 bytes)
	// Posição byte 7: 'ã' (U+00E3, 2 bytes)


	// --- rune vs byte ---

	// byte = uint8 (1 byte, 0-255)
	// rune = int32 (code point Unicode, até U+10FFFF)

	var b byte = 'A' // byte: funciona para ASCII
	var r rune = '😀' // rune: funciona para qualquer caractere

	fmt.Printf("byte 'A': %d\n", b)     // 65
	fmt.Printf("rune '😀': U+%04X\n", r) // U+1F600

	// String para []byte (UTF-8 encoded)
	bytes := []byte(texto)
	fmt.Printf("Bytes: %v\n", bytes[:5]) // [79 108 195 161 44]
	// 'á' = [195, 161] — 2 bytes em UTF-8

	// String para []rune (code points)
	runes := []rune(texto)
	fmt.Printf("Runes: %v\n", runes[:5]) // [79 108 225 44 32]
	// 'á' = 225 (U+00E1) — 1 code point


	// --- Emojis e grafemas ---

	emoji := "😀"
	bandeira := "🇧🇷"
	familia := "👨‍👩‍👧‍👦"

	fmt.Printf("'%s' → bytes: %d, runes: %d\n", emoji, len(emoji), utf8.RuneCountInString(emoji))
	// '😀' → bytes: 4, runes: 1

	fmt.Printf("'%s' → bytes: %d, runes: %d\n", bandeira, len(bandeira), utf8.RuneCountInString(bandeira))
	// '🇧🇷' → bytes: 8, runes: 2 (2 regional indicators)

	fmt.Printf("'%s' → bytes: %d, runes: %d\n", familia, len(familia), utf8.RuneCountInString(familia))
	// '👨‍👩‍👧‍👦' → bytes: 25, runes: 7 (4 emojis + 3 ZWJ)


	// --- Construir e decodificar UTF-8 manualmente ---

	// utf8.EncodeRune codifica um code point em bytes UTF-8
	buf := make([]byte, 4)
	n := utf8.EncodeRune(buf, 'ã')
	fmt.Printf("'ã' em UTF-8: %v (%d bytes)\n", buf[:n], n)
	// 'ã' em UTF-8: [195 163] (2 bytes)

	n = utf8.EncodeRune(buf, '😀')
	fmt.Printf("'😀' em UTF-8: %v (%d bytes)\n", buf[:n], n)
	// '😀' em UTF-8: [240 159 152 128] (4 bytes)

	// utf8.DecodeRune decodifica bytes → rune
	runeDecodificada, tamanho := utf8.DecodeRune([]byte{195, 163})
	fmt.Printf("Bytes [195, 163] = '%c' (U+%04X), %d bytes\n",
		runeDecodificada, runeDecodificada, tamanho)
	// Bytes [195, 163] = 'ã' (U+00E3), 2 bytes


	// --- Validação de UTF-8 ---

	// utf8.Valid verifica se bytes são UTF-8 válido
	fmt.Println(utf8.Valid([]byte("Olá")))                  // true
	fmt.Println(utf8.Valid([]byte{0xff, 0xfe}))             // false (bytes inválidos)
	fmt.Println(utf8.ValidString("São Paulo"))              // true


	// --- Conversão entre encodings (x/text) ---
	// go get golang.org/x/text

	// Latin-1 → UTF-8
	bytesLatin1 := []byte{83, 227, 111, 32, 80, 97, 117, 108, 111} // "São Paulo" em Latin-1
	reader := transform.NewReader(
		strings.NewReader(string(bytesLatin1)),
		charmap.ISO8859_1.NewDecoder(), // Latin-1 → UTF-8
	)
	utf8Result, _ := io.ReadAll(reader)
	fmt.Println("Latin-1 → UTF-8:", string(utf8Result)) // "São Paulo"

	// UTF-8 → Latin-1
	writer := new(strings.Builder)
	w := transform.NewWriter(writer, charmap.ISO8859_1.NewEncoder())
	w.Write([]byte("São Paulo"))
	w.Close()
	fmt.Printf("UTF-8 → Latin-1: %v\n", []byte(writer.String()))
	// [83, 227, 111, 32, 80, 97, 117, 108, 111]


	// --- Comparação de tamanho ---

	textos := []string{"Hello", "Programação", "日本語", "😀🎉🚀"}
	for _, t := range textos {
		fmt.Printf("'%-12s' → bytes: %2d, runes: %2d\n",
			t, len(t), utf8.RuneCountInString(t))
	}
	// 'Hello'        → bytes:  5, runes:  5
	// 'Programação'  → bytes: 13, runes: 11
	// '日本語'        → bytes:  9, runes:  3
	// '😀🎉🚀'       → bytes: 12, runes:  3
}
