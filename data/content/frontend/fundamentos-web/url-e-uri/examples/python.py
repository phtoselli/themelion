# ==============================================================
# URL em Python — urllib.parse (stdlib)
# ==============================================================

from urllib.parse import (
    urlparse,
    urlunparse,
    urlencode,
    quote,
    unquote,
    parse_qs,
    urljoin,
)

# --- Parsing de URL ---

url = "https://loja.com:8443/produtos/livros?categoria=ficção&ordem=preço&page=2#resultados"

# urlparse decompõe o URL em componentes nomeados
parsed = urlparse(url)

print(parsed.scheme)    # "https"
print(parsed.hostname)  # "loja.com"
print(parsed.port)      # 8443
print(parsed.path)      # "/produtos/livros"
print(parsed.query)     # "categoria=ficção&ordem=preço&page=2"
print(parsed.fragment)  # "resultados"

# parse_qs transforma a query string em dicionário
# Cada valor é uma lista (pois parâmetros podem repetir)
params = parse_qs(parsed.query)
print(params)
# {'categoria': ['ficção'], 'ordem': ['preço'], 'page': ['2']}
print(params["categoria"][0])  # "ficção"


# --- Construção de URL ---

# urlencode monta query string a partir de dicionário
parametros = {
    "q": "programação Python",
    "cidade": "São Paulo",
    "page": 1,
}

query = urlencode(parametros)
print(query)
# "q=programa%C3%A7%C3%A3o+Python&cidade=S%C3%A3o+Paulo&page=1"
# Espaços viram + na query string (padrão application/x-www-form-urlencoded)

# Montar URL completo
url_completo = urlunparse((
    "https",              # scheme
    "api.exemplo.com",    # netloc
    "/v2/busca",          # path
    "",                   # params (raramente usado)
    query,                # query
    "",                   # fragment
))
print(url_completo)
# "https://api.exemplo.com/v2/busca?q=programa%C3%A7%C3%A3o+Python&cidade=S%C3%A3o+Paulo&page=1"


# --- Encoding e decoding ---

# quote() codifica string para uso em URLs
# safe="" codifica TODOS os caracteres especiais
print(quote("São Paulo & Rio", safe=""))
# "S%C3%A3o%20Paulo%20%26%20Rio"

# safe="/" preserva barras — útil para paths
print(quote("/produtos/São Paulo/livros", safe="/"))
# "/produtos/S%C3%A3o%20Paulo/livros"

# unquote() decodifica
print(unquote("S%C3%A3o%20Paulo"))
# "São Paulo"

# Codificar URL completo como parâmetro — TUDO precisa ser codificado
url_destino = "https://outro.com/pagina?id=1&tipo=A"
url_redirect = f"https://meu.com/redirect?destino={quote(url_destino, safe='')}"
print(url_redirect)
# "https://meu.com/redirect?destino=https%3A%2F%2Foutro.com%2Fpagina%3Fid%3D1%26tipo%3DA"


# --- Resolução de URLs relativos ---

base = "https://meusite.com/blog/artigos/"

print(urljoin(base, "xml.html"))           # https://meusite.com/blog/artigos/xml.html
print(urljoin(base, "../sobre.html"))       # https://meusite.com/blog/sobre.html
print(urljoin(base, "/contato"))            # https://meusite.com/contato
print(urljoin(base, "//cdn.site.com/x.js")) # https://cdn.site.com/x.js


# --- Parâmetros repetidos (arrays) ---

from urllib.parse import urlencode

# doseq=True permite listas como valor (gera chave repetida)
params_com_lista = {
    "tag": ["python", "backend", "api"],
    "limit": 10,
}

query_com_lista = urlencode(params_com_lista, doseq=True)
print(query_com_lista)
# "tag=python&tag=backend&tag=api&limit=10"
