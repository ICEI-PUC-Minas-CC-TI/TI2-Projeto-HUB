// Hub de Estudos - Calendário acadêmico (visão mensal, eventos do dia e próximas entregas)
// Só apresenta os eventos. Eles são cadastrados na tela cadastro-eventos.html (Sprint 1).
// Os dados vêm do JSON Server (codigo/db/db.json). Para rodar: npm start, na raiz do repositório.

const URL_API = '';

// mesmas cores da tela de cadastro, na ordem em que as matérias aparecem
const coresMaterias = ['#2b5fc4', '#b08a00', '#8a2be2', '#2e7d32', '#d81b60', '#00838f'];

const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
    'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const nomesDias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
    'Quinta-feira', 'Sexta-feira', 'Sábado'];
const nomesTipos = { prova: 'Prova', trabalho: 'Trabalho', tarefa: 'Tarefa', quiz: 'Quiz', aulao: 'Aulão' };

// quantos itens aparecem em "Próximas entregas"
const LIMITE_PROXIMAS = 6;

let materias = [];
let eventos = [];

const hoje = new Date();
const dataHoje = montarData(hoje.getFullYear(), hoje.getMonth() + 1, hoje.getDate());
let anoAtual = hoje.getFullYear();
let mesAtual = hoje.getMonth();      // janeiro = 0
let diaSelecionado = dataHoje;
let filtroMateria = 'todas';
let filtroTipo = 'todos';


// ===== Funções de apoio =====

function montarData(ano, mes, dia) {
    if (mes < 10) mes = '0' + mes;
    if (dia < 10) dia = '0' + dia;
    return `${ano}-${mes}-${dia}`;
}

// "AAAA-MM-DD" -> "dd/mm/aaaa"
function formatarDataCompleta(data) {
    const partes = data.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function formatarData(data) {
    const partes = data.split('-');
    return `${partes[2]}/${partes[1]}`;
}

// quantos dias faltam de hoje até a data ("AAAA-MM-DD")
function diasAte(data) {
    const partes = data.split('-');
    const dia = new Date(partes[0], partes[1] - 1, partes[2]);
    const inicioDeHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const umDia = 1000 * 60 * 60 * 24;
    return Math.round((dia - inicioDeHoje) / umDia);
}

function textoFaltam(dias) {
    if (dias === 0) return 'hoje';
    if (dias === 1) return 'amanhã';
    return `faltam ${dias} dias`;
}

function siglaDaMateria(id) {
    const materia = materias.find(m => m.id == id);
    if (materia) return materia.sigla;
    return '?';
}

function corDaMateria(id) {
    const posicao = materias.findIndex(m => m.id == id);
    if (posicao === -1) return 'gray';
    return coresMaterias[posicao % coresMaterias.length];
}

// o evento aparece se combinar com os dois filtros
function passaNoFiltro(ev) {
    const materiaOk = filtroMateria === 'todas' || ev.materiaId == filtroMateria;
    const tipoOk = filtroTipo === 'todos' || ev.tipo === filtroTipo;
    return materiaOk && tipoOk;
}

// eventos de um dia, respeitando os filtros e ordenados pela hora
function eventosDoDia(data) {
    const lista = eventos.filter(ev => ev.data === data && passaNoFiltro(ev));
    lista.sort((a, b) => a.hora > b.hora ? 1 : -1);
    return lista;
}

function mostrarMensagem(texto) {
    document.getElementById('mensagem').textContent = texto;
}


// ===== Leitura do JSON Server (chamada no onload) =====

async function carregarDados() {
    try {
        const respMaterias = await fetch(URL_API + '/materias');
        if (!respMaterias.ok) throw new Error(`Erro ${respMaterias.status}`);
        materias = await respMaterias.json();

        const respEventos = await fetch(URL_API + '/eventos?_sort=data,hora&_order=asc,asc');
        if (!respEventos.ok) throw new Error(`Erro ${respEventos.status}`);
        eventos = await respEventos.json();

        montarFiltroMaterias();
        montarLegenda();
        montarCalendario();
        montarEventosDoDia();
        montarProximas();
    } catch (erro) {
        console.log(erro);
        mostrarMensagem('Não foi possível acessar o servidor. Rode npm start e abra http://localhost:3000/modulos/calendario/calendario-academico.html');
    }
}


// ===== Montagem da tela (cópias dos modelos <template> do HTML) =====

// opções do filtro de matéria, vindas do GET /materias
function montarFiltroMaterias() {
    const select = document.getElementById('filtroMateria');
    materias.forEach(m => {
        const copia = document.getElementById('modelo-opcao').content.cloneNode(true);
        const opcao = copia.querySelector('option');
        opcao.value = m.id;
        opcao.textContent = m.sigla;
        select.appendChild(copia);
    });
}

function montarLegenda() {
    const legenda = document.getElementById('legenda');
    legenda.innerHTML = '';

    materias.forEach(m => {
        const item = document.getElementById('modelo-legenda').content.cloneNode(true);
        item.querySelector('.cor').style.backgroundColor = corDaMateria(m.id);
        item.querySelector('.sigla').textContent = m.sigla;
        legenda.appendChild(item);
    });
}

function montarCalendario() {
    document.getElementById('tituloMes').textContent = `${nomesMeses[mesAtual]} de ${anoAtual}`;

    const grade = document.getElementById('grade');
    grade.innerHTML = '';

    const primeiroDiaSemana = new Date(anoAtual, mesAtual, 1).getDay();   // 0 = domingo
    const totalDias = new Date(anoAtual, mesAtual + 1, 0).getDate();      // dia 0 do mês seguinte = último dia deste mês

    // espaços vazios antes do dia 1
    for (let i = 0; i < primeiroDiaSemana; i++) {
        grade.appendChild(document.getElementById('modelo-vazio').content.cloneNode(true));
    }

    for (let numero = 1; numero <= totalDias; numero++) {
        const data = montarData(anoAtual, mesAtual + 1, numero);

        const copia = document.getElementById('modelo-dia').content.cloneNode(true);
        const dia = copia.querySelector('.dia');
        dia.querySelector('.numero').textContent = numero;

        if (data === dataHoje) dia.classList.add('hoje');
        if (data === diaSelecionado) dia.classList.add('selecionado');
        if (data < dataHoje) dia.classList.add('passado');

        dia.onclick = function () {
            selecionarDia(data);
        };

        eventosDoDia(data).forEach(ev => {
            const mini = document.getElementById('modelo-evento-mini').content.cloneNode(true);
            const barra = mini.querySelector('.evento-mini');
            barra.textContent = ev.titulo;
            barra.title = `${siglaDaMateria(ev.materiaId)} - ${nomesTipos[ev.tipo]} ${ev.hora}`;
            barra.style.borderColor = corDaMateria(ev.materiaId);
            dia.appendChild(mini);
        });

        grade.appendChild(copia);
    }
}

function montarProximas() {
    const lista = document.getElementById('proximas');
    lista.innerHTML = '';

    const proximas = eventos.filter(ev => ev.data >= dataHoje && passaNoFiltro(ev)).slice(0, LIMITE_PROXIMAS);
    document.getElementById('semProximas').hidden = proximas.length > 0;

    proximas.forEach(ev => {
        const copia = document.getElementById('modelo-proxima').content.cloneNode(true);
        const item = copia.querySelector('.proxima');
        const dias = diasAte(ev.data);

        let detalhes = `${siglaDaMateria(ev.materiaId)} · ${nomesTipos[ev.tipo]} · ${formatarData(ev.data)}`;
        if (ev.hora) detalhes += ` · ${ev.hora}`;

        item.style.borderColor = corDaMateria(ev.materiaId);
        item.querySelector('.proxima-titulo').textContent = ev.titulo;
        item.querySelector('.proxima-detalhes').textContent = detalhes;

        const faltam = item.querySelector('.faltam');
        faltam.textContent = textoFaltam(dias);
        if (dias <= 2) faltam.classList.add('urgente');
        else if (dias <= 7) faltam.classList.add('perto');

        // clicar na entrega leva o calendário até o dia dela
        item.onclick = function () {
            selecionarDia(ev.data);
        };

        lista.appendChild(copia);
    });
}


function montarEventosDoDia() {
    const partes = diaSelecionado.split('-');
    const diaDaSemana = new Date(partes[0], partes[1] - 1, partes[2]).getDay();
    document.getElementById('tituloDia').textContent = `${nomesDias[diaDaSemana]}, ${formatarDataCompleta(diaSelecionado)}`;

    const lista = document.getElementById('eventosDia');
    lista.innerHTML = '';

    const doDia = eventosDoDia(diaSelecionado);
    document.getElementById('semEventosDia').hidden = doDia.length > 0;

    doDia.forEach(ev => {
        const copia = document.getElementById('modelo-evento-dia').content.cloneNode(true);
        const item = copia.querySelector('.evento');

        let detalhes = `${siglaDaMateria(ev.materiaId)} - ${nomesTipos[ev.tipo]}`;
        if (ev.hora) detalhes += ` - ${ev.hora}`;
        else detalhes += ' - dia inteiro';
        if (ev.sala) detalhes += ` - sala ${ev.sala}`;

        item.style.borderColor = corDaMateria(ev.materiaId);
        item.querySelector('.evento-titulo').textContent = ev.titulo;
        item.querySelector('.evento-detalhes').textContent = detalhes;
        lista.appendChild(copia);
    });
}


// ===== Ações do usuário (chamadas pelo HTML) =====

function selecionarDia(data) {
    diaSelecionado = data;
    const partes = data.split('-');
    anoAtual = Number(partes[0]);
    mesAtual = Number(partes[1]) - 1;
    montarCalendario();
    montarEventosDoDia();
}

// chamada no onchange dos dois filtros
function aplicarFiltros() {
    filtroMateria = document.getElementById('filtroMateria').value;
    filtroTipo = document.getElementById('filtroTipo').value;
    montarCalendario();
    montarEventosDoDia();
    montarProximas();
}

function mudarMes(quantidade) {
    mesAtual = mesAtual + quantidade;
    if (mesAtual < 0) {
        mesAtual = 11;
        anoAtual--;
    }
    if (mesAtual > 11) {
        mesAtual = 0;
        anoAtual++;
    }
    montarCalendario();
}

function irParaHoje() {
    selecionarDia(dataHoje);
}
