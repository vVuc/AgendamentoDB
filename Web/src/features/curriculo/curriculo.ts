export interface Experiencia {
  empresa: string
  cargo: string
  periodo: string
  local?: string
  atividades: string[]
}

export interface Formacao {
  instituicao: string
  curso: string
  periodo: string
}

export interface Curriculo {
  nome: string
  titulo: string
  local: string
  resumo: string[]
  experiencias: Experiencia[]
  formacoes: Formacao[]
  competencias: string[]
  idiomas: string[]
  certificacoes: string[]
  tecnologias: string[]
}

export const curriculo: Curriculo = {
  nome: 'Thiago Menezes',
  titulo: 'Desenvolvedor Java Pleno',
  local: 'Rio de Janeiro, Brasil',
  resumo: [
    'Desenvolvedor Java pleno, com cerca de 4 anos de desenvolvimento de software, 2 deles em back-end com Java 21 e Spring Boot. Trabalho com APIs REST, Spring Data JPA e PostgreSQL, e escrevo testes automatizados com JUnit 5, Mockito e Testcontainers.',
    'Além do código, subo e mantenho o ambiente de produção: Linux (Debian), Docker, Nginx como proxy reverso e CI/CD com deploy automatizado.',
    'Trabalho em times ágeis (Scrum e Kanban), com revisão de código, Clean Code e SOLID, e acompanho o problema de ponta a ponta, do código à sustentação em produção. Atualmente aprofundo Java e mensageria com Spring.',
  ],
  experiencias: [
    {
      empresa: 'Keepit',
      cargo: 'Desenvolvedor Full Stack',
      periodo: 'agosto de 2026 - atual',
      atividades: [
        'Projetei e desenvolvi do zero, em TypeScript, um marketplace reverso de veículos: back-end NestJS em Arquitetura Hexagonal, front-end Next.js com React e BFF via Route Handlers, PostgreSQL com TypeORM e validação com Zod.',
        'Modelei demanda do comprador, anúncio, oferta confidencial e motor de match entre anúncios e demandas, em módulos por feature com ports e adapters.',
        'Implementei autenticação JWT (senha com argon2), recuperação de senha por e-mail e notificações em tempo real via WebSocket (Socket.IO) autenticado; documentei a API com Swagger/OpenAPI.',
        'Construí um pipeline de captura automatizada de anúncios em grupos de WhatsApp (whatsapp-web.js) com fila BullMQ/Redis, retry com backoff, deduplicação por fingerprint e revisão humana dos casos ambíguos.',
        'Integrei LLM via API (Gemini) para extrair veículo, ano, preço, km e UF de cada anúncio, validados por Zod, e calibrei com 552 mensagens reais o classificador que filtra o que chega à IA: recall de 67% para 98% e precisão de 97%, reduzindo chamadas pagas.',
        'Escrevi testes unitários, de integração (PostgreSQL real) e e2e com Vitest, com cobertura mínima de 80% no domínio e nos casos de uso.',
        'Montei o ambiente com Dockerfiles multi-stage e Docker Compose (PostgreSQL, Redis, back-end, front-end e worker) e override de produção com Nginx e TLS.',
        'Desenvolvi em Python uma automação com GPT Image (OpenAI) para padronização visual de fotos de veículos.',
      ],
    },
    {
      empresa: 'CADS Digital',
      cargo: 'Desenvolvedor full stack',
      periodo: 'fevereiro de 2024 - janeiro de 2026',
      local: 'Rio de Janeiro, Brasil',
      atividades: [
        'Desenvolvi o back-end em Java 21 e Spring Boot de uma plataforma de extração e processamento de dados não estruturados para o setor de seguros, em time ágil (Kanban), junto a especialistas em IA e à liderança técnica.',
        'Organizei o back-end como monolito modular, separado por domínios de negócio, para reduzir o acoplamento e facilitar a manutenção.',
        'Implementei APIs REST e a camada de persistência com Spring Data JPA e PostgreSQL.',
        'Estruturei a estratégia de testes automatizados com JUnit 5, Mockito e Testcontainers, com cobertura mínima de 80% como critério de aprovação do build, no back-end e no front-end em React.',
        'Montei o ambiente de produção em Debian 12, com Docker para isolar os serviços e Nginx como proxy reverso.',
        'Reduzi o custo mensal de infraestrutura de cerca de R$ 5.000 para R$ 200 (96%) com a otimização da arquitetura e a automação do ambiente de produção.',
        'Acelerei em 3x a geração de relatórios e o processamento de documentos com a atualização da infraestrutura de produção.',
      ],
    },
    {
      empresa: 'Storaze',
      cargo: 'Full Stack Developer',
      periodo: 'fevereiro de 2023 - fevereiro de 2024',
      local: 'Rio de Janeiro, Brasil',
      atividades: [
        'Desenvolvi funcionalidades em TypeScript para diversos produtos de clientes da Storaze, uma software house, em times ágeis.',
        'Integrei front-ends em React e Angular a back-ends em Node.js com NestJS, por consumo de APIs, cuidando da consistência dos dados entre os sistemas.',
        'Conduzi a estratégia de testes automatizados com Vitest e Jest e levei a cobertura a 84%, reduzindo regressões nas entregas em produção.',
        'Ajudei a definir o padrão de desenvolvimento do projeto e a validação de código em commits e pull requests, com análise automatizada por IA e revisão humana, para impedir que dados sensíveis fossem enviados diretamente no código.',
      ],
    },
    {
      empresa: 'XAZA',
      cargo: 'Desenvolvedor de software',
      periodo: 'março de 2022 - fevereiro de 2023',
      local: 'São Paulo, Brasil',
      atividades: [
        'Atuei como full-stack na evolução do aplicativo mobile da XAZA Imobiliária, em Flutter, e na organização operacional do projeto.',
        'Planejei e executei a migração do Flutter 2.10.0 para 3.7.0.',
        'Implementei uma camada GraphQL no padrão BFF (Backend for Frontend) entre o aplicativo e a API principal da empresa, reduzindo o acoplamento e simplificando a manutenção e a evolução de novas funcionalidades.',
        'Desenvolvi a validação de registro de ponto por geolocalização, com mapeamento de áreas de atuação e validação de presença em trabalho presencial e remoto.',
        'Cuidei da publicação e da manutenção do app na App Store e na Play Store: testes, validações e deploy das versões em produção.',
        'Apoiei tecnicamente outros dois desenvolvedores na distribuição de tarefas, revisão de entregas e alinhamento técnico.',
      ],
    },
  ],
  formacoes: [
    {
      instituicao: 'Estácio',
      curso: 'Bacharelado em Engenharia de Software',
      periodo: 'abril de 2022 - abril de 2026',
    },
    {
      instituicao: 'Cubos Academy',
      curso: 'Information Technology',
      periodo: 'junho de 2023 - novembro de 2023',
    },
    {
      instituicao: 'Alura',
      curso: 'Formação Desenvolvimento Web Full Stack',
      periodo: 'março de 2022 - março de 2023',
    },
  ],
  competencias: ['JUnit', 'Spring Data JPA', 'Migração de sistemas'],
  idiomas: ['Português (nativo)', 'Inglês (profissional)', 'Espanhol (limitado)'],
  certificacoes: [
    'Containers com Docker e Docker Compose',
    'Desenvolvimento de Software - Foco em Backend - iFood',
  ],
  tecnologias: [
    'Java 21',
    'Spring Boot',
    'Spring Data JPA',
    'APIs REST',
    'PostgreSQL',
    'JUnit 5',
    'Mockito',
    'Testcontainers',
    'SonarQube',
    'Docker',
    'Docker Compose',
    'Linux (Debian)',
    'Nginx',
    'CI/CD',
    'Git',
    'TypeScript',
    'Node.js',
    'NestJS',
    'React',
    'Angular',
    'GraphQL',
  ],
}
