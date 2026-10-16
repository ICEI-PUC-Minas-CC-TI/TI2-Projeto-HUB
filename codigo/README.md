# Código Fonte

Essa é a pasta com o programa do Hub de Estudos. Por enquanto ela tem o protótipo navegável usado no teste de usabilidade da Sprint 1; as próximas sprints vão substituir os dados fictícios pelos dados do `db.json`.

Estrutura de diretórios:

```plaintext
codigo/  (essa pasta aqui)
│
├── db/
│   └── db.json (estruturas de dados)
│
├── public/ (o site - front end)
│   ├── assets/
│   │   ├── css/
│   │   │   ├── inicio.css     (estilo do index.html)
│   │   │   ├── prototipo.css  (estilo do prototipo.html)
│   │   │   └── mobile.css     (estilo do hub-mobile.html)
│   │   │
│   │   └── js/
│   │       ├── prototipo.js   (telas e eventos do desktop)
│   │       └── mobile.js      (telas e eventos do celular)
│   │
│   ├── index.html      (página "Comece aqui": ponto de partida e tarefas do teste)
│   ├── prototipo.html  (protótipo desktop)
│   └── hub-mobile.html (versão mobile, embutida no protótipo desktop)
│
└── README.md (este arquivo aqui)
```

O `package.json` que sobe o back end fica na raiz do repositório.

## Parte Front End

Todos os arquivos da parte de Front End ficam na pasta `public`:

* Pasta `assets`: os arquivos de formatação (CSS) e os scripts (JS) usados pelo site.
* Pasta `modulos` (a criar): uma sub-pasta para cada funcionalidade implementada nas próximas sprints.
* Arquivo `index.html`: a "home page" do site.

## Parte Back End

O Back End usa o ambiente de execução **[Node.js](https://nodejs.org/)** com o módulo **[JSON Server](https://github.com/typicode/json-server#readme)**, que fornece uma API RESTful a partir do arquivo `db/db.json`. Cada chave de nível superior desse arquivo vira uma coleção com `GET`, `POST`, `PUT` e `DELETE`.

## Setup e execução do ambiente

Com o [Node.js](https://nodejs.org/) (versão LTS) instalado, abra o terminal na raiz do repositório e execute:

```
$> npm install
```

Em seguida:

```
$> npm start
```

O site fica disponível em <http://localhost:3000>.

O protótipo atual não depende do back end: também dá para abrir o `public/index.html` direto no navegador.

## Protótipo interativo

Protótipo navegável (sem banco de dados, sem servidor) usado no teste de usabilidade. Abra `public/index.html` para as instruções e as quatro tarefas (fluxos F1–F4). Para entrar, qualquer e-mail terminado em `@sga.exemplo.br` e a senha `123456`.

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

Os HTML só têm a estrutura. Aparência e comportamento ficam separados, em `public/assets/`. As telas são montadas pelo JS como texto HTML; por isso as classes que aparecem no `js/mobile.js` (ex.: `cartao`, `btn btn--sec`, `titulo__sub`) estão todas definidas no `css/mobile.css`.

### Mudando a aparência

Comece pelas variáveis no topo de cada CSS (`:root`):

- **Celular (`css/mobile.css`)**: a _Paleta_ tem as cores cruas e os _Papéis_ dizem onde cada cor é usada. Trocar `--cor-destaque` muda botão principal, aba ativa e barras de uma vez. Fontes, tamanhos de texto, raios e sombras também são variáveis.
- **Desktop (`css/prototipo.css`) e `css/inicio.css`**: cores (`--ink`, `--acao`…), espaços (`--e1`…`--e6`), traços, raios e tamanhos de texto.

Ao trocar uma cor de texto, confira o contraste com o fundo nos dois temas: o mínimo é 4.5:1 (WCAG AA). As cores "apagadas" (`--ink-faint`, `--cor-texto-apagado`) já estão no limite, então não dá para clareá-las mais.

Nomes das classes do celular:

- `bloco__parte` é uma parte de um componente (`cartao__rodape`, `navegacao__aba`);
- `bloco--variante` muda um estado ou tamanho (`chip--ativo`, `btn--pequeno`);
- no fim do arquivo ficam ajustes pontuais reutilizáveis: espaçamento (`mt-3`, `mb-3`), cor de trecho de texto (`realce`, `suave`) e layout (`fila`, `grade-2`, `pilha-3`).

`css/mobile.css` usa camadas (`@layer reset, componentes`): as regras fora de camada, no final, valem sobre as de dentro.
