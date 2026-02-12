// ==============================================================
// JSON em Rust — serde_json (crate padrão da comunidade)
// ==============================================================
// Cargo.toml:
// [dependencies]
// serde = { version = "1", features = ["derive"] }
// serde_json = "1"

use serde::{Deserialize, Serialize};
use serde_json::{json, Value};

// --- Structs tipadas com serde ---

// Derive macros geram código de serialização em tempo de compilação
// — zero overhead em runtime, erros de tipo pegos na compilação
#[derive(Debug, Serialize, Deserialize)]
struct Usuario {
    nome: String,
    idade: u32,
    desenvolvedor: bool,
    linguagens: Vec<String>,
    endereco: Endereco,
}

#[derive(Debug, Serialize, Deserialize)]
struct Endereco {
    cidade: String,
    estado: String,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // --- Desserialização tipada: JSON → struct ---

    let json_string = r#"{
        "nome": "Maria Silva",
        "idade": 28,
        "desenvolvedor": true,
        "linguagens": ["TypeScript", "Python", "Go"],
        "endereco": {
            "cidade": "São Paulo",
            "estado": "SP"
        }
    }"#;

    // from_str retorna Result — JSON inválido ou tipo incompatível é erro tratável
    let usuario: Usuario = serde_json::from_str(json_string)?;

    println!("{}, {} anos", usuario.nome, usuario.idade);
    println!("Linguagens: {:?}", usuario.linguagens);
    println!("Cidade: {}", usuario.endereco.cidade);

    // --- Serialização: struct → JSON ---

    let config = serde_json::json!({
        "tema": "escuro",
        "idioma": "pt-BR",
        "fontSize": 16
    });

    // to_string = compacto, to_string_pretty = formatado
    println!("{}", serde_json::to_string_pretty(&config)?);

    // Serializar structs customizadas
    let novo_usuario = Usuario {
        nome: "João Santos".to_string(),
        idade: 32,
        desenvolvedor: true,
        linguagens: vec!["Rust".to_string(), "Go".to_string()],
        endereco: Endereco {
            cidade: "Rio de Janeiro".to_string(),
            estado: "RJ".to_string(),
        },
    };

    let json_saida = serde_json::to_string_pretty(&novo_usuario)?;
    println!("{}", json_saida);

    // --- Parsing dinâmico com Value ---

    // serde_json::Value é o equivalente a "any" para JSON
    let dados: Value = serde_json::from_str(json_string)?;

    // Acessar com [] — retorna Value::Null se não existir (não faz panic)
    let nome = dados["nome"].as_str().unwrap_or("desconhecido");
    let idade = dados["idade"].as_u64().unwrap_or(0);
    let primeira_linguagem = dados["linguagens"][0].as_str();

    println!("Dinâmico: {}, {} anos", nome, idade);
    println!("Primeira: {:?}", primeira_linguagem);

    // Verificar se campo existe
    if dados["perfil"].is_null() {
        println!("Campo 'perfil' não existe ou é null");
    }

    // --- macro json! para construir valores ---

    // json! cria Value a partir de sintaxe literal — interpolação com variáveis
    let nome_var = "Maria";
    let idade_var = 28;
    let valor = json!({
        "nome": nome_var,
        "idade": idade_var,
        "tags": ["dev", "senior"],
        "ativo": true,
        "perfil": null
    });

    println!("{}", valor);

    // --- Atributos serde para controle fino ---

    #[derive(Debug, Serialize, Deserialize)]
    struct Produto {
        #[serde(rename = "product_id")] // Nome diferente no JSON
        id: u32,
        nome: String,
        #[serde(skip_serializing)] // Não incluir na serialização
        segredo_interno: String,
        preco: f64,
        #[serde(skip_serializing_if = "Option::is_none")] // Omitir se None
        descricao: Option<String>,
    }

    let produto = Produto {
        id: 1,
        nome: "Camiseta".to_string(),
        segredo_interno: "valor-secreto".to_string(),
        preco: 49.90,
        descricao: None, // Será omitido no JSON
    };

    println!("{}", serde_json::to_string_pretty(&produto)?);
    // {
    //   "product_id": 1,
    //   "nome": "Camiseta",
    //   "preco": 49.9
    // }
    // segredo_interno e descricao foram omitidos

    // --- Tratamento de erros ---

    let json_invalido = r#"{"nome": "Maria", "idade": 28,}"#; // Trailing comma

    match serde_json::from_str::<Value>(json_invalido) {
        Ok(dados) => println!("Parseado: {}", dados),
        Err(e) => {
            // serde_json fornece linha e coluna do erro
            println!("Erro na linha {}, coluna {}: {}", e.line(), e.column(), e);
        }
    }

    Ok(())
}
