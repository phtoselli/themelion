# ==============================================================
# Codificação de Caracteres em Python
# ==============================================================
# Python 3 usa Unicode internamente para todas as strings (str).
# bytes é o tipo para dados binários/codificados.

# --- Strings são Unicode, bytes são codificados ---

texto = "Olá, São Paulo!"

# str → bytes: encode() transforma Unicode em sequência de bytes
utf8_bytes = texto.encode("utf-8")
print(utf8_bytes)
# b'Ol\xc3\xa1, S\xc3\xa3o Paulo!'
# 'á' = 2 bytes (0xC3, 0xA1), 'ã' = 2 bytes (0xC3, 0xA3)

print(f"Caracteres: {len(texto)}")      # 15 caracteres
print(f"Bytes UTF-8: {len(utf8_bytes)}") # 17 bytes (2 extras para á e ã)

# bytes → str: decode() reconstrói a string Unicode
texto_de_volta = utf8_bytes.decode("utf-8")
print(texto_de_volta)  # "Olá, São Paulo!"


# --- Comparando encodings ---

texto = "Programação"

utf8 = texto.encode("utf-8")
latin1 = texto.encode("latin-1")
utf16 = texto.encode("utf-16")

print(f"UTF-8:   {len(utf8)} bytes  → {list(utf8)}")
# UTF-8:   13 bytes  → [80, 114, 111, 103, 114, 97, 109, 97, 195, 167, 195, 163, 111]
# ç = [195, 167], ã = [195, 163] — 2 bytes cada

print(f"Latin-1: {len(latin1)} bytes → {list(latin1)}")
# Latin-1: 11 bytes → [80, 114, 111, 103, 114, 97, 109, 97, 231, 227, 111]
# ç = [231], ã = [227] — 1 byte cada (mais compacto, mas limitado)

print(f"UTF-16:  {len(utf16)} bytes → {list(utf16)}")
# UTF-16:  24 bytes → [255, 254, 80, 0, 114, 0, ...] — 2 bytes por caractere + BOM


# --- Mojibake: o que acontece com encoding errado ---

original = "São Paulo"
bytes_utf8 = original.encode("utf-8")

# Decodificar UTF-8 com Latin-1 → mojibake!
errado = bytes_utf8.decode("latin-1")
print(f"Correto: {original}")
print(f"Errado:  {errado}")
# Correto: São Paulo
# Errado:  SÃ£o Paulo
# 'ã' em UTF-8 = [0xC3, 0xA3] → Latin-1 lê como 'Ã' (0xC3) + '£' (0xA3)


# --- Code points Unicode ---

# ord() retorna o code point de um caractere
# chr() retorna o caractere de um code point
print(f"'A' = U+{ord('A'):04X}")    # U+0041
print(f"'é' = U+{ord('é'):04X}")    # U+00E9
print(f"'ã' = U+{ord('ã'):04X}")    # U+00E3
print(f"'€' = U+{ord('€'):04X}")    # U+20AC
print(f"'😀' = U+{ord('😀'):04X}")  # U+1F600

print(chr(0x00E9))  # 'é'
print(chr(0x1F600)) # '😀'

# Escape Unicode em strings
print("\u00e9")      # 'é' — escape de 4 dígitos (BMP)
print("\U0001F600")  # '😀' — escape de 8 dígitos (supplementary)


# --- Emojis e grafemas ---

# len() conta code points, não grafemas visuais
print(len("😀"))          # 1 — emoji simples = 1 code point
print(len("🇧🇷"))        # 2 — bandeira = 2 regional indicators
print(len("👨‍👩‍👧‍👦"))  # 7 — família = 4 emojis + 3 ZWJ (zero-width joiners)

# Para contar grafemas visuais, usar biblioteca (ex: grapheme)
# ou regex com \X (grapheme cluster)


# --- Ler arquivo com encoding específico ---

# Especificar encoding é essencial para evitar mojibake em arquivos
with open("dados.csv", "r", encoding="utf-8") as f:
    conteudo = f.read()

# Para arquivos legados em Latin-1:
# with open("legado.csv", "r", encoding="latin-1") as f:
#     conteudo = f.read()

# errors="replace" substitui bytes inválidos por '�' ao invés de crashear
# with open("misto.txt", "r", encoding="utf-8", errors="replace") as f:
#     conteudo = f.read()


# --- Detectar encoding (quando desconhecido) ---

# A stdlib não detecta automaticamente — usar chardet ou charset-normalizer
# pip install charset-normalizer

# from charset_normalizer import from_bytes
# resultado = from_bytes(bytes_desconhecidos)
# encoding_detectado = resultado.best().encoding
# texto = str(resultado.best())
