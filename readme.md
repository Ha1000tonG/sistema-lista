# 🚀 Projeto Full-Stack: Quadro Kanban (v1.0)

Este projeto é uma demonstração full-stack que evoluiu de um Headless CMS genérico para um **Quadro Kanban de Gerenciamento de Posse**. Ele exibe o domínio de arquitetura, segurança e integridade de dados em aplicações modernas.

A principal regra de negócio é o **Quadro Compartilhado**: todos os usuários logados podem visualizar todos os cartões, mas as ações de modificação são estritamente restritas ao dono original do item (Gerenciamento de Posse).

---

## ✨ Funcionalidades Avançadas e Destaques

* **Segurança (JWT):** Implementação completa de autenticação com **JSON Web Tokens (JWT)**, protegendo todas as rotas de escrita e manipulação de dados.
* **Gerenciamento de Posse:** Controles de autorização no *backend* garantem que apenas o `owner_id` de um cartão possa realizar `PUT` e `DELETE`.
* **Transferência de Posse:** Rota **PATCH** dedicada para que o dono de um cartão possa transferir a propriedade para outro usuário cadastrado.
* **Deleção em Cascata:** Configuração de integridade de dados que, ao excluir um usuário, **remove automaticamente todos os cartões** associados a ele.
* **Controle de Ambiente:** Configuração isolada para alternar entre o **SQLite** (ambiente local) e o **PostgreSQL** (produção).
* **Experiência do Usuário (UX):** Interface com funcionalidade **Drag and Drop** para mover cartões entre as colunas, atualizando o *status* em tempo real no backend.

---

## 🛠️ Tecnologias Utilizadas e Propósito

### **Back-end (API de Gerenciamento de Posse)**

O foco foi em performance, segurança e integridade de dados.

| Tecnologia | Papel no Projeto |
| :--- | :--- |
| **Framework:** FastAPI | Alta performance (Async/Await) e produtividade para a criação de rotas RESTful. |
| **Validação:** Pydantic | Definição de schemas de dados e validação rigorosa dos *payloads* de entrada e saída da API. |
| **ORM:** SQLAlchemy | Abstração do banco de dados, facilitando a troca entre SQLite (dev) e PostgreSQL (prod). Essencial para o relacionamento `ON DELETE CASCADE`. |
| **Segurança:** `python-jose` / `passlib` | Implementação do JWT e *hashing* seguro de senhas. |
| **Configuração:** `pydantic-settings` | Gerenciamento seguro de variáveis de ambiente (`SECRET_KEY`, `DATABASE_URL`) entre os ambientes. |

### **Front-end (Interface Kanban)**

O foco foi em reatividade, usabilidade e comunicação com a API.

| Tecnologia | Papel no Projeto |
| :--- | :--- |
| **Biblioteca:** React | Base reativa da aplicação, utilizando *hooks* para gerenciamento de estado dos cartões e usuários. |
| **UI:** Chakra UI | *Design System* modular para componentes modernos, responsivos e acessíveis (`Modal`, `Select`, `Input`). |
| **D&D:** `@dnd-kit` | Biblioteca escolhida para a funcionalidade de arrastar e soltar cartões no Quadro Kanban. |
| **Cliente HTTP:** Axios | Gerenciamento de requisições, com um **Interceptor** que automaticamente envia o token JWT e trata a expiração de sessão (`401 Unauthorized`). |

---

## ⚙️ Como Executar o Projeto (Localmente)

Para rodar este projeto, você precisará de dois terminais abertos, um para o back-end e um para o front-end.

### 1. Rodando o Back-end (API)

```bash
# A partir da pasta raiz do projeto (ex: sistema-lista/)
# 1. Crie e ative o ambiente virtual

# 2. Instale as dependências
pip install -r backend/requirements.txt

# 3. Inicie o servidor da API (a partir da raiz)
uvicorn backend.main:app --reload

# O servidor estará ativo em http://localhost:8000
```

### 2. Rodando o Frontend

```bash
# Em um novo terminal, a partir da pasta raiz do projeto
cd frontend

# 1. Instale as dependências
npm install

# 2. Inicie o servidor de desenvolvimento
npm run dev

# O frontend estará acessível em http://localhost:5173
```


## Endpoints da API
A API fornece os seguintes endpoints genéricos para o gerenciamento de itens de conteúdo:

| Método | URL                   | Ação                                                  | Status |
| :----- | :-------------------- | :---------------------------------------------------- | :------------------------ |
| POST   | `/users/`             | Cadastra um novo usuário.                             | PÚBLICO |
| POST   | `/token`              | Realiza o login e retorna o token JWT.                | PÚBLICO |
| GET    | `/users/me`           | Retorna os dados do usuário logado.                   | PROTEGIDO |
| DELETE | `/users/{user_id}`    | 	Exclui o usuário (apenas auto-exclusão permitida) e todos os seus itens. | PROTEGIDO |
| POST   | `/items/`             | 	Cria um novo item (automaticamente atribuído ao usuário logado).         | PROTEGIDO |
| GET    | `/items/`             | Lista TODOS os cartões (Quadro Compartilhado).        | PÚBLICO |
| PUT    | `/items/{item_id}`    | Atualiza um item. Apenas o dono pode atualizar.       | PROTEGIDO |
| PATCH  | `/items/{item_id}/transfer/{new_owner_id}`| Transfere a posse do item para outro usuário. | PROTEGIDO |
| DELETE | `/items/{item_id}`    | Exclui um item. Apenas o dono pode excluir.           | PROTEGIDO |