/* Hub de Estudos · protótipo desktop (prototipo.html)
   Estado, dados fictícios, telas e eventos. A versão de celular roda em hub-mobile.html, dentro de um iframe.

   Mapa do arquivo:
   1. utilidades          5. telas do aluno (hub, matéria, calculadora, minhas matérias)
   2. dados fictícios     6. telas de conteúdo (estudos com tags, publicar)
   3. estado              7. telas da equipe (pessoas e cargos, relatórios, turma)
   4. cabeçalho e tema    8. eventos e sincronia com o celular */
(function(){
  "use strict";

  /* ======================================================================
     1. utilidades
     ====================================================================== */
  var el = function(id){ return document.getElementById(id); };
  var esc = function(t){ return String(t).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); };
  // compara sem acento e sem maiúscula: "Cálculo" casa com "calc"
  var norm = function(t){ return String(t).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); };
  var num = function(n, casas){ return (Math.round(n * 10) / 10).toFixed(casas === undefined ? (n % 1 ? 1 : 0) : casas).replace('.', ','); };
  var soma = function(l, f){ return l.reduce(function(a, x){ return a + (f ? f(x) : x); }, 0); };
  // número pseudoaleatório fixo por texto: os dados fictícios não mudam a cada clique
  function sorteio(txt, min, max){
    var h = 0;
    for (var i = 0; i < txt.length; i++) h = (h * 31 + txt.charCodeAt(i)) % 100003;
    return min + (h % 1000) / 999 * (max - min);
  }

  /* ======================================================================
     2. dados fictícios
     ====================================================================== */
  var MATERIAS = [
    {sigla:'AEDS1', nome:'Algoritmos e Estruturas de Dados I',   cor:1, apelidos:['aeds','aeds 1','algoritmos','estruturas de dados']},
    {sigla:'AEDS2', nome:'Algoritmos e Estruturas de Dados II',  cor:2, apelidos:['aeds','aeds 2','algoritmos','estruturas de dados']},
    {sigla:'AEDS3', nome:'Algoritmos e Estruturas de Dados III', cor:3, apelidos:['aeds','aeds 3','algoritmos','grafos']},
    {sigla:'CALC1', nome:'Cálculo I',   cor:4, apelidos:['calc','calculo','cdi','limites']},
    {sigla:'CALC2', nome:'Cálculo II',  cor:5, apelidos:['calc','calculo','integral']},
    {sigla:'CALC3', nome:'Cálculo III', cor:6, apelidos:['calc','calculo','multivariavel']},
    {sigla:'BD1',   nome:'Banco de Dados I', cor:3, apelidos:['bd','banco','sql']},
    {sigla:'DIW',   nome:'Desenvolvimento de Interfaces Web', cor:4, apelidos:['diw','web','front','css','html']},
    {sigla:'ES1',   nome:'Engenharia de Software I', cor:6, apelidos:['es','engenharia','software','requisitos']},
    {sigla:'TI2',   nome:'Trabalho Interdisciplinar II', cor:1, apelidos:['ti','trabalho interdisciplinar','projeto']}
  ];
  function materia(sigla){ return MATERIAS.filter(function(m){ return m.sigla === sigla; })[0]; }
  var ATALHOS = ['AEDS1','AEDS2','CALC2','DIW','BD1','ES1'];

  var ESTUDOS = [
    {id:1, sigla:'CALC2', titulo:'Guia de Integrais', autor:'Prof. Lorem', com:2, fav:1, chaves:'integrais calculo integral area riemann'},
    {id:2, sigla:'AEDS2', titulo:'Complexidade de algoritmos', autor:'Ipsum · monitor', com:5, fav:3, chaves:'complexidade big o ordenacao merge sort'},
    {id:3, sigla:'AEDS1', titulo:'Ponteiros em C — do zero', autor:'Dolor', com:1, fav:0, chaves:'ponteiros c memoria malloc'},
    {id:4, sigla:'DIW', titulo:'Flexbox e Grid na prática', autor:'Amet', com:0, fav:2, chaves:'css flexbox grid layout responsivo'},
    {id:5, sigla:'CALC2', titulo:'Derivadas — lista resolvida', autor:'Consectetur', com:3, fav:0, chaves:'derivadas limite lista exercicios'},
    {id:6, sigla:'AEDS2', titulo:'Listas encadeadas', autor:'Ipsum · monitor', com:1, fav:1, chaves:'lista encadeada no ponteiro estrutura'},
    {id:7, sigla:'CALC1', titulo:'Limites sem mistério', autor:'Magna · monitora', com:4, fav:5, chaves:'limites continuidade'},
    {id:8, sigla:'CALC3', titulo:'Derivadas parciais em 3 passos', autor:'Prof. Consectetur', com:0, fav:1, chaves:'derivadas parciais gradiente'},
    {id:9, sigla:'BD1', titulo:'Normalização até a 3FN', autor:'Prof.ª Sit Amet', com:2, fav:2, chaves:'normalizacao formas normais sql'}
  ];

  // outros conteúdos que aparecem na prévia das janelas do hub
  var CONTEUDOS = {
    AEDS2:[{tipo:'PDF', titulo:'Slides — filas e pilhas'}, {tipo:'Projeto', titulo:'TP 02 · enunciado'}, {tipo:'Publicação', titulo:'Monitoria extra no sábado'}],
    CALC2:[{tipo:'PDF', titulo:'Lista 5 — integração por partes'}, {tipo:'Publicação', titulo:'P2 remarcada para 06/10'}],
    BD1:[{tipo:'PDF', titulo:'Modelo ER da biblioteca'}, {tipo:'Projeto', titulo:'Trabalho — esquema relacional'}],
    DIW:[{tipo:'Projeto', titulo:'Projeto parcial · protótipo'}, {tipo:'PDF', titulo:'Guia de acessibilidade'}],
    ES1:[{tipo:'PDF', titulo:'Modelo de documento de visão'}, {tipo:'Publicação', titulo:'Grupos da sprint definidos'}],
    TI2:[{tipo:'Projeto', titulo:'Sprint 2 · backlog'}, {tipo:'PDF', titulo:'Rubrica da apresentação'}, {tipo:'Publicação', titulo:'Banca em 20/11'}]
  };

  var EU = {nome:'Lorem Ipsum', mat:'2025010234', email:'lorem.ipsum@sga.exemplo.br'};
  var PROF_EU = 'Prof. Lorem Dolor';
  var NOMES = ['Ipsum Dolor','Sit Amet','Consectetur Elit','Adipiscing Sed','Tempor Magna','Aliqua Veniam','Dolor Sit','Magna Aliqua','Veniam Quis','Nostrud Exer','Ullamco Labo','Quis Nostrud'];

  function membros(base, qtd, monitores, comigo){
    var l = [];
    for (var i = 0; i < qtd; i++){
      l.push({mat:String(2025010100 + base * 37 + i * 13), nome:NOMES[(base + i) % NOMES.length], papel:monitores.indexOf(i) >= 0 ? 'monitor' : 'aluno'});
    }
    if (comigo) l.splice(2, 0, {mat:EU.mat, nome:EU.nome, papel:'aluno'});
    return l;
  }
  function regra(aprovacao, frequencia, lista){
    return {aprovacao:aprovacao, frequencia:frequencia, avaliacoes:lista.map(function(a){ return {nome:a[0], valor:a[1]}; })};
  }
  var R_AEDS = [['Quiz 1',10],['Lab 01',10],['TP 01',15],['Prova 1',25],['TP 02',15],['Prova 2',25]];

  var TURMAS = [
    {id:'aeds2-04', sigla:'AEDS2', turma:'turma 04', turno:'noite', prof:PROF_EU, membros:membros(1, 11, [0], true), regra:regra(60, 75, R_AEDS)},
    {id:'aeds2-02', sigla:'AEDS2', turma:'turma 02', turno:'manhã', prof:PROF_EU, membros:membros(4, 10, [1]), regra:regra(60, 75, R_AEDS)},
    {id:'calc2-02', sigla:'CALC2', turma:'turma 02', turno:'noite', prof:PROF_EU, membros:membros(2, 10, [], true), regra:null},
    {id:'aeds1-01', sigla:'AEDS1', turma:'turma 01', turno:'manhã', prof:PROF_EU, membros:membros(6, 10, [2]), regra:regra(60, 75, R_AEDS)},
    {id:'aeds1-03', sigla:'AEDS1', turma:'turma 03', turno:'noite', prof:PROF_EU, membros:membros(8, 9, []), regra:regra(60, 75, R_AEDS)},
    {id:'diw-01',   sigla:'DIW',   turma:'turma 01', turno:'noite', prof:PROF_EU, membros:membros(3, 11, [3], true),
      regra:regra(60, 75, [['Atividade 1',5],['Atividade 2',10],['Projeto parcial',25],['Prova',30],['Projeto final',30]])},
    {id:'bd1-01',   sigla:'BD1',   turma:'turma 01', turno:'noite', prof:'Prof.ª Sit Amet', membros:membros(5, 10, [], true),
      regra:regra(60, 75, [['Lista 1',10],['Prova 1',30],['Trabalho',30],['Prova 2',30]])},
    {id:'es1-01',   sigla:'ES1',   turma:'turma 01', turno:'noite', prof:'Prof. Tempor Incididunt', membros:membros(7, 10, [1], true),
      regra:regra(60, 75, [['Documento de visão',15],['Prova 1',30],['Sprint review',25],['Prova 2',30]])},
    {id:'ti2-01',   sigla:'TI2',   turma:'turma 01', turno:'noite', prof:'Prof.ª Magna Aliqua', membros:membros(9, 11, [], true),
      regra:regra(60, 75, [['Sprint 1',12],['Sprint 2',12],['Sprint 3',12],['Entrega parcial',24],['Apresentação final',40]])},
    {id:'calc1-03', sigla:'CALC1', turma:'turma 03', turno:'noite', prof:'Prof.ª Aliqua Veniam', membros:membros(10, 10, []), regra:null},
    {id:'calc3-01', sigla:'CALC3', turma:'turma 01', turno:'manhã', prof:'Prof. Consectetur Elit', membros:membros(11, 10, []), regra:null},
    {id:'aeds3-01', sigla:'AEDS3', turma:'turma 01', turno:'noite', prof:'Prof. Adipiscing Sed', membros:membros(0, 10, []), regra:null}
  ];
  function turma(id){ return TURMAS.filter(function(t){ return t.id === id; })[0]; }
  function nomeTurma(t){ return t.sigla + ' · ' + t.turma; }

  // notas e frequência do aluno simulado (Lorem Ipsum), como viriam do Canvas
  var NOTAS_EU = {
    'aeds2-04':{notas:{'Quiz 1':7.5, 'Lab 01':9, 'TP 01':12, 'Prova 1':17}, aulas:36, faltas:6, pendentes:['TP 02 — filas e pilhas · sábado', 'Lab 03 · segunda, 08:50']},
    // turma sem regra cadastrada: só as notas lançadas no Canvas
    'calc2-02':{lancadas:[{nome:'Lista 1', valor:10, obtido:8}, {nome:'Prova 1', valor:30, obtido:19}], aulas:30, faltas:2, pendentes:['Lista 5 · quinta', 'Prova 2 · 06/10']},
    'bd1-01':{notas:{}, aulas:32, faltas:0, pendentes:[]},
    'diw-01':{notas:{'Atividade 1':5}, aulas:34, faltas:4, pendentes:['Atividade 2 · sexta', 'Projeto parcial · 30/09']},
    'es1-01':{notas:{}, aulas:30, faltas:1, pendentes:['Documento de visão · 26/09']},
    'ti2-01':{notas:{'Sprint 1':9}, aulas:36, faltas:8, pendentes:['Sprint 2 · review na terça', 'Relatório parcial · 02/10']}
  };
  var CANVAS_CURSOS = ['aeds2-04','calc2-02','bd1-01','diw-01','es1-01','ti2-01'];
  var SEMESTRE_EU = [0, 71, 69, 74, 70, 72, 75, 73, 74, 76, 76];   // aproveitamento acumulado por semana (%)


  var DICAS = {
    '1':'entre no sistema. Tente favoritar um estudo, erre o e-mail de propósito (ex.: lorem@ipsum.com) para ver a validação, corrija para @sga.exemplo.br e entre. Com uma senha diferente de 123456 aparece “E-mail ou senha incorretos”. Na aba Criar conta, a senha precisa de maiúscula, minúscula, número e caractere especial.',
    '2':'em Estudos, digite “calc” e escolha a tag Cálculo II; busque “integrais” e abra o estudo. Depois busque “grafos ponderados” para cair no estado vazio e use “Pedir esse material”.',
    '3':'em Dúvidas & Feedback, veja as dúvidas parecidas, envie uma nova, abra a notificação de resposta e marque como útil. Com o Horário da barra em 23:10, a dúvida entra na fila antes de virar pedido.',
    '4':'como monitor, abra a enquete no painel da turma; em Aulões, encerre, escolha data e sala e confirme. Alternativos: “Simular empate” ou a data 22/09, que conflita com a prova.'
  };
  var DICAS_MOB = {
    '1':'toque no ♥ de um estudo (o app pede login), erre o e-mail de propósito (ex.: lorem@gmail.com) para ver a validação, corrija para @sga.exemplo.br e entre. Com uma senha diferente de 123456 aparece “E-mail ou senha incorretos”.',
    '2':'em Matérias › Estudos, busque “regra da cadeia” e abra o estudo. Depois busque “grafos ponderados” para cair no estado vazio e use “Pedir esse material”.',
    '3':'em Feedback › Turma veja as dúvidas frequentes; em Enviar confira “Já perguntaram parecido”, envie, simule a resposta do monitor e marque “Sim, resolveu” no chat. Com o Horário da barra em 23:10, a dúvida entra na fila antes de virar pedido.',
    '4':'como monitor, em Feedback › Turma abra a enquete; em Aulões encerre, escolha data e sala e confirme; confira em Calendário › Mês. Alternativos: “Simular empate” ou a data 22/09, que conflita com a prova.'
  };

  var CONVERSAS = [
    {id:'monitor', nome:'Ipsum · monitor AEDS2', sub:'', tipo:'pessoa', nao:0},
    {id:'aeds2',   nome:'AEDS2 · turma 04', sub:'# complexidade', tipo:'sala', nao:0},
    {id:'calc2',   nome:'CALC2 · turma 02', sub:'# integrais', tipo:'sala', nao:0}
  ];

  /* ======================================================================
     3. estado
     ====================================================================== */
  var S = {
    cargo:'visitante', tela:'inicio', tarefa:'1',
    busca:'', tags:[], sugIdx:0, sugFechada:false,
    aba:{msg:'conversas', duv:'turma'},
    naoLidasMsg:0, naoLidasNotif:0,
    pedidoEnviado:false, respostaChegou:false, votou:false, enqueteAberta:false, aulaoMarcado:false,
    assuntoPre:'', erroLogin:'',
    abaEntrar:'entrar', celular:false, convAberta:null,
    configSec:'Integrações', feedSalvo:false, estudoAberto:1,
    email:'', erroGeral:'', motivoLogin:'', favoritos:{}, foraHorario:false, naFila:false,
    etapaAulao:null, temaAulao:'Complexidade na prática', dataAulao:'18', conflito:false, desempate:false,
    notif:{'Respostas às minhas dúvidas':true,'Mensagens de monitores':true,'Enquetes e aulões da minha turma':true,'Novos estudos nas minhas disciplinas':false},
    // criar conta
    nomeNovo:'', senhaNova:'', senhaConf:'', mostrarSenha:false, erroConf:'',
    // aviso curto no topo da tela (ex.: "Regra salva")
    flash:'',
    // matérias do aluno
    vinculos:CANVAS_CURSOS.map(function(id){ return {turma:id, origem:'canvas', status:'ativo'}; }),
    turmaAberta:'aeds2-04', calcAberta:false, estimativas:{}, buscaTurma:'',
    // integrações
    canvas:{conectado:true, etapa:null, token:'', consent:false, erro:'', escolhidos:{}, sync:'hoje, 08:12'},
    tema:'claro',
    // publicar
    envios:[], publicados:[],
    // pessoas e cargos
    pessoasTurma:null, buscaPessoa:'', csv:{texto:'', papel:'monitor', previa:null}, historico:[
      {quando:'12/09 19:40', quem:PROF_EU, txt:'tornou Ipsum Dolor monitor em AEDS2 · turma 04', como:'página'}
    ],
    // relatórios
    relSigla:null, turmaProf:null, regraRascunho:null
  };

  function ir(tela){ S.tela = tela; S.flash = ''; desenhar(); window.scrollTo({top:0, behavior:'smooth'}); }
  function logado(){ return S.cargo !== 'visitante'; }
  // quem publica estudos e abre enquetes
  function equipe(){ return S.cargo === 'monitor' || S.cargo === 'professor' || S.cargo === 'admin'; }
  // quem vê relatórios e muda cargos
  function docente(){ return S.cargo === 'professor' || S.cargo === 'admin'; }
  function turmasDoDocente(){ return TURMAS.filter(function(t){ return S.cargo === 'admin' || t.prof === PROF_EU; }); }

  /* ======================================================================
     4. cabeçalho e tema
     ====================================================================== */
  function aplicarTema(pref){
    S.tema = pref;
    var escuro = pref === 'escuro' || (pref === 'sistema' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-tema', escuro ? 'escuro' : 'claro');
    try { localStorage.setItem('hub-tema', pref); } catch (e) {}
    var b = el('tema');
    if (b){ b.textContent = escuro ? 'Tema claro' : 'Tema escuro'; b.setAttribute('aria-pressed', escuro ? 'true' : 'false'); }
  }

  function desenharNav(){
    var n = [];
    n.push(botaoNav('Início', 'inicio'));
    n.push(botaoNav('Estudos', 'estudos'));
    if (logado()){
      n.push(botaoNav('Calendário', 'calendario'));
      n.push(botaoNav('Dúvidas &amp; Feedback', 'duvidas'));
      if (equipe()) n.push(botaoNav('Publicar', 'publicar'));
      if (docente()) n.push(botaoNav('Relatórios', 'relatorios'));
      n.push('<button data-ir="mensagens" class="' + (S.tela === 'mensagens' ? 'on' : '') + '">Mensagens' + (S.naoLidasMsg ? '<span class="contagem">' + S.naoLidasMsg + '</span>' : '') + '</button>');
      n.push('<button data-menu="notif">Notificações' + (S.naoLidasNotif ? '<span class="contagem">' + S.naoLidasNotif + '</span>' : '') + '</button>');
      n.push('<button class="avatar" data-menu="perfil" aria-label="Menu do perfil"></button>');
    } else {
      n.push('<button class="btn btn-cheio" data-ir="entrar">Entrar</button>');
    }
    // no celular as palavras viram ícones com badge; ✉ e 🔔 nunca entram no ☰
    var m = [];
    if (logado()){
      m.push('<button class="icone" data-ir="mensagens" aria-label="Mensagens">✉' + (S.naoLidasMsg ? '<span class="badge">' + S.naoLidasMsg + '</span>' : '') + '</button>');
      m.push('<button class="icone" data-menu="notif" aria-label="Notificações">🔔' + (S.naoLidasNotif ? '<span class="badge">' + S.naoLidasNotif + '</span>' : '') + '</button>');
      m.push('<button class="icone" data-menu="ham" aria-label="Menu">☰</button>');
    } else {
      m.push('<button class="btn btn-cheio" data-ir="entrar">Entrar</button>');
    }
    el('nav').innerHTML = '<span class="nav-desk linha">' + n.join('') + '</span><span class="nav-mob">' + m.join('') + '</span>';
  }
  var GRUPO_NAV = {materia:'inicio', minhas:'inicio', relMateria:'relatorios', turma:'relatorios', estudo:'estudos'};
  function botaoNav(rot, tela){
    var ativo = S.tela === tela || GRUPO_NAV[S.tela] === tela || (tela === 'inicio' && S.tela === 'estudos' && !logado() && false);
    return '<button data-ir="' + tela + '" class="' + (ativo ? 'on' : '') + '">' + rot + '</button>';
  }

  // peças pequenas reutilizadas
  function voltar(rot, tela){ return '<button class="btn btn-peq" data-ir="' + tela + '">← ' + rot + '</button>'; }
  function flash(){
    if (!S.flash) return '';
    var desfazer = S.desfazer && S.desfazer.msg === S.flash ? ' <button class="btn btn-peq" data-acao="desfazer">Desfazer</button>' : '';
    return '<p class="flash" role="status">' + esc(S.flash) + desfazer + '</p>';
  }
  function semPermissao(txt){
    return '<div class="caixa-trac centro"><b>' + txt + '</b><p class="sub">Seu cargo atual é <b>' + S.cargo + '</b>. Troque o cargo na barra de teste para ver esta página.</p>' +
      '<p class="bloco-p"><button class="btn btn-cheio" data-ir="inicio">Voltar ao início</button></p></div>';
  }
  function corMat(sigla){ var m = materia(sigla); return 'cor-' + (m ? m.cor : 1); }

  /* ======================================================================
     5. telas do aluno
     ====================================================================== */
  var telas = {};

  telas.inicio = function(){
    if (!logado()) return catalogo('Resumos e ferramentas de estudo, num lugar só', 'Materiais de alunos, monitores e professores do curso de CC.');
    return hubAluno();
  };

  // --- números de uma turma para o aluno simulado ---
  function avaliacoesDe(t){
    var d = NOTAS_EU[t.id] || {notas:{}};
    if (t.regra){
      // as notas lançadas casam com a regra pelo nome da avaliação
      var notas = {};
      Object.keys(d.notas || {}).forEach(function(k){ notas[norm(k)] = d.notas[k]; });
      (d.lancadas || []).forEach(function(a){ notas[norm(a.nome)] = a.obtido; });
      return t.regra.avaliacoes.map(function(a){
        var ob = notas[norm(a.nome)] !== undefined ? notas[norm(a.nome)] : null;
        return {nome:a.nome, valor:a.valor, obtido:ob};
      });
    }
    // sem regra cadastrada: notas do Canvas + o restante estimado para fechar 100
    var l = (d.lancadas || []).map(function(a){ return {nome:a.nome, valor:a.valor, obtido:a.obtido}; });
    var resto = 100 - soma(l, function(a){ return a.valor; });
    if (resto > 0) l.push({nome:'Restante do semestre', valor:resto, obtido:null, generico:true});
    return l;
  }
  function resumoTurma(t){
    var av = avaliacoesDe(t), d = NOTAS_EU[t.id] || {aulas:0, faltas:0, pendentes:[]};
    var lanc = av.filter(function(a){ return a.obtido !== null; });
    var obtido = soma(lanc, function(a){ return a.obtido; }), avaliado = soma(lanc, function(a){ return a.valor; });
    var total = soma(av, function(a){ return a.valor; });
    var freqMin = t.regra ? t.regra.frequencia : 75;
    var limite = Math.floor(d.aulas * (1 - freqMin / 100));
    return {av:av, obtido:obtido, avaliado:avaliado, total:total, aprov:t.regra ? t.regra.aprovacao : 60, freqMin:freqMin,
            aproveitamento:avaliado ? obtido / avaliado * 100 : null, aulas:d.aulas, faltas:d.faltas, limite:limite, pendentes:d.pendentes || []};
  }
  function minhasTurmas(){
    return S.vinculos.filter(function(v){ return v.status === 'ativo'; }).map(function(v){ return turma(v.turma); });
  }

  function hubAluno(){
    var ts = minhasTurmas();
    var h = flash() + '<div class="linha entre"><div><h1>Olá, Lorem</h1><p class="sub">2026/2 · ' + ts.length + ' matérias · passe o mouse numa matéria para ver o que tem nela</p></div>' +
      '<button class="btn btn-peq" data-ir="minhas">Gerenciar matérias</button></div>';

    if (!ts.length){
      h += '<div class="caixa-trac centro bloco"><b>Nenhuma matéria por aqui ainda.</b>' +
        '<p class="sub">Conecte o Canvas para suas matérias aparecerem sozinhas, ou adicione uma turma manualmente.</p>' +
        '<p class="bloco-p"><button class="btn btn-cheio" data-acao="ir-integracoes">Conectar o Canvas</button> <button class="btn" data-ir="minhas">Adicionar turma</button></p></div>';
    } else {
      h += '<div class="janelas bloco">' + ts.map(janelaMateria).join('') + '</div>';
    }

    // painel de baixo: desempenho do semestre + próximas entregas
    var pend = [];
    ts.forEach(function(t){ resumoTurma(t).pendentes.forEach(function(p){ pend.push({sigla:t.sigla, txt:p, turma:t.id}); }); });
    h += '<div class="hub-baixo bloco-g">' +
      '<section class="caixa"><div class="linha entre"><h3>Desempenho do semestre</h3><span class="txt-xp apagado">aproveitamento acumulado · meta 60%</span></div>' +
      graficoSemestre(SEMESTRE_EU) +
      '<div class="kpis">' + kpi('Aproveitamento', SEMESTRE_EU[SEMESTRE_EU.length - 1] + '%', '+2 pts em 2 semanas') +
        kpi('Entregas no prazo', '34/41', '83%') + kpi('Frequência média', '89%', 'TI2 perto do limite') + '</div></section>' +
      '<section class="caixa"><h3>Próximas entregas</h3>' + (pend.length ? '<div class="lista bloco-xp">' + pend.slice(0, 5).map(function(p){
        return '<button data-turma="' + p.turma + '"><span class="ponto ' + corMat(p.sigla) + ' ponto-mat"></span><span class="cresce txt-p">' + esc(p.txt) + '</span><span class="chip">' + p.sigla + '</span></button>';
      }).join('') + '</div>' : '<p class="sub">Nada pendente.</p>') + '</section></div>';
    return h;
  }
  function kpi(rot, val, sub){ return '<div class="kpi"><span class="txt-xp fraco">' + rot + '</span><b class="kpi__valor">' + val + '</b><span class="txt-xp apagado">' + sub + '</span></div>'; }

  function janelaMateria(t){
    var m = materia(t.sigla), r = resumoTurma(t);
    var conteudos = ESTUDOS.filter(function(e){ return e.sigla === t.sigla; }).map(function(e){ return {tipo:'Estudo', titulo:e.titulo, estudo:e.id}; })
      .concat(CONTEUDOS[t.sigla] || []);
    var pctObt = r.total ? r.obtido / r.total * 100 : 0, pctAval = r.total ? (r.avaliado - r.obtido) / r.total * 100 : 0;
    return '<article class="janela ' + corMat(t.sigla) + '" data-turma="' + t.id + '">' +
      '<button class="janela__titulo" data-turma="' + t.id + '"><span class="janela__sigla">' + t.sigla + '</span><span class="janela__nome">' + m.nome + '</span></button>' +
      '<div class="janela__nota"><b class="janela__num">' + (r.avaliado ? num(r.obtido) : '—') + '</b><span class="janela__de">' +
        (r.avaliado ? 'de ' + num(r.avaliado) + ' avaliados' : 'sem notas lançadas') + '</span></div>' +
      '<div class="barra-pts" title="obtidos · perdidos · ainda não avaliados"><span class="barra-pts__obtido" style="width:' + pctObt + '%"></span><span class="barra-pts__perdido" style="width:' + pctAval + '%"></span></div>' +
      '<div class="janela__rodape"><span>' + r.pendentes.length + ' pendente' + (r.pendentes.length === 1 ? '' : 's') + '</span><span>' + num(r.total) + ' pts no semestre</span></div>' +
      '<div class="previa"><p class="previa__rot">Nesta matéria</p><ul>' + conteudos.slice(0, 4).map(function(c){
        return '<li><button ' + (c.estudo ? 'data-estudo="' + c.estudo + '"' : 'data-turma="' + t.id + '"') + '><span class="tipo-conteudo">' + c.tipo + '</span><span class="cresce">' + esc(c.titulo) + '</span></button></li>';
      }).join('') + '</ul><button class="previa__mais" data-turma="' + t.id + '">Ver matéria completa →</button></div>' +
      '</article>';
  }

  function graficoSemestre(vals){
    // eixo de 40% a 100%: a variação fica visível e a meta de 60% aparece como faixa
    var w = 600, h = 150, n = vals.length, pts = [], min = 40;
    var y = function(v){ return h - 6 - (v - min) / (100 - min) * (h - 12); };
    vals.forEach(function(v, i){ if (i) pts.push([ (i - 1) / (n - 2) * w, y(v) ]); });
    var linha = pts.map(function(p, i){ return (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ');
    var metaY = y(60);
    return '<div class="graf-semestre"><svg viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" role="img" aria-label="Aproveitamento por semana, de 71% a 76%">' +
      '<path d="' + linha + ' L' + w + ',' + h + ' L0,' + h + ' Z" class="g-area"/>' +
      '<rect x="0" y="' + metaY + '" width="' + w + '" height="' + (h - metaY) + '" class="g-zona"/>' +
      '<line x1="0" x2="' + w + '" y1="' + metaY + '" y2="' + metaY + '" class="g-meta"/>' +
      '<path d="' + linha + '" class="g-traco"/></svg>' +
      '<div class="graf-semestre__eixo"><span>sem 1</span><span>sem 5</span><span>sem 10</span></div></div>';
  }

  // --- página da matéria, com calculadora de média ---
  telas.materia = function(){
    var t = turma(S.turmaAberta), m = materia(t.sigla), r = resumoTurma(t);
    var vinc = S.vinculos.filter(function(v){ return v.turma === t.id; })[0];
    var restantesFalta = r.limite - r.faltas;
    var h = '<div class="pag-materia' + (S.calcAberta ? ' calc-aberta' : '') + '" id="pag-materia">' +
      voltar('Início', 'inicio') +
      '<div class="mat-cabeca ' + corMat(t.sigla) + ' bloco"><h1>' + m.nome + '</h1>' +
      '<p class="sub">' + nomeTurma(t) + ' · ' + t.turno + ' · ' + t.prof + (vinc ? ' · veio do ' + (vinc.origem === 'canvas' ? 'Canvas' : 'cadastro manual') : '') + '</p></div>' +
      '<div class="resumo-num bloco">' +
        kpi('Pontos obtidos', r.avaliado ? num(r.obtido) : '—', 'de ' + num(r.avaliado) + ' já avaliados') +
        kpi('Distribuídos', num(r.avaliado) + ' de ' + num(r.total), 'pontos do semestre') +
        kpi('Aproveitamento', r.aproveitamento === null ? '—' : Math.round(r.aproveitamento) + '%', 'aprovação com ' + r.aprov) +
        kpi('Frequência', r.aulas ? Math.round((1 - r.faltas / r.aulas) * 100) + '%' : '—', r.faltas + ' falta' + (r.faltas === 1 ? '' : 's') + ' · mínimo ' + r.freqMin + '%') +
      '</div>' +
      '<button class="calc-gatilho bloco" data-acao="calc" aria-expanded="' + S.calcAberta + '" aria-controls="calc">' +
        '<span class="calc-gatilho__icone" aria-hidden="true">±</span> Calculador de média <span class="calc-gatilho__seta" aria-hidden="true">▸</span></button>' +
      '<section class="calc" id="calc" aria-label="Calculador de média"><div class="calc__dentro">' + calculadora(t, r) + '</div></section>' +
      '<div class="mat-secoes bloco">' +
        secaoMat('Pendentes · ' + r.pendentes.length, r.pendentes.length ? '<ul class="lista-simples">' + r.pendentes.map(function(p){ return '<li>' + esc(p) + '</li>'; }).join('') + '</ul>' : '<p class="sub">Nada pendente nesta matéria.</p>') +
        secaoMat('Frequência', frequencia(r, restantesFalta)) +
        secaoMat('Notas lançadas · ' + r.av.filter(function(a){ return a.obtido !== null; }).length, r.av.filter(function(a){ return a.obtido !== null; }).map(function(a){
          return '<div class="linha entre pad-y div-b-fina"><span>' + esc(a.nome) + '</span><b class="mono">' + num(a.obtido) + ' / ' + num(a.valor) + '</b></div>';
        }).join('') || '<p class="sub">Nenhuma nota lançada ainda.</p>') +
        secaoMat('Conteúdos', '<ul class="lista-simples">' + ESTUDOS.filter(function(e){ return e.sigla === t.sigla; }).map(function(e){ return '<li><button class="link" data-estudo="' + e.id + '">' + esc(e.titulo) + '</button> <span class="tipo-conteudo">Estudo</span></li>'; })
          .concat((CONTEUDOS[t.sigla] || []).map(function(c){ return '<li>' + esc(c.titulo) + ' <span class="tipo-conteudo">' + c.tipo + '</span></li>'; })).join('') + '</ul>') +
      '</div></div>';
    return h;
  };
  function secaoMat(tit, corpo){ return '<section class="secao-mat caixa"><h3>' + tit + '</h3><div class="secao-mat__corpo"><div class="secao-mat__dentro">' + corpo + '</div></div></section>'; }

  function frequencia(r, restantes){
    if (!r.aulas) return '<p class="sub">Sem aulas registradas.</p>';
    var pct = Math.min(100, r.faltas / r.aulas * 100), limPct = r.limite / r.aulas * 100;
    return '<p class="txt-p">' + r.faltas + ' falta' + (r.faltas === 1 ? '' : 's') + ' em ' + r.aulas + ' aulas · limite de ' + r.limite + '</p>' +
      '<div class="freq-barra"><span class="freq-barra__faltas" style="width:' + pct + '%"></span><span class="freq-barra__limite" style="left:' + limPct + '%"></span></div>' +
      (restantes <= 0 ? '<div class="aviso">Você passou do limite de faltas. A reprovação por frequência independe da nota.</div>'
        : restantes <= 2 ? '<div class="aviso">Atenção: você só pode faltar mais ' + restantes + ' aula' + (restantes === 1 ? '' : 's') + '.</div>'
        : '<p class="sub">Você ainda pode faltar ' + restantes + ' aulas.</p>');
  }

  function calculadora(t, r){
    var est = S.estimativas[t.id] || {};
    var regraTxt = t.regra
      ? '<p class="sub">Regra da turma cadastrada por <b>' + t.prof + '</b>: ' + num(r.total) + ' pts · aprovação com ' + r.aprov + ' · frequência mínima ' + r.freqMin + '%.</p>'
      : '<div class="aviso">O professor ainda não cadastrou a regra desta turma. A estimativa usa o padrão da PUC: 100 pts e aprovação com 60.</div>';
    return regraTxt +
      '<p class="sub">É uma aproximação: coloque a nota que você espera tirar em cada avaliação que ainda vai acontecer.</p>' +
      '<table class="calc-tabela"><thead><tr><th>Avaliação</th><th>Vale</th><th>Sua nota</th></tr></thead><tbody>' +
      r.av.map(function(a, i){
        var campo = a.obtido !== null
          ? '<span class="mono">' + num(a.obtido) + '</span> <span class="txt-xp apagado">lançada</span>'
          : '<input class="campo calc-input" type="number" inputmode="decimal" min="0" max="' + a.valor + '" step="0.5" data-aval="' + esc(a.nome) + '" value="' + (est[a.nome] !== undefined ? est[a.nome] : '') + '" placeholder="?" aria-label="Nota estimada em ' + esc(a.nome) + '">';
        return '<tr' + (a.obtido !== null ? ' class="lancada"' : '') + '><td>' + esc(a.nome) + (a.generico ? ' <span class="txt-xp apagado">(estimado)</span>' : '') + '</td><td class="mono">' + num(a.valor) + '</td><td>' + campo + '</td></tr>';
      }).join('') + '</tbody></table>' +
      '<p class="linha bloco-p"><button class="btn btn-peq" data-acao="calc-preencher">Preencher com meu aproveitamento atual' + (r.aproveitamento !== null ? ' (' + Math.round(r.aproveitamento) + '%)' : '') + '</button>' +
      '<button class="btn btn-peq" data-acao="calc-limpar">Limpar estimativas</button></p>' +
      '<div id="calc-resultado" aria-live="polite">' + resultadoCalc(t, r) + '</div>';
  }
  function resultadoCalc(t, r){
    var est = S.estimativas[t.id] || {};
    var futuras = r.av.filter(function(a){ return a.obtido === null; });
    var estimado = 0, valorEstimado = 0;
    futuras.forEach(function(a){
      var v = parseFloat(est[a.nome]);
      if (!isNaN(v)){ estimado += Math.max(0, Math.min(a.valor, v)); valorEstimado += a.valor; }
    });
    var emAberto = soma(futuras, function(a){ return a.valor; });
    var semEstimativa = emAberto - valorEstimado;
    var projetado = r.obtido + estimado;
    var perdido = (r.avaliado - r.obtido) + (valorEstimado - estimado);
    var w = function(v){ return (r.total ? v / r.total * 100 : 0).toFixed(2) + '%'; };
    var msg;
    if (projetado >= r.aprov) msg = '<p class="calc-msg ok">Com essas notas você fecha com <b>' + num(projetado) + '</b> de ' + num(r.total) + ': aprovado por nota.</p>';
    else if (r.aprov - projetado <= semEstimativa) msg = '<p class="calc-msg">Faltam <b>' + num(r.aprov - projetado) + ' pts</b> para ' + r.aprov + '. Ainda restam ' + num(semEstimativa) + ' pts sem estimativa.</p>';
    else msg = '<p class="calc-msg ruim">Mesmo tirando tudo o que resta, você fecharia com <b>' + num(projetado + semEstimativa) + '</b>. Faltam ' + num(r.aprov - projetado - semEstimativa) + ' pts para ' + r.aprov + '.</p>';
    var avisoFreq = r.faltas > r.limite ? '<p class="calc-msg ruim">Atenção: você já passou do limite de faltas.</p>' : '';
    return '<div class="barra-calc" role="img" aria-label="' + num(r.obtido) + ' obtidos, ' + num(estimado) + ' estimados, total ' + num(r.total) + '">' +
        '<span class="barra-calc__obtido" style="width:' + w(r.obtido) + '"></span><span class="barra-calc__estimado" style="width:' + w(estimado) + '"></span>' +
        '<span class="barra-calc__perdido" style="width:' + w(perdido) + '"></span><span class="barra-calc__meta" style="left:' + w(r.aprov) + '"><span>meta ' + r.aprov + '</span></span></div>' +
      '<div class="calc-legenda">' +
        '<span><i class="leg leg-obtido"></i>Obtidos <b>' + num(r.obtido) + '</b></span>' +
        '<span><i class="leg leg-estimado"></i>Estimados <b>' + num(estimado) + '</b></span>' +
        '<span><i class="leg leg-perdido"></i>Perdidos <b>' + num(perdido) + '</b></span>' +
        '<span><i class="leg leg-aberto"></i>Sem estimativa <b>' + num(semEstimativa) + '</b></span></div>' +
      msg + avisoFreq;
  }
  function atualizarCalc(){
    var t = turma(S.turmaAberta), alvo = el('calc-resultado');
    if (t && alvo) alvo.innerHTML = resultadoCalc(t, resumoTurma(t));
  }

  // --- minhas matérias: vínculos do Canvas e manuais ---
  telas.minhas = function(){
    var linhas = S.vinculos.map(function(v){
      var t = turma(v.turma), m = materia(t.sigla);
      return '<div class="vinculo ' + corMat(t.sigla) + '"><div class="cresce"><b>' + m.nome + '</b><div class="txt-xp fraco">' + nomeTurma(t) + ' · ' + t.turno + ' · ' + t.prof + '</div></div>' +
        '<span class="chip">' + (v.origem === 'canvas' ? 'Canvas' : 'manual') + '</span>' +
        (v.status === 'pendente' ? '<span class="chip chip-alerta">aguardando o professor</span><button class="btn btn-peq" data-acao="simular-aprovacao" data-v="' + t.id + '">Simular aprovação</button>' : '') +
        (v.origem === 'manual' ? '<button class="btn btn-peq btn-perigo" data-acao="sair-turma" data-v="' + t.id + '">Remover</button>' : '<span class="txt-xp apagado">sai ao desconectar o Canvas</span>') + '</div>';
    }).join('');
    var termo = norm(S.buscaTurma.trim());
    var ja = S.vinculos.map(function(v){ return v.turma; });
    var achadas = termo.length < 2 ? [] : TURMAS.filter(function(t){
      if (ja.indexOf(t.id) >= 0) return false;
      var m = materia(t.sigla);
      return norm(t.sigla + ' ' + m.nome + ' ' + m.apelidos.join(' ') + ' ' + t.prof + ' ' + t.turma).indexOf(termo) >= 0;
    });
    return flash() + voltar('Início', 'inicio') + '<h1 class="bloco">Minhas matérias</h1>' +
      '<p class="sub">As matérias do Canvas entram sozinhas. Aqui você adiciona turmas que não estão lá, e o professor da turma aprova.</p>' +
      '<div class="bloco">' + (linhas || '<div class="caixa-trac centro">Nenhuma matéria vinculada. <button class="btn btn-peq" data-acao="ir-integracoes">Conectar o Canvas</button></div>') + '</div>' +
      '<h2 class="bloco-g">Adicionar turma</h2>' +
      '<p class="rotulo">Busque pela matéria, sigla ou professor (ex.: calc, aeds 3)</p>' +
      '<input class="campo med-form" id="busca-turma" value="' + esc(S.buscaTurma) + '" placeholder="Buscar turma…" autocomplete="off">' +
      (termo.length < 2 ? '' : achadas.length ? '<div class="bloco-p">' + achadas.map(function(t){
        var m = materia(t.sigla);
        return '<div class="vinculo ' + corMat(t.sigla) + '"><div class="cresce"><b>' + m.nome + '</b><div class="txt-xp fraco">' + nomeTurma(t) + ' · ' + t.turno + ' · ' + t.prof + '</div></div>' +
          '<button class="btn btn-cheio btn-peq" data-acao="pedir-turma" data-v="' + t.id + '">Pedir entrada</button></div>';
      }).join('') + '</div>' : '<p class="sub">Nenhuma turma encontrada para “' + esc(S.buscaTurma) + '”.</p>');
  };

  /* ======================================================================
     6. telas de conteúdo
     ====================================================================== */
  telas.estudos = function(){ return catalogo('Estudos', 'Busque por assunto ou digite o começo de uma matéria para filtrar por ela.'); };

  function sugestoes(){
    if (S.sugFechada) return [];
    var partes = S.busca.split(/\s+/), t = norm(partes[partes.length - 1] || '');
    if (t.length < 2) return [];
    return MATERIAS.filter(function(m){
      if (S.tags.indexOf(m.sigla) >= 0) return false;
      if (norm(m.sigla).indexOf(t) === 0) return true;
      if (m.apelidos.some(function(a){ return norm(a).indexOf(t) === 0; })) return true;
      return norm(m.nome).split(/\s+/).some(function(p){ return p.length > 2 && p.indexOf(t) === 0; });
    }).slice(0, 6);
  }
  function estudosFiltrados(){
    var termos = norm(S.busca.trim()).split(/\s+/).filter(Boolean);
    return ESTUDOS.filter(function(e){
      if (S.tags.length && S.tags.indexOf(e.sigla) < 0) return false;
      var m = materia(e.sigla), txt = norm(e.titulo + ' ' + e.sigla + ' ' + e.chaves + ' ' + (m ? m.nome + ' ' + m.apelidos.join(' ') : ''));
      return termos.every(function(p){ return txt.indexOf(p) >= 0; });
    });
  }
  function catalogo(tit, sub){
    var lista = estudosFiltrados(), sug = sugestoes();
    if (S.sugIdx >= sug.length) S.sugIdx = 0;
    var h = '<h1>' + tit + '</h1><p class="sub">' + sub + '</p>' +
      '<div class="linha bloco"><div class="busca-tags cresce' + (sug.length ? ' aberta' : '') + '">' +
        S.tags.map(function(s){ return '<span class="tag-pill ' + corMat(s) + '">' + materia(s).nome + '<button data-tirar-tag="' + s + '" aria-label="Remover filtro ' + materia(s).nome + '">×</button></span>'; }).join('') +
        '<input class="busca-tags__campo" id="busca" role="combobox" aria-autocomplete="list" aria-expanded="' + (sug.length > 0) + '" aria-controls="sugestoes" autocomplete="off" placeholder="' + (S.tags.length ? 'Buscar dentro das matérias escolhidas…' : 'Buscar estudo ou digite uma matéria (ex.: calc)…') + '" value="' + esc(S.busca) + '">' +
        (sug.length ? '<ul class="sugestoes" id="sugestoes" role="listbox">' + sug.map(function(m, i){
          return '<li role="option" aria-selected="' + (i === S.sugIdx) + '"><button class="sug' + (i === S.sugIdx ? ' on' : '') + '" data-add-tag="' + m.sigla + '"><span class="ponto ponto-mat ' + corMat(m.sigla) + '"></span>' + m.nome + '<span class="mono txt-xp apagado">' + m.sigla + '</span></button></li>';
        }).join('') + '<li class="sugestoes__dica txt-xp apagado">Enter escolhe · ↑↓ navega · Esc fecha</li></ul>' : '') +
      '</div><span class="txt-p"><b>' + lista.length + '</b> estudo(s)</span></div>' +
      '<div class="chips"><button class="chip' + (S.tags.length ? '' : ' on') + '" data-limpar-tags="1">todas</button>' + ATALHOS.map(function(s){
        return '<button class="chip' + (S.tags.indexOf(s) >= 0 ? ' on' : '') + '" data-tag-atalho="' + s + '">' + s + '</button>';
      }).join('') + '</div>';

    if (!lista.length){
      h += '<div class="caixa-trac centro bloco">' +
        '<b>Nenhum estudo encontrado' + (S.busca.trim() ? ' para “' + esc(S.busca) + '”' : ' com esse filtro') + '.</b>' +
        '<p class="sub esp-y">Tente outra palavra, remova o filtro de matéria, ou peça o material à monitoria.</p>' +
        '<button class="btn" data-acao="limpar">Limpar busca</button> ' +
        '<button class="btn btn-cheio" data-acao="pedir-material">Pedir esse material</button></div>';
    } else {
      h += '<div class="grade">' + lista.map(function(e){
        return '<button class="card" data-estudo="' + e.id + '">' +
          '<span class="linha entre"><span class="chip">' + e.sigla + '</span><span class="txt-xp fav" data-fav="' + e.id + '" role="button" aria-label="Favoritar">' + (S.favoritos[e.id] ? '♥ ' + (e.fav + 1) : '♡ ' + e.fav) + '</span></span>' +
          '<b>' + esc(e.titulo) + '</b><div class="fantasma"></div><div class="fantasma medio"></div>' +
          '<span class="rodape"><span>' + esc(e.autor) + '</span><span>' + e.com + ' coment. · abrir →</span></span></button>';
      }).join('') + '</div>';
    }
    return h;
  }

  telas.entrar = function(){
    var h = '<h1>Entrar</h1><p class="sub">Use o e-mail institucional. Quem ainda não tem conta cria uma na aba ao lado.</p>' +
      (S.motivoLogin ? '<div class="aviso">' + esc(S.motivoLogin) + '</div>' : '') +
      '<div class="abas"><button data-abaentrar="entrar" class="' + (S.abaEntrar === 'entrar' ? 'on' : '') + '">Entrar</button>' +
      '<button data-abaentrar="criar" class="' + (S.abaEntrar === 'criar' ? 'on' : '') + '">Criar conta</button></div><div class="med-form">';

    if (S.abaEntrar === 'criar'){
      var tipo = S.mostrarSenha ? 'text' : 'password';
      h += '<p class="rotulo sem-topo">Nome</p><input class="campo" id="nome-novo" value="' + esc(S.nomeNovo) + '" placeholder="Seu nome" autocomplete="name">' +
        '<p class="rotulo">E-mail institucional</p><input class="campo ' + (S.erroLogin ? 'erro' : '') + '" id="email" value="' + esc(S.email) + '" placeholder="nome@sga.exemplo.br" autocomplete="username">' +
        (S.erroLogin ? '<p class="msg-erro">' + esc(S.erroLogin) + '</p>' : '') +
        '<p class="rotulo">Senha</p><div class="campo-senha"><input class="campo" id="senha-nova" type="' + tipo + '" value="' + esc(S.senhaNova) + '" autocomplete="new-password" aria-describedby="regras-senha">' +
        '<button class="btn btn-peq" data-acao="mostrar-senha" aria-pressed="' + S.mostrarSenha + '">' + (S.mostrarSenha ? 'Ocultar' : 'Mostrar') + '</button></div>' +
        '<ul class="regras-senha" id="regras-senha" aria-live="polite">' + regrasSenha(S.senhaNova) + '</ul>' +
        '<p class="rotulo">Confirmar senha</p><input class="campo ' + (S.erroConf ? 'erro' : '') + '" id="senha-conf" type="' + tipo + '" value="' + esc(S.senhaConf) + '" autocomplete="new-password">' +
        '<p class="msg-conf" id="msg-conf">' + msgConf() + '</p>' +
        '<div class="info bloco-p">Toda conta começa como <b>aluno</b>. Monitor e professor são definidos pelo professor da turma ou pela coordenação.</div>' +
        (S.erroGeral ? '<p class="msg-erro bloco-p">' + esc(S.erroGeral) + '</p>' : '') +
        '<p class="bloco"><button class="btn btn-cheio" data-acao="login">Criar conta e entrar</button></p>';
    } else {
      h += '<p class="rotulo sem-topo">E-mail</p><input class="campo ' + (S.erroLogin ? 'erro' : '') + '" id="email" value="' + esc(S.email) + '" placeholder="nome@sga.exemplo.br">' +
        (S.erroLogin ? '<p class="msg-erro">' + esc(S.erroLogin) + '</p>' : '') +
        '<p class="rotulo">Senha</p><input class="campo" id="senha" type="password" value="123456">' +
        (S.erroGeral ? '<p class="msg-erro bloco-p">' + esc(S.erroGeral) + '</p>' : '') +
        '<p class="bloco"><button class="btn btn-cheio" data-acao="login">Entrar</button></p>';
    }
    return h + '</div>';
  };
  var REGRAS_SENHA = [
    ['Uma letra maiúscula', function(s){ return /\p{Lu}/u.test(s); }],
    ['Uma letra minúscula', function(s){ return /\p{Ll}/u.test(s); }],
    ['Um número', function(s){ return /\d/.test(s); }],
    ['Um caractere especial (# % ! @ …)', function(s){ return /[^\p{L}\d\s]/u.test(s); }]
  ];
  function regrasSenha(s){
    return REGRAS_SENHA.map(function(r){ var ok = r[1](s); return '<li class="' + (ok ? 'ok' : '') + '"><span aria-hidden="true">' + (ok ? '✓' : '○') + '</span> ' + r[0] + '<span class="sr"> ' + (ok ? 'atendida' : 'pendente') + '</span></li>'; }).join('');
  }
  function msgConf(){
    if (S.erroConf) return '<span class="msg-erro">' + esc(S.erroConf) + '</span>';
    if (!S.senhaConf) return '';
    return S.senhaConf === S.senhaNova ? '<span class="ok-txt">✓ As senhas coincidem</span>' : '<span class="apagado">As senhas ainda não coincidem</span>';
  }

  telas.estudo = function(){
    var e = ESTUDOS[S.estudoAberto] || ESTUDOS[1];
    var acoes = '<span class="chip">' + e.sigla + '</span><span class="chip">revisado</span><span class="chip">♥ ' + e.fav + '</span>' +
      '<button class="btn btn-peq">Estudando</button><button class="btn btn-peq">Concluído</button>';
    if (equipe()) acoes += '<button class="btn btn-peq">Marcar revisado</button><button class="btn btn-peq btn-perigo">Excluir</button>';
    return '<div class="linha entre div-b-solido pb">' +
      '<span class="linha"><button class="btn btn-peq" data-ir="' + (logado() ? 'estudos' : 'inicio') + '">← voltar</button><b class="txt-g">' + esc(e.titulo) + '</b></span>' +
      '<span class="linha">' + acoes + '</span></div>' +
      (equipe() ? '<p class="sub">“Marcar revisado” e “Excluir” só aparecem para monitor e professor.</p>' : '') +
      '<div class="caixa-trac vazio bloco">conteúdo do estudo (HTML ou PDF do Storage num visualizador)</div>' +
      '<h2 class="bloco">Comentários e dúvidas</h2>' +
      '<div class="caixa esp-y"><div class="linha"><b>Nome</b><span class="chip">monitor</span><span class="empurra txt-xp apagado">04 de set.</span></div><div class="fantasma medio"></div></div>' +
      '<p class="rotulo">Sua dúvida ou comentário</p><textarea class="campo" rows="2"></textarea>' +
      '<p class="bloco-p"><button class="btn btn-cheio">Enviar</button> ' +
      '<button class="btn" data-ir="duvidas">Levar para Dúvidas &amp; Feedback →</button></p>';
  };

  // --- publicar: um fluxo só, um cartão por arquivo ---
  var EXEMPLOS_ENVIO = [
    {arquivo:'guia-integrais-por-partes-calc2.pdf', tamanho:1200000},
    {arquivo:'aeds2_filas_e_pilhas.html', tamanho:84000},
    {arquivo:'anotacoes-da-aula.html', tamanho:56000},
    {arquivo:'resumo-final.docx', tamanho:230000}
  ];
  var contEnvio = 0;
  function novoEnvio(nome, tamanho){
    var ext = (nome.split('.').pop() || '').toLowerCase();
    var base = nome.replace(/\.[^.]+$/, '');
    var titulo = base.replace(/[-_]+/g, ' ').replace(/\b(calc|aeds|bd|diw|es|ti)\s?\d?\b/gi, '').replace(/\s+/g, ' ').trim();
    titulo = titulo.charAt(0).toUpperCase() + titulo.slice(1);
    return {id:++contEnvio, arquivo:nome, tamanho:tamanho, ext:ext, titulo:titulo, sigla:adivinharSigla(base), desc:''};
  }
  function adivinharSigla(txt){
    var t = norm(txt).replace(/[-_.]+/g, ' ');
    var exato = MATERIAS.filter(function(m){ return new RegExp('\\b' + norm(m.sigla) + '\\b').test(t.replace(/\s(\d)\b/g, '$1')); })[0];
    return exato ? exato.sigla : '';
  }
  function problemaEnvio(v){
    if (['html','htm','pdf'].indexOf(v.ext) < 0) return 'Formato não aceito: envie .html ou .pdf.';
    if (v.tamanho > 5 * 1024 * 1024) return 'Arquivo maior que 5 MB.';
    if (!v.titulo.trim()) return 'Falta o título.';
    if (!v.sigla) return 'Escolha a matéria.';
    return '';
  }
  function tamanhoTxt(b){ return b >= 1024 * 1024 ? num(b / 1024 / 1024, 1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB'; }

  telas.publicar = function(){
    if (!equipe()) return semPermissao('Só monitores e professores publicam estudos.');
    var prontos = S.envios.filter(function(v){ return !problemaEnvio(v); }).length;
    var h = flash() + '<h1>Publicar estudos</h1>' +
      '<p class="sub">Arraste um ou mais arquivos. Cada arquivo vira um cartão: confira o título e a matéria e publique. Os com problema ficam esperando você corrigir.</p>' +
      '<label class="dropzone bloco" id="dropzone"><input type="file" id="envio-arquivos" multiple accept=".html,.htm,.pdf" class="sr">' +
        '<b>Arraste os arquivos para cá</b><span class="sub">ou clique para escolher · .html ou .pdf · até 5 MB cada</span></label>' +
      '<p class="linha bloco-p"><button class="btn btn-peq" data-acao="envio-exemplo">Usar arquivos de exemplo</button>' +
        (S.envios.length ? '<button class="btn btn-peq" data-acao="envio-limpar">Remover todos</button>' : '') + '</p>';

    if (S.envios.length){
      h += '<div class="envios bloco">' + S.envios.map(cartaoEnvio).join('') + '</div>' +
        '<div class="linha bloco envios-rodape"><span class="txt-p" id="envio-contagem">' + contagemEnvio() + '</span>' +
        '<button class="btn btn-cheio empurra" data-acao="publicar-envios" id="btn-publicar"' + (prontos ? '' : ' disabled') + '>Publicar ' + prontos + ' pronto' + (prontos === 1 ? '' : 's') + '</button></div>';
    }
    if (S.publicados.length){
      h += '<h2 class="bloco-g">Publicados agora</h2><div class="lista bloco-xp">' + S.publicados.map(function(p){
        return '<button data-estudo="' + p.id + '"><span class="chip">' + p.sigla + '</span><span class="cresce">' + esc(p.titulo) + '</span><span class="txt-xp fraco">abrir →</span></button>';
      }).join('') + '</div><p class="sub">Eles já aparecem em Estudos para a turma.</p>';
    }
    return h;
  };
  function contagemEnvio(){
    var p = S.envios.filter(function(v){ return !problemaEnvio(v); }).length;
    return S.envios.length + ' arquivo' + (S.envios.length === 1 ? '' : 's') + ' · ' + p + ' pronto' + (p === 1 ? '' : 's') + ' · ' + (S.envios.length - p) + ' com problema';
  }
  function cartaoEnvio(v){
    var prob = problemaEnvio(v), aceito = ['html','htm','pdf'].indexOf(v.ext) >= 0;
    return '<div class="envio' + (prob ? ' envio--problema' : '') + '" id="envio-' + v.id + '">' +
      '<div class="linha entre"><span class="linha"><span class="tipo-conteudo">' + esc(v.ext.toUpperCase() || '?') + '</span><span class="mono txt-xp">' + esc(v.arquivo) + '</span></span>' +
        '<span class="txt-xp apagado">' + tamanhoTxt(v.tamanho) + '</span></div>' +
      (aceito ? '<p class="rotulo">Título</p><input class="campo" data-envio="' + v.id + '" data-envio-campo="titulo" value="' + esc(v.titulo) + '">' +
        '<p class="rotulo">Matéria</p><select class="campo" data-envio="' + v.id + '" data-envio-campo="sigla"><option value="">Escolha…</option>' +
          MATERIAS.map(function(m){ return '<option value="' + m.sigla + '"' + (m.sigla === v.sigla ? ' selected' : '') + '>' + m.sigla + ' · ' + m.nome + '</option>'; }).join('') + '</select>' +
        '<p class="rotulo">Descrição <span class="apagado">(opcional)</span></p><input class="campo" data-envio="' + v.id + '" data-envio-campo="desc" value="' + esc(v.desc) + '" placeholder="Em uma frase, o que a pessoa aprende">' : '') +
      '<p class="envio-status" id="envio-status-' + v.id + '">' + (prob ? '⚠ ' + prob : '✓ Pronto para publicar') + '</p>' +
      '<button class="btn btn-peq" data-acao="envio-remover" data-v="' + v.id + '">Remover</button></div>';
  }
  function atualizarEnvio(v){
    var prob = problemaEnvio(v), st = el('envio-status-' + v.id), card = el('envio-' + v.id), p = S.envios.filter(function(x){ return !problemaEnvio(x); }).length;
    if (st) st.textContent = prob ? '⚠ ' + prob : '✓ Pronto para publicar';
    if (card) card.classList.toggle('envio--problema', !!prob);
    if (el('envio-contagem')) el('envio-contagem').textContent = contagemEnvio();
    var b = el('btn-publicar');
    if (b){ b.disabled = !p; b.textContent = 'Publicar ' + p + ' pronto' + (p === 1 ? '' : 's'); }
  }
  function receberArquivos(lista){
    Array.prototype.forEach.call(lista, function(f){ S.envios.push(novoEnvio(f.name, f.size)); });
    desenhar();
  }

  /* ======================================================================
     7. telas da equipe
     ====================================================================== */
  // --- pessoas e cargos ---
  telas.pessoas = function(){
    if (!docente()) return semPermissao('Só professores e a coordenação mudam cargos.');
    var ts = turmasDoDocente();
    if (!S.pessoasTurma || !ts.some(function(t){ return t.id === S.pessoasTurma; })) S.pessoasTurma = ts[0].id;
    var t = turma(S.pessoasTurma), admin = S.cargo === 'admin';
    var termo = norm(S.buscaPessoa.trim());
    var lista = t.membros.filter(function(p){ return !termo || norm(p.nome + ' ' + p.mat).indexOf(termo) >= 0; });
    var opcoes = admin ? ['aluno','monitor','professor'] : ['aluno','monitor'];

    var h = flash() + '<h1>Pessoas e cargos</h1>' +
      '<div class="explica bloco-p"><b>Como funcionam os cargos</b><ul>' +
        '<li>Toda conta começa como <b>aluno</b>.</li>' +
        '<li><b>Professor</b>: torna aluno em monitor (e volta) só nas próprias turmas, por esta página ou por arquivo de matrículas.</li>' +
        '<li><b>Coordenação (admin)</b>: muda qualquer cargo, inclusive professor. Os admins são definidos direto no banco de dados.</li>' +
        '<li>O cargo vale <b>por turma</b>: ser monitor de AEDS2 não dá acesso de monitor em Cálculo.</li></ul></div>' +
      '<p class="rotulo">Turma</p><div class="chips sem-topo">' + ts.map(function(x){
        return '<button class="chip' + (x.id === t.id ? ' on' : '') + '" data-pessoas-turma="' + x.id + '">' + nomeTurma(x) + '</button>';
      }).join('') + '</div>' +
      '<div class="col-pessoas bloco">' +
      '<section><div class="linha entre"><h2>' + nomeTurma(t) + ' <span class="txt-p fraco">· ' + t.membros.length + ' pessoas · ' + t.prof + '</span></h2></div>' +
        '<input class="campo bloco-p" id="busca-pessoa" value="' + esc(S.buscaPessoa) + '" placeholder="Buscar por nome ou matrícula…" autocomplete="off">' +
        '<div class="rolagem bloco-p"><table class="tabela"><thead><tr><th>Nome</th><th>Matrícula</th><th>Cargo nesta turma</th></tr></thead><tbody>' +
        '<tr><td><b>' + t.prof + '</b></td><td class="mono apagado">—</td><td><span class="chip">professor</span></td></tr>' +
        lista.map(function(p){
          return '<tr><td>' + esc(p.nome) + '</td><td class="mono">' + p.mat + '</td><td><select class="campo campo-cargo" data-papel="' + p.mat + '" aria-label="Cargo de ' + esc(p.nome) + '">' +
            opcoes.map(function(o){ return '<option' + (o === p.papel ? ' selected' : '') + '>' + o + '</option>'; }).join('') + '</select></td></tr>';
        }).join('') + '</tbody></table></div>' +
        (lista.length ? '' : '<p class="sub">Ninguém encontrado nesta turma.</p>') + '</section>' +
      '<section class="caixa"><h3>Mudar vários por arquivo</h3>' +
        '<p class="sub">Envie um .csv ou .txt com uma matrícula por linha, ou cole as matrículas. Você confere a prévia antes de confirmar.</p>' +
        '<p class="rotulo">Arquivo</p><input type="file" id="csv-arquivo" accept=".csv,.txt" class="campo">' +
        '<p class="rotulo">ou cole as matrículas</p><textarea class="campo mono" id="csv-texto" rows="5" placeholder="2025010171&#10;2025010184">' + esc(S.csv.texto) + '</textarea>' +
        '<p class="rotulo">Todas viram</p><select class="campo" id="csv-papel">' + opcoes.map(function(o){ return '<option' + (o === S.csv.papel ? ' selected' : '') + '>' + o + '</option>'; }).join('') + '</select>' +
        '<p class="linha bloco-p"><button class="btn" data-acao="csv-previa">Ver prévia</button><button class="btn btn-peq" data-acao="csv-exemplo">Colar exemplo</button></p>' +
        (S.csv.previa ? previaCsv(t) : '') + '</section>' +
      '</div>' +
      '<h2 class="bloco-g">Histórico de alterações</h2><div class="historico bloco-xp">' + S.historico.map(function(x){
        return '<div class="pad-y div-b-fina txt-p"><span class="mono apagado">' + x.quando + '</span> · <b>' + esc(x.quem) + '</b> ' + esc(x.txt) + ' <span class="chip">' + x.como + '</span></div>';
      }).join('') + '</div>';
    return h;
  };
  function lerCsv(texto, t){
    var linhas = texto.split(/\r?\n/).map(function(l){ return l.trim(); }).filter(Boolean);
    return linhas.map(function(l){
      var m = l.match(/\d{6,12}/);
      if (!m) return {linha:l, situacao:'ignorada', txt:'linha sem matrícula (cabeçalho?)'};
      var p = t.membros.filter(function(x){ return x.mat === m[0]; })[0];
      if (!p) return {linha:l, mat:m[0], situacao:'erro', txt:'não está nesta turma'};
      if (p.papel === S.csv.papel) return {linha:l, mat:m[0], nome:p.nome, situacao:'igual', txt:'já é ' + p.papel};
      return {linha:l, mat:m[0], nome:p.nome, situacao:'ok', txt:p.papel + ' → ' + S.csv.papel};
    });
  }
  function previaCsv(t){
    var p = S.csv.previa, conta = function(s){ return p.filter(function(x){ return x.situacao === s; }).length; };
    return '<div class="previa-csv bloco-p"><p class="txt-p"><b>' + conta('ok') + '</b> alterações · ' + conta('igual') + ' sem mudança · ' + conta('erro') + ' não encontradas · ' + conta('ignorada') + ' ignoradas</p>' +
      '<table class="tabela"><tbody>' + p.map(function(x){
        return '<tr class="sit-' + x.situacao + '"><td class="mono">' + esc(x.mat || x.linha) + '</td><td>' + esc(x.nome || '—') + '</td><td>' + x.txt + '</td></tr>';
      }).join('') + '</tbody></table>' +
      '<p class="linha bloco-p"><button class="btn btn-cheio" data-acao="csv-confirmar"' + (conta('ok') ? '' : ' disabled') + '>Confirmar ' + conta('ok') + ' alteraç' + (conta('ok') === 1 ? 'ão' : 'ões') + '</button>' +
      '<button class="btn" data-acao="csv-cancelar">Cancelar</button></p></div>';
  }
  function agora(){ var d = new Date(); var p = function(n){ return (n < 10 ? '0' : '') + n; }; return p(d.getDate()) + '/' + p(d.getMonth() + 1) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes()); }
  function quemSou(){ return S.cargo === 'admin' ? 'Coordenação' : PROF_EU; }

  // --- relatórios ---
  var REL = {
    AEDS2:{graficos:['linha','histograma']}, CALC2:{graficos:['empilhado','halteres']},
    AEDS1:{graficos:['calor','anel']}, DIW:{graficos:['barrasH','bala']}
  };
  function metricasTurma(t){
    var al = t.membros.map(function(p){
      return {p:p, pts:Math.round(sorteio(p.mat + t.id, 38, 96)), prazo:Math.round(sorteio(t.id + p.mat, 55, 100)), part:Math.round(sorteio(p.nome + t.id, 18, 95)), faltas:Math.round(sorteio(p.mat + 'f' + t.id, 0, 11))};
    });
    var media = function(k){ return Math.round(soma(al, function(a){ return a[k]; }) / al.length); };
    return {alunos:al, media:media('pts'), prazo:media('prazo'), part:media('part'), risco:al.filter(function(a){ return a.pts < 60 || a.faltas >= 9; }).length};
  }

  telas.relatorios = function(){
    if (!docente()) return semPermissao('Só professores e a coordenação veem relatórios.');
    var siglas = ['AEDS2','CALC2','AEDS1','DIW'];
    var janela = function(sigla, classe){
      var m = materia(sigla), ts = turmasDoDocente().filter(function(t){ return t.sigla === sigla; });
      var met = ts.map(metricasTurma), alunos = soma(ts, function(t){ return t.membros.length; });
      var media = Math.round(soma(met, function(x){ return x.media; }) / met.length);
      return '<article class="rel-jan ' + classe + ' ' + corMat(sigla) + '" data-rel="' + sigla + '">' +
        '<button class="rel-jan__cabeca" data-rel="' + sigla + '"><span class="janela__sigla">' + sigla + '</span><span class="rel-jan__nome">' + m.nome + '</span>' +
          '<span class="txt-xp fraco">' + ts.length + ' turma' + (ts.length === 1 ? '' : 's') + ' · ' + alunos + ' alunos · média ' + media + ' · ' + soma(met, function(x){ return x.risco; }) + ' em risco</span></button>' +
        '<div class="rel-jan__graficos">' + REL[sigla].graficos.map(function(g){ return GRAFICOS[g](sigla, ts); }).join('') + '</div>' +
        '<span class="rel-jan__abrir txt-xp">clique para ver as turmas →</span></article>';
    };
    return '<h1>Relatórios</h1><p class="sub">' + (S.cargo === 'admin' ? 'Visão da coordenação.' : PROF_EU + ' · 2026/2.') + ' Passe o mouse numa matéria para ampliar; clique para ver as turmas dela.</p>' +
      '<div class="bento bloco">' +
        '<div class="bento-linha bento-linha--alta">' + janela('AEDS2', 'rel-jan--larga') + janela('CALC2', 'rel-jan--estreita') + '</div>' +
        '<div class="bento-linha">' + janela('AEDS1', 'rel-jan--estreita') + janela('DIW', 'rel-jan--larga') + '</div>' +
      '</div>' +
      '<p class="sub bloco">Avaliadas = atividades com nota. Não avaliadas = estudos abertos, exercícios de treino, enquetes e dúvidas registradas no Hub.</p>';
  };

  // cada gráfico tem um formato diferente, escolhido pelo tipo de dado que mostra
  function graf(tit, corpo, nota, tipo){
    return '<figure class="graf graf--' + tipo + '"><figcaption class="graf__titulo">' + tit + '</figcaption>' + corpo + '<p class="graf__nota">' + nota + '</p></figure>';
  }
  var GRAFICOS = {
    // engajamento ao longo do tempo: área
    linha:function(){
      var v = [42, 55, 61, 58, 66, 72, 69, 74, 71, 78], w = 240, h = 80;
      var d = v.map(function(x, i){ return (i ? 'L' : 'M') + (i / (v.length - 1) * w).toFixed(1) + ',' + (h - 4 - x / 100 * (h - 8)).toFixed(1); }).join(' ');
      return graf('Engajamento em não avaliadas', '<svg class="graf__svg" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" role="img" aria-label="Engajamento semanal de 42% a 78%">' +
        '<path d="' + d + ' L' + w + ',' + h + ' L0,' + h + ' Z" class="g-area"/><path d="' + d + '" class="g-traco"/></svg>',
        '<b>78%</b> abriram algum material na semana · ↑ 7 pts', 'linha');
    },
    // distribuição de notas: histograma
    histograma:function(){
      var bins = [2, 3, 6, 9, 13, 11, 5, 3], w = 240, h = 80, bw = w / bins.length, max = 13;
      var r = bins.map(function(b, i){ var bh = b / max * (h - 6); return '<rect x="' + (i * bw + 2).toFixed(1) + '" y="' + (h - bh).toFixed(1) + '" width="' + (bw - 4).toFixed(1) + '" height="' + bh.toFixed(1) + '" class="' + (i < 3 ? 'g-ruim' : 'g-barra') + '"/>'; }).join('');
      return graf('Notas da Prova 1 (avaliada)', '<svg class="graf__svg" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" role="img" aria-label="Histograma: 11 de 52 abaixo de 60%">' + r + '</svg>' +
        '<div class="graf__eixo"><span>0</span><span>60%</span><span>100</span></div>', '<b>11</b> de 52 abaixo de 60% (em vermelho)', 'histograma');
    },
    // entregas: barra empilhada
    empilhado:function(){
      var l = [['Lista 1', 34, 4, 2], ['Prova 1', 38, 0, 2], ['Lista 3', 25, 9, 6], ['Lista 4', 22, 8, 10]];
      return graf('Entregas das avaliadas', '<div class="empilhado">' + l.map(function(x){
        var t = x[1] + x[2] + x[3];
        return '<div class="empilhado__linha"><span class="empilhado__rot">' + x[0] + '</span><span class="empilhado__barra">' +
          '<i class="seg-prazo" style="width:' + (x[1] / t * 100) + '%"></i><i class="seg-atraso" style="width:' + (x[2] / t * 100) + '%"></i><i class="seg-nao" style="width:' + (x[3] / t * 100) + '%"></i></span></div>';
      }).join('') + '</div><div class="graf__legenda"><span><i class="seg-prazo"></i>no prazo</span><span><i class="seg-atraso"></i>atraso</span><span><i class="seg-nao"></i>não entregou</span></div>',
        'Lista 4: <b>25%</b> não entregaram', 'empilhado');
    },
    // avaliadas × não avaliadas: halteres
    halteres:function(){
      var l = [['Sem 1–2', 88, 61], ['Sem 3–4', 84, 52], ['Sem 5–6', 81, 40], ['Sem 7–8', 79, 33]];
      return graf('Participação: avaliadas × não avaliadas', '<div class="halteres">' + l.map(function(x){
        return '<div class="halteres__linha"><span class="empilhado__rot">' + x[0] + '</span><span class="halteres__trilho">' +
          '<i class="halteres__liga" style="left:' + x[2] + '%;width:' + (x[1] - x[2]) + '%"></i><i class="halteres__ponto halteres__ponto--nao" style="left:' + x[2] + '%"></i><i class="halteres__ponto" style="left:' + x[1] + '%"></i></span></div>';
      }).join('') + '</div><div class="graf__legenda"><span><i class="halteres__ponto"></i>avaliadas</span><span><i class="halteres__ponto halteres__ponto--nao"></i>não avaliadas</span></div>',
        'O treino caiu de <b>61%</b> para <b>33%</b>', 'halteres');
    },
    // quando estudam: mapa de calor
    calor:function(){
      var dias = ['seg','ter','qua','qui','sex'], per = ['manhã','tarde','noite'];
      var val = [[.2,.35,.9],[.15,.3,.75],[.25,.5,1],[.1,.25,.6],[.05,.15,.3]];
      return graf('Quando a turma estuda', '<div class="calor"><span></span>' + dias.map(function(d){ return '<span class="calor__rot">' + d + '</span>'; }).join('') +
        per.map(function(p, j){ return '<span class="calor__rot calor__rot--lado">' + p + '</span>' + dias.map(function(d, i){ return '<span class="calor__cel" title="' + d + ' ' + p + ': ' + Math.round(val[i][j] * 100) + '%"><i style="opacity:' + val[i][j] + '"></i></span>'; }).join(''); }).join('') + '</div>',
        'Pico: <b>quarta à noite</b>', 'calor');
    },
    // conclusão de exercícios não avaliados: anel
    anel:function(){
      var pct = 64, c = 2 * Math.PI * 30;
      return graf('Exercícios de treino concluídos', '<div class="anel"><svg viewBox="0 0 80 80" role="img" aria-label="' + pct + '% concluídos"><circle cx="40" cy="40" r="30" class="g-anel-fundo"/>' +
        '<circle cx="40" cy="40" r="30" class="g-anel" stroke-dasharray="' + (c * pct / 100).toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 40 40)"/></svg><b class="anel__valor">' + pct + '%</b></div>',
        '<b>12</b> alunos não fizeram nenhum', 'anel');
    },
    // onde travam: barras horizontais
    barrasH:function(){
      var l = [['Flexbox', 31], ['Grid', 22], ['Acessibilidade', 12], ['Formulários', 8]];
      return graf('Dúvidas por tópico', '<div class="barrash">' + l.map(function(x){
        return '<div class="barrash__linha"><span class="empilhado__rot">' + x[0] + '</span><span class="barrash__barra"><i style="width:' + (x[1] / 31 * 100) + '%"></i></span><b class="mono txt-xp">' + x[1] + '</b></div>';
      }).join('') + '</div>', '<b>Flexbox</b> concentra 42% das dúvidas', 'barrash');
    },
    // média × meta: bullet
    bala:function(){
      return graf('Média da turma × aprovação', '<div class="bala"><span class="bala__faixa bala__faixa--1"></span><span class="bala__faixa bala__faixa--2"></span><span class="bala__faixa bala__faixa--3"></span>' +
        '<span class="bala__valor" style="width:71%"></span><span class="bala__meta" style="left:60%"></span></div><div class="graf__eixo"><span>0</span><span>meta 60</span><span>100</span></div>',
        'Média <b>71</b>, 11 pts acima da meta', 'bala');
    }
  };

  telas.relMateria = function(){
    if (!docente()) return semPermissao('Só professores e a coordenação veem relatórios.');
    var m = materia(S.relSigla), ts = turmasDoDocente().filter(function(t){ return t.sigla === S.relSigla; });
    return voltar('Relatórios', 'relatorios') + '<div class="mat-cabeca ' + corMat(m.sigla) + ' bloco"><h1>' + m.nome + '</h1><p class="sub">' + ts.length + ' turma' + (ts.length === 1 ? '' : 's') + ' em 2026/2</p></div>' +
      '<div class="turma-cards bloco">' + ts.map(function(t){
        var x = metricasTurma(t);
        return '<button class="turma-card" data-turma-prof="' + t.id + '"><span class="linha entre"><b>' + nomeTurma(t) + '</b><span class="chip">' + t.turno + '</span></span>' +
          '<span class="turma-card__nums">' + kpi('Média', x.media, 'de 100') + kpi('No prazo', x.prazo + '%', 'avaliadas') + kpi('Treino', x.part + '%', 'não avaliadas') + '</span>' +
          '<span class="txt-p">' + t.membros.length + ' alunos · <b class="' + (x.risco ? 'txt-nota' : '') + '">' + x.risco + ' em risco</b>' + (t.regra ? '' : ' · <span class="txt-nota">sem regra de nota</span>') + '</span>' +
          '<span class="txt-xp fraco">Abrir turma →</span></button>';
      }).join('') + '</div>';
  };

  telas.turma = function(){
    if (!docente()) return semPermissao('Só professores e a coordenação veem relatórios.');
    var t = turma(S.turmaProf), x = metricasTurma(t);
    if (!S.regraRascunho || S.regraRascunho.turma !== t.id){
      var base = t.regra || {aprovacao:60, frequencia:75, avaliacoes:[{nome:'Prova 1', valor:30}, {nome:'Trabalho', valor:40}, {nome:'Prova 2', valor:30}]};
      S.regraRascunho = {turma:t.id, aprovacao:base.aprovacao, frequencia:base.frequencia, avaliacoes:base.avaliacoes.map(function(a){ return {nome:a.nome, valor:a.valor}; })};
    }
    var rr = S.regraRascunho;
    return flash() + voltar(materia(t.sigla).nome, 'relMateria') + '<div class="mat-cabeca ' + corMat(t.sigla) + ' bloco"><h1>' + nomeTurma(t) + '</h1><p class="sub">' + t.turno + ' · ' + t.membros.length + ' alunos · ' + t.prof + '</p></div>' +
      '<div class="resumo-num bloco">' + kpi('Média da turma', x.media, 'de 100') + kpi('Entregas no prazo', x.prazo + '%', 'avaliadas') + kpi('Participação no treino', x.part + '%', 'não avaliadas') + kpi('Em risco', x.risco, 'nota < 60 ou perto do limite de faltas') + '</div>' +
      '<div class="col-turma bloco-g">' +
      '<section><div class="linha entre"><h2>Alunos</h2><button class="btn btn-peq" data-acao="gerenciar-cargos" data-v="' + t.id + '">Gerenciar cargos desta turma</button></div>' +
        '<div class="rolagem bloco-p"><table class="tabela"><thead><tr><th>Nome</th><th>Pontos</th><th>No prazo</th><th>Treino</th><th>Faltas</th><th></th></tr></thead><tbody>' +
        x.alunos.slice().sort(function(a, b){ return a.pts - b.pts; }).map(function(a){
          var risco = a.pts < 60 || a.faltas >= 9;
          return '<tr><td>' + esc(a.p.nome) + (a.p.papel === 'monitor' ? ' <span class="chip">monitor</span>' : '') + '</td><td class="mono">' + a.pts + '</td><td class="mono">' + a.prazo + '%</td><td class="mono">' + a.part + '%</td><td class="mono">' + a.faltas + '</td>' +
            '<td>' + (risco ? '<span class="chip chip-alerta">em risco</span>' : '') + '</td></tr>';
        }).join('') + '</tbody></table></div></section>' +
      '<section class="caixa" id="regra"><h3>Regra de nota da turma</h3>' +
        (t.regra ? '<p class="sub">Os alunos veem a calculadora de média com esta regra.</p>' : '<div class="aviso">Esta turma ainda não tem regra. Enquanto isso, os alunos veem a calculadora com o padrão: 100 pts e aprovação com 60.</div>') +
        '<div class="grade-regra bloco-p"><label><span class="rotulo">Aprovação com (pts)</span><input class="campo" type="number" min="0" data-regra="aprovacao" value="' + rr.aprovacao + '"></label>' +
        '<label><span class="rotulo">Frequência mínima (%)</span><input class="campo" type="number" min="0" max="100" data-regra="frequencia" value="' + rr.frequencia + '"></label></div>' +
        '<p class="rotulo">Avaliações</p><div class="regra-lista">' + rr.avaliacoes.map(function(a, i){
          return '<div class="regra-linha"><input class="campo" data-regra="nome" data-i="' + i + '" value="' + esc(a.nome) + '" aria-label="Nome da avaliação ' + (i + 1) + '" placeholder="Nome">' +
            '<input class="campo" type="number" min="0" step="0.5" data-regra="valor" data-i="' + i + '" value="' + a.valor + '" aria-label="Valor da avaliação ' + (i + 1) + '">' +
            '<button class="btn btn-peq" data-acao="regra-remover" data-v="' + i + '" aria-label="Remover ' + esc(a.nome) + '">×</button></div>';
        }).join('') + '</div>' +
        '<p class="linha bloco-p"><button class="btn btn-peq" data-acao="regra-adicionar">+ Adicionar avaliação</button><span class="empurra txt-p" id="regra-soma">' + somaRegraTxt() + '</span></p>' +
        '<p class="msg-erro" id="regra-erro"></p>' +
        '<p class="bloco-p"><button class="btn btn-cheio" data-acao="regra-salvar">Salvar regra</button></p></section>' +
      '</div>';
  };
  function somaRegraTxt(){
    var rr = S.regraRascunho, s = soma(rr.avaliacoes, function(a){ return parseFloat(a.valor) || 0; });
    return 'Soma: <b>' + num(s) + ' pts</b>' + (s === 100 ? ' ✓' : ' <span class="txt-nota">(o semestre costuma fechar em 100)</span>');
  }

  // --- demais telas (fluxos de teste já existentes) ---
  telas.duvidas = function(){
    var h = '<h1>Dúvidas &amp; Feedback</h1>' +
      '<div class="abas" id="abas-duv">' + aba('turma', 'Dúvidas da turma', S.aba.duv) + aba('enviar', 'Enviar', S.aba.duv) + aba('auloes', 'Aulões', S.aba.duv) + '</div>';

    if (S.aba.duv === 'turma'){
      h += '<p class="linha"><span class="chip on">AEDS2</span><span class="chip">CALC2</span><span class="chip">DIW</span>' +
        '<span class="empurra txt-p fraco">últimos 30 dias</span></p>';
      h += '<div class="caixa bloco-p"><h3>Onde a turma mais trava</h3>' +
        barra('Complexidade', 74, 31) + barra('Recursão', 52, 22) + barra('Ponteiros', 29, 12) + barra('Ordenação', 19, 8);
      if (equipe() && !S.enqueteAberta){
        h += '<p class="bloco-p"><button class="btn btn-cheio" data-acao="abrir-enquete">Abrir enquete de aulão com os 3 do topo</button> ' +
             '<button class="btn">Gerar relatório para o professor</button></p>';
      } else if (equipe()){
        h += '<p class="bloco-p"><button class="btn">Gerar relatório para o professor</button></p>';
      }
      h += '</div>';

      if (S.enqueteAberta){
        h += '<div class="caixa bloco-p borda-g"><div class="linha entre">' +
          '<h3>Enquete — tema do próximo aulão</h3><span class="chip on">aberta</span></div>' +
          '<p class="sub">AEDS2 · encerra em 2 dias · ' + (S.votou ? '49' : '48') + ' votos</p>' +
          opcaoVoto('Complexidade na prática', 52) + opcaoVoto('Recursão passo a passo', 29) + opcaoVoto('Ponteiros e memória', 19);
        if (S.votou) h += '<p class="sub"><b>Voto registrado.</b> O resultado vira aulão na aba Aulões.</p>';
        h += '</div>';
      }

      h += '<h3 class="bloco">Dúvidas mais frequentes</h3>' +
        '<div class="caixa esp-y"><b>Por que merge sort é n log n e não n²?</b> <span class="chip">respondida</span>' +
        '<div class="fantasma medio"></div><span class="sub">respondida por Ipsum (monitor) · 18 marcaram como útil</span></div>' +
        '<div class="caixa esp-y"><b>Quando usar lista encadeada em vez de array?</b> <span class="chip">respondida</span>' +
        '<div class="fantasma curto"></div><span class="sub">respondida por Prof. Lorem · 9 marcaram como útil</span></div>';
      if (S.pedidoEnviado){
        h += '<div class="caixa esp-y borda-trac"><b>Como calcular a complexidade de recursão dupla?</b> ' +
          '<span class="chip">' + (S.respostaChegou ? 'respondida' : 'aguardando') + '</span>' +
          '<span class="sub bl">sua dúvida · pedido #143</span></div>';
      }
    }

    if (S.aba.duv === 'enviar'){
      if (S.naFila){
        h += '<div class="conclusao"><h2>Sua dúvida entrou na fila</h2>' +
          '<p class="sub">Agora são 23:10 e a monitoria de AEDS2 atende das 8 h às 22 h. O pedido é criado e os monitores são avisados assim que o atendimento abrir.</p>' +
          '<p class="bloco"><button class="btn btn-cheio" data-acao="abrir-horario">Simular: chegou 8 h</button></p></div>';
      } else if (S.pedidoEnviado){
        h += '<div class="conclusao"><h2>Pedido #143 enviado</h2>' +
          '<p class="sub">Os monitores de AEDS2 foram notificados. Você recebe um aviso quando alguém responder.</p>' +
          '<p class="bloco"><button class="btn btn-cheio" data-acao="simular-resposta">Simular a resposta do monitor</button></p></div>';
      } else {
        h += '<div class="med-texto"><p class="rotulo sem-topo">O que você quer enviar?</p>' +
          '<p class="linha"><span class="chip on">Dúvida de matéria</span><span class="chip">Problema no site</span><span class="chip">Sugestão</span></p>' +
          '<p class="rotulo">Disciplina e turma</p><input class="campo" value="AEDS2 · turma 04">' +
          '<p class="rotulo">Assunto</p><input class="campo" id="assunto" value="' + esc(S.assuntoPre) + '" placeholder="Ex.: complexidade de recursão dupla">' +
          '<p class="rotulo">Descreva</p><textarea class="campo" rows="3"></textarea>' +
          '<div class="caixa-trac bloco"><b>Já perguntaram parecido</b>' +
          '<p class="sub">Antes de enviar, veja se alguma destas resolve — é a triagem do RF-05.</p>' +
          '<p class="bloco-xp"><button class="btn btn-peq" data-acao="resolveu">Resolveu, cancelar envio</button></p></div>' +
          '<p class="bloco"><button class="btn btn-cheio" data-acao="enviar-duvida">Enviar</button></p></div>';
      }
    }

    if (S.aba.duv === 'auloes'){
      if (S.aulaoMarcado){
        h += '<div class="conclusao"><h2>Aulão publicado no calendário</h2>' +
          '<p class="sub">' + esc(S.temaAulao) + ' · 18/09 · 19 h · sala 201 — ' + (S.desempate ? 'escolhido pela monitoria depois do empate' : 'venceu a enquete com 52%') + '.</p>' +
          '<p class="bloco"><button class="btn btn-cheio" data-ir="calendario">Ver no calendário</button></p></div>';
      } else if (S.enqueteAberta){
        h += '<div class="caixa"><b>Complexidade na prática</b> <span class="chip">em votação</span>' +
          '<p class="sub">Lidera com 52% · enquete encerra em 2 dias</p>';
        if (equipe() && !S.etapaAulao){
          h += '<p class="bloco-p"><button class="btn btn-cheio" data-acao="encerrar-enquete">Encerrar e marcar data</button> ' +
            '<button class="btn" data-acao="simular-empate">Simular empate</button></p>';
        }
        h += '</div>';
        if (S.etapaAulao === 'empate'){
          h += '<div class="caixa bloco-p borda-g"><h3>Empate: 38% para cada tema</h3>' +
            '<p class="sub">A enquete encerrou sem vencedor. Como monitor, escolha o tema do aulão.</p>' +
            '<p class="bloco-p"><button class="btn" data-acao="desempatar" data-tema="Complexidade na prática">Complexidade na prática</button> ' +
            '<button class="btn" data-acao="desempatar" data-tema="Recursão passo a passo">Recursão passo a passo</button></p></div>';
        }
        if (S.etapaAulao === 'definir'){
          h += '<div class="caixa bloco-p borda-g"><h3>Definir data e sala · ' + esc(S.temaAulao) + '</h3>' +
            '<p class="rotulo">Data e hora</p><p class="linha">' +
            '<button class="chip' + (S.dataAulao === '18' ? ' on' : '') + '" data-acao="data-aulao" data-dt="18">qui 18/09 · 19 h</button>' +
            '<button class="chip' + (S.dataAulao === '22' ? ' on' : '') + '" data-acao="data-aulao" data-dt="22">seg 22/09 · 19 h</button></p>' +
            '<p class="rotulo">Sala</p><input class="campo med-form" value="Sala 201">' +
            (S.conflito ? '<div class="aviso">Esse horário conflita com a P1 de AEDS2 (22/09 · 19 h). Escolha outro horário.</div>' : '') +
            '<p class="bloco"><button class="btn btn-cheio" data-acao="confirmar-aulao">Confirmar aulão</button></p></div>';
        }
      } else {
        h += '<div class="caixa-trac centro"><b>Nenhum aulão em votação.</b>' +
          '<p class="sub">Quando um tópico acumular dúvidas, a monitoria abre uma enquete e ela aparece aqui.</p></div>';
      }
    }
    return h;
  };

  telas.mensagens = function(){
    var h = '<h1>Mensagens</h1><div class="abas" id="abas-msg">' +
      aba('conversas', 'Conversas', S.aba.msg) + aba('caixa', 'Mensagens', S.aba.msg) + '</div>';

    if (S.aba.msg === 'conversas'){
      // no celular a lista e a conversa são telas separadas; no desktop ficam lado a lado
      var soLista = S.celular && !S.convAberta;
      var soConversa = S.celular && S.convAberta;

      var lista = '<div class="lista">' + CONVERSAS.map(function(c){
        var sel = (c.id === (S.convAberta || 'monitor'));
        return '<button class="' + (sel && !S.celular ? 'sel' : '') + '" data-conv="' + c.id + '">' +
          '<span class="avatar' + (c.tipo === 'sala' ? ' avatar-quad' : '') + '"></span>' +
          '<span class="cresce"><b>' + c.nome + '</b>' +
          (c.sub ? '<div class="txt-xp apagado">' + c.sub + '</div>' : '<div class="fantasma curto"></div>') +
          '</span></button>';
      }).join('') + '</div>';

      var topo = S.celular
        ? '<div class="linha div-b pb-p"><button class="btn btn-peq" data-acao="voltar-lista">←</button><span class="avatar"></span><b>Ipsum · monitor</b></div>'
        : '<div class="linha div-b pb-p"><span class="avatar"></span><b>Ipsum · monitor AEDS2</b><span class="empurra txt-xp fraco">atende das 8 h às 22 h</span></div>';

      var conversa = topo +
        '<div class="thread bloco-p"><div class="bolha">Como calcular a complexidade de recursão dupla?<span class="hora">14:02</span></div>' +
        (S.respostaChegou ? '<div class="bolha minha">Monta a árvore de recursão e soma por nível — te mando um exemplo com Fibonacci<span class="hora">14:20</span></div>' : '') +
        '</div>';
      if (S.respostaChegou){
        conversa += '<div class="caixa bloco-p"><b>Isso resolveu sua dúvida?</b>' +
          '<p class="bloco-xp"><button class="btn btn-cheio" data-acao="util">Sim, resolveu</button> ' +
          '<button class="btn" data-acao="nao-resolveu">Ainda não</button></p></div>';
      } else {
        conversa += '<div class="linha bloco-p"><input class="campo cresce" placeholder="Escreva sua mensagem…"><button class="btn btn-cheio">Enviar</button></div>';
      }

      if (soLista) h += lista;
      else if (soConversa) h += conversa;
      else h += '<div class="col-2">' + lista + '<div>' + conversa + '</div></div>';
    } else {
      h += '<div class="chips"><span class="chip on">Caixa de entrada</span><span class="chip">Não lidas</span><span class="chip">Enviadas</span><span class="chip">Arquivadas</span></div>' +
        '<div class="rolagem bloco-p"><table class="inbox">' +
        '<tr><td class="col-ponto"><span class="ponto"></span></td><td class="col-remetente"><b>Coordenação AEDS2</b></td><td><b>Monitoria extra antes da P1</b><div class="fantasma medio"></div></td><td class="apagado col-data">10 set</td></tr>' +
        '<tr><td><span class="ponto"></span></td><td><b>Ipsum (monitor)</b></td><td><b>Resposta ao seu pedido #143</b><div class="fantasma medio"></div></td><td class="apagado">09 set</td></tr>' +
        '<tr><td></td><td>Hub de Estudos</td><td>Seu estudo foi marcado como revisado<div class="fantasma curto"></div></td><td class="apagado">05 set</td></tr>' +
        '</table></div>' +
        '<p class="sub">É esta aba que gera o histórico — conversa solta não vira dado.</p>';
    }
    return h;
  };

  telas.notificacoes = function(){
    var h = '<h1>Notificações</h1><p class="linha bloco-p"><span class="chip on">todas</span><span class="chip">não lidas</span><span class="chip">respostas</span><span class="chip">enquetes</span></p>';
    var itens = [];
    if (S.respostaChegou) itens.push({t:'<b>Ipsum (monitor)</b> respondeu seu pedido #143', d:'há 6 min', ir:'mensagens'});
    if (S.enqueteAberta && !equipe()) itens.push({t:'<b>Enquete aberta</b> — escolha o tema do aulão de AEDS2', d:'há 5 h', ir:'duvidas'});
    itens.push({t:'Novo estudo publicado em <b>CALC2</b>', d:'ontem', ir:'estudos'});
    h += '<div class="bloco">' + itens.map(function(i){
      return '<div class="caixa fim-p">' + i.t + '<div class="sub">' + i.d + '</div>' +
        '<p class="bloco-xp"><button class="btn btn-peq" data-ir="' + i.ir + '">abrir →</button></p></div>';
    }).join('') + '</div>';
    return h;
  };

  telas.calendario = function(){
    var dias = '';
    for (var d = 1; d <= 30; d++){
      var ev = (S.aulaoMarcado && d === 18) ? '<div class="mini-barra mini-barra--aulao"></div>'
             : ([3,5,8,12,25].indexOf(d) >= 0 ? '<div class="mini-barra mini-barra--evento"></div>' : '');
      dias += '<div class="dia' + (d === 18 && S.aulaoMarcado ? ' marcado' : '') + '">' + d + ev + '</div>';
    }
    var esq = '<h1>Calendário</h1>' +
      '<p class="rotulo">Fonte: URL do feed do Canvas</p>' +
      '<div class="linha"><input class="campo cresce campo-feed" value="https://canvas.exemplo.br/feeds/…ics">' +
      '<button class="btn btn-cheio" data-acao="importar-feed">Salvar e importar</button>' +
      '<button class="btn" data-acao="importar-feed">Atualizar agora</button></div>' +
      '<p class="sub">' + (S.feedSalvo
        ? 'Importado agora · 68 evento(s) do feed do Canvas.'
        : 'Última importação: 04/09/2026 · 68 evento(s) · importa sozinho ao abrir se passou de 6 h.') + '</p>' +
      '<div class="linha bloco"><button class="btn btn-peq">‹</button><b>setembro de 2026</b>' +
      '<button class="btn btn-peq">›</button><button class="btn btn-peq">Hoje</button></div>' +
      '<div class="chips"><span class="chip on">todos</span><span class="chip">Cálculo II</span><span class="chip">AEDS II</span><span class="chip">DIW</span><span class="chip">TI2</span></div>' +
      '<div class="semana bloco">' + dias + '</div>' +
      '<p class="sub">Cada barra é um evento do dia; o aulão confirmado entra com traço cheio.</p>';

    var dir = '<h2>Eventos do mês</h2><p class="sub">sexta-feira, 05 de setembro</p>' +
      '<div class="caixa bloco-p"><span class="txt-xp apagado">dia inteiro</span> <b>Atividade 06</b> <span class="chip">Cálculo II</span>' +
      '<p class="bloco-xp"><button class="btn btn-peq">Canvas</button> <button class="btn btn-peq">Google</button> <button class="btn btn-peq">.ics</button></p></div>' +
      '<div class="caixa bloco-p"><span class="txt-xp apagado">10:00</span> <b>Quiz — Complexidade</b> <span class="chip">AEDS II</span></div>';
    if (S.aulaoMarcado){
      dir += '<div class="caixa bloco-p borda-g"><span class="txt-xp apagado">19:00</span> <b>Aulão: ' + esc(S.temaAulao) + '</b>' +
        '<p class="sub">18/09 · sala 201 · definido pela enquete da turma AEDS2</p></div>';
    }
    dir += '<h2 class="bloco-g">Assinar no seu app</h2>' +
      '<input class="campo mono bloco-xp" value="https://…/feed?token=…">' +
      '<p class="bloco-xp"><button class="btn btn-peq">Copiar</button> <button class="btn btn-peq btn-perigo">Gerar novo link</button></p>';

    return '<div class="col-cal"><div>' + esq + '</div><div>' + dir + '</div></div>';
  };

  telas.perfil = function(){
    return '<h1>Meu perfil</h1><p class="sub">lorem.ipsum@sga.exemplo.br · <span class="chip">' + S.cargo + '</span></p>' +
      '<p class="rotulo">Nome</p><input class="campo med-form" value="Lorem Ipsum">' +
      '<p class="bloco-p"><button class="btn btn-cheio">Salvar nome</button> ' +
      '<button class="btn btn-perigo" data-acao="sair">Sair</button></p>' +
      '<h2 class="bloco-g">Favoritos</h2>' +
      '<div class="linha pad-y div-b-fina"><span class="chip">CALC2</span><span class="cresce">Guia de Integrais</span><span class="txt-xp apagado">♥ favoritado</span></div>' +
      '<div class="linha pad-y div-b-fina"><span class="chip">AEDS2</span><span class="cresce">Listas encadeadas</span><span class="txt-xp apagado">♥ favoritado</span></div>' +
      '<h2 class="bloco-g">Progresso</h2>' +
      '<div class="linha pad-y div-b-fina"><span class="chip">AEDS2</span><div class="fantasma cresce sem-margem"></div><span class="chip">estudando</span></div>' +
      '<div class="linha pad-y div-b-fina"><span class="chip">AEDS1</span><div class="fantasma medio sem-margem"></div><span class="chip">concluído</span></div>' +
      '<div class="aviso">O cargo vale por turma e muda só pelo professor da turma ou pela coordenação.</div>';
  };

  var SECOES_CFG = ['Perfil público','Conta e acesso','Integrações','Minhas matérias','Notificações','Calendário','Aparência','Privacidade'];
  telas.config = function(){
    var lado = SECOES_CFG.map(function(sec){
      return '<button class="item-lado pad-p txt-p' + (S.configSec === sec ? ' destaque' : '') + '" data-sec="' + sec + '">' + sec + (sec === 'Minhas matérias' ? ' →' : '') + '</button>';
    }).join('');
    var corpo;
    if (S.configSec === 'Notificações'){
      corpo = '<h2>Notificações</h2><p class="sub">Escolha o que te avisa e por onde.</p>' +
        Object.keys(S.notif).map(function(t){
          return '<div class="caixa bloco-p"><div class="linha"><span class="cresce">' + t + '</span>' +
            '<button class="switch" role="switch" aria-checked="' + (S.notif[t] ? 'true' : 'false') + '" data-switch="' + t + '" aria-label="' + t + '"></button></div></div>';
        }).join('') +
        '<p class="bloco"><button class="btn btn-cheio">Salvar</button> <button class="btn">Cancelar</button></p>';
    } else if (S.configSec === 'Integrações'){
      corpo = integracoes();
    } else if (S.configSec === 'Aparência'){
      corpo = '<h2>Aparência</h2><p class="sub">O tema vale para este navegador.</p>' +
        '<p class="rotulo">Tema</p><div class="chips sem-topo">' + [['claro','Claro'],['escuro','Escuro'],['sistema','Igual ao sistema']].map(function(o){
          return '<button class="chip' + (S.tema === o[0] ? ' on' : '') + '" data-tema-pref="' + o[0] + '">' + o[1] + '</button>';
        }).join('') + '</div>';
    } else {
      corpo = '<h2>' + S.configSec + '</h2><p class="sub">Seção desenhada como wireframe; o conteúdo detalhado fica fora do escopo do protótipo.</p>' +
        '<div class="caixa-trac vazio bloco">campos de ' + S.configSec.toLowerCase() + '</div>';
    }
    return flash() + '<h1>Configurações</h1><div class="col-lado bloco"><div class="div-d pr">' + lado + '</div><div>' + corpo + '</div></div>';
  };

  function integracoes(){
    var c = S.canvas;
    var h = '<h2>Integrações</h2><p class="sub">Conecte serviços para o Hub trazer seus dados sozinho.</p>';
    h += '<div class="integracao bloco"><div class="linha entre"><h3>Canvas</h3>' +
      (c.conectado ? '<span class="chip status-ok">● conectado</span>' : '<span class="chip">desconectado</span>') + '</div>';
    if (c.conectado){
      var qtd = S.vinculos.filter(function(v){ return v.origem === 'canvas'; }).length;
      h += '<p class="sub">' + qtd + ' matéria' + (qtd === 1 ? '' : 's') + ' importada' + (qtd === 1 ? '' : 's') + ' · última sincronização: ' + c.sync + '. Notas, tarefas e frequência atualizam sozinhas a cada 6 h.</p>' +
        '<p class="linha bloco-p"><button class="btn" data-acao="canvas-sync">Sincronizar agora</button><button class="btn" data-ir="minhas">Ver minhas matérias</button>' +
        '<button class="btn btn-perigo" data-acao="canvas-desconectar">Desconectar</button></p>' +
        (c.confirmarSaida ? '<div class="aviso">Desconectar apaga o token e tira do Hub as matérias que vieram do Canvas. As que você adicionou manualmente continuam.' +
          '<p class="linha bloco-xp"><button class="btn btn-peq btn-perigo" data-acao="canvas-desconectar-sim">Desconectar mesmo</button><button class="btn btn-peq" data-acao="canvas-desconectar-nao">Cancelar</button></p></div>' : '');
    } else if (c.etapa === 'escolher'){
      h += '<p class="sub">Token aceito. Encontramos estas matérias no seu Canvas em 2026/2. Escolha quais entram no Hub.</p><div class="bloco-p">' +
        CANVAS_CURSOS.map(function(id){
          var t = turma(id);
          return '<label class="linha pad-y div-b-fina"><input type="checkbox" data-canvas-curso="' + id + '"' + (c.escolhidos[id] !== false ? ' checked' : '') + '>' +
            '<span class="cresce"><b>' + materia(t.sigla).nome + '</b> <span class="txt-xp fraco">' + nomeTurma(t) + ' · ' + t.prof + '</span></span></label>';
        }).join('') + '</div><p class="linha bloco-p"><button class="btn btn-cheio" data-acao="canvas-importar">Importar selecionadas</button><button class="btn" data-acao="canvas-cancelar">Cancelar</button></p>';
    } else {
      h += '<ol class="passos"><li>No Canvas, abra <b>Conta › Configurações</b>.</li><li>Em <b>Integrações aprovadas</b>, clique em <b>+ Novo token de acesso</b>.</li>' +
        '<li>Dê um nome (ex.: Hub de Estudos), gere e copie o token.</li><li>Cole aqui embaixo.</li></ol>' +
        '<p class="rotulo">Token de acesso do Canvas</p><div class="campo-senha"><input class="campo mono ' + (c.erro ? 'erro' : '') + '" id="canvas-token" type="' + (c.mostrar ? 'text' : 'password') + '" value="' + esc(c.token) + '" autocomplete="off" placeholder="7~AbCdEf…">' +
        '<button class="btn btn-peq" data-acao="canvas-mostrar">' + (c.mostrar ? 'Ocultar' : 'Mostrar') + '</button></div>' +
        '<label class="linha bloco-p txt-p"><input type="checkbox" id="canvas-consent"' + (c.consent ? ' checked' : '') + '> Autorizo o Hub a ler minhas matérias, tarefas, notas e frequência do Canvas. Posso desconectar quando quiser.</label>' +
        (c.erro ? '<p class="msg-erro">' + esc(c.erro) + '</p>' : '') +
        '<p class="bloco-p"><button class="btn btn-cheio" data-acao="canvas-conectar">Conectar</button> <button class="btn btn-peq" data-acao="canvas-exemplo">Colar token de exemplo</button></p>';
    }
    h += '<p class="txt-xp apagado bloco-p">🔒 O token fica guardado criptografado no servidor do Hub, nunca no navegador. Só é usado para ler dados; o Hub não publica nada no Canvas.</p></div>' +
      '<div class="integracao integracao--breve bloco-p"><div class="linha entre"><h3>Google Agenda</h3><span class="chip">em breve</span></div><p class="sub">Por enquanto, use o link .ics em Calendário › Assinar no seu app.</p></div>';
    return h;
  }

  telas.fim1 = function(){
    return '<div class="conclusao"><h2>' + (S.contaCriada ? 'Conta criada — tarefa 1 concluída' : 'Tarefa 1 concluída') + '</h2>' +
      '<p class="sub">' + (S.contaCriada ? 'Você começa como aluno. ' : '') + 'Você entrou no sistema. O cabeçalho agora mostra Calendário, Dúvidas &amp; Feedback, Mensagens e Notificações, e o Início virou o seu hub de matérias.</p>' +
      '<p class="bloco"><button class="btn btn-cheio" data-acao="tarefa-2">Seguir para a tarefa 2</button> ' +
      '<button class="btn" data-ir="inicio">Ir para o meu hub</button></p></div>';
  };
  telas.fim3 = function(){
    return '<div class="conclusao"><h2>Tarefa 3 concluída</h2>' +
      '<p class="sub">A dúvida foi enviada, respondida pelo monitor e marcada como útil. Ela passa a contar no painel “onde a turma mais trava”.</p>' +
      '<p class="bloco"><button class="btn btn-cheio" data-ir="duvidas">Ver o painel da turma</button></p></div>';
  };

  function aba(id, rot, atual){ return '<button data-aba="' + id + '" class="' + (atual === id ? 'on' : '') + '">' + rot + '</button>'; }
  function barra(nome, pct, n){
    return '<div class="barra-dado"><span class="nome">' + nome + '</span><span class="valor" style="width:' + pct + '%"></span><b>' + n + '</b></div>';
  }
  function opcaoVoto(rot, pct){
    return '<div class="voto"><button data-acao="votar"><span class="preench" style="width:' + (S.votou ? pct : 0) + '%"></span>' +
      '<span class="txt">' + rot + '</span></button><span class="pct">' + (S.votou ? pct + '%' : '—') + '</span></div>';
  }

  /* ======================================================================
     render
     ====================================================================== */
  var SO_LOGADO = ['calendario','duvidas','mensagens','notificacoes','perfil','config','materia','minhas','publicar'];
  function desenhar(){
    if (!logado() && SO_LOGADO.indexOf(S.tela) >= 0 && S.tela !== 'publicar') S.tela = 'inicio';
    desenharNav();
    el('menu-perfil').hidden = true; el('menu-notif').hidden = true; el('menu-ham').hidden = true;
    el('tela').innerHTML = (telas[S.tela] || telas.inicio)();
    el('dica-txt').textContent = (vistaCel ? DICAS_MOB : DICAS)[S.tarefa];
    if (S.cargo !== cargoNoCelular){ cargoNoCelular = S.cargo; paraCelular({tipo:'cargo', v:cargoCelular(S.cargo)}); }
  }
  // redesenha e devolve o foco (e o cursor) ao campo em que a pessoa está digitando
  function redesenharFoco(id){
    var a = document.activeElement, pos = a && a.id === id ? a.selectionStart : null;
    desenhar();
    var n = el(id);
    if (n){ n.focus(); if (pos !== null) try { n.setSelectionRange(pos, pos); } catch (e) {} }
  }

  /* ======================================================================
     8. eventos
     ====================================================================== */
  document.addEventListener('click', function(ev){
    var b = ev.target.closest('button, [data-turma], [data-rel]');
    if (!b || b.closest('.painel-teste')) return;

    var fav = ev.target.closest('[data-fav]');
    if (fav){
      // F1: ação que exige conta leva para Entrar e volta para a origem
      if (!logado()){ S.motivoLogin = 'Entre com sua conta para favoritar estudos.'; S.erroLogin = ''; S.erroGeral = ''; ir('entrar'); return; }
      S.favoritos[fav.dataset.fav] = !S.favoritos[fav.dataset.fav]; desenhar(); return;
    }
    var d = b.dataset;
    if (d.ir){ if (d.ir === 'notificacoes') S.naoLidasNotif = 0; ir(d.ir); return; }
    if (d.estudo){
      var idx = ESTUDOS.map(function(e){ return String(e.id); }).indexOf(d.estudo);
      S.estudoAberto = idx >= 0 ? idx : 1;
      ir('estudo'); return;
    }
    if (d.turma){ S.turmaAberta = d.turma; S.calcAberta = false; ir('materia'); return; }
    if (d.rel){ S.relSigla = d.rel; ir('relMateria'); return; }
    if (d.turmaProf){ S.turmaProf = d.turmaProf; S.regraRascunho = null; ir('turma'); return; }
    if (d.aba){
      if (S.tela === 'mensagens') S.aba.msg = d.aba; else S.aba.duv = d.aba;
      desenhar(); return;
    }
    if (d.menu){ abrirMenu(d.menu); return; }
    if (d.addTag){ adicionarTag(d.addTag); return; }
    if (d.tirarTag){ S.tags = S.tags.filter(function(s){ return s !== d.tirarTag; }); redesenharFoco('busca'); return; }
    if (d.tagAtalho){ if (S.tags.indexOf(d.tagAtalho) >= 0) S.tags = S.tags.filter(function(s){ return s !== d.tagAtalho; }); else S.tags.push(d.tagAtalho); desenhar(); return; }
    if (d.limparTags){ S.tags = []; desenhar(); return; }
    if (d.abaentrar){ S.abaEntrar = d.abaentrar; S.erroLogin = ''; S.erroGeral = ''; S.erroConf = ''; desenhar(); return; }
    if (d.sec){ if (d.sec === 'Minhas matérias'){ ir('minhas'); return; } S.configSec = d.sec; S.flash = ''; desenhar(); return; }
    if (d.temaPref){ aplicarTema(d.temaPref); desenhar(); return; }
    if (d.conv){ S.convAberta = d.conv; desenhar(); return; }
    if (d.switch){ S.notif[d.switch] = !S.notif[d.switch]; desenhar(); return; }
    if (d.pessoasTurma){ S.pessoasTurma = d.pessoasTurma; S.csv.previa = null; S.flash = ''; desenhar(); return; }

    var a = d.acao;
    if (!a) return;

    if (a === 'login') return login();
    if (a === 'mostrar-senha'){ S.mostrarSenha = !S.mostrarSenha; desenhar(); return; }
    if (a === 'tarefa-2'){ S.tarefa = '2'; prepararTarefa(); return; }
    if (a === 'limpar'){ S.busca = ''; S.tags = []; desenhar(); return; }
    if (a === 'voltar-lista'){ S.convAberta = null; desenhar(); return; }
    if (a === 'importar-feed'){ S.feedSalvo = true; desenhar(); return; }
    if (a === 'pedir-material'){
      S.assuntoPre = S.busca; S.aba.duv = 'enviar';
      if (!logado()){ S.cargo = 'aluno'; el('cargo').value = 'aluno'; }
      ir('duvidas'); return;
    }
    if (a === 'enviar-duvida'){ if (S.foraHorario) S.naFila = true; else S.pedidoEnviado = true; desenhar(); return; }
    if (a === 'abrir-horario'){ S.naFila = false; S.pedidoEnviado = true; desenhar(); return; }
    if (a === 'resolveu'){ S.aba.duv = 'turma'; desenhar(); return; }
    if (a === 'simular-resposta'){ S.respostaChegou = true; S.naoLidasNotif += 1; S.naoLidasMsg += 1; ir('notificacoes'); return; }
    if (a === 'util'){ S.naoLidasMsg = 0; ir('fim3'); return; }
    if (a === 'nao-resolveu'){ S.respostaChegou = false; S.aba.msg = 'conversas'; desenhar(); return; }
    if (a === 'abrir-enquete'){ S.enqueteAberta = true; desenhar(); return; }
    if (a === 'votar'){ S.votou = true; desenhar(); return; }
    if (a === 'encerrar-enquete'){ S.etapaAulao = 'definir'; S.temaAulao = 'Complexidade na prática'; S.desempate = false; S.conflito = false; desenhar(); return; }
    if (a === 'simular-empate'){ S.etapaAulao = 'empate'; desenhar(); return; }
    if (a === 'desempatar'){ S.temaAulao = d.tema; S.desempate = true; S.etapaAulao = 'definir'; S.conflito = false; desenhar(); return; }
    if (a === 'data-aulao'){ S.dataAulao = d.dt; S.conflito = false; desenhar(); return; }
    if (a === 'confirmar-aulao'){
      // F4 · “Horário livre?”: 22/09 cai no dia da prova
      if (S.dataAulao === '22'){ S.conflito = true; desenhar(); return; }
      S.aulaoMarcado = true; S.etapaAulao = null; desenhar(); return;
    }

    // calculadora de média: abre/fecha sem redesenhar, para a transição aparecer
    if (a === 'calc'){
      S.calcAberta = !S.calcAberta;
      var pag = el('pag-materia');
      if (pag){ pag.classList.toggle('calc-aberta', S.calcAberta); b.setAttribute('aria-expanded', String(S.calcAberta)); }
      return;
    }
    if (a === 'calc-preencher'){
      var t = turma(S.turmaAberta), r = resumoTurma(t), f = r.aproveitamento === null ? 0.7 : r.aproveitamento / 100;
      S.estimativas[t.id] = {};
      r.av.forEach(function(x){ if (x.obtido === null) S.estimativas[t.id][x.nome] = Math.round(x.valor * f * 2) / 2; });
      desenhar(); return;
    }
    if (a === 'calc-limpar'){ S.estimativas[S.turmaAberta] = {}; desenhar(); return; }

    // minhas matérias
    if (a === 'ir-integracoes'){ S.configSec = 'Integrações'; ir('config'); return; }
    if (a === 'pedir-turma'){ S.vinculos.push({turma:d.v, origem:'manual', status:'pendente'}); S.buscaTurma = ''; S.flash = 'Pedido enviado. A turma aparece no seu hub quando o professor aprovar.'; desenhar(); return; }
    if (a === 'simular-aprovacao'){ S.vinculos.forEach(function(v){ if (v.turma === d.v) v.status = 'ativo'; }); S.flash = 'O professor aprovou. ' + nomeTurma(turma(d.v)) + ' já está no seu hub.'; desenhar(); return; }
    if (a === 'sair-turma'){
      var pos = S.vinculos.findIndex(function(v){ return v.turma === d.v; });
      if (pos < 0) return;
      S.flash = 'Turma removida do seu hub.';
      S.desfazer = { msg:S.flash, pos:pos, vinculo:S.vinculos.splice(pos, 1)[0] };
      desenhar(); return;
    }
    if (a === 'desfazer'){
      if (S.desfazer) S.vinculos.splice(S.desfazer.pos, 0, S.desfazer.vinculo);
      S.desfazer = null; S.flash = 'Turma de volta ao seu hub.'; desenhar(); return;
    }

    // integrações
    if (a === 'canvas-exemplo'){ S.canvas.token = '7~Hq3Zb8LmN2xRt5VwY9aK4dPf6sJc1Ue0Gi'; S.canvas.erro = ''; desenhar(); return; }
    if (a === 'canvas-mostrar'){ S.canvas.mostrar = !S.canvas.mostrar; desenhar(); return; }
    if (a === 'canvas-conectar'){
      var tk = S.canvas.token.trim();
      if (!tk){ S.canvas.erro = 'Cole o token gerado no Canvas.'; desenhar(); return; }
      if (!S.canvas.consent){ S.canvas.erro = 'Marque a autorização para o Hub ler seus dados do Canvas.'; desenhar(); return; }
      if (tk.length < 20){ S.canvas.erro = 'Token inválido ou expirado. Gere um novo no Canvas e cole de novo.'; desenhar(); return; }
      S.canvas.erro = ''; S.canvas.etapa = 'escolher'; S.canvas.escolhidos = {}; desenhar(); return;
    }
    if (a === 'canvas-cancelar'){ S.canvas.etapa = null; desenhar(); return; }
    if (a === 'canvas-importar'){
      var novos = CANVAS_CURSOS.filter(function(id){ return S.canvas.escolhidos[id] !== false; });
      S.vinculos = S.vinculos.filter(function(v){ return novos.indexOf(v.turma) < 0; })
        .concat(novos.map(function(id){ return {turma:id, origem:'canvas', status:'ativo'}; }));
      S.canvas = {conectado:true, etapa:null, token:'', consent:false, erro:'', escolhidos:{}, sync:'agora'};
      S.flash = novos.length + ' matérias importadas do Canvas. Elas já estão no seu hub.'; desenhar(); return;
    }
    if (a === 'canvas-sync'){ S.canvas.sync = 'agora'; S.flash = 'Sincronizado: nenhuma nota nova desde a última vez.'; desenhar(); return; }
    if (a === 'canvas-desconectar'){ S.canvas.confirmarSaida = true; desenhar(); return; }
    if (a === 'canvas-desconectar-nao'){ S.canvas.confirmarSaida = false; desenhar(); return; }
    if (a === 'canvas-desconectar-sim'){
      S.vinculos = S.vinculos.filter(function(v){ return v.origem !== 'canvas'; });
      S.canvas = {conectado:false, etapa:null, token:'', consent:false, erro:'', escolhidos:{}, sync:''};
      S.flash = 'Canvas desconectado e token apagado.'; desenhar(); return;
    }

    // publicar
    if (a === 'envio-exemplo'){ EXEMPLOS_ENVIO.forEach(function(x){ S.envios.push(novoEnvio(x.arquivo, x.tamanho)); }); desenhar(); return; }
    if (a === 'envio-limpar'){ S.envios = []; desenhar(); return; }
    if (a === 'envio-remover'){ S.envios = S.envios.filter(function(v){ return String(v.id) !== d.v; }); desenhar(); return; }
    if (a === 'publicar-envios'){
      var prontos = S.envios.filter(function(v){ return !problemaEnvio(v); });
      prontos.forEach(function(v){
        var novo = {id:ESTUDOS.length + 1, sigla:v.sigla, titulo:v.titulo.trim(), autor:S.cargo === 'monitor' ? 'Lorem · monitor' : PROF_EU, com:0, fav:0, chaves:norm(v.titulo + ' ' + v.desc)};
        ESTUDOS.push(novo); S.publicados.push(novo);
      });
      S.envios = S.envios.filter(function(v){ return problemaEnvio(v); });
      S.flash = prontos.length + ' estudo' + (prontos.length === 1 ? ' publicado' : 's publicados') + (S.envios.length ? '. Corrija os que sobraram para publicar.' : '.');
      desenhar(); return;
    }

    // pessoas e cargos
    if (a === 'csv-exemplo'){
      var tt = turma(S.pessoasTurma);
      S.csv.texto = 'matricula\n' + tt.membros[4].mat + '\n' + tt.membros[5].mat + '\n' + (tt.membros.filter(function(p){ return p.papel === 'monitor'; })[0] || tt.membros[6]).mat + '\n2099000001';
      S.csv.previa = null; desenhar(); return;
    }
    if (a === 'csv-previa'){
      var txt = (el('csv-texto') || {}).value || S.csv.texto;
      S.csv.texto = txt;
      if (!txt.trim()){ S.flash = 'Envie um arquivo ou cole ao menos uma matrícula.'; desenhar(); return; }
      S.csv.previa = lerCsv(txt, turma(S.pessoasTurma)); S.flash = ''; desenhar(); return;
    }
    if (a === 'csv-cancelar'){ S.csv.previa = null; desenhar(); return; }
    if (a === 'csv-confirmar'){
      var tu = turma(S.pessoasTurma), ok = S.csv.previa.filter(function(x){ return x.situacao === 'ok'; });
      ok.forEach(function(x){ tu.membros.forEach(function(p){ if (p.mat === x.mat) p.papel = S.csv.papel; }); });
      S.historico.unshift({quando:agora(), quem:quemSou(), txt:'mudou ' + ok.length + ' pessoa' + (ok.length === 1 ? '' : 's') + ' para ' + S.csv.papel + ' em ' + nomeTurma(tu), como:'arquivo'});
      S.flash = ok.length + ' cargo' + (ok.length === 1 ? ' alterado' : 's alterados') + ' em ' + nomeTurma(tu) + '.';
      S.csv = {texto:'', papel:S.csv.papel, previa:null}; desenhar(); return;
    }
    if (a === 'gerenciar-cargos'){ S.pessoasTurma = d.v; S.csv.previa = null; ir('pessoas'); return; }

    // regra de nota
    if (a === 'regra-adicionar'){ S.regraRascunho.avaliacoes.push({nome:'', valor:0}); desenhar(); return; }
    if (a === 'regra-remover'){ S.regraRascunho.avaliacoes.splice(Number(d.v), 1); desenhar(); return; }
    if (a === 'regra-salvar'){
      var rr = S.regraRascunho, erro = '';
      if (!rr.avaliacoes.length) erro = 'Cadastre ao menos uma avaliação.';
      else if (rr.avaliacoes.some(function(x){ return !String(x.nome).trim(); })) erro = 'Toda avaliação precisa de nome.';
      else if (rr.avaliacoes.some(function(x){ return !(parseFloat(x.valor) > 0); })) erro = 'Toda avaliação precisa valer mais que 0.';
      if (erro){ el('regra-erro').textContent = erro; return; }
      turma(rr.turma).regra = {aprovacao:parseFloat(rr.aprovacao) || 0, frequencia:parseFloat(rr.frequencia) || 0,
        avaliacoes:rr.avaliacoes.map(function(x){ return {nome:String(x.nome).trim(), valor:parseFloat(x.valor)}; })};
      S.flash = 'Regra salva. Os alunos de ' + nomeTurma(turma(rr.turma)) + ' já veem a calculadora de média com ela.';
      desenhar(); return;
    }
  });

  function adicionarTag(sigla){
    if (S.tags.indexOf(sigla) < 0) S.tags.push(sigla);
    var partes = S.busca.split(/\s+/); partes.pop();
    S.busca = partes.join(' ') + (partes.length ? ' ' : '');
    S.sugIdx = 0;
    redesenharFoco('busca');
    var n = el('busca'); if (n) n.setSelectionRange(n.value.length, n.value.length);
  }

  function login(){
    var v = (el('email') && el('email').value || '').trim().toLowerCase();
    S.email = v; S.erroGeral = ''; S.erroConf = '';
    if (!/@(sga\.)?exemplo\.br$/.test(v)){
      S.erroLogin = v ? 'Use seu e-mail institucional (@sga.exemplo.br ou @exemplo.br).' : 'Informe seu e-mail institucional.';
      desenhar(); return;
    }
    S.erroLogin = '';
    if (S.abaEntrar === 'criar'){
      var faltam = REGRAS_SENHA.filter(function(r){ return !r[1](S.senhaNova); });
      if (faltam.length){ S.erroGeral = 'A senha ainda precisa de: ' + faltam.map(function(r){ return r[0].toLowerCase(); }).join(', ') + '.'; desenhar(); return; }
      if (S.senhaConf !== S.senhaNova){ S.erroConf = 'As senhas não coincidem.'; desenhar(); return; }
      S.contaCriada = true;
    } else {
      // F1 · “Credenciais corretas?”: no protótipo a senha certa é 123456
      if ((el('senha') ? el('senha').value : '') !== '123456'){ S.erroGeral = 'E-mail ou senha incorretos.'; desenhar(); return; }
      S.contaCriada = false;
    }
    S.motivoLogin = ''; S.cargo = 'aluno'; el('cargo').value = 'aluno';
    S.naoLidasMsg = 1; S.naoLidasNotif = 1;
    ir('fim1');
  }

  document.addEventListener('input', function(ev){
    var t = ev.target, id = t.id, d = t.dataset;
    if (id === 'busca'){ S.busca = t.value; S.sugFechada = false; S.sugIdx = 0; redesenharFoco('busca'); return; }
    if (id === 'busca-turma'){ S.buscaTurma = t.value; redesenharFoco('busca-turma'); return; }
    if (id === 'busca-pessoa'){ S.buscaPessoa = t.value; redesenharFoco('busca-pessoa'); return; }
    if (id === 'assunto') S.assuntoPre = t.value;
    if (id === 'email') S.email = t.value;
    if (id === 'nome-novo') S.nomeNovo = t.value;
    if (id === 'senha-nova' || id === 'senha-conf'){
      if (id === 'senha-nova') S.senhaNova = t.value; else S.senhaConf = t.value;
      S.erroConf = '';
      el('regras-senha').innerHTML = regrasSenha(S.senhaNova);
      el('msg-conf').innerHTML = msgConf();
      return;
    }
    if (id === 'canvas-token') S.canvas.token = t.value;
    if (id === 'csv-texto'){ S.csv.texto = t.value; }
    if (d.aval !== undefined){
      var e = S.estimativas[S.turmaAberta] = S.estimativas[S.turmaAberta] || {};
      if (t.value === '') delete e[d.aval]; else e[d.aval] = t.value;
      atualizarCalc(); return;
    }
    if (d.regra){
      var rr = S.regraRascunho;
      if (d.i !== undefined) rr.avaliacoes[Number(d.i)][d.regra] = t.value; else rr[d.regra] = t.value;
      el('regra-soma').innerHTML = somaRegraTxt(); el('regra-erro').textContent = '';
      return;
    }
    if (d.envio){
      var v = S.envios.filter(function(x){ return String(x.id) === d.envio; })[0];
      if (v){ v[d.envioCampo] = t.value; atualizarEnvio(v); }
    }
  });

  document.addEventListener('change', function(ev){
    var t = ev.target, d = t.dataset;
    if (t.id === 'canvas-consent'){ S.canvas.consent = t.checked; return; }
    if (d.canvasCurso){ S.canvas.escolhidos[d.canvasCurso] = t.checked; return; }
    if (t.id === 'envio-arquivos'){ receberArquivos(t.files); return; }
    if (d.envio && d.envioCampo === 'sigla'){
      var v = S.envios.filter(function(x){ return String(x.id) === d.envio; })[0];
      if (v){ v.sigla = t.value; atualizarEnvio(v); } return;
    }
    if (t.id === 'csv-papel'){ S.csv.papel = t.value; if (S.csv.previa){ S.csv.previa = lerCsv(S.csv.texto, turma(S.pessoasTurma)); desenhar(); } return; }
    if (t.id === 'csv-arquivo' && t.files[0]){
      var leitor = new FileReader();
      leitor.onload = function(){ S.csv.texto = String(leitor.result); S.csv.previa = null; desenhar(); };
      leitor.readAsText(t.files[0]); return;
    }
    if (d.papel){
      var tu = turma(S.pessoasTurma), p = tu.membros.filter(function(x){ return x.mat === d.papel; })[0];
      if (!p || p.papel === t.value) return;
      S.historico.unshift({quando:agora(), quem:quemSou(), txt:'mudou ' + p.nome + ' de ' + p.papel + ' para ' + t.value + ' em ' + nomeTurma(tu), como:'página'});
      p.papel = t.value;
      S.flash = p.nome + ' agora é ' + t.value + ' em ' + nomeTurma(tu) + '.';
      desenhar(); return;
    }
  });

  document.addEventListener('keydown', function(ev){
    if (ev.target.id !== 'busca') return;
    var sug = sugestoes();
    if (ev.key === 'ArrowDown' && sug.length){ ev.preventDefault(); S.sugIdx = (S.sugIdx + 1) % sug.length; redesenharFoco('busca'); }
    else if (ev.key === 'ArrowUp' && sug.length){ ev.preventDefault(); S.sugIdx = (S.sugIdx - 1 + sug.length) % sug.length; redesenharFoco('busca'); }
    else if ((ev.key === 'Enter' || ev.key === 'Tab') && sug.length){ ev.preventDefault(); adicionarTag(sug[S.sugIdx].sigla); }
    else if (ev.key === 'Escape' && sug.length){ S.sugFechada = true; redesenharFoco('busca'); }
    else if (ev.key === 'Backspace' && !ev.target.value && S.tags.length){ S.tags.pop(); redesenharFoco('busca'); }
  });

  // arrastar arquivos para a área de publicar
  document.addEventListener('dragover', function(ev){ var z = ev.target.closest && ev.target.closest('#dropzone'); if (z){ ev.preventDefault(); z.classList.add('arrastando'); } });
  document.addEventListener('dragleave', function(ev){ var z = ev.target.closest && ev.target.closest('#dropzone'); if (z) z.classList.remove('arrastando'); });
  document.addEventListener('drop', function(ev){ var z = ev.target.closest && ev.target.closest('#dropzone'); if (z){ ev.preventDefault(); receberArquivos(ev.dataTransfer.files); } });

  // ---------- versão mobile ----------
  // desktop e celular são dois apps; o cargo e a tarefa andam juntos pelos dois via postMessage
  var vistaCel = false, cargoNoCelular = S.cargo, fone = el('fone');
  function cargoCelular(c){ return c; }
  // o tema é salvo no navegador: se o celular embutido mudar, o desktop acompanha
  window.addEventListener('storage', function(e){
    if (e.key === 'hub-tema' && e.newValue){ aplicarTema(e.newValue); if (S.tela === 'config') desenhar(); }
  });
  function paraCelular(msg){
    msg.hub = 1;
    if (fone && fone.contentWindow) fone.contentWindow.postMessage(msg, '*');
  }
  window.addEventListener('message', function(ev){
    if (!fone || ev.source !== fone.contentWindow || !ev.data || ev.data.hub !== 1) return;
    if (ev.data.tipo === 'pronto'){
      paraCelular({tipo:'tarefa', v:S.tarefa});
      paraCelular({tipo:'horario', v:S.foraHorario});
      cargoNoCelular = S.cargo;
    }
    // com o celular escondido, a mudança de cargo que ele manda é só eco da tarefa: ignora
    if (ev.data.tipo === 'cargo' && vistaCel && ev.data.v !== cargoCelular(S.cargo)){
      S.cargo = cargoNoCelular = ev.data.v;
      el('cargo').value = S.cargo;
      desenhar();
    }
  });

  el('vista').addEventListener('click', function(){
    vistaCel = !vistaCel;
    if (vistaCel){ paraCelular({tipo:'cargo', v:cargoCelular(S.cargo)}); cargoNoCelular = S.cargo; }
    this.setAttribute('aria-pressed', vistaCel ? 'true' : 'false');
    this.textContent = vistaCel ? 'Ver no desktop' : 'Ver no celular';
    el('app').hidden = vistaCel;
    el('celular').hidden = !vistaCel;
    desenhar();
    window.scrollTo({top:0});
  });

  el('cargo').addEventListener('change', function(){
    S.cargo = this.value;
    if (S.cargo === 'visitante'){ S.naoLidasMsg = 0; S.naoLidasNotif = 0; if (S.tela !== 'inicio' && S.tela !== 'entrar' && S.tela !== 'estudos') S.tela = 'inicio'; }
    desenhar();
  });

  el('horario').addEventListener('change', function(){
    S.foraHorario = this.value === 'fora';
    paraCelular({tipo:'horario', v:S.foraHorario});
    desenhar();
  });

  el('tema').addEventListener('click', function(){
    aplicarTema(document.documentElement.getAttribute('data-tema') === 'escuro' ? 'claro' : 'escuro');
    if (S.tela === 'config') desenhar();
  });

  function botaoMenu(rot, tela){ return '<button data-ir="' + tela + '">' + rot + '</button>'; }
  function abrirMenu(qual){
    var p = el('menu-perfil'), n = el('menu-notif'), hm = el('menu-ham');
    if (qual === 'ham'){
      p.hidden = true; n.hidden = true;
      hm.hidden = !hm.hidden;
      var itens = [botaoMenu('Início', 'inicio'), botaoMenu('Estudos', 'estudos'), botaoMenu('Calendário', 'calendario'), botaoMenu('Dúvidas &amp; Feedback', 'duvidas')];
      if (equipe()) itens.push(botaoMenu('Publicar', 'publicar'));
      if (docente()) itens.push(botaoMenu('Relatórios', 'relatorios'), botaoMenu('Pessoas e cargos', 'pessoas'));
      hm.innerHTML = itens.join('') + '<div class="sep"></div>' +
        '<div class="pad-p linha"><span class="avatar avatar-p"></span><b>Lorem Ipsum</b></div>' +
        botaoMenu('Meu perfil', 'perfil') + botaoMenu('Minhas matérias', 'minhas') + botaoMenu('Configurações', 'config') +
        '<div class="sep"></div><button data-acao="sair" class="item-perigo">Sair</button>';
      return;
    }
    hm.hidden = true;
    if (qual === 'perfil'){
      n.hidden = true;
      p.hidden = !p.hidden;
      p.innerHTML = '<div class="pad-p"><b>Lorem Ipsum</b><div class="sub">' + S.cargo + ' · sga.exemplo.br</div></div>' +
        '<div class="sep"></div><button data-ir="perfil">Meu perfil</button><button data-ir="minhas">Minhas matérias</button>' +
        (docente() ? '<button data-ir="pessoas">Pessoas e cargos</button>' : '') +
        '<div class="sep"></div><button data-ir="config">Configurações</button>' +
        '<div class="sep"></div><button data-acao="sair" class="item-perigo">Sair</button>';
    } else {
      p.hidden = true;
      n.hidden = !n.hidden;
      S.naoLidasNotif = 0;
      n.innerHTML = '<div class="pad-p"><b>Notificações</b></div>' +
        (S.respostaChegou ? '<button data-ir="mensagens"><b>Ipsum (monitor)</b> respondeu seu pedido #143<div class="sub">há 6 min</div></button>' : '') +
        (S.enqueteAberta && !equipe() ? '<button data-ir="duvidas"><b>Enquete aberta</b> — tema do aulão<div class="sub">há 5 h</div></button>' : '') +
        '<button data-ir="estudos">Novo estudo em CALC2<div class="sub">ontem</div></button>' +
        '<div class="sep"></div><button data-ir="notificacoes" class="centro">Ver todas</button>';
      desenharNav();
      n.hidden = false;
    }
  }
  document.addEventListener('click', function(ev){
    if (ev.target.closest('[data-acao="sair"]')){ S.cargo = 'visitante'; el('cargo').value = 'visitante'; ir('inicio'); }
  });

  // botões da barra de teste (fora do app)
  Array.prototype.forEach.call(document.querySelectorAll('#tarefas button'), function(b){
    b.addEventListener('click', function(){ S.tarefa = b.dataset.t; prepararTarefa(); });
  });

  function prepararTarefa(){
    Array.prototype.forEach.call(document.querySelectorAll('#tarefas button'), function(b){
      b.setAttribute('aria-pressed', b.dataset.t === S.tarefa ? 'true' : 'false');
    });
    S.flash = '';
    if (S.tarefa === '1'){ S.cargo = 'visitante'; S.busca = ''; S.tags = []; S.erroLogin = ''; S.erroGeral = ''; S.motivoLogin = ''; S.email = ''; S.favoritos = {}; S.abaEntrar = 'entrar'; S.tela = 'inicio'; }
    if (S.tarefa === '2'){ S.cargo = 'aluno'; S.busca = ''; S.tags = []; S.tela = 'estudos'; }
    if (S.tarefa === '3'){ S.cargo = 'aluno'; S.aba.duv = 'turma'; S.pedidoEnviado = false; S.respostaChegou = false; S.naFila = false; S.tela = 'duvidas'; }
    if (S.tarefa === '4'){ S.cargo = 'monitor'; S.aba.duv = 'turma'; S.enqueteAberta = false; S.aulaoMarcado = false; S.etapaAulao = null; S.temaAulao = 'Complexidade na prática'; S.dataAulao = '18'; S.conflito = false; S.desempate = false; S.tela = 'duvidas'; }
    el('cargo').value = S.cargo;
    paraCelular({tipo:'tarefa', v:S.tarefa});
    cargoNoCelular = S.cargo;
    desenhar();
  }

  // tema salvo neste navegador
  var temaSalvo = 'claro';
  try { temaSalvo = localStorage.getItem('hub-tema') || 'claro'; } catch (e) {}
  aplicarTema(temaSalvo);

  // ?tarefa=1..4 coloca as duas versões no ponto de partida; ?vista=celular abre o mobile; ?tela=… abre uma tela direto
  var params = new URLSearchParams(location.search);
  if (/^[1-4]$/.test(params.get('tarefa') || '')){ S.tarefa = params.get('tarefa'); prepararTarefa(); }
  if (/^(visitante|aluno|monitor|professor|admin)$/.test(params.get('cargo') || '')){ S.cargo = params.get('cargo'); el('cargo').value = S.cargo; }
  if (params.get('tela') && telas[params.get('tela')]) S.tela = params.get('tela');
  desenhar();
  if (params.get('vista') === 'celular') el('vista').click();
})();
