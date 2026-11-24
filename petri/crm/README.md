# PETRI CRM (Google Apps Script)

Cópia versionada do CRM de prospecção da Petri. **A fonte de verdade roda no Apps Script** ligado à planilha
"PETRI CRM" da conta comercial@petriprojetos.com (Extensões → Apps Script). Este diretório espelha o código
para histórico; mudanças feitas aqui precisam ser coladas no editor e publicadas (Implantar → Gerenciar implantações → nova versão).

| Arquivo | O que é |
|---|---|
| `Code.gs` | Motor: importação, sequência de 5 toques, leitura de respostas, agenda do Franco, mala direta |
| `Index.html` | Painel Web App (funil, kanban, fila do dia) |
| `appsscript.json` | Manifesto (escopos Gmail, Sheets, Calendar) |

## Rotina do dia (desde 24/11/2026)

1. **⇣ Importar leads** — aba `Importar` → `Leads` (deduplica por e-mail).
2. **✉ Preparar mala direta** — monta a aba `MalaDireta` (primeira aba da planilha) com os leads novos por score.
3. **Gmail → Escrever → Mala direta → Adicionar usando uma planilha → PETRI CRM** (coluna e-mail = `email`, nome = `primeiro_nome`).
   Corpo com as tags `@primeiro_nome @nicho_nome @dor @clientes @gancho @empresa`. O assunto não aceita tags.
4. **✓ Registrar mala direta** — acha os enviados, grava `thread_id`, marca passo 1 e agenda o passo 2.
5. **▶ Rodar o dia** — só acompanhamentos (passos 2–5), na mesma conversa. Com `MALA_DIRETA = SIM` na Config, o 1º toque nunca sai pelo script.

Config relevante: `LIMITE_DIA` (por execução; o Apps Script corta em 30 min, ~150 e-mails), `MALA_DIRETA`, `LINK_AGENDA`.
