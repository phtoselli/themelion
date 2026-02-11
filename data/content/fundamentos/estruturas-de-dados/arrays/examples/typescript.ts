// ============================
// Arrays em TypeScript
// ============================

// Criar array com tipagem
const numeros: number[] = [10, 20, 30, 40, 50];

// Acesso por índice — O(1)
const primeiro = numeros[0];                    // 10
const ultimo = numeros[numeros.length - 1];     // 50

// Modificar elemento — O(1)
numeros[2] = 99;  // [10, 20, 99, 40, 50]

// Adicionar no final — O(1) amortizado
numeros.push(60);  // [10, 20, 99, 40, 50, 60]

// Inserir no meio — O(n), desloca elementos
numeros.splice(1, 0, 15);  // [10, 15, 20, 99, 40, 50, 60]

// Remover por índice — O(n) no meio, O(1) no final
numeros.pop();        // remove o último → 60
numeros.splice(1, 1); // remove índice 1 → 15

// Buscar elemento — O(n)
const existe = numeros.includes(40);       // true
const indice = numeros.indexOf(40);        // 3
const encontrado = numeros.find(x => x > 25);  // 99

// Iterar sobre o array
for (const num of numeros) {
  console.log(num);
}

// Iterar com índice
numeros.forEach((num, i) => {
  console.log(`Índice ${i}: ${num}`);
});

// Slicing — cria subarray (cópia rasa)
const primeiros = numeros.slice(0, 2);    // [10, 20]
const ultimos = numeros.slice(-2);        // [40, 50]

// Operações funcionais (map, filter, reduce)
const dobrados = numeros.map(x => x * 2);
const pares = numeros.filter(x => x % 2 === 0);
const soma = numeros.reduce((acc, x) => acc + x, 0);

// Tamanho do array
const tamanho = numeros.length;  // 5

// Cópia (evitar referência compartilhada)
const copia = [...numeros];  // spread operator
// ou: const copia2 = numeros.slice();

// ============================
// Strings como arrays
// ============================
const texto: string = "TypeScript";
const primeiroChar = texto[0];          // "T"
const fatia = texto.slice(1, 5);        // "ypeS"
const tamanhoStr = texto.length;        // 10

// Strings são imutáveis em JavaScript/TypeScript
// texto[0] = "t";  → não tem efeito (ou TypeError em strict mode)
const novoTexto = "t" + texto.slice(1);  // "typeScript"

// Converter string para array de caracteres
const chars = [...texto];  // ["T", "y", "p", "e", "S", "c", "r", "i", "p", "t"]
