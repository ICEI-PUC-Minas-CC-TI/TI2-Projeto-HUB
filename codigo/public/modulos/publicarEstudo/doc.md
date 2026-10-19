# Documentação da Interface e Estrutura de Dados

## 1. Estrutura de Dados

Os registros são mantidos de forma persistente no arquivo `db.json` servido pelo JSON-Server sob o endpoint `/estudos`:

```json
{
  "estudos": [
    {
      "id": 1,
      "titulo": "Atividade de calculo",
      "descricao": "Atividade de calculo I voltada para o conceito de logaritimos",
      "diciplina": 1,
      "ArquivoPath": [
        "/tmp/index.html",
        "/tmp/atividadeCalculo.html",
        "/tmp/atividadeEnunciado.html"
      ]
    }
  ]
}
```

#### Descrição dos Campos:
- `id` *(número)*: Identificador único gerado automaticamente pelo JSON-Server para possibilitar consultas, atualizações e exclusões pontuais.
- `titulo` *(texto)*: Nome ou título da atividade de estudo.
- `descricao` *(texto)*: Detalhamento do conteúdo ou objetivo do estudo.
- `diciplina` *(número)*: Código numérico associado à disciplina.
- `ArquivoPath` *(lista de textos)*: Caminhos no sistema de arquivos para os arquivos HTML relacionados (ex.: `["/tmp/index.html"]`), sem necessidade de upload de arquivos pesados.

---

Utilizado para processamento em lote na caixa de importação sob o endpoint `/importEstudos`:

```json
{
  "estudo": [
    {
      "titulo": "Java - Primeiros passos",
      "descricao": "Introdução à sintaxe da linguagem Java"
    },
    {
      "titulo": "C e C++ - Resumo AEDS I",
      "descricao": "Ponteiros, vetores e alocação dinâmica"
    },
    {
      "titulo": "Cálculo 2 - Guia de Integrais",
      "descricao": "Métodos de integração por partes e substituição"
    },
    {
      "titulo": "",
      "descricao": "Arquivo sem título para testar tratamento de erro"
    }
  ]
}
```

---

## 3. Operações CRUD Implementadas

| Operação | Método HTTP | Endpoint | Descrição na Aplicação |
|---|---|---|---|
| **CREATE** | `POST` | `/estudos` | Envia os dados preenchidos no formulário "Publicar estudo" para cadastrar um novo registro. |
| **READ** | `GET` | `/estudos` | Busca todos os estudos cadastrados e renderiza na tabela dinâmica ao abrir ou atualizar a página. |
| **READ** | `GET` | `/importEstudos` | Faz um *mock up* de possiveis estudos para ser importado. |
| **UPDATE** | `PUT` | `/estudos/:id` | Ao clicar em "Editar", carrega os dados no formulário e salva as modificações diretamente no registro correspondente. |
| **DELETE** | `DELETE` | `/estudos/:id` | Ao clicar em "Excluir", confirma com o usuário e remove o registro do banco de dados permanentemente. |

---
