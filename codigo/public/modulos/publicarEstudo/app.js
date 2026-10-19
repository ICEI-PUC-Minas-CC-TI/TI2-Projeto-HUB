const API_URL = "http://localhost:3000/estudos";
const API_URL_IMPORT = "http://localhost:3000/importEstudos";

function nomeDisciplina(id) {
  if (id == 1) return "CALC2 - Calculo II";
  if (id == 2) return "AEDS1 - Algoritmos e Estruturas de Dados I";
  if (id == 3) return "FIS1 - Física Teórica I";
  if (id == 4) return "PROG1 - Programação Modular";
}

function carregarEstudos() {
  fetch(API_URL)
    .then(function (resposta) {
      return resposta.json();
    })
    .then(function (dados) {
      const tabela = document.getElementById("tabela-estudos");
      tabela.innerHTML = "";

      if (dados.length === 0) {
        tabela.innerHTML =
          '<tr><td colspan="6" class="text-center text-muted">Nenhum estudo cadastrado.</td></tr>';
        return;
      }

      for (let i = 0; i < dados.length; i++) {
        item = dados[i];

        let caminhosFormatados = "";
        if (Array.isArray(item.ArquivoPath)) {
          caminhosFormatados = item.ArquivoPath.join("<br>");
        } else if (item.ArquivoPath) {
          caminhosFormatados = item.ArquivoPath;
        } else {
          caminhosFormatados = '<span class="text-muted">Nenhum arquivo</span>';
        }

        const linha = document.createElement("tr");
        linha.innerHTML = `
          <td><strong>${item.id}</strong></td>
          <td>${item.titulo}</td>
          <td>${item.descricao}</td>
          <td><span class="badge bg-secondary">${nomeDisciplina(item.diciplina)}</span></td>
          <td><code>${caminhosFormatados}</code></td>
          <td class="text-center">
            <button class="btn btn-sm btn-outline-primary me-1" onclick="prepararEdicao(${item.id})">Editar</button>
            <button class="btn btn-sm btn-outline-danger" onclick="excluirEstudo(${item.id})">Excluir</button>
          </td>
        `;

        tabela.appendChild(linha);
      }
    })
    .catch(function (erro) {
      console.error("Erro ao carregar estudos:", erro);
    });
}

function salvarEstudo(event) {
  // Prevents the form from reloading mid POST/PUT
  event.preventDefault();

  const id = document.getElementById("estudo-id").value;
  const titulo = document.getElementById("titulo").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const diciplina = parseInt(document.getElementById("diciplina").value, 10);

  const caminhoManual = document.getElementById("caminho-manual").value.trim();

  let caminhos = [];
  if (caminhoManual !== "") {
    caminhos.push(caminhoManual);
  }

  const novoEstudo = {
    titulo: titulo,
    descricao: descricao,
    diciplina: diciplina,
    ArquivoPath: caminhos,
  };


  if (id === "") {
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novoEstudo),
    })
      .then(function (resposta) {
        return resposta.json();
      })
      .then(function () {
        alert("Estudo publicado com sucesso!");
        limparFormulario();
        carregarEstudos();
      })
      .catch(function (erro) {
        alert("Erro ao publicar estudo: " + erro);
      });
  } else {
    novoEstudo.id = parseInt(id, 10);

    fetch(API_URL + "/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novoEstudo),
    })
      .then(function (resposta) {
        return resposta.json();
      })
      .then(function () {
        alert("Estudo atualizado com sucesso!");
        limparFormulario();
        carregarEstudos();
      })
      .catch(function (erro) {
        alert("Erro ao atualizar estudo: " + erro);
      });
  }
}

function prepararEdicao(id) {
  fetch(API_URL + "/" + id)
    .then(function (resposta) {
      return resposta.json();
    })
    .then(function (estudo) {
      document.getElementById("estudo-id").value = estudo.id;
      document.getElementById("titulo").value = estudo.titulo;
      document.getElementById("descricao").value = estudo.descricao;
      document.getElementById("diciplina").value = estudo.diciplina;

      if (Array.isArray(estudo.ArquivoPath) && estudo.ArquivoPath.length > 0) {
        document.getElementById("caminho-manual").value =
          estudo.ArquivoPath.join(", ");
      } else {
        document.getElementById("caminho-manual").value =
          estudo.ArquivoPath || "";
      }

      document.getElementById("form-title").innerText =
        "Editar Estudo #" + estudo.id;
      document.getElementById("btn-salvar").innerText = "Atualizar Estudo";
      document.getElementById("btn-cancelar").classList.remove("d-none");
    })
    .catch(function (erro) {
      alert("Erro ao carregar dados para edicao: " + erro);
    });
}

function limparFormulario() {
  document.getElementById("form-estudo").reset();
  document.getElementById("estudo-id").value = "";
  document.getElementById("form-title").innerText = "Publicar estudo";
  document.getElementById("btn-salvar").innerText = "Publicar";
  document.getElementById("btn-cancelar").classList.add("d-none");
}

function excluirEstudo(id) {
  const confirmou = confirm(
    "Tem certeza que deseja excluir o estudo #" + id + "?",
  );
  if (!confirmou) {
    return;
  }

  fetch(API_URL + "/" + id, {
    method: "DELETE",
  })
    .then(function () {
      alert("Estudo removido com sucesso!");
      if (document.getElementById("estudo-id").value == id) {
        limparFormulario();
      }
      carregarEstudos();
    })
    .catch(function (erro) {
      alert("Erro ao excluir estudo: " + erro);
    });
}

function processarDadosImportados(objetoJson) {
  const logBox = document.getElementById("log-box");
  logBox.innerHTML = "";

  const lista = objetoJson;
  
  if (!Array.isArray(lista)) {
    logBox.innerText =
      "ERRO: O JSON nao esta estruturado de forma correta.";
    return;
  }

  let total = lista.length;
  let sucessos = 0;
  let linhasLog = [];

  for (let i = 0; i < total; i++) {
    const item = lista[i];

    if (item.titulo && item.titulo.trim() !== "") {
      linhasLog.push("ok " + item.titulo + " - " + item.descricao);
      sucessos++;
    } else {
      linhasLog.push("ERRO arquivo sem titulo (segue o lote)");
    }
  }

  linhasLog.push("Concluido - " + sucessos + " de " + total + ".");

  logBox.innerText = linhasLog.join("\n");
}

function importarEstudos() {

  fetch(API_URL_IMPORT)
    .then(function (resposta) {
      if (!resposta.ok) {
        throw new Error("Arquivo estudos-import.json nao encontrado");
      }
      return resposta.json();
    })
    .then(function (dados) {
      processarDadosImportados(dados);
    })
    .catch(function (erro) {
      document.getElementById("log-box").innerText =
        "ERRO ao carregar arquivo padrao: " + erro.message;
    });
}

carregarEstudos();

const form = document.getElementById("form-estudo");
form.addEventListener("submit", salvarEstudo);

const btnCancelar = document.getElementById("btn-cancelar");
btnCancelar.addEventListener("click", limparFormulario);

const btnImportar = document.getElementById("btn-importar");
btnImportar.addEventListener("click", importarEstudos);

const btnRecarregar = document.getElementById("btn-recarregar");
btnRecarregar.addEventListener("click", carregarEstudos);
