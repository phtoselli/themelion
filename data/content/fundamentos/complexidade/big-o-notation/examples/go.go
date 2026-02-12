// ============================
// Big O Notation em Go
// ============================
package main

import (
	"fmt"
	"sort"
	"strings"
)

func main() {
	// ============================
	// O(1) — Acesso direto
	// ============================
	nums := []int{10, 20, 30, 40, 50}
	primeiro := nums[0] // Acesso por índice: sempre 1 operação
	_ = primeiro

	cache := map[string]int{"alice": 95, "bob": 80}
	nota := cache["alice"] // Lookup em map: O(1) caso médio
	_ = nota

	// ============================
	// O(log n) — Busca binária
	// ============================
	// sort.SearchInts exige slice ordenado
	ordenado := []int{1, 3, 5, 7, 9, 11, 13, 15}
	// A cada passo descarta metade: 1 bilhão de elementos = ~30 comparações
	idx := sort.SearchInts(ordenado, 7) // Retorna índice onde 7 está (ou estaria)
	fmt.Printf("Busca binária: índice %d\n", idx)

	// ============================
	// O(n) — Percorrer tudo
	// ============================
	valores := []int{3, 7, 2, 9, 4, 1, 8}
	maior := valores[0]
	for _, v := range valores { // Percorre todos os n elementos
		if v > maior {
			maior = v
		}
	}
	fmt.Printf("Maior: %d\n", maior)

	// ============================
	// O(n log n) — Ordenação
	// ============================
	desordenado := []int{5, 2, 8, 1, 9, 3}
	sort.Ints(desordenado) // Internamente usa introsort: O(n log n)
	fmt.Println("Ordenado:", desordenado)

	// ============================
	// O(n²) — Loops aninhados
	// ============================
	// Verificar duplicatas de forma ingênua
	arr := []int{1, 4, 7, 2, 4}
	temDuplicataLento := verificarDuplicataLento(arr)
	fmt.Printf("Duplicata (O(n²)): %v\n", temDuplicataLento)

	// Mesma tarefa em O(n) usando map
	visto := make(map[int]bool)
	temDuplicata := false
	for _, v := range arr {
		if visto[v] { // Lookup em map: O(1)
			temDuplicata = true
			break
		}
		visto[v] = true
	}
	fmt.Printf("Duplicata (O(n)):   %v\n", temDuplicata)

	// ============================
	// Complexidade de espaço
	// ============================
	// O(1) espaço: variáveis fixas, independente de n
	soma := 0
	for _, v := range valores {
		soma += v
	}

	// O(n) espaço: aloca estrutura proporcional à entrada
	copia := make([]int, len(valores))
	copy(copia, valores)
	_, _ = soma, copia

	// ============================
	// Go na prática: performance
	// ============================

	// Prealocar slice evita realocações: O(n) com 1 alocação vs várias
	n := 10000
	eficiente := make([]int, 0, n) // len=0, cap=n — 1 alocação
	for i := 0; i < n; i++ {
		eficiente = append(eficiente, i) // Nunca realoca
	}

	// strings.Builder vs concatenação em loop
	// Concatenação: O(n²) — cada += copia tudo de novo
	// Builder: O(n) — buffer interno cresce eficientemente
	palavras := []string{"Go", "é", "simples", "e", "eficiente"}
	var b strings.Builder
	for _, p := range palavras {
		b.WriteString(p)
		b.WriteString(" ")
	}
	fmt.Println(b.String())
}

// verificarDuplicataLento verifica duplicatas com loops aninhados.
// O(n²) tempo, O(1) espaço.
func verificarDuplicataLento(arr []int) bool {
	for i := 0; i < len(arr); i++ { // n vezes
		for j := i + 1; j < len(arr); j++ { // até n-1 vezes
			if arr[i] == arr[j] { // total: O(n²) comparações
				return true
			}
		}
	}
	return false
}
