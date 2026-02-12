// ==============================================================
// URL em Go — net/url (stdlib)
// ==============================================================

package main

import (
	"fmt"
	"net/url"
)

func main() {
	// --- Parsing de URL ---

	rawURL := "https://loja.com:8443/produtos/livros?categoria=ficção&ordem=preço&page=2#resultados"

	// url.Parse retorna *url.URL com todos os componentes separados
	u, err := url.Parse(rawURL)
	if err != nil {
		fmt.Printf("URL inválido: %v\n", err)
		return
	}

	fmt.Println("Scheme:", u.Scheme)       // "https"
	fmt.Println("Host:", u.Host)           // "loja.com:8443"
	fmt.Println("Hostname:", u.Hostname()) // "loja.com" (sem porta)
	fmt.Println("Port:", u.Port())         // "8443"
	fmt.Println("Path:", u.Path)           // "/produtos/livros"
	fmt.Println("RawQuery:", u.RawQuery)   // "categoria=fic%C3%A7%C3%A3o&ordem=pre%C3%A7o&page=2"
	fmt.Println("Fragment:", u.Fragment)   // "resultados"

	// Query() retorna url.Values (map[string][]string)
	// Cada valor é slice porque parâmetros podem repetir
	params := u.Query()
	fmt.Println("Categoria:", params.Get("categoria")) // "ficção" (decodificado)
	fmt.Println("Page:", params.Get("page"))           // "2"


	// --- Construção de URL ---

	apiURL := &url.URL{
		Scheme: "https",
		Host:   "api.exemplo.com",
		Path:   "/v2/busca",
	}

	// url.Values monta query string com encoding automático
	q := url.Values{}
	q.Set("q", "programação Go")
	q.Set("cidade", "São Paulo")
	q.Set("page", "1")

	// Parâmetros repetidos (arrays)
	q.Add("tag", "backend")
	q.Add("tag", "go")
	q.Add("tag", "api")

	apiURL.RawQuery = q.Encode()
	apiURL.Fragment = "resultados"

	fmt.Println(apiURL.String())
	// "https://api.exemplo.com/v2/busca?cidade=S%C3%A3o+Paulo&page=1&q=programa%C3%A7%C3%A3o+Go&tag=backend&tag=go&tag=api#resultados"
	// Note: Go ordena parâmetros alfabeticamente por chave


	// --- Encoding e decoding ---

	// url.PathEscape — para segmentos de path (espaço → %20)
	fmt.Println(url.PathEscape("São Paulo"))
	// "S%C3%A3o%20Paulo"

	// url.QueryEscape — para valores de query (espaço → +)
	fmt.Println(url.QueryEscape("São Paulo & Rio"))
	// "S%C3%A3o+Paulo+%26+Rio"

	// Decodificar
	decoded, _ := url.QueryUnescape("S%C3%A3o+Paulo")
	fmt.Println(decoded) // "São Paulo"

	// Codificar URL completo como parâmetro
	destino := "https://outro.com/pagina?id=1&tipo=A"
	redirect := fmt.Sprintf("https://meu.com/redirect?destino=%s",
		url.QueryEscape(destino))
	fmt.Println(redirect)
	// "https://meu.com/redirect?destino=https%3A%2F%2Foutro.com%2Fpagina%3Fid%3D1%26tipo%3DA"


	// --- Resolução de URLs relativos ---

	base, _ := url.Parse("https://meusite.com/blog/artigos/")

	ref1, _ := url.Parse("xml.html")
	fmt.Println(base.ResolveReference(ref1))
	// "https://meusite.com/blog/artigos/xml.html"

	ref2, _ := url.Parse("../sobre.html")
	fmt.Println(base.ResolveReference(ref2))
	// "https://meusite.com/blog/sobre.html"

	ref3, _ := url.Parse("/contato")
	fmt.Println(base.ResolveReference(ref3))
	// "https://meusite.com/contato"


	// --- Validação ---

	// url.Parse é leniente — aceita quase qualquer string
	// Para validar se é um URL HTTP válido, verifique os componentes
	testar := func(raw string) {
		parsed, err := url.Parse(raw)
		valido := err == nil &&
			(parsed.Scheme == "http" || parsed.Scheme == "https") &&
			parsed.Host != ""
		fmt.Printf("%-40s → válido: %v\n", raw, valido)
	}

	testar("https://exemplo.com/pagina")     // válido: true
	testar("não é url")                       // válido: false
	testar("ftp://arquivo.com/data.csv")      // válido: false (não é HTTP)
	testar("https://")                        // válido: false (sem host)
}
