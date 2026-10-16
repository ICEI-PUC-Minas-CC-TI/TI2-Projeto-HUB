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
