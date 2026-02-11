# ============================
# Arrays em Python (listas)
# ============================

# Criar array (Python usa "list" como array dinâmico)
numeros = [10, 20, 30, 40, 50]

# Acesso por índice — O(1)
primeiro = numeros[0]   # 10
ultimo = numeros[-1]    # 50 (índice negativo conta do fim)

# Modificar elemento — O(1)
numeros[2] = 99         # [10, 20, 99, 40, 50]

# Adicionar no final — O(1) amortizado
numeros.append(60)      # [10, 20, 99, 40, 50, 60]

# Inserir no meio — O(n), desloca elementos
numeros.insert(1, 15)   # [10, 15, 20, 99, 40, 50, 60]

# Remover por valor — O(n), busca + desloca
numeros.remove(99)      # [10, 15, 20, 40, 50, 60]

# Remover por índice — O(n) no meio, O(1) no final
removido = numeros.pop()    # remove o último → 60
removido = numeros.pop(1)   # remove índice 1 → 15

# Buscar elemento — O(n)
existe = 40 in numeros          # True
indice = numeros.index(40)      # 2

# Iterar sobre o array
for num in numeros:
    print(num)

# Iterar com índice
for i, num in enumerate(numeros):
    print(f"Índice {i}: {num}")

# Slicing — cria subarray (cópia rasa)
primeiros = numeros[:2]     # [10, 20]
ultimos = numeros[-2:]      # [40, 50]

# Operações funcionais
dobrados = [x * 2 for x in numeros]            # list comprehension
pares = [x for x in numeros if x % 2 == 0]     # filtro
soma = sum(numeros)                              # soma total

# Tamanho do array
tamanho = len(numeros)  # 4

# Cópia (evitar referência compartilhada)
copia = numeros.copy()  # ou numeros[:]

# ============================
# Strings como arrays
# ============================
texto = "Python"
primeiro_char = texto[0]    # "P"
fatia = texto[1:4]          # "yth"
tamanho_str = len(texto)    # 6

# Strings são imutáveis em Python
# texto[0] = "p"  → TypeError! Não pode modificar
novo_texto = "p" + texto[1:]  # cria nova string: "python"
