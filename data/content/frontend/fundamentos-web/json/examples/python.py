# ==============================================================
# JSON em Python — módulo json (stdlib)
# ==============================================================

import json

# --- Desserialização: string JSON → objeto Python ---

json_string = '''
{
  "nome": "Maria Silva",
  "idade": 28,
  "desenvolvedor": true,
  "linguagens": ["TypeScript", "Python", "Go"],
  "endereco": {
    "cidade": "São Paulo",
    "estado": "SP"
  }
}
'''

# json.loads = load string → converte JSON para dict/list Python
dados = json.loads(json_string)

# Mapeamento de tipos JSON → Python:
# JSON object  → dict
# JSON array   → list
# JSON string  → str
# JSON number  → int ou float
# JSON true    → True (note a capitalização)
# JSON false   → False
# JSON null    → None

print(dados["nome"])                   # "Maria Silva"
print(dados["linguagens"][0])          # "TypeScript"
print(dados["endereco"]["cidade"])     # "São Paulo"
print(type(dados["desenvolvedor"]))    # <class 'bool'>


# --- Serialização: objeto Python → string JSON ---

usuario = {
    "nome": "João Santos",
    "idade": 32,
    "ativo": True,
    "notas": [9.5, 8.0, 10.0],
    "perfil": None,  # None vira null no JSON
}

# json.dumps = dump string
# ensure_ascii=False preserva acentos (senão "São" vira "S\u00e3o")
# indent=2 formata com indentação
json_saida = json.dumps(usuario, ensure_ascii=False, indent=2)
print(json_saida)

# Sem indent — compacto para transmissão
json_compacto = json.dumps(usuario, ensure_ascii=False, separators=(",", ":"))
# '{"nome":"João Santos","idade":32,"ativo":true,"notas":[9.5,8.0,10.0],"perfil":null}'
# separators remove espaços extras — ~10% menor para payloads grandes


# --- Arquivos JSON ---

# Salvar
with open("config.json", "w", encoding="utf-8") as f:
    json.dump(usuario, f, ensure_ascii=False, indent=2)

# Ler
with open("config.json", "r", encoding="utf-8") as f:
    config = json.load(f)  # load (sem s) lê de arquivo, loads lê de string


# --- Tratamento de erros ---

json_invalido = '{"nome": "Maria", "idade": 28,}'  # Trailing comma = inválido

try:
    dados = json.loads(json_invalido)
except json.JSONDecodeError as e:
    print(f"JSON inválido na posição {e.pos}: {e.msg}")
    # JSON inválido na posição 33: Expecting property name enclosed in double quotes


# --- Serialização customizada ---

from datetime import datetime, date

# JSON não tem tipo Date — precisa de serialização customizada
class DateEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (datetime, date)):
            return obj.isoformat()  # Converte para ISO 8601
        return super().default(obj)

evento = {
    "nome": "Deploy v2.0",
    "data": datetime(2025, 1, 15, 14, 30),
    "tags": ["producao", "release"],
}

# cls= define o encoder customizado
print(json.dumps(evento, cls=DateEncoder, ensure_ascii=False, indent=2))
# {
#   "nome": "Deploy v2.0",
#   "data": "2025-01-15T14:30:00",
#   "tags": ["producao", "release"]
# }


# --- Validação de estrutura com tipos ---

def validar_usuario(dados: dict) -> bool:
    """Validação manual — para schemas complexos, use jsonschema ou pydantic."""
    campos = {"nome": str, "idade": int, "ativo": bool}
    for campo, tipo in campos.items():
        if campo not in dados:
            return False
        if not isinstance(dados[campo], tipo):
            return False
    return True

print(validar_usuario({"nome": "Maria", "idade": 28, "ativo": True}))   # True
print(validar_usuario({"nome": "Maria", "idade": "28", "ativo": True})) # False — idade é str
