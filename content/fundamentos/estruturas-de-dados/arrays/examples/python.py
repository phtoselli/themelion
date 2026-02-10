# Arrays em Python (listas)

# Criar array
numeros = [1, 2, 3, 4, 5]

# Acessar por índice (O(1))
primeiro = numeros[0]  # 1
ultimo = numeros[-1]   # 5 (índice negativo conta do fim)

# Modificar elemento
numeros[2] = 10  # [1, 2, 10, 4, 5]

# Adicionar elemento ao final (O(1) amortizado)
numeros.append(6)  # [1, 2, 10, 4, 5, 6]

# Inserir no meio (O(n) - todos os elementos após precisam ser deslocados)
numeros.insert(2, 99)  # [1, 2, 99, 10, 4, 5, 6]

# Remover por valor (O(n) - precisa buscar + deslocar)
numeros.remove(99)  # [1, 2, 10, 4, 5, 6]

# Buscar elemento (O(n) - precisa iterar)
if 10 in numeros:
    print("10 está no array")

# Iterar sobre array
for num in numeros:
    print(num)

# Slicing (criar subarray)
primeiros_tres = numeros[:3]  # [1, 2, 10]

# Tamanho do array
tamanho = len(numeros)  # 6
