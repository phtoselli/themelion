// Arrays em TypeScript

// Criar array
const numeros: number[] = [1, 2, 3, 4, 5];

// Acessar por índice (O(1))
const primeiro = numeros[0]; // 1
const ultimo = numeros[numeros.length - 1]; // 5

// Modificar elemento
numeros[2] = 10; // [1, 2, 10, 4, 5]

// Adicionar elemento ao final (O(1) amortizado)
numeros.push(6); // [1, 2, 10, 4, 5, 6]

// Inserir no meio (O(n) - todos os elementos após precisam ser deslocados)
numeros.splice(2, 0, 99); // [1, 2, 99, 10, 4, 5, 6]

// Remover elemento (O(n) - precisa deslocar)
numeros.splice(2, 1); // [1, 2, 10, 4, 5, 6]

// Buscar elemento (O(n) - precisa iterar)
const existe = numeros.includes(10); // true
const indice = numeros.indexOf(10); // 2 (-1 se não encontrar)

// Iterar sobre array
numeros.forEach(num => {
  console.log(num);
});

// Map, filter, reduce (operações funcionais)
const dobrados = numeros.map(x => x * 2); // [2, 4, 20, 8, 10, 12]
const pares = numeros.filter(x => x % 2 === 0); // [2, 10, 4, 6]
const soma = numeros.reduce((acc, x) => acc + x, 0); // 28

// Slicing (criar subarray)
const primeirosTres = numeros.slice(0, 3); // [1, 2, 10]

// Tamanho do array
const tamanho = numeros.length; // 6
