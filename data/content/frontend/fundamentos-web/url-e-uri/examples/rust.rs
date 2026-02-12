// ==============================================================
// URL em Rust — url crate (padrão da comunidade)
// ==============================================================
// Cargo.toml:
// [dependencies]
// url = "2"

use url::Url;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // --- Parsing de URL ---

    let url = Url::parse(
        "https://loja.com:8443/produtos/livros?categoria=ficção&ordem=preço&page=2#resultados",
    )?;

    // Url fornece métodos tipados para cada componente
    println!("Scheme: {}", url.scheme());           // "https"
    println!("Host: {:?}", url.host_str());         // Some("loja.com")
    println!("Port: {:?}", url.port());             // Some(8443)
    println!("Path: {}", url.path());               // "/produtos/livros"
    println!("Query: {:?}", url.query());           // Some("categoria=fic%C3%A7%C3%A3o&...")
    println!("Fragment: {:?}", url.fragment());      // Some("resultados")

    // query_pairs() retorna iterador sobre pares (chave, valor) decodificados
    for (chave, valor) in url.query_pairs() {
        println!("  {}: {}", chave, valor);
    }
    // categoria: ficção
    // ordem: preço
    // page: 2


    // --- Construção de URL ---

    let mut api_url = Url::parse("https://api.exemplo.com/v2/busca")?;

    // query_pairs_mut() permite adicionar parâmetros com encoding automático
    api_url
        .query_pairs_mut()
        .append_pair("q", "programação Rust")
        .append_pair("cidade", "São Paulo")
        .append_pair("page", "1")
        // Parâmetros repetidos (arrays)
        .append_pair("tag", "backend")
        .append_pair("tag", "rust")
        .append_pair("tag", "systems");

    api_url.set_fragment(Some("resultados"));

    println!("{}", api_url);
    // "https://api.exemplo.com/v2/busca?q=programa%C3%A7%C3%A3o+Rust&cidade=S%C3%A3o+Paulo&page=1&tag=backend&tag=rust&tag=systems#resultados"


    // --- Encoding e decoding ---

    // percent_encoding crate para encoding manual (url crate faz automaticamente)
    use url::form_urlencoded;

    // Construir query string com encoding explícito
    let encoded: String = form_urlencoded::Serializer::new(String::new())
        .append_pair("q", "café & chá")
        .append_pair("cidade", "São Paulo")
        .finish();

    println!("{}", encoded);
    // "q=caf%C3%A9+%26+ch%C3%A1&cidade=S%C3%A3o+Paulo"

    // Decodificar query string
    let decoded: Vec<(String, String)> = form_urlencoded::parse(encoded.as_bytes())
        .into_owned()
        .collect();

    for (chave, valor) in &decoded {
        println!("  {}: {}", chave, valor);
    }
    // q: café & chá
    // cidade: São Paulo


    // --- URLs relativos ---

    let base = Url::parse("https://meusite.com/blog/artigos/")?;

    // join() resolve URLs relativos contra a base
    println!("{}", base.join("xml.html")?);
    // "https://meusite.com/blog/artigos/xml.html"

    println!("{}", base.join("../sobre.html")?);
    // "https://meusite.com/blog/sobre.html"

    println!("{}", base.join("/contato")?);
    // "https://meusite.com/contato"


    // --- Manipulação de segmentos de path ---

    let mut url = Url::parse("https://api.com/v1/usuarios")?;

    // path_segments_mut() permite manipular segmentos individuais
    url.path_segments_mut()
        .map_err(|_| "URL não suporta segmentos")?
        .push("42")
        .push("perfil");

    println!("{}", url);
    // "https://api.com/v1/usuarios/42/perfil"


    // --- Validação ---

    // Url::parse retorna Result — URL inválido é Err, não panic
    let urls_teste = [
        "https://exemplo.com/pagina",
        "não é url",
        "ftp://arquivo.com/data.csv",
        "//relativo.com/path",
    ];

    for raw in &urls_teste {
        match Url::parse(raw) {
            Ok(url) => println!("✅ {} → scheme: {}", raw, url.scheme()),
            Err(e) => println!("❌ {} → erro: {}", raw, e),
        }
    }

    // --- Origin e segurança ---

    // origin() retorna o "origin" do URL (scheme + host + port)
    // Mesmo conceito usado por Same-Origin Policy nos navegadores
    let url1 = Url::parse("https://site.com:443/pagina")?;
    let url2 = Url::parse("https://site.com/outra")?;
    let url3 = Url::parse("http://site.com/pagina")?;

    // Mesma origem (https + site.com + 443 implícito)
    println!("Mesma origem: {}", url1.origin() == url2.origin()); // true

    // Origem diferente (http vs https)
    println!("Mesma origem: {}", url1.origin() == url3.origin()); // false

    Ok(())
}
