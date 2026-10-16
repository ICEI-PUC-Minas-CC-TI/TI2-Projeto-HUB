# Hub de Estudos

## Informações gerais

* **Disciplina:** TI II — Trabalho Interdisciplinar II: Front-End
* **Ano/Semestre:** 2026/2

## Alunos integrantes da equipe

* Gustavo Martins de Ávila
* Gustavo Henrique Santos e Silva
* Arthur Victor Alves
* Lucas Coelho Diniz
* Henrique Temponi Maia
* Guilherme Lino de Castro Souza

## Professores responsáveis

* Marcos André Silveira Kutova
* Rommel Vieira Carneiro

## Resumo

O Hub de Estudos é uma plataforma web que centraliza estudos, dúvidas e monitoria do curso de Ciência da Computação da PUC Minas. Ela reúne em um único ambiente os materiais de estudo, a busca por palavra-chave, a triagem de dúvidas e os relatórios para a equipe de ensino.

A fase de estratégia (pesquisa com alunos, personas, histórias de usuário, User Story Map e protótipo navegável) está documentada em [`docs/files/07_Documentacao_do_Projeto.pdf`](docs/files/07_Documentacao_do_Projeto.pdf), com a apresentação em [`docs/files/08_Apresentacao_do_Projeto.pptx`](docs/files/08_Apresentacao_do_Projeto.pptx). Todos os artefatos entregues até a Sprint 1, da Matriz CSD ao esquema do banco de dados, estão em [`docs/files`](docs/files), numerados na ordem das entregas.

## Problema

Estudantes de computação perdem tempo e se frustram ao procurar informação de estudo confiável e específica. As ferramentas existem (Canvas, biblioteca, IA), mas estão dispersas e mal indexadas: a busca fica presa a títulos e não ao conteúdo, e referências essenciais muitas vezes só aparecem por indicação de um professor. A equipe de ensino também não tem uma visão consolidada das dificuldades da turma.

O público-alvo são alunos de graduação em Ciência da Computação e cursos afins, monitores e professores.

## Solução proposta

Uma aplicação web que centraliza os recursos de estudo, reduz o tempo do aluno para achar informação confiável e dá à equipe de ensino uma visão das dúvidas da turma. As principais funcionalidades são:

* catálogo centralizado de estudos (RF-04) e busca por palavra-chave (RF-11);
* triagem de dúvidas por IA com escalonamento para o monitor (RF-05, RF-10, RF-02);
* exercícios resolvidos no próprio site (RF-01);
* dúvidas consolidadas e relatório para o professor (RF-07, RF-08);
* calendário, mensagens e notificações (RF-03, RF-06, RF-13).

## Arquitetura da solução

* **Front end:** páginas em HTML, CSS e JavaScript em [`codigo/public`](codigo/public), com as telas montadas via JavaScript (DOM). O protótipo navegável está publicado no GitHub Pages.
* **Back end:** [JSON Server](https://github.com/typicode/json-server) sobre Node.js, que serve os arquivos do site e uma API REST a partir de [`codigo/db/db.json`](codigo/db/db.json) (`npm start`, porta 3000). Os detalhes de execução estão em [`codigo/README.md`](codigo/README.md).
* **Modelo de dados:** modelo conceitual (MER, notação Peter Chen) em [`docs/images`](docs/images):
  [visão geral](docs/images/00_modelo_visao_geral.png) ·
  [usuários e preferências](docs/images/01_modelo_usuarios_e_preferencias.png) ·
  [matérias, turmas e cargos](docs/images/02_modelo_materias_turmas_e_cargos.png) ·
  [Canvas, notas e calendário](docs/images/03_modelo_canvas_notas_e_calendario.png) ·
  [temas e conteúdos](docs/images/04_modelo_temas_e_conteudos.png) ·
  [dúvidas e monitoria](docs/images/05_modelo_duvidas_e_monitoria.png) ·
  [enquetes e aulões](docs/images/06_modelo_enquetes_e_auloes.png) ·
  [mensagens e notificações](docs/images/07_modelo_mensagens_e_notificacoes.png) ·
  [avaliações do Hub](docs/images/08_modelo_avaliacoes_do_hub.png)
* **Fluxo das páginas por cargo:**
  [visitante](docs/images/11_fluxo_visitante.png) ·
  [aluno](docs/images/12_fluxo_aluno.png) ·
  [dúvida](docs/images/13_fluxo_duvida.png) ·
  [monitor](docs/images/14_fluxo_monitor.png) ·
  [professor e coordenação](docs/images/15_fluxo_professor.png)

## Tecnologias utilizadas

* **Linguagens:** HTML, CSS e JavaScript
* **Frameworks/Bibliotecas:** nenhum no front end; JSON Server (Node.js) no back end
* **Banco de dados:** JSON Server (`codigo/db/db.json`)
* **Ferramentas:** Git e GitHub, GitHub Pages ([protótipo publicado](https://mavilaa.github.io/hub-estudos-prototipo/prototipo.html)), Miro ([quadro do projeto](https://miro.com/app/board/uXjVHyQRnCk=/?share_link_id=422860542337))

## Histórico de versões

| Versão | Data    | Descrição                                                                                                  |
| ------ | ------- | ---------------------------------------------------------------------------------------------------------- |
| 1.0    | 2026-09 | Entrega da Sprint 1: pesquisa, personas, requisitos, wireframes, protótipo, apresentação e documentação.     |
| 1.1    | 2026-09 | Modelo conceitual e fluxo das páginas por cargo; protótipo organizado em `css/` e `js/`.                     |
| 1.2    | 2026-10 | Repositório no padrão do template da disciplina (`codigo/`, `docs/`, `CITATION.cff` e capa deste README).   |
