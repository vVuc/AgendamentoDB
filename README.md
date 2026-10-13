# Agendamento de Transferências

Sistema de agendamento de transferências financeiras, feito como teste técnico. A API em Spring Boot agenda a transferência, calcula a taxa pela data e guarda tudo em um H2 em memória. O front em Vue mostra a prévia da taxa e o extrato.

| Pasta | Conteúdo | Stack |
| --- | --- | --- |
| `Backend/` | API REST | Java 11, Spring Boot 2.7, Spring Data JPA, H2, Bean Validation, Lombok, springdoc-openapi |
| `Web/` | Interface | Vue 3, TypeScript, Vite |

## Como rodar

Pré-requisitos: JDK 11 e Node 22.18 ou mais novo. O Maven não precisa estar instalado, porque o projeto traz o Maven Wrapper.

**1. Back-end** (porta 8080)

```sh
cd Backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

No Windows, use `mvnw.cmd` no lugar de `./mvnw`. O profile `dev` liga o console do H2 e o SQL no log; sem ele a API funciona igual.

**2. Front-end** (porta 5173)

```sh
cd Web
npm install
npm run dev
```

Abra http://localhost:5173. Em desenvolvimento, o Vite encaminha `/api` para o back-end, então não há configuração de CORS.

**Testes**

```sh
cd Backend && ./mvnw test
cd Web && npm run test:unit -- --run
```

## Endereços úteis

| Endereço | O que é |
| --- | --- |
| http://localhost:8080/swagger-ui.html | Documentação interativa da API |
| http://localhost:8080/h2-console | Console do banco (profile `dev`; JDBC URL `jdbc:h2:mem:agendamentodb`, usuário `sa`, sem senha) |

## API

| Método | Rota | Resposta |
| --- | --- | --- |
| POST | `/api/transferencias` | 201 com a transferência e o cabeçalho `Location`; 400 para dados inválidos; 422 sem taxa aplicável ou com contas iguais |
| GET | `/api/transferencias` | 200 com o extrato, do agendamento mais recente para o mais antigo |
| GET | `/api/transferencias/{id}` | 200 com a transferência; 404 se não existir |
| GET | `/api/taxas` | 200 com a tabela de faixas, com cache de 1 hora |

Exemplo de agendamento:

```json
// POST /api/transferencias
{ "contaOrigem": "0001234567", "contaDestino": "0007654321", "valor": 1000.00, "dataTransferencia": "2026-10-20" }

// 201 Created
{ "id": 1, "contaOrigem": "0001234567", "contaDestino": "0007654321", "valor": 1000.00,
  "taxa": 12.00, "total": 1012.00, "dataTransferencia": "2026-10-20", "dataAgendamento": "2026-10-13" }
```

Todo erro tem o mesmo corpo, com mensagens que começam por "Erro:". O campo `campos` aparece quando o erro é de um campo específico:

```json
{ "mensagem": "Erro: dados inválidos.", "campos": { "contaOrigem": "Erro: a conta de origem deve ter 10 dígitos." } }
```

## Regra da taxa

A taxa incide sobre o valor transferido e depende de quantos dias faltam, de hoje até a data da transferência:

| Dias | Taxa fixa | Percentual |
| --- | --- | --- |
| 0 | R$ 3,00 | 2,5% |
| 1 a 10 | R$ 12,00 | 0,0% |
| 11 a 20 | R$ 0,00 | 8,2% |
| 21 a 30 | R$ 0,00 | 6,9% |
| 31 a 40 | R$ 0,00 | 4,7% |
| 41 a 50 | R$ 0,00 | 1,7% |

Taxa = fixa + valor × percentual, com 2 casas e arredondamento HALF_EVEN. Uma data no passado ou a mais de 50 dias não tem faixa: a API responde 422 e não grava nada.

## Decisões

- **A taxa é calculada no servidor.** A tabela vive só no enum `FaixaTaxa`. O front busca essa tabela em `/api/taxas` para mostrar a prévia, mas o valor gravado é sempre o que o servidor calcula.
- **Dinheiro em `BigDecimal`.** Valores nunca passam por `double`, e o arredondamento acontece num único ponto, a `CalculadoraTaxa`.
- **"Hoje" no fuso de Brasília.** A data vem de um `Clock` injetado no fuso `America/Sao_Paulo`, para não virar o dia errado perto da meia-noite num servidor em UTC. Nos testes, o `Clock` é fixo.
- **Contas como texto.** Assim os zeros à esquerda dos 10 dígitos são preservados.
- **400 para formato, 422 para regra de negócio.** Contas iguais e data sem faixa são regras de negócio. O erro de contas iguais traz o campo `contaDestino`, para o front marcar o campo.
- **Pacotes por funcionalidade.** O back-end segue a mesma ideia do `features/` do front: `transferencia/api`, `service`, `domain`, `repository`, e `shared` para erros e configuração.
- **Fora do escopo:** autenticação, saldo e execução da transferência na data, edição ou cancelamento, paginação do extrato, banco persistente e deploy.
