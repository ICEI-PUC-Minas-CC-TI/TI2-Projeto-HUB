/* Hub de Estudos · mobile
   Protótipo clicável (sem servidor). As telas são montadas como texto HTML
   e as classes usadas aqui estão todas em css/mobile.css. */
(function(){
"use strict";
var EMBED = /[?&]embed=1/.test(location.search) && window.parent !== window;
if (EMBED) document.documentElement.classList.add('embed');
var cargoAvisado = null;

/* ============================== ícones ============================== */
var P = {
  home:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  book:'<path d="M4 19.5V5a2 2 0 0 1 2-2h14v15H6.5A2.5 2.5 0 0 0 4 20.5 2.5 2.5 0 0 0 6.5 23H20"/><path d="M8 7h8"/>',
  chat:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
  star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  bell:'<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  heart:'<path d="M19.5 12.6 12 20l-7.5-7.4A5 5 0 1 1 12 6a5 5 0 1 1 7.5 6.6z"/>',
  back:'<path d="m15 18-6-6 6-6"/>',
  right:'<path d="m9 18 6-6-6-6"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  send:'<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
  more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  comment:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  link:'<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  access:'<circle cx="12" cy="4.5" r="1.5"/><path d="M5 8h14M12 8v6M9 21l3-7 3 7"/>',
  refresh:'<path d="M21 12a9 9 0 1 1-2.6-6.4L21 8"/><path d="M21 3v5h-5"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>'
};
// c: classes extras do ícone, ex.: 'ic--16 ic--apagado' (tamanho padrão 20 px)
function ic(n, c){ return '<svg class="ic ' + (c||'') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + P[n] + '</svg>'; }
function icFill(n, c){ return '<svg class="ic ' + (c||'') + '" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true">' + P[n] + '</svg>'; }

/* ============================== dados ============================== */
var USUARIO = { nome:'Lorem Ipsum', primeiro:'Lorem', iniciais:'LI', email:'lorem.ipsum@sga.exemplo.br', matricula:'2025010234', turno:'Noturno', periodo:'2º período', curso:'Ciência da Computação' };

var MATERIAS = [
  { id:'cdi', sigla:'CDI I', nome:'Cálculo Diferencial e Integral I', prof:'Prof. Lorem Dolor', prog:68, nota:7.4, cred:6,
    topicos:[['Limites e continuidade',1],['Limites laterais',1],['Derivada pela definição',1],['Regras de derivação',1],['Regra da cadeia',1],['Derivação implícita',0],['Aplicações da derivada',0],['Integral indefinida',0]] },
  { id:'fis', sigla:'FÍS EXP', nome:'Física Experimental', prof:'Prof.ª Sit Amet', prog:55, nota:8.2, cred:2,
    topicos:[['Teoria de erros',1],['Algarismos significativos',1],['Pêndulo simples',1],['Lançamento horizontal',0],['Colisões',0],['Relatório final',0]] },
  { id:'poo', sigla:'POO', nome:'Programação Orientada a Objetos', prof:'Prof. Consectetur Elit', prog:72, nota:8.6, cred:4,
    topicos:[['Classes e objetos',1],['Encapsulamento',1],['Herança',1],['Polimorfismo',1],['Classes abstratas',0],['Interfaces',0],['Tratamento de exceções',0]] },
  { id:'ing', sigla:'INGLÊS', nome:'Inglês Técnico', prof:'Prof.ª Adipiscing Sed', prog:80, nota:9.1, cred:2,
    topicos:[['Estratégias de leitura',1],['Cognatos e falsos cognatos',1],['Grupos nominais',1],['Leitura de papers',1],['Abstracts',0]] },
  { id:'fil', sigla:'FILOSOFIA', nome:'Filosofia da Ciência', prof:'Prof. Tempor Incididunt', prog:45, nota:6.6, cred:2,
    topicos:[['O que é ciência',1],['Indução e o problema de Hume',1],['Popper e a falseabilidade',0],['Kuhn e as revoluções científicas',0],['Feyerabend',0]] },
  { id:'alg', sigla:'ÁLG LIN', nome:'Álgebra Linear', prof:'Prof.ª Magna Aliqua', prog:50, nota:6.9, cred:4,
    topicos:[['Matrizes e operações',1],['Sistemas lineares',1],['Determinantes',1],['Espaços vetoriais',0],['Transformações lineares',0],['Autovalores e autovetores',0]] }
];
function materia(id){ return todasMaterias().filter(function(m){ return m.id === id; })[0]; }
function materiaPorSigla(s){ return MATERIAS.filter(function(m){ return m.sigla === s; })[0]; }

// semana de 07 a 13/09/2026 · hoje é sexta, 11
var TAREFAS = [
  { id:1, dia:7,  titulo:'Lista 3 — Limites laterais',      mat:'cdi', tipo:'Lista',     hora:'23:59', prog:100, valor:5,  ganho:4.5, perdido:0.5 },
  { id:2, dia:8,  titulo:'Relatório — Pêndulo simples',     mat:'fis', tipo:'Relatório', hora:'18:00', prog:100, valor:10, ganho:8.5, perdido:1.5 },
  { id:3, dia:9,  titulo:'Quiz — Encapsulamento',           mat:'poo', tipo:'Quiz',      hora:'10:00', prog:100, valor:4,  ganho:4,   perdido:0 },
  { id:4, dia:10, titulo:'Reading assignment 2',            mat:'ing', tipo:'Leitura',   hora:'23:59', prog:80,  valor:5,  ganho:null, perdido:null },
  { id:5, dia:11, titulo:'Lista 4 — Regra da cadeia',       mat:'cdi', tipo:'Lista',     hora:'23:59', prog:68,  valor:5,  ganho:null, perdido:null },
  { id:6, dia:12, titulo:'Resenha — Popper',                mat:'fil', tipo:'Resenha',   hora:'20:00', prog:30,  valor:10, ganho:null, perdido:null },
  { id:7, dia:13, titulo:'Exercícios — Matrizes inversas',  mat:'alg', tipo:'Lista',     hora:'23:59', prog:10,  valor:5,  ganho:null, perdido:null }
];
// eventos do mês que não são tarefas da semana acima
var EVENTOS_MES = [
  { dia:3,  titulo:'Lista 2 — Continuidade', mat:'cdi', hora:'23:59', tipo:'Lista' },
  { dia:4,  titulo:'Aula prática — Erros',   mat:'fis', hora:'19:00', tipo:'Aula' },
  { dia:14, titulo:'P1 — Cálculo I',          mat:'cdi', hora:'19:00', tipo:'Prova' },
  { dia:16, titulo:'Trabalho — Herança',      mat:'poo', hora:'23:59', tipo:'Trabalho' },
  { dia:22, titulo:'Prova — Álgebra Linear',  mat:'alg', hora:'19:00', tipo:'Prova' },
  { dia:25, titulo:'Seminário — Kuhn',        mat:'fil', hora:'20:40', tipo:'Seminário' }
];

var ESTUDOS = [
  { id:1, mat:'cdi', titulo:'Regra da cadeia sem decoreba', desc:'Como enxergar a função de dentro e a de fora, com 6 exemplos resolvidos.', autor:'Prof. Lorem Dolor', papel:'Professor', data:'09 set', com:2, fav:12, revisado:true },
  { id:2, mat:'poo', titulo:'Herança e polimorfismo em Java', desc:'Quando estender, quando usar interface e o que o @Override realmente faz.', autor:'Ipsum Dolor', papel:'Monitor', data:'06 set', com:5, fav:9, revisado:true },
  { id:3, mat:'alg', titulo:'Matriz inversa por Gauss-Jordan', desc:'Passo a passo com a matriz aumentada [A | I] e os erros mais comuns.', autor:'Dolor Sit', papel:'Aluno', data:'05 set', com:1, fav:4, revisado:false },
  { id:4, mat:'fis', titulo:'Como escrever o relatório de laboratório', desc:'Estrutura, tabela de medidas, propagação de incerteza e gráfico.', autor:'Prof.ª Sit Amet', papel:'Professor', data:'02 set', com:3, fav:15, revisado:true },
  { id:5, mat:'cdi', titulo:'Limites laterais — lista resolvida', desc:'Os 12 exercícios da Lista 3 com o raciocínio de cada um.', autor:'Consectetur Elit', papel:'Aluno', data:'01 set', com:3, fav:6, revisado:false },
  { id:6, mat:'ing', titulo:'Vocabulário para ler papers', desc:'Os 80 termos que mais aparecem em abstracts de computação.', autor:'Adipiscing Sed', papel:'Monitor', data:'28 ago', com:0, fav:7, revisado:true }
];
function estudo(id){ return ESTUDOS.filter(function(e){ return e.id === id; })[0]; }

var COMENTARIOS = {
  1:[{ nome:'Ipsum Dolor', papel:'Monitor', data:'10 set', texto:'O exemplo 4 é o que mais cai. Vale refazer sem olhar a resolução.' },
     { nome:'Tempor Magna', papel:'Aluno', data:'10 set', texto:'Finalmente entendi por que multiplica pela derivada de dentro.' }],
  2:[{ nome:'Sit Amet', papel:'Aluno', data:'07 set', texto:'Dá para acrescentar um exemplo com classe abstrata?' }]
};

var CONVERSAS = [
  { id:'lorem', nome:'Prof. Lorem Dolor', papel:'Professor', tipo:'pessoa', online:true, hora:'18:52', nao:2, atende:'seg–sex, 8 h às 22 h',
    msgs:[{de:'outro', t:'Boa noite! Lembrando que a P1 é segunda, 14/09, às 19 h.', h:'18:50'},{de:'outro', t:'Cobre até regra da cadeia. Derivação implícita fica para a P2.', h:'18:52'}] },
  { id:'ipsum', nome:'Ipsum Dolor', papel:'Monitor', sub:'CDI I', tipo:'pessoa', online:true, hora:'17:10', nao:0, atende:'todos os dias, 8 h às 22 h',
    msgs:[{de:'eu', t:'Na derivação implícita de x² + y² = 25, por que dy/dx fica −x/y?', h:'17:10'}] },
  { id:'cdi-sala', nome:'CDI I · turma 02', topico:'# regra-da-cadeia', tipo:'sala', hora:'16:40', nao:5,
    msgs:[{de:'outro', autor:'Tempor', t:'Alguém fez o 7 da Lista 4?', h:'16:31'},{de:'outro', autor:'Magna', t:'Fiz. Chama u = 3x² + 1 que sai rápido.', h:'16:38'},{de:'eu', t:'Valeu, era isso que faltava.', h:'16:40'}] },
  { id:'dolor', nome:'Dolor Sit', papel:'Aluno', tipo:'pessoa', online:false, hora:'ontem', nao:0,
    msgs:[{de:'outro', t:'Bora estudar Álgebra amanhã na biblioteca?', h:'21:14'},{de:'eu', t:'Bora, depois das 14 h.', h:'21:20'}] },
  { id:'sit', nome:'Sit Amet', papel:'Monitor', sub:'POO', tipo:'pessoa', online:false, hora:'ontem', nao:0, atende:'seg–sex, 14 h às 18 h', fora:true,
    msgs:[{de:'eu', t:'Oi! Posso tirar uma dúvida de interface x classe abstrata?', h:'19:40'}] },
  { id:'poo-sala', nome:'POO · turma 01', topico:'# heranca', tipo:'sala', hora:'seg', nao:0,
    msgs:[{de:'outro', autor:'Consectetur', t:'Subi o exemplo de polimorfismo no Hub.', h:'10:02'}] }
];
function conversa(id){ return CONVERSAS.filter(function(c){ return c.id === id; })[0]; }

var AVALIACOES = [
  { nome:'Tempor Magna', papel:'Aluno', nota:5, cat:'Calendário', data:'10 set', texto:'Importar do Canvas me salvou. Vejo a semana inteira sem abrir três sites.' },
  { nome:'Ipsum Dolor', papel:'Monitor', nota:5, cat:'Chat', data:'09 set', texto:'O horário de atendimento no chat acabou com mensagem de madrugada. As dúvidas chegam organizadas.' },
  { nome:'Consectetur Elit', papel:'Aluno', nota:4, cat:'Matérias', data:'08 set', texto:'Os tópicos com check ajudam a ver o que falta. Queria poder anotar em cada um.' },
  { nome:'Aliqua Veniam', papel:'Aluno', nota:4, cat:'Geral', data:'06 set', texto:'Limpo e rápido. Só senti falta de modo escuro no celular.' },
  { nome:'Sit Amet', papel:'Monitor', nota:5, cat:'Geral', data:'04 set', texto:'O painel de onde a turma mais trava define o tema do aulão em minutos.' },
  { nome:'Dolor Sit', papel:'Aluno', nota:3, cat:'Chat', data:'02 set', texto:'As salas por tópico são boas, mas as notificações das turmas vêm todas juntas.' }
];

var NOTIF_ITENS = ['Respostas às minhas dúvidas','Mensagens de monitores e professores','Enquetes e aulões da minha turma','Novos estudos nas minhas matérias'];

var DIAS_SEM = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
var DIAS_LONGO = ['domingo','segunda','terça','quarta','quinta','sexta','sábado'];

/* ============================== estado ============================== */
var INICIAL = {
  cargo:'aluno', tab:'inicio', tela:null, pilha:[], motivo:'',
  // calendário
  calVista:'semana', semana:0, diaSel:null, tarefa:null, calMat:'todas', mesDia:11, feedSalvo:false, copiado:false,
  // matérias e estudos
  matAba:'materias', buscaMat:'', materia:null, buscaEst:'', estMat:'todas', favs:{1:true,4:true}, estudo:1, sheet:false,
  estStatus:{1:'Estudando'}, comentarioNovo:'', excluidos:{}, revisados:{}, importou:false, publicado:false,
  // chat
  chatAba:'conversas', conv:null, rascunho:'', resolvido:null, caixaFiltro:'Caixa de entrada',
  // dúvidas & feedback
  fbAba:'turma', fbMat:'CDI I', enqueteAberta:false, votou:false, voto:null, pedidoEnviado:false, respostaChegou:false, aulaoMarcado:false,
  // caminhos alternativos e de erro dos fluxos F3 e F4
  foraHorario:false, naFila:false, etapaAulao:null, temaAulao:'Regra da cadeia na prática', dataAulao:'18', conflito:false, desempate:false,
  tipoEnvio:'Dúvida de matéria', assunto:'', avalNota:0, avalCat:'Geral', avalTexto:'', avalFiltro:'Todas', minhaAval:null,
  // config
  cfgSec:null, notif:{ 'Respostas às minhas dúvidas':[true,true], 'Mensagens de monitores e professores':[true,false], 'Enquetes e aulões da minha turma':[true,true], 'Novos estudos nas minhas matérias':[false,true] },
  tema:'Claro', densidade:'Confortável', fonte:'Média', idioma:'Português (Brasil)',
  visibilidade:'Colegas da turma', online:true, rastreio:false,
  a11y:{ 'Alto contraste':false, 'Reduzir animações':false, 'Otimizar para leitor de tela':false, 'Atalhos de teclado':true, 'Destaque de foco reforçado':false },
  twofa:true, sessoes:2, confirmarExclusao:false,
  // entrar
  entrarAba:'entrar', erroLogin:'', erroGeral:'', email:'',
  // hub, calculador, busca por tags e criar conta
  expandida:null, calcAberta:false, estimativas:{}, tags:[], sugIdx:0,
  nomeNovo:'', senhaNova:'', senhaConf:'', mostrarSenha:false, erroConf:'',
  // matérias vinculadas e integrações
  vinculos:['cdi-02','fis-01','poo-01','ing-01','fil-01','alg-01'].map(function(id){ return { turma:id, origem:'canvas', status:'ativo' }; }), buscaTurma:'',
  canvas:{ conectado:true, etapa:null, token:'', consent:false, erro:'', escolhidos:{}, sync:'hoje, 08:12', mostrar:false, confirmarSaida:false },
  // publicar, pessoas e cargos, relatórios
  envios:[], publicados:[], pessoasTurma:null, buscaPessoa:'', csv:{ texto:'', papel:'monitor', previa:null },
  historico:[{ quando:'12/09 19:40', quem:'Prof. Lorem Dolor', txt:'tornou Ipsum Dolor monitor em CDI I · turma 02', como:'página' }],
  relAberta:'cdi', relSigla:null, turmaProf:null, regraRascunho:null,
  // avisos
  notifLidas:false, toast:''
};
var S = clone(INICIAL);
function clone(o){ return JSON.parse(JSON.stringify(o)); }

function logado(){ return S.cargo !== 'visitante'; }
// quem publica estudos e abre enquetes
function equipe(){ return S.cargo === 'monitor' || S.cargo === 'professor' || S.cargo === 'admin'; }
// quem vê relatórios e muda cargos (o cargo vale por turma)
function docente(){ return S.cargo === 'professor' || S.cargo === 'admin'; }
function esc(t){ return String(t).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
function num(n, casas){ return n.toFixed(casas === undefined ? 1 : casas).replace('.', ','); }
function iniciais(n){ return n.replace(/^Prof\.ª? /,'').split(' ').map(function(p){ return p[0]; }).slice(0,2).join(''); }

/* ============================== peças ============================== */
// tipo: 'sec' | 'ghost' | 'perigo' | vazio (primário) · extra: 'btn--pequeno', 'btn--bloco', 'btn--triagem'
function btn(rot, attrs, tipo, extra){
  var t = tipo === 'sec' ? 'btn--sec' : tipo === 'ghost' ? 'btn--ghost' : tipo === 'perigo' ? 'btn--perigo' : 'btn--primario';
  return '<button ' + (attrs||'') + ' class="btn ' + t + ' ' + (extra||'') + '">' + rot + '</button>';
}
// classe: 'cartao' (padrão), 'cartao-lista', 'cartao-linhas', 'cartao-atividade'…
function card(inner, classe){ return '<div class="' + (classe||'cartao') + '">' + inner + '</div>'; }
function rotulo(t){ return '<p class="rotulo">' + t + '</p>'; }
// extra: 'barra--espaco', 'barra--cresce', 'barra--modal'
function barra(pct, extra){ return '<div class="barra ' + (extra||'') + '"><div class="barra__preenchimento" style="width:' + pct + '%"></div></div>'; }
function sigla(s){ return '<span class="sigla">' + s + '</span>'; }
function papel(p){ return '<span class="papel">' + p + '</span>'; }
function chip(rot, on, attrs){
  return '<button ' + attrs + ' class="chip' + (on ? ' chip--ativo' : '') + '">' + rot + '</button>';
}
function chips(lista, atual, chave){
  return '<div class="faixa-chips">' + lista.map(function(i){
    return chip(i, i === atual, 'data-a="' + chave + '" data-v="' + esc(i) + '"');
  }).join('') + '</div>';
}
function segmentado(itens, atual, chave){
  return '<div class="segmentado" style="--colunas:' + itens.length + '">' + itens.map(function(i){
    var id = i[0], r = i[1], on = id === atual;
    return '<button data-a="' + chave + '" data-v="' + id + '" class="segmentado__opcao' + (on ? ' segmentado__opcao--ativa' : '') + '">' + r + '</button>';
  }).join('') + '</div>';
}
function toggle(on, attrs, rot){
  return '<button role="switch" aria-checked="' + on + '" aria-label="' + esc(rot) + '" ' + attrs + ' class="interruptor' + (on ? ' interruptor--ligado' : '') + '">' +
    '<span class="interruptor__botao' + (on ? ' interruptor__botao--ligado' : '') + '"></span></button>';
}
function campo(rot, attrs, extra){
  return '<label class="bloco"><span class="campo__rotulo">' + rot + '</span>' +
    '<input ' + attrs + ' class="campo__entrada ' + (extra||'') + '"></label>';
}
function area(rot, attrs, valor){
  return '<label class="bloco"><span class="campo__rotulo">' + rot + '</span>' +
    '<textarea ' + attrs + ' rows="3" class="campo__texto">' + (valor||'') + '</textarea></label>';
}
function selecao(rot, opcoes, atual, attrs){
  return '<label class="bloco"><span class="campo__rotulo">' + rot + '</span>' +
    '<select ' + attrs + ' class="campo__selecao">' +
    opcoes.map(function(o){ return '<option' + (o === atual ? ' selected' : '') + '>' + o + '</option>'; }).join('') + '</select></label>';
}
function voltar(rot, acao){
  return '<button data-a="' + (acao||'voltar') + '" class="voltar">' + ic('back','ic--16') + rot + '</button>';
}
function titulo(t, sub){ return '<h1 class="titulo">' + t + '</h1>' + (sub ? '<p class="titulo__sub">' + sub + '</p>' : ''); }
// tam: 'ic--14' (padrão) ou 'ic--12'
function estrelas(n, tam){
  var s = '';
  for (var i = 1; i <= 5; i++) s += (i <= Math.round(n) ? icFill('star', (tam||'ic--14') + ' ic--forte') : ic('star', (tam||'ic--14') + ' ic--apagado'));
  return '<span class="estrelas">' + s + '</span>';
}
// tam: 'avatar--g' (padrão), 'avatar--m', 'avatar--p'
function avatar(nome, tam, quadrado){
  return '<span class="avatar ' + (tam||'avatar--g') + (quadrado ? ' avatar--sala' : '') + '">' + (quadrado ? '#' : iniciais(nome)) + '</span>';
}
function vazio(tituloTxt, sub, acoes){
  return '<div class="vazio">' +
    '<p class="vazio__titulo">' + tituloTxt + '</p><p class="vazio__texto">' + sub + '</p>' +
    (acoes ? '<div class="vazio__acoes">' + acoes + '</div>' : '') + '</div>';
}

/* ============================== casca ============================== */
function naoLidasChat(){
  var n = 0;
  CONVERSAS.forEach(function(c){ n += c.nao; });
  if (S.respostaChegou && S.resolvido === null) n += 1;
  return n;
}
function notificacoes(){
  var l = [];
  if (S.respostaChegou) l.push({ tipo:'Respostas', txt:'<b class="negrito">Ipsum Dolor</b> respondeu seu pedido #143', quando:'há 6 min', a:'abrir-conv', v:'ipsum', nova:true });
  if (S.enqueteAberta && !equipe()) l.push({ tipo:'Enquetes', txt:'<b class="negrito">Enquete aberta</b> — escolha o tema do aulão de CDI I', quando:'há 2 h', a:'ir-fb', v:'turma', nova:true });
  if (S.aulaoMarcado) l.push({ tipo:'Enquetes', txt:'<b class="negrito">Aulão marcado:</b> ' + esc(S.temaAulao) + ' · 18/09, 19 h', quando:'há 1 h', a:'ir-cal-mes', v:'', nova:true });
  l.push({ tipo:'Respostas', txt:'<b class="negrito">Prof. Lorem Dolor</b> enviou 2 mensagens sobre a P1', quando:'há 1 h', a:'abrir-conv', v:'lorem', nova:!S.notifLidas });
  l.push({ tipo:'Estudos', txt:'Novo estudo em <b class="negrito">CDI I</b>: Regra da cadeia sem decoreba', quando:'ontem', a:'abrir-estudo', v:'1', nova:!S.notifLidas });
  l.push({ tipo:'Estudos', txt:'Seu favorito <b class="negrito">Relatório de laboratório</b> foi revisado', quando:'02 set', a:'abrir-estudo', v:'4', nova:false });
  return l;
}
function naoLidasNotif(){ return notificacoes().filter(function(n){ return n.nova; }).length; }

function cabecalho(){
  var dir;
  if (logado()){
    var n = naoLidasNotif();
    dir = '<button data-a="abrir-notif" aria-label="Notificações" class="cabecalho__icone">' + ic('bell') +
      (n ? '<span class="contador">' + n + '</span>' : '') + '</button>' +
      '<button data-a="abrir-perfil" aria-label="Meu perfil" class="cabecalho__avatar">' + USUARIO.iniciais + '</button>';
  } else {
    dir = btn('Entrar', 'data-a="ir-entrar"', null, 'btn--pequeno');
  }
  return '<header class="cabecalho">' +
    '<button data-a="tab" data-v="inicio" class="marca">' +
    '<span class="marca__logo">HE</span>' +
    '<span class="marca__nome">Hub de Estudos</span></button>' + dir + '</header>';
}

var ABAS = [['inicio','Início','home'],['calendario','Calendário','calendar'],['materias','Matérias','book'],['chat','Chat','chat'],['feedback','Feedback','star'],['config','Config','settings']];
function barraInferior(){
  var nChat = logado() ? naoLidasChat() : 0;
  return '<nav class="navegacao" aria-label="Navegação principal">' + ABAS.map(function(a){
    var on = S.tab === a[0];
    return '<button data-a="tab" data-v="' + a[0] + '" aria-current="' + (on ? 'page' : 'false') + '" class="navegacao__aba' + (on ? ' navegacao__aba--ativa' : '') + '">' +
      (on ? '<span class="navegacao__indicador"></span>' : '') +
      ic(a[2]) + '<span class="navegacao__nome' + (on ? ' navegacao__nome--ativa' : '') + '">' + a[1] + '</span>' +
      (a[0] === 'chat' && nChat ? '<span class="navegacao__contador">' + nChat + '</span>' : '') +
      '</button>';
  }).join('') + '</nav>';
}

/* ============================== INÍCIO ============================== */
var telas = {};

telas.inicio = function(){
  if (!logado()) return catalogoPublico();
  var proximas = [TAREFAS[4], TAREFAS[5], TAREFAS[6], { id:'p1', dia:14, titulo:'P1 — Cálculo I', mat:'cdi', tipo:'Prova', hora:'19:00' }];
  var favs = ESTUDOS.filter(function(e){ return S.favs[e.id] && !S.excluidos[e.id]; });
  var h = '<div class="tela tela--ampla">' +
    '<div>' + rotulo('Sexta, 11 de setembro') + '<h1 class="titulo mt-1">Olá, ' + USUARIO.primeiro + '</h1>' +
    '<p class="titulo__sub">' + USUARIO.periodo + ' · ' + USUARIO.curso + '</p></div>';

  h += hubMaterias();

  if (equipe()){
    h += card('<div class="fila-3"><span class="icone-caixa">' + ic('upload') + '</span>' +
      '<div class="cresce"><p class="texto-forte">Área da ' + (S.cargo === 'admin' ? 'coordenação' : S.cargo === 'professor' ? 'docência' : 'monitoria') + '</p><p class="texto-apoio">3 dúvidas novas em CDI I · 1 estudo aguardando revisão</p></div></div>' +
      '<div class="grade-2 mt-3">' + btn(ic('plus','ic--16') + 'Publicar', 'data-a="ir-publicar"', null, 'btn--pequeno') + btn('Painel da turma', 'data-a="ir-fb" data-v="turma"', 'sec', 'btn--pequeno') + '</div>' +
      (docente() ? '<div class="grade-2 mt-2">' + btn('Relatórios', 'data-a="ir-relatorios"', 'sec', 'btn--pequeno') + btn('Pessoas e cargos', 'data-a="ir-pessoas"', 'sec', 'btn--pequeno') + '</div>' : ''));
  }

  var stats = [['Horas estudadas','142h','+6h esta semana'],['Tarefas entregues','34/41','83% no prazo'],['Média geral','7.8','6 matérias'],['Próxima prova','3 dias','P1 · Cálculo I']];
  h += '<div class="grade-2 grade-2--larga">' + stats.map(function(s){
    return card('<p class="texto-apoio">' + s[0] + '</p><p class="indicador__valor num">' + s[1] + '</p><p class="nota-mini mt-1">' + s[2] + '</p>');
  }).join('') + '</div>';

  h += '<div data-a="abrir-materia" data-v="cdi" role="button" tabindex="0" class="cartao-clicavel">' +
    '<div class="fila-entre">' + rotulo('Estudando agora') + '<span class="porcentagem num">68%</span></div>' +
    '<p class="destaque-materia">Cálculo I</p><p class="texto-apoio">Regra da cadeia · Prof. Lorem Dolor</p>' + barra(68, 'barra--espaco') +
    '<div class="cartao__proxima">' + ic('clock','ic--14') + 'Próxima: <span class="realce">Lista 4 — Regra da cadeia</span><span class="empurra mono">hoje</span></div></div>';

  h += '<section>' + '<div class="fila-entre mb-3"><h2 class="secao__titulo">Próximas entregas</h2><button data-a="tab" data-v="calendario" class="link-discreto">Ver calendário</button></div>' +
    card(proximas.map(function(t){
      var m = materia(t.mat);
      return '<button data-a="' + (t.id === 'p1' ? 'ir-cal-mes' : 'abrir-tarefa') + '" data-v="' + t.id + '" class="item-lista">' +
        '<span class="entrega__data"><span class="entrega__dia num">' + t.dia + '</span><span class="entrega__mes">SET</span></span>' +
        '<span class="cresce"><span class="texto bloco truncar">' + t.titulo + '</span><span class="texto-apoio bloco">' + m.sigla + ' · ' + t.tipo + '</span></span>' +
        '<span class="meta">' + (t.dia === 11 ? 'hoje' : t.hora) + '</span></button>';
    }).join(''), 'cartao-lista') + '</section>';

  h += '<section><div class="fila-entre mb-3"><h2 class="secao__titulo">Favoritos</h2><button data-a="ir-estudos" class="link-discreto">Todos os estudos</button></div>' +
    (favs.length ? card(favs.map(function(e){
      return '<div class="linha-lista"><button data-a="abrir-estudo" data-v="' + e.id + '" class="cresce esquerda"><span class="texto bloco truncar">' + e.titulo + '</span><span class="texto-apoio bloco mt-05">' + materia(e.mat).sigla + ' · ' + e.autor + '</span></button>' +
        '<button data-a="fav" data-v="' + e.id + '" aria-label="Remover dos favoritos" class="botao-favorito">' + icFill('heart','ic--16') + '</button></div>';
    }).join(''), 'cartao-linhas') : vazio('Nenhum favorito ainda', 'Toque no coração de um estudo para guardá-lo aqui.', btn('Explorar estudos', 'data-a="ir-estudos"', 'sec', 'btn--pequeno'))) + '</section>';

  var ativ = [['Entregou <span class="realce">Quiz — Encapsulamento</span>','POO · nota 4,0/4','qua'],['Concluiu o tópico <span class="realce">Regra da cadeia</span>','CDI I','ontem'],['Comentou em <span class="realce">Herança e polimorfismo</span>','Estudos · POO','ontem']];
  if (S.pedidoEnviado) ativ.unshift(['Enviou a dúvida <span class="realce">pedido #143</span>','Dúvidas · CDI I','agora']);
  h += '<section><h2 class="secao__titulo mb-3">Atividade recente</h2>' + card(ativ.slice(0,3).map(function(a){
    return '<div class="atividade"><span class="atividade__ponto"></span><div class="cresce"><p class="texto-medio">' + a[0] + '</p><p class="texto-dica">' + a[1] + '</p></div><span class="meta">' + a[2] + '</span></div>';
  }).join(''), 'cartao-atividade') + '</section>';

  h += card('<div class="fila-entre">' + rotulo('Período atual') + '<span class="porcentagem">61%</span></div>' +
    '<p class="texto-forte mt-2">2026/2 · 2º período</p><p class="texto-apoio">Semana 11 de 18 · termina em 12 dez</p>' + barra(61, 'barra--espaco'));

  return h + '</div>';
};

function catalogoPublico(){
  return '<div class="tela">' +
    '<div>' + rotulo('Acesso livre') + '<h1 class="titulo mt-1 equilibrado">Resumos e ferramentas de estudo, num lugar só</h1>' +
    '<p class="titulo__sub">Materiais de alunos, monitores e professores de Ciência da Computação.</p></div>' +
    listaEstudos('buscaEst') +
    card('<p class="texto-forte">Tem conta institucional?</p><p class="texto-apoio mt-1">Entre para favoritar, comentar, ver seu calendário e falar com a monitoria.</p><div class="mt-3">' + btn('Entrar ou criar conta', 'data-a="ir-entrar"', null, 'btn--bloco') + '</div>') +
    '</div>';
}

function listaEstudos(){
  var termos = norm(S.buscaEst.trim()).split(/\s+/).filter(Boolean), sug = sugestoesMaterias();
  if (S.sugIdx >= sug.length) S.sugIdx = 0;
  var lista = ESTUDOS.filter(function(e){
    if (S.excluidos[e.id]) return false;
    if (S.tags.length && S.tags.indexOf(e.mat) < 0) return false;
    var m = materia(e.mat), txt = norm(e.titulo + ' ' + e.desc + ' ' + m.nome + ' ' + m.sigla + ' ' + e.autor + ' ' + (APELIDOS[e.mat] || []).join(' '));
    return termos.every(function(p){ return txt.indexOf(p) >= 0; });
  });
  var h = '<div><div class="busca"><span class="busca__icone">' + ic('search','ic--16') + '</span>' +
    '<input id="buscaEst" type="search" value="' + esc(S.buscaEst) + '" placeholder="Estudo, autor ou matéria (ex.: calc)" class="busca__entrada" autocomplete="off" role="combobox" aria-autocomplete="list" aria-expanded="' + (sug.length > 0) + '"></div>' +
    (sug.length ? '<ul class="sugestoes-m" role="listbox" aria-label="Matérias sugeridas">' + sug.map(function(m, i){
      return '<li role="option" aria-selected="' + (i === S.sugIdx) + '"><button data-a="add-tag" data-v="' + m.id + '" class="sugestao-m' + (i === S.sugIdx ? ' sugestao-m--ativa' : '') + '"><span class="ponto-mat ' + corMat(m.id) + '"></span><span class="cresce truncar">' + m.nome + '</span><span class="meta-mini">' + m.sigla + '</span></button></li>';
    }).join('') + '</ul>' : '') +
    (S.tags.length ? '<div class="tags-m">' + S.tags.map(function(id){ var m = materia(id); return '<button data-a="tirar-tag" data-v="' + id + '" class="tag-m ' + corMat(id) + '" aria-label="Remover filtro ' + m.nome + '">' + m.sigla + ' ×</button>'; }).join('') + '</div>' : '') + '</div>' +
    '<div class="faixa-chips">' + chip('Todas', !S.tags.length, 'data-a="est-mat" data-v="todas"') + MATERIAS.map(function(m){ return chip(m.sigla, S.tags.indexOf(m.id) >= 0, 'data-a="est-mat" data-v="' + m.id + '"'); }).join('') + '</div>' +
    '<div class="fila-entre"><p class="texto-apoio"><span class="mono realce">' + lista.length + '</span> estudo(s)</p>' +
    (equipe() && S.tab === 'materias' ? '<button data-a="ir-publicar" class="link-acao">' + ic('plus','ic--14') + 'Publicar</button>' : '') + '</div>';

  if (!lista.length){
    return h + vazio('Nenhum estudo' + (S.buscaEst.trim() ? ' para “' + esc(S.buscaEst.trim()) + '”' : ' com esse filtro'),
      'Tente outra palavra, tire o filtro de matéria ou peça o material à monitoria.',
      btn('Limpar busca', 'data-a="limpar-busca"', 'sec', 'btn--pequeno') + btn('Pedir esse material', 'data-a="pedir-material"', null, 'btn--pequeno'));
  }
  return h + '<div class="pilha-3">' + lista.map(cartaoEstudo).join('') + '</div>';
}

function cartaoEstudo(e){
  var m = materia(e.mat), fav = !!S.favs[e.id];
  return '<div data-a="abrir-estudo" data-v="' + e.id + '" role="button" tabindex="0" class="cartao-clicavel">' +
    '<div class="fila">' + sigla(m.sigla) + (e.revisado || S.revisados[e.id] ? '<span class="selo-revisado">' + ic('check','ic--12') + 'revisado</span>' : '') +
    '<button data-a="fav" data-v="' + e.id + '" aria-pressed="' + fav + '" aria-label="Favoritar" class="favoritar' + (fav ? ' favoritar--ativo' : '') + '">' +
    (fav ? icFill('heart','ic--14') : ic('heart','ic--14')) + (e.fav + (fav ? 1 : 0)) + '</button></div>' +
    '<p class="texto-forte mt-25">' + e.titulo + '</p><p class="texto-apoio mt-1 relaxado">' + e.desc + '</p>' +
    '<div class="cartao__rodape"><span>' + e.autor + ' · ' + e.papel.toLowerCase() + '</span>' +
    '<span class="inline-icone">' + ic('comment','ic--14') + (e.com + (S.comentariosEnviados && S.comentariosEnviados[e.id] || 0)) + '</span></div></div>';
}

/* ============================== ENTRAR ============================== */
telas.entrar = function(){
  var criar = S.entrarAba === 'criar';
  var erro = S.erroLogin ? '<p class="erro mt-15">' + esc(S.erroLogin) + '</p>' : '';
  var classeErro = S.erroLogin ? 'campo__entrada--erro' : '';
  return '<div class="tela-simples">' + voltar('Voltar') +
    '<div class="entrar__topo"><span class="marca__logo-grande">HE</span>' +
    '<h1 class="titulo mt-4">' + (criar ? 'Criar conta' : 'Entrar') + '</h1>' +
    '<p class="titulo__sub">Use o e-mail institucional da universidade.</p></div>' +
    (S.motivo ? '<div class="aviso-login">' + ic('lock','ic--16 fixo ic--fraco') + esc(S.motivo) + '</div>' : '') +
    '<div class="mt-5">' + segmentado([['entrar','Entrar'],['criar','Criar conta']], S.entrarAba, 'entrar-aba') + '</div>' +
    '<div class="mt-5 pilha-4">' +
    (criar ? campo('Nome completo', 'id="nome-novo" autocomplete="name" value="' + esc(S.nomeNovo) + '" placeholder="Como aparece na matrícula"') : '') +
    '<div>' + campo('E-mail institucional', 'id="email" type="email" autocomplete="username" value="' + esc(S.email) + '" placeholder="nome@sga.exemplo.br"', classeErro) + erro + '</div>' +
    (criar ? camposSenhaNova() : campo('Senha', 'id="senha" type="password" autocomplete="current-password" value="123456"') + '<button class="link-discreto mt-n1">Esqueci minha senha</button>') +
    (S.erroGeral ? '<p class="erro">' + esc(S.erroGeral) + '</p>' : '') +
    btn(criar ? 'Criar conta e entrar' : 'Entrar', 'data-a="login"', null, 'btn--bloco') +
    '</div><p class="texto-dica centro mt-6 relaxado">Aceitamos <span class="codigo">@sga.exemplo.br</span> e <span class="codigo">@exemplo.br</span>.</p></div>';
};

/* ============================== NOTIFICAÇÕES ============================== */
telas.notificacoes = function(){
  var f = S.notifFiltro || 'Todas';
  var l = notificacoes().filter(function(n){ return f === 'Todas' || (f === 'Não lidas' ? n.nova : n.tipo === f); });
  return '<div class="tela">' + voltar('Voltar') +
    '<div class="fila-base">' + '<div>' + titulo('Notificações') + '</div>' +
    '<button data-a="marcar-lidas" class="link-discreto pb-1">Marcar todas como lidas</button></div>' +
    chips(['Todas','Não lidas','Respostas','Enquetes','Estudos'], f, 'notif-filtro') +
    (l.length ? card(l.map(function(n){
      return '<button data-a="' + n.a + '" data-v="' + n.v + '" class="item-aviso">' +
        '<span class="ponto-novo' + (n.nova ? ' ponto-novo--ativo' : '') + '"></span>' +
        '<span class="cresce"><span class="aviso__texto">' + n.txt + '</span><span class="meta bloco mt-1">' + n.quando + '</span></span>' +
        ic('right','ic--16 ic--apagado mt-05') + '</button>';
    }).join(''), 'cartao-lista') : vazio('Nada por aqui', 'Você será avisado quando alguém responder suas dúvidas.')) +
    '<button data-a="abrir-cfg" data-v="notificacoes" class="link-discreto largo centro">Escolher o que me avisa</button></div>';
};

/* ============================== CALENDÁRIO ============================== */
function dataSemana(i){ var d = new Date(2026, 8, 7 + 7 * S.semana + i); return d; }
function tarefasDoDia(d){
  if (d.getMonth() !== 8 || d.getFullYear() !== 2026 || S.semana !== 0) return [];
  return TAREFAS.filter(function(t){ return t.dia === d.getDate() && (S.calMat === 'todas' || materia(t.mat).sigla === S.calMat); });
}
function cartaoTarefa(t){
  var m = materia(t.mat);
  return '<button data-a="abrir-tarefa" data-v="' + t.id + '" class="cartao-clicavel cartao-clicavel--compacto largo esquerda">' +
    '<div class="fila-topo"><div class="cresce"><p class="texto-forte truncar">' + t.titulo + '</p>' +
    '<p class="texto-apoio mt-05">' + m.nome + ' · ' + t.tipo + '</p></div><span class="meta-escura">' + t.hora + '</span></div>' +
    '<div class="fila mt-3">' + barra(t.prog, 'barra--cresce') + '<span class="meta-escura porcentagem-tarefa num">' + t.prog + '%</span></div></button>';
}

telas.calendario = function(){
  var siglas = ['todas'].concat(MATERIAS.map(function(m){ return m.sigla; }));
  var h = '<div class="tela">' +
    '<div class="fila-base"><div>' + titulo('Calendário', S.calVista === 'semana' ? 'Suas tarefas da semana' : 'Tarefas, provas e aulões do mês') + '</div></div>' +
    segmentado([['semana','Semana'],['mes','Mês']], S.calVista, 'cal-vista') +
    '<div class="faixa-chips">' + siglas.map(function(s){ return chip(s === 'todas' ? 'Todas' : s, S.calMat === s, 'data-a="cal-mat" data-v="' + s + '"'); }).join('') + '</div>';
  h += S.calVista === 'semana' ? calSemana() : calMes();
  h += sincronizacao();
  return h + '</div>';
};

function calSemana(){
  var ini = dataSemana(0), fim = dataSemana(6);
  var faixa = pad(ini.getDate()) + '/' + pad(ini.getMonth()+1) + ' – ' + pad(fim.getDate()) + '/' + pad(fim.getMonth()+1);
  var h = '<div class="fila-entre">' +
    '<button data-a="semana" data-v="-1" aria-label="Semana anterior" class="botao-seta">' + ic('back','ic--16') + '</button>' +
    '<div class="centro"><p class="texto-forte mono num">' + faixa + '</p>' +
    (S.semana !== 0 ? '<button data-a="semana" data-v="0" class="link-hoje">voltar para hoje</button>' : '<p class="nota-mini">esta semana</p>') + '</div>' +
    '<button data-a="semana" data-v="1" aria-label="Próxima semana" class="botao-seta">' + ic('right','ic--16') + '</button></div>';

  h += '<div class="semana">';
  for (var i = 0; i < 7; i++){
    var d = dataSemana(i), hoje = S.semana === 0 && d.getDate() === 11, sel = S.diaSel === i, n = tarefasDoDia(d).length;
    h += '<button data-a="dia" data-v="' + i + '" aria-pressed="' + sel + '" class="dia' + (hoje ? ' dia--hoje' : sel ? ' dia--selecionado' : '') + '">' +
      '<span class="dia__nome' + (hoje ? ' dia__nome--hoje' : '') + '">' + DIAS_SEM[d.getDay()] + '</span>' +
      '<span class="dia__numero num">' + d.getDate() + '</span>' +
      '<span class="dia__ponto' + (n ? (hoje ? ' dia__ponto--hoje' : ' dia__ponto--tem') : '') + '"></span></button>';
  }
  h += '</div>';

  var dias = [];
  for (var j = 0; j < 7; j++){ if (S.diaSel === null || S.diaSel === j) dias.push(j); }
  var corpo = dias.map(function(j){
    var d = dataSemana(j), ts = tarefasDoDia(d), hoje = S.semana === 0 && d.getDate() === 11;
    if (!ts.length && S.diaSel === null) return '';
    return '<div><p class="dia-titulo">' + DIAS_LONGO[d.getDay()] + ', ' + d.getDate() +
      (hoje ? ' <span class="etiqueta etiqueta--hoje">hoje</span>' : '') + '</p>' +
      (ts.length ? '<div class="pilha-2">' + ts.map(cartaoTarefa).join('') + '</div>' : '<p class="texto-dica">Nenhuma tarefa neste dia.</p>') + '</div>';
  }).join('');
  if (!corpo) corpo = vazio('Nenhuma tarefa nesta semana', S.calMat !== 'todas' ? 'Tire o filtro de matéria para ver as outras.' : 'As tarefas do Canvas aparecem aqui assim que o professor publicar.');
  return h + (S.diaSel !== null ? '<button data-a="dia" data-v="' + S.diaSel + '" class="link-discreto mt-n2">Mostrar a semana toda</button>' : '') +
    '<div class="pilha-5">' + corpo + '</div>';
}

function eventosDoDia(dia){
  var l = [];
  TAREFAS.forEach(function(t){ if (t.dia === dia) l.push({ titulo:t.titulo, mat:t.mat, hora:t.hora, tipo:t.tipo, tarefa:t.id }); });
  EVENTOS_MES.forEach(function(e){ if (e.dia === dia) l.push(e); });
  if (S.aulaoMarcado && dia === 18) l.push({ titulo:'Aulão — ' + S.temaAulao, mat:'cdi', hora:'19:00', tipo:'Aulão', aulao:true });
  return l.filter(function(e){ return S.calMat === 'todas' || materia(e.mat).sigla === S.calMat; });
}
function calMes(){
  var h = '<div class="fila-entre"><button aria-label="Mês anterior" class="botao-seta">' + ic('back','ic--16') + '</button>' +
    '<p class="texto-forte">Setembro de 2026</p><button aria-label="Próximo mês" class="botao-seta">' + ic('right','ic--16') + '</button></div>';
  h += '<div><div class="mes__cabeca">' + ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'].map(function(d){ return '<span class="mes__dia-semana">' + d + '</span>'; }).join('') + '</div>' +
    '<div class="mes__grade"><span></span>'; // 01/09/2026 é terça
  for (var d = 1; d <= 30; d++){
    var ev = eventosDoDia(d), hoje = d === 11, sel = S.mesDia === d, aulao = S.aulaoMarcado && d === 18;
    h += '<button data-a="mes-dia" data-v="' + d + '" aria-pressed="' + sel + '" class="mes__dia num' +
      (hoje ? ' mes__dia--hoje' : sel ? ' mes__dia--selecionado' : aulao ? ' mes__dia--aulao' : '') + '">' + d +
      '<span class="mes__pontos">' + ev.slice(0,3).map(function(e){ return '<span class="mes__ponto' + (hoje ? ' mes__ponto--hoje' : e.tipo === 'Prova' || e.aulao ? ' mes__ponto--forte' : '') + '"></span>'; }).join('') + '</span></button>';
  }
  h += '</div></div>';
  h += '<div class="legenda"><span class="legenda__item"><span class="legenda__ponto legenda__ponto--forte"></span>prova ou aulão</span><span class="legenda__item"><span class="legenda__ponto"></span>tarefa</span></div>';

  var evs = eventosDoDia(S.mesDia), dt = new Date(2026, 8, S.mesDia);
  h += '<div><p class="dia-titulo">' + DIAS_LONGO[dt.getDay()] + ', ' + S.mesDia + ' de setembro</p>' +
    (evs.length ? '<div class="pilha-2">' + evs.map(function(e){
      var m = materia(e.mat);
      return '<button ' + (e.tarefa ? 'data-a="abrir-tarefa" data-v="' + e.tarefa + '"' : '') + ' class="evento' + (e.aulao ? ' evento--aulao' : '') + '">' +
        '<span class="evento__hora">' + e.hora + '</span><span class="cresce"><span class="texto-forte bloco">' + e.titulo + '</span>' +
        '<span class="texto-apoio bloco mt-05">' + m.sigla + ' · ' + e.tipo + (e.aulao ? ' · sala 201 · escolhido pela enquete' : '') + '</span></span></button>';
    }).join('') + '</div>' : '<p class="texto-dica">Nada marcado neste dia.</p>') + '</div>';
  return h;
}

function sincronizacao(){
  return '<section class="pt-2"><h2 class="secao__titulo mb-3">Sincronização</h2>' +
    card('<div class="fila">' + ic('refresh','ic--16 ic--suave') + '<p class="texto-forte">Importar do Canvas</p></div>' +
      '<p class="texto-apoio mt-1">Cole a URL do feed do calendário do Canvas.</p>' +
      '<input value="https://canvas.exemplo.br/feeds/calendars/user_8f2c.ics" class="campo-feed">' +
      '<div class="grade-2 mt-2">' + btn('Salvar e importar', 'data-a="importar-feed"', null, 'btn--pequeno') + btn('Atualizar agora', 'data-a="importar-feed"', 'sec', 'btn--pequeno') + '</div>' +
      '<p class="meta mt-2">' + (S.feedSalvo ? 'Importado agora · 68 eventos' : 'Última importação 04/09 · 68 eventos · atualiza sozinho a cada 6 h') + '</p>') +
    card('<div class="fila">' + ic('link','ic--16 ic--suave') + '<p class="texto-forte">Assinar no seu app</p></div>' +
      '<p class="texto-apoio mt-1">Google Agenda, Apple Calendário ou Outlook recebem suas tarefas.</p>' +
      '<p class="link-feed">https://hub.exemplo.br/feed/lorem.ics?token=a91…</p>' +
      '<div class="grade-2 mt-2">' + btn(S.copiado ? ic('check','ic--16') + 'Copiado' : 'Copiar link', 'data-a="copiar-feed"', 'sec', 'btn--pequeno') + btn('Gerar novo link', 'data-a="novo-link"', 'perigo', 'btn--pequeno') + '</div>', 'cartao mt-3') +
    '</section>';
}
function pad(n){ return (n < 10 ? '0' : '') + n; }

function modalTarefa(){
  var t = TAREFAS.filter(function(x){ return x.id === S.tarefa; })[0];
  if (!t) return '';
  var m = materia(t.mat), d = new Date(2026, 8, t.dia), aberta = t.ganho === null;
  var box = function(r, v, s){ return '<div class="caixa-dado"><p class="nota-mini-escura">' + r + '</p><p class="caixa-dado__valor num">' + v + '</p>' + (s ? '<p class="nota-mini">' + s + '</p>' : '') + '</div>'; };
  return '<div class="sobreposicao sobreposicao--centro" data-a="fechar-modal">' +
    '<div role="dialog" aria-modal="true" aria-label="' + esc(t.titulo) + '" class="modal" data-parar="1">' +
    '<div class="fila-topo"><div class="cresce-so">' + '<div class="grupo">' + sigla(m.sigla) + sigla(t.tipo.toUpperCase()) + '</div>' +
    '<h2 class="titulo-cartao mt-2">' + t.titulo + '</h2><p class="texto-apoio">' + m.nome + '</p></div>' +
    '<button data-a="fechar-modal" aria-label="Fechar" class="modal__fechar">' + ic('x','ic--16') + '</button></div>' +
    '<div class="grade-2 mt-4">' +
    box('Nota ganha', aberta ? '—' : num(t.ganho), aberta ? 'em aberto' : 'de ' + num(t.valor) + ' pts') +
    box('Nota perdida', aberta ? '—' : num(t.perdido), aberta ? 'vale ' + num(t.valor) + ' pts' : 'pts descontados') +
    '<div class="caixa-dado"><p class="nota-mini-escura">Progresso</p><p class="caixa-dado__valor num">' + t.prog + '%</p>' + barra(t.prog, 'barra--modal') + '</div>' +
    box('Vencimento', pad(t.dia) + '/09', DIAS_LONGO[d.getDay()] + ' · ' + t.hora) + '</div>' +
    '<div class="grade-2 mt-4">' + btn('Fechar', 'data-a="fechar-modal"', 'sec') + btn('Abrir matéria', 'data-a="abrir-materia" data-v="' + m.id + '"') + '</div></div></div>';
}

/* ============================== MATÉRIAS ============================== */
telas.materias = function(){
  if (!logado()){
    return '<div class="tela">' + titulo('Estudos', 'O catálogo é aberto. Suas matérias aparecem quando você entrar.') + listaEstudos() + '</div>';
  }
  var h = '<div class="tela">' + titulo('Matérias', USUARIO.periodo + ' · 20 créditos') + segmentado([['materias','Minhas matérias'],['estudos','Estudos']], S.matAba, 'mat-aba');
  if (S.matAba === 'estudos') return h + listaEstudos() + '</div>';

  var termo = S.buscaMat.trim().toLowerCase();
  var lista = minhasMaterias().filter(function(m){ return !termo || (m.nome + ' ' + m.sigla + ' ' + m.prof).toLowerCase().indexOf(termo) >= 0; });
  h += '<div class="busca"><span class="busca__icone">' + ic('search','ic--16') + '</span>' +
    '<input id="buscaMat" type="search" value="' + esc(S.buscaMat) + '" placeholder="Buscar por matéria ou professor" class="busca__entrada"></div>';
  if (!lista.length) return h + vazio('Nenhuma matéria encontrada', 'Confira o nome ou busque pelo professor.', btn('Limpar busca', 'data-a="limpar-mat"', 'sec', 'btn--pequeno')) + '</div>';
  return h + '<div class="pilha-3">' + lista.map(function(m){
    return '<button data-a="abrir-materia" data-v="' + m.id + '" class="cartao-clicavel largo esquerda">' +
      '<div class="fila-topo"><div class="cresce">' + sigla(m.sigla) + '<p class="texto-forte mt-2">' + m.nome + '</p><p class="texto-apoio">' + m.prof + '</p></div>' +
      ic('right','ic--16 ic--apagado mt-1') + '</div>' +
      '<div class="fila mt-3">' + barra(m.prog, 'barra--cresce') + '<span class="meta-escura num">' + m.prog + '%</span></div>' +
      '<div class="materia__rodape"><span>Nota <span class="mono realce num">' + (m.nota ? num(m.nota) : '—') + '</span></span><span><span class="mono realce">' + m.cred + '</span> créditos</span></div></button>';
  }).join('') + '</div></div>';
};

telas.materia = function(){
  var m = materia(S.materia), t = turmaDaMateria(m.id), r = resumoTurma(t);
  var topicos = m.topicos || [], feitos = topicos.filter(function(x){ return x[1]; }).length;
  var estudos = ESTUDOS.filter(function(e){ return e.mat === m.id && !S.excluidos[e.id]; });
  var lanc = r.av.filter(function(a){ return a.obtido !== null; });
  return '<div class="tela pag-materia' + (S.calcAberta ? ' calc-aberta' : '') + '" id="pag-materia">' + voltar('Voltar') +
    '<div class="mat-cabeca ' + corMat(m.id) + '">' + sigla(m.sigla) + '<h1 class="titulo mt-2 equilibrado">' + m.nome + '</h1><p class="titulo__sub">' + t.turma + ' · ' + t.prof + '</p></div>' +
    '<div class="grade-2">' + kpiM('Pontos obtidos', r.avaliado ? n1(r.obtido) : '—', 'de ' + n1(r.avaliado) + ' avaliados') +
      kpiM('Distribuídos', n1(r.avaliado) + '/' + n1(r.total), 'pontos do semestre') +
      kpiM('Aproveitamento', r.aproveitamento === null ? '—' : Math.round(r.aproveitamento) + '%', 'aprovação com ' + r.aprov) +
      kpiM('Frequência', r.aulas ? Math.round((1 - r.faltas / r.aulas) * 100) + '%' : '—', r.faltas + ' falta' + (r.faltas === 1 ? '' : 's') + ' · mín. ' + r.freqMin + '%') + '</div>' +
    '<div><button class="calc-gatilho" data-a="calc" aria-expanded="' + S.calcAberta + '" aria-controls="calc"><span class="calc-gatilho__icone" aria-hidden="true">±</span>Calculador de média' + ic('right','ic--16 calc-gatilho__seta') + '</button>' +
      '<section class="calc" id="calc" aria-label="Calculador de média"><div class="calc__dentro">' + calculadora(t, r) + '</div></section></div>' +
    secaoMat('Frequência', frequencia(r)) +
    secaoMat('Notas lançadas · ' + lanc.length, lanc.length ? card(lanc.map(function(a){
      return '<div class="linha-lista"><span class="cresce texto">' + esc(a.nome) + '</span><span class="mono realce num">' + n1(a.obtido) + ' / ' + n1(a.valor) + '</span></div>';
    }).join(''), 'cartao-linhas') : '<p class="texto-dica">Nenhuma nota lançada ainda.</p>') +
    (topicos.length ? secaoMat('Conteúdo programático · ' + feitos + '/' + topicos.length,
      '<div class="fila-entre texto-apoio mb-15"><span>Progresso</span><span class="mono realce">' + m.prog + '%</span></div>' + barra(m.prog, 'barra--espaco') +
      '<div class="mt-3">' + card(topicos.map(function(x, i){
        return '<div class="linha-lista">' + (x[1] ? '<span class="topico__check">' + ic('check','ic--12') + '</span>' : '<span class="topico__pendente"></span>') +
          '<span class="topico__nome' + (x[1] ? ' topico__nome--feito' : '') + '">' + x[0] + '</span><span class="meta">' + pad(i+1) + '</span></div>';
      }).join(''), 'cartao-linhas') + '</div>') : '') +
    secaoMat('Estudos de ' + m.sigla, (equipe() ? '<div class="mb-3">' + btn(ic('plus','ic--16') + 'Publicar', 'data-a="ir-publicar"', 'sec', 'btn--pequeno') + '</div>' : '') +
      (estudos.length ? '<div class="pilha-3">' + estudos.map(cartaoEstudo).join('') + '</div>'
        : vazio('Ainda não há estudos de ' + m.sigla, 'Peça um material e a monitoria é avisada.', btn('Pedir material', 'data-a="pedir-material" data-v="' + m.sigla + '"', 'sec', 'btn--pequeno')))) +
    '</div>';
};

telas.estudo = function(){
  var e = estudo(S.estudo), m = materia(e.mat), fav = !!S.favs[e.id], rev = e.revisado || S.revisados[e.id];
  var coms = (COMENTARIOS[e.id] || []).concat((S.meusComentarios && S.meusComentarios[e.id]) || []);
  var conteudo = e.id === 1
    ? '<p class="texto-leitura">Quando uma função está “dentro” de outra, a derivada é a derivada de fora, calculada na de dentro, vezes a derivada de dentro.</p>' +
      '<p class="formula">(f ∘ g)′(x) = f′(g(x)) · g′(x)</p>' +
      '<p class="rotulo-forte">Exemplo 1</p><p class="texto-leitura mt-1">h(x) = (3x² + 1)⁵. Fora: u⁵. Dentro: u = 3x² + 1.</p>' +
      '<p class="formula-linha mt-2">h′(x) = 5(3x² + 1)⁴ · 6x = 30x(3x² + 1)⁴</p>'
    : '<p class="texto-leitura">' + e.desc + '</p><div class="mt-3 pilha-2"><div class="esqueleto"></div><div class="esqueleto esqueleto--longo"></div><div class="esqueleto esqueleto--medio"></div></div>' +
      '<p class="nota-mini mt-3">O conteúdo completo abre do arquivo publicado.</p>';
  return '<div class="tela">' +
    '<div class="fila-entre">' + voltar('Voltar') +
    '<div class="grupo-1"><button data-a="fav" data-v="' + e.id + '" aria-pressed="' + fav + '" aria-label="Favoritar" class="botao-icone' + (fav ? ' botao-icone--ativo' : '') + '">' + (fav ? icFill('heart') : ic('heart')) + '</button>' +
    (equipe() ? '<button data-a="sheet" aria-label="Ações da equipe" class="botao-icone botao-icone--escuro">' + ic('more') + '</button>' : '') + '</div></div>' +
    '<div><div class="grupo-quebra">' + sigla(m.sigla) + (rev ? '<span class="selo-revisado">' + ic('check','ic--12') + 'revisado pela monitoria</span>' : '<span class="nota-mini">aguardando revisão</span>') + '</div>' +
    '<h1 class="titulo mt-2 equilibrado">' + e.titulo + '</h1>' +
    '<p class="titulo__sub">' + e.autor + ' · ' + e.papel.toLowerCase() + ' · ' + e.data + '</p></div>' +
    segmentado([['Não iniciado','Não iniciado'],['Estudando','Estudando'],['Concluído','Concluído']], S.estStatus[e.id] || 'Não iniciado', 'est-status') +
    card(conteudo) +
    '<section><h2 class="secao__titulo mb-3">Comentários e dúvidas <span class="contagem-titulo">' + coms.length + '</span></h2>' +
    (coms.length ? '<div class="pilha-3">' + coms.map(function(c){
      return '<div class="grupo-3">' + avatar(c.nome, 'avatar--p') + '<div class="cresce"><div class="fila"><span class="rotulo-forte">' + c.nome + '</span>' + papel(c.papel) + '<span class="meta-mini empurra">' + c.data + '</span></div>' +
        '<p class="comentario__texto mt-1">' + esc(c.texto) + '</p></div></div>';
    }).join('') + '</div>' : '<p class="texto-dica">Seja o primeiro a comentar.</p>') +
    '<div class="mt-4 pilha-2">' + area('Sua dúvida ou comentário', 'id="comentario" placeholder="Escreva aqui…"', esc(S.comentarioNovo)) +
    '<div class="grade-2">' + btn('Levar para Dúvidas', 'data-a="levar-duvida"', 'sec', 'btn--pequeno') + btn('Comentar', 'data-a="comentar"', null, 'btn--pequeno') + '</div></div></section></div>';
};

function sheetEquipe(){
  var e = estudo(S.estudo), rev = e.revisado || S.revisados[e.id];
  var item = function(icn, rot, sub, a, perigo){
    return '<button data-a="' + a + '" class="acao-sheet">' +
      '<span class="icone-caixa-p' + (perigo ? ' icone-caixa-p--perigo' : '') + '">' + ic(icn,'ic--16') + '</span>' +
      '<span class="cresce-so"><span class="texto bloco' + (perigo ? ' texto-perigo' : '') + '">' + rot + '</span><span class="texto-apoio bloco">' + sub + '</span></span></button>';
  };
  return '<div class="sobreposicao sobreposicao--base" data-a="fechar-sheet">' +
    '<div role="dialog" aria-modal="true" aria-label="Ações da equipe" class="sheet" data-parar="1">' +
    '<span class="sheet__alca"></span>' +
    '<div class="sheet__cabeca">' + rotulo('Ações da equipe') + '<p class="texto-forte mt-1 truncar">' + e.titulo + '</p><p class="texto-apoio">Só monitores e professores veem estas opções.</p></div>' +
    item('check', rev ? 'Revisado' : 'Marcar como revisado', rev ? 'O selo já aparece para a turma' : 'Mostra o selo de revisado para a turma', 'revisar') +
    item('upload', 'Substituir arquivo', 'Envia uma versão nova do HTML', 'fechar-sheet') +
    (S.confirmarExclusao
      ? '<div class="confirmar-exclusao"><p class="texto">Excluir “' + e.titulo + '”?</p><p class="texto-apoio mt-05">Some do catálogo e dos favoritos de quem salvou. Não dá para desfazer.</p>' +
        '<div class="grade-2 mt-3">' + btn('Cancelar', 'data-a="cancelar-exclusao"', 'sec', 'btn--pequeno') + btn('Excluir estudo', 'data-a="excluir"', 'perigo', 'btn--pequeno') + '</div></div>'
      : item('x', 'Excluir estudo', 'Remove do catálogo', 'pedir-exclusao', true)) +
    '</div></div>';
}

telas.publicar = function(){
  if (!equipe()){
    return '<div class="tela">' + voltar('Voltar') +
      vazio('Só monitores e professores publicam estudos', 'Seu cargo atual é <span class="mono realce">' + S.cargo + '</span>. Se isso está errado, fale com a coordenação da monitoria.',
        btn('Voltar ao início', 'data-a="tab" data-v="inicio"', null, 'btn--pequeno')) +
      '<p class="texto-dica centro">Quer sugerir um material? Use “Pedir esse material” em Estudos.</p></div>';
  }
  var p = prontosEnvio();
  var h = '<div class="tela">' + voltar('Voltar') + titulo('Publicar estudos', 'Escolha um ou mais arquivos. Cada um vira um cartão: confira título e matéria e publique. Os com problema esperam você corrigir.') +
    '<div><label class="envio-arquivo" for="envio-arquivos">' + ic('upload') + '<span class="texto">Escolher arquivos</span><span class="envio-arquivo__dica">.html ou .pdf · até 5 MB cada</span></label>' +
    '<input type="file" id="envio-arquivos" class="sr" multiple accept=".html,.htm,.pdf">' +
    '<div class="grade-2 mt-2">' + btn('Arquivos de exemplo', 'data-a="envio-exemplo"', 'sec', 'btn--pequeno') + (S.envios.length ? btn('Remover todos', 'data-a="envio-limpar"', 'ghost', 'btn--pequeno') : '') + '</div></div>';
  if (S.envios.length){
    h += '<div class="pilha-3">' + S.envios.map(cartaoEnvio).join('') + '</div>' +
      '<div class="envios-rodape"><p class="texto-apoio centro" id="envio-contagem">' + contagemEnvio() + '</p>' +
      btn('Publicar ' + p + ' pronto' + (p === 1 ? '' : 's'), 'data-a="publicar-envios" id="btn-publicar"' + (p ? '' : ' disabled'), null, 'btn--bloco') + '</div>';
  }
  if (S.publicados.length){
    h += '<section><h2 class="secao__titulo mb-3">Publicados agora</h2>' + card(S.publicados.map(function(e){
      return '<button data-a="abrir-estudo" data-v="' + e.id + '" class="item-lista">' + sigla(materia(e.mat).sigla) + '<span class="cresce texto truncar">' + esc(e.titulo) + '</span>' + ic('right','ic--16 ic--apagado') + '</button>';
    }).join(''), 'cartao-lista') + '<p class="texto-dica mt-2">Já aparecem em Estudos para a turma.</p></section>';
  }
  return h + '</div>';
};

/* ============================== CHAT ============================== */
telas.chat = function(){
  var h = '<div class="tela">' + titulo('Chat', 'Professores, monitores e salas da turma') + segmentado([['conversas','Conversas'],['caixa','Caixa de entrada']], S.chatAba, 'chat-aba');
  if (S.chatAba === 'caixa'){
    var itens = [
      { de:'Coordenação de CC', assunto:'Monitoria extra antes da P1', prev:'Sábado, 12/09, das 9 h às 12 h na sala 104.', data:'10 set', nova:true },
      { de:'Ipsum Dolor · monitor', assunto:'Resposta ao seu pedido #143', prev:S.respostaChegou ? 'Deriva os dois lados em x e isola y′…' : 'Recebemos seu pedido e já está na fila.', data:'hoje', nova:S.respostaChegou },
      { de:'Hub de Estudos', assunto:'Seu favorito foi revisado', prev:'Como escrever o relatório de laboratório ganhou o selo.', data:'02 set', nova:false },
      { de:'Prof.ª Magna Aliqua', assunto:'Prova de Álgebra Linear remarcada', prev:'A prova passa para 22/09, mesmo horário.', data:'01 set', nova:false }
    ];
    var f = S.caixaFiltro;
    var vis = itens.filter(function(i){ return f === 'Não lidas' ? i.nova : f === 'Arquivadas' || f === 'Enviadas' ? false : true; });
    return h + chips(['Caixa de entrada','Não lidas','Enviadas','Arquivadas'], f, 'caixa-filtro') +
      (vis.length ? card(vis.map(function(i){
        return '<button class="item-aviso"><span class="ponto-novo' + (i.nova ? ' ponto-novo--ativo' : '') + '"></span>' +
          '<span class="cresce"><span class="fila"><span class="caixa__remetente' + (i.nova ? ' caixa__remetente--nova' : '') + '">' + i.de + '</span><span class="meta-mini empurra fixo">' + i.data + '</span></span>' +
          '<span class="caixa__assunto' + (i.nova ? ' caixa__assunto--nova' : '') + '">' + i.assunto + '</span><span class="texto-apoio bloco truncar">' + i.prev + '</span></span></button>';
      }).join(''), 'cartao-lista') : vazio('Nada em ' + f.toLowerCase(), 'Os avisos oficiais e respostas a pedidos ficam guardados aqui.')) +
      '<p class="texto-dica relaxado">A caixa de entrada guarda o histórico oficial: pedidos, respostas e avisos. Conversa solta fica em Conversas.</p></div>';
  }
  return h + card(CONVERSAS.map(function(c){
    var ultima = c.msgs[c.msgs.length - 1], nao = c.nao;
    if (c.id === 'ipsum' && S.respostaChegou){ ultima = { de:'outro', t:'Deriva os dois lados em x: 2x + 2y·y′ = 0…' }; if (S.resolvido === null) nao = 1; }
    var sala = c.tipo === 'sala';
    return '<button data-a="abrir-conv" data-v="' + c.id + '" class="item-lista item-lista--alto">' +
      '<span class="relativo">' + avatar(c.nome, 'avatar--g', sala) + (c.online ? '<span class="online"></span>' : '') + '</span>' +
      '<span class="cresce"><span class="fila-15"><span class="conversa__nome' + (nao ? ' conversa__nome--nao-lida' : '') + '">' + c.nome + '</span>' + (sala ? '' : papel(c.papel)) +
      '<span class="meta-mini empurra fixo">' + c.hora + '</span></span>' +
      (sala ? '<span class="meta bloco">' + c.topico + '</span>' : '') +
      '<span class="fila"><span class="conversa__previa' + (nao ? ' conversa__previa--nao-lida' : '') + '">' + (ultima.de === 'eu' ? 'Você: ' : ultima.autor ? ultima.autor + ': ' : '') + esc(ultima.t) + '</span>' +
      (nao ? '<span class="contador-conversa">' + nao + '</span>' : '') + '</span></span></button>';
  }).join(''), 'cartao-lista') + '</div>';
};

telas.conversa = function(){
  var c = conversa(S.conv), sala = c.tipo === 'sala';
  var msgs = c.msgs.slice();
  if (c.id === 'ipsum' && S.respostaChegou) msgs.push({ de:'outro', t:'Deriva os dois lados em relação a x: 2x + 2y·y′ = 0. Isola y′ e sai y′ = −x/y. O y′ aparece porque y depende de x — é a regra da cadeia.', h:'17:24' });
  var status = sala ? '<span class="mono">' + c.topico + '</span> · 38 participantes'
    : c.fora ? 'fora do horário · atende ' + c.atende : c.online ? 'online' + (c.atende ? ' · atende ' + c.atende : '') : 'visto por último ontem';
  var h = '<div class="conversa">' +
    '<div class="conversa__topo">' +
    '<button data-a="voltar" aria-label="Voltar" class="botao-voltar">' + ic('back','ic--16') + '</button>' +
    avatar(c.nome, 'avatar--m', sala) + '<div class="cresce"><div class="fila-15"><span class="texto-forte truncar">' + c.nome + '</span>' + (sala ? '' : papel(c.papel)) + '</div>' +
    '<p class="conversa__status">' + status + '</p></div></div>' +
    '<div class="conversa__corpo">' +
    '<p class="conversa__data">hoje</p>';
  if (c.fora){
    h += '<div class="aviso-fora">' + ic('clock','ic--16 ic--suave fixo mt-05') +
      '<div><p class="rotulo-forte">Fora do horário de atendimento</p><p class="texto-apoio mt-05 relaxado">' + c.nome.split(' ')[0] + ' atende ' + c.atende + '. Sua mensagem fica na fila e chega na segunda às 14 h.</p></div></div>';
  }
  h += msgs.map(function(m){
    var eu = m.de === 'eu';
    return '<div class="mensagem' + (eu ? ' mensagem--minha' : '') + '"><div class="bolha ' + (eu ? 'bolha--minha' : 'bolha--outro') + '">' +
      (m.autor ? '<p class="bolha__autor">' + m.autor + '</p>' : '') + esc(m.t) +
      '<span class="bolha__hora">' + m.h + (eu && c.fora && m === msgs[msgs.length-1] ? ' · na fila' : '') + '</span></div></div>';
  }).join('');
  if (c.id === 'ipsum' && S.respostaChegou){
    h += S.resolvido === null
      ? '<div class="cartao"><p class="texto-forte">Isso resolveu sua dúvida?</p><p class="texto-apoio mt-05">Sua resposta conta no painel de onde a turma mais trava.</p>' +
        '<div class="grade-2 mt-3">' + btn('Ainda não', 'data-a="resolveu" data-v="nao"', 'sec', 'btn--pequeno') + btn('Sim, resolveu', 'data-a="resolveu" data-v="sim"', null, 'btn--pequeno') + '</div></div>'
      : '<p class="texto-apoio centro">' + (S.resolvido ? ic('check','ic--14 ic--inline') + ' Marcada como útil · pedido #143 encerrado' : 'Pedido #143 reaberto · o monitor foi avisado') + '</p>';
  }
  h += '</div>' +
    '<div class="conversa__envio">' +
    '<input id="rascunho" value="' + esc(S.rascunho) + '" placeholder="' + (c.fora ? 'Deixar mensagem na fila…' : 'Escreva uma mensagem…') + '" class="conversa__entrada">' +
    '<button data-a="enviar-msg" aria-label="Enviar" class="botao-enviar">' + ic('send','ic--16') + '</button></div></div>';
  return h;
};

/* ============================== DÚVIDAS & FEEDBACK ============================== */
telas.feedback = function(){
  var h = '<div class="tela">' + titulo('Dúvidas & Feedback', 'O que a turma pergunta e o que você acha da plataforma') +
    segmentado([['turma','Turma'],['enviar','Enviar'],['auloes','Aulões'],['avaliacoes','Avaliações']], S.fbAba, 'fb-aba');
  return h + ({ turma:fbTurma, enviar:fbEnviar, auloes:fbAuloes, avaliacoes:fbAvaliacoes })[S.fbAba]() + '</div>';
};

function fbTurma(){
  var topicos = [['Regra da cadeia',31],['Derivação implícita',22],['Limites laterais',12],['Continuidade',8]];
  if (S.resolvido) topicos[1][1] = 23;
  var max = 31;
  var h = chips(['CDI I','POO','ÁLG LIN','FÍS EXP'], S.fbMat, 'fb-mat');
  h += card('<div class="fila-linha-base"><h2 class="secao__titulo">Onde a turma mais trava</h2><span class="meta-mini">30 DIAS</span></div>' +
    '<p class="texto-apoio mt-05">Dúvidas enviadas por tópico · ' + S.fbMat + '</p>' +
    '<div class="mt-4 pilha-3">' + topicos.map(function(t){
      return '<div><div class="grafico__legenda"><span class="escuro">' + t[0] + '</span><span class="mono realce num">' + t[1] + '</span></div>' +
        '<div class="grafico__trilha"><div class="barra__preenchimento" style="width:' + Math.round(t[1] / max * 100) + '%"></div></div></div>';
    }).join('') + '</div>' +
    (equipe() ? '<div class="cartao__acoes">' +
      (!S.enqueteAberta ? btn('Abrir enquete de aulão com os 3 do topo', 'data-a="abrir-enquete"', null, 'btn--bloco btn--pequeno') : '') +
      btn('Gerar relatório para o professor', 'data-a="relatorio"', 'sec', 'btn--bloco btn--pequeno') + '</div>' : ''));

  if (S.enqueteAberta){
    var ops = [['Regra da cadeia na prática',52],['Derivação implícita passo a passo',29],['Limites laterais sem medo',19]];
    h += '<div class="cartao-destaque">' +
      '<div class="fila-entre">' + rotulo('Enquete · aulão') + '<span class="etiqueta">aberta</span></div>' +
      '<h2 class="secao__titulo mt-2">Qual o tema do próximo aulão?</h2>' +
      '<p class="texto-apoio">CDI I · encerra em 2 dias · <span class="mono">' + (S.votou ? 49 : 48) + '</span> votos</p>' +
      '<div class="mt-3 pilha-2">' + ops.map(function(o, i){
        var meu = S.voto === i;
        return '<button data-a="votar" data-v="' + i + '" ' + (S.votou ? 'disabled' : '') + ' class="opcao-voto' + (S.votou ? ' opcao-voto--votou' : '') + (meu ? ' opcao-voto--minha' : '') + '">' +
          '<span class="opcao-voto__barra" style="width:' + (S.votou ? o[1] : 0) + '%"></span>' +
          '<span class="opcao-voto__texto">' + (meu ? ic('check','ic--14') : '') + o[0] +
          '<span class="opcao-voto__pct num' + (S.votou ? ' opcao-voto__pct--votou' : '') + '">' + (S.votou ? o[1] + '%' : '—') + '</span></span></button>';
      }).join('') + '</div>' +
      (S.votou ? '<p class="texto-apoio mt-3">Voto registrado. O tema vencedor vira aulão na aba Aulões.</p>' : '<p class="texto-dica mt-3">Os percentuais aparecem depois do seu voto.</p>') + '</div>';
  }

  h += '<section><h2 class="secao__titulo mb-3">Dúvidas mais frequentes</h2><div class="pilha-2">' +
    duvidaItem('Por que a derivada de sen(2x) é 2cos(2x) e não cos(2x)?', 'respondida', 'Prof. Lorem Dolor · 18 marcaram como útil') +
    duvidaItem('Como saber quando o limite lateral não existe?', 'respondida', 'Ipsum Dolor (monitor) · 11 marcaram como útil') +
    (S.pedidoEnviado ? duvidaItem('Por que dy/dx fica −x/y em x² + y² = 25?', S.respostaChegou ? (S.resolvido ? 'resolvida' : 'respondida') : 'aguardando', 'sua dúvida · pedido #143', true) : '') +
    '</div></section>';
  return h;
}
function duvidaItem(t, st, sub, minha){
  return '<div class="duvida' + (minha ? ' duvida--minha' : '') + '">' +
    '<div class="fila-topo-2"><p class="duvida__texto">' + t + '</p>' +
    '<span class="status ' + (st === 'aguardando' ? 'status--aguardando' : 'status--ok') + '">' + st + '</span></div>' +
    '<p class="texto-apoio mt-15">' + sub + '</p></div>';
}

function fbEnviar(){
  if (S.naFila){
    return '<div class="painel-estado painel-estado--fila">' +
      '<p class="meta">NA FILA · 23:10</p><h2 class="titulo-cartao mt-1">Sua dúvida entrou na fila</h2>' +
      '<p class="texto-suave mt-1 relaxado">A monitoria de CDI I atende das 8 h às 22 h. O pedido é criado e os monitores são avisados assim que o atendimento abrir.</p>' +
      '<div class="mt-5">' + btn('Simular: chegou 8 h', 'data-a="abrir-horario"', null, 'btn--bloco') + '</div></div>';
  }
  if (S.pedidoEnviado){
    return '<div class="painel-estado">' +
      '<span class="sucesso__icone">' + ic('check') + '</span>' +
      '<p class="meta mt-4">PEDIDO #143</p><h2 class="titulo-cartao mt-1">Dúvida enviada</h2>' +
      '<p class="texto-suave mt-1 relaxado">Os monitores de CDI I foram avisados. Você recebe uma notificação quando alguém responder.</p>' +
      '<div class="mt-5 pilha-2">' + (S.respostaChegou ? btn('Ver a resposta', 'data-a="abrir-conv" data-v="ipsum"', null, 'btn--bloco') : btn('Simular a resposta do monitor', 'data-a="simular-resposta"', null, 'btn--bloco')) +
      btn('Enviar outra', 'data-a="nova-duvida"', 'sec', 'btn--bloco') + '</div></div>';
  }
  return '<div class="pilha-4">' +
    '<div><span class="campo__rotulo">O que você quer enviar?</span><div class="faixa-chips mt-15">' +
    ['Dúvida de matéria','Problema no app','Sugestão','Pedir material'].map(function(t){ return chip(t, S.tipoEnvio === t, 'data-a="tipo-envio" data-v="' + t + '"'); }).join('') + '</div></div>' +
    selecao('Matéria e turma', ['CDI I · turma 02','POO · turma 01','ÁLG LIN · turma 03','FÍS EXP · turma 02'], 'CDI I · turma 02', '') +
    campo('Assunto', 'id="assunto" value="' + esc(S.assunto) + '" placeholder="Ex.: derivação implícita de uma circunferência"') +
    area('Descreva', 'placeholder="O que você tentou e onde travou"') +
    '<div class="triagem">' +
    '<p class="texto-forte">Já perguntaram parecido</p><p class="texto-apoio mt-05">Veja se alguma destas resolve antes de enviar.</p>' +
    '<div class="mt-3 pilha-2">' +
    '<div class="triagem__item"><p class="texto">Quando usar derivação implícita?</p><p class="nota-mini-escura mt-05">respondida · 14 acharam útil</p></div>' +
    '<div class="triagem__item"><p class="texto">De onde vem o y′ na derivada de y²?</p><p class="nota-mini-escura mt-05">respondida · 9 acharam útil</p></div></div>' +
    btn('Resolveu, cancelar envio', 'data-a="resolveu-triagem"', 'ghost', 'btn--triagem') + '</div>' +
    btn('Enviar', 'data-a="enviar-duvida"', null, 'btn--bloco') + '</div>';
}

function fbAuloes(){
  var h = '';
  if (S.aulaoMarcado){
    h += '<div class="cartao-destaque">' + '<div class="fila-entre">' + rotulo('Confirmado') + '<span class="meta-escura">' + (S.desempate ? 'escolhido após empate' : 'venceu com 52%') + '</span></div>' +
      '<h2 class="titulo-cartao mt-2">' + esc(S.temaAulao) + '</h2><p class="texto-apoio">CDI I · com Ipsum Dolor (monitor)</p>' +
      '<div class="grade-3 mt-3">' + [['Data','18/09'],['Hora','19:00'],['Sala','201']].map(function(x){ return '<div class="caixa-dado caixa-dado--compacta"><p class="nota-micro">' + x[0] + '</p><p class="texto-forte mono">' + x[1] + '</p></div>'; }).join('') + '</div>' +
      '<div class="mt-3">' + btn('Ver no calendário', 'data-a="ir-cal-mes"', 'sec', 'btn--bloco btn--pequeno') + '</div></div>';
  } else if (S.enqueteAberta){
    h += card(rotulo('Em votação') + '<h2 class="titulo-cartao mt-2">Regra da cadeia na prática</h2><p class="texto-apoio">Lidera com 52% · enquete encerra em 2 dias</p>' +
      barra(52, 'barra--espaco') + (equipe() ? '<div class="mt-4">' + (S.etapaAulao ? '' : btn('Encerrar enquete e marcar data', 'data-a="encerrar-enquete"', null, 'btn--bloco btn--pequeno') + '<div class="mt-2">' + btn('Simular empate', 'data-a="simular-empate"', 'sec', 'btn--bloco btn--pequeno') + '</div>') + '</div>' : '<div class="mt-4">' + btn('Votar na enquete', 'data-a="fb-aba" data-v="turma"', 'sec', 'btn--bloco btn--pequeno') + '</div>'));
    if (S.etapaAulao === 'empate'){
      h += '<div class="cartao-destaque">' + rotulo('Empate') +
        '<h2 class="titulo-cartao mt-2">38% para cada tema</h2>' +
        '<p class="texto-apoio">A enquete encerrou sem vencedor. Como monitor, escolha o tema do aulão.</p>' +
        '<div class="mt-3 pilha-2">' + btn('Regra da cadeia na prática', 'data-a="desempatar" data-v="Regra da cadeia na prática"', 'sec', 'btn--bloco btn--pequeno') +
        btn('Derivação implícita passo a passo', 'data-a="desempatar" data-v="Derivação implícita passo a passo"', 'sec', 'btn--bloco btn--pequeno') + '</div></div>';
    }
    if (S.etapaAulao === 'definir'){
      h += '<div class="cartao-destaque">' + rotulo('Definir data e sala') +
        '<h2 class="titulo-cartao mt-2">' + esc(S.temaAulao) + '</h2>' +
        '<div class="grupo mt-3">' + chip('qui 18/09 · 19 h', S.dataAulao === '18', 'data-a="data-aulao" data-v="18"') +
        chip('seg 22/09 · 19 h', S.dataAulao === '22', 'data-a="data-aulao" data-v="22"') + '</div>' +
        '<div class="mt-3">' + campo('Sala', 'value="201"') + '</div>' +
        (S.conflito ? '<p class="erro mt-3 relaxado">Esse horário conflita com a Prova 2 de CDI I (22/09 · 19 h). Escolha outro horário.</p>' : '') +
        '<div class="mt-4">' + btn('Confirmar aulão', 'data-a="confirmar-aulao"', null, 'btn--bloco btn--pequeno') + '</div></div>';
    }
  } else {
    h += vazio('Nenhum aulão em votação', 'Quando um tópico acumula dúvidas, a monitoria abre uma enquete e ela aparece aqui.', equipe() ? btn('Ver onde a turma trava', 'data-a="fb-aba" data-v="turma"', 'sec', 'btn--pequeno') : '');
  }
  h += '<section><h2 class="secao__titulo mb-3">Aulões anteriores</h2>' + card(
    [['Limites e continuidade','CDI I','28 ago','41 presentes'],['Encapsulamento em Java','POO','21 ago','27 presentes']].map(function(a){
      return '<div class="linha-lista"><div class="cresce"><p class="texto">' + a[0] + '</p><p class="texto-apoio">' + a[1] + ' · ' + a[3] + '</p></div><span class="meta">' + a[2] + '</span></div>';
    }).join(''), 'cartao-linhas') + '</section>';
  return h;
}

function fbAvaliacoes(){
  var dist = [[5,128],[4,64],[3,14],[2,4],[1,2]], total = 212, extra = S.minhaAval ? 1 : 0;
  var lista = (S.minhaAval ? [S.minhaAval] : []).concat(AVALIACOES).filter(function(a){ return S.avalFiltro === 'Todas' || a.cat === S.avalFiltro; });
  var h = card('<div class="resumo-notas"><div class="centro"><p class="nota-media num">4.5</p><div class="mt-1">' + estrelas(4.5) + '</div>' +
    '<p class="nota-mini-escura mt-1"><span class="mono">' + (total + extra) + '</span> avaliações</p></div>' +
    '<div class="cresce-so pilha-15">' + dist.map(function(d){
      return '<div class="distribuicao"><span class="distribuicao__estrela">' + d[0] + '</span>' +
        '<div class="barra barra--cresce"><div class="barra__preenchimento" style="width:' + Math.round(d[1] / 128 * 100) + '%"></div></div>' +
        '<span class="distribuicao__total num">' + d[1] + '</span></div>';
    }).join('') + '</div></div>');

  h += S.minhaAval
    ? '<div class="avaliacao-enviada">' + ic('check','ic--16 ic--forte') + '<p class="texto-escuro">Obrigado! Sua avaliação já aparece na lista.</p></div>'
    : card('<h2 class="secao__titulo">Avaliar a plataforma</h2>' +
      '<div class="grupo-1 mt-3" role="radiogroup" aria-label="Nota">' + [1,2,3,4,5].map(function(i){
        return '<button data-a="aval-nota" data-v="' + i + '" role="radio" aria-checked="' + (S.avalNota === i) + '" aria-label="' + i + ' estrela' + (i > 1 ? 's' : '') + '" class="botao-estrela">' +
          (i <= S.avalNota ? icFill('star','ic--24 ic--forte') : ic('star','ic--24 ic--apagado')) + '</button>';
      }).join('') + '<span class="texto-apoio ml-2 alinha-centro">' + (['Toque para dar nota','Ruim','Fraco','Ok','Bom','Excelente'][S.avalNota]) + '</span></div>' +
      '<div class="mt-3 pilha-3">' + selecao('Categoria', ['Geral','Calendário','Matérias','Chat'], S.avalCat, 'id="avalCat"') +
      area('Comentário', 'id="avalTexto" placeholder="O que funcionou e o que falta?"', esc(S.avalTexto)) +
      btn('Enviar avaliação', 'data-a="enviar-aval"', null, 'btn--bloco') + '</div>');

  h += chips(['Todas','Geral','Calendário','Matérias','Chat'], S.avalFiltro, 'aval-filtro');
  h += lista.length ? '<div class="pilha-3">' + lista.map(function(a){
    return card('<div class="fila-3">' + avatar(a.nome, 'avatar--m') + '<div class="cresce"><div class="fila-15"><span class="texto-forte truncar">' + a.nome + '</span>' + papel(a.papel) + '</div>' +
      '<div class="fila mt-05">' + estrelas(a.nota, 'ic--12') + '<span class="meta-mini">' + a.data + '</span></div></div>' + sigla(a.cat.toUpperCase()) + '</div>' +
      '<p class="comentario__texto mt-3">' + esc(a.texto) + '</p>');
  }).join('') + '</div>' : vazio('Sem avaliações em ' + S.avalFiltro, 'Seja a primeira pessoa a avaliar esta parte.');
  return h;
}

/* ============================== CONFIG ============================== */
var SECOES = [
  ['perfil','Perfil','Foto, nome e dados acadêmicos','user'],
  ['integracoes','Integrações','Canvas: matérias, notas e frequência','link'],
  ['notificacoes','Notificações','Push e e-mail','bell'],
  ['aparencia','Aparência','Tema, densidade, fonte e idioma','sun'],
  ['privacidade','Privacidade','Visibilidade e seus dados','eye'],
  ['acessibilidade','Acessibilidade','Contraste, animações e leitor de tela','access'],
  ['conta','Conta e segurança','Senha, 2FA e sessões','lock']
];
// linhas = true separa os itens diretos da seção com uma linha fina
function secao(t, inner, linhas){ return '<div class="secao-cfg' + (linhas ? ' secao-cfg--linhas' : '') + '">' + (t ? '<div class="secao-cfg__cabeca"><h2 class="texto-forte">' + t + '</h2></div>' : '') + inner + '</div>'; }
function linha(rot, sub, ctrl){ return '<div class="linha-lista"><div class="cresce"><p class="texto">' + rot + '</p>' + (sub ? '<p class="texto-apoio mt-05">' + sub + '</p>' : '') + '</div>' + ctrl + '</div>'; }
function salvar(){ return btn('Salvar alterações', 'data-a="salvar"', null, 'btn--bloco'); }

telas.config = function(){
  return '<div class="tela">' + titulo('Configurações') +
    '<button data-a="abrir-cfg" data-v="perfil" class="cartao-clicavel largo fila-3 esquerda">' +
    '<span class="avatar-perfil">' + USUARIO.iniciais + '</span>' +
    '<span class="cresce"><span class="texto-forte bloco">' + USUARIO.nome + '</span><span class="texto-apoio bloco truncar">' + USUARIO.email + '</span>' +
    '<span class="inline-bloco mt-1">' + papel(S.cargo) + '</span></span>' + ic('right','ic--16 ic--apagado') + '</button>' +
    secao('', SECOES.map(function(s){
      return '<button data-a="abrir-cfg" data-v="' + s[0] + '" class="item-lista item-lista--alto">' +
        '<span class="icone-caixa-p">' + ic(s[3],'ic--16') + '</span>' +
        '<span class="cresce"><span class="texto bloco">' + s[1] + '</span><span class="texto-apoio bloco">' + s[2] + '</span></span>' + ic('right','ic--16 ic--apagado') + '</button>';
    }).join(''), true) +
    secao('', '<button data-a="ir-minhas" class="item-lista item-lista--alto"><span class="icone-caixa-p">' + ic('book','ic--16') + '</span><span class="cresce"><span class="texto bloco">Minhas matérias</span><span class="texto-apoio bloco">Turmas do Canvas e adicionadas por você</span></span>' + ic('right','ic--16 ic--apagado') + '</button>' +
      (docente() ? '<button data-a="ir-relatorios" class="item-lista item-lista--alto"><span class="icone-caixa-p">' + ic('star','ic--16') + '</span><span class="cresce"><span class="texto bloco">Relatórios</span><span class="texto-apoio bloco">Engajamento e desempenho das turmas</span></span>' + ic('right','ic--16 ic--apagado') + '</button>' +
        '<button data-a="ir-pessoas" class="item-lista item-lista--alto"><span class="icone-caixa-p">' + ic('user','ic--16') + '</span><span class="cresce"><span class="texto bloco">Pessoas e cargos</span><span class="texto-apoio bloco">Aluno e monitor por turma, página ou arquivo</span></span>' + ic('right','ic--16 ic--apagado') + '</button>' : ''), true) +
    btn(ic('logout','ic--16') + 'Sair', 'data-a="sair"', 'sec', 'btn--bloco') +
    '<p class="meta-mini centro">Hub de Estudos · versão 0.9 · protótipo</p></div>';
};

telas.cfg = function(){
  var sec = SECOES.filter(function(s){ return s[0] === S.cfgSec; })[0];
  var h = '<div class="tela">' + voltar('Configurações') + titulo(sec[1], sec[2]);

  if (S.cfgSec === 'perfil'){
    h += secao('Foto', '<div class="foto-perfil"><span class="avatar-perfil avatar-perfil--grande">' + USUARIO.iniciais + '</span>' +
        '<div class="coluna-2">' + btn('Alterar foto', '', 'sec', 'btn--pequeno') + '<span class="nota-mini">JPG ou PNG, até 2 MB</span></div></div>') +
      secao('Informações pessoais', '<div class="secao-cfg__corpo pilha-4">' + campo('Nome', 'value="' + USUARIO.nome + '"') + campo('Nome de exibição', 'value="Lorem"') +
        '<div>' + campo('E-mail institucional', 'value="' + USUARIO.email + '" disabled') + '<p class="nota-mini mt-1">Vem da universidade e não pode ser alterado.</p></div>' +
        area('Bio', 'placeholder="Conte o que você está estudando"', 'Curtindo Cálculo mais do que esperava.') + '</div>') +
      secao('Dados acadêmicos', '<div class="linhas">' +
        [['Matrícula', '<span class="mono">' + USUARIO.matricula + '</span>'],['Curso', USUARIO.curso],['Período', USUARIO.periodo],['Turno', USUARIO.turno],['Cargo', papel(S.cargo)]].map(function(r){
          return '<div class="dado-linha"><span class="texto-apoio">' + r[0] + '</span><span class="texto">' + r[1] + '</span></div>';
        }).join('') + '</div><p class="secao-cfg__rodape">O cargo vale por turma: o professor da turma muda aluno e monitor; a coordenação muda qualquer cargo.</p>') + salvar();
  }

  if (S.cfgSec === 'notificacoes'){
    h += secao('', '<div class="tabela-notif__cabeca"><span class="tabela-notif__titulo">Avisar sobre</span><span class="tabela-notif__canal">Push</span><span class="tabela-notif__canal">E-mail</span></div>' +
      '<div class="linhas">' + NOTIF_ITENS.map(function(t, i){
        var v = S.notif[t];
        return '<div class="tabela-notif__linha"><span class="tabela-notif__nome">' + t + '</span>' +
          '<span class="centraliza">' + toggle(v[0], 'data-a="notif" data-v="' + i + '-0"', t + ' por push') + '</span>' +
          '<span class="centraliza">' + toggle(v[1], 'data-a="notif" data-v="' + i + '-1"', t + ' por e-mail') + '</span></div>';
      }).join('') + '</div>') +
      secao('Silenciar', linha('Não perturbe à noite', 'Das 23 h às 7 h, só avisos de prova', toggle(true, 'data-a="noop"', 'Não perturbe'))) + salvar();
  }

  if (S.cfgSec === 'aparencia'){
    h += secao('Tema', '<div class="secao-cfg__corpo">' + segmentado([['Claro','Claro'],['Escuro','Escuro'],['Sistema','Sistema']], S.tema, 'tema') + '<p class="nota-mini mt-2">Vale para o celular e para o protótipo desktop neste navegador.</p></div>') +
      secao('Densidade', '<div class="secao-cfg__corpo">' + segmentado([['Compacta','Compacta'],['Confortável','Confortável']], S.densidade, 'densidade') + '<p class="nota-mini mt-2">Compacta mostra mais tarefas por tela.</p></div>') +
      secao('Tamanho da fonte', '<div class="secao-cfg__corpo">' + segmentado([['Pequena','Pequena'],['Média','Média'],['Grande','Grande']], S.fonte, 'fonte') +
        '<p class="previa-fonte ' + ({Pequena:'previa-fonte--pequena', 'Média':'previa-fonte--media', Grande:'previa-fonte--grande'})[S.fonte] + '">Assim fica o texto das listas e mensagens.</p></div>') +
      secao('Idioma', '<div class="secao-cfg__corpo">' + selecao('Idioma do app', ['Português (Brasil)','English','Español'], S.idioma, 'id="idioma"') + '</div>') + salvar();
  }

  if (S.cfgSec === 'privacidade'){
    h += secao('Visibilidade', '<div class="secao-cfg__corpo">' + selecao('Quem vê meu perfil', ['Colegas da turma','Só monitores e professores','Ninguém'], S.visibilidade, 'id="visibilidade"') + '</div>' +
        '<div class="linhas linhas--separadas">' + linha('Mostrar quando estou online', 'Aparece no chat para os colegas', toggle(S.online, 'data-a="priv" data-v="online"', 'Status online')) +
        linha('Uso anônimo', 'Ajuda a melhorar o app; nada identifica você', toggle(S.rastreio, 'data-a="priv" data-v="rastreio"', 'Uso anônimo')) + '</div>') +
      secao('Seus dados', '<div class="linhas">' + linha('Exportar meus dados', 'Arquivo .zip com tarefas, favoritos e mensagens', btn('Exportar', 'data-a="toast" data-v="Exportação iniciada. O link chega no seu e-mail."', 'sec', 'btn--pequeno')) +
        linha('Limpar histórico de estudo', 'Zera horas e tópicos concluídos', btn('Limpar', 'data-a="toast" data-v="Histórico limpo."', 'perigo', 'btn--pequeno')) + '</div>') + salvar();
  }

  if (S.cfgSec === 'acessibilidade'){
    var desc = { 'Alto contraste':'Bordas e textos mais escuros', 'Reduzir animações':'Tira transições e rolagem suave', 'Otimizar para leitor de tela':'Descrições extras em gráficos e ícones', 'Atalhos de teclado':'Com teclado físico conectado', 'Destaque de foco reforçado':'Contorno grosso no item selecionado' };
    h += secao('', '<div class="linhas">' + Object.keys(S.a11y).map(function(k){ return linha(k, desc[k], toggle(S.a11y[k], 'data-a="a11y" data-v="' + k + '"', k)); }).join('') + '</div>') + salvar();
  }

  if (S.cfgSec === 'conta'){
    h += secao('Senha', '<div class="secao-cfg__corpo pilha-3">' + campo('Senha atual', 'type="password" placeholder="••••••"') + campo('Nova senha', 'type="password" placeholder="Mínimo de 6 caracteres"') + btn('Alterar senha', 'data-a="toast" data-v="Senha alterada."', 'sec', 'btn--bloco btn--pequeno') + '</div>') +
      secao('Verificação em duas etapas', linha('App autenticador', S.twofa ? 'Ativa desde 12 ago' : 'Desativada', toggle(S.twofa, 'data-a="twofa"', 'Verificação em duas etapas'))) +
      secao('Sessões ativas', '<div class="linhas">' +
        linha('Este celular', 'Chrome · Android · agora', '<span class="etiqueta-atual">atual</span>') +
        (S.sessoes > 1 ? linha('Notebook', 'Firefox · Linux · ontem, 21:10', btn('Encerrar', 'data-a="encerrar-sessao"', 'sec', 'btn--pequeno')) : '') + '</div>') +
      btn(ic('logout','ic--16') + 'Sair', 'data-a="sair"', 'sec', 'btn--bloco') +
      '<div class="zona-perigo"><div class="zona-perigo__cabeca"><h2 class="zona-perigo__titulo">Zona de perigo</h2></div>' +
      '<div class="linhas">' + linha('Sair de todos os dispositivos', 'Encerra todas as sessões, inclusive esta', btn('Sair de todos', 'data-a="sair"', 'perigo', 'btn--pequeno')) +
      linha('Excluir conta', 'Apaga seus dados em 30 dias', btn('Excluir', 'data-a="toast" data-v="Enviamos a confirmação para o seu e-mail."', 'perigo', 'btn--pequeno')) + '</div></div>';
  }
  if (S.cfgSec === 'integracoes') h += integracoesMobile();
  return h + '</div>';
};

/* ============================== NOVIDADES ==============================
   Hub de matérias, calculador de média, busca por tags, criar conta com senha forte,
   integrações (Canvas), minhas matérias, publicar em cartões, pessoas e cargos,
   relatórios do professor e tema claro/escuro. Mesmas regras do protótipo desktop,
   adaptadas para toque: o que lá abre com hover, aqui abre com um toque. */

function norm(t){ return String(t).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
function soma(l, f){ return l.reduce(function(a, x){ return a + (f ? f(x) : x); }, 0); }
// número sem casas forçadas: 45 → "45", 45.5 → "45,5"
function n1(v){ return (Math.round(v * 10) / 10).toFixed(Math.round(v * 10) % 10 ? 1 : 0).replace('.', ','); }
// número pseudoaleatório fixo por texto: os dados fictícios não mudam a cada toque
function sorteio(txt, min, max){
  var h = 0;
  for (var i = 0; i < txt.length; i++) h = (h * 31 + txt.charCodeAt(i)) % 100003;
  return min + (h % 1000) / 999 * (max - min);
}

/* ---------- tema ---------- */
var TEMA_ROT = { claro:'Claro', escuro:'Escuro', sistema:'Sistema' };
var TEMA_VAL = { Claro:'claro', Escuro:'escuro', Sistema:'sistema' };
function aplicarTema(pref){
  var escuro = pref === 'escuro' || (pref === 'sistema' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.setAttribute('data-tema', escuro ? 'escuro' : 'claro');
}
function temaSalvo(){ try { return localStorage.getItem('hub-tema') || 'claro'; } catch (e) { return 'claro'; } }
function salvarTema(pref){ try { localStorage.setItem('hub-tema', pref); } catch (e) {} aplicarTema(pref); }
aplicarTema(temaSalvo());
INICIAL.tema = TEMA_ROT[temaSalvo()] || 'Claro';
S.tema = INICIAL.tema;
// o protótipo desktop e este celular usam a mesma chave: mudar num muda no outro
window.addEventListener('storage', function(e){
  if (e.key !== 'hub-tema' || !e.newValue) return;
  aplicarTema(e.newValue); S.tema = TEMA_ROT[e.newValue] || 'Claro'; render();
});

/* ---------- catálogo, apelidos e cores ---------- */
var OUTRAS_MATERIAS = [
  { id:'cdi2', sigla:'CDI II', nome:'Cálculo Diferencial e Integral II', prof:'Prof.ª Aliqua Veniam', prog:0, nota:0, cred:6, topicos:[] },
  { id:'cdi3', sigla:'CDI III', nome:'Cálculo Diferencial e Integral III', prof:'Prof. Nostrud Exer', prog:0, nota:0, cred:4, topicos:[] },
  { id:'aeds2', sigla:'AEDS II', nome:'Algoritmos e Estruturas de Dados II', prof:'Prof. Ullamco Labo', prog:0, nota:0, cred:4, topicos:[] },
  { id:'bd1', sigla:'BD I', nome:'Banco de Dados I', prof:'Prof.ª Quis Nostrud', prog:0, nota:0, cred:4, topicos:[] }
];
function todasMaterias(){ return MATERIAS.concat(OUTRAS_MATERIAS); }
var APELIDOS = {
  cdi:['calc','calculo','cdi','derivada'], cdi2:['calc','calculo','cdi','integral'], cdi3:['calc','calculo','cdi','multivariavel'],
  fis:['fis','fisica','experimental','laboratorio'], poo:['poo','java','objetos','programacao'], ing:['ing','ingles','english'],
  fil:['fil','filosofia','ciencia'], alg:['alg','algebra','linear','matriz'], aeds2:['aeds','algoritmos','estruturas'], bd1:['bd','banco','sql']
};
var MAT_COR = { cdi:1, fis:2, poo:3, ing:4, fil:5, alg:6, cdi2:1, cdi3:1, aeds2:3, bd1:2 };
function corMat(id){ return 'cor-mat-' + (MAT_COR[id] || 1); }

/* ---------- turmas, regras de nota e notas do aluno ---------- */
var PROF_EU = 'Prof. Lorem Dolor';
var NOMES = ['Ipsum Dolor','Sit Amet','Consectetur Elit','Adipiscing Sed','Tempor Magna','Aliqua Veniam','Dolor Sit','Magna Aliqua','Veniam Quis','Nostrud Exer','Ullamco Labo','Quis Nostrud'];
function membros(base, qtd, monitores, comigo){
  var l = [];
  for (var i = 0; i < qtd; i++) l.push({ mat:String(2025010100 + base * 37 + i * 13), nome:NOMES[(base + i) % NOMES.length], papel:monitores.indexOf(i) >= 0 ? 'monitor' : 'aluno' });
  if (comigo) l.splice(2, 0, { mat:USUARIO.matricula, nome:USUARIO.nome, papel:'aluno' });
  return l;
}
function regra(aprovacao, frequencia, lista){ return { aprovacao:aprovacao, frequencia:frequencia, avaliacoes:lista.map(function(a){ return { nome:a[0], valor:a[1] }; }) }; }
var R_CDI = [['Lista 1',5],['Lista 2',5],['Lista 3',5],['P1',25],['Lista 4',5],['Trabalho',20],['P2',35]];
var R_ALG = [['Lista 1',10],['P1',30],['Lista 2',10],['P2',30],['Trabalho',20]];
var R_POO = [['Quiz 1',4],['Lab 1',10],['Trabalho — Herança',20],['Prova 1',30],['Projeto final',36]];
var TURMAS = [
  // turmas do professor simulado (Prof. Lorem Dolor)
  { id:'cdi-02', mat:'cdi', turma:'turma 02', turno:'noite', prof:PROF_EU, membros:membros(1, 11, [0], true), regra:regra(60, 75, R_CDI) },
  { id:'cdi-05', mat:'cdi', turma:'turma 05', turno:'manhã', prof:PROF_EU, membros:membros(4, 10, [2]), regra:regra(60, 75, R_CDI) },
  { id:'alg-03', mat:'alg', turma:'turma 03', turno:'noite', prof:PROF_EU, membros:membros(6, 10, [1]), regra:regra(60, 75, R_ALG) },
  { id:'poo-04', mat:'poo', turma:'turma 04', turno:'noite', prof:PROF_EU, membros:membros(3, 11, [3]), regra:regra(60, 75, R_POO) },
  { id:'fis-02', mat:'fis', turma:'turma 02', turno:'noite', prof:PROF_EU, membros:membros(8, 9, []), regra:null },
  // demais turmas do aluno
  { id:'fis-01', mat:'fis', turma:'turma 01', turno:'noite', prof:'Prof.ª Sit Amet', membros:membros(5, 10, [], true),
    regra:regra(60, 75, [['Relatório — Erros',10],['Relatório — Pêndulo',10],['Relatório — Lançamento',15],['Prova',35],['Relatório final',30]]) },
  { id:'poo-01', mat:'poo', turma:'turma 01', turno:'noite', prof:'Prof. Consectetur Elit', membros:membros(7, 10, [1], true), regra:regra(60, 75, R_POO) },
  { id:'ing-01', mat:'ing', turma:'turma 01', turno:'noite', prof:'Prof.ª Adipiscing Sed', membros:membros(9, 10, [], true),
    regra:regra(60, 75, [['Reading 1',5],['Reading 2',5],['Prova 1',40],['Reading 3',10],['Prova 2',40]]) },
  { id:'fil-01', mat:'fil', turma:'turma 01', turno:'noite', prof:'Prof. Tempor Incididunt', membros:membros(10, 10, [], true), regra:null },
  { id:'alg-01', mat:'alg', turma:'turma 01', turno:'noite', prof:'Prof.ª Magna Aliqua', membros:membros(11, 10, [], true), regra:regra(60, 75, R_ALG) },
  // turmas que o aluno pode pedir para entrar
  { id:'cdi2-01', mat:'cdi2', turma:'turma 01', turno:'noite', prof:'Prof.ª Aliqua Veniam', membros:membros(2, 10, []), regra:null },
  { id:'cdi3-01', mat:'cdi3', turma:'turma 01', turno:'manhã', prof:'Prof. Nostrud Exer', membros:membros(0, 10, []), regra:null },
  { id:'aeds2-01', mat:'aeds2', turma:'turma 01', turno:'noite', prof:'Prof. Ullamco Labo', membros:membros(6, 10, []), regra:null },
  { id:'bd1-01', mat:'bd1', turma:'turma 01', turno:'noite', prof:'Prof.ª Quis Nostrud', membros:membros(9, 10, []), regra:null }
];
function turma(id){ return TURMAS.filter(function(t){ return t.id === id; })[0]; }
function nomeTurma(t){ return materia(t.mat).sigla + ' · ' + t.turma; }
function turmasDoDocente(){ return TURMAS.filter(function(t){ return S.cargo === 'admin' ? MATERIAS.some(function(m){ return m.id === t.mat; }) : t.prof === PROF_EU; }); }
var NOTAS_EU = {
  'cdi-02':{ notas:{'Lista 1':4.5, 'Lista 2':5, 'Lista 3':4.5, 'P1':17}, aulas:48, faltas:6, pendentes:['Lista 4 — Regra da cadeia · hoje', 'P2 · 14/10'] },
  'fis-01':{ notas:{'Relatório — Erros':9, 'Relatório — Pêndulo':8.5}, aulas:16, faltas:3, pendentes:['Relatório — Lançamento · 18/09'] },
  'poo-01':{ notas:{'Quiz 1':4, 'Lab 1':8}, aulas:32, faltas:2, pendentes:['Trabalho — Herança · 16/09'] },
  'ing-01':{ notas:{'Reading 1':5, 'Reading 2':4}, aulas:16, faltas:0, pendentes:['Reading 3 · 20/09'] },
  // turma sem regra cadastrada: só as notas lançadas no Canvas
  'fil-01':{ lancadas:[{nome:'Fichamento 1', valor:10, obtido:7}], aulas:16, faltas:1, pendentes:['Resenha — Popper · 12/09'] },
  'alg-01':{ notas:{'Lista 1':6}, aulas:32, faltas:4, pendentes:['Exercícios — Matrizes inversas · 13/09', 'P1 · 22/09'] }
};
var CANVAS_CURSOS = ['cdi-02','fis-01','poo-01','ing-01','fil-01','alg-01'];
var SEMESTRE_EU = [0, 71, 69, 74, 70, 72, 75, 73, 74, 76, 76];
var CONTEUDOS = {
  cdi:[{tipo:'PDF', titulo:'Lista 4 — enunciado'}, {tipo:'Publicação', titulo:'P1 confirmada para 14/09'}],
  fis:[{tipo:'PDF', titulo:'Roteiro — lançamento horizontal'}],
  poo:[{tipo:'Projeto', titulo:'Enunciado do projeto final'}, {tipo:'PDF', titulo:'Slides — interfaces'}],
  ing:[{tipo:'PDF', titulo:'Paper da semana'}],
  fil:[{tipo:'PDF', titulo:'Texto — Popper, cap. 1'}],
  alg:[{tipo:'PDF', titulo:'Lista 2 — matrizes'}, {tipo:'Publicação', titulo:'Monitoria extra na quinta'}]
};

function avaliacoesDe(t){
  var d = NOTAS_EU[t.id] || {};
  if (t.regra){
    // as notas lançadas casam com a regra pelo nome da avaliação
    var notas = {};
    Object.keys(d.notas || {}).forEach(function(k){ notas[norm(k)] = d.notas[k]; });
    (d.lancadas || []).forEach(function(a){ notas[norm(a.nome)] = a.obtido; });
    return t.regra.avaliacoes.map(function(a){ var ob = notas[norm(a.nome)]; return { nome:a.nome, valor:a.valor, obtido:ob === undefined ? null : ob }; });
  }
  var l = (d.lancadas || []).map(function(a){ return { nome:a.nome, valor:a.valor, obtido:a.obtido }; });
  var resto = 100 - soma(l, function(a){ return a.valor; });
  if (resto > 0) l.push({ nome:'Restante do semestre', valor:resto, obtido:null, generico:true });
  return l;
}
function resumoTurma(t){
  var av = avaliacoesDe(t), d = NOTAS_EU[t.id] || { aulas:0, faltas:0, pendentes:[] };
  var lanc = av.filter(function(a){ return a.obtido !== null; });
  var obtido = soma(lanc, function(a){ return a.obtido; }), avaliado = soma(lanc, function(a){ return a.valor; });
  var freqMin = t.regra ? t.regra.frequencia : 75;
  return { av:av, obtido:obtido, avaliado:avaliado, total:soma(av, function(a){ return a.valor; }), aprov:t.regra ? t.regra.aprovacao : 60, freqMin:freqMin,
           aproveitamento:avaliado ? obtido / avaliado * 100 : null, aulas:d.aulas || 0, faltas:d.faltas || 0,
           limite:Math.floor((d.aulas || 0) * (1 - freqMin / 100)), pendentes:d.pendentes || [] };
}
function vinculosAtivos(){ return S.vinculos.filter(function(v){ return v.status === 'ativo'; }); }
function minhasMaterias(){ return vinculosAtivos().map(function(v){ return materia(turma(v.turma).mat); }); }
function turmaDaMateria(mid){
  var v = vinculosAtivos().filter(function(x){ return turma(x.turma).mat === mid; })[0];
  return v ? turma(v.turma) : TURMAS.filter(function(t){ return t.mat === mid; })[0];
}

/* ---------- peças novas ---------- */
function kpiM(rot, valor, sub){ return '<div class="kpi-m"><p class="nota-mini-escura">' + rot + '</p><p class="kpi-m__valor num">' + valor + '</p>' + (sub ? '<p class="nota-mini">' + sub + '</p>' : '') + '</div>'; }
function semPermissao(txt){
  return '<div class="tela">' + voltar('Voltar') +
    vazio(txt, 'Seu cargo atual é <span class="mono realce">' + S.cargo + '</span>. Troque o cargo no painel ao lado para ver esta tela.', btn('Voltar ao início', 'data-a="tab" data-v="inicio"', null, 'btn--pequeno')) + '</div>';
}
function selectDe(attrs, opcoes, atual){
  return '<select ' + attrs + ' class="campo__selecao">' + opcoes.map(function(o){
    return '<option value="' + esc(o[0]) + '"' + (o[0] === atual ? ' selected' : '') + '>' + o[1] + '</option>';
  }).join('') + '</select>';
}

/* ---------- hub: matérias que abrem com toque + desempenho ---------- */
function hubMaterias(){
  var ts = vinculosAtivos().map(function(v){ return turma(v.turma); });
  var h = '<section><div class="fila-entre mb-3"><h2 class="secao__titulo">Suas matérias</h2><button data-a="ir-minhas" class="link-discreto">Gerenciar</button></div>';
  if (!ts.length){
    h += vazio('Nenhuma matéria por aqui', 'Conecte o Canvas para suas matérias aparecerem sozinhas, ou adicione uma turma.',
      btn('Conectar o Canvas', 'data-a="ir-integracoes"', null, 'btn--pequeno') + btn('Adicionar turma', 'data-a="ir-minhas"', 'sec', 'btn--pequeno'));
  } else {
    h += '<p class="texto-dica mb-3">Toque numa matéria para ver o que tem nela.</p>' +
      '<div class="mat-lista' + (S.expandida ? ' mat-lista--uma-aberta' : '') + '">' + ts.map(tileMateria).join('') + '</div>';
  }
  h += '</section>';
  h += card('<div class="fila-entre"><h2 class="secao__titulo">Desempenho do semestre</h2><span class="meta-mini">META 60%</span></div>' +
    '<p class="texto-apoio mt-05">Aproveitamento acumulado por semana</p>' + graficoSemestre(SEMESTRE_EU) +
    '<div class="grade-3 mt-3">' + kpiM('Aproveitamento', SEMESTRE_EU[SEMESTRE_EU.length - 1] + '%') + kpiM('No prazo', '34/41') + kpiM('Frequência', '89%') + '</div>');
  return h;
}
function tileMateria(t){
  var m = materia(t.mat), r = resumoTurma(t), aberta = S.expandida === t.id;
  var pObt = r.total ? r.obtido / r.total * 100 : 0, pPerd = r.total ? (r.avaliado - r.obtido) / r.total * 100 : 0;
  var conteudos = ESTUDOS.filter(function(e){ return e.mat === t.mat && !S.excluidos[e.id]; }).map(function(e){ return { tipo:'Estudo', titulo:e.titulo, estudo:e.id }; })
    .concat(CONTEUDOS[t.mat] || []);
  return '<div class="mat-tile ' + corMat(t.mat) + (aberta ? ' mat-tile--aberta' : '') + '">' +
    '<button class="mat-tile__topo" data-a="expandir-materia" data-v="' + t.id + '" aria-expanded="' + aberta + '">' +
      '<span class="mat-tile__faixa"></span><span class="cresce"><span class="mat-tile__sigla">' + m.sigla + '</span><span class="mat-tile__nome">' + m.nome + '</span></span>' +
      '<span class="mat-tile__pts num">' + (r.avaliado ? n1(r.obtido) + '<small>/' + n1(r.avaliado) + '</small>' : '—') + '</span>' +
      ic('right', 'ic--16 ic--apagado mat-tile__seta') + '</button>' +
    '<div class="mat-tile__resumo"><div class="barra-pts"><span class="barra-pts__obtido" style="width:' + pObt + '%"></span><span class="barra-pts__perdido" style="width:' + pPerd + '%"></span></div>' +
      '<div class="mat-tile__rodape"><span>' + r.pendentes.length + ' pendente' + (r.pendentes.length === 1 ? '' : 's') + '</span><span>' + (r.avaliado ? n1(r.avaliado) + ' de ' : '') + n1(r.total) + ' pts distribuídos</span></div></div>' +
    (aberta ? '<div class="mat-tile__previa"><p class="rotulo">Nesta matéria</p><ul class="previa-m">' + conteudos.slice(0, 4).map(function(c){
        return '<li><button ' + (c.estudo ? 'data-a="abrir-estudo" data-v="' + c.estudo + '"' : 'data-a="abrir-materia" data-v="' + t.mat + '"') + ' class="previa-m__item"><span class="tipo-m">' + c.tipo + '</span><span class="cresce truncar">' + esc(c.titulo) + '</span></button></li>';
      }).join('') + '</ul>' + btn('Abrir matéria', 'data-a="abrir-materia" data-v="' + t.mat + '"', null, 'btn--bloco btn--pequeno') + '</div>' : '') +
    '</div>';
}
function graficoSemestre(vals){
  var w = 320, h = 110, n = vals.length, pts = [], min = 40;
  var y = function(v){ return h - 4 - (v - min) / (100 - min) * (h - 8); };
  vals.forEach(function(v, i){ if (i) pts.push([(i - 1) / (n - 2) * w, y(v)]); });
  var linha = pts.map(function(p, i){ return (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ');
  var metaY = y(60);
  return '<div class="graf-semestre"><svg viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" role="img" aria-label="Aproveitamento por semana, de 71% a 76%">' +
    '<path d="' + linha + ' L' + w + ',' + h + ' L0,' + h + ' Z" class="g-area"/>' +
    '<rect x="0" y="' + metaY + '" width="' + w + '" height="' + (h - metaY) + '" class="g-zona"/>' +
    '<line x1="0" x2="' + w + '" y1="' + metaY + '" y2="' + metaY + '" class="g-meta"/>' +
    '<path d="' + linha + '" class="g-traco"/></svg>' +
    '<div class="graf__eixo"><span>sem 1</span><span>sem 5</span><span>sem 10</span></div></div>';
}

/* ---------- matéria: calculador de média e frequência ---------- */
function secaoMat(tit, corpo){
  return '<section class="secao-mat"><h2 class="secao__titulo">' + tit + '</h2><div class="secao-mat__corpo"><div class="secao-mat__dentro"><div class="secao-mat__conteudo">' + corpo + '</div></div></div></section>';
}
function frequencia(r){
  if (!r.aulas) return '<p class="texto-dica">Sem aulas registradas.</p>';
  var restantes = r.limite - r.faltas;
  return '<p class="texto">' + r.faltas + ' falta' + (r.faltas === 1 ? '' : 's') + ' em ' + r.aulas + ' aulas · limite de ' + r.limite + '</p>' +
    '<div class="freq-barra"><span class="freq-barra__faltas" style="width:' + Math.min(100, r.faltas / r.aulas * 100) + '%"></span><span class="freq-barra__limite" style="left:' + (r.limite / r.aulas * 100) + '%"></span></div>' +
    (restantes <= 0 ? '<p class="alerta-m">Você passou do limite de faltas. A reprovação por frequência independe da nota.</p>'
      : restantes <= 2 ? '<p class="alerta-m">Atenção: você só pode faltar mais ' + restantes + ' aula' + (restantes === 1 ? '' : 's') + '.</p>'
      : '<p class="texto-apoio">Você ainda pode faltar ' + restantes + ' aulas.</p>');
}
function calculadora(t, r){
  var est = S.estimativas[t.id] || {};
  return (t.regra
      ? '<p class="texto-apoio relaxado">Regra cadastrada por <span class="negrito">' + t.prof + '</span>: ' + n1(r.total) + ' pts · aprovação com ' + r.aprov + ' · frequência mínima ' + r.freqMin + '%.</p>'
      : '<p class="alerta-m">O professor ainda não cadastrou a regra desta turma. A estimativa usa o padrão: 100 pts e aprovação com 60.</p>') +
    '<p class="texto-dica mt-2">É uma aproximação: coloque a nota que espera tirar no que ainda vai acontecer.</p>' +
    '<div class="calc-lista">' + r.av.map(function(a){
      return '<div class="calc-linha' + (a.obtido !== null ? ' calc-linha--lancada' : '') + '"><span class="cresce"><span class="texto bloco">' + esc(a.nome) + (a.generico ? ' <span class="nota-mini">(estimado)</span>' : '') + '</span><span class="nota-mini">vale ' + n1(a.valor) + '</span></span>' +
        (a.obtido !== null ? '<span class="calc-linha__nota num">' + n1(a.obtido) + '<small>lançada</small></span>'
          : '<input class="calc-input" type="number" inputmode="decimal" min="0" max="' + a.valor + '" step="0.5" data-aval="' + esc(a.nome) + '" value="' + (est[a.nome] !== undefined ? est[a.nome] : '') + '" placeholder="?" aria-label="Nota estimada em ' + esc(a.nome) + '">') +
        '</div>';
    }).join('') + '</div>' +
    '<div class="grade-2 mt-3">' + btn('Usar meu ritmo' + (r.aproveitamento !== null ? ' (' + Math.round(r.aproveitamento) + '%)' : ''), 'data-a="calc-preencher"', 'sec', 'btn--pequeno') + btn('Limpar', 'data-a="calc-limpar"', 'ghost', 'btn--pequeno') + '</div>' +
    '<div id="calc-resultado" aria-live="polite">' + resultadoCalc(t, r) + '</div>';
}
function resultadoCalc(t, r){
  var est = S.estimativas[t.id] || {};
  var futuras = r.av.filter(function(a){ return a.obtido === null; });
  var estimado = 0, valorEstimado = 0;
  futuras.forEach(function(a){ var v = parseFloat(est[a.nome]); if (!isNaN(v)){ estimado += Math.max(0, Math.min(a.valor, v)); valorEstimado += a.valor; } });
  var semEstimativa = soma(futuras, function(a){ return a.valor; }) - valorEstimado;
  var projetado = r.obtido + estimado, perdido = (r.avaliado - r.obtido) + (valorEstimado - estimado);
  var w = function(v){ return (r.total ? v / r.total * 100 : 0).toFixed(2) + '%'; };
  var msg = projetado >= r.aprov
    ? '<p class="calc-msg calc-msg--ok">Com essas notas você fecha com <b>' + n1(projetado) + '</b> de ' + n1(r.total) + ': aprovado por nota.</p>'
    : r.aprov - projetado <= semEstimativa
      ? '<p class="calc-msg">Faltam <b>' + n1(r.aprov - projetado) + ' pts</b> para ' + r.aprov + '. Ainda restam ' + n1(semEstimativa) + ' pts sem estimativa.</p>'
      : '<p class="calc-msg calc-msg--ruim">Mesmo tirando tudo o que resta, você fecharia com <b>' + n1(projetado + semEstimativa) + '</b>. Faltam ' + n1(r.aprov - projetado - semEstimativa) + ' pts.</p>';
  return '<div class="barra-calc" role="img" aria-label="' + n1(r.obtido) + ' obtidos e ' + n1(estimado) + ' estimados de ' + n1(r.total) + '">' +
      '<span class="barra-calc__obtido" style="width:' + w(r.obtido) + '"></span><span class="barra-calc__estimado" style="width:' + w(estimado) + '"></span><span class="barra-calc__perdido" style="width:' + w(perdido) + '"></span>' +
      '<span class="barra-calc__meta" style="left:' + w(r.aprov) + '"><span>' + r.aprov + '</span></span></div>' +
    '<div class="calc-legenda"><span><i class="leg leg--obtido"></i>Obtidos <b>' + n1(r.obtido) + '</b></span><span><i class="leg leg--estimado"></i>Estimados <b>' + n1(estimado) + '</b></span>' +
      '<span><i class="leg leg--perdido"></i>Perdidos <b>' + n1(perdido) + '</b></span><span><i class="leg leg--aberto"></i>Sem estimativa <b>' + n1(semEstimativa) + '</b></span></div>' +
    msg + (r.faltas > r.limite ? '<p class="calc-msg calc-msg--ruim">Atenção: você já passou do limite de faltas.</p>' : '');
}
function atualizarCalc(){
  var t = turmaDaMateria(S.materia), alvo = document.getElementById('calc-resultado');
  if (t && alvo) alvo.innerHTML = resultadoCalc(t, resumoTurma(t));
}

/* ---------- estudos: busca com tags ---------- */
function sugestoesMaterias(){
  var partes = S.buscaEst.split(/\s+/), t = norm(partes[partes.length - 1] || '');
  if (t.length < 2) return [];
  return todasMaterias().filter(function(m){
    if (S.tags.indexOf(m.id) >= 0) return false;
    if (norm(m.sigla).replace(/\s+/g, '').indexOf(t) === 0) return true;
    if ((APELIDOS[m.id] || []).some(function(a){ return norm(a).indexOf(t) === 0; })) return true;
    return norm(m.nome).split(/\s+/).some(function(p){ return p.length > 2 && p.indexOf(t) === 0; });
  }).slice(0, 5);
}
function adicionarTag(id){
  if (S.tags.indexOf(id) < 0) S.tags.push(id);
  var partes = S.buscaEst.split(/\s+/); partes.pop();
  S.buscaEst = partes.join(' ') + (partes.length ? ' ' : '');
  S.sugIdx = 0; render();
  var n = document.getElementById('buscaEst'); if (n){ n.focus(); try { n.setSelectionRange(n.value.length, n.value.length); } catch (e) {} }
}

/* ---------- criar conta: senha forte ---------- */
var REGRAS_SENHA = [
  ['Letra maiúscula', function(s){ return /\p{Lu}/u.test(s); }],
  ['Letra minúscula', function(s){ return /\p{Ll}/u.test(s); }],
  ['Número', function(s){ return /\d/.test(s); }],
  ['Caractere especial (# % ! @ …)', function(s){ return /[^\p{L}\d\s]/u.test(s); }]
];
function regrasSenha(s){
  return REGRAS_SENHA.map(function(r){ var ok = r[1](s); return '<li class="regra-senha' + (ok ? ' regra-senha--ok' : '') + '">' + (ok ? ic('check', 'ic--12') : '<span class="regra-senha__ponto"></span>') + r[0] + '<span class="sr"> ' + (ok ? 'atendida' : 'pendente') + '</span></li>'; }).join('');
}
function msgConf(){
  if (S.erroConf) return '<span class="erro">' + esc(S.erroConf) + '</span>';
  if (!S.senhaConf) return '';
  return S.senhaConf === S.senhaNova ? '<span class="ok-txt">As senhas coincidem</span>' : '<span class="texto-dica">As senhas ainda não coincidem</span>';
}
function camposSenhaNova(){
  var tipo = S.mostrarSenha ? 'text' : 'password';
  return '<div><label class="campo__rotulo" for="senha-nova">Senha</label>' +
    '<div class="campo-senha"><input id="senha-nova" type="' + tipo + '" autocomplete="new-password" value="' + esc(S.senhaNova) + '" class="campo__entrada" aria-describedby="regras-senha">' +
    '<button type="button" data-a="mostrar-senha" aria-pressed="' + S.mostrarSenha + '" class="campo-senha__botao">' + (S.mostrarSenha ? 'Ocultar' : 'Mostrar') + '</button></div>' +
    '<ul class="regras-senha" id="regras-senha" aria-live="polite">' + regrasSenha(S.senhaNova) + '</ul></div>' +
    '<div>' + campo('Confirmar senha', 'id="senha-conf" type="' + tipo + '" autocomplete="new-password" value="' + esc(S.senhaConf) + '"', S.erroConf ? 'campo__entrada--erro' : '') +
    '<p class="msg-conf" id="msg-conf">' + msgConf() + '</p></div>' +
    '<p class="info-m">' + ic('user', 'ic--16 fixo') + '<span>Toda conta começa como <b class="negrito">aluno</b>. Monitor e professor são definidos pelo professor da turma ou pela coordenação.</span></p>';
}

/* ---------- minhas matérias ---------- */
telas.minhas = function(){
  var h = '<div class="tela">' + voltar('Voltar') + titulo('Minhas matérias', 'As do Canvas entram sozinhas. Aqui você adiciona turmas que não estão lá, e o professor aprova.');
  h += S.vinculos.length ? card(S.vinculos.map(function(v){
    var t = turma(v.turma), m = materia(t.mat);
    return '<div class="vinculo-m ' + corMat(t.mat) + '"><div class="cresce"><p class="texto-forte">' + m.nome + '</p><p class="texto-apoio">' + nomeTurma(t) + ' · ' + t.prof + '</p>' +
      '<div class="grupo-quebra mt-15">' + papel(v.origem === 'canvas' ? 'Canvas' : 'manual') + (v.status === 'pendente' ? '<span class="papel papel--alerta">aguardando professor</span>' : '') + '</div></div>' +
      (v.status === 'pendente' ? btn('Simular aprovação', 'data-a="simular-aprovacao" data-v="' + t.id + '"', 'sec', 'btn--pequeno')
        : v.origem === 'manual' ? btn('Remover', 'data-a="sair-turma" data-v="' + t.id + '"', 'perigo', 'btn--pequeno') : '') + '</div>';
  }).join(''), 'cartao-linhas') : vazio('Nenhuma matéria vinculada', 'Conecte o Canvas ou adicione uma turma abaixo.', btn('Conectar o Canvas', 'data-a="ir-integracoes"', null, 'btn--pequeno'));
  // não oferece outra turma de uma matéria que a pessoa já cursa
  var termo = norm(S.buscaTurma.trim()), jaMat = S.vinculos.map(function(v){ return turma(v.turma).mat; });
  var achadas = termo.length < 2 ? [] : TURMAS.filter(function(t){
    if (jaMat.indexOf(t.mat) >= 0) return false;
    var m = materia(t.mat);
    return norm(m.sigla + ' ' + m.nome + ' ' + (APELIDOS[t.mat] || []).join(' ') + ' ' + t.prof + ' ' + t.turma).indexOf(termo) >= 0;
  });
  h += '<section><h2 class="secao__titulo mb-3">Adicionar turma</h2>' +
    '<div class="busca"><span class="busca__icone">' + ic('search', 'ic--16') + '</span><input id="buscaTurma" type="search" value="' + esc(S.buscaTurma) + '" placeholder="Matéria, sigla ou professor (ex.: calc)" class="busca__entrada" autocomplete="off"></div>' +
    (termo.length < 2 ? '<p class="texto-dica mt-2">Digite ao menos 2 letras.</p>' : achadas.length ? '<div class="mt-3">' + card(achadas.map(function(t){
      return '<div class="linha-lista"><div class="cresce"><p class="texto">' + materia(t.mat).nome + '</p><p class="texto-apoio">' + nomeTurma(t) + ' · ' + t.turno + ' · ' + t.prof + '</p></div>' +
        btn('Pedir', 'data-a="pedir-turma" data-v="' + t.id + '"', null, 'btn--pequeno') + '</div>';
    }).join(''), 'cartao-linhas') + '</div>' : '<p class="texto-dica mt-2">Nenhuma turma encontrada para “' + esc(S.buscaTurma) + '”.</p>') + '</section>';
  return h + '</div>';
};

/* ---------- configurações › integrações ---------- */
function integracoesMobile(){
  var c = S.canvas, h = '';
  if (c.conectado){
    var qtd = S.vinculos.filter(function(v){ return v.origem === 'canvas'; }).length;
    h += secao('Canvas', '<div class="secao-cfg__corpo"><div class="fila-entre"><p class="texto-forte">Conectado</p><span class="papel papel--ok">ativo</span></div>' +
      '<p class="texto-apoio mt-1 relaxado">' + qtd + ' matéria' + (qtd === 1 ? '' : 's') + ' importada' + (qtd === 1 ? '' : 's') + ' · última sincronização: ' + c.sync + '. Notas, tarefas e frequência atualizam sozinhas a cada 6 h.</p>' +
      '<div class="grade-2 mt-3">' + btn('Sincronizar', 'data-a="canvas-sync"', 'sec', 'btn--pequeno') + btn('Minhas matérias', 'data-a="ir-minhas"', 'sec', 'btn--pequeno') + '</div>' +
      (c.confirmarSaida
        ? '<div class="confirmar-exclusao mt-3"><p class="texto">Desconectar o Canvas?</p><p class="texto-apoio mt-05">O token é apagado e as matérias que vieram do Canvas saem do Hub. As adicionadas à mão continuam.</p>' +
          '<div class="grade-2 mt-3">' + btn('Cancelar', 'data-a="canvas-desconectar-nao"', 'sec', 'btn--pequeno') + btn('Desconectar', 'data-a="canvas-desconectar-sim"', 'perigo', 'btn--pequeno') + '</div></div>'
        : '<div class="mt-2">' + btn('Desconectar', 'data-a="canvas-desconectar"', 'perigo', 'btn--bloco btn--pequeno') + '</div>') + '</div>');
  } else if (c.etapa === 'escolher'){
    h += secao('Canvas', '<div class="secao-cfg__corpo"><p class="texto-forte">Token aceito</p><p class="texto-apoio mt-05">Escolha quais matérias de 2026/2 entram no Hub.</p></div>' +
      '<div class="linhas linhas--separadas">' + CANVAS_CURSOS.map(function(id){
        var t = turma(id);
        return '<label class="linha-lista"><input type="checkbox" class="caixa-marcar" data-canvas-curso="' + id + '"' + (c.escolhidos[id] !== false ? ' checked' : '') + '>' +
          '<span class="cresce"><span class="texto bloco">' + materia(t.mat).nome + '</span><span class="texto-apoio bloco">' + nomeTurma(t) + ' · ' + t.prof + '</span></span></label>';
      }).join('') + '</div><div class="secao-cfg__corpo grade-2">' + btn('Cancelar', 'data-a="canvas-cancelar"', 'sec', 'btn--pequeno') + btn('Importar', 'data-a="canvas-importar"', null, 'btn--pequeno') + '</div>');
  } else {
    h += secao('Conectar o Canvas', '<div class="secao-cfg__corpo pilha-3">' +
      '<ol class="passos-m"><li>No Canvas, abra <b class="negrito">Conta › Configurações</b>.</li><li>Em Integrações aprovadas, toque em <b class="negrito">+ Novo token de acesso</b>.</li><li>Dê um nome (ex.: Hub de Estudos), gere e copie.</li><li>Cole aqui embaixo.</li></ol>' +
      '<div><label class="campo__rotulo" for="canvas-token">Token de acesso</label><div class="campo-senha"><input id="canvas-token" type="' + (c.mostrar ? 'text' : 'password') + '" value="' + esc(c.token) + '" placeholder="7~AbCdEf…" autocomplete="off" class="campo__entrada' + (c.erro ? ' campo__entrada--erro' : '') + '">' +
      '<button type="button" data-a="canvas-mostrar" class="campo-senha__botao">' + (c.mostrar ? 'Ocultar' : 'Mostrar') + '</button></div></div>' +
      '<label class="consentimento"><input type="checkbox" class="caixa-marcar" id="canvas-consent"' + (c.consent ? ' checked' : '') + '><span>Autorizo o Hub a ler minhas matérias, tarefas, notas e frequência do Canvas. Posso desconectar quando quiser.</span></label>' +
      (c.erro ? '<p class="erro">' + esc(c.erro) + '</p>' : '') +
      btn('Conectar', 'data-a="canvas-conectar"', null, 'btn--bloco') + btn('Colar token de exemplo', 'data-a="canvas-exemplo"', 'ghost', 'btn--bloco btn--pequeno') + '</div>');
  }
  h += '<p class="texto-dica relaxado">O token fica guardado criptografado no servidor do Hub, nunca no celular. Ele só lê dados; o Hub não publica nada no Canvas.</p>' +
    secao('', linha('Google Agenda', 'Em breve. Por enquanto, use o link .ics em Calendário.', '<span class="etiqueta-atual">em breve</span>'));
  return h;
}

/* ---------- publicar: um cartão por arquivo ---------- */
var contEnvio = 0;
function adivinharMateria(txt){
  var toks = norm(txt).split(/[^a-z0-9]+/).filter(Boolean);
  var m = todasMaterias().filter(function(x){
    var chaves = [norm(x.sigla).replace(/\s+/g, '')].concat((APELIDOS[x.id] || []).filter(function(a){ return a.indexOf(' ') < 0; }));
    return toks.some(function(t){ return chaves.indexOf(t) >= 0; });
  })[0];
  return m ? m.id : '';
}
function novoEnvio(nome, tamanho){
  var ext = (nome.split('.').pop() || '').toLowerCase(), base = nome.replace(/\.[^.]+$/, ''), mid = adivinharMateria(base);
  var fora = mid ? [norm(materia(mid).sigla).replace(/\s+/g, '')].concat(APELIDOS[mid] || []) : [];
  var tit = base.split(/[-_.\s]+/).filter(function(p){ return p && fora.indexOf(norm(p)) < 0; }).join(' ');
  return { id:++contEnvio, arquivo:nome, tamanho:tamanho, ext:ext, titulo:tit.charAt(0).toUpperCase() + tit.slice(1), mat:mid, desc:'' };
}
function exemplosEnvio(){
  return [['regra-da-cadeia-cdi.pdf', 1200000], ['poo_interfaces_java.html', 84000], ['anotacoes-da-aula.html', 56000], ['resumo-final.docx', 230000]]
    .map(function(x){ return novoEnvio(x[0], x[1]); });
}
function problemaEnvio(v){
  if (['html','htm','pdf'].indexOf(v.ext) < 0) return 'Formato não aceito: envie .html ou .pdf.';
  if (v.tamanho > 5 * 1024 * 1024) return 'Arquivo maior que 5 MB.';
  if (!String(v.titulo).trim()) return 'Falta o título.';
  if (!v.mat) return 'Escolha a matéria.';
  return '';
}
function prontosEnvio(){ return S.envios.filter(function(v){ return !problemaEnvio(v); }).length; }
function contagemEnvio(){ var p = prontosEnvio(); return S.envios.length + ' arquivo' + (S.envios.length === 1 ? '' : 's') + ' · ' + p + ' pronto' + (p === 1 ? '' : 's') + ' · ' + (S.envios.length - p) + ' com problema'; }
function tamanhoTxt(b){ return b >= 1024 * 1024 ? (b / 1024 / 1024).toFixed(1).replace('.', ',') + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB'; }
function cartaoEnvio(v){
  var prob = problemaEnvio(v), aceito = ['html','htm','pdf'].indexOf(v.ext) >= 0;
  return '<div class="envio-m' + (prob ? ' envio-m--problema' : '') + '" id="envio-' + v.id + '">' +
    '<div class="fila-entre"><span class="fila cresce">' + sigla(esc(v.ext.toUpperCase() || '?')) + '<span class="meta truncar">' + esc(v.arquivo) + '</span></span><span class="meta-mini fixo">' + tamanhoTxt(v.tamanho) + '</span></div>' +
    (aceito ? '<div class="pilha-3 mt-3">' + campo('Título', 'data-envio="' + v.id + '" data-envio-campo="titulo" value="' + esc(v.titulo) + '"') +
      '<label class="bloco"><span class="campo__rotulo">Matéria</span>' + selectDe('data-envio="' + v.id + '" data-envio-campo="mat"', [['', 'Escolha…']].concat(todasMaterias().map(function(m){ return [m.id, m.sigla + ' · ' + m.nome]; })), v.mat) + '</label>' +
      campo('Descrição (opcional)', 'data-envio="' + v.id + '" data-envio-campo="desc" value="' + esc(v.desc) + '" placeholder="Em uma frase, o que a pessoa aprende"') + '</div>' : '') +
    '<div class="fila-entre mt-3"><p class="envio-m__status" id="envio-status-' + v.id + '">' + (prob ? prob : 'Pronto para publicar') + '</p>' +
    btn('Remover', 'data-a="envio-remover" data-v="' + v.id + '"', 'ghost', 'btn--pequeno') + '</div></div>';
}
function atualizarEnvio(v){
  var prob = problemaEnvio(v), st = document.getElementById('envio-status-' + v.id), cartao = document.getElementById('envio-' + v.id), p = prontosEnvio();
  if (st) st.textContent = prob || 'Pronto para publicar';
  if (cartao) cartao.classList.toggle('envio-m--problema', !!prob);
  var ct = document.getElementById('envio-contagem'); if (ct) ct.textContent = contagemEnvio();
  var b = document.getElementById('btn-publicar'); if (b){ b.disabled = !p; b.textContent = 'Publicar ' + p + ' pronto' + (p === 1 ? '' : 's'); }
}

/* ---------- pessoas e cargos ---------- */
function lerCsv(texto, t){
  return texto.split(/\r?\n/).map(function(l){ return l.trim(); }).filter(Boolean).map(function(l){
    var m = l.match(/\d{6,12}/);
    if (!m) return { linha:l, situacao:'ignorada', txt:'sem matrícula' };
    var p = t.membros.filter(function(x){ return x.mat === m[0]; })[0];
    if (!p) return { linha:l, mat:m[0], situacao:'erro', txt:'não está na turma' };
    if (p.papel === S.csv.papel) return { linha:l, mat:m[0], nome:p.nome, situacao:'igual', txt:'já é ' + p.papel };
    return { linha:l, mat:m[0], nome:p.nome, situacao:'ok', txt:p.papel + ' → ' + S.csv.papel };
  });
}
function agora(){ var d = new Date(); return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }
function quemSou(){ return S.cargo === 'admin' ? 'Coordenação' : PROF_EU; }

telas.pessoas = function(){
  if (!docente()) return semPermissao('Só professores e a coordenação mudam cargos');
  var ts = turmasDoDocente();
  if (!S.pessoasTurma || !ts.some(function(t){ return t.id === S.pessoasTurma; })) S.pessoasTurma = ts[0].id;
  var t = turma(S.pessoasTurma), admin = S.cargo === 'admin';
  var opcoes = (admin ? ['aluno','monitor','professor'] : ['aluno','monitor']).map(function(o){ return [o, o]; });
  var termo = norm(S.buscaPessoa.trim());
  var lista = t.membros.filter(function(p){ return !termo || norm(p.nome + ' ' + p.mat).indexOf(termo) >= 0; });
  var h = '<div class="tela">' + voltar('Voltar') + titulo('Pessoas e cargos', 'O cargo vale por turma: monitor de CDI I não é monitor de POO.') +
    '<details class="explica-m"><summary class="texto-forte">Como funcionam os cargos</summary><ul class="explica-m__lista">' +
      '<li>Toda conta começa como <b class="negrito">aluno</b>.</li>' +
      '<li><b class="negrito">Professor</b>: torna aluno em monitor (e volta) só nas próprias turmas, aqui ou por arquivo de matrículas.</li>' +
      '<li><b class="negrito">Coordenação</b>: muda qualquer cargo, inclusive professor. Os admins são definidos no banco de dados.</li></ul></details>' +
    '<div class="faixa-chips">' + ts.map(function(x){ return chip(nomeTurma(x), x.id === t.id, 'data-a="pessoas-turma" data-v="' + x.id + '"'); }).join('') + '</div>' +
    '<div><div class="busca"><span class="busca__icone">' + ic('search', 'ic--16') + '</span><input id="buscaPessoa" type="search" value="' + esc(S.buscaPessoa) + '" placeholder="Nome ou matrícula" class="busca__entrada" autocomplete="off"></div>' +
    '<p class="texto-apoio mt-2"><span class="mono realce">' + t.membros.length + '</span> pessoas em ' + nomeTurma(t) + '</p></div>' +
    card('<div class="pessoa-linha"><div class="cresce"><p class="texto truncar">' + t.prof + '</p><p class="meta">responsável</p></div>' + papel('professor') + '</div>' +
      lista.map(function(p){
        return '<div class="pessoa-linha"><div class="cresce"><p class="texto truncar">' + esc(p.nome) + '</p><p class="meta">' + p.mat + '</p></div>' +
          selectDe('data-papel="' + p.mat + '" aria-label="Cargo de ' + esc(p.nome) + '"', opcoes, p.papel).replace('class="campo__selecao"', 'class="campo__selecao cargo-select"') + '</div>';
      }).join('') + (lista.length ? '' : '<p class="texto-dica pessoa-linha">Ninguém encontrado.</p>'), 'cartao-linhas') +
    card('<p class="texto-forte">Mudar vários por arquivo</p><p class="texto-apoio mt-05 relaxado">Envie um .csv ou .txt com uma matrícula por linha, ou cole as matrículas. Você confere a prévia antes.</p>' +
      '<div class="pilha-3 mt-3"><label class="bloco"><span class="campo__rotulo">Arquivo</span><input type="file" id="csv-arquivo" accept=".csv,.txt" class="campo-arquivo"></label>' +
      area('Ou cole as matrículas', 'id="csv-texto" placeholder="2025010171"', esc(S.csv.texto)) +
      '<label class="bloco"><span class="campo__rotulo">Todas viram</span>' + selectDe('id="csv-papel"', opcoes, S.csv.papel) + '</label>' +
      '<div class="grade-2">' + btn('Colar exemplo', 'data-a="csv-exemplo"', 'sec', 'btn--pequeno') + btn('Ver prévia', 'data-a="csv-previa"', null, 'btn--pequeno') + '</div>' +
      (S.csv.previa ? previaCsv() : '') + '</div>') +
    '<section><h2 class="secao__titulo mb-3">Histórico de alterações</h2>' + card(S.historico.map(function(x){
      return '<div class="atividade"><span class="atividade__ponto"></span><div class="cresce"><p class="texto-medio"><span class="negrito">' + esc(x.quem) + '</span> ' + esc(x.txt) + '</p><p class="texto-dica">' + x.quando + ' · ' + x.como + '</p></div></div>';
    }).join(''), 'cartao-atividade') + '</section>';
  return h + '</div>';
};
function previaCsv(){
  var p = S.csv.previa, conta = function(s){ return p.filter(function(x){ return x.situacao === s; }).length; };
  return '<div class="previa-csv"><p class="texto"><b class="negrito">' + conta('ok') + '</b> alterações · ' + conta('igual') + ' sem mudança · ' + conta('erro') + ' não encontradas · ' + conta('ignorada') + ' ignoradas</p>' +
    '<div class="previa-csv__linhas">' + p.map(function(x){
      return '<div class="previa-csv__linha previa-csv__linha--' + x.situacao + '"><span class="mono truncar">' + esc(x.mat || x.linha) + '</span><span class="cresce truncar">' + esc(x.nome || '—') + '</span><span class="previa-csv__sit">' + x.txt + '</span></div>';
    }).join('') + '</div>' +
    '<div class="grade-2 mt-3">' + btn('Cancelar', 'data-a="csv-cancelar"', 'sec', 'btn--pequeno') + btn('Confirmar ' + conta('ok'), 'data-a="csv-confirmar"' + (conta('ok') ? '' : ' disabled'), null, 'btn--pequeno') + '</div></div>';
}

/* ---------- relatórios do professor ---------- */
function metricasTurma(t){
  var al = t.membros.map(function(p){
    return { p:p, pts:Math.round(sorteio(p.mat + t.id, 38, 96)), prazo:Math.round(sorteio(t.id + p.mat, 55, 100)), part:Math.round(sorteio(p.nome + t.id, 18, 95)), faltas:Math.round(sorteio(p.mat + 'f' + t.id, 0, 11)) };
  });
  var media = function(k){ return Math.round(soma(al, function(a){ return a[k]; }) / al.length); };
  return { alunos:al, media:media('pts'), prazo:media('prazo'), part:media('part'), risco:al.filter(function(a){ return a.pts < 60 || a.faltas >= 9; }).length };
}
// cada matéria mostra dois gráficos; nenhum dos oito tem o mesmo formato
var REL_M = { cdi:['linha','histograma'], alg:['empilhado','halteres'], poo:['calor','anel'], fis:['barrasH','bala'] };
function graf(tit, corpo, nota, tipo){ return '<figure class="graf graf--' + tipo + '"><figcaption class="graf__titulo">' + tit + '</figcaption>' + corpo + '<p class="graf__nota">' + nota + '</p></figure>'; }
var GRAFICOS = {
  linha:function(){
    var v = [42, 55, 61, 58, 66, 72, 69, 74, 71, 78], w = 240, h = 70;
    var d = v.map(function(x, i){ return (i ? 'L' : 'M') + (i / (v.length - 1) * w).toFixed(1) + ',' + (h - 4 - x / 100 * (h - 8)).toFixed(1); }).join(' ');
    return graf('Engajamento em não avaliadas', '<svg class="graf__svg" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" role="img" aria-label="Engajamento semanal de 42% a 78%"><path d="' + d + ' L' + w + ',' + h + ' L0,' + h + ' Z" class="g-area"/><path d="' + d + '" class="g-traco"/></svg>',
      '<b>78%</b> abriram algum material na semana · +7 pts', 'linha');
  },
  histograma:function(){
    var bins = [2, 3, 6, 9, 13, 11, 5, 3], w = 240, h = 70, bw = w / bins.length;
    return graf('Notas da P1 (avaliada)', '<svg class="graf__svg" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" role="img" aria-label="Histograma: 11 de 52 abaixo de 60%">' + bins.map(function(b, i){
        var bh = b / 13 * (h - 4); return '<rect x="' + (i * bw + 2).toFixed(1) + '" y="' + (h - bh).toFixed(1) + '" width="' + (bw - 4).toFixed(1) + '" height="' + bh.toFixed(1) + '" class="' + (i < 3 ? 'g-ruim' : 'g-barra') + '"/>';
      }).join('') + '</svg><div class="graf__eixo"><span>0</span><span>60%</span><span>100</span></div>', '<b>11</b> de 52 abaixo de 60%', 'histograma');
  },
  empilhado:function(){
    var l = [['Lista 1', 34, 4, 2], ['P1', 38, 0, 2], ['Lista 2', 25, 9, 6], ['Trabalho', 22, 8, 10]];
    return graf('Entregas das avaliadas', '<div class="empilhado">' + l.map(function(x){
      var t = x[1] + x[2] + x[3];
      return '<div class="graf-linha"><span class="graf-linha__rot">' + x[0] + '</span><span class="empilhado__barra"><i class="seg-prazo" style="width:' + (x[1] / t * 100) + '%"></i><i class="seg-atraso" style="width:' + (x[2] / t * 100) + '%"></i><i class="seg-nao" style="width:' + (x[3] / t * 100) + '%"></i></span></div>';
    }).join('') + '</div><div class="graf__legenda"><span><i class="seg-prazo"></i>no prazo</span><span><i class="seg-atraso"></i>atraso</span><span><i class="seg-nao"></i>não entregou</span></div>',
      'Trabalho: <b>25%</b> não entregaram', 'empilhado');
  },
  halteres:function(){
    var l = [['Sem 1–2', 88, 61], ['Sem 3–4', 84, 52], ['Sem 5–6', 81, 40], ['Sem 7–8', 79, 33]];
    return graf('Avaliadas × não avaliadas', '<div class="halteres">' + l.map(function(x){
      return '<div class="graf-linha"><span class="graf-linha__rot">' + x[0] + '</span><span class="halteres__trilho"><i class="halteres__liga" style="left:' + x[2] + '%;width:' + (x[1] - x[2]) + '%"></i><i class="halteres__ponto halteres__ponto--nao" style="left:' + x[2] + '%"></i><i class="halteres__ponto" style="left:' + x[1] + '%"></i></span></div>';
    }).join('') + '</div><div class="graf__legenda"><span><i class="halteres__ponto halteres__ponto--legenda"></i>avaliadas</span><span><i class="halteres__ponto halteres__ponto--nao halteres__ponto--legenda"></i>não avaliadas</span></div>',
      'O treino caiu de <b>61%</b> para <b>33%</b>', 'halteres');
  },
  calor:function(){
    var dias = ['seg','ter','qua','qui','sex'], per = ['manhã','tarde','noite'], val = [[.2,.35,.9],[.15,.3,.75],[.25,.5,1],[.1,.25,.6],[.05,.15,.3]];
    return graf('Quando a turma estuda', '<div class="calor"><span></span>' + dias.map(function(d){ return '<span class="calor__rot">' + d + '</span>'; }).join('') +
      per.map(function(p, j){ return '<span class="calor__rot calor__rot--lado">' + p + '</span>' + dias.map(function(d, i){ return '<span class="calor__cel" title="' + d + ' ' + p + ': ' + Math.round(val[i][j] * 100) + '%"><i style="opacity:' + val[i][j] + '"></i></span>'; }).join(''); }).join('') + '</div>',
      'Pico: <b>quarta à noite</b>', 'calor');
  },
  anel:function(){
    var pct = 64, c = 2 * Math.PI * 30;
    return graf('Exercícios de treino feitos', '<div class="anel"><svg viewBox="0 0 80 80" role="img" aria-label="' + pct + '% concluídos"><circle cx="40" cy="40" r="30" class="g-anel-fundo"/><circle cx="40" cy="40" r="30" class="g-anel" stroke-dasharray="' + (c * pct / 100).toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 40 40)"/></svg><b class="anel__valor">' + pct + '%</b></div>',
      '<b>12</b> alunos não fizeram nenhum', 'anel');
  },
  barrasH:function(){
    var l = [['Propagação de erro', 31], ['Gráficos', 22], ['Pêndulo', 12], ['Relatório', 8]];
    return graf('Dúvidas por tópico', '<div class="barrash">' + l.map(function(x){
      return '<div class="graf-linha graf-linha--valor"><span class="graf-linha__rot">' + x[0] + '</span><span class="barrash__barra"><i style="width:' + (x[1] / 31 * 100) + '%"></i></span><b class="mono">' + x[1] + '</b></div>';
    }).join('') + '</div>', '<b>Propagação de erro</b> tem 42% das dúvidas', 'barrash');
  },
  bala:function(){
    return graf('Média da turma × aprovação', '<div class="bala"><span class="bala__faixa bala__faixa--1"></span><span class="bala__faixa bala__faixa--2"></span><span class="bala__faixa bala__faixa--3"></span><span class="bala__valor" style="width:71%"></span><span class="bala__meta" style="left:60%"></span></div>' +
      '<div class="graf__eixo"><span>0</span><span>meta 60</span><span>100</span></div>', 'Média <b>71</b>, 11 pts acima da meta', 'bala');
  }
};
telas.relatorios = function(){
  if (!docente()) return semPermissao('Só professores e a coordenação veem relatórios');
  var h = '<div class="tela">' + voltar('Voltar') + titulo('Relatórios', (S.cargo === 'admin' ? 'Visão da coordenação' : PROF_EU) + ' · 2026/2. Toque numa matéria para ver os gráficos.') +
    '<div class="rel-lista">' + ['cdi','alg','poo','fis'].map(function(mid, i){
      var m = materia(mid), ts = turmasDoDocente().filter(function(t){ return t.mat === mid; });
      var met = ts.map(metricasTurma), alunos = soma(ts, function(t){ return t.membros.length; }), aberta = S.relAberta === mid;
      var media = met.length ? Math.round(soma(met, function(x){ return x.media; }) / met.length) : 0;
      return '<article class="rel-m rel-m--forma-' + i + ' ' + corMat(mid) + (aberta ? ' rel-m--aberta' : '') + '">' +
        '<button class="rel-m__topo" data-a="rel-abrir" data-v="' + mid + '" aria-expanded="' + aberta + '"><span class="cresce"><span class="mat-tile__sigla">' + m.sigla + '</span><span class="rel-m__nome">' + m.nome + '</span>' +
          '<span class="texto-apoio bloco">' + ts.length + ' turma' + (ts.length === 1 ? '' : 's') + ' · ' + alunos + ' alunos · média ' + media + ' · ' + soma(met, function(x){ return x.risco; }) + ' em risco</span></span>' +
          ic('right', 'ic--16 ic--apagado rel-m__seta') + '</button>' +
        (aberta ? '<div class="rel-m__graficos">' + REL_M[mid].map(function(g){ return GRAFICOS[g](); }).join('') + '</div>' +
          btn('Ver turmas de ' + m.sigla, 'data-a="rel-turmas" data-v="' + mid + '"', 'sec', 'btn--bloco btn--pequeno') : '') + '</article>';
    }).join('') + '</div>' +
    '<p class="texto-dica relaxado">Avaliadas são as atividades com nota. Não avaliadas são estudos abertos, exercícios de treino, enquetes e dúvidas registradas no Hub.</p>';
  return h + '</div>';
};
telas.relMateria = function(){
  if (!docente()) return semPermissao('Só professores e a coordenação veem relatórios');
  var m = materia(S.relSigla), ts = turmasDoDocente().filter(function(t){ return t.mat === S.relSigla; });
  return '<div class="tela">' + voltar('Relatórios') + '<div class="mat-cabeca ' + corMat(m.id) + '">' + sigla(m.sigla) + '<h1 class="titulo mt-2">' + m.nome + '</h1><p class="titulo__sub">' + ts.length + ' turma' + (ts.length === 1 ? '' : 's') + ' em 2026/2</p></div>' +
    '<div class="pilha-3">' + ts.map(function(t){
      var x = metricasTurma(t);
      return '<button data-a="abrir-turma-prof" data-v="' + t.id + '" class="cartao-clicavel largo esquerda"><div class="fila-entre"><p class="texto-forte">' + t.turma + ' · ' + t.turno + '</p>' + ic('right', 'ic--16 ic--apagado') + '</div>' +
        '<div class="grade-3 mt-3">' + kpiM('Média', x.media) + kpiM('No prazo', x.prazo + '%') + kpiM('Treino', x.part + '%') + '</div>' +
        '<p class="texto-apoio mt-3">' + t.membros.length + ' alunos · <span class="' + (x.risco ? 'texto-perigo' : '') + '">' + x.risco + ' em risco</span>' + (t.regra ? '' : ' · <span class="texto-perigo">sem regra de nota</span>') + '</p></button>';
    }).join('') + '</div></div>';
};
telas.turma = function(){
  if (!docente()) return semPermissao('Só professores e a coordenação veem relatórios');
  var t = turma(S.turmaProf), x = metricasTurma(t);
  if (!S.regraRascunho || S.regraRascunho.turma !== t.id){
    var base = t.regra || { aprovacao:60, frequencia:75, avaliacoes:[{nome:'Prova 1', valor:30}, {nome:'Trabalho', valor:40}, {nome:'Prova 2', valor:30}] };
    S.regraRascunho = { turma:t.id, aprovacao:base.aprovacao, frequencia:base.frequencia, avaliacoes:base.avaliacoes.map(function(a){ return { nome:a.nome, valor:a.valor }; }) };
  }
  var rr = S.regraRascunho;
  return '<div class="tela">' + voltar('Turmas') + '<div class="mat-cabeca ' + corMat(t.mat) + '">' + sigla(materia(t.mat).sigla) + '<h1 class="titulo mt-2">' + nomeTurma(t) + '</h1><p class="titulo__sub">' + t.turno + ' · ' + t.membros.length + ' alunos · ' + t.prof + '</p></div>' +
    '<div class="grade-2">' + kpiM('Média da turma', x.media, 'de 100') + kpiM('No prazo', x.prazo + '%', 'avaliadas') + kpiM('Treino', x.part + '%', 'não avaliadas') + kpiM('Em risco', x.risco, 'nota < 60 ou muitas faltas') + '</div>' +
    btn('Gerenciar cargos desta turma', 'data-a="gerenciar-cargos" data-v="' + t.id + '"', 'sec', 'btn--bloco btn--pequeno') +
    '<section><h2 class="secao__titulo mb-3">Alunos · menor nota primeiro</h2>' + card(x.alunos.slice().sort(function(a, b){ return a.pts - b.pts; }).map(function(a){
      var risco = a.pts < 60 || a.faltas >= 9;
      return '<div class="aluno-linha"><div class="cresce"><p class="texto truncar">' + esc(a.p.nome) + (a.p.papel === 'monitor' ? ' ' + papel('monitor') : '') + '</p>' +
        '<p class="meta">' + a.prazo + '% no prazo · ' + a.part + '% treino · ' + a.faltas + ' faltas</p></div>' +
        '<span class="aluno-linha__pts num' + (risco ? ' texto-perigo' : '') + '">' + a.pts + '</span>' + (risco ? '<span class="papel papel--alerta">risco</span>' : '') + '</div>';
    }).join(''), 'cartao-linhas') + '</section>' +
    '<section id="regra">' + card('<h2 class="secao__titulo">Regra de nota da turma</h2>' +
      (t.regra ? '<p class="texto-apoio mt-05">Os alunos veem o calculador de média com esta regra.</p>' : '<p class="alerta-m">Ainda sem regra. Os alunos veem o calculador com o padrão (100 pts, aprovação com 60).</p>') +
      '<div class="grade-2 mt-3">' + campo('Aprovação (pts)', 'type="number" inputmode="decimal" min="0" data-regra="aprovacao" value="' + rr.aprovacao + '"') + campo('Frequência mín. (%)', 'type="number" inputmode="numeric" min="0" max="100" data-regra="frequencia" value="' + rr.frequencia + '"') + '</div>' +
      '<p class="campo__rotulo mt-3">Avaliações</p><div class="pilha-2 mt-15">' + rr.avaliacoes.map(function(a, i){
        return '<div class="regra-m"><input class="campo__entrada regra-m__nome" data-regra="nome" data-i="' + i + '" value="' + esc(a.nome) + '" placeholder="Nome" aria-label="Nome da avaliação ' + (i + 1) + '">' +
          '<input class="campo__entrada regra-m__valor" type="number" inputmode="decimal" min="0" step="0.5" data-regra="valor" data-i="' + i + '" value="' + a.valor + '" aria-label="Valor da avaliação ' + (i + 1) + '">' +
          '<button data-a="regra-remover" data-v="' + i + '" aria-label="Remover ' + esc(a.nome) + '" class="botao-voltar">' + ic('x', 'ic--16') + '</button></div>';
      }).join('') + '</div>' +
      '<div class="fila-entre mt-3">' + btn(ic('plus', 'ic--16') + 'Avaliação', 'data-a="regra-adicionar"', 'ghost', 'btn--pequeno') + '<p class="texto-apoio" id="regra-soma">' + somaRegraTxt() + '</p></div>' +
      '<p class="erro mt-2" id="regra-erro"></p>' + btn('Salvar regra', 'data-a="regra-salvar"', null, 'btn--bloco')) + '</section></div>';
};
function somaRegraTxt(){
  var s = soma(S.regraRascunho.avaliacoes, function(a){ return parseFloat(a.valor) || 0; });
  return 'Soma: <span class="mono realce">' + n1(s) + '</span>' + (s === 100 ? ' ✓' : ' <span class="texto-perigo">(costuma ser 100)</span>');
}

/* ---------- ações das novidades (chamadas pelo switch principal) ---------- */
function novidades(a, v){
  switch (a){
    case 'expandir-materia': S.expandida = S.expandida === v ? null : v; render(); return true;
    case 'ir-minhas': abrir('minhas'); return true;
    case 'ir-integracoes': S.tab = 'config'; S.tela = null; S.pilha = []; S.cfgSec = 'integracoes'; abrir('cfg'); return true;
    case 'ir-relatorios': abrir('relatorios'); return true;
    case 'ir-pessoas': abrir('pessoas'); return true;

    case 'calc':
      // abre e fecha sem redesenhar, para a transição aparecer
      S.calcAberta = !S.calcAberta;
      var pag = document.getElementById('pag-materia');
      if (pag) pag.classList.toggle('calc-aberta', S.calcAberta);
      var g = fone.querySelector('[data-a="calc"]'); if (g) g.setAttribute('aria-expanded', String(S.calcAberta));
      return true;
    case 'calc-preencher':
      var tc = turmaDaMateria(S.materia), rc = resumoTurma(tc), f = rc.aproveitamento === null ? 0.7 : rc.aproveitamento / 100;
      S.estimativas[tc.id] = {};
      rc.av.forEach(function(x){ if (x.obtido === null) S.estimativas[tc.id][x.nome] = Math.round(x.valor * f * 2) / 2; });
      render(); return true;
    case 'calc-limpar': S.estimativas[turmaDaMateria(S.materia).id] = {}; render(); return true;

    case 'add-tag': adicionarTag(v); return true;
    case 'tirar-tag': S.tags = S.tags.filter(function(x){ return x !== v; }); render(); return true;
    case 'mostrar-senha': S.mostrarSenha = !S.mostrarSenha; render(); return true;

    case 'pedir-turma': S.vinculos.push({ turma:v, origem:'manual', status:'pendente' }); S.buscaTurma = ''; toast('Pedido enviado. A turma entra no seu hub quando o professor aprovar.'); return true;
    case 'simular-aprovacao': S.vinculos.forEach(function(x){ if (x.turma === v) x.status = 'ativo'; }); toast('Aprovado. ' + nomeTurma(turma(v)) + ' já está no seu hub.'); return true;
    case 'sair-turma':
      var pos = S.vinculos.findIndex(function(x){ return x.turma === v; });
      if (pos < 0) return true;
      var removido = S.vinculos.splice(pos, 1)[0];
      toastDesfazer('Turma removida do seu hub.', function(){ S.vinculos.splice(pos, 0, removido); toast('Turma de volta ao seu hub.'); });
      return true;

    case 'canvas-exemplo': S.canvas.token = '7~Hq3Zb8LmN2xRt5VwY9aK4dPf6sJc1Ue0Gi'; S.canvas.erro = ''; render(); return true;
    case 'canvas-mostrar': S.canvas.mostrar = !S.canvas.mostrar; render(); return true;
    case 'canvas-conectar':
      var tk = S.canvas.token.trim();
      S.canvas.erro = !tk ? 'Cole o token gerado no Canvas.' : !S.canvas.consent ? 'Marque a autorização para o Hub ler seus dados do Canvas.' : tk.length < 20 ? 'Token inválido ou expirado. Gere um novo no Canvas.' : '';
      if (!S.canvas.erro){ S.canvas.etapa = 'escolher'; S.canvas.escolhidos = {}; }
      render(); return true;
    case 'canvas-cancelar': S.canvas.etapa = null; render(); return true;
    case 'canvas-importar':
      var novos = CANVAS_CURSOS.filter(function(id){ return S.canvas.escolhidos[id] !== false; });
      S.vinculos = S.vinculos.filter(function(x){ return novos.indexOf(x.turma) < 0; }).concat(novos.map(function(id){ return { turma:id, origem:'canvas', status:'ativo' }; }));
      S.canvas = { conectado:true, etapa:null, token:'', consent:false, erro:'', escolhidos:{}, sync:'agora', mostrar:false, confirmarSaida:false };
      toast(novos.length + ' matérias importadas do Canvas.'); return true;
    case 'canvas-sync': S.canvas.sync = 'agora'; toast('Sincronizado: nenhuma nota nova.'); return true;
    case 'canvas-desconectar': S.canvas.confirmarSaida = true; render(); return true;
    case 'canvas-desconectar-nao': S.canvas.confirmarSaida = false; render(); return true;
    case 'canvas-desconectar-sim':
      S.vinculos = S.vinculos.filter(function(x){ return x.origem !== 'canvas'; });
      S.canvas = { conectado:false, etapa:null, token:'', consent:false, erro:'', escolhidos:{}, sync:'', mostrar:false, confirmarSaida:false };
      toast('Canvas desconectado e token apagado.'); return true;

    case 'envio-exemplo': S.envios = S.envios.concat(exemplosEnvio()); render(); return true;
    case 'envio-limpar': S.envios = []; render(); return true;
    case 'envio-remover': S.envios = S.envios.filter(function(x){ return String(x.id) !== v; }); render(); return true;
    case 'publicar-envios':
      var prontos = S.envios.filter(function(x){ return !problemaEnvio(x); });
      prontos.forEach(function(x){
        var novo = { id:ESTUDOS.length + 100 + x.id, mat:x.mat, titulo:x.titulo.trim(), desc:x.desc.trim() || 'Material publicado agora.', autor:S.cargo === 'monitor' ? 'Lorem Ipsum' : PROF_EU,
                     papel:S.cargo === 'monitor' ? 'Monitor' : 'Professor', data:'agora', com:0, fav:0, revisado:S.cargo !== 'monitor' };
        ESTUDOS.unshift(novo); S.publicados.push(novo);
      });
      S.envios = S.envios.filter(function(x){ return problemaEnvio(x); });
      toast(prontos.length + (prontos.length === 1 ? ' estudo publicado.' : ' estudos publicados.')); return true;

    case 'pessoas-turma': S.pessoasTurma = v; S.csv.previa = null; render(); return true;
    case 'csv-exemplo':
      var tt = turma(S.pessoasTurma);
      S.csv.texto = 'matricula\n' + tt.membros[4].mat + '\n' + tt.membros[5].mat + '\n' + (tt.membros.filter(function(p){ return p.papel === 'monitor'; })[0] || tt.membros[6]).mat + '\n2099000001';
      S.csv.previa = null; render(); return true;
    case 'csv-previa':
      if (!S.csv.texto.trim()){ toast('Envie um arquivo ou cole ao menos uma matrícula.'); return true; }
      S.csv.previa = lerCsv(S.csv.texto, turma(S.pessoasTurma)); render(); return true;
    case 'csv-cancelar': S.csv.previa = null; render(); return true;
    case 'csv-confirmar':
      var tu = turma(S.pessoasTurma), ok = S.csv.previa.filter(function(x){ return x.situacao === 'ok'; });
      ok.forEach(function(x){ tu.membros.forEach(function(p){ if (p.mat === x.mat) p.papel = S.csv.papel; }); });
      S.historico.unshift({ quando:agora(), quem:quemSou(), txt:'mudou ' + ok.length + ' pessoa' + (ok.length === 1 ? '' : 's') + ' para ' + S.csv.papel + ' em ' + nomeTurma(tu), como:'arquivo' });
      S.csv = { texto:'', papel:S.csv.papel, previa:null };
      toast(ok.length + (ok.length === 1 ? ' cargo alterado.' : ' cargos alterados.')); return true;
    case 'gerenciar-cargos': S.pessoasTurma = v; S.csv.previa = null; abrir('pessoas'); return true;

    case 'rel-abrir': S.relAberta = S.relAberta === v ? null : v; render(); return true;
    case 'rel-turmas': S.relSigla = v; abrir('relMateria'); return true;
    case 'abrir-turma-prof': S.turmaProf = v; S.regraRascunho = null; abrir('turma'); return true;

    case 'regra-adicionar': S.regraRascunho.avaliacoes.push({ nome:'', valor:0 }); render(); return true;
    case 'regra-remover': S.regraRascunho.avaliacoes.splice(Number(v), 1); render(); return true;
    case 'regra-salvar':
      var rr = S.regraRascunho, erro = !rr.avaliacoes.length ? 'Cadastre ao menos uma avaliação.'
        : rr.avaliacoes.some(function(x){ return !String(x.nome).trim(); }) ? 'Toda avaliação precisa de nome.'
        : rr.avaliacoes.some(function(x){ return !(parseFloat(x.valor) > 0); }) ? 'Toda avaliação precisa valer mais que 0.' : '';
      if (erro){ document.getElementById('regra-erro').textContent = erro; return true; }
      turma(rr.turma).regra = { aprovacao:parseFloat(rr.aprovacao) || 0, frequencia:parseFloat(rr.frequencia) || 0,
        avaliacoes:rr.avaliacoes.map(function(x){ return { nome:String(x.nome).trim(), valor:parseFloat(x.valor) }; }) };
      S.regraRascunho = null;
      toast('Regra salva. Os alunos já veem o calculador com ela.'); return true;
  }
  return false;
}

function entradaNovidades(ev){
  var t = ev.target, id = t.id, d = t.dataset;
  if (id === 'buscaTurma' || id === 'buscaPessoa'){
    S[id] = t.value; var pos = t.selectionStart; render();
    var n = document.getElementById(id); if (n){ n.focus(); try { n.setSelectionRange(pos, pos); } catch (e) {} }
    return;
  }
  if (id === 'nome-novo') S.nomeNovo = t.value;
  if (id === 'senha-nova' || id === 'senha-conf'){
    if (id === 'senha-nova') S.senhaNova = t.value; else S.senhaConf = t.value;
    S.erroConf = '';
    document.getElementById('regras-senha').innerHTML = regrasSenha(S.senhaNova);
    document.getElementById('msg-conf').innerHTML = msgConf();
    return;
  }
  if (id === 'canvas-token') S.canvas.token = t.value;
  if (id === 'csv-texto') S.csv.texto = t.value;
  if (d.aval !== undefined){
    var tid = turmaDaMateria(S.materia).id, e = S.estimativas[tid] = S.estimativas[tid] || {};
    if (t.value === '') delete e[d.aval]; else e[d.aval] = t.value;
    atualizarCalc(); return;
  }
  if (d.regra){
    var rr = S.regraRascunho;
    if (d.i !== undefined) rr.avaliacoes[Number(d.i)][d.regra] = t.value; else rr[d.regra] = t.value;
    document.getElementById('regra-soma').innerHTML = somaRegraTxt(); document.getElementById('regra-erro').textContent = '';
    return;
  }
  if (d.envio){
    var v = S.envios.filter(function(x){ return String(x.id) === d.envio; })[0];
    if (v){ v[d.envioCampo] = t.value; atualizarEnvio(v); }
  }
}
function mudancaNovidades(ev){
  var t = ev.target, d = t.dataset;
  if (t.id === 'canvas-consent'){ S.canvas.consent = t.checked; return; }
  if (d.canvasCurso){ S.canvas.escolhidos[d.canvasCurso] = t.checked; return; }
  if (t.id === 'envio-arquivos'){ Array.prototype.forEach.call(t.files, function(f){ S.envios.push(novoEnvio(f.name, f.size)); }); render(); return; }
  if (d.envio && d.envioCampo === 'mat'){ var v = S.envios.filter(function(x){ return String(x.id) === d.envio; })[0]; if (v){ v.mat = t.value; atualizarEnvio(v); } return; }
  if (t.id === 'csv-papel'){ S.csv.papel = t.value; if (S.csv.previa){ S.csv.previa = lerCsv(S.csv.texto, turma(S.pessoasTurma)); render(); } return; }
  if (t.id === 'csv-arquivo' && t.files[0]){
    var leitor = new FileReader();
    leitor.onload = function(){ S.csv.texto = String(leitor.result); S.csv.previa = null; render(); };
    leitor.readAsText(t.files[0]); return;
  }
  if (d.papel){
    var tu = turma(S.pessoasTurma), p = tu.membros.filter(function(x){ return x.mat === d.papel; })[0];
    if (!p || p.papel === t.value) return;
    S.historico.unshift({ quando:agora(), quem:quemSou(), txt:'mudou ' + p.nome + ' de ' + p.papel + ' para ' + t.value + ' em ' + nomeTurma(tu), como:'página' });
    p.papel = t.value;
    toast(p.nome + ' agora é ' + t.value + '.');
  }
}
function teclaNovidades(ev){
  if (ev.target.id !== 'buscaEst') return false;
  var sug = sugestoesMaterias();
  if (ev.key === 'Enter' && sug.length){ ev.preventDefault(); adicionarTag((sug[S.sugIdx] || sug[0]).id); return true; }
  if ((ev.key === 'ArrowDown' || ev.key === 'ArrowUp') && sug.length){
    ev.preventDefault(); S.sugIdx = (S.sugIdx + (ev.key === 'ArrowDown' ? 1 : sug.length - 1)) % sug.length; render();
    var n = document.getElementById('buscaEst'); if (n) n.focus(); return true;
  }
  if (ev.key === 'Backspace' && !ev.target.value && S.tags.length){ S.tags.pop(); render(); var b = document.getElementById('buscaEst'); if (b) b.focus(); return true; }
  return false;
}

/* ============================== render ============================== */
var fone = document.getElementById('fone');
var ultimaChave = '';

function chaveTela(){ return S.tela ? S.tela + ':' + (S.materia||'') + (S.estudo||'') + (S.conv||'') + (S.cfgSec||'') : 'tab:' + S.tab; }

function render(){
  var corpo = document.getElementById('corpo');
  var rolagem = corpo ? corpo.scrollTop : 0;
  var chave = chaveTela();
  var conteudo = S.tela ? telas[S.tela]() : telas[S.tab]();
  var sobre = '';
  if (S.tarefa) sobre += modalTarefa();
  if (S.sheet) sobre += sheetEquipe();
  if (S.toast) sobre += '<div role="status" class="toast">' + esc(S.toast) +
    (desfazerToast ? '<button data-a="desfazer" class="toast__desfazer">Desfazer</button>' : '') + '</div>';
  fone.innerHTML = cabecalho() + '<main id="corpo" class="corpo rolagem">' + conteudo + '</main>' + barraInferior() + sobre;
  var novo = document.getElementById('corpo');
  if (chave === ultimaChave) novo.scrollTop = rolagem;
  else if (S.tela === 'conversa') novo.scrollTop = novo.scrollHeight;
  ultimaChave = chave;
  var sel = document.getElementById('cargo'); if (sel) sel.value = S.cargo;
  // avisa o protótipo desktop quando o cargo muda aqui dentro (login, sair)
  if (cargoAvisado === null) cargoAvisado = S.cargo;
  else if (S.cargo !== cargoAvisado){ cargoAvisado = S.cargo; if (EMBED) window.parent.postMessage({ hub:1, tipo:'cargo', v:S.cargo }, '*'); }
}

var timerToast, desfazerToast = null;
var TOAST_MS = 2400, TOAST_DESFAZER_MS = 6000; // com "Desfazer" o aviso fica mais tempo, para dar tempo de tocar
function mostrarToast(t, ms){ S.toast = t; render(); clearTimeout(timerToast); timerToast = setTimeout(function(){ S.toast = ''; desfazerToast = null; render(); }, ms); }
function toast(t){ desfazerToast = null; mostrarToast(t, TOAST_MS); }
function toastDesfazer(t, desfazer){ desfazerToast = desfazer; mostrarToast(t, TOAST_DESFAZER_MS); }
function abrir(tela){ S.pilha.push({ tela:S.tela, tab:S.tab }); S.tela = tela; render(); }
function exigirLogin(motivo){ S.motivo = motivo; S.erroLogin = ''; abrir('entrar'); }

var ROTULO_ABA = { calendario:'o calendário', chat:'o chat', feedback:'Dúvidas & Feedback', config:'as configurações' };

/* ============================== eventos ============================== */
fone.addEventListener('click', function(ev){
  var alvo = ev.target.closest('[data-a]');
  if (!alvo || !fone.contains(alvo)) return;
  // clique dentro do diálogo não fecha o fundo
  if (alvo.getAttribute('data-a') && /fechar-(modal|sheet)/.test(alvo.getAttribute('data-a')) && alvo.classList.contains('sobreposicao') && ev.target.closest('[data-parar]')) return;
  var a = alvo.getAttribute('data-a'), v = alvo.getAttribute('data-v');

  switch (a){
    case 'tab':
      if (!logado() && ROTULO_ABA[v]){ S.tab = v; S.pilha = []; S.tela = null; exigirLogin('Entre para ver ' + ROTULO_ABA[v] + '.'); return; }
      S.tab = v; S.tela = null; S.pilha = []; S.tarefa = null; S.sheet = false; render(); return;
    case 'voltar':
      var p = S.pilha.pop();
      if (p){ S.tela = p.tela; S.tab = p.tab; } else S.tela = null;
      if (!logado() && !S.tela && ROTULO_ABA[S.tab]) S.tab = 'inicio';
      render(); return;
    case 'ir-entrar': exigirLogin(''); return;
    case 'entrar-aba': S.entrarAba = v; S.erroLogin = ''; S.erroGeral = ''; S.erroConf = ''; render(); return;
    case 'login':
      var email = (document.getElementById('email').value || '').trim().toLowerCase();
      S.email = email; S.erroGeral = '';
      if (!email){ S.erroLogin = 'Informe seu e-mail institucional.'; render(); return; }
      if (!/@(sga\.)?exemplo\.br$/.test(email)){ S.erroLogin = 'Esse e-mail não é da universidade. Use o que termina em @sga.exemplo.br.'; render(); return; }
      S.erroLogin = '';
      // F1 · “Credenciais corretas?”: no protótipo a senha certa é 123456
      var senha = (document.getElementById('senha') || {}).value || '';
      S.erroConf = '';
      if (S.entrarAba === 'criar'){
        // senha forte: maiúscula, minúscula, número e caractere especial
        var faltam = REGRAS_SENHA.filter(function(r){ return !r[1](S.senhaNova); });
        if (faltam.length){ S.erroGeral = 'A senha ainda precisa de: ' + faltam.map(function(r){ return r[0].toLowerCase(); }).join(', ') + '.'; render(); return; }
        if (S.senhaConf !== S.senhaNova){ S.erroConf = 'As senhas não coincidem.'; render(); return; }
      } else if (senha !== '123456'){ S.erroGeral = 'E-mail ou senha incorretos.'; render(); return; }
      var criou = S.entrarAba === 'criar';
      S.cargo = 'aluno'; S.motivo = ''; S.tela = null; S.pilha = []; S.senhaNova = ''; S.senhaConf = '';
      toast(criou ? 'Conta criada. Você começa como aluno.' : 'Você entrou como ' + email); return;
    case 'sair':
      S.cargo = 'visitante'; S.tab = 'inicio'; S.tela = null; S.pilha = []; S.cfgSec = null; toast('Você saiu da conta.'); return;

    case 'abrir-notif': S.notifLidas = true; abrir('notificacoes'); return;
    case 'abrir-perfil': S.tab = 'config'; S.tela = null; S.pilha = []; S.cfgSec = 'perfil'; abrir('cfg'); return;
    case 'notif-filtro': S.notifFiltro = v; render(); return;
    case 'marcar-lidas': S.notifLidas = true; toast('Tudo marcado como lido.'); return;

    // calendário
    case 'cal-vista': S.calVista = v; render(); return;
    case 'cal-mat': S.calMat = v; render(); return;
    case 'semana': S.semana = v === '0' ? 0 : S.semana + Number(v); S.diaSel = null; render(); return;
    case 'dia': S.diaSel = S.diaSel === Number(v) ? null : Number(v); render(); return;
    case 'mes-dia': S.mesDia = Number(v); render(); return;
    case 'abrir-tarefa': S.tarefa = Number(v); render(); return;
    case 'fechar-modal': if (ev.target.closest('[data-parar]') && alvo.hasAttribute('data-parar') === false && alvo.classList.contains('sobreposicao')) return; S.tarefa = null; render(); return;
    case 'ir-cal-mes': S.tab = 'calendario'; S.tela = null; S.pilha = []; S.calVista = 'mes'; S.mesDia = S.aulaoMarcado ? 18 : 14; render(); return;
    case 'importar-feed': S.feedSalvo = true; toast('68 eventos importados do Canvas.'); return;
    case 'copiar-feed': S.copiado = true; render(); setTimeout(function(){ S.copiado = false; render(); }, 1800); return;
    case 'novo-link': toast('Link novo gerado. O antigo parou de funcionar.'); return;

    // matérias e estudos
    case 'mat-aba': S.matAba = v; render(); return;
    case 'abrir-materia': S.tarefa = null; S.materia = v; S.calcAberta = false; if (S.tab !== 'materias' && S.tab !== 'inicio'){ S.tab = 'materias'; S.pilha = []; S.tela = null; } abrir('materia'); return;
    case 'limpar-mat': S.buscaMat = ''; render(); return;
    case 'ir-estudos': S.tab = 'materias'; S.matAba = 'estudos'; S.tela = null; S.pilha = []; render(); return;
    case 'est-mat':
      if (v === 'todas') S.tags = []; else if (S.tags.indexOf(v) >= 0) S.tags = S.tags.filter(function(x){ return x !== v; }); else S.tags.push(v);
      render(); return;
    case 'limpar-busca': S.buscaEst = ''; S.tags = []; render(); return;
    case 'fav':
      if (!logado()){ exigirLogin('Entre para favoritar estudos.'); return; }
      S.favs[v] = !S.favs[v]; toast(S.favs[v] ? 'Adicionado aos favoritos.' : 'Removido dos favoritos.'); return;
    case 'abrir-estudo':
      S.estudo = Number(v); S.confirmarExclusao = false; S.comentarioNovo = '';
      if (S.tela === 'notificacoes'){ S.pilha = []; S.tela = null; S.tab = 'materias'; S.matAba = 'estudos'; }
      abrir('estudo'); return;
    case 'est-status': if (!logado()){ exigirLogin('Entre para acompanhar seu progresso.'); return; } S.estStatus[S.estudo] = v; render(); return;
    case 'comentar':
      if (!logado()){ exigirLogin('Entre para comentar.'); return; }
      var txt = (document.getElementById('comentario').value || '').trim();
      if (!txt){ toast('Escreva o comentário antes de enviar.'); return; }
      S.meusComentarios = S.meusComentarios || {}; S.meusComentarios[S.estudo] = (S.meusComentarios[S.estudo] || []).concat([{ nome:USUARIO.nome, papel:S.cargo === 'aluno' ? 'Aluno' : S.cargo === 'monitor' ? 'Monitor' : 'Professor', data:'agora', texto:txt }]);
      S.comentariosEnviados = S.comentariosEnviados || {}; S.comentariosEnviados[S.estudo] = (S.comentariosEnviados[S.estudo] || 0) + 1;
      S.comentarioNovo = ''; toast('Comentário publicado.'); return;
    case 'levar-duvida':
      if (!logado()){ exigirLogin('Entre para enviar dúvidas.'); return; }
      S.assunto = estudo(S.estudo).titulo; S.fbAba = 'enviar'; S.tab = 'feedback'; S.tela = null; S.pilha = []; render(); return;
    case 'pedir-material':
      S.assunto = v ? 'Material de ' + v : (S.buscaEst ? 'Material sobre ' + S.buscaEst : ''); S.tipoEnvio = 'Pedir material'; S.fbAba = 'enviar';
      if (!logado()){ S.tab = 'feedback'; S.tela = null; S.pilha = []; exigirLogin('Entre para pedir o material. Seu pedido fica guardado.'); return; }
      S.tab = 'feedback'; S.tela = null; S.pilha = []; render(); return;
    case 'sheet': S.sheet = true; render(); return;
    case 'fechar-sheet': S.sheet = false; S.confirmarExclusao = false; render(); return;
    case 'revisar': S.revisados[S.estudo] = true; S.sheet = false; toast('Marcado como revisado.'); return;
    case 'pedir-exclusao': S.confirmarExclusao = true; render(); return;
    case 'cancelar-exclusao': S.confirmarExclusao = false; render(); return;
    case 'excluir': S.excluidos[S.estudo] = true; S.sheet = false; S.confirmarExclusao = false; var pv = S.pilha.pop(); S.tela = pv ? pv.tela : null; toast('Estudo excluído.'); return;
    case 'ir-publicar': abrir('publicar'); return;

    // chat
    case 'chat-aba': S.chatAba = v; render(); return;
    case 'caixa-filtro': S.caixaFiltro = v; render(); return;
    case 'abrir-conv':
      if (!logado()){ exigirLogin('Entre para ver o chat.'); return; }
      var cv = conversa(v); if (cv && v !== 'ipsum') cv.nao = 0;
      if (S.tab !== 'chat'){ S.tab = 'chat'; S.chatAba = 'conversas'; S.tela = null; S.pilha = []; }
      S.conv = v; S.rascunho = ''; abrir('conversa'); return;
    case 'enviar-msg': enviarMensagem(); return;
    case 'resolveu':
      S.resolvido = v === 'sim';
      toast(S.resolvido ? 'Obrigado! A dúvida foi marcada como útil.' : 'O monitor foi avisado de que ainda não resolveu.'); return;

    // dúvidas & feedback
    case 'fb-aba': S.fbAba = v; render(); return;
    case 'ir-fb': S.tab = 'feedback'; S.fbAba = v || 'turma'; S.tela = null; S.pilha = []; render(); return;
    case 'fb-mat': S.fbMat = v; render(); return;
    case 'abrir-enquete': S.enqueteAberta = true; toast('Enquete aberta. A turma de CDI I foi avisada.'); return;
    case 'relatorio': toast('Relatório enviado ao Prof. Lorem Dolor.'); return;
    case 'votar': if (S.votou) return; S.votou = true; S.voto = Number(v); render(); return;
    case 'marcar-aulao':
    case 'encerrar-enquete': S.etapaAulao = 'definir'; S.temaAulao = 'Regra da cadeia na prática'; S.desempate = false; S.conflito = false; render(); return;
    case 'simular-empate': S.etapaAulao = 'empate'; render(); return;
    case 'desempatar': S.temaAulao = v; S.desempate = true; S.etapaAulao = 'definir'; S.conflito = false; render(); return;
    case 'data-aulao': S.dataAulao = v; S.conflito = false; render(); return;
    case 'confirmar-aulao':
      // F4 · “Horário livre?”: 22/09 cai no dia da prova
      if (S.dataAulao === '22'){ S.conflito = true; render(); return; }
      S.aulaoMarcado = true; S.etapaAulao = null; toast('Aulão marcado para 18/09 às 19 h.'); return;
    case 'tipo-envio': S.tipoEnvio = v; render(); return;
    case 'resolveu-triagem': S.fbAba = 'turma'; S.assunto = ''; toast('Que bom! Nada foi enviado.'); return;
    case 'enviar-duvida':
      if (S.foraHorario){ S.naFila = true; render(); return; }
      S.pedidoEnviado = true; S.respostaChegou = false; S.resolvido = null; render(); return;
    case 'abrir-horario': S.naFila = false; S.pedidoEnviado = true; S.respostaChegou = false; S.resolvido = null; render(); return;
    case 'nova-duvida': S.naFila = false; S.pedidoEnviado = false; S.respostaChegou = false; S.resolvido = null; S.assunto = ''; render(); return;
    case 'simular-resposta': S.respostaChegou = true; S.resolvido = null; S.notifLidas = false; toast('Nova notificação: Ipsum Dolor respondeu.'); return;
    case 'aval-nota': S.avalNota = Number(v); render(); return;
    case 'aval-filtro': S.avalFiltro = v; render(); return;
    case 'enviar-aval':
      if (!S.avalNota){ toast('Escolha de 1 a 5 estrelas.'); return; }
      S.minhaAval = { nome:USUARIO.nome, papel:S.cargo === 'aluno' ? 'Aluno' : 'Monitor', nota:S.avalNota, cat:S.avalCat, data:'agora', texto:S.avalTexto.trim() || 'Sem comentário.' };
      render(); return;

    // config
    case 'abrir-cfg': if (S.tab !== 'config'){ S.tab = 'config'; S.tela = null; S.pilha = []; } S.cfgSec = v; abrir('cfg'); return;
    case 'notif': var pr = v.split('-'), k = NOTIF_ITENS[Number(pr[0])]; S.notif[k][Number(pr[1])] = !S.notif[k][Number(pr[1])]; render(); return;
    case 'tema': S.tema = v; salvarTema(TEMA_VAL[v]); render(); return;
    case 'densidade': S.densidade = v; render(); return;
    case 'fonte': S.fonte = v; render(); return;
    case 'priv': S[v] = !S[v]; render(); return;
    case 'a11y': S.a11y[v] = !S.a11y[v]; render(); return;
    case 'twofa': S.twofa = !S.twofa; render(); return;
    case 'encerrar-sessao': S.sessoes = 1; toast('Sessão do notebook encerrada.'); return;
    case 'salvar': toast('Alterações salvas.'); return;
    case 'toast': toast(v); return;
    case 'desfazer': var fn = desfazerToast; desfazerToast = null; if (fn) fn(); return;
    default: novidades(a, v);
  }
});

function enviarMensagem(){
  var inp = document.getElementById('rascunho');
  var t = (inp && inp.value || '').trim();
  if (!t) return;
  var c = conversa(S.conv), agora = new Date();
  c.msgs.push({ de:'eu', t:t, h:pad(agora.getHours()) + ':' + pad(agora.getMinutes()) });
  c.hora = pad(agora.getHours()) + ':' + pad(agora.getMinutes());
  S.rascunho = '';
  render();
  var novo = document.getElementById('rascunho'); if (novo) novo.focus();
}

fone.addEventListener('input', function(ev){
  var id = ev.target.id;
  if (id === 'buscaEst' || id === 'buscaMat'){
    S[id] = ev.target.value; S.sugIdx = 0;
    var pos = ev.target.selectionStart;
    render();
    var n = document.getElementById(id); if (n){ n.focus(); try { n.setSelectionRange(pos, pos); } catch(e){} }
  }
  if (id === 'rascunho') S.rascunho = ev.target.value;
  if (id === 'assunto') S.assunto = ev.target.value;
  if (id === 'comentario') S.comentarioNovo = ev.target.value;
  if (id === 'avalTexto') S.avalTexto = ev.target.value;
  entradaNovidades(ev);
});
fone.addEventListener('change', function(ev){
  var id = ev.target.id;
  if (id === 'avalCat') S.avalCat = ev.target.value;
  if (id === 'idioma') S.idioma = ev.target.value;
  if (id === 'visibilidade') S.visibilidade = ev.target.value;
  mudancaNovidades(ev);
});
fone.addEventListener('keydown', function(ev){
  if (teclaNovidades(ev)) return;
  if (ev.key === 'Enter' && ev.target.id === 'rascunho'){ ev.preventDefault(); enviarMensagem(); return; }
  if (ev.key === 'Enter' && ev.target.id === 'email'){ ev.preventDefault(); var b = fone.querySelector('[data-a="login"]'); if (b) b.click(); return; }
  if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.getAttribute('role') === 'button'){ ev.preventDefault(); ev.target.click(); }
  if (ev.key === 'Escape' && (S.tarefa || S.sheet)){ S.tarefa = null; S.sheet = false; render(); }
});

/* ============================== painel do protótipo ============================== */
function mudarCargo(v){
  if (v === S.cargo) return;
  S.cargo = v; S.sheet = false; S.tarefa = null;
  if (!logado() && (S.tela || ROTULO_ABA[S.tab])){ S.tela = null; S.pilha = []; S.tab = 'inicio'; }
  render();
}
// as 4 tarefas do teste de usabilidade, iguais às do protótipo desktop
function roteiro(r){
  var fh = S.foraHorario, tm = S.tema; S = clone(INICIAL); S.foraHorario = fh; S.tema = tm;   // horário vem da barra de teste; tema é do navegador
  if (r === '1'){ S.cargo = 'visitante'; }
  if (r === '2'){ S.tab = 'materias'; S.matAba = 'estudos'; }
  if (r === '3'){ S.tab = 'feedback'; S.fbAba = 'turma'; S.assunto = 'Derivação implícita de x² + y² = 25'; }
  if (r === '4'){ S.cargo = 'monitor'; S.tab = 'feedback'; S.fbAba = 'turma'; }
  ultimaChave = ''; render();
}
document.getElementById('cargo').addEventListener('change', function(){ mudarCargo(this.value); });
document.getElementById('horario').addEventListener('change', function(){ S.foraHorario = this.value === 'fora'; render(); });
Array.prototype.forEach.call(document.querySelectorAll('[data-roteiro]'), function(b){
  b.addEventListener('click', function(){ roteiro(b.getAttribute('data-roteiro')); });
});

/* ============================== modo exportação (Figma) ============================== */
// #quadro      -> todas as telas lado a lado, uma por frame de 390 px
// #tela=<id>   -> uma tela só, para gerar o PNG
var ESTADOS = [
  ['01-inicio-aluno',            'Início — aluno',                      {}],
  ['02-inicio-monitor',          'Início — monitor (área da equipe)',   { cargo:'monitor' }],
  ['03-inicio-visitante',        'Início — visitante (catálogo)',        { cargo:'visitante' }],
  ['04-inicio-busca-vazia',      'Catálogo — busca sem resultado',      { cargo:'visitante', buscaEst:'grafos ponderados' }],
  ['05-entrar-erro',             'Entrar — e-mail inválido',            { cargo:'visitante', tela:'entrar', email:'lorem@gmail.com', erroLogin:'Esse e-mail não é da universidade. Use o que termina em @sga.exemplo.br.', motivo:'Entre para favoritar estudos.' }],
  ['06-criar-conta',             'Entrar — criar conta',                { cargo:'visitante', tela:'entrar', entrarAba:'criar' }],
  ['07-notificacoes',            'Notificações',                        { tela:'notificacoes', respostaChegou:true, enqueteAberta:true }],
  ['08-calendario-semana',       'Calendário — semana',                 { tab:'calendario' }],
  ['09-calendario-tarefa',       'Calendário — modal da tarefa',        { tab:'calendario', tarefa:2 }],
  ['10-calendario-mes',          'Calendário — mês com aulão',          { tab:'calendario', calVista:'mes', mesDia:18, aulaoMarcado:true }],
  ['11-materias',                'Matérias — lista',                    { tab:'materias' }],
  ['12-materia-detalhe',         'Matéria — detalhe (CDI I)',           { tab:'materias', tela:'materia', materia:'cdi' }],
  ['13-estudos',                 'Matérias — Estudos',                  { tab:'materias', matAba:'estudos' }],
  ['14-estudo-aluno',            'Estudo — aluno',                      { tab:'materias', tela:'estudo', estudo:1 }],
  ['15-estudo-equipe',           'Estudo — ações da equipe',            { cargo:'monitor', tab:'materias', tela:'estudo', estudo:3, sheet:true }],
  ['16-publicar',                'Publicar — cartões por arquivo',      { cargo:'monitor', tab:'materias', tela:'publicar', envios:exemplosEnvio() }],
  ['17-publicar-sem-permissao',  'Publicar — sem permissão',            { tab:'materias', tela:'publicar' }],
  ['18-chat-conversas',          'Chat — conversas',                    { tab:'chat', respostaChegou:true }],
  ['19-chat-resposta',           'Chat — resposta do monitor',          { tab:'chat', tela:'conversa', conv:'ipsum', respostaChegou:true, pedidoEnviado:true }],
  ['20-chat-fora-do-horario',    'Chat — fora do horário',              { tab:'chat', tela:'conversa', conv:'sit' }],
  ['21-chat-caixa',              'Chat — caixa de entrada',             { tab:'chat', chatAba:'caixa', respostaChegou:true }],
  ['22-duvidas-turma-monitor',   'Dúvidas — turma (monitor)',           { cargo:'monitor', tab:'feedback' }],
  ['23-duvidas-enquete',         'Dúvidas — enquete votada',            { tab:'feedback', enqueteAberta:true, votou:true, voto:0, pedidoEnviado:true }],
  ['24-duvidas-enviar',          'Dúvidas — enviar com triagem',        { tab:'feedback', fbAba:'enviar', assunto:'Derivação implícita de x² + y² = 25' }],
  ['25-duvidas-enviada',         'Dúvidas — pedido #143 enviado',       { tab:'feedback', fbAba:'enviar', pedidoEnviado:true }],
  ['26-auloes',                  'Dúvidas — aulão marcado',             { cargo:'monitor', tab:'feedback', fbAba:'auloes', enqueteAberta:true, aulaoMarcado:true }],
  ['27-avaliacoes',              'Feedback — avaliações',               { tab:'feedback', fbAba:'avaliacoes', avalNota:4, avalCat:'Calendário' }],
  ['28-config',                  'Configurações',                       { tab:'config' }],
  ['29-config-perfil',           'Config — perfil',                     { tab:'config', tela:'cfg', cfgSec:'perfil' }],
  ['30-config-notificacoes',     'Config — notificações',               { tab:'config', tela:'cfg', cfgSec:'notificacoes' }],
  ['31-config-aparencia',        'Config — aparência',                  { tab:'config', tela:'cfg', cfgSec:'aparencia' }],
  ['32-config-privacidade',      'Config — privacidade',                { tab:'config', tela:'cfg', cfgSec:'privacidade' }],
  ['33-config-acessibilidade',   'Config — acessibilidade',             { tab:'config', tela:'cfg', cfgSec:'acessibilidade' }],
  ['34-config-conta',            'Config — conta e segurança',          { tab:'config', tela:'cfg', cfgSec:'conta' }],
  ['35-inicio-materia-aberta',   'Início — matéria aberta com prévia',  { expandida:'cdi-02' }],
  ['36-materia-calculador',      'Matéria — calculador de média',       { tab:'materias', tela:'materia', materia:'cdi', calcAberta:true, estimativas:{ 'cdi-02':{ 'Lista 4':4, 'Trabalho':16 } } }],
  ['37-estudos-tags',            'Estudos — sugestão de matérias',      { tab:'materias', matAba:'estudos', buscaEst:'calc' }],
  ['38-criar-conta-senha',       'Criar conta — senha forte',           { cargo:'visitante', tela:'entrar', entrarAba:'criar', email:'lorem@sga.exemplo.br', senhaNova:'Abc123', senhaConf:'Abc12' }],
  ['39-integracoes',             'Config — conectar o Canvas',          { tab:'config', tela:'cfg', cfgSec:'integracoes', canvas:{ conectado:false, etapa:null, token:'', consent:false, erro:'', escolhidos:{}, sync:'', mostrar:false, confirmarSaida:false } }],
  ['40-minhas-materias',         'Minhas matérias — adicionar turma',   { tab:'config', tela:'minhas', buscaTurma:'calc' }],
  ['41-pessoas-cargos',          'Pessoas e cargos (professor)',        { cargo:'professor', tab:'config', tela:'pessoas' }],
  ['42-relatorios',              'Relatórios do professor',             { cargo:'professor', tela:'relatorios' }],
  ['43-turma-regra',             'Turma — alunos e regra de nota',      { cargo:'professor', tela:'turma', turmaProf:'cdi-02' }]
];
function aplicar(e){ S = clone(INICIAL); Object.keys(e[2]).forEach(function(k){ S[k] = e[2][k]; }); ultimaChave = ''; render(); }

function exportar(){
  var hsh = location.hash.slice(1);
  if (hsh !== 'quadro' && hsh.indexOf('tela=') !== 0) return false;
  var lista = hsh === 'quadro' ? ESTADOS : ESTADOS.filter(function(e){ return e[0] === hsh.slice(5); });
  if (!lista.length) return false;
  // o visual das molduras está em css/mobile.css, na seção "Modo exportação"
  document.documentElement.classList.add('exportando');
  var saida = document.createElement('div');
  saida.className = hsh === 'quadro' ? 'quadro' : 'solo';
  lista.forEach(function(e){
    aplicar(e);
    var sec = document.createElement('section');
    sec.setAttribute('data-frame', e[0]);
    if (hsh === 'quadro') sec.innerHTML = '<p class="quadro-rot">' + e[0].slice(0,2) + ' · ' + e[1] + '</p>';
    var f = document.createElement('div');
    f.className = 'frame';
    f.innerHTML = fone.innerHTML;
    Array.prototype.forEach.call(f.querySelectorAll('[id]'), function(n){ n.removeAttribute('id'); });
    sec.appendChild(f);
    saida.appendChild(sec);
  });
  document.body.appendChild(saida);
  return true;
}

if (!exportar()) render();

if (EMBED){
  window.addEventListener('message', function(ev){
    if (ev.source !== window.parent || !ev.data || ev.data.hub !== 1) return;
    if (ev.data.tipo === 'cargo'){ cargoAvisado = ev.data.v; mudarCargo(ev.data.v); }
    if (ev.data.tipo === 'tarefa'){ roteiro(String(ev.data.v)); }
    if (ev.data.tipo === 'horario'){ S.foraHorario = !!ev.data.v; render(); }
  });
  window.parent.postMessage({ hub:1, tipo:'pronto' }, '*');
}
})();
