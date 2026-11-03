// Hub de Estudos - Cadastro de eventos do calendário
// Os dados ficam no JSON Server (codigo/db/db.json). Para rodar: npm start, na raiz do repositório.
// Os endereços abaixo são relativos ("/eventos"): a página e a API saem do mesmo servidor.

const URL_API = '';

// cores usadas para as matérias, na ordem em que elas aparecem na lista
const coresMaterias = ['#2b5fc4', '#b08a00', '#8a2be2', '#2e7d32', '#d81b60', '#00838f'];

const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
    'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const nomesDias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
    'Quinta-feira', 'Sexta-feira', 'Sábado'];
const nomesTipos = { prova: 'Prova', trabalho: 'Trabalho', tarefa: 'Tarefa', quiz: 'Quiz', aulao: 'Aulão' };

let materias = [];
let eventos = [];

const hoje = new Date();
let anoAtual = hoje.getFullYear();
let mesAtual = hoje.getMonth();      // janeiro = 0
let diaSelecionado = montarData(anoAtual, mesAtual + 1, hoje.getDate());
let filtro = 'todas';


// ===== Funções de apoio =====


function montarData(ano, mes, dia) {
    if (mes < 10) mes = '0' + mes;
    if (dia < 10) dia = '0' + dia;
    return `${ano}-${mes}-${dia}`;
}


function formatarData(data) {
    const partes = data.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function buscarMateria(id) {
    return materias.find(m => m.id == id);
}

function corDaMateria(id) {
    const posicao = materias.findIndex(m => m.id == id);
    if (posicao === -1) return 'gray';
    return coresMaterias[posicao % coresMaterias.length];
}

// eventos de um dia, respeitando o filtro e ordenados pela hora
function eventosDoDia(data) {
    const lista = eventos.filter(ev => ev.data === data && (filtro === 'todas' || ev.materiaId == filtro));
    lista.sort((a, b) => a.hora > b.hora ? 1 : -1);
    return lista;
}

function mostrarMensagem(texto) {
    document.getElementById('mensagem').innerText = texto;
}


// ===== Comunicação com o JSON Server =====

function carregarDados() {
    fetch(URL_API + '/materias')
        .then(resposta => resposta.json())
        .then(dados => {
            materias = dados;
            montarSelects();
            montarLegenda();
            carregarEventos();
        })
        .catch(erro => {
            console.log(erro);
            mostrarMensagem('Não foi possível acessar o servidor. Rode npm start e abra http://localhost:3000/modulos/calendario/cadastro-eventos.html');
        });
}

// READ - busca todos os eventos e redesenha a tela
function carregarEventos() {
    fetch(URL_API + '/eventos')
        .then(resposta => resposta.json())
        .then(dados => {
            eventos = dados;
            montarCalendario();
            montarEventosDoDia();
        });
}

// CREATE
function incluirEvento(evento) {
    fetch(URL_API + '/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evento)
    })
        .then(resposta => resposta.json())
        .then(() => {
            mostrarMensagem('Evento cadastrado!');
            limparFormulario();
            carregarEventos();
        });
}

// UPDATE
function alterarEvento(id, evento) {
    fetch(URL_API + '/eventos/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evento)
    })
        .then(resposta => resposta.json())
        .then(() => {
            mostrarMensagem('Evento alterado!');
            limparFormulario();
            carregarEventos();
        });
}

// DELETE
function excluirEvento(id) {
    if (!confirm('Deseja mesmo excluir este evento?')) {
        return;
    }
    fetch(URL_API + '/eventos/' + id, { method: 'DELETE' })
        .then(() => {
            mostrarMensagem('Evento excluído!');
            limparFormulario();
            carregarEventos();
        });
}




function montarSelects() {
    let opcoesFiltro = '<option value="todas">Todas as matérias</option>';
    let opcoesForm = '';
    for (let i = 0; i < materias.length; i++) {
        const m = materias[i];
        opcoesFiltro += `<option value="${m.id}">${m.sigla}</option>`;
        opcoesForm += `<option value="${m.id}">${m.sigla} - ${m.nome}</option>`;
    }
    document.getElementById('filtroMateria').innerHTML = opcoesFiltro;
    document.getElementById('materia').innerHTML = opcoesForm;
}

function montarLegenda() {
    let html = '';
    materias.forEach(m => {
        html += `<span><span class="cor" style="background-color: ${corDaMateria(m.id)}"></span>${m.sigla}</span>`;
    });
    document.getElementById('legenda').innerHTML = html;
}

function montarCalendario() {
    document.getElementById('tituloMes').innerText = `${nomesMeses[mesAtual]} de ${anoAtual}`;

    const primeiroDiaSemana = new Date(anoAtual, mesAtual, 1).getDay();   // 0 = domingo
    const totalDias = new Date(anoAtual, mesAtual + 1, 0).getDate();      // dia 0 do mês seguinte = último dia deste mês
    const dataHoje = montarData(hoje.getFullYear(), hoje.getMonth() + 1, hoje.getDate());

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

        let eventosHtml = '';
        const lista = eventosDoDia(data);
        for (let i = 0; i < lista.length; i++) {
            eventosHtml += `<div class="evento-mini" style="border-color: ${corDaMateria(lista[i].materiaId)}">${lista[i].titulo}</div>`;
        }

        html += `<div class="${classes}" onclick="selecionarDia('${data}')">
                    <span class="numero">${dia}</span>
                    ${eventosHtml}
                 </div>`;
    }

    document.getElementById('grade').innerHTML = html;
}

function montarEventosDoDia() {
    const partes = diaSelecionado.split('-');
    const diaDaSemana = new Date(partes[0], partes[1] - 1, partes[2]).getDay();
    document.getElementById('tituloDia').innerText = `${nomesDias[diaDaSemana]}, ${formatarData(diaSelecionado)}`;

    const lista = eventosDoDia(diaSelecionado);

    if (lista.length === 0) {
        document.getElementById('eventosDia').innerHTML = '<p class="sem-evento">Nada marcado neste dia.</p>';
        return;
    }

    let html = '';
    lista.forEach(ev => {
        const materia = buscarMateria(ev.materiaId);
        let detalhes = `${materia ? materia.sigla : '?'} - ${nomesTipos[ev.tipo]}`;
        if (ev.hora) detalhes += ` - ${ev.hora}`;
        else detalhes += ' - dia inteiro';
        if (ev.sala) detalhes += ` - sala ${ev.sala}`;

        html += `<div class="evento" style="border-color: ${corDaMateria(ev.materiaId)}">
                    <h4>${ev.titulo}</h4>
                    <p>${detalhes}</p>
                    <button class="btn btn-outline-primary btn-sm" onclick="editarEvento('${ev.id}')">Editar</button>
                    <button class="btn btn-outline-danger btn-sm" onclick="excluirEvento('${ev.id}')">Excluir</button>
                 </div>`;
    });
    document.getElementById('eventosDia').innerHTML = html;
}



function selecionarDia(data) {
    diaSelecionado = data;
    montarCalendario();
    montarEventosDoDia();
    if (document.getElementById('eventoId').value === '') {
        document.getElementById('data').value = data;
    }
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
    anoAtual = hoje.getFullYear();
    mesAtual = hoje.getMonth();
    selecionarDia(montarData(anoAtual, mesAtual + 1, hoje.getDate()));
}


function editarEvento(id) {
    const ev = eventos.find(item => item.id == id);
    document.getElementById('eventoId').value = ev.id;
    document.getElementById('titulo').value = ev.titulo;
    document.getElementById('materia').value = ev.materiaId;
    document.getElementById('tipo').value = ev.tipo;
    document.getElementById('data').value = ev.data;
    document.getElementById('hora').value = ev.hora;
    document.getElementById('sala').value = ev.sala;

    document.getElementById('tituloForm').innerText = 'Editar evento';
    document.getElementById('btnSalvar').innerText = 'Salvar alterações';
    mostrarMensagem('');
    document.getElementById('titulo').focus();
}

function limparFormulario() {
    document.getElementById('formEvento').reset();
    document.getElementById('eventoId').value = '';
    document.getElementById('data').value = diaSelecionado;
    document.getElementById('tituloForm').innerText = 'Novo evento';
    document.getElementById('btnSalvar').innerText = 'Salvar evento';
}

function salvarEvento(event) {
    event.preventDefault();

    const evento = {
        titulo: document.getElementById('titulo').value.trim(),
        materiaId: Number(document.getElementById('materia').value),
        tipo: document.getElementById('tipo').value,
        data: document.getElementById('data').value,
        hora: document.getElementById('hora').value,
        sala: document.getElementById('sala').value.trim()
    };

    if (evento.titulo === '') {
        mostrarMensagem('Escreva o título do evento.');
        return;
    }

    // mostra no calendário o mês do evento salvo
    const partes = evento.data.split('-');
    anoAtual = Number(partes[0]);
    mesAtual = Number(partes[1]) - 1;
    diaSelecionado = evento.data;

    const id = document.getElementById('eventoId').value;
    if (id === '') {
        incluirEvento(evento);
    } else {
        alterarEvento(id, evento);
    }
}


document.getElementById('btnAnterior').addEventListener('click', function () {
    mudarMes(-1);
});

document.getElementById('btnProximo').addEventListener('click', function () {
    mudarMes(1);
});

document.getElementById('btnHoje').addEventListener('click', irParaHoje);

document.getElementById('filtroMateria').addEventListener('change', function () {
    filtro = this.value;
    montarCalendario();
    montarEventosDoDia();
});

document.getElementById('formEvento').addEventListener('submit', salvarEvento);

document.getElementById('btnLimpar').addEventListener('click', function () {
    limparFormulario();
    mostrarMensagem('');
});

window.addEventListener('load', function () {
    document.getElementById('data').value = diaSelecionado;
    carregarDados();
});
