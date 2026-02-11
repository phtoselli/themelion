// ============================
// Arrays em C#
// ============================

// Array de tamanho fixo (tamanho definido na criação)
int[] numeros = { 10, 20, 30, 40, 50 };

// Acesso por índice — O(1)
int primeiro = numeros[0];                      // 10
int ultimo = numeros[numeros.Length - 1];        // 50

// Modificar elemento — O(1)
numeros[2] = 99;  // [10, 20, 99, 40, 50]

// Arrays fixos não têm Add/Remove — use List<T> para array dinâmico
var lista = new List<int> { 10, 20, 30, 40, 50 };

// Adicionar no final — O(1) amortizado
lista.Add(60);  // [10, 20, 30, 40, 50, 60]

// Inserir no meio — O(n), desloca elementos
lista.Insert(1, 15);  // [10, 15, 20, 30, 40, 50, 60]

// Remover por valor — O(n), busca + desloca
lista.Remove(30);  // [10, 15, 20, 40, 50, 60]

// Remover por índice — O(n) no meio
lista.RemoveAt(1);  // [10, 20, 40, 50, 60]

// Buscar elemento — O(n)
bool existe = lista.Contains(40);           // true
int indice = lista.IndexOf(40);             // 2
int? encontrado = lista.Find(x => x > 25); // 40

// Iterar sobre o array
foreach (int num in lista)
{
    Console.WriteLine(num);
}

// Iterar com índice
for (int i = 0; i < lista.Count; i++)
{
    Console.WriteLine($"Índice {i}: {lista[i]}");
}

// Slicing — GetRange cria sublista
var primeiros = lista.GetRange(0, 2);   // [10, 20]

// Operações funcionais (LINQ)
var dobrados = lista.Select(x => x * 2).ToList();
var pares = lista.Where(x => x % 2 == 0).ToList();
int soma = lista.Sum();

// Tamanho
int tamanho = lista.Count;  // 5

// Cópia (evitar referência compartilhada)
var copia = new List<int>(lista);  // cópia independente

// ============================
// Strings como arrays
// ============================
string texto = "CSharp";
char primeiroChar = texto[0];              // 'C'
string fatia = texto.Substring(1, 4);      // "Shar"
int tamanhoStr = texto.Length;             // 6

// Strings são imutáveis em C#
// texto[0] = 'c';  → Erro de compilação!
string novoTexto = "c" + texto.Substring(1);  // "cSharp"

// Converter string para array de caracteres
char[] chars = texto.ToCharArray();
