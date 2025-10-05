# Documento de Especificação de Requisitos - Sistema Kanban Compartilhado (v2.3)

## 1. Introdução e Objetivo

Este documento especifica os requisitos funcionais e não funcionais para o **Sistema Kanban Compartilhado e Gerenciamento de Posse de Dados**. O objetivo principal do sistema é fornecer uma plataforma Full-Stack segura e colaborativa que:

1.  Permita a visualização de **todos** os cartões por qualquer usuário logado (Quadro Kanban Compartilhado).
2.  Garanta que a criação, edição, exclusão e transferência de um cartão sejam estritamente restritas ao seu **dono** (Regra de Negócio Central).

## 2. Atores do Sistema

* **Usuário Autenticado:** Qualquer indivíduo que tenha concluído o processo de cadastro (`/users/`) e autenticação (`/token`). Este é o único ator com permissão para acessar e interagir com as funcionalidades do sistema, incluindo:
    * **Colaboração:** Visualizar todos os cartões na listagem.
    * **Gerenciamento de Posse:** Criar novos cartões, e manipular (editar, excluir, transferir posse) *apenas* os cartões de sua propriedade.

## 3. Requisitos Funcionais (RF)

Os requisitos estão separados por escopo (Sistema/API e Interface/UX).

### 3.1. Requisitos do Sistema (API e Regra de Negócio)

| ID | Nome do Requisito | Descrição | Ator Principal |
| :--- | :--- | :--- | :--- |
| RF001 | Autenticação e Cadastro | O sistema deve permitir o **cadastro** de novos usuários (`/users/`), o **login** de usuários existentes (`/token`) e a **proteção** de todas as rotas de escrita (JWT). | Usuário Autenticado |
| RF002 | Criar Conteúdo | O sistema deve permitir que um Usuário Autenticado crie um novo item, **automaticamente definindo-o como proprietário** (`/items/`). | Usuário Autenticado |
| RF003 | Editar Conteúdo | O sistema deve permitir que um Usuário Autenticado modifique **somente seus próprios** itens de conteúdo (`/items/{item_id}`). | Usuário Autenticado |
| RF004 | Excluir Conteúdo | O sistema deve permitir que um Usuário Autenticado remova **somente seus próprios** itens de conteúdo do sistema (`/items/{item_id}`). | Usuário Autenticado |
| RF005 | Listar Conteúdos | O sistema deve permitir a visualização de uma lista de todos os itens de conteúdo **independente do usuário conectado** (Quadro Kanban Compartilhado). | Usuário Autenticado |
| RF006 | Visualizar um Conteúdo | O sistema deve permitir a visualização dos detalhes completos de um item de conteúdo específico. | Usuário Autenticado |
| RF007 | Transferência de Posse | O sistema deve permitir que o **dono atual** de um item transfira a posse para qualquer outro usuário cadastrado (`/items/{item_id}/transfer/{new_owner_id}`). | Usuário Autenticado |
| RF008 | Excluir Usuário | A exclusão de um Usuário Autenticado deve, automaticamente, excluir **todos** os itens de conteúdo que pertenciam a ele (Deleção em Cascata). | Usuário Autenticado |
| RF008 | Listar Todos Usuários (Backend) | O sistema deve fornecer um endpoint protegido (/users/all/) que lista todos os usuários cadastrados, para ser consumido pelo modal de Transferência de Posse. | Usuário Autenticado |

### 3.2. Requisitos da Interface (Frontend e Experiência do Usuário)

| ID | Nome do Requisito | Descrição | Ator Principal |
| :--- | :--- | :--- | :--- |
| **RF009** | Interface Kanban | O sistema deve apresentar o quadro principal no formato Kanban, organizando os cartões em colunas distintas baseadas no campo `status` (`A Fazer`, `Em Andamento`, `Concluído`). | Usuário Autenticado |
| **RF010** | Arrastar e Soltar (D&D) | O usuário deve poder arrastar e soltar cartões entre as colunas, o que deve atualizar de forma assíncrona o campo `status` no backend. | Usuário Autenticado |
| **RF011** | Modais de Interação | A interface deve utilizar modais para a criação e edição de cartões, exibindo claramente a opção de **Transferir Posse** apenas quando o usuário logado for o dono do item. | Usuário Autenticado |
| **RF012** | Redirecionamento de Sessão | Caso a sessão do usuário expire (`401 Unauthorized`), o sistema deve redirecioná-lo automaticamente para a tela de Login (Tratamento de erro via Interceptor Axios). | Sistema |

## 4. Requisitos Não Funcionais (RNF)

| ID | Nome do Requisito | Descrição | Status de Implementação |
| :--- | :--- | :--- | :--- |
| **RNF001** | Usabilidade | A interface deve ser **responsiva** e intuitiva, com um *Design System* consistente (Chakra UI) para facilitar a interação com os cartões e formulários. | IMPLEMENTADO |
| **RNF002** | Segurança (Autenticação) | O sistema deve usar **JSON Web Tokens (JWT)** para proteger todas as rotas de escrita e de usuário, garantindo o controle de acesso de forma *stateless*. | IMPLEMENTADO |
| **RNF003** | Desempenho (API) | A API deve ser capaz de retornar a listagem de cartões rapidamente, visando um tempo de resposta inferior a 500ms para requisições de leitura. | IMPLEMENTADO |
| **RNF004** | Manutenibilidade | A arquitetura deve ser modular, com separação clara entre Backend (FastAPI) e Frontend (React) e uso de padrões de projeto (ORM/Pydantic) para facilitar a manutenção e o *debugging*. | IMPLEMENTADO |
| **RNF005** | Demonstração e Reset | O sistema deve incluir uma rota protegida (/debug/reset-db) que limpa o banco de dados e o popula com dados iniciais de demonstração (seeding), garantindo um ambiente limpo para testes. | IMPLEMENTADO |