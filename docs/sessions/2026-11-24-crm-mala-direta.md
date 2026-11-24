# 2026-11-24 — CRM Petri: disparos 23–24/11 e mala direta

## Feito
- 23/11: 285 primeiros toques + ~73 acompanhamentos pelo "Rodar o dia" (script). Estourou o limite de 30 min do Apps Script; rodado 2x.
- 24/11: CRM passou a usar a mala direta do Gmail para o 1º toque (bloco MALA-DIRETA em `petri/crm/Code.gs`, menu Preparar/Registrar, Config `MALA_DIRETA=SIM`).
- 24/11: 290 leads (SP prioridade A + CE Alta, por score) enviados pela mala direta e registrados no CRM (Log: "290 registrado(s)").
- Código do CRM versionado em `petri/crm/`.

## Decisões
- 1º toque sempre pela mala direta (pedido do Henrique); passos 2–5 seguem pelo script, na mesma thread.
- Assunto fixo "Fundação dos próximos empreendimentos" (mala direta não aceita tag no assunto).
- Lead sem contato → saudação "Olá pessoal".

## Pegadinhas
- A mala direta só lê a PRIMEIRA aba da planilha → `MalaDireta` fica em 1º lugar.
- E-mail malformado (ex.: `,br`) trava a vinculação inteira ("Verifique a coluna de e-mails").
- Assinatura padrão da conta é da Débora — trocar pela do Franco no corpo.
- Muitos e-mails da Receita são genéricos (fiscal@, nfe@) e geram devolução.

## Próximos passos
- Base restante: SP ~3.000 prioridade A, CE ~165 Alta (arquivos PETRI_Leads_SP / Ceara).
- Conferir taxa de devolução antes de manter 300/dia.
