# Documento de Requisitos - Sistema de Blog v1.0

## 1. Introdução

Este documento especifica os requisitos funcionais e não funcionais para a primeira versão (v1.0) do Sistema de Blog. O objetivo do sistema é permitir que autores criem e gerenciem conteúdo (posts) e que leitores visualizem esses posts e interajam através de comentários.

## 2. Atores do Sistema

* **Autor:** Usuário responsável pela criação e gerenciamento dos posts.
* **Leitor:** Qualquer visitante do blog que consome o conteúdo e pode interagir com ele.

## 3. Requisitos Funcionais (RF)

Os Requisitos Funcionais descrevem o que o sistema deve fazer.

| ID    | Nome do Requisito           | Descrição                                                                                                  | Ator Principal |
| :---- | :-------------------------- | :--------------------------------------------------------------------------------------------------------- | :------------- |
| RF001 | Autenticar Autor            | O Autor deve poder fazer login no sistema com um usuário e senha para acessar a área administrativa.         | Autor          |
| RF002 | Criar Post                  | O Autor, uma vez autenticado, deve poder criar um novo post, fornecendo um título, conteúdo e categoria.    | Autor          |
| RF003 | Editar Post                 | O Autor deve poder editar o conteúdo, título e categoria de um post que ele mesmo criou.                     | Autor          |
| RF004 | Publicar Post               | O Autor deve poder alterar o status de um post para "Publicado", tornando-o visível para os Leitores.         | Autor          |
| RF005 | Gerenciar Categorias        | O Autor deve poder criar, editar e excluir categorias para organizar os posts.                             | Autor          |
| RF006 | Listar Posts Publicados     | O Leitor deve poder visualizar uma lista de todos os posts publicados na página inicial do blog.              | Leitor         |
| RF007 | Visualizar Post             | O Leitor deve poder clicar em um post na lista para ver seu conteúdo completo.                                | Leitor         |
| RF008 | Adicionar Comentário        | O Leitor deve poder adicionar um comentário em um post, fornecendo seu nome e o texto do comentário.        | Leitor         |
| RF009 | Moderar Comentários         | O Autor deve poder aprovar ou excluir comentários feitos em seus posts.                                      | Autor          |

## 4. Requisitos Não Funcionais (RNF)

Os Requisitos Não Funcionais descrevem como o sistema deve ser (qualidades e restrições).

| ID    | Nome do Requisito | Descrição                                                                                             |
| :---- | :---------------- | :---------------------------------------------------------------------------------------------------- |
| RNF001| Usabilidade       | A interface administrativa para o Autor deve ser intuitiva, não exigindo treinamento extensivo.        |
| RNF002| Desempenho        | A página de listagem de posts deve carregar em menos de 3 segundos com até 1.000 posts no banco de dados. |
| RNF003| Compatibilidade   | O blog deve ser renderizado corretamente nas versões mais recentes dos navegadores Chrome, Firefox e Safari. |
| RNF004| Segurança         | A senha do Autor deve ser armazenada no banco de dados de forma criptografada.                          |