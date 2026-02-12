// ============================================================
// Big O Notation em Rust
// ============================================================

use std::collections::{HashMap, HashSet};

fn main() {
    // ============================================================
    // O(1) — Tempo constante
    // ============================================================

    // Acesso por índice em slice/array — endereço = base + (índice × tamanho)
    let numeros = [10, 20, 30, 40, 50];
    let _primeiro = numeros[0];         // Sempre 1 operação
    let _seguro = numeros.get(99);      // None (sem panic, diferente de numeros[99])

    // HashMap/HashSet — lookup direto por hash
    let mut cache: HashMap<&str, i32> = HashMap::new();
    cache.insert("alice", 100);
    let _valor = cache.get("alice");    // O(1) médio

    let presentes: HashSet<i32> = HashSet::from([1, 2, 3, 4, 5]);
    let _existe = presentes.contains(&3); // O(1) médio — hash, não busca linear

    // ============================================================
    // O(log n) — Logarítmica (divide o problema pela metade)
    // ============================================================

    // binary_search() em slice ordenada — método da stdlib
    let ordenados: Vec<i32> = (0..1_000_000).step_by(2).collect();
    match ordenados.binary_search(&742_000) {
        Ok(idx) => println!("Encontrado no índice {}", idx),
        Err(_) => println!("Não encontrado"),
    }
    // 500k elementos → ~19 comparações (log₂ 500.000 ≈ 19)

    // ============================================================
    // O(n) — Linear (olhar cada elemento uma vez)
    // ============================================================

    // Iterators: zero-cost abstractions — mesmo assembly que loop manual
    let dados = vec![42, 17, 93, 8, 55];

    let _maior = dados.iter().max();              // O(n) — percorre tudo
    let _soma: i32 = dados.iter().sum();          // O(n)
    let _pos = dados.iter().position(|&x| x == 93); // O(n) — busca linear

    // IMPORTANTE: iterators em Rust são lazy e zero-cost
    // .filter().map().sum() gera o MESMO código que um loop manual com if/acumulador
    let soma_pares: i32 = dados.iter()
        .filter(|&&x| x % 2 == 0)  // &&x: .iter() dá &i32, .filter() recebe &&i32
        .sum();                                   // O(n) — uma passada só
    let _ = soma_pares;

    // ============================================================
    // O(n log n) — Linearítmica (ordenação)
    // ============================================================

    let mut vetor = vec![64, 25, 12, 22, 11];
    vetor.sort();              // O(n log n) — estável (preserva ordem de iguais)
    vetor.sort_unstable();     // O(n log n) — instável, mas ~20% mais rápido (menos swaps)

    // ============================================================
    // O(n²) — Quadrática: loops aninhados
    // ============================================================

    // Verificar duplicatas — ingênuo O(n²)
    fn tem_duplicata_lento(lista: &[i32]) -> bool {
        for i in 0..lista.len() {                  // n vezes
            for j in (i + 1)..lista.len() {        // até n-1 vezes → total: O(n²)
                if lista[i] == lista[j] {
                    return true;
                }
            }
        }
        false
    }

    // Mesma tarefa em O(n) com HashSet
    fn tem_duplicata_rapido(lista: &[i32]) -> bool {
        let mut vistos = HashSet::new();           // O(n) espaço
        for &val in lista {
            if !vistos.insert(val) {               // insert retorna false se já existe
                return true;                       // O(1) por operação
            }
        }
        false
    }

    let arr = [1, 2, 3, 4, 2];
    let _ = tem_duplicata_lento(&arr);  // O(n²) tempo, O(1) espaço
    let _ = tem_duplicata_rapido(&arr); // O(n) tempo, O(n) espaço — trade-off

    // ============================================================
    // Complexidade de espaço: O(1) vs O(n)
    // ============================================================

    // O(1) espaço — variáveis fixas, independente da entrada
    fn soma_in_place(lista: &[i32]) -> i32 {
        let mut total = 0;              // 1 variável, sempre
        for &val in lista {
            total += val;
        }
        total
    }

    // O(n) espaço — cria Vec proporcional à entrada
    fn filtrar_pares(lista: &[i32]) -> Vec<i32> {
        lista.iter().filter(|&&x| x % 2 == 0).copied().collect()
    }

    let _ = soma_in_place(&numeros);
    let _ = filtrar_pares(&numeros);

    // ============================================================
    // Particularidades de Rust em Big O
    // ============================================================

    // 1. Ownership: sem cópias escondidas
    //    Passar &[i32] (referência) é O(1) — empresta sem copiar
    //    Chamar .clone() em Vec<i32> é O(n) — cópia EXPLÍCITA
    let original = vec![1, 2, 3, 4, 5];
    let _ref = &original;            // O(1) — apenas referência (sem alocação)
    let _copia = original.clone();   // O(n) — aloca + copia n elementos

    // 2. Iterators são zero-cost: mesma complexidade que loop manual
    //    O compilador otimiza .iter().filter().map() para um único loop
    //    Não há overhead de closures ou objetos intermediários

    // 3. sort() vs sort_unstable(): mesma complexidade O(n log n),
    //    mas sort_unstable() evita alocações extras → melhor constante

    // 4. contains() em slice é O(n), em HashSet é O(1)
    //    Mesmo pattern de Python/TypeScript: converta para HashSet se busca múltiplas vezes
    let lista = vec![1, 2, 3, 4, 5];
    let _lento = lista.contains(&5);                    // O(n)
    let set: HashSet<i32> = lista.into_iter().collect(); // O(n) uma vez
    let _rapido = set.contains(&5);                      // O(1)
}
