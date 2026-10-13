# API

Base: `http://localhost:8080`. Todas as rotas ficam sob `/api`, recebem e devolvem JSON e não exigem autenticação. A documentação interativa (Swagger UI) está em `/swagger-ui.html` e o OpenAPI em JSON em `/v3/api-docs`.

| Método | Rota | Sucesso | Erros |
| --- | --- | --- | --- |
| POST | [`/api/transferencias`](#post-apitransferencias) | 201 | 400, 422 |
| GET | [`/api/transferencias`](#get-apitransferencias) | 200 | |
| GET | [`/api/transferencias/{id}`](#get-apitransferenciasid) | 200 | 400, 404 |
| GET | [`/api/taxas`](#get-apitaxas) | 200 | |

## Formatos

| Tipo | Formato | Exemplo |
| --- | --- | --- |
| Conta | Texto com exatamente 10 dígitos. É texto para manter os zeros à esquerda. | `"0001234567"` |
| Valor em reais | Número JSON, até 13 dígitos inteiros e 2 casas decimais | `1000.00` |
| Data | Texto ISO `aaaa-mm-dd` | `"2026-10-20"` |
| Percentual | Número como aparece na tabela, não como fração | `8.2` significa 8,2% |

## POST /api/transferencias

Agenda uma transferência. A taxa e a data de agendamento não são enviadas: o servidor calcula a taxa e usa a data de hoje no fuso `America/Sao_Paulo`.

Corpo:

| Campo | Obrigatório | Regra |
| --- | --- | --- |
| `contaOrigem` | sim | 10 dígitos |
| `contaDestino` | sim | 10 dígitos, diferente de `contaOrigem` |
| `valor` | sim | maior ou igual a 0,01, até 13 dígitos inteiros e 2 casas, sem valor máximo |
| `dataTransferencia` | sim | de hoje até hoje + 50 dias |

```http
POST /api/transferencias
Content-Type: application/json

{ "contaOrigem": "0001234567", "contaDestino": "0007654321", "valor": 1000.00, "dataTransferencia": "2026-10-20" }
```

Resposta `201 Created`, com o cabeçalho `Location: http://localhost:8080/api/transferencias/1`:

```json
{
  "id": 1,
  "contaOrigem": "0001234567",
  "contaDestino": "0007654321",
  "valor": 1000.00,
  "taxa": 12.00,
  "total": 1012.00,
  "dataTransferencia": "2026-10-20",
  "dataAgendamento": "2026-10-13"
}
```

`total` é `valor + taxa`. Ele não é gravado no banco, é calculado na resposta.

Erros possíveis:

| Status | Quando | `mensagem` | `campos` |
| --- | --- | --- | --- |
| 400 | Algum campo falha na validação | `Erro: dados inválidos.` | uma mensagem por campo inválido |
| 400 | JSON malformado ou data fora do formato `aaaa-mm-dd` | `Erro: o corpo da requisição é inválido. Confira os campos e use datas no formato aaaa-mm-dd.` | não vem |
| 415 | Corpo sem `Content-Type: application/json` | `Erro: a requisição não pôde ser processada.` | não vem |
| 422 | Conta de destino igual à de origem | `Erro: a conta de destino deve ser diferente da conta de origem.` | `contaDestino` com a mesma mensagem |
| 422 | Data no passado ou a mais de 50 dias | `Erro: não há taxa aplicável para a data informada.` | não vem |

Mensagens por campo no 400 de validação:

| Campo | Situação | Mensagem |
| --- | --- | --- |
| `contaOrigem` | ausente | `Erro: informe a conta de origem.` |
| `contaOrigem` | sem 10 dígitos | `Erro: a conta de origem deve ter 10 dígitos.` |
| `contaDestino` | ausente | `Erro: informe a conta de destino.` |
| `contaDestino` | sem 10 dígitos | `Erro: a conta de destino deve ter 10 dígitos.` |
| `valor` | ausente | `Erro: informe o valor.` |
| `valor` | zero ou negativo | `Erro: o valor deve ser maior que zero.` |
| `valor` | mais de 13 dígitos inteiros ou mais de 2 casas | `Erro: o valor deve ter até 13 dígitos inteiros e 2 casas decimais.` |
| `dataTransferencia` | ausente | `Erro: informe a data da transferência.` |

Quando um campo tem mais de um problema, vem só a primeira mensagem dele.

## GET /api/transferencias

Devolve o extrato completo, do agendamento mais recente para o mais antigo. No mesmo dia de agendamento, o maior `id` vem primeiro. Não há paginação.

```json
[
  { "id": 2, "contaOrigem": "0001234567", "contaDestino": "0007654321", "valor": 500.00,
    "taxa": 41.00, "total": 541.00, "dataTransferencia": "2026-10-28", "dataAgendamento": "2026-10-13" },
  { "id": 1, "contaOrigem": "0001234567", "contaDestino": "0007654321", "valor": 1000.00,
    "taxa": 12.00, "total": 1012.00, "dataTransferencia": "2026-10-20", "dataAgendamento": "2026-10-13" }
]
```

Sem agendamentos, a resposta é `[]`.

## GET /api/transferencias/{id}

Devolve uma transferência no mesmo formato do `201`.

| Status | Quando | `mensagem` |
| --- | --- | --- |
| 404 | Não existe transferência com esse `id` | `Erro: transferência 99 não encontrada.` |
| 400 | `id` não é um número | `Erro: a requisição não pôde ser processada.` |

## GET /api/taxas

Devolve a tabela de faixas, ordenada por `diasDe`. É gerada a partir do enum `FaixaTaxa`, o mesmo que o cálculo usa, então mudar o enum muda a tabela que o front mostra.

```json
[
  { "diasDe": 0,  "diasAte": 0,  "rotulo": "Mesmo dia",    "taxaFixa": 3.00,  "percentual": 2.5 },
  { "diasDe": 1,  "diasAte": 10, "rotulo": "1 a 10 dias",  "taxaFixa": 12.00, "percentual": 0.0 },
  { "diasDe": 11, "diasAte": 20, "rotulo": "11 a 20 dias", "taxaFixa": 0.00,  "percentual": 8.2 },
  { "diasDe": 21, "diasAte": 30, "rotulo": "21 a 30 dias", "taxaFixa": 0.00,  "percentual": 6.9 },
  { "diasDe": 31, "diasAte": 40, "rotulo": "31 a 40 dias", "taxaFixa": 0.00,  "percentual": 4.7 },
  { "diasDe": 41, "diasAte": 50, "rotulo": "41 a 50 dias", "taxaFixa": 0.00,  "percentual": 1.7 }
]
```

A resposta traz `Cache-Control: max-age=3600`, então o navegador reaproveita a tabela por 1 hora. A tabela só muda com uma nova versão do back-end.

Para reproduzir a taxa no cliente: `taxa = taxaFixa + valor × percentual / 100`, arredondada para 2 casas com HALF_EVEN. Se houver diferença de centavo, vale o valor devolvido pelo `POST`.

## Corpo de erro

Todo erro da API, inclusive os do próprio Spring (405, 415 e outros), tem o mesmo corpo:

```json
{ "mensagem": "Erro: dados inválidos.", "campos": { "contaOrigem": "Erro: a conta de origem deve ter 10 dígitos." } }
```

- `mensagem` sempre existe e sempre começa com "Erro:".
- `campos` só aparece quando o erro é de campos específicos. As chaves são os nomes dos campos do corpo da requisição.
- Nenhuma resposta expõe stack trace ou detalhes internos. Uma falha inesperada vira `500` com `Erro: falha inesperada no servidor. Tente novamente.`, e o detalhe fica só no log.

| Status | Significado nesta API |
| --- | --- |
| 400 | O formato da requisição está errado: campo ausente, conta com outro tamanho, valor fora da precisão, JSON ou data malformados |
| 404 | A transferência pedida não existe |
| 405, 415 | Método HTTP ou `Content-Type` não suportados |
| 422 | O formato está certo, mas a regra de negócio não deixa agendar: contas iguais ou data sem faixa de taxa |
| 500 | Falha inesperada no servidor |
