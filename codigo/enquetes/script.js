// ===== Guilherme Lino de Castro Souza ===== 
// ===== Hub de Estudos - Enquetes de aulão =====


const CHAVE_DADOS = "hub_enquetes";
const CHAVE_VOTOS = "hub_enquetes_votos"; // { idEnquete: idOpcao } -> 1 voto por enquete neste navegador

// Usado só se o fetch do enquetes.json falhar (ex.: abrir o HTML direto com file://)
const DADOS_PADRAO = [
  {
    id: 1,
    titulo: "Qual tema você gostaria de revisar no aulão?",
    materia: "AEDs",
    opcoes: [
      { id: 1, tema: "Recursividade", votos: 15 },
      { id: 2, tema: "Ponteiros", votos: 9 },
      { id: 3, tema: "Arquivos", votos: 6 }
    ],
    ativa: true
  }
];

let enquetes = [];
let enqueteVotando = null;

// ========== Utilidades =========
const $ = (id) => document.getElementById(id);

function totalVotos(enquete) {
  return enquete.opcoes.reduce((soma, o) => soma + o.votos, 0);
}

function lerVotos() {
  try { return JSON.parse(localStorage.getItem(CHAVE_VOTOS)) || {}; }
  catch { return {}; }
}

function salvar() {
  localStorage.setItem(CHAVE_DADOS, JSON.stringify(enquetes));
}

function proximoId(lista) {
  return lista.length ? Math.max(...lista.map((x) => x.id)) + 1 : 1;
}

function mostrarTela(id) {
  ["tela-lista", "tela-criar", "tela-votar", "tela-resultado"].forEach((t) => {
    $(t).hidden = t !== id;
  });
}

function el(tag, texto, classe) {
  const e = document.createElement(tag);
  if (texto !== undefined) e.textContent = texto; // textContent evita injeção de HTML
  if (classe) e.className = classe;
  return e;
}

// =========== Carregamento do JSON ============
async function carregarDados() {
  const salvo = localStorage.getItem(CHAVE_DADOS);
  if (salvo) {
    try { enquetes = JSON.parse(salvo); return; } catch { /* segue para o JSON */ }
  }
  await carregarDoArquivo();
}

async function carregarDoArquivo() {
  try {
    const resp = await fetch("enquetes.json");
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    enquetes = await resp.json();
    console.log("Dados carregados de enquetes.json");
  } catch (erro) {
    console.warn("Não foi possível ler enquetes.json (use um servidor local). Usando dados embutidos.", erro);
    enquetes = JSON.parse(JSON.stringify(DADOS_PADRAO));
  }
  salvar();
}

// ============ Tela: listagem ============
function renderLista() {
  const lista = $("lista");
  lista.innerHTML = "";

  if (enquetes.length === 0) {
    lista.appendChild(el("p", "Nenhuma enquete cadastrada."));
    return;
  }

  const votos = lerVotos();

  enquetes.forEach((enq) => {
    const card = el("div", undefined, "card");
    card.appendChild(el("h3", enq.titulo));

    const p1 = el("p", "Matéria: " + enq.materia + " | Votos: " + totalVotos(enq) + " ");
    p1.appendChild(el("span", enq.ativa ? "ATIVA" : "ENCERRADA", enq.ativa ? "tag" : "tag encerrada"));
    card.appendChild(p1);

    const acoes = el("div");

    if (enq.ativa) {
      const jaVotou = votos[enq.id] !== undefined;
      const btnVotar = el("button", jaVotou ? "Você já votou" : "Votar");
      btnVotar.type = "button";
      btnVotar.disabled = jaVotou;
      btnVotar.addEventListener("click", () => abrirVotar(enq.id));
      acoes.appendChild(btnVotar);
    }

    const btnRes = el("button", "Ver resultado");
    btnRes.type = "button";
    btnRes.addEventListener("click", () => abrirResultado(enq.id));
    acoes.appendChild(btnRes);

    const btnStatus = el("button", enq.ativa ? "Encerrar" : "Reabrir");
    btnStatus.type = "button";
    btnStatus.addEventListener("click", () => {
      enq.ativa = !enq.ativa;
      salvar();
      renderLista();
    });
    acoes.appendChild(btnStatus);

    const btnExcluir = el("button", "Excluir");
    btnExcluir.type = "button";
    btnExcluir.addEventListener("click", () => {
      if (confirm("Excluir a enquete \"" + enq.titulo + "\"?")) {
        enquetes = enquetes.filter((x) => x.id !== enq.id);
        const v = lerVotos();
        delete v[enq.id];
        localStorage.setItem(CHAVE_VOTOS, JSON.stringify(v));
        salvar();
        renderLista();
      }
    });
    acoes.appendChild(btnExcluir);

    card.appendChild(acoes);
    lista.appendChild(card);
  });
}

// ========== Tela: criar enquete ============
function adicionarCampoOpcao(valor) {
  const linha = el("div", undefined, "opcao-linha");
  const input = document.createElement("input");
  input.type = "text";
  input.maxLength = 80;
  input.placeholder = "Ex.: Recursividade";
  input.value = valor || "";
  const remover = el("button", "X");
  remover.type = "button";
  remover.title = "Remover opção";
  remover.addEventListener("click", () => {
    if (document.querySelectorAll("#opcoes-campos .opcao-linha").length > 2) {
      linha.remove();
    } else {
      $("erro").textContent = "A enquete precisa de pelo menos 2 opções.";
    }
  });
  linha.appendChild(input);
  linha.appendChild(remover);
  $("opcoes-campos").appendChild(linha);
}

function abrirCriar() {
  $("form-enquete").reset();
  $("opcoes-campos").innerHTML = "";
  $("erro").textContent = "";
  adicionarCampoOpcao();
  adicionarCampoOpcao();
  mostrarTela("tela-criar");
  $("titulo").focus();
}

function cancelarCriacao() {
  // descarta os dados preenchidos e volta para a tela anterior
  $("form-enquete").reset();
  $("opcoes-campos").innerHTML = "";
  $("erro").textContent = "";
  voltarLista();
}

function criarEnquete(evento) {
  evento.preventDefault();
  const titulo = $("titulo").value.trim();
  const materia = $("materia").value;
  const temas = Array.from(document.querySelectorAll("#opcoes-campos input"))
    .map((i) => i.value.trim())
    .filter((t) => t !== "");

  // Validações
  if (titulo.length < 5) return ($("erro").textContent = "Informe um título com pelo menos 5 caracteres.");
  if (!materia) return ($("erro").textContent = "Selecione a matéria.");
  if (temas.length < 2) return ($("erro").textContent = "Informe pelo menos 2 opções de tema.");
  const minusculas = temas.map((t) => t.toLowerCase());
  if (new Set(minusculas).size !== minusculas.length) {
    return ($("erro").textContent = "Existem opções de tema repetidas.");
  }

  const nova = {
    id: proximoId(enquetes),
    titulo: titulo,
    materia: materia,
    opcoes: temas.map((tema, i) => ({ id: i + 1, tema: tema, votos: 0 })),
    ativa: true
  };
  enquetes.push(nova);
  salvar();
  voltarLista();
}

// ========= Tela: votar ==============
function abrirVotar(id) {
  enqueteVotando = enquetes.find((e) => e.id === id);
  if (!enqueteVotando) return;
  $("votar-titulo").textContent = enqueteVotando.titulo;
  $("votar-materia").textContent = "Matéria: " + enqueteVotando.materia;
  $("erro-voto").textContent = "";

  const area = $("votar-opcoes");
  area.innerHTML = "";
  enqueteVotando.opcoes.forEach((o) => {
    const label = el("label", undefined, "opcao-voto");
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "opcao";
    radio.value = o.id;
    label.appendChild(radio);
    label.appendChild(document.createTextNode(" " + o.tema));
    area.appendChild(label);
  });
  mostrarTela("tela-votar");
}

function confirmarVoto(evento) {
  evento.preventDefault();
  const marcada = document.querySelector("#votar-opcoes input:checked");
  if (!marcada) return ($("erro-voto").textContent = "Escolha uma opção para votar.");

  const opcao = enqueteVotando.opcoes.find((o) => o.id === Number(marcada.value));
  opcao.votos += 1;
  salvar();

  const votos = lerVotos();
  votos[enqueteVotando.id] = opcao.id;
  localStorage.setItem(CHAVE_VOTOS, JSON.stringify(votos));

  abrirResultado(enqueteVotando.id);
}

// ============ Tela: resultado ============
function abrirResultado(id) {
  const enq = enquetes.find((e) => e.id === id);
  if (!enq) return;
  const total = totalVotos(enq);

  $("res-titulo").textContent = enq.titulo;
  $("res-materia").textContent = enq.materia;
  $("res-total").textContent = total;

  const grafico = $("res-grafico");
  grafico.innerHTML = "";

  enq.opcoes.forEach((o) => {
    const pct = total === 0 ? 0 : (o.votos / total) * 100;
    const linha = el("div", undefined, "linha-resultado");
    const texto = o.tema + ": " + o.votos + (o.votos === 1 ? " voto" : " votos") +
                  " (" + Math.round(pct) + "%)";
    linha.appendChild(el("div", texto));

    const trilho = el("div", undefined, "trilho");
    const barra = el("div", undefined, "barra-preenchida");
    barra.style.width = pct + "%";
    trilho.appendChild(barra);
    linha.appendChild(trilho);
    grafico.appendChild(linha);
  });

  mostrarTela("tela-resultado");
}

// ============= Navegação =============
function voltarLista() {
  renderLista();
  mostrarTela("tela-lista");
}

function exportarJSON() {
  const blob = new Blob([JSON.stringify(enquetes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "enquetes.json";
  a.click();
  URL.revokeObjectURL(url);
}

async function restaurar() {
  if (!confirm("Isso apaga as alterações e recarrega o enquetes.json original. Continuar?")) return;
  localStorage.removeItem(CHAVE_DADOS);
  localStorage.removeItem(CHAVE_VOTOS);
  await carregarDoArquivo();
  voltarLista();
}

// ============= Inicialização ============
document.addEventListener("DOMContentLoaded", async () => {
  $("btn-nova").addEventListener("click", abrirCriar);
  $("btn-exportar").addEventListener("click", exportarJSON);
  $("btn-resetar").addEventListener("click", restaurar);
  $("btn-add-opcao").addEventListener("click", () => adicionarCampoOpcao());
  $("btn-cancelar").addEventListener("click", cancelarCriacao);
  $("form-enquete").addEventListener("submit", criarEnquete);
  $("form-voto").addEventListener("submit", confirmarVoto);
  $("btn-votar-voltar").addEventListener("click", voltarLista);
  $("btn-res-voltar").addEventListener("click", voltarLista);

  await carregarDados();
  voltarLista();
});
