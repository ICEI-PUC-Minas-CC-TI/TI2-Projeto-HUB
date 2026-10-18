# Cadastro de horários de atendimento da monitoria

Funcionalidade da Sprint 1 · Gustavo Henrique Santos e Silva · Hub de Estudos (Equipe 7)

Cadastro (CI) dos horários em que cada monitor atende uma turma. Na Sprint 2 vem a consulta desses horários (grade semanal e atendimento aberto).

## Dados

Os horários ficam na coleção `horariosAtendimento` do `codigo/db/db.json`:

| Campo | Exemplo | Descrição |
| --- | --- | --- |
| `id` | `1` | identificador do horário (o JSON Server usa este campo para editar e excluir) |
| `id_usuario` | `1` | monitor que faz o atendimento |
| `id_turma` | `1` | turma atendida |
| `dia_semana` | `"segunda-feira"` | dia do atendimento |
| `hora_inicio` | `"18:00"` | início do atendimento |
| `hora_fim` | `"20:00"` | fim do atendimento |

## Regras de validação

- O atendimento deve ocorrer entre 08:00 e 22:00.
- A hora final deve ser maior que a hora inicial.
- O mesmo monitor não pode ter dois horários que se sobrepõem no mesmo dia.

## Como rodar

Na raiz do projeto (onde está o `package.json`):

```
npm install
npm start
```

A API fica em <http://localhost:3000/horariosAtendimento>.
