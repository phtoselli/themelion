// ==============================================================
// JSON em TypeScript — JSON global + tipos estáticos
// ==============================================================

// --- Desserialização: string JSON → objeto ---

const jsonString = `{
  "nome": "Maria Silva",
  "idade": 28,
  "desenvolvedor": true,
  "linguagens": ["TypeScript", "Python", "Go"],
  "endereco": {
    "cidade": "São Paulo",
    "estado": "SP"
  }
}`;

// JSON.parse retorna 'any' — TypeScript não sabe o formato em runtime
const dados = JSON.parse(jsonString);
// typeof dados === "object", mas TypeScript não conhece as propriedades

// Definir interface para tipar o resultado
interface Usuario {
  nome: string;
  idade: number;
  desenvolvedor: boolean;
  linguagens: string[];
  endereco: {
    cidade: string;
    estado: string;
  };
}

// Type assertion — confia que o JSON tem a estrutura esperada
const usuario = JSON.parse(jsonString) as Usuario;
console.log(usuario.nome); // "Maria Silva" — agora com autocomplete
console.log(usuario.linguagens[0]); // "TypeScript"


// --- Parsing seguro com validação ---

// Type assertion não valida em runtime — dados de API podem estar errados
// Para validação real, use type guards ou libs como zod/valibot

function isUsuario(obj: unknown): obj is Usuario {
  if (typeof obj !== "object" || obj === null) return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.nome === "string" &&
    typeof o.idade === "number" &&
    typeof o.desenvolvedor === "boolean" &&
    Array.isArray(o.linguagens)
  );
}

function parseUsuario(json: string): Usuario | null {
  try {
    const parsed: unknown = JSON.parse(json);
    return isUsuario(parsed) ? parsed : null;
  } catch {
    return null; // JSON malformado
  }
}


// --- Serialização: objeto → string JSON ---

const config = {
  tema: "escuro",
  idioma: "pt-BR",
  fontSize: 16,
  atalhos: {
    salvar: "Ctrl+S",
    buscar: "Ctrl+F",
  },
};

// JSON.stringify converte para string
const json = JSON.stringify(config);
// '{"tema":"escuro","idioma":"pt-BR","fontSize":16,...}'

// Com formatação — útil para debug/exibição
const jsonFormatado = JSON.stringify(config, null, 2);
console.log(jsonFormatado);

// Segundo argumento: replacer — filtra ou transforma propriedades
const jsonParcial = JSON.stringify(config, ["tema", "idioma"]);
// '{"tema":"escuro","idioma":"pt-BR"}' — só inclui as chaves listadas


// --- Fetch API + JSON (caso mais comum no frontend) ---

interface Produto {
  id: number;
  nome: string;
  preco: number;
}

// GET — receber JSON
async function buscarProdutos(): Promise<Produto[]> {
  const response = await fetch("/api/produtos");

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  // .json() desserializa automaticamente — não precisa de JSON.parse
  return response.json() as Promise<Produto[]>;
}

// POST — enviar JSON
async function criarProduto(produto: Omit<Produto, "id">): Promise<Produto> {
  const response = await fetch("/api/produtos", {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // Header obrigatório
    body: JSON.stringify(produto), // Serializar para string no body
  });

  return response.json() as Promise<Produto>;
}


// --- localStorage com JSON ---

// localStorage só aceita strings — JSON faz a ponte objeto ↔ string
function salvarConfig<T>(chave: string, valor: T): void {
  localStorage.setItem(chave, JSON.stringify(valor));
}

function lerConfig<T>(chave: string): T | null {
  const salvo = localStorage.getItem(chave);
  if (salvo === null) return null;

  try {
    return JSON.parse(salvo) as T;
  } catch {
    return null; // JSON corrompido no localStorage
  }
}

// Uso
salvarConfig("preferencias", { tema: "escuro", fontSize: 16 });
const prefs = lerConfig<{ tema: string; fontSize: number }>("preferencias");


// --- Armadilhas com Dates ---

const evento = {
  nome: "Deploy",
  data: new Date("2025-01-15T14:30:00Z"),
};

const serializado = JSON.stringify(evento);
// '{"nome":"Deploy","data":"2025-01-15T14:30:00.000Z"}'
// Date virou string ISO 8601 automaticamente (via .toJSON())

const parseado = JSON.parse(serializado);
console.log(typeof parseado.data); // "string" — NÃO é Date!
console.log(parseado.data instanceof Date); // false

// Para restaurar Dates, usar reviver (segundo argumento de JSON.parse)
const comDatas = JSON.parse(serializado, (chave, valor) => {
  // Detectar strings no formato ISO 8601 e converter para Date
  if (typeof valor === "string" && /^\d{4}-\d{2}-\d{2}T/.test(valor)) {
    return new Date(valor);
  }
  return valor;
});

console.log(comDatas.data instanceof Date); // true
