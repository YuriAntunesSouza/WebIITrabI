# MarketMVP

## Stack

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js v18+ |
| Framework | Express 5 |
| Banco de dados | SQLite via Prisma ORM |
| Autenticação | JWT (cookie) + Bcrypt |
| Templates | EJS |
| Upload de arquivos | Multer |
| Processamento de imagens | Sharp |

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior

---

## Instalação e execução

```bash
# 1. Entre na pasta do projeto
cd WebIITrabI

# 2. Instale as dependências
npm install

# 3. Crie o arquivo de variáveis de ambiente
cp .env.example .env
```

Edite o `.env` com suas configurações:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET=sua_chave_secreta_aqui
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app
```

```bash
# 4. Execute as migrations e crie o banco de dados
npx prisma migrate dev

# 5. Popule o banco com dados iniciais
npm run seed

# 6. Inicie o servidor em modo desenvolvimento
npm run dev
```

O servidor estará disponível em `http://localhost:3000`.

---

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor com Nodemon (hot reload) |
| `npm start` | Inicia o servidor sem hot reload |
| `npm run seed` | Popula o banco com dados iniciais |
| `npm run reset` | Limpa e recria o banco de dados |

---

## Usuários de teste

Crie os usuários pelo formulário de cadastro em `http://localhost:3000/signup`.

| Nome | E-mail | Senha | Perfil |
|---|---|---|---|
| Admin Teste | admin@marketmvp.com | Admin@123 | administrador |
| Vendedor Teste | vendedor@marketmvp.com | Vendedor@123 | vendedor |
| Comprador Teste | comprador@marketmvp.com | Comprador@123 | comprador |

> Após o cadastro, verifique o código de verificação exibido no terminal (o envio de e-mail depende das credenciais configuradas no `.env`) e acesse `http://localhost:3000/verify` para ativar a conta.

---

## Rotas principais

### Públicas
| Método | Rota | Descrição |
|---|---|---|
| GET | `/` | Página inicial com produtos recentes |
| GET | `/login` | Tela de login |
| GET | `/signup` | Tela de cadastro |
| GET | `/verify` | Verificação de e-mail |
| GET | `/products/:id` | Detalhes de um produto |
| GET | `/seller/public/:id` | Perfil público do vendedor |
| GET | `/categories` | Listagem de categorias |

### Autenticadas
| Método | Rota | Perfil necessário | Descrição |
|---|---|---|---|
| GET | `/seller` | vendedor | Painel do vendedor |
| GET | `/seller/profile` | vendedor | Editar perfil do vendedor |
| GET | `/buyer/profile` | comprador | Editar perfil do comprador |
| GET | `/orders` | qualquer | Pedidos |
| GET | `/cart` | qualquer | Carrinho |
| GET | `/admin` | administrador | Painel administrativo |
| GET | `/admin/logs` | administrador | Logs de auditoria |

---

## Funcionalidades implementadas

### 1. Autenticação e verificação de conta
Cadastro com nome, e-mail, senha e perfil. Senhas armazenadas com hash via `bcrypt`. Um código de 6 dígitos com validade de 15 minutos é enviado por e-mail para ativar a conta. E-mails duplicados são bloqueados.

### 2. Controle de acesso por perfil
Sessão mantida via cookie JWT. O navbar e as rotas se adaptam ao perfil autenticado. Rotas são protegidas pelos middlewares `authMiddleware`, `adminMiddleware` e `sellerMiddleware`.

### 3. Gestão de produtos (vendedor)
O vendedor pode criar produtos com nome, descrição, categoria, preço, estoque e até 5 imagens. Imagens são processadas pelo Sharp antes de serem salvas. Produtos podem ser excluídos pelo próprio vendedor.

### 4. Comentários e curtidas
Usuários autenticados podem comentar em produtos com texto e imagem opcional. Comentários podem ser curtidos (toggle) e excluídos pelo autor.

### 5. Perfis de usuário
- **Vendedor**: nome da loja, descrição, contato, cidade, estado e categorias atendidas.
- **Comprador**: telefone, endereço, cidade, estado, CEP e forma de pagamento preferida.

### 6. Painel administrativo
Lista todos os usuários com nome, e-mail, perfil e status. O administrador pode ativar ou desativar contas. Usuários desativados não conseguem realizar login.

### 7. Auditoria de logs
Toda requisição não-GET é registrada automaticamente com data/hora, usuário responsável (quando autenticado), método HTTP, rota e descrição da ação. Acessível apenas pelo administrador em `/admin/logs`.
