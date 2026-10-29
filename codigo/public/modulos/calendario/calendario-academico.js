// Hub de Estudos - Calendário acadêmico (visão mensal e próximas entregas)
// Só apresenta os eventos. Eles são cadastrados na tela cadastro-eventos.html (Sprint 1).
// Os dados vêm do JSON Server (codigo/db/db.json). Para rodar: npm start, na raiz do repositório.

const URL_API = '';

// mesmas cores da tela de cadastro, na ordem em que as matérias aparecem
const coresMaterias = ['#2b5fc4', '#b08a00', '#8a2be2', '#2e7d32', '#d81b60', '#00838f'];

const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
    'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
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


// ===== Funções de apoio =====

function montarData(ano, mes, dia) {
    if (mes < 10) mes = '0' + mes;
    if (dia < 10) dia = '0' + dia;
    return `${ano}-${mes}-${dia}`;
}

function formatarData(data) {
    const partes = data.split('-');
    return `${partes[2]}/${partes[1]}`;
}

// transforma "AAAA-MM-DD" em Date (meia-noite do horário local)
function paraDate(data) {
    const partes = data.split('-');
    return new Date(partes[0], partes[1] - 1, partes[2]);
}

function diasAte(data) {
    const umDia = 1000 * 60 * 60 * 24;
    return Math.round((paraDate(data) - paraDate(dataHoje)) / umDia);
}

function textoFaltam(dias) {
    if (dias === 0) return 'hoje';
    if (dias === 1) return 'amanhã';
    return `faltam ${dias} dias`;
}

function buscarMateria(id) {
    return materias.find(m => m.id == id);
}

function siglaDaMateria(id) {
    const materia = buscarMateria(id);
    if (materia) return materia.sigla;
    return '?';
}

function corDaMateria(id) {
    const posicao = materias.findIndex(m => m.id == id);
    if (posicao === -1) return 'gray';
    return coresMaterias[posicao % coresMaterias.length];
}

// eventos de um dia, ordenados pela hora (sem hora = dia inteiro, vem primeiro)
function eventosDoDia(data) {
    const lista = eventos.filter(ev => ev.data === data);
    lista.sort((a, b) => a.hora > b.hora ? 1 : -1);
    return lista;
}

function mostrarMensagem(texto) {
    document.getElementById('mensagem').innerText = texto;
}

// evita que o texto cadastrado seja lido como HTML
function textoSeguro(texto) {
    return String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}


// ===== Leitura do JSON Server =====

async function carregarDados() {
    try {
        const [respMaterias, respEventos] = await Promise.all([
            fetch(URL_API + '/materias'),
            fetch(URL_API + '/eventos?_sort=data,hora&_order=asc,asc')
        ]);
        if (!respMaterias.ok || !respEventos.ok) throw new Error('Resposta inválida do servidor');

        materias = await respMaterias.json();
        eventos = await respEventos.json();

        montarLegenda();
        montarCalendario();
        montarProximas();
    } catch (erro) {
        console.log(erro);
        mostrarMensagem('Não foi possível acessar o servidor. Rode npm start e abra http://localhost:3000/modulos/calendario/calendario-academico.html');
    }
}


// ===== Montagem da tela (DOM) =====

function montarLegenda() {
    let html = '';
    materias.forEach(m => {
        html += `<span><span class="cor" style="background-color: ${corDaMateria(m.id)}"></span>${textoSeguro(m.sigla)}</span>`;
    });
    document.getElementById('legenda').innerHTML = html;
}

function montarCalendario() {
    document.getElementById('tituloMes').innerText = `${nomesMeses[mesAtual]} de ${anoAtual}`;

    const primeiroDiaSemana = new Date(anoAtual, mesAtual, 1).getDay();   // 0 = domingo
    const totalDias = new Date(anoAtual, mesAtual + 1, 0).getDate();      // dia 0 do mês seguinte = último dia deste mês

    let html = '';

    // espaços vazios antes do dia 1
    for (let i = 0; i < primeiroDiaSemana; i++) {
        html += '<div class="dia vazio"></div>';
    }

    for (let dia = 1; dia <= totalDias; dia++) {
        const data = montarData(anoAtual, mesAtual + 1, dia);

        let classes = 'dia';
        if (data === dataHoje) classes += ' hoje';
        if (data === diaSelecionado) classes += ' selecionado';
        if (data < dataHoje) classes += ' passado';

        let eventosHtml = '';
        eventosDoDia(data).forEach(ev => {
            const dica = `${siglaDaMateria(ev.materiaId)} - ${nomesTipos[ev.tipo]}${ev.hora ? ' - ' + ev.hora : ''}`;
            eventosHtml += `<div class="evento-mini" style="border-color: ${corDaMateria(ev.materiaId)}"
                                title="${textoSeguro(dica)}">${textoSeguro(ev.titulo)}</div>`;
        });

        html += `<div class="${classes}" data-data="${data}">
                    <span class="numero">${dia}</span>
                    ${eventosHtml}
                 </div>`;
    }

    document.getElementById('grade').innerHTML = html;
}

function montarProximas() {
    const proximas = eventos
        .filter(ev => ev.data >= dataHoje)
        .slice(0, LIMITE_PROXIMAS);

    const lista = document.getElementById('proximas');

    if (proximas.length === 0) {
        lista.innerHTML = '<li class="sem-evento">Nenhuma entrega pela frente.</li>';
        return;
    }

    let html = '';
    proximas.forEach(ev => {
        const dias = diasAte(ev.data);
        let classeUrgencia = '';
        if (dias <= 2) classeUrgencia = 'urgente';
        else if (dias <= 7) classeUrgencia = 'perto';

        let detalhes = `${textoSeguro(siglaDaMateria(ev.materiaId))} · ${nomesTipos[ev.tipo]} · ${formatarData(ev.data)}`;
        if (ev.hora) detalhes += ` · ${ev.hora}`;

        html += `<li class="proxima" style="border-color: ${corDaMateria(ev.materiaId)}" data-data="${ev.data}">
                    <div>
                        <h4>${textoSeguro(ev.titulo)}</h4>
                        <p>${detalhes}</p>
                    </div>
                    <span class="faltam ${classeUrgencia}">${textoFaltam(dias)}</span>
                 </li>`;
    });
    lista.innerHTML = html;
}


// ===== Ações do usuário =====

function selecionarDia(data) {
    diaSelecionado = data;
    const partes = data.split('-');
    anoAtual = Number(partes[0]);
    mesAtual = Number(partes[1]) - 1;
    montarCalendario();
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


// ===== Eventos da página =====

document.getElementById('btnAnterior').addEventListener('click', function () {
    mudarMes(-1);
});

document.getElementById('btnProximo').addEventListener('click', function () {
    mudarMes(1);
});

document.getElementById('btnHoje').addEventListener('click', irParaHoje);

// clique em um dia da grade (um só ouvinte para todos os dias)
document.getElementById('grade').addEventListener('click', function (event) {
    const dia = event.target.closest('.dia');
    if (dia && dia.dataset.data) selecionarDia(dia.dataset.data);
});

// clique em uma próxima entrega: o calendário vai para o dia dela
document.getElementById('proximas').addEventListener('click', function (event) {
    const item = event.target.closest('.proxima');
    if (item) selecionarDia(item.dataset.data);
});

window.addEventListener('load', carregarDados);
