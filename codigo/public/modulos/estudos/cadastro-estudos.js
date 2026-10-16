// sem login nesta sprint: o autor é sempre o usuário 507 (Lucas Coelho)
const USUARIO_ATUAL = 507;
const MAX_PALAVRAS = 10;

const TIPOS = { 1: 'Estudo', 2: 'Exercício', 3: 'Projeto', 4: 'Prova' };
const EXTENSOES = { pdf: 1, html: 2, htm: 2, docx: 3, pptx: 4, png: 5, jpg: 6, jpeg: 6, mp4: 7 };

const estado = {
  materias: [],
  temas: [],
  conteudos: [],
  palavras: [],
  editandoId: null,
  excluindoId: null
};

const $ = (id) => document.getElementById(id);
const form = $('form-conteudo');
const campos = {
  titulo: $('titulo'),
  materia: $('materia'),
  tema: $('tema'),
  tipo: $('tipo'),
  descricao: $('descricao'),
  palavra: $('palavra'),
  endereco: $('endereco'),
  nomeArquivo: $('nome-arquivo'),
  formato: $('formato'),
  tamanho: $('tamanho')
};

const ICONE_ERRO = '<svg class="ic ic--16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';

// ---------- API (JSON Server) ----------

async function api(caminho, opcoes = {}) {
  const resposta = await fetch(caminho, {
    headers: { 'Content-Type': 'application/json' },
    ...opcoes
  });
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
  return resposta.json();
}

const listarConteudos = () => api(`/conteudos?autorId=${USUARIO_ATUAL}&_sort=dataPublicacao&_order=desc`);
const criarConteudo = (conteudo) => api('/conteudos', { method: 'POST', body: JSON.stringify(conteudo) });
const atualizarConteudo = (id, campos) => api(`/conteudos/${id}`, { method: 'PATCH', body: JSON.stringify(campos) });
const excluirConteudo = (id) => api(`/conteudos/${id}`, { method: 'DELETE' });

// ---------- utilitários ----------

function escapar(texto) {
  return String(texto)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// data e hora local no formato do esquema: AAAA-MM-DDTHH:MM:SS
function agoraISO() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

// data curta como no guia visual (06/10); o ano fica no title
function diaMes(iso) {
  const [ano, mes, dia] = iso.slice(0, 10).split('-');
  return `<span title="${dia}/${mes}/${ano}">${dia}/${mes}</span>`;
}

function materia(id) {
  return estado.materias.find((m) => m.id === id);
}

// cor fixa por matéria (cor-mat-1 a 6), pela ordem da lista
function corMateria(id) {
  const i = estado.materias.findIndex((m) => m.id === id);
  return `cor-mat-${(i % 6) + 1}`;
}

// tamanho aceita vírgula ou ponto e é mostrado com vírgula
const lerTamanho = (texto) => Number(String(texto).trim().replace(',', '.'));
const mostrarTamanho = (mb) => Number(mb).toFixed(2).replace('.', ',');

function extensao(nome) {
  const partes = nome.toLowerCase().split('?')[0].split('.');
  return partes.length > 1 ? partes.pop() : '';
}

// ---------- avisos ----------

let temporizadorToast;
function mostrarToast(texto) {
  const toast = $('toast');
  toast.textContent = texto;
  toast.hidden = false;
  clearTimeout(temporizadorToast);
  temporizadorToast = setTimeout(() => { toast.hidden = true; }, 4000);
}

function avisoServidor(mostrar) {
  const area = $('aviso-servidor');
  area.hidden = !mostrar;
  area.innerHTML = mostrar
    ? `<div class="aviso aviso--erro" role="alert">${ICONE_ERRO.replace('ic--16', '')}<div class="aviso__corpo"><p class="aviso__titulo">Não foi possível falar com o servidor</p><p class="aviso__texto">Confira se o JSON Server está rodando (npm start, porta 3000) e recarregue a página.</p></div></div>`
    : '';
}

// ---------- selects ----------

function preencherMaterias() {
  const opcoes = estado.materias
    .slice()
    .sort((a, b) => a.sigla.localeCompare(b.sigla))
    .map((m) => `<option value="${m.id}">${escapar(m.sigla)} · ${escapar(m.nome)}</option>`)
    .join('');
  campos.materia.innerHTML = `<option value="">Escolha a matéria</option>${opcoes}`;
}

function preencherTemas(materiaId, temaSelecionado = null) {
  const temas = estado.temas
    .filter((t) => t.materiaId === materiaId)
    .sort((a, b) => a.ordem - b.ordem);

  if (!materiaId) {
    campos.tema.innerHTML = '<option value="">Escolha a matéria antes</option>';
    campos.tema.disabled = true;
    return;
  }
  campos.tema.disabled = false;
  campos.tema.innerHTML = '<option value="">Sem tema</option>' + temas
    .map((t) => `<option value="${t.id}">${escapar(t.titulo)}</option>`)
    .join('');
  campos.tema.value = temaSelecionado ? String(temaSelecionado) : '';
}

// ---------- palavras-chave ----------

function desenharPalavras() {
  $('tags-lista').innerHTML = estado.palavras
    .map((p, i) => `<li class="tags__item">${escapar(p)}<button class="tags__remover" type="button" data-indice="${i}" aria-label="Remover a palavra-chave ${escapar(p)}"><svg class="ic ic--16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button></li>`)
    .join('');
}

function adicionarPalavra(texto) {
  const palavra = texto.trim().replace(/\s+/g, ' ').toLowerCase();
  if (!palavra) return;
  if (estado.palavras.includes(palavra)) return;
  if (estado.palavras.length >= MAX_PALAVRAS) {
    mostrarErro('palavra', `Use no máximo ${MAX_PALAVRAS} palavras-chave.`);
    return;
  }
  estado.palavras.push(palavra);
  limparErro('palavra');
  desenharPalavras();
}

campos.palavra.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    adicionarPalavra(campos.palavra.value);
    campos.palavra.value = '';
  } else if (e.key === 'Backspace' && !campos.palavra.value && estado.palavras.length) {
    estado.palavras.pop();
    desenharPalavras();
  }
});

// colar "a, b, c" vira três palavras
campos.palavra.addEventListener('input', () => {
  if (campos.palavra.value.includes(',')) {
    campos.palavra.value.split(',').forEach(adicionarPalavra);
    campos.palavra.value = '';
  }
});

$('tags-lista').addEventListener('click', (e) => {
  const botao = e.target.closest('.tags__remover');
  if (!botao) return;
  estado.palavras.splice(Number(botao.dataset.indice), 1);
  desenharPalavras();
  campos.palavra.focus();
});

$('tags').addEventListener('click', (e) => {
  if (e.target.id === 'tags' || e.target.id === 'tags-lista') campos.palavra.focus();
});

// ---------- arquivo ----------

// o arquivo em si não sobe para o JSON Server: guardamos nome, formato e tamanho
$('arquivo-local').addEventListener('change', (e) => {
  const arquivo = e.target.files[0];
  $('arquivo-local-nome').textContent = arquivo ? arquivo.name : 'Nenhum arquivo escolhido';
  if (!arquivo) return;
  campos.nomeArquivo.value = arquivo.name;
  const formato = EXTENSOES[extensao(arquivo.name)];
  if (formato) campos.formato.value = String(formato);
  campos.tamanho.value = mostrarTamanho(Math.max(0.01, arquivo.size / (1024 * 1024)));
  ['nomeArquivo', 'formato', 'tamanho'].forEach(limparErro);
});

// sem nome ainda? usa o final do link
campos.endereco.addEventListener('change', () => {
  const link = campos.endereco.value.trim();
  if (!link) return;
  try {
    const nome = decodeURIComponent(new URL(link).pathname.split('/').pop() || '');
    if (nome && !campos.nomeArquivo.value.trim()) {
      campos.nomeArquivo.value = nome;
      limparErro('nomeArquivo');
    }
    const formato = EXTENSOES[extensao(nome)];
    if (formato && !campos.formato.value) {
      campos.formato.value = String(formato);
      limparErro('formato');
    }
  } catch {
    // link inválido: a validação avisa no envio
  }
});

campos.materia.addEventListener('change', () => {
  preencherTemas(Number(campos.materia.value) || null);
});

// ---------- validação ----------

function campoDoErro(nome) {
  return nome === 'palavra' ? $('tags') : campos[nome];
}

function mostrarErro(nome, mensagem) {
  const campo = campoDoErro(nome);
  const grupo = campo.closest('.campo-grupo');
  campo.classList.add(nome === 'palavra' ? 'tags--erro' : 'campo--erro');
  const alvo = nome === 'palavra' ? campos.palavra : campo;
  alvo.setAttribute('aria-invalid', 'true');

  let erro = grupo.querySelector('.campo-grupo__erro');
  if (!erro) {
    erro = document.createElement('span');
    erro.className = 'campo-grupo__erro';
    erro.id = `${alvo.id}-erro`;
    grupo.appendChild(erro);
  }
  erro.innerHTML = `${ICONE_ERRO} ${escapar(mensagem)}`;
  const descritores = (alvo.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
  if (!descritores.includes(erro.id)) alvo.setAttribute('aria-describedby', [...descritores, erro.id].join(' '));
}

function limparErro(nome) {
  const campo = campoDoErro(nome);
  const grupo = campo.closest('.campo-grupo');
  campo.classList.remove('campo--erro', 'tags--erro');
  const alvo = nome === 'palavra' ? campos.palavra : campo;
  alvo.removeAttribute('aria-invalid');
  const erro = grupo.querySelector('.campo-grupo__erro');
  if (erro) {
    const descritores = (alvo.getAttribute('aria-describedby') || '').split(' ').filter((d) => d !== erro.id);
    if (descritores.length) alvo.setAttribute('aria-describedby', descritores.join(' '));
    else alvo.removeAttribute('aria-describedby');
    erro.remove();
  }
}

// o erro some quando a pessoa mexe no campo
Object.entries(campos).forEach(([nome, campo]) => {
  if (nome === 'palavra') return;
  const evento = campo.tagName === 'SELECT' ? 'change' : 'input';
  campo.addEventListener(evento, () => limparErro(nome));
});

function validar() {
  const erros = {};
  const titulo = campos.titulo.value.trim();
  const descricao = campos.descricao.value.trim();
  const endereco = campos.endereco.value.trim();
  const tamanho = lerTamanho(campos.tamanho.value);

  if (titulo.length < 3 || titulo.length > 100) erros.titulo = 'Escreva um título de 3 a 100 letras.';
  if (!campos.materia.value) erros.materia = 'Escolha a matéria do material.';
  if (!campos.tipo.value) erros.tipo = 'Escolha o tipo do material.';
  if (descricao.length < 10) erros.descricao = 'Descreva o material em pelo menos 10 letras.';
  if (!estado.palavras.length) erros.palavra = 'Adicione pelo menos uma palavra-chave. Ela ajuda a turma a achar o material na busca.';

  let linkValido = false;
  try {
    linkValido = ['http:', 'https:'].includes(new URL(endereco).protocol);
  } catch {
    linkValido = false;
  }
  if (!linkValido) erros.endereco = 'Informe o link do arquivo, começando com https://.';
  if (!campos.nomeArquivo.value.trim()) erros.nomeArquivo = 'Informe o nome do arquivo com a extensão, ex.: resumo-avl.pdf.';
  if (!campos.formato.value) erros.formato = 'Escolha o formato.';
  if (!(tamanho > 0)) erros.tamanho = 'Informe um tamanho maior que zero.';

  Object.keys(campos).forEach((nome) => {
    if (nome !== 'palavra') limparErro(nome);
  });
  limparErro('palavra');
  Object.entries(erros).forEach(([nome, mensagem]) => mostrarErro(nome, mensagem));
  return erros;
}

// ---------- formulário ----------

function lerFormulario() {
  const temaId = Number(campos.tema.value) || null;
  return {
    titulo: campos.titulo.value.trim(),
    descricao: campos.descricao.value.trim(),
    tipo: Number(campos.tipo.value),
    palavrasChave: [...estado.palavras],
    materiaId: Number(campos.materia.value),
    temaId,
    arquivo: {
      nome: campos.nomeArquivo.value.trim(),
      formato: Number(campos.formato.value),
      tamanhoMb: Number(lerTamanho(campos.tamanho.value).toFixed(2)),
      endereco: campos.endereco.value.trim()
    }
  };
}

function preencherFormulario(c) {
  campos.titulo.value = c.titulo;
  campos.materia.value = String(c.materiaId);
  preencherTemas(c.materiaId, c.temaId);
  campos.tipo.value = String(c.tipo);
  campos.descricao.value = c.descricao;
  estado.palavras = [...c.palavrasChave];
  desenharPalavras();
  campos.endereco.value = c.arquivo.endereco;
  campos.nomeArquivo.value = c.arquivo.nome;
  campos.formato.value = String(c.arquivo.formato);
  campos.tamanho.value = mostrarTamanho(c.arquivo.tamanhoMb);
}

function limparFormulario() {
  form.reset();
  $('arquivo-local-nome').textContent = 'Nenhum arquivo escolhido';
  estado.palavras = [];
  desenharPalavras();
  preencherTemas(null);
  Object.keys(campos).forEach((nome) => limparErro(nome === 'palavra' ? 'palavra' : nome));
  sairDaEdicao();
}

function entrarEmEdicao(id) {
  const conteudo = estado.conteudos.find((c) => c.id === id);
  if (!conteudo) return;
  limparFormulario();
  estado.editandoId = id;
  preencherFormulario(conteudo);
  $('titulo-form').textContent = 'Editar material';
  $('btn-salvar').textContent = 'Salvar alterações';
  $('btn-limpar').textContent = 'Cancelar edição';
  desenharTabela();
  $('titulo-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
  campos.titulo.focus({ preventScroll: true });
}

function sairDaEdicao() {
  estado.editandoId = null;
  $('titulo-form').textContent = 'Novo material';
  $('btn-salvar').textContent = 'Publicar material';
  $('btn-limpar').textContent = 'Limpar';
  desenharTabela();
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  // palavra digitada e não confirmada também conta
  if (campos.palavra.value.trim()) {
    adicionarPalavra(campos.palavra.value);
    campos.palavra.value = '';
  }

  const erros = validar();
  if (Object.keys(erros).length) {
    const primeiro = Object.keys(erros)[0];
    (primeiro === 'palavra' ? campos.palavra : campos[primeiro]).focus();
    return;
  }

  const dados = lerFormulario();
  const botao = $('btn-salvar');
  botao.disabled = true;
  try {
    if (estado.editandoId) {
      await atualizarConteudo(estado.editandoId, dados);
      mostrarToast(`Alterações em “${dados.titulo}” salvas.`);
    } else {
      await criarConteudo({
        ...dados,
        autorId: USUARIO_ATUAL,
        revisorId: null,
        dataPublicacao: agoraISO(),
        interacoes: [],
        acessos: [],
        comentarios: []
      });
      mostrarToast(`“${dados.titulo}” publicado no catálogo.`);
    }
    limparFormulario();
    await carregarConteudos();
  } catch {
    avisoServidor(true);
  } finally {
    botao.disabled = false;
  }
});

$('btn-limpar').addEventListener('click', limparFormulario);

// ---------- tabela ----------

function desenharTabela() {
  const corpo = $('tabela-corpo');
  const total = estado.conteudos.length;
  $('contador').textContent = total === 1 ? '1 material' : `${total} materiais`;
  $('tabela-area').hidden = total === 0;
  $('vazio').hidden = total !== 0;

  corpo.innerHTML = estado.conteudos.map((c) => {
    const m = materia(c.materiaId);
    const tema = estado.temas.find((t) => t.id === c.temaId);
    const editando = c.id === estado.editandoId;
    const titulo = escapar(c.titulo);
    return `<tr${editando ? ' class="linha--editando"' : ''}>
      <td class="tabela__principal">${titulo}${tema ? `<span class="tabela__sub">${escapar(tema.titulo)}</span>` : ''}</td>
      <td>${m ? `<span class="etiqueta-mat ${corMateria(m.id)}" title="${escapar(m.nome)}">${escapar(m.sigla)}</span>` : '—'}</td>
      <td class="tipo">${TIPOS[c.tipo] || '—'}</td>
      <td class="num">${diaMes(c.dataPublicacao)}</td>
      <td>
        <div class="tabela__acoes">
          <button class="btn btn--sec btn--pequeno" type="button" data-acao="editar" data-id="${c.id}" aria-label="Editar “${titulo}”"${editando ? ' aria-pressed="true"' : ''}>Editar</button>
          <button class="btn btn--discreto btn--pequeno" type="button" data-acao="excluir" data-id="${c.id}" aria-label="Excluir “${titulo}”">Excluir</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

$('tabela-corpo').addEventListener('click', (e) => {
  const botao = e.target.closest('button[data-acao]');
  if (!botao) return;
  const id = Number(botao.dataset.id);
  if (botao.dataset.acao === 'editar') entrarEmEdicao(id);
  else abrirExclusao(id, botao);
});

async function carregarConteudos() {
  estado.conteudos = await listarConteudos();
  desenharTabela();
}

// ---------- exclusão ----------

let focoAntesDoModal = null;

function abrirExclusao(id, origem) {
  const conteudo = estado.conteudos.find((c) => c.id === id);
  if (!conteudo) return;
  estado.excluindoId = id;
  focoAntesDoModal = origem;
  $('modal-titulo').textContent = 'Excluir material?';
  $('modal-texto').textContent = `“${conteudo.titulo}” sai do catálogo de estudos. Não dá para desfazer.`;
  $('veu').hidden = false;
  $('btn-cancelar-exclusao').focus();
}

function fecharExclusao() {
  $('veu').hidden = true;
  estado.excluindoId = null;
  if (focoAntesDoModal && document.body.contains(focoAntesDoModal)) focoAntesDoModal.focus();
}

$('btn-cancelar-exclusao').addEventListener('click', fecharExclusao);

$('btn-confirmar-exclusao').addEventListener('click', async () => {
  const id = estado.excluindoId;
  const conteudo = estado.conteudos.find((c) => c.id === id);
  try {
    await excluirConteudo(id);
    if (estado.editandoId === id) limparFormulario();
    focoAntesDoModal = null;
    fecharExclusao();
    await carregarConteudos();
    mostrarToast(`“${conteudo.titulo}” excluído.`);
    campos.titulo.focus();
  } catch {
    fecharExclusao();
    avisoServidor(true);
  }
});

// clicar fora fecha; Esc fecha; Tab fica dentro do modal
$('veu').addEventListener('click', (e) => {
  if (e.target.id === 'veu') fecharExclusao();
});

document.addEventListener('keydown', (e) => {
  if ($('veu').hidden) return;
  if (e.key === 'Escape') fecharExclusao();
  if (e.key === 'Tab') {
    const botoes = [$('btn-cancelar-exclusao'), $('btn-confirmar-exclusao')];
    const i = botoes.indexOf(document.activeElement);
    e.preventDefault();
    botoes[(i + (e.shiftKey ? botoes.length - 1 : 1)) % botoes.length].focus();
  }
});

// ---------- início ----------

async function iniciar() {
  try {
    const [materias, temas, usuario] = await Promise.all([
      api('/materias'),
      api('/temas'),
      api(`/usuarios/${USUARIO_ATUAL}`)
    ]);
    estado.materias = materias;
    estado.temas = temas;
    $('avatar').setAttribute('aria-label', usuario.nome);
    $('avatar').title = usuario.nome;
    preencherMaterias();
    await carregarConteudos();
  } catch {
    avisoServidor(true);
    $('tabela-area').hidden = true;
  }
}

iniciar();
