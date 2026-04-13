# MarketMVP — Sistema de Usuários

## Stack

- Node.js + Express
- SQLite (`sqlite3`)
- JWT (`jsonwebtoken`)
- Bcrypt
- EJS

---

## Instalação e execução

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior

### Passos

```bash
# 1. Entre na pasta do projeto
cd sistema-usuarios

# 2. Instale as dependências
npm install

# 3. Crie o arquivo de variáveis de ambiente
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
JWT_SECRET=sua_chave_secreta_aqui
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app
```

```bash
# 4. Inicie o servidor em modo desenvolvimento
npm run dev

```

O servidor estará disponível em `http://localhost:3000`.

---

## Usuários de teste

Crie os usuários pelo formulário de cadastro em `http://localhost:3000/signup`.

| Nome | E-mail | Senha | Perfil |
|---|---|---|---|
| Admin Teste | admin@marketmvp.com | Admin@123 | administrador |
| Comprador Teste | comprador@marketmvp.com | Comprador@123 | comprador |
| Vendedor Teste | vendedor@marketmvp.com | Vendedor@123 | vendedor |

> Após o cadastro, verifique o código gerado no terminal (o envio de e-mail depende das credenciais configuradas no `.env`) e acesse `http://localhost:3000/verify` para ativar a conta.

---

## Funcionalidades implementadas

### 1. Criação de conta
Formulário de cadastro com campos de nome, sobrenome, e-mail, senha e perfil. Senhas armazenadas com hash via `bcrypt`. Cadastro com e-mail duplicado é bloqueado.

### 2. Login
Autenticação por e-mail e senha com verificação de perfil selecionado. Sessão mantida via cookie JWT. Rotas protegidas exigem token válido.

### 3. Controle de acesso por perfil
O navbar e as rotas se adaptam automaticamente ao perfil do usuário autenticado:
- **Administrador** — acesso ao painel admin e aos logs
- **Vendedor** — acesso ao painel do vendedor
- **Comprador** — acesso aos pedidos

Rotas administrativas são protegidas por middlewares `authMiddleware` e `adminMiddleware`.

### 4. Gestão de usuários (admin)
O painel administrativo (`/admin`) lista todos os usuários cadastrados com nome, e-mail, perfil e status. O administrador pode desativar contas. Usuários desativados não conseguem realizar login.

### 5. Validação de e-mail por código único
Ao criar conta, um código de 6 dígitos é gerado com validade de 15 minutos. A conta só fica ativa para login após a validação. Existe opção de reenvio de código na tela de verificação (`/verify`).

### 6. Auditoria de logs
Toda requisição não-GET é registrada automaticamente na tabela `logs` do banco de dados, contendo data/hora, usuário responsável (quando autenticado), método HTTP, rota acessada e descrição da ação. A leitura dos logs é restrita ao perfil administrador em `/admin/logs`.






## Execução

# Banco de Dados

Execute o comando abaixo no terminal, para conectar-se ao banco de dados e criar as tabelas.

```node src/database/init.js``` 
