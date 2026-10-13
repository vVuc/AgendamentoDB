# Agendamento de Transferências

Sistema de agendamento de transferências financeiras, feito como teste técnico. A API em Spring Boot agenda a transferência, calcula a taxa pela data e guarda tudo em um H2 em memória. O front em Vue mostra a prévia da taxa e o extrato.

| Pasta | Conteúdo | Stack |
| --- | --- | --- |
| `Backend/` | API REST | Java 11, Spring Boot 2.7, Spring Data JPA, H2, Bean Validation, Lombok, springdoc-openapi |
| `Web/` | Interface | Vue 3, TypeScript, Vite |

A documentação do projeto está na pasta [`docs/`](docs/README.md): [visão geral](docs/README.md), [API](docs/api.md), [back-end](docs/backend.md) e [front-end](docs/frontend.md).

## Como inicializar o projeto

### Com Docker (recomendado)

Só é preciso ter o Git e o Docker com o Compose: o Docker Desktop no Windows e no macOS, ou o Docker Engine com o plugin `docker compose` no Linux. Java, Node e Maven não precisam estar instalados, porque a compilação acontece dentro dos containers.

```sh
git clone https://github.com/vVuc/AgendamentoDB.git
cd AgendamentoDB
docker compose up --build
```

A primeira execução baixa as imagens e as dependências e compila as duas partes, então pode levar alguns minutos. O front só sobe depois que a API responde. Quando o log mostrar o nginx pronto, abra http://localhost:5173.

| Serviço | Endereço | O que roda |
| --- | --- | --- |
| `web` | http://localhost:5173 | nginx com o build do front, encaminhando `/api` para a API |
| `backend` | http://localhost:8080 | A API, com o profile `dev` (Swagger e console do H2) |

- Para rodar em segundo plano, use `docker compose up --build -d`, e para parar, `docker compose down`. No modo normal, Ctrl+C para os containers.
- Se a porta 5173 ou 8080 estiver ocupada, crie um arquivo `.env` na raiz com `WEB_PORT=3000` e/ou `API_PORT=8081` e suba de novo.
- O banco é em memória: ao recriar o container do `backend`, os agendamentos somem.

### Sem Docker (desenvolvimento)

Este é o caminho para mexer no código, com recarga automática no front e no back.

#### 1. Pré-requisitos

| Ferramenta | Versão | Como conferir |
| --- | --- | --- |
| JDK | 11 | `java -version` |
| Node.js (já traz o npm) | 22.18 ou mais novo | `node -v` |
| Git | qualquer versão recente | `git --version` |

O Maven não precisa estar instalado: o projeto traz o Maven Wrapper (`mvnw`), que baixa a versão certa na primeira execução. Também não é preciso instalar banco de dados, porque o H2 roda em memória dentro da aplicação. A primeira execução de cada parte baixa as dependências, então precisa de internet e pode levar alguns minutos.

Se houver mais de um JDK na máquina, aponte a variável `JAVA_HOME` para o JDK 11 antes de rodar o back-end.

#### 2. Clonar o repositório

```sh
git clone https://github.com/vVuc/AgendamentoDB.git
cd AgendamentoDB
```

#### 3. Subir o back-end (porta 8080)

Em um terminal, a partir da raiz do projeto:

```sh
cd Backend
./mvnw spring-boot:run "-Dspring-boot.run.profiles=dev"
```

No Windows, troque `./mvnw` por `.\mvnw.cmd` (PowerShell) ou `mvnw.cmd` (Prompt de Comando). Mantenha as aspas no `-D`: sem elas o PowerShell quebra o argumento no ponto.

A API está no ar quando o log mostrar `Started TestTecnicoApplication`. Para conferir, abra http://localhost:8080/api/taxas no navegador: a resposta é a tabela com as 6 faixas de taxa.

O profile `dev` liga o console do H2 e mostra o SQL no log. Sem ele a API funciona igual.

#### 4. Subir o front-end (porta 5173)

Em outro terminal, com o back-end ainda rodando:

```sh
cd Web
npm ci
npm run dev
```

Abra http://localhost:5173. O Vite encaminha as chamadas para `/api` ao back-end em `localhost:8080`, então não há configuração de CORS nem de variável de ambiente. O `npm ci` instala exatamente as versões do `package-lock.json` e só precisa rodar de novo quando as dependências mudarem.

### Rodar os testes

Os testes rodam fora do Docker e precisam do JDK 11 e do Node, como no caminho sem Docker.

```sh
cd Backend
./mvnw test
```

```sh
cd Web
npm run test:unit -- --run
```

### Gerar a versão de produção (opcional)

```sh
cd Backend
./mvnw package
java -jar target/testTecnico-0.0.1-SNAPSHOT.jar
```

```sh
cd Web
npm run build
```

O build do front fica em `Web/dist/`.

### Problemas comuns

| Sintoma | Causa provável | Solução |
| --- | --- | --- |
| `Cannot connect to the Docker daemon` ou `docker: command not found` | O Docker não está instalado ou não está aberto | Instale ou abra o Docker Desktop e rode o comando de novo |
| `port is already allocated` ao subir com Docker | Outro programa usa a porta 5173 ou 8080 | Crie um `.env` na raiz com `WEB_PORT=3000` e/ou `API_PORT=8081` |
| O front mostra erro ao carregar as taxas ou ao agendar | O back-end não está rodando | Sem Docker, suba o back-end (passo 3) antes de usar a tela. Com Docker, confira o log do serviço `backend`. |
| `Port 8080 was already in use` | Outro programa usa a porta | Feche o programa ou rode com `"-Dspring-boot.run.arguments=--server.port=8081"`. Nesse caso, ajuste o proxy em `Web/vite.config.ts` para a mesma porta. |
| `release version 11 not supported` ou erro de versão de classe | O Maven está usando outro JDK | Aponte `JAVA_HOME` para o JDK 11 |
| `./mvnw: Permission denied` (Linux ou macOS) | O script perdeu a permissão de execução | `chmod +x mvnw` |
| Os agendamentos somem ao reiniciar | O banco é em memória, como pede o enunciado | Comportamento esperado |

## Endereços úteis

| Endereço | O que é |
| --- | --- |
| http://localhost:5173 | Aplicação (front-end) |
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
