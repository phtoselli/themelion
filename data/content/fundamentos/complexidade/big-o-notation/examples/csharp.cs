// ============================
// Big O Notation em C#
// ============================

// --- O(1) — Constante: tempo não depende do tamanho da entrada ---

var numeros = new int[] { 10, 20, 30, 40, 50 };
int primeiro = numeros[0];                             // Acesso por índice: sempre 1 operação

var cache = new Dictionary<string, int> { ["user:42"] = 100 };
int valor = cache["user:42"];                          // Dictionary lookup: O(1) médio (hash)

var ids = new HashSet<int> { 1, 2, 3, 4, 5 };
bool existe = ids.Contains(3);                         // HashSet.Contains: O(1) médio

// --- O(log n) — Logarítmica: descarta metade a cada passo ---

int[] ordenado = { 2, 5, 8, 12, 16, 23, 38, 56, 72, 91 };
int indice = Array.BinarySearch(ordenado, 23);         // ~log₂(10) = 3-4 comparações

// SortedSet mantém ordem e busca em O(log n)
var sortedSet = new SortedSet<int> { 50, 20, 80, 10, 60 };
bool achou = sortedSet.Contains(60);                   // Árvore balanceada: O(log n)

// --- O(n) — Linear: percorre cada elemento uma vez ---

int[] dados = { 4, 7, 2, 9, 1, 5 };

// Loop explícito: O(n)
int maior = dados[0];
for (int i = 1; i < dados.Length; i++)
{
    if (dados[i] > maior) maior = dados[i];
}

// LINQ equivalente: também O(n), mas com overhead de delegates
int maiorLinq = dados.Max();

// FirstOrDefault percorre até encontrar — O(n) pior caso
int? primeiroPar = dados.FirstOrDefault(x => x % 2 == 0);

// --- O(n log n) — Linearítmica: melhor ordenação possível por comparação ---

int[] desordenado = { 38, 27, 43, 3, 9, 82, 10 };
Array.Sort(desordenado);                               // IntroSort internamente: O(n log n)

// LINQ OrderBy: também O(n log n), mas aloca nova coleção
int[] ordenadoLinq = desordenado.OrderBy(x => x).ToArray();

// --- O(n²) — Quadrática: loops aninhados ---

/// <summary>
/// Verifica duplicatas comparando todos os pares. O(n²) tempo, O(1) espaço.
/// </summary>
bool TemDuplicataLento(int[] arr)
{
    for (int i = 0; i < arr.Length; i++)            // n vezes
    {
        for (int j = i + 1; j < arr.Length; j++)    // até n-1 vezes
        {
            if (arr[i] == arr[j]) return true;      // total: O(n²) comparações
        }
    }
    return false;
}

/// <summary>
/// Mesma tarefa com HashSet: O(n) tempo, O(n) espaço. Trade-off clássico.
/// </summary>
bool TemDuplicataRapido(int[] arr)
{
    var vistos = new HashSet<int>();                 // O(n) espaço extra
    foreach (int num in arr)                        // O(n) tempo
    {
        if (!vistos.Add(num)) return true;          // Add retorna false se já existe — O(1)
    }
    return false;
}

// --- Complexidade de espaço ---

// O(1) espaço: variáveis fixas, independente do tamanho da entrada
int Somar(int[] arr)
{
    int total = 0;                                  // 1 variável, não importa o tamanho de arr
    foreach (int n in arr) total += n;
    return total;
}

// O(n) espaço: cria estrutura proporcional à entrada
int[] Duplicar(int[] arr)
{
    var copia = new int[arr.Length];                 // Aloca n elementos
    Array.Copy(arr, copia, arr.Length);
    return copia;
}

// --- Armadilha C#: concatenação de string em loop = O(n²) ---

// ERRADO: cada += cria nova string e copia tudo — O(n²)
string ResultadoLento(int n)
{
    string resultado = "";
    for (int i = 0; i < n; i++)
        resultado += i.ToString();                  // Copia toda a string a cada iteração
    return resultado;
}

// CORRETO: StringBuilder usa buffer interno — O(n)
string ResultadoRapido(int n)
{
    var sb = new System.Text.StringBuilder();
    for (int i = 0; i < n; i++)
        sb.Append(i);                               // Append amortizado O(1)
    return sb.ToString();
}

// --- Armadilha C#: LINQ deferred execution esconde complexidade ---

var lista = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

// query NÃO executa aqui — apenas define a transformação
var query = lista.Where(x => x > 3).Select(x => x * 2);

// Cada iteração RE-EXECUTA a query inteira — O(n) por iteração
foreach (var item in query) Console.Write($"{item} ");      // 1x O(n)
foreach (var item in query) Console.Write($"{item} ");      // 2x O(n) — re-executa!

// Materializar com ToList() evita re-execução
var materializado = query.ToList();                         // O(n) uma vez, depois O(1) acesso
