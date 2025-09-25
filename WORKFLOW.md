# Como Configurar o Workflow Random → PostgreSQL

## 📋 Pré-requisitos

- n8n rodando localmente (veja README.md)

## 🔧 Configuração Inicial

### 1. Acessar o n8n
```
http://localhost:5678
```

### 2. Fazer Login ou Cadastro

Ao acessar `http://localhost:5678`, use suas credenciais para fazer login.

Se for seu primeiro acesso, crie uma conta. Após o login, você será redirecionado para o editor do n8n.

## 🚀 Criando o Workflow Random → PostgreSQL

### Passo 1: Criar Novo Workflow

1. Clique em **"New Workflow"** no dashboard
2. Você verá um canvas vazio para construir seu workflow

### Passo 2: Adicionar Node de Trigger

1. Clique no botão **"+"** para adicionar um node
2. Pesquise por **"Manual Trigger"**

### Passo 3: Adicionar Node Customizado (Random)

1. Clique no **"+"** após o trigger
2. Pesquise por **"Random"** (node customizado com um ícone de dado)
3. Configure os parâmetros:
   - **Min**: 1
   - **Max**: 100
     
**Entrada esperada**: Nenhuma (node inicial)

**Saída gerada**:
```json
{
  "min": 1,
  "max": 100,
  "randomNumber": 42
}
```

### Passo 4: Adicionar Node de Banco de Dados

1. Clique no **"+"** após o node Random
2. Pesquise por **"PostgreSQL"**
3. Selecione **"Insert rows in a table"**

#### Configuração do Node PostgreSQL:

**Parâmetros Básicos:**
- **Credential**: Selecione "Postgres Neon" (configurada previamente)
  
> Se ainda não tiver cadastrado a credencial, consulte a seção abaixo:  
> [🔑 Caso as credenciais do banco não estejam salvas no n8n](#-caso-as-credenciais-do-banco-não-estejam-salvas-no-n8n)

- **Operation**: Insert
- **Schema**: public
- **Table**: random_data

**Mapeamento de Colunas:**
- **Mapping Column Mode**: Map Each Column Manually
- **Values to Send**:
  - `min`: `{{ $json.min }}`
  - `max`: `{{ $json.max }}`
  - `randomNumber`: `{{ $json.randomNumber }}`
  - **Mantenha apenas esses 3 valores**

**Entrada esperada**:
```json
{
  "min": 1,
  "max": 100,
  "randomNumber": 42
}
```

**Saída gerada**:
```json
{
  "id": 123,
  "min": 1,
  "max": 100,
  "random_number": 42,
  "created_at": "2025-01-09T10:30:00Z"
}
```

# 🔑 Caso as credenciais do banco não estejam salvas no n8n

Se não houver uma credencial PostgreSQL, configure manualmente com os seguintes dados:

- **Host**: `ep-lingering-morning-acybd38x-pooler.sa-east-1.aws.neon.tech`

- **Port**: `5432`

- **Database**: `neondb`

- **User**: `neondb_owner`

- **Password**: `npg_XAs9JULbQC0E`

- **SSL**: `Require`

# 🔄 Fluxo Completo do Exemplo

```
Manual Trigger
    ↓
Random Node (gera 1-100)
    ↓ 
    {min: 1, max: 100, randomNumber: 42}
    ↓
PostgreSQL Insert
    ↓
    Dados salvos na tabela random_data
```
   
