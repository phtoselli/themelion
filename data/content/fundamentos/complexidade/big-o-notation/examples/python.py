# ============================================================
# Big O Notation em Python
# ============================================================

from bisect import bisect_left

# ============================================================
# O(1) — Tempo constante
# ============================================================

# Acesso por índice em lista — endereço = base + (índice × tamanho)
numeros = [10, 20, 30, 40, 50]
primeiro = numeros[0]       # Sempre 1 operação, mesmo com 1 bilhão de elementos
ultimo = numeros[-1]        # Índice negativo também é O(1)

# Lookup em dict/set — hash do valor → posição direta
cache: dict[str, int] = {"alice": 100, "bob": 200}
valor = cache["alice"]      # O(1) médio (hash table internamente)

presentes: set[int] = {1, 2, 3, 4, 5}
existe = 3 in presentes     # O(1) médio — DIFERENTE de 'in' em lista (O(n))

# ============================================================
# O(log n) — Logarítmica (divide o problema pela metade)
# ============================================================

# Busca binária com bisect (stdlib) — lista DEVE estar ordenada
def busca_binaria(lista: list[int], alvo: int) -> int:
    """Retorna índice do alvo ou -1. O(log n) tempo, O(1) espaço."""
    idx = bisect_left(lista, alvo)
    if idx < len(lista) and lista[idx] == alvo:
        return idx
    return -1

ordenados = list(range(0, 1_000_000, 2))  # 500k elementos pares
resultado = busca_binaria(ordenados, 742_000)  # ~19 comparações (log₂ 500k ≈ 19)

# ============================================================
# O(n) — Linear (olhar cada elemento uma vez)
# ============================================================

def encontrar_maximo(lista: list[int]) -> int:
    """O(n) tempo, O(1) espaço — percorre tudo, guarda só o maior."""
    maior = lista[0]
    for valor in lista:     # n iterações
        if valor > maior:
            maior = valor
    return maior

# Pythonic: max() faz o mesmo internamente — também O(n)
maior = max(numeros)

# ARMADILHA: 'in' em lista é O(n), 'in' em set é O(1)
dados = list(range(100_000))
# 99_999 in dados           # O(n) — percorre até 100k elementos
# 99_999 in set(dados)      # O(1) — lookup direto por hash

# ============================================================
# O(n log n) — Linearítmica (melhor ordenação possível)
# ============================================================

# sorted() usa Timsort (merge sort + insertion sort otimizado)
desordenado = [64, 25, 12, 22, 11]
ordenado = sorted(desordenado)  # O(n log n) tempo, O(n) espaço (nova lista)
desordenado.sort()              # O(n log n) tempo, O(1) espaço (in-place)

# ============================================================
# O(n²) — Quadrática (cada elemento vs todos os outros)
# ============================================================

# Verificar duplicatas (ingênuo) — O(n²)
def tem_duplicata_lento(lista: list[int]) -> bool:
    """Dois loops aninhados: n × n comparações."""
    for i in range(len(lista)):             # n vezes
        for j in range(i + 1, len(lista)):  # até n-1 vezes
            if lista[i] == lista[j]:        # total: O(n²) comparações
                return True
    return False

# Mesma tarefa em O(n) usando set
def tem_duplicata_rapido(lista: list[int]) -> bool:
    """Set lookup é O(1) — total O(n) tempo, O(n) espaço."""
    vistos: set[int] = set()
    for valor in lista:
        if valor in vistos:     # O(1)
            return True
        vistos.add(valor)       # O(1) amortizado
    return False

# ============================================================
# Complexidade de espaço: O(1) vs O(n)
# ============================================================

# O(1) espaço — variáveis fixas independente da entrada
def soma_in_place(lista: list[int]) -> int:
    total = 0               # 1 variável, sempre
    for val in lista:
        total += val
    return total

# O(n) espaço — cria estrutura proporcional à entrada
def filtrar_pares(lista: list[int]) -> list[int]:
    return [x for x in lista if x % 2 == 0]  # nova lista cresce com n

# ============================================================
# Armadilhas de performance em Python
# ============================================================

# ARMADILHA 1: Concatenação de strings em loop — O(n²)
# Cada += cria uma NOVA string e copia tudo (strings são imutáveis)
palavras = ["Big", "O", "Notation"]

# resultado = ""
# for p in palavras:
#     resultado += p           # O(n²) — copia tudo a cada iteração

resultado = "".join(palavras)  # O(n) — aloca tamanho final de uma vez

# ARMADILHA 2: Busca O(n) escondida dentro de loop O(n) = O(n²)
lista_a = list(range(10_000))
lista_b = list(range(5_000, 15_000))

# intersecao = [x for x in lista_a if x in lista_b]  # O(n²)!
set_b = set(lista_b)                                    # O(n) uma vez
intersecao = [x for x in lista_a if x in set_b]         # O(n) total

# ARMADILHA 3: list.insert(0, x) é O(n), não O(1)
# Cada inserção no início desloca TODOS os elementos
# Para inserções frequentes no início, use collections.deque (O(1) nas pontas)
