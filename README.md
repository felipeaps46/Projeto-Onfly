# Custom Node n8n

Este projeto inclui um node customizado que gera números aleatórios usando a API do [Random.org](https://www.random.org/).

#### Funcionalidades:
- Gera números inteiros aleatórios
- Validação de parâmetros (min/max)
- Tratamento de erros
- Persistência em Banco de Dados PostgreSQL

#### Parâmetros:
- **Min**: Número mínimo (padrão: 1)
- **Max**: Número máximo (padrão: 100)

A configuração a seguir permite executar o n8n localmente usando Docker Compose com PostgreSQL, criando um ambiente completo. Para detalhes sobre o workflow esperado no n8n, consulte `WORKFLOW.md`.

## 📋 Pré-requisitos

- Docker e Docker Compose instalados
- Node.js (para desenvolvimento dos nodes customizados)

## 🚀 Configuração

### 1. Clonar o Repositório
```bash
git clone https://github.com/felipeaps46/Projeto-Onfly.git
cd .\Projeto-Onfly\
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Banco de Dados PostgreSQL (Neon)
DATABASE_URL=postgresql://neondb_owner:npg_XAs9JULbQC0E@ep-lingering-morning-acybd38x-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```
### 3. Instalação das Dependências

1. Acesse pelo terminal a pasta Random:
```bash
cd .\custom-nodes\Random\
```

2. Instale as dependências do projeto:
```bash
npm install
```

### 4. Build do Projeto

Para compilar o projeto TypeScript (nodes customizados):

```bash
npm run build
```

Esse comando:
- Transpila os arquivos `.ts` em `src/` para `.js` dentro de `dist/`
- Garante que o n8n conseguirá carregar o nó customizado corretamente

#### Possível erro durante a build:

Em alguns sistemas, especialmente no macOS ou Linux, você pode encontrar o seguinte erro ao rodar `npm run build`:

```bash
sh: /caminho/do/projeto/node_modules/.bin/tsc: Permission denied
```

Esse erro ocorre porque o **TypeScript Compiler** (`tsc`) não tem permissão de execução.

#### Solução:

Conceda permissão de execução ao arquivo tsc com o comando:

```bash
chmod +x node_modules/.bin/tsc
```

Depois disso, execute novamente o build:

```bash
npm run build
```

### 5. Executar o n8n Localmente (Docker)

#### Opção 1: Usando o script npm criado
```bash
npm run docker:up
```

Este comando irá:
- Iniciar o n8n e todos os serviços definidos no `docker-compose.yml`
- Exibir a URL de acesso: http://localhost:5678/home/workflows

#### Opção 2: Usando Docker Compose diretamente

```bash
# Iniciar os serviços do n8n
docker compose up -d
```

Este comando irá:
- Iniciar o n8n e todos os serviços definidos no `docker-compose.yml`
- Não exibirá a URL no console (acesse manualmente: http://localhost:5678/home/workflows)
  
#### Parar os serviços
```bash
# Para os serviços do n8n
docker compose down
```

### 6. Acessar o n8n

- **URL**: http://localhost:5678

Se tudo tiver sido configurado corretamente, você já poderá seguir para a **construção do workflow**. (veja `WORKFLOW.md`)  
Caso os nodes customizados ainda não estejam disponíveis, verifique a instalação e compilação do projeto para garantir que eles sejam carregados no n8n.

## 📋 Outras Informações Relevantes

### Banco de Dados PostgreSQL

O projeto utiliza **PostgreSQL hospedado no Neon** como banco de dados do n8n. A conexão já está configurada através da variável `DATABASE_URL`. Mas pode ser necessário criar um **node Postgres** no workflow com as credenciais indicadas abaixo e em `WorkFlow.md` 

#### Credenciais do banco de dados:

- Host: `ep-lingering-morning-acybd38x-pooler.sa-east-1.aws.neon.tech`
- Port: `5432`
- Database: `neondb`
- User: `neondb_owner`
- Password: `npg_XAs9JULbQC0E`

#### Tabela Random Data

A tabela `random_data` é utilizada para armazenar os dados gerados pelo **node customizado Random**.  
Cada vez que o node é executado dentro de um workflow, o número aleatório gerado, juntamente com os parâmetros utilizados (`min` e `max`), é salvo nesta tabela.

#### Estrutura da tabela:
```sql
├── id (SERIAL PRIMARY KEY)
├── min (INT) - valor mínimo usado
├── max (INT) - valor máximo usado  
├── randomNumber (INT) - número gerado
└── created_at (TIMESTAMP) - quando foi criado
```

Dessa forma, é possível manter um histórico de números aleatórios gerados pelo node e utilizá-los em outros processos do n8n ou integrações externas.
  
## 🧪 Executando os Testes

O projeto utiliza o [Jest](https://jestjs.io/), um framework de testes em JavaScript/TypeScript, para validar o comportamento do nó **Random**.

### Executar todos os testes:
```bash
npm test
```
Esse comando fará com que o Jest:
- Busque todos os arquivos de teste dentro da pasta tests/
- Execute os cenários definidos
- Exiba no terminal um relatório com os resultados

#### Exemplo de execução no terminal:
```bash
> random@1.0.0 test
> jest

 PASS  tests/Random.node.test.ts
  Random Node - validações
    √ Deve lançar erro se min for negativo (19 ms)
    √ Deve lançar erro se max for negativo (1 ms)
    √ Deve lançar erro se min > max
    √ Deve lançar erro se min === max (1 ms)
    √ Deve lançar erro se min não for inteiro (1 ms)
    √ Deve lançar erro se max não for inteiro (1 ms)
```
## 📁 Estrutura do Projeto

```
PROJETO-ONFLY/
│
├── custom-nodes/Random/            # Diretório principal do nó customizado "Random"
│   │
│   ├── dist/                       # Saída do código compilado (gerado pelo TypeScript)
│   │
│   ├── node_modules/               # Dependências instaladas via NPM (não versionar no Git)
│   │
│   ├── src/                        # Código-fonte principal do nó
│   │   ├── Random.node.ts          # Implementação do nó Random em TypeScript
│   │   └── Random.svg              # Ícone do nó (usado para exibição na UI)
│   │
│   ├── tests/                      # Pasta dedicada a testes unitários
│   │
│   ├── jest.config.js              # Configuração do Jest (framework de testes)
│   ├── package.json                # Configuração do projeto (scripts, dependências, metadados)
│   ├── package-lock.json           # Registro exato das versões das dependências
│   └── tsconfig.json               # Configuração do compilador TypeScript
│
├── .dockerignore                   # Arquivos e pastas ignorados pelo Docker
├── .env                            # Arquivo de variáveis de ambiente (não deve ir pro Git)
├── .env.example                    # Exemplo de configuração de variáveis de ambiente
├── docker-compose.yml              # Orquestração de containers com Docker Compose

```

## 🔄 Workflow: Random → PostgreSQL

Para criar um workflow que salva dados na tabela `random_data`, consulte `WORKFLOW.md`
