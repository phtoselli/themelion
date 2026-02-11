// ============================
// Arrays e Slices em Go
// ============================
package main

import "fmt"

func main() {
	// Array de tamanho fixo (raramente usado diretamente)
	var fixo [5]int = [5]int{10, 20, 30, 40, 50}
	_ = fixo

	// Slice — array dinâmico (o que você usa no dia a dia em Go)
	numeros := []int{10, 20, 30, 40, 50}

	// Acesso por índice — O(1)
	primeiro := numeros[0]              // 10
	ultimo := numeros[len(numeros)-1]   // 50
	_, _ = primeiro, ultimo

	// Modificar elemento — O(1)
	numeros[2] = 99  // [10, 20, 99, 40, 50]

	// Adicionar no final — O(1) amortizado
	numeros = append(numeros, 60)  // [10, 20, 99, 40, 50, 60]

	// Inserir no meio — O(n), desloca elementos
	// Go não tem Insert nativo, usa append + slicing
	pos := 1
	numeros = append(numeros[:pos+1], numeros[pos:]...)
	numeros[pos] = 15  // [10, 15, 20, 99, 40, 50, 60]

	// Remover por índice — O(n) no meio
	idx := 3
	numeros = append(numeros[:idx], numeros[idx+1:]...)  // remove índice 3

	// Buscar elemento — O(n), Go não tem função nativa
	existe := false
	indice := -1
	for i, v := range numeros {
		if v == 40 {
			existe = true
			indice = i
			break
		}
	}
	_, _ = existe, indice

	// Iterar sobre o slice
	for _, num := range numeros {
		fmt.Println(num)
	}

	// Iterar com índice
	for i, num := range numeros {
		fmt.Printf("Índice %d: %d\n", i, num)
	}

	// Slicing — cria sub-slice (compartilha memória!)
	primeiros := numeros[:2]     // [10, 15]
	ultimos := numeros[len(numeros)-2:]  // últimos 2 elementos
	_, _ = primeiros, ultimos

	// Tamanho e capacidade
	tamanho := len(numeros)    // quantidade de elementos
	capacidade := cap(numeros) // capacidade alocada
	_, _ = tamanho, capacidade

	// Cópia (evitar compartilhamento de memória)
	copia := make([]int, len(numeros))
	copy(copia, numeros)

	// ============================
	// Strings como arrays de bytes
	// ============================
	texto := "GoLang"
	primeiroChar := texto[0]         // byte 'G' (71)
	fatia := texto[1:4]              // "oLa"
	tamanhoStr := len(texto)         // 6
	_, _, _ = primeiroChar, fatia, tamanhoStr

	// Strings são imutáveis em Go
	// texto[0] = 'g'  → Erro de compilação!

	// Para modificar, converter para []rune (suporta Unicode)
	runes := []rune(texto)
	runes[0] = 'g'
	novoTexto := string(runes)  // "goLang"
	_ = novoTexto
}
