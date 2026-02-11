// ============================
// Arrays e Vetores em Rust
// ============================

fn main() {
    // Array de tamanho fixo (tamanho faz parte do tipo)
    let fixo: [i32; 5] = [10, 20, 30, 40, 50];
    let _primeiro = fixo[0];  // 10

    // Vec — array dinâmico (o que você usa no dia a dia em Rust)
    let mut numeros: Vec<i32> = vec![10, 20, 30, 40, 50];

    // Acesso por índice — O(1)
    let primeiro = numeros[0];                    // 10
    let ultimo = numeros[numeros.len() - 1];      // 50
    let _seguro = numeros.get(99);                // None (sem panic)
    let _ = (primeiro, ultimo);

    // Modificar elemento — O(1)
    numeros[2] = 99;  // [10, 20, 99, 40, 50]

    // Adicionar no final — O(1) amortizado
    numeros.push(60);  // [10, 20, 99, 40, 50, 60]

    // Inserir no meio — O(n), desloca elementos
    numeros.insert(1, 15);  // [10, 15, 20, 99, 40, 50, 60]

    // Remover por índice — O(n) no meio, O(1) no final
    numeros.pop();          // remove o último → 60
    numeros.remove(1);      // remove índice 1 → 15

    // Buscar elemento — O(n)
    let existe = numeros.contains(&40);              // true
    let indice = numeros.iter().position(|&x| x == 40);  // Some(3)
    let encontrado = numeros.iter().find(|&&x| x > 25);  // Some(&99)
    let _ = (existe, indice, encontrado);

    // Iterar sobre o vetor
    for num in &numeros {
        println!("{}", num);
    }

    // Iterar com índice
    for (i, num) in numeros.iter().enumerate() {
        println!("Índice {}: {}", i, num);
    }

    // Slicing — cria referência (não copia dados)
    let primeiros = &numeros[..2];     // [10, 20]
    let ultimos = &numeros[numeros.len()-2..];  // últimos 2
    let _ = (primeiros, ultimos);

    // Operações funcionais (iterators)
    let dobrados: Vec<i32> = numeros.iter().map(|x| x * 2).collect();
    let pares: Vec<&i32> = numeros.iter().filter(|x| *x % 2 == 0).collect();
    let soma: i32 = numeros.iter().sum();
    let _ = (dobrados, pares, soma);

    // Tamanho e capacidade
    let tamanho = numeros.len();        // quantidade de elementos
    let capacidade = numeros.capacity(); // capacidade alocada
    let _ = (tamanho, capacidade);

    // Cópia (clone cria vetor independente)
    let copia = numeros.clone();
    let _ = copia;

    // ============================
    // Strings em Rust
    // ============================
    let texto = String::from("Rust");
    let primeiro_char = texto.chars().nth(0);   // Some('R')
    let fatia = &texto[1..3];                   // "us"
    let tamanho_str = texto.len();              // 4 bytes
    let _ = (primeiro_char, fatia, tamanho_str);

    // Strings são imutáveis por padrão
    let mut mutavel = String::from("Rust");
    mutavel.replace_range(0..1, "r");  // "rust"

    // Rust diferencia String (heap, mutável) de &str (referência, imutável)
    let string_ref: &str = "imutável";  // &str — referência a dados estáticos
    let string_own: String = String::from("dinâmica");  // String — dados no heap
    let _ = (string_ref, string_own);
}
