// ==============================================================
// XML em Go — encoding/xml (stdlib)
// ==============================================================

package main

import (
	"encoding/xml"
	"fmt"
)

// --- Structs com tags XML ---

// Go usa struct tags para mapear XML ↔ structs
// `xml:"nome"` define o nome do elemento XML correspondente
// `xml:"isbn,attr"` mapeia um atributo (não elemento)
type Biblioteca struct {
	XMLName xml.Name `xml:"biblioteca"`
	Livros  []Livro  `xml:"livro"`
}

type Livro struct {
	ISBN   string   `xml:"isbn,attr"` // Atributo do elemento
	Titulo string   `xml:"titulo"`
	Autor  string   `xml:"autor"`
	Ano    int      `xml:"ano"`
	Generos []string `xml:"generos>genero"` // Elemento aninhado: <generos><genero>
}

func main() {
	// --- Desserializando XML → struct ---

	xmlData := []byte(`<?xml version="1.0" encoding="UTF-8"?>
<biblioteca>
  <livro isbn="978-85-333-0227-3">
    <titulo>Dom Casmurro</titulo>
    <autor>Machado de Assis</autor>
    <ano>1899</ano>
    <generos>
      <genero>Romance</genero>
      <genero>Literatura Brasileira</genero>
    </generos>
  </livro>
  <livro isbn="978-85-359-0277-9">
    <titulo>Grande Sertão: Veredas</titulo>
    <autor>Guimarães Rosa</autor>
    <ano>1956</ano>
  </livro>
</biblioteca>`)

	var bib Biblioteca
	// xml.Unmarshal faz o parsing e preenche a struct automaticamente
	if err := xml.Unmarshal(xmlData, &bib); err != nil {
		fmt.Printf("Erro ao parsear XML: %v\n", err)
		return
	}

	for _, livro := range bib.Livros {
		fmt.Printf("[%s] %s — %s (%d)\n", livro.ISBN, livro.Titulo, livro.Autor, livro.Ano)
		if len(livro.Generos) > 0 {
			fmt.Printf("  Gêneros: %v\n", livro.Generos)
		}
	}

	// --- Serializando struct → XML ---

	type Produto struct {
		XMLName xml.Name `xml:"produto"`
		ID      int      `xml:"id,attr"`
		Nome    string   `xml:"nome"`
		Preco   Preco    `xml:"preco"`
	}

	type Preco struct {
		Moeda string  `xml:"moeda,attr"`
		Valor float64 `xml:",chardata"` // chardata = conteúdo de texto do elemento
	}

	type Catalogo struct {
		XMLName  xml.Name  `xml:"catalogo"`
		Versao   string    `xml:"versao,attr"`
		Produtos []Produto `xml:"produto"`
	}

	catalogo := Catalogo{
		Versao: "1.0",
		Produtos: []Produto{
			{
				ID:   1,
				Nome: "Camiseta",
				Preco: Preco{Moeda: "BRL", Valor: 49.90},
			},
		},
	}

	// MarshalIndent adiciona indentação para legibilidade
	saida, err := xml.MarshalIndent(catalogo, "", "  ")
	if err != nil {
		fmt.Printf("Erro ao serializar: %v\n", err)
		return
	}

	// xml.Header adiciona a declaração XML padrão
	fmt.Println(xml.Header + string(saida))

	// --- Caracteres especiais ---

	// encoding/xml escapa automaticamente &, <, >, ", '
	type Texto struct {
		XMLName  xml.Name `xml:"texto"`
		Conteudo string   `xml:",chardata"`
	}

	t := Texto{Conteudo: `Condição: x < 10 && nome = "João"`}
	resultado, _ := xml.Marshal(t)
	fmt.Println(string(resultado))
	// <texto>Condição: x &lt; 10 &amp;&amp; nome = &#34;João&#34;</texto>
}
