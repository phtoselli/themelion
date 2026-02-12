# ==============================================================
# XML em Python — xml.etree.ElementTree (stdlib)
# ==============================================================

import xml.etree.ElementTree as ET

# --- Parsing de string XML ---

xml_string = """<?xml version="1.0" encoding="UTF-8"?>
<biblioteca>
  <livro isbn="978-85-333-0227-3">
    <titulo>Dom Casmurro</titulo>
    <autor>Machado de Assis</autor>
    <ano>1899</ano>
  </livro>
  <livro isbn="978-85-359-0277-9">
    <titulo>Grande Sertão: Veredas</titulo>
    <autor>Guimarães Rosa</autor>
    <ano>1956</ano>
  </livro>
</biblioteca>"""

# fromstring retorna o elemento raiz diretamente
raiz = ET.fromstring(xml_string)

# --- Navegando pela árvore ---

# Iterar sobre filhos diretos
for livro in raiz.findall("livro"):
    isbn = livro.get("isbn")  # Ler atributo
    titulo = livro.find("titulo").text  # Ler texto do elemento
    autor = livro.find("autor").text
    ano = int(livro.find("ano").text)  # XML é tudo texto — converter manualmente
    print(f"[{isbn}] {titulo} — {autor} ({ano})")

# findall com XPath simples
# .// = busca recursiva em qualquer profundidade
todos_titulos = raiz.findall(".//titulo")
print([t.text for t in todos_titulos])
# ['Dom Casmurro', 'Grande Sertão: Veredas']


# --- Criando XML programaticamente ---

catalogo = ET.Element("catalogo")
catalogo.set("versao", "1.0")  # Atributo no elemento raiz

produto = ET.SubElement(catalogo, "produto")
produto.set("id", "1")

nome = ET.SubElement(produto, "nome")
nome.text = "Camiseta"

preco = ET.SubElement(produto, "preco")
preco.set("moeda", "BRL")
preco.text = "49.90"

# Serializar para string — indent() formata com indentação (Python 3.9+)
ET.indent(catalogo)
xml_saida = ET.tostring(catalogo, encoding="unicode", xml_declaration=True)
print(xml_saida)
# <?xml version='1.0' encoding='us-ascii'?>
# <catalogo versao="1.0">
#   <produto id="1">
#     <nome>Camiseta</nome>
#     <preco moeda="BRL">49.90</preco>
#   </produto>
# </catalogo>


# --- Modificando XML existente ---

raiz = ET.fromstring(xml_string)

# Adicionar elemento a um livro existente
primeiro_livro = raiz.find("livro")
editora = ET.SubElement(primeiro_livro, "editora")
editora.text = "Editora Garnier"

# Remover elemento
for livro in raiz.findall("livro"):
    ano = livro.find("ano")
    if ano is not None and int(ano.text) < 1900:
        livro.remove(ano)  # Remove o elemento <ano> de livros antes de 1900


# --- Caracteres especiais ---

# ElementTree escapa automaticamente ao serializar
texto = ET.Element("texto")
texto.text = 'Condição: x < 10 && nome = "João"'
print(ET.tostring(texto, encoding="unicode"))
# <texto>Condição: x &lt; 10 &amp;&amp; nome = "João"</texto>
# & e < são escapados automaticamente — nunca faça isso manualmente
