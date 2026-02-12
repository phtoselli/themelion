// ============================================================
// Big O Notation em TypeScript
// ============================================================

// O(1) — Tempo constante: não depende do tamanho da entrada
const numeros = [10, 20, 30, 40, 50];
numeros[0];                                   // Acesso por índice: sempre 1 operação
const mapa = new Map([["a", 1], ["b", 2]]);
mapa.get("a");                                // Map.get() é O(1) — hash table

// ============================================================
// O(log n) — Logarítmica: descarta metade a cada passo
// ============================================================

function buscaBinaria(arr: number[], alvo: number): number {
  let esq = 0;
  let dir = arr.length - 1;
  while (esq <= dir) {
    const meio = Math.floor((esq + dir) / 2);
    if (arr[meio] === alvo) return meio;
    if (arr[meio] < alvo) esq = meio + 1;   // Descarta metade esquerda
    else dir = meio - 1;                     // Descarta metade direita
  }
  return -1; // 1 bilhão de elementos → máximo ~30 comparações
}

// ============================================================
// O(n) — Linear: percorre cada elemento uma vez
// ============================================================

function encontrarMaior(arr: number[]): number {
  let maior = arr[0];
  for (const val of arr) {         // n iterações
    if (val > maior) maior = val;
  }
  return maior;
}
// .find(), .filter(), .map(), .includes(), .indexOf() — todos O(n)

// ============================================================
// O(n log n) — Array.sort() usa TimSort no V8
// ============================================================

const desordenado = [38, 27, 43, 3, 9, 82, 10];
[...desordenado].sort((a, b) => a - b);   // O(n log n)
// CUIDADO: sem callback, .sort() ordena como strings! [3, 10] → [10, 3]

// ============================================================
// O(n²) — Loops aninhados
// ============================================================

function temDuplicata(arr: number[]): boolean {
  for (let i = 0; i < arr.length; i++) {         // n vezes
    for (let j = i + 1; j < arr.length; j++) {   // até n-1 vezes
      if (arr[i] === arr[j]) return true;         // total: O(n²)
    }
  }
  return false;
}

// ============================================================
// Armadilha: complexidade escondida em métodos built-in
// ============================================================

// PARECE O(n), mas é O(n²) — includes() é O(n) dentro de loop O(n)
function unicosErrado(arr: number[]): number[] {
  const res: number[] = [];
  for (const val of arr) {
    if (!res.includes(val)) res.push(val);  // O(n) × O(n) = O(n²)
  }
  return res;
}

// CORRETO — O(n): Set.has() é O(1)
function unicosCerto(arr: number[]): number[] {
  return [...new Set(arr)];  // Set garante unicidade em O(n) total
}

// ============================================================
// Complexidade de espaço: O(1) vs O(n)
// ============================================================

// O(1) espaço: variáveis fixas, independente da entrada
function somaArray(arr: number[]): number {
  let total = 0;
  for (const val of arr) total += val;
  return total;
}

// O(n) espaço: estrutura proporcional à entrada
function inverter<T>(arr: readonly T[]): T[] {
  const res: T[] = [];  // Cresce até n elementos
  for (let i = arr.length - 1; i >= 0; i--) res.push(arr[i]);
  return res;
}

// ============================================================
// Comparação prática: includes() O(n) vs Set.has() O(1)
// ============================================================

const grande = Array.from({ length: 100_000 }, (_, i) => i);

console.time("includes");
grande.includes(99_999);     // O(n): percorre até 100k elementos
console.timeEnd("includes");

const conjunto = new Set(grande);  // O(n) para construir (uma vez)
console.time("Set.has");
conjunto.has(99_999);              // O(1): lookup direto por hash
console.timeEnd("Set.has");
// Regra: se vai buscar múltiplas vezes, converta para Set primeiro
