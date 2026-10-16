# Cadastro de eventos do calendário · Para a correção

| | |
| --- | --- |
| **Projeto** | Hub de Estudos (Equipe 7) |
| **Aluno** | Gustavo Martins de Ávila |
| **Artefato** | Cadastro de eventos do calendário (provas, trabalhos, tarefas, quizzes e aulões) |
| **Tipo** | CI · Cadastro de Informações (CRUD) |
| **Sprint** | 1 (a Sprint 2 traz o Calendário acadêmico, que é de apresentação) |
| **Endereço** | http://localhost:3000/modulos/calendario/cadastro-eventos.html |
| **Link na internet** | Não disponível na Internet (roda localmente com o JSON Server) |

Para rodar, siga o [README.md](README.md): `npm install`, `npm start` na raiz do projeto e abrir o endereço acima. **Só funciona pelo JSON Server**, não pelo arquivo aberto direto.

## Como a entrega atende a rubrica (Cadastro de Informações)

| Critério (nível Completo) | Como foi atendido | Onde ver |
| --- | --- | --- |
| Documentação da interface e da estrutura de dados | Este arquivo, o [README.md](README.md) e o documento "Orientação de Avaliação" | seções 3 e 4 abaixo |
| Vários registros em JSON Server | 12 eventos e 6 matérias no `db.json`, servidos pelo JSON Server (API REST) | `codigo/db/db.json` e `http://localhost:3000/eventos` |
| Todas as operações do CRUD | Cadastrar (POST), ver (GET), alterar (PUT) e excluir (DELETE) | seção 2 abaixo |
| Dados apresentados de forma estruturada e atualizados na hora | Calendário em grade mensal e lista do dia, redesenhados depois de cada operação, sem F5 | `montarCalendario` e `montarEventosDoDia` |
| Código JavaScript sem erros | Console do navegador sem erros ao abrir e usar a tela | F12, aba Console |

## 1. Telas

A tela é uma página só (`cadastro-eventos.html`), com três áreas:

1. **Calendário do mês** (esquerda): botões `<`, `>` e **Hoje**, seletor de matéria, grade de dias com os eventos e legenda de cores.
2. **Eventos do dia** (direita, em cima): lista do dia clicado, com os botões **Editar** e **Excluir**.
3. **Formulário** (direita, embaixo): **Novo evento** ou **Editar evento**, com os botões **Salvar evento** (ou **Salvar alterações**) e **Limpar**.

No computador, o calendário fica ao lado das caixas da direita (grade do Bootstrap). No celular (até 600 px), tudo se empilha, o menu vira botão hambúrguer e cada dia mostra só barras coloridas.

## 2. Operações do CRUD no código

| Operação | O que fazer na tela | Função | Requisição | Linha em `cadastro-eventos.js` |
| --- | --- | --- | --- | --- |
| Ver (READ) | abrir a página, clicar em um dia | `carregarDados`, `carregarEventos` | `GET /materias`, `GET /eventos` | 65, 81 |
| Cadastrar (CREATE) | **Salvar evento** | `incluirEvento` | `POST /eventos` | 92 |
| Alterar (UPDATE) | **Editar**, depois **Salvar alterações** | `editarEvento` (preenche o formulário) e `alterarEvento` | `PUT /eventos/:id` | 254, 107 |
| Excluir (DELETE) | **Excluir** e confirmar | `excluirEvento` | `DELETE /eventos/:id` | 122 |

A função `salvarEvento` (linha 278) trata o envio do formulário: se o campo escondido `eventoId` está vazio, cadastra; se tem valor, altera.

Para ver as requisições: F12 › aba Network, e fazer uma operação.

Eventos da página (4 tipos diferentes, além do `fetch`): `onclick` nos dias e nos botões Editar/Excluir, `submit` do formulário, `change` do seletor de matéria e `load` da janela (carrega os dados).

## 3. Estrutura de dados (`codigo/db/db.json`)

```json
{
  "materias": [
    {
      "id": 21,
      "sigla": "AEDS2",
      "nome": "Algoritmos e Estruturas de Dados II",
      "apelidos": ["aeds", "aeds2", "aeds 2"],
      "turmas_cadastradas": []
    }
  ],
  "eventos": [
    {
      "id": 8,
      "titulo": "Prova 2",
      "materiaId": 21,
      "tipo": "prova",
      "data": "2026-10-27",
      "hora": "10:00",
      "sala": "104"
    }
  ]
}
```

| Campo | Tipo | Observação |
| --- | --- | --- |
| `eventos.id` | inteiro | gerado pelo JSON Server |
| `eventos.titulo` | texto | obrigatório |
| `eventos.materiaId` | inteiro | chave estrangeira para `materias.id` |
| `eventos.tipo` | texto | `prova`, `trabalho`, `tarefa`, `quiz` ou `aulao` |
| `eventos.data` | texto | `AAAA-MM-DD` (formato do campo de data) |
| `eventos.hora` | texto | `HH:MM`; vazio quando o evento é de dia inteiro |
| `eventos.sala` | texto | opcional (pode ser vazio) |

A coleção `materias` segue o esquema do banco da equipe (`docs/files/11_Esquema_do_Banco_de_Dados.md`, tabela `materias`) e é usada para o seletor e as cores. A coleção `eventos` é desta funcionalidade; o esquema da equipe ainda não define uma tabela de eventos do calendário.

## 4. Cenários de teste

Antes de testar: `npm start` rodando e a página aberta. Para começar com os dados de exemplo, use `git checkout codigo/db/db.json` (ou extraia o ZIP de novo).

| # | Cenário | Ações | Resultado esperado |
| --- | --- | --- | --- |
| 1 | Visualizar eventos | 1. Abrir o endereço da página<br>2. Conferir que o mês é outubro de 2026 (se não, use `<` e `>`)<br>3. Clicar no dia 22 | A grade mostra os eventos do `db.json`. A caixa à direita mostra "Quinta-feira, 22/10/2026" e o evento "Prova 2 - CALC1 - Prova - 08:50 - sala 310" |
| 2 | Cadastrar evento | 1. Clicar em um dia vazio, por exemplo o 28<br>2. No formulário **Novo evento**, preencher Título (ex.: "Teste"), Matéria, Tipo e Hora<br>3. Clicar em **Salvar evento** | Aparece "Evento cadastrado!". O evento surge na hora na grade e na lista do dia, sem recarregar. O `http://localhost:3000/eventos` mostra o novo registro |
| 3 | Alterar evento | 1. Clicar no dia do evento criado<br>2. Clicar em **Editar** (o formulário vira "Editar evento")<br>3. Mudar o título ou a data<br>4. Clicar em **Salvar alterações** | Aparece "Evento alterado!". A grade mostra a mudança na hora, e ela continua lá depois de recarregar a página (F5) |
| 4 | Excluir evento | 1. Clicar no dia do evento<br>2. Clicar em **Excluir**<br>3. Confirmar na janela | Aparece "Evento excluído!". O evento some da grade e do `http://localhost:3000/eventos` |
| 5 | Filtrar por matéria (extra) | Escolher **AEDS2** no seletor acima da grade | Ficam na grade só os eventos de AEDS2 (3 no mês de outubro) |
| 6 | Celular (extra) | F12 › ícone de celular (Ctrl+Shift+M), largura 375 px | O menu vira hambúrguer, as caixas se empilham e cada dia mostra só barras coloridas |

## 5. Pontos que ajudam a correção

- **Precisa de internet** para o Bootstrap (carregado por CDN em `cadastro-eventos.html`) e, na primeira vez, para o `npm install`. Sem internet a página funciona, mas fica sem estilo.
- **Gravação:** cada operação altera o `codigo/db/db.json`. Isso é esperado.
- **Sem login:** o login é de outra funcionalidade da equipe. Por isso o calendário é único, sem separar por usuário.
- **Escopo:** esta entrega é o cadastro (CI). A visualização do calendário acadêmico, com próximas entregas, é a entrega da Sprint 2.
- **Tecnologias:** HTML, CSS, Bootstrap 5, JavaScript (DOM e `fetch`) e JSON Server 0.17.4.
