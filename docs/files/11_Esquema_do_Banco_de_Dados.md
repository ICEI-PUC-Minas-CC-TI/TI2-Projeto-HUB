<div align="center">

PONTIFÍCIA UNIVERSIDADE CATÓLICA DE MINAS GERAIS<br>
INSTITUTO DE CIÊNCIAS EXATAS E INFORMÁTICA<br>
CIÊNCIA DA COMPUTAÇÃO — TRABALHO INTERDISCIPLINAR 2

# ESQUEMA DO BANCO DE DADOS EM JSON

Projeto Hub de Estudos — Equipe 7

Arthur Victor · Guilherme Lino · Gustavo Henrique Santos e Silva · Gustavo Martins de Ávila · Henrique Temponi · Lucas Coelho<br>
Orientador: Prof. Marcos André Silveira Kutova<br>
Belo Horizonte, setembro de 2026

</div>

## 1 ORGANIZAÇÃO DOS ARQUIVOS

O esquema foi dividido em oito tópicos, um arquivo JSON por tópico. Os oito arquivos juntos formam o `db.json` usado como banco de dados simulado no json-server. Cada seção a seguir traz o arquivo do tópico com até dois registros de exemplo por tabela (exceto `roles`, que lista todos os valores) e um quadro com as chaves e restrições.

- **Tabelas:** cada tabela é um arranjo no primeiro nível do JSON (ex.: `"usuarios": [ ... ]`); cada objeto do arranjo é um registro.
- **Campos e tipos:** cada chave do objeto é um campo. Tipos usados: texto, número, booleano, data (`AAAA-MM-DD`), data e hora (`AAAA-MM-DDTHH:MM:SS`), lista e objeto.
- **Chave primária:** o campo `id` em todas as tabelas.
- **Chave estrangeira:** campo com o nome da tabela relacionada no singular seguido de `Id`, guardando o `id` do registro, ex.: `"materiaId": 21`. Quando a tabela tem mais de um papel para o mesmo tipo de registro, o nome indica o papel (`autorId`, `revisorId`, `remetenteId` → `usuarios.id`). Listas de chaves guardam só os ids, ex.: `"turmas_cadastradas": [21]`.
- **Restrições:** valores permitidos, campos únicos, obrigatórios e faixas de valores, listados no quadro de cada tópico. Campos que não aparecem no quadro são obrigatórios e não têm regra adicional.

Para executar a API simulada:

```bash
npx json-server@0.17.4 --watch db.json --id id
```

## 2 ARQUIVOS JSON POR TÓPICO

### 2.1 Usuários e preferências

_Arquivo `1_usuarios_e_preferencias.json` · Responsável: Gustavo Henrique Santos e Silva · Tabelas: `usuarios`_

Cadastro de quem usa o Hub e as preferências de interface, acessibilidade e notificação de cada usuário.

```json
{
  "usuarios": [
    {
      "id": 1,
      "nome": "Coordenação",
      "emailInstitucional": "coordenacao.cc@pucminas.br",
      "senha": "HASH_FICTICIO_001",
      "matricula": "000001",
      "curso": "Ciência da Computação",
      "periodo": null,
      "turno": null,
      "dataCadastro": "2026-07-20",
      "linkCalendario": "https://hub.exemplo.br/calendario/1.ics",
      "administrador": true,
      "preferencia": {
        "tema": 1,
        "tamanhoFonte": 12,
        "densidade": 1,
        "idioma": "pt-BR",
        "visibilidadePerfil": 1,
        "mostrarOnline": true,
        "acessibilidade": {
          "altoContraste": false,
          "reduzirAnimacoes": false,
          "leitorTela": false,
          "atalhosTeclado": true,
          "focoReforcado": false
        },
        "verificacaoDuasEtapas": true
      },
      "preferenciasNotificacao": [
        {
          "tipoNotificacao": 1,
          "noAplicativo": true,
          "porEmail": true
        },
        {
          "tipoNotificacao": 8,
          "noAplicativo": true,
          "porEmail": false
        }
      ]
    },
    {
      "id": 501,
      "nome": "João Pedro",
      "emailInstitucional": "joao.pedro@sga.pucminas.br",
      "senha": "HASH_FICTICIO_501",
      "matricula": "823451",
      "curso": "Ciência da Computação",
      "periodo": 3,
      "turno": 2,
      "dataCadastro": "2026-08-03",
      "linkCalendario": "https://hub.exemplo.br/calendario/501.ics",
      "administrador": false,
      "preferencia": {
        "tema": 1,
        "tamanhoFonte": 10,
        "densidade": 1,
        "idioma": "pt-BR",
        "visibilidadePerfil": 2,
        "mostrarOnline": true,
        "acessibilidade": {
          "altoContraste": false,
          "reduzirAnimacoes": false,
          "leitorTela": false,
          "atalhosTeclado": true,
          "focoReforcado": false
        },
        "verificacaoDuasEtapas": false
      },
      "preferenciasNotificacao": [
        {
          "tipoNotificacao": 4,
          "noAplicativo": true,
          "porEmail": true
        },
        {
          "tipoNotificacao": 5,
          "noAplicativo": true,
          "porEmail": true
        }
      ]
    }
  ]
}
```

**Chaves e restrições**

| Campo                                                | Tipo     | Chave | Restrição                                                                                                                                                                             |
| ---------------------------------------------------- | -------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `usuarios.id`                                        | inteiro  | PK    | único                                                                                                                                                                                 |
| `usuarios.nome`                                      | texto    |       | não pode ser vazio                                                                                                                                                                    |
| `usuarios.emailInstitucional`                        | texto    |       | único; termina em `@pucminas.br` ou `@sga.pucminas.br`                                                                                                                                |
| `usuarios.senha`                                     | texto    |       | guardar só o hash, nunca a senha                                                                                                                                                      |
| `usuarios.matricula`                                 | texto    |       | única                                                                                                                                                                                 |
| `usuarios.periodo`                                   | inteiro  |       | 1 a 12; `null` para professor e coordenação                                                                                                                                           |
| `usuarios.turno`                                     | inteiro  |       | `1` manhã · `2` tarde · `3` noite; `null` para professor e coordenação                                                                                                                |
| `usuarios.dataCadastro`                              | data     |       | AAAA-MM-DD                                                                                                                                                                            |
| `usuarios.administrador`                             | booleano |       | padrão `false`                                                                                                                                                                        |
| `usuarios.preferencia.tema`                          | inteiro  |       | `0` escuro · `1` claro · `2` sistema                                                                                                                                                  |
| `usuarios.preferencia.tamanhoFonte`                  | inteiro  |       | tamanho em px: `10` · `12` · `14`                                                                                                                                                     |
| `usuarios.preferencia.densidade`                     | inteiro  |       | `1` compacta · `2` padrão · `3` confortável                                                                                                                                           |
| `usuarios.preferencia.idioma`                        | texto    |       | valores: `pt-BR` · `en-US` · `es-ES`                                                                                                                                                  |
| `usuarios.preferencia.visibilidadePerfil`            | inteiro  |       | `1` pública · `2` turmas · `3` privada                                                                                                                                                |
| `usuarios.preferenciasNotificacao[].tipoNotificacao` | inteiro  |       | `1` nova dúvida · `2` nova resposta · `3` nova mensagem · `4` nova nota · `5` novo evento · `6` nova enquete · `7` enquete encerrada · `8` comunicado; não se repete no mesmo usuário |

### 2.2 Matérias, turmas e roles

_Arquivo `2_materias_turmas_e_roles.json` · Responsável: Gustavo Martins de Ávila · Tabelas: `materias`, `turmas`, `roles`, `usuarioRoles`_

Matérias do curso, as turmas de cada semestre (com a regra de aprovação e o vínculo dos usuários), os roles (cargos) possíveis e os roles de cada usuário, com histórico de mudanças e horários de atendimento.

```json
{
  "materias": [
    {
      "id": 11,
      "sigla": "CALC1",
      "nome": "Cálculo I",
      "apelidos": ["calc", "calc1", "cálculo 1"],
      "turmas_cadastradas": [21]
    },
    {
      "id": 21,
      "sigla": "AEDs II",
      "nome": "Algoritmos e Estruturas de Dados II",
      "apelidos": ["aeds", "aeds2", "aeds 2"],
      "turmas_cadastradas": [10]
    }
  ],
  "turmas": [
    {
      "id": 21,
      "materiaId": 11,
      "identificacao": 1,
      "turno": 2,
      "ano": 2026,
      "semestre_letivo": 2,
      "total_aulas": 72,
      "nota_aprovacao": 60,
      "frequencia_minima": 75,
      "usuarios": [
        {
          "usuarioId": 501,
          "roleId": 1,
          "origem_vinculo": 1,
          "situacao": 2,
          "entrada": "2026-08-03",
          "faltas": 4
        },
        {
          "usuarioId": 503,
          "roleId": 2,
          "origem_vinculo": 2,
          "situacao": 2,
          "entrada": "2026-08-10",
          "faltas": 0
        },
        {
          "usuarioId": 504,
          "roleId": 1,
          "origem_vinculo": 1,
          "situacao": 2,
          "entrada": "2026-08-03",
          "faltas": 2
        }
      ]
    },
    {
      "id": 10,
      "materiaId": 21,
      "identificacao": 1,
      "turno": 1,
      "ano": 2026,
      "semestre_letivo": 2,
      "total_aulas": 72,
      "nota_aprovacao": 60,
      "frequencia_minima": 75,
      "usuarios": [
        {
          "usuarioId": 502,
          "roleId": 1,
          "origem_vinculo": 1,
          "situacao": 2,
          "entrada": "2026-08-03",
          "faltas": 0
        },
        {
          "usuarioId": 504,
          "roleId": 1,
          "origem_vinculo": 2,
          "situacao": 1,
          "entrada": "2026-08-05",
          "faltas": 0
        },
        {
          "usuarioId": 601,
          "roleId": 3,
          "origem_vinculo": 2,
          "situacao": 2,
          "entrada": "2026-08-01",
          "faltas": 0
        }
      ]
    }
  ],
  "roles": [
    { "id": 1, "nome": "aluno" },
    { "id": 2, "nome": "monitor" },
    { "id": 3, "nome": "professor" },
    { "id": 4, "nome": "adm" }
  ],
  "usuarioRoles": [
    {
      "id": 1,
      "usuarioId": 503,
      "roleIds": [1, 2],
      "historico": [
        {
          "roleAnteriorId": 1,
          "roleNovoId": 2,
          "meio_utilizado": 1,
          "data": "2026-08-10",
          "hora": "14:00"
        }
      ],
      "horario_disponivel": [
        {
          "turmaId": 21,
          "dia_semana": 3,
          "hora_inicio": "14:00",
          "hora_fim": "16:00"
        }
      ]
    }
  ]
}
```

**Chaves e restrições**

| Campo                                                    | Tipo    | Chave                    | Restrição                                                                           |
| -------------------------------------------------------- | ------- | ------------------------ | ----------------------------------------------------------------------------------- |
| `materias.id`                                            | inteiro | PK                       | único                                                                               |
| `materias.sigla`                                         | texto   |                          | única                                                                               |
| `materias.nome`                                          | texto   |                          | não pode ser vazio                                                                  |
| `materias.apelidos`                                      | lista   |                          | cada apelido aponta para uma matéria só (usado na busca)                            |
| `materias.turmas_cadastradas`                            | lista   | FK → `turmas.id` (lista) | cada id existe em turmas e a turma é desta matéria                                  |
| `turmas.id`                                              | inteiro | PK                       | único                                                                               |
| `turmas.materiaId`                                       | inteiro | FK → `materias.id`       |                                                                                     |
| `turmas.identificacao`                                   | inteiro |                          | não se repete na mesma matéria e semestre                                           |
| `turmas.turno`                                           | inteiro |                          | `1` manhã · `2` tarde · `3` noite                                                   |
| `turmas.ano`                                             | inteiro |                          | AAAA                                                                                |
| `turmas.semestre_letivo`                                 | inteiro |                          | `1` primeiro · `2` segundo                                                          |
| `turmas.total_aulas`                                     | inteiro |                          | maior que 0                                                                         |
| `turmas.nota_aprovacao`                                  | inteiro |                          | 0 a 100                                                                             |
| `turmas.frequencia_minima`                               | inteiro |                          | 0 a 100 (%)                                                                         |
| `turmas.usuarios[].usuarioId`                            | inteiro | FK → `usuarios.id`       | um vínculo por usuário na turma                                                     |
| `turmas.usuarios[].roleId`                               | inteiro | FK → `roles.id`          | role do usuário nesta turma                                                         |
| `turmas.usuarios[].origem_vinculo`                       | inteiro |                          | `1` canvas · `2` manual                                                             |
| `turmas.usuarios[].situacao`                             | inteiro |                          | `1` pendente · `2` ativo                                                            |
| `turmas.usuarios[].entrada`                              | data    |                          | AAAA-MM-DD                                                                          |
| `turmas.usuarios[].faltas`                               | inteiro |                          | 0 até `total_aulas`                                                                 |
| `roles.id`                                               | inteiro | PK                       | único; `1` aluno · `2` monitor · `3` professor · `4` adm                            |
| `roles.nome`                                             | texto   |                          | único                                                                               |
| `usuarioRoles.id`                                        | inteiro | PK                       | único                                                                               |
| `usuarioRoles.usuarioId`                                 | inteiro | FK → `usuarios.id`       | um registro por usuário                                                             |
| `usuarioRoles.roleIds`                                   | lista   | FK → `roles.id` (lista)  | sem repetição                                                                       |
| `usuarioRoles.historico[]`                               | objeto  |                          | `roleNovoId` diferente de `roleAnteriorId`; `meio_utilizado`: `1` página · `2` csv  |
| `usuarioRoles.historico[].roleAnteriorId` · `roleNovoId` | inteiro | FK → `roles.id`          |                                                                                     |
| `usuarioRoles.horario_disponivel[]`                      | objeto  |                          | só para monitor da turma; `dia_semana` de 1 a 7; `hora_fim` maior que `hora_inicio` |
| `usuarioRoles.horario_disponivel[].turmaId`              | inteiro | FK → `turmas.id`         | turma em que o usuário é monitor                                                    |

### 2.3 Canvas, notas e calendário

_Arquivo `3_canvas_notas_e_calendario.json` · Responsável: Henrique Temponi · Tabelas: `integracoesCanvas`_

Conexão da conta do usuário com o Canvas, que traz entregas e notas para o calendário do Hub.

```json
{
  "integracoesCanvas": [
    {
      "id": 1,
      "usuarioId": 501,
      "token": "TOKEN_FICTICIO_123",
      "autorizacao": 1,
      "situacao": 1,
      "dataUltimaSincronizacao": "2026-09-29T08:00:00",
      "enderecoFeed": "https://canvas.exemplo.br/feeds/calendars/user_501.ics"
    }
  ]
}
```

**Chaves e restrições**

| Campo                           | Tipo    | Chave              | Restrição                                             |
| ------------------------------- | ------- | ------------------ | ----------------------------------------------------- |
| `integracoesCanvas.id`          | inteiro | PK                 | único                                                 |
| `integracoesCanvas.usuarioId`   | inteiro | FK → `usuarios.id` | uma integração por usuário                            |
| `integracoesCanvas.token`       | texto   |                    | guardado criptografado                                |
| `integracoesCanvas.autorizacao` | inteiro |                    | `1` concedida · `2` negada · `3` pendente             |
| `integracoesCanvas.situacao`    | inteiro |                    | `1` ativa · `2` pausada · `3` expirada · `4` revogada |

### 2.4 Temas e conteúdos

_Arquivo `4_temas_e_conteudos.json` · Responsável: Lucas Coelho · Tabelas: `temas`, `conteudos`_

Temas que organizam cada matéria, o progresso do aluno em cada tema e os conteúdos publicados, com interações, acessos e comentários.

```json
{
  "temas": [
    {
      "id": 1,
      "materiaId": 11,
      "titulo": "Limites e continuidade",
      "ordem": 1,
      "progressos": [
        {
          "usuarioId": 501,
          "situacao": 2,
          "dataAtualizacao": "2026-09-27T20:10:00"
        }
      ]
    },
    {
      "id": 2,
      "materiaId": 11,
      "titulo": "Derivadas",
      "ordem": 2,
      "progressos": [
        {
          "usuarioId": 504,
          "situacao": 1,
          "dataAtualizacao": "2026-09-28T19:30:00"
        }
      ]
    }
  ],
  "conteudos": [
    {
      "id": 1,
      "titulo": "Limites sem mistério",
      "descricao": "Resumo com exemplos resolvidos de limites laterais, limites no infinito e continuidade.",
      "tipo": 1,
      "palavrasChave": ["limites", "continuidade", "limite lateral"],
      "materiaId": 11,
      "temaId": 1,
      "autorId": 601,
      "revisorId": 701,
      "dataPublicacao": "2026-09-10T14:30:00",
      "arquivo": {
        "nome": "limites-sem-misterio.html",
        "formato": 2,
        "tamanhoMb": 0.6,
        "endereco": "https://arquivos.exemplo.br/conteudos/limites-sem-misterio.html"
      },
      "interacoes": [
        {
          "usuarioId": 504,
          "favorito": true,
          "situacao": 1,
          "dataUltimaInteracao": "2026-09-27T20:12:00"
        }
      ],
      "acessos": [
        {
          "id": 1,
          "usuarioId": 504,
          "dataHora": "2026-09-26T18:45:00"
        },
        {
          "id": 2,
          "usuarioId": 504,
          "dataHora": "2026-09-27T19:50:00"
        }
      ],
      "comentarios": [
        {
          "id": 1,
          "usuarioId": 504,
          "texto": "O exemplo do limite lateral finalmente fez sentido.",
          "data": "2026-09-27T20:12:00"
        }
      ]
    },
    {
      "id": 2,
      "titulo": "Complexidade de algoritmos",
      "descricao": "Notação O, análise de laços e comparação entre os métodos de ordenação vistos em aula.",
      "tipo": 1,
      "palavrasChave": ["complexidade", "big o", "ordenação", "merge sort"],
      "materiaId": 21,
      "temaId": 3,
      "autorId": 601,
      "revisorId": 701,
      "dataPublicacao": "2026-09-08T10:00:00",
      "arquivo": {
        "nome": "complexidade-de-algoritmos.html",
        "formato": 2,
        "tamanhoMb": 0.3,
        "endereco": "https://arquivos.exemplo.br/conteudos/complexidade-de-algoritmos.html"
      },
      "interacoes": [
        {
          "usuarioId": 501,
          "favorito": true,
          "situacao": 1,
          "dataUltimaInteracao": "2026-09-15T22:05:00"
        },
        {
          "usuarioId": 502,
          "favorito": false,
          "situacao": 1,
          "dataUltimaInteracao": "2026-09-26T09:40:00"
        }
      ],
      "acessos": [
        {
          "id": 3,
          "usuarioId": 501,
          "dataHora": "2026-09-14T21:30:00"
        },
        {
          "id": 4,
          "usuarioId": 502,
          "dataHora": "2026-09-26T09:15:00"
        }
      ],
      "comentarios": [
        {
          "id": 2,
          "usuarioId": 501,
          "texto": "O merge sort é O(n log n) mesmo no melhor caso?",
          "data": "2026-09-14T21:48:00"
        },
        {
          "id": 3,
          "usuarioId": 601,
          "texto": "Sim: ele sempre divide e intercala tudo, então o melhor caso também é O(n log n).",
          "data": "2026-09-15T08:20:00"
        }
      ]
    }
  ]
}
```

**Chaves e restrições**

| Campo                               | Tipo    | Chave              | Restrição                                                              |
| ----------------------------------- | ------- | ------------------ | ---------------------------------------------------------------------- |
| `temas.id`                          | inteiro | PK                 | único                                                                  |
| `temas.ordem`                       | inteiro |                    | maior que 0; não se repete na mesma matéria                            |
| `temas.materiaId`                   | inteiro | FK → `materias.id` |                                                                        |
| `temas.progressos[].usuarioId`      | inteiro | FK → `usuarios.id` | um progresso por usuário no tema                                       |
| `temas.progressos[].situacao`       | inteiro |                    | `0` não iniciado · `1` estudando · `2` concluído                       |
| `conteudos.id`                      | inteiro | PK                 | único                                                                  |
| `conteudos.titulo`                  | texto   |                    | não pode ser vazio                                                     |
| `conteudos.tipo`                    | inteiro |                    | `1` estudo · `2` exercício · `3` projeto · `4` prova                   |
| `conteudos.materiaId`               | inteiro | FK → `materias.id` |                                                                        |
| `conteudos.temaId`                  | inteiro | FK → `temas.id`    | opcional (`null`); se houver, é da mesma matéria                       |
| `conteudos.autorId`                 | inteiro | FK → `usuarios.id` |                                                                        |
| `conteudos.revisorId`               | inteiro | FK → `usuarios.id` | opcional (`null`); diferente do autor                                  |
| `conteudos.arquivo.formato`         | inteiro |                    | `1` PDF · `2` HTML · `3` DOCX · `4` PPTX · `5` PNG · `6` JPG · `7` MP4 |
| `conteudos.arquivo.tamanhoMb`       | decimal |                    | maior que 0                                                            |
| `conteudos.interacoes[].usuarioId`  | inteiro | FK → `usuarios.id` | uma interação por usuário no conteúdo                                  |
| `conteudos.interacoes[].situacao`   | inteiro |                    | `0` não iniciado · `1` estudando · `2` concluído                       |
| `conteudos.acessos[].id`            | inteiro | PK                 | único                                                                  |
| `conteudos.acessos[].usuarioId`     | inteiro | FK → `usuarios.id` |                                                                        |
| `conteudos.comentarios[].id`        | inteiro | PK                 | único                                                                  |
| `conteudos.comentarios[].usuarioId` | inteiro | FK → `usuarios.id` |                                                                        |
| `conteudos.comentarios[].texto`     | texto   |                    | não pode ser vazio                                                     |

### 2.5 Dúvidas e monitoria

_Arquivo `5_duvidas_e_monitoria.json` · Responsável: Arthur Victor · Tabelas: `duvidas`_

Dúvidas abertas pelos usuários, as respostas de monitores e professores e as marcações de 'útil'.

```json
{
  "duvidas": [
    {
      "id": 143,
      "autorId": 501,
      "tipo": 1,
      "assunto": "Mudança de base em logaritmos",
      "descricao": "Na questão 4 da Lista 1, não entendi quando usar a mudança de base.",
      "dataHoraAbertura": "2026-09-28T14:02:00",
      "situacao": 4,
      "resolvida": true,
      "turmaId": 21,
      "temaId": 6,
      "respostas": [
        {
          "autorId": 503,
          "texto": "Use log_a(x) = log(x) / log(a) quando a base não for 10 nem e. Veja o exemplo resolvido no material da Lista 1.",
          "dataHora": "2026-09-28T14:20:00"
        }
      ],
      "marcacoesUteis": [{ "usuarioId": 504 }]
    },
    {
      "id": 144,
      "autorId": 504,
      "tipo": 2,
      "assunto": "Exercícios extras de recursividade",
      "descricao": "Tem alguma lista com mais exercícios de recursão para treinar antes do aulão?",
      "dataHoraAbertura": "2026-09-29T23:10:00",
      "situacao": 1,
      "resolvida": null,
      "turmaId": 10,
      "temaId": 7,
      "respostas": [],
      "marcacoesUteis": []
    }
  ]
}
```

**Chaves e restrições**

| Campo                                | Tipo     | Chave              | Restrição                                                                            |
| ------------------------------------ | -------- | ------------------ | ------------------------------------------------------------------------------------ |
| `duvidas.id`                         | inteiro  | PK                 | único; é o número exibido no site (#143)                                             |
| `duvidas.autorId`                    | inteiro  | FK → `usuarios.id` |                                                                                      |
| `duvidas.tipo`                       | inteiro  |                    | `1` dúvida de matéria · `2` pedido de material · `3` problema no site                |
| `duvidas.assunto`                    | texto    |                    | não pode ser vazio                                                                   |
| `duvidas.situacao`                   | inteiro  |                    | `1` na fila · `2` aguardando resposta · `3` respondida · `4` resolvida · `5` fechada |
| `duvidas.resolvida`                  | booleano |                    | `null` até o autor responder; `true` quando a situação é `4` (resolvida)             |
| `duvidas.turmaId`                    | inteiro  | FK → `turmas.id`   | obrigatória quando o tipo é `1` (dúvida de matéria); pode ser nulo                   |
| `duvidas.temaId`                     | inteiro  | FK → `temas.id`    | pode ser nulo                                                                        |
| `duvidas.respostas[].autorId`        | inteiro  | FK → `usuarios.id` |                                                                                      |
| `duvidas.marcacoesUteis[].usuarioId` | inteiro  | FK → `usuarios.id` | cada usuário marca uma vez; não pode ser o autor                                     |

### 2.6 Enquetes e aulões

_Arquivo `6_enquetes_e_auloes.json` · Responsável: Guilherme Lino · Tabelas: `enquetes`_

Enquetes para escolher o tema de um aulão, com as opções de tema e os votos.

```json
{
  "enquetes": [
    {
      "id": 1,
      "titulo": "Qual tema você gostaria de revisar no aulão?",
      "situacao": 2,
      "dataCriacao": "2026-09-29",
      "materiaId": 21,
      "temas": [
        {
          "id": 101,
          "nome": "Recursividade",
          "descricao": "Estudo de funções que realizam chamadas a si mesmas.",
          "quantidadeVotos": 1
        },
        {
          "id": 102,
          "nome": "Ponteiros",
          "descricao": "Manipulação de referências e endereços de memória.",
          "quantidadeVotos": 1
        }
      ],
      "votos": [
        {
          "id": 1001,
          "usuarioId": 501,
          "temaId": 101,
          "dataHora": "2026-09-29T14:30:00"
        },
        {
          "id": 1002,
          "usuarioId": 502,
          "temaId": 102,
          "dataHora": "2026-09-29T14:35:00"
        }
      ]
    }
  ]
}
```

**Chaves e restrições**

| Campo                              | Tipo    | Chave                      | Restrição                                  |
| ---------------------------------- | ------- | -------------------------- | ------------------------------------------ |
| `enquetes.id`                      | inteiro | PK                         | único                                      |
| `enquetes.situacao`                | inteiro |                            | `1` rascunho · `2` ativa · `3` encerrada   |
| `enquetes.materiaId`               | inteiro | FK → `materias.id`         |                                            |
| `enquetes.temas`                   | lista   |                            | pelo menos 2 temas por enquete             |
| `enquetes.temas[].id`              | inteiro | PK                         | único                                      |
| `enquetes.temas[].quantidadeVotos` | inteiro |                            | igual ao número de votos com esse `temaId` |
| `enquetes.votos[].id`              | inteiro | PK                         | único                                      |
| `enquetes.votos[].usuarioId`       | inteiro | FK → `usuarios.id`         | um voto por usuário em cada enquete        |
| `enquetes.votos[].temaId`          | inteiro | FK → `enquetes.temas[].id` | tema da mesma enquete                      |

### 2.7 Mensagens e notificações

_Arquivo `7_mensagens_e_notificacoes.json` · Responsável: Arthur Victor · Tabelas: `conversas`, `comunicados`, `notificacoes`_

Conversas diretas e salas de turma, comunicados para vários destinatários e notificações de cada usuário.

```json
{
  "conversas": [
    {
      "id": 1,
      "tipo": 1,
      "topico": null,
      "dataCriacao": "2026-09-28T14:02:00",
      "turmaId": null,
      "participantes": [
        {
          "usuarioId": 501,
          "dataUltimaLeitura": "2026-09-28T14:25:00"
        },
        {
          "usuarioId": 503,
          "dataUltimaLeitura": "2026-09-28T14:20:00"
        }
      ],
      "mensagens": [
        {
          "remetenteId": 501,
          "texto": "Oi, Mariana. Mandei uma dúvida sobre mudança de base (dúvida #143).",
          "dataHora": "2026-09-28T14:02:00"
        },
        {
          "remetenteId": 503,
          "texto": "Respondi lá. Se ainda ficar confuso, me chama aqui.",
          "dataHora": "2026-09-28T14:20:00"
        }
      ]
    },
    {
      "id": 2,
      "tipo": 2,
      "topico": "Revisão para a Prova 1",
      "dataCriacao": "2026-09-25T09:00:00",
      "turmaId": 21,
      "participantes": [
        {
          "usuarioId": 501,
          "dataUltimaLeitura": "2026-09-29T18:05:00"
        },
        {
          "usuarioId": 503,
          "dataUltimaLeitura": "2026-09-29T18:12:00"
        },
        {
          "usuarioId": 504,
          "dataUltimaLeitura": "2026-09-29T18:20:00"
        }
      ],
      "mensagens": [
        {
          "remetenteId": 503,
          "texto": "Pessoal, podem mandar aqui as dúvidas da Lista 1 antes da Prova 1.",
          "dataHora": "2026-09-29T18:00:00"
        },
        {
          "remetenteId": 504,
          "texto": "A questão 7 da Lista 1 também usa mudança de base?",
          "dataHora": "2026-09-29T18:12:00"
        }
      ]
    }
  ],
  "comunicados": [
    {
      "id": 1,
      "remetenteId": 503,
      "assunto": "Local da Prova 1",
      "texto": "A Prova 1 de CALC1 será no dia 09/10, às 10 h, no Prédio 34, sala 101.",
      "dataHora": "2026-09-30T09:00:00",
      "destinatarios": [
        {
          "usuarioId": 501,
          "lido": true,
          "arquivado": false
        },
        {
          "usuarioId": 504,
          "lido": false,
          "arquivado": false
        }
      ]
    }
  ],
  "notificacoes": [
    {
      "id": 1,
      "usuarioId": 501,
      "tipo": 1,
      "texto": "Mariana Costa respondeu sua dúvida #143.",
      "dataHora": "2026-09-28T14:20:00",
      "lida": true,
      "referencia": { "item": 1, "id": 143 }
    },
    {
      "id": 2,
      "usuarioId": 501,
      "tipo": 2,
      "texto": "Nova mensagem em Revisão para a Prova 1.",
      "dataHora": "2026-09-29T18:20:00",
      "lida": false,
      "referencia": { "item": 2, "id": 2 }
    }
  ]
}
```

**Chaves e restrições**

| Campo                                   | Tipo     | Chave                                         | Restrição                                                                                      |
| --------------------------------------- | -------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `conversas.id`                          | inteiro  | PK                                            | único                                                                                          |
| `conversas.tipo`                        | inteiro  |                                               | `1` direta · `2` sala                                                                          |
| `conversas.turmaId`                     | inteiro  | FK → `turmas.id`                              | obrigatória quando o tipo é `2` (sala); `null` na direta                                       |
| `conversas.participantes`               | lista    |                                               | a conversa direta (`1`) tem exatamente 2 participantes                                         |
| `conversas.participantes[].usuarioId`   | inteiro  | FK → `usuarios.id`                            |                                                                                                |
| `conversas.mensagens[].remetenteId`     | inteiro  | FK → `usuarios.id`                            | precisa ser participante da conversa                                                           |
| `conversas.mensagens[].texto`           | texto    |                                               | não pode ser vazio                                                                             |
| `comunicados.id`                        | inteiro  | PK                                            | único                                                                                          |
| `comunicados.remetenteId`               | inteiro  | FK → `usuarios.id`                            |                                                                                                |
| `comunicados.destinatarios`             | lista    |                                               | pelo menos 1 destinatário                                                                      |
| `comunicados.destinatarios[].usuarioId` | inteiro  | FK → `usuarios.id`                            |                                                                                                |
| `comunicados.destinatarios[].lido`      | booleano |                                               | padrão `false`                                                                                 |
| `notificacoes.id`                       | inteiro  | PK                                            | único                                                                                          |
| `notificacoes.usuarioId`                | inteiro  | FK → `usuarios.id`                            |                                                                                                |
| `notificacoes.tipo`                     | inteiro  |                                               | `1` resposta · `2` mensagem · `3` nota · `4` evento · `5` aulão · `6` enquete · `7` comunicado |
| `notificacoes.lida`                     | booleano |                                               | padrão `false`                                                                                 |
| `notificacoes.referencia.item`          | inteiro  |                                               | `1` dúvida · `2` conversa · `3` evento · `4` conteúdo · `5` enquete · `6` comunicado           |
| `notificacoes.referencia.id`            | inteiro  | FK → `id` do item indicado em referencia.item |                                                                                                |

### 2.8 Avaliações do Hub

_Arquivo `8_avaliacoes_do_hub.json` · Responsável: Equipe 7 · Tabelas: `avaliacoesHub`_

Avaliação que o usuário faz do próprio Hub: nota, área avaliada e comentário.

```json
{
  "avaliacoesHub": [
    {
      "id": 1,
      "usuarioId": 501,
      "nota": 5,
      "categoria": 2,
      "comentario": "Gostei de ver as entregas do Canvas e os aulões no mesmo calendário.",
      "data": "2026-09-29"
    },
    {
      "id": 2,
      "usuarioId": 504,
      "nota": 4,
      "categoria": 3,
      "comentario": "A monitora respondeu rápido, mas demorei para achar a sala da turma.",
      "data": "2026-09-29"
    }
  ]
}
```

**Chaves e restrições**

| Campo                      | Tipo    | Chave              | Restrição                                                                                             |
| -------------------------- | ------- | ------------------ | ----------------------------------------------------------------------------------------------------- |
| `avaliacoesHub.id`         | inteiro | PK                 | único                                                                                                 |
| `avaliacoesHub.usuarioId`  | inteiro | FK → `usuarios.id` |                                                                                                       |
| `avaliacoesHub.nota`       | inteiro |                    | 1 a 5                                                                                                 |
| `avaliacoesHub.categoria`  | inteiro |                    | `1` geral · `2` calendário · `3` chat · `4` matérias · `5` conteúdos · `6` dúvidas · `7` notificações |
| `avaliacoesHub.comentario` | texto   |                    | opcional                                                                                              |
| `avaliacoesHub.data`       | data    |                    | AAAA-MM-DD                                                                                            |
