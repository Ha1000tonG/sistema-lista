# Projeto: API de Conteúdo flexível (Headless CMS) com Front-end em React

Este é um projeto full-stack construído para demonstrar a criação de uma API de conteúdo flexível (Headless CMS) usando FastAPI e um front-end de consumo em React.

A aplicação serve como um motor para um portfólio, mas foi projetada para ser genérica o suficiente para gerenciar qualquer tipo de conteúdo (posts de blog, depoimentos, etc.). A interface permite criar, ler, atualizar e excluir itens de conteúdo (CRUD).

---

## Tecnologias Utilizadas

Este projeto é dividido em duas partes principais: o Back-end e o Front-end.

### **Back-end (API Genérica)**
* **Framework:** FastAPI
* **Linguagem:** Python 3
* **Banco de Dados:** SQLite
* **ORM (Object-Relational Mapper):** SQLAlchemy
* **Servidor ASGI:** Uvicorn
* **Validação de Dados:** Pydantic
* **Gerenciamento de Dependências:** Pip com `requirements.txt`

### **Front-end (Interface de Portfólio)**
* **Biblioteca:** React 18
* **Ferramenta de Build:** Vite
* **Linguagem:** JavaScript (JSX)
* **Biblioteca de Componentes UI:** **Chakra UI**
* **Cliente HTTP:** Axios
* **Gerenciamento de Dependências:** NPM com `package.json`
* **Pré-requisitos:** Node.js

---

## Como Executar o Projeto

Para rodar este projeto, você precisará de dois terminais abertos, um para o back-end e um para o front-end.

### 1. Rodando o Back-end (API)

```bash
# A partir da pasta raiz do projeto (ex: sistema-lista/)
# Crie e ative o ambiente virtual (se ainda não o fez)

# No Windows:
.\backend\venv\Scripts\activate
# No macOS/Linux:
source backend/venv/bin/activate

# Instale as dependências
pip install -r backend/requirements.txt

# Inicie o servidor da API (a partir da raiz)
uvicorn backend.main:app --reload


### 1. Rodando o Frontend

```bash
# Em um novo terminal, a partir da pasta raiz do projeto
cd frontend

# Instale as dependências (se ainda não o fez)
npm install

# Inicie o servidor de desenvolvimento
npm run dev