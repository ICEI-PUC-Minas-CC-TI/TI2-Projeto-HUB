# Hub de Estudos

`Trabalho Interdisciplinar 2` · PUC Minas — ICEI · Ciência da Computação · 2026

Plataforma web para centralizar estudos, dúvidas e monitoria do curso de Ciência da Computação,
reunindo em um único ambiente os materiais, a busca por palavra-chave, a triagem de dúvidas e os
relatórios para a equipe de ensino.

**Integrantes:** Arthur Victor · Lucas Coelho · Gustavo Martins · Gustavo Alckmin · Henrique Temponi · Guilherme Lino

**Orientação:** Prof. Marcos André Silveira Kutova

## Contexto e problema

Estudantes de computação perdem tempo e se frustram ao procurar informação de estudo confiável e
específica. As ferramentas existem (Canvas, biblioteca, IA), mas estão dispersas e mal indexadas; a
equipe de ensino também não tem visão consolidada das dificuldades da turma.

**Objetivo:** uma aplicação web que centralize os recursos de estudo, reduza o tempo do aluno para
achar informação confiável e dê à equipe de ensino visão das dúvidas da turma.

**Público-alvo:** alunos de graduação em CC e afins, monitores e professores.

## Principais funcionalidades

Catálogo centralizado (RF-04) · busca por palavra-chave (RF-11) · triagem por IA + escalonamento
para monitor (RF-05/10/02) · exercícios no site (RF-01) · dúvidas consolidadas e relatório ao
professor (RF-07/08) · calendário, mensagens e notificações (RF-03/06/13).

## Tecnologias

HTML, CSS e JavaScript puros, sem framework, sem build e sem servidor · protótipo publicado no
GitHub Pages · banco de dados relacional já modelado (ver [diagramas](#documentação-e-diagramas)),
ainda não implementado.

## Estrutura do repositório

```
.
├── README.md
├── index.html        # protótipo: página "Comece aqui" com as tarefas do teste
├── prototipo.html    # protótipo: versão desktop
├── hub-mobile.html   # protótipo: versão mobile
├── css/              # estilo de cada página do protótipo
├── js/               # telas e eventos do desktop e do celular
├── images/           # diagramas do modelo conceitual e do fluxo das páginas
├── documentos/       # documentação do projeto (PDF)
└── apresentacao/     # slides da Sprint 1 (PPTX)
```

## Links

- Protótipo publicado: <https://mavilaa.github.io/hub-estudos-prototipo/prototipo.html>
- Quadro no Miro: <https://miro.com/app/board/uXjVHyQRnCk=/?share_link_id=422860542337>

## Documentação e diagramas

- [`documentos/Hub_de_Estudos_Documentacao.pdf`](documentos/Hub_de_Estudos_Documentacao.pdf):
  contexto, personas, histórias de usuário (H01–H13), User Story Map, metodologia e referências.
- [`apresentacao/Hub_de_Estudos_Sprint1.pptx`](apresentacao/Hub_de_Estudos_Sprint1.pptx):
  apresentação da Sprint 1 (12 slides).
- **Modelo conceitual** (MER, notação Peter Chen), em `images/00`–`08`:
  [visão geral](images/00_modelo_visao_geral.png) ·
  [usuários e preferências](images/01_modelo_usuarios_e_preferencias.png) ·
  [matérias, turmas e cargos](images/02_modelo_materias_turmas_e_cargos.png) ·
  [Canvas, notas e calendário](images/03_modelo_canvas_notas_e_calendario.png) ·
  [temas e conteúdos](images/04_modelo_temas_e_conteudos.png) ·
  [dúvidas e monitoria](images/05_modelo_duvidas_e_monitoria.png) ·
  [enquetes e aulões](images/06_modelo_enquetes_e_auloes.png) ·
  [mensagens e notificações](images/07_modelo_mensagens_e_notificacoes.png) ·
  [avaliações do Hub](images/08_modelo_avaliacoes_do_hub.png)
- **Fluxo das páginas por cargo**, em `images/11`–`15`:
  [visitante](images/11_fluxo_visitante.png) ·
  [aluno](images/12_fluxo_aluno.png) ·
  [dúvida](images/13_fluxo_duvida.png) ·
  [monitor](images/14_fluxo_monitor.png) ·
  [professor e coordenação](images/15_fluxo_professor.png)

## Protótipo interativo

Protótipo navegável (sem banco de dados, sem servidor) usado no teste de usabilidade. Abra
`index.html` para as instruções e as quatro tarefas (fluxos F1–F4). Para entrar, qualquer e-mail
terminado em `@sga.exemplo.br` e a senha `123456`.

| Arquivo           | O que é                                              |
| ----------------- | ---------------------------------------------------- |
| `index.html`      | Página "Comece aqui": ponto de partida e tarefas     |
| `prototipo.html`  | Protótipo desktop; `?tarefa=1..4` e `?vista=celular` |
| `hub-mobile.html` | Versão mobile, embutida no protótipo desktop         |

Os dados são fictícios. As páginas não são indexadas por buscadores (`noindex` nas três).

### O que o protótipo cobre

Desktop e celular têm as mesmas funções (no celular, o que abre com o mouse abre com um toque):

- **Hub do aluno**: matérias com pontos obtidos, distribuídos e pendências; prévia dos conteúdos; gráfico do semestre.
- **Matéria**: calculador de média (abre e encolhe o resto), frequência com alerta de faltas.
- **Minhas matérias** e **Integrações** (token do Canvas) em Configurações.
- **Estudos**: busca com sugestão de matérias por apelido (`calc` → Cálculo I, II, III).
- **Criar conta**: senha com maiúscula, minúscula, número e caractere especial, e confirmação.
- **Publicar**: um cartão por arquivo, com o problema de cada um no próprio cartão.
- **Pessoas e cargos**: cargo por turma; professor muda aluno ↔ monitor nas turmas dele (página ou CSV); admin muda tudo.
- **Relatórios do professor**: matérias → turmas → alunos e regra de nota da turma.
- **Tema claro e escuro**, compartilhado entre desktop e celular no mesmo navegador.

Para testar direto: `prototipo.html?cargo=professor&tela=relatorios`; `hub-mobile.html#quadro` mostra todas as telas do celular.

### Onde fica cada coisa

Os HTML só têm a estrutura. Aparência e comportamento ficam separados:

```
css/
  inicio.css      estilo do index.html
  prototipo.css   estilo do prototipo.html (visual de wireframe)
  mobile.css      estilo do hub-mobile.html
js/
  prototipo.js    telas e eventos do desktop
  mobile.js       telas e eventos do celular
```

As telas são montadas pelo JS como texto HTML. Por isso as classes que aparecem no
`js/mobile.js` (ex.: `cartao`, `btn btn--sec`, `titulo__sub`) estão todas definidas no `css/mobile.css`.

### Mudando a aparência

Comece pelas variáveis no topo de cada CSS (`:root`):

- **Celular (`css/mobile.css`)**: a _Paleta_ tem as cores cruas e os _Papéis_ dizem onde cada
  cor é usada. Trocar `--cor-destaque` muda botão principal, aba ativa e barras de uma vez.
  Fontes, tamanhos de texto, raios e sombras também são variáveis.
- **Desktop (`css/prototipo.css`) e `css/inicio.css`**: cores (`--ink`, `--acao`…), espaços
  (`--e1`…`--e6`), traços, raios e tamanhos de texto.

Ao trocar uma cor de texto, confira o contraste com o fundo nos dois temas: o mínimo é 4.5:1
(WCAG AA). As cores "apagadas" (`--ink-faint`, `--cor-texto-apagado`) já estão no limite, então
não dá para clareá-las mais.

Nomes das classes do celular:

- `bloco__parte` é uma parte de um componente (`cartao__rodape`, `navegacao__aba`);
- `bloco--variante` muda um estado ou tamanho (`chip--ativo`, `btn--pequeno`);
- no fim do arquivo ficam ajustes pontuais reutilizáveis: espaçamento (`mt-3`, `mb-3`),
  cor de trecho de texto (`realce`, `suave`) e layout (`fila`, `grade-2`, `pilha-3`).

`css/mobile.css` usa camadas (`@layer reset, componentes`): as regras fora de camada, no final,
valem sobre as de dentro.

## Histórico de versões

| Versão | Data    | Descrição                                                                                              |
| ------ | ------- | ------------------------------------------------------------------------------------------------------ |
| 1.0    | 2026-09 | Entrega da Sprint 1: pesquisa, personas, requisitos, wireframes, protótipo, apresentação e documentação. |
| 1.1    | 2026-09 | Modelo conceitual e fluxo das páginas por cargo (`images/`); protótipo organizado em `css/` e `js/`.    |
