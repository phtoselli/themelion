// ==============================================================
// JSON em Go — encoding/json (stdlib)
// ==============================================================

package main

import (
	"encoding/json"
	"fmt"
	"time"
)

// --- Structs com tags JSON ---

// Go usa struct tags para mapear campos ↔ chaves JSON
// `json:"nome"` define o nome da chave no JSON
// `json:"nome,omitempty"` omite se o valor é zero value
type Usuario struct {
	Nome          string   `json:"nome"`
	Idade         int      `json:"idade"`
	Desenvolvedor bool     `json:"desenvolvedor"`
	Linguagens    []string `json:"linguagens"`
	Endereco      Endereco `json:"endereco"`
}

type Endereco struct {
	Cidade string `json:"cidade"`
	Estado string `json:"estado"`
}

func main() {
	// --- Desserialização: JSON → struct ---

	jsonData := []byte(`{
		"nome": "Maria Silva",
		"idade": 28,
		"desenvolvedor": true,
		"linguagens": ["TypeScript", "Python", "Go"],
		"endereco": {
			"cidade": "São Paulo",
			"estado": "SP"
		}
	}`)

	var usuario Usuario
	// json.Unmarshal retorna error — Go trata erros explicitamente, nunca com exceções
	if err := json.Unmarshal(jsonData, &usuario); err != nil {
		fmt.Printf("Erro ao parsear JSON: %v\n", err)
		return
	}

	fmt.Printf("%s, %d anos\n", usuario.Nome, usuario.Idade)
	fmt.Printf("Linguagens: %v\n", usuario.Linguagens)
	// Maria Silva, 28 anos
	// Linguagens: [TypeScript Python Go]


	// --- Serialização: struct → JSON ---

	config := struct {
		Tema     string `json:"tema"`
		Idioma   string `json:"idioma"`
		FontSize int    `json:"fontSize"`
	}{
		Tema:     "escuro",
		Idioma:   "pt-BR",
		FontSize: 16,
	}

	// json.Marshal retorna []byte (não string)
	jsonBytes, err := json.Marshal(config)
	if err != nil {
		fmt.Printf("Erro ao serializar: %v\n", err)
		return
	}
	fmt.Println(string(jsonBytes))
	// {"tema":"escuro","idioma":"pt-BR","fontSize":16}

	// MarshalIndent para JSON formatado
	jsonFormatado, _ := json.MarshalIndent(config, "", "  ")
	fmt.Println(string(jsonFormatado))


	// --- Parsing dinâmico (sem struct definida) ---

	// map[string]interface{} é o equivalente Go de um objeto JSON genérico
	var dados map[string]interface{}
	json.Unmarshal(jsonData, &dados)

	// Acesso requer type assertion — Go é estritamente tipado
	nome := dados["nome"].(string)
	idade := dados["idade"].(float64) // JSON numbers viram float64 em Go
	fmt.Printf("Dinâmico: %s, %.0f anos\n", nome, idade)

	// Para arrays, a interface é []interface{}
	linguagens := dados["linguagens"].([]interface{})
	fmt.Printf("Primeira linguagem: %s\n", linguagens[0].(string))


	// --- omitempty e campos opcionais ---

	type Produto struct {
		ID        int     `json:"id"`
		Nome      string  `json:"nome"`
		Preco     float64 `json:"preco"`
		Descricao string  `json:"descricao,omitempty"` // Omite se string vazia
		Estoque   *int    `json:"estoque,omitempty"`   // Ponteiro: omite se nil
	}

	// Sem descrição e sem estoque — campos omitidos no JSON
	p1 := Produto{ID: 1, Nome: "Camiseta", Preco: 49.90}
	j1, _ := json.Marshal(p1)
	fmt.Println(string(j1))
	// {"id":1,"nome":"Camiseta","preco":49.9}

	// Com todos os campos
	estoque := 42
	p2 := Produto{ID: 2, Nome: "Livro", Preco: 35.0, Descricao: "Romance", Estoque: &estoque}
	j2, _ := json.Marshal(p2)
	fmt.Println(string(j2))
	// {"id":2,"nome":"Livro","preco":35,"descricao":"Romance","estoque":42}


	// --- DateTime ---

	// time.Time serializa automaticamente para ISO 8601 (RFC 3339)
	type Evento struct {
		Nome string    `json:"nome"`
		Data time.Time `json:"data"`
	}

	evento := Evento{
		Nome: "Deploy v2.0",
		Data: time.Date(2025, 1, 15, 14, 30, 0, 0, time.UTC),
	}

	eventoJSON, _ := json.MarshalIndent(evento, "", "  ")
	fmt.Println(string(eventoJSON))
	// {
	//   "nome": "Deploy v2.0",
	//   "data": "2025-01-15T14:30:00Z"
	// }

	// Desserializar restaura time.Time automaticamente
	var eventoParseado Evento
	json.Unmarshal(eventoJSON, &eventoParseado)
	fmt.Println(eventoParseado.Data.Format("02/01/2006 15:04"))
	// 15/01/2025 14:30


	// --- json.RawMessage para parsing parcial ---

	// Útil quando parte do JSON tem estrutura variável
	type Resposta struct {
		Tipo string          `json:"tipo"`
		Data json.RawMessage `json:"data"` // Mantém como JSON bruto
	}

	respostaJSON := []byte(`{"tipo":"usuario","data":{"nome":"Maria","idade":28}}`)
	var resp Resposta
	json.Unmarshal(respostaJSON, &resp)

	// Parsear data somente quando souber o tipo
	if resp.Tipo == "usuario" {
		var u Usuario
		json.Unmarshal(resp.Data, &u) // Parse somente da parte "data"
		fmt.Printf("Usuário: %s\n", u.Nome)
	}
}
