# Cadastro de eventos do calendário · Instruções

Funcionalidade da Sprint 1 · Gustavo Martins de Ávila · Hub de Estudos (Equipe 7)

Este arquivo explica **como rodar e usar**. O que é essencial para a correção (rubrica, testes, estrutura de dados e onde está cada parte do código) está em [README-CORRECAO.md](README-CORRECAO.md).

## Como rodar (o único jeito que funciona)

A página precisa ser aberta **pelo JSON Server**. Ele entrega o site e os dados (`GET`, `POST`, `PUT` e `DELETE`) no mesmo endereço. Abrir o arquivo `.html` com duplo clique ou pelo Live Server **não funciona**: a página aparece, mas mostra o aviso _"Não foi possível acessar o servidor"_, porque não existe API naquele endereço.

Você precisa do [Node.js](https://nodejs.org/) (versão LTS) e de internet na primeira vez, para baixar o JSON Server e o Bootstrap.

1. Abra o terminal na **raiz do projeto**, a pasta onde está o `package.json`.
2. Instale as dependências (só na primeira vez):

   ```
   npm install
   ```

3. Suba o servidor:

   ```
   npm start
   ```

4. Abra no navegador:

   **http://localhost:3000/modulos/calendario/cadastro-eventos.html**

Deixe o terminal aberto enquanto usa a página. Para parar, use `Ctrl + C`.

O `npm start` executa este comando (está no `package.json`):

```
npx json-server@0.17.4 ./codigo/db/db.json --static ./codigo/public --port 3000 --host 0.0.0.0
```

Ele lê os dados de `codigo/db/db.json` e serve o site que está em `codigo/public`. Como a página usa endereços relativos (`/eventos`, `/materias`), ela funciona em qualquer porta.

### Testado

| Situação | Resultado |
| --- | --- |
| `npm install` + `npm start` na raiz do projeto | funciona |
| `npm start` de dentro da pasta `codigo/` | funciona (o npm roda o script a partir da raiz) |
| Abrir o `.html` com duplo clique (`file://`) | **não funciona** (aviso de servidor) |
| Abrir pelo Live Server do VS Code | **não funciona** (a API não existe lá) |

### Se der erro

| Erro | O que fazer |
| --- | --- |
| `EADDRINUSE` (porta 3000 ocupada) | Feche o outro programa que usa a 3000, ou rode `npx json-server@0.17.4 ./codigo/db/db.json --static ./codigo/public --port 3001` e abra o mesmo endereço trocando 3000 por 3001 |
| `npm: command not found` | Instale o Node.js e abra um terminal novo |
| Página sem estilo (sem cores nem grade) | Sem internet: o Bootstrap vem de um CDN. Conecte-se e recarregue |
| Aviso "Não foi possível acessar o servidor" | O `npm start` não está rodando, ou a página foi aberta por outro endereço. Use o endereço do passo 4 |

## Como usar a tela

- **Ver:** o calendário mostra o mês com os eventos de cada dia. Clique em um dia para ver os detalhes dele na caixa à direita. Use `<` e `>` para mudar de mês, **Hoje** para voltar ao dia atual e o seletor para filtrar por matéria.
- **Cadastrar:** preencha o formulário **Novo evento** (título, matéria, tipo, data, hora e sala, que é opcional) e clique em **Salvar evento**.
- **Alterar:** no evento do dia, clique em **Editar**, mude os dados e clique em **Salvar alterações**.
- **Excluir:** no evento do dia, clique em **Excluir** e confirme.
- **Limpar:** o botão **Limpar** esvazia o formulário e cancela uma edição.

Toda mudança é gravada no `codigo/db/db.json` na hora. O calendário é redesenhado sem recarregar a página.

## Voltar aos dados iniciais

O `db.json` muda a cada cadastro, alteração ou exclusão. Para voltar aos 12 eventos de exemplo:

- No repositório Git: `git checkout codigo/db/db.json`.
- No ZIP de entrega: extraia o ZIP de novo.

## Arquivos desta funcionalidade

```
codigo/public/modulos/calendario/
├── cadastro-eventos.html   página (menu, calendário, lista do dia e formulário)
├── cadastro-eventos.css    estilos, com a versão para celular (@media)
├── cadastro-eventos.js     todo o JavaScript
├── README.md               este arquivo (instruções)
└── README-CORRECAO.md      informações para a correção
codigo/db/db.json           dados (coleções materias e eventos)
package.json                comandos npm (na raiz do projeto)
```
