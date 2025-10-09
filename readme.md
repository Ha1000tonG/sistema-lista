# 🚀 Quadro Kanban (v1.0) | Aplicação Full-Stack com React e Python

### Pitch / Resumo
Uma aplicação web completa para gerenciamento de tarefas no estilo Kanban, construída do zero com um frontend reativo em React e uma API RESTful robusta em Python (FastAPI), implantada em um ambiente de produção real na Vercel e Render.

* **[🔗 Demonstração Ao Vivo](https://kanban-hamilton.vercel.app/)**
* **[🐱 Código no GitHub](https://github.com/seu-usuario/seu-repositorio)**


---

## ✨ Funcionalidades Avançadas e Destaques

* **Autenticação de Usuários:** Sistema completo de cadastro, login e segurança de rotas com **tokens JWT**, protegendo todas as rotas de escrita e manipulação de dados.
* **Gerenciamento de Tarefas (CRUD):** Criação, leitura, atualização e exclusão de cartões de tarefas.
* **Quadro Interativo Drag-and-Drop:** Arraste e solte tarefas entre as colunas **"A Fazer", "Em Andamento" e "Concluído"**.
* **Controle de Permissões:** Apenas o proprietário de um cartão pode **editá-lo ou excluí-lo**.
* **Transferência de Propriedade:** Funcionalidade para **delegar tarefas** a outros usuários.
* **Deleção em Cascata:** Configuração de integridade de dados que, ao excluir um usuário, **remove automaticamente todos os cartões** associados a ele.
* **Experiência do Usuário (UX):** Interface, atualizando o *status* em tempo real no backend.
* **Controle de Ambiente:** Configuração isolada para alternar entre o **SQLite** (ambiente local) e o **PostgreSQL** (produção).

---

## 🛠️ Tecnologias Utilizadas e Propósito

A principal regra de negócio é o **Quadro Compartilhado**: todos os usuários logados podem visualizar todos os cartões, mas as ações de modificação são estritamente restritas ao dono original do item (Gerenciamento de Posse).

O foco foi em performance, segurança e integridade de dados.

| Categoria | Tecnologia | Contribuição Principal no Projeto |
| :--- | :--- | :--- |
| **Framework Backend** | **FastAPI** | Desenvolvida API RESTful de alta performance, utilizando `async/await` para operações não bloqueantes e rápidas. |
| **Validação de Dados**| **Pydantic** | Garanti a consistência e a segurança dos dados recebidos e enviados pela API através de schemas de validação. |
| **Acesso a Dados** | **SQLAlchemy** | Criei uma camada de acesso a dados flexível, permitindo a troca transparente entre SQLite e PostgreSQL. |
| **Autenticação** | **JWT (`python-jose`)**| Implementei um sistema de autenticação seguro para proteger rotas e dados do usuário. |
| **Biblioteca Frontend**| **React** | Construí uma Single-Page Application (SPA) reativa e componentizada para uma experiência de usuário fluida. |
| **Design System** | **Chakra UI** | Desenvolvi uma interface responsiva e acessível com agilidade, aproveitando uma biblioteca de componentes modular. |
| **UX & Interatividade**| **@dnd-kit** | Entreguei a principal funcionalidade do Kanban: um sistema intuitivo de arrastar e soltar cartões entre colunas. |
| **Comunicação API** | **Axios** | Garanti a comunicação segura e eficiente com o backend, com gerenciamento automático de tokens de autenticação. |
| **Infraestrutura** | **Vercel & Render**| Orquestrei o deploy da aplicação, com o frontend distribuído globalmente (Vercel) e o backend/banco de dados em um ambiente de produção estável (Render). |
| **Versionamento** | **Git & GitHub**| Gerenciamento do fluxo de desenvolvimento com o uso de *branches* para novas *features* para garantir a qualidade do código antes da integração. |

---

## Garantia de Qualidade (QA)

Para assegurar a estabilidade e a usabilidade da aplicação, realizei testes exploratórios manuais em todas as funcionalidades críticas. O objetivo foi simular o uso real da ferramenta, focando em encontrar bugs e validar a experiência do usuário (UX) nos seguintes fluxos:
* **Cadastro, autenticação e logout de usuários.**
* **Criação, edição, exclusão e transferência de propriedade dos cartões.**
* **Movimentação interativa das tarefas (Drag-and-Drop) entre as colunas.**
* **Validação das regras de permissão.**

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
A API fornece os seguintes endpoints para o gerenciamento de itens de conteúdo:

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
| DELETE | `/debug/reset-db`     | Limpa o banco de dados e o popula com dados de demonstração (usuário "AdminDemo" e 3 cartões).| PÚBLICO (Utility) |
| GET    | `/users/all/`         | Lista todos os usuários cadastrados no sistema (utilizado para a funcionalidade de Transferência de Posse). | PROTEGIDO |
---


## Desafios Técnicos e Soluções

Um dos principais focos deste projeto foi enfrentar desafios reais de um ambiente de produção com serviços gratuitos.

1.  **Otimização de Performance (Cold Starts):**
    * **Problema:** A API e o banco de dados no Render entravam em modo de inatividade, causando demoras de até 60 segundos na primeira visita.
    * **Solução:** Implementei uma estratégia de "keep-alive" com **UptimeRobot** e um endpoint de `/health` no backend, garantindo que a aplicação e o banco de dados permaneçam sempre ativos.

2.  **Resiliência da Conexão com o Banco de Dados:**
    * **Problema:** Erros de conexão (`SSL SYSCall error`) devido a conexões instáveis ou inativas.
    * **Solução:** Configurei o pool de conexões do **SQLAlchemy** com `pool_pre_ping=True` para validar conexões antes do uso, aumentando a robustez da aplicação.

3.  **Correção de Roteamento em SPA:**
    * **Problema:** Erros `404 Not Found` em rotas internas ao recarregar a página na Vercel.
    * **Solução:** Criei um arquivo `vercel.json` com regras de `rewrite` e refatorei a navegação no código para usar o `useNavigate` do React Router, alinhando com as melhores práticas de SPAs.

---
---

###
# Próximos Passo:

Este projeto serve como uma base contínua para aprendizado e demonstração de novas habilidades.

* **Implementação de Testes Automatizados (QA):**
    * **Testes de Ponta a Ponta (E2E):** Desenvolver uma suíte de testes completa para simular a jornada do usuário utilizando **Cypress**.
    * **Testes de API:** Criar testes manuais na API RESTful com **Postman**.
    * **Testes de API:** Criar testes automatizados de integração para a API RESTful com **Pytest**.
    * **Integração Contínua (CI/CD):** Integrar a execução dos testes a um pipeline de **GitHub Actions**.

---