// ==============================================================
// XML em Rust — quick-xml (crate mais popular para XML)
// ==============================================================
// Cargo.toml:
// [dependencies]
// quick-xml = { version = "0.31", features = ["serialize"] }
// serde = { version = "1", features = ["derive"] }

use quick_xml::de::from_str;
use quick_xml::se::to_string;
use serde::{Deserialize, Serialize};

// --- Structs com serde ---

// quick-xml + serde permite desserialização tipada — erros de estrutura
// são pegos em tempo de compilação, não em runtime
#[derive(Debug, Deserialize)]
struct Biblioteca {
    #[serde(rename = "livro")]
    livros: Vec<Livro>,
}

#[derive(Debug, Deserialize)]
struct Livro {
    #[serde(rename = "@isbn")] // @ indica atributo XML
    isbn: String,
    titulo: String,
    autor: String,
    ano: u16, // Conversão automática de texto XML → número
}

// --- Struct para serialização ---

#[derive(Debug, Serialize)]
#[serde(rename = "catalogo")]
struct Catalogo {
    #[serde(rename = "@versao")] // Serializa como atributo
    versao: String,
    #[serde(rename = "produto")]
    produtos: Vec<Produto>,
}

#[derive(Debug, Serialize)]
struct Produto {
    #[serde(rename = "@id")]
    id: u32,
    nome: String,
    preco: Preco,
}

#[derive(Debug, Serialize)]
struct Preco {
    #[serde(rename = "@moeda")]
    moeda: String,
    #[serde(rename = "$text")] // $text = conteúdo de texto do elemento
    valor: f64,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // --- Desserializando XML → struct ---

    let xml_data = r#"<?xml version="1.0" encoding="UTF-8"?>
<biblioteca>
  <livro isbn="978-85-333-0227-3">
    <titulo>Dom Casmurro</titulo>
    <autor>Machado de Assis</autor>
    <ano>1899</ano>
  </livro>
  <livro isbn="978-85-359-0277-9">
    <titulo>Grande Sertão: Veredas</titulo>
    <autor>Guimarães Rosa</autor>
    <ano>1956</ano>
  </livro>
</biblioteca>"#;

    // from_str retorna Result — XML malformado é erro tratável, não panic
    let bib: Biblioteca = from_str(xml_data)?;

    for livro in &bib.livros {
        println!(
            "[{}] {} — {} ({})",
            livro.isbn, livro.titulo, livro.autor, livro.ano
        );
    }

    // Filtrar com iteradores — idiomático Rust
    let classicos: Vec<&str> = bib
        .livros
        .iter()
        .filter(|l| l.ano < 1900)
        .map(|l| l.titulo.as_str())
        .collect();

    println!("Clássicos: {:?}", classicos);
    // Clássicos: ["Dom Casmurro"]

    // --- Serializando struct → XML ---

    let catalogo = Catalogo {
        versao: "1.0".to_string(),
        produtos: vec![Produto {
            id: 1,
            nome: "Camiseta".to_string(),
            preco: Preco {
                moeda: "BRL".to_string(),
                valor: 49.90,
            },
        }],
    };

    // to_string serializa a struct para XML
    let xml_saida = to_string(&catalogo)?;
    println!("{}", xml_saida);

    // --- Parsing manual com Reader (streaming) ---
    // Para arquivos grandes onde carregar tudo na memória não é viável

    use quick_xml::events::Event;
    use quick_xml::Reader;

    let mut reader = Reader::from_str(xml_data);
    let mut dentro_de_titulo = false;

    // Parsing baseado em eventos (similar a SAX) — memória constante O(1)
    loop {
        match reader.read_event()? {
            Event::Start(ref e) if e.name().as_ref() == b"titulo" => {
                dentro_de_titulo = true;
            }
            Event::Text(ref e) if dentro_de_titulo => {
                // unescape() converte entidades XML (&amp; → &) automaticamente
                let titulo = e.unescape()?;
                println!("Título encontrado: {}", titulo);
                dentro_de_titulo = false;
            }
            Event::Eof => break, // Fim do documento
            _ => {}
        }
    }

    Ok(())
}
