# Documento de Requisitos - Sistema de Portfólio v1.0

## 1. Introdução

Este documento especifica os requisitos para a primeira versão (v1.0) do Sistema de Portfólio. O objetivo do sistema é permitir que o administrador gerencie os projetos a serem exibidos e que visitantes possam visualizar esses projetos.

## 2. Atores do Sistema

* **Administrador:** O dono do portfólio, responsável por adicionar e gerenciar os projetos.
* **Visitante:** Qualquer pessoa que acesse o site para visualizar os projetos.

## 3. Requisitos Funcionais (RF)

| ID    | Nome do Requisito      | Descrição                                                                                                                              | Ator Principal |
| :---- | :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------- | :------------- |
| RF001 | Autenticar Administrador | O Administrador deve poder fazer login no sistema com um usuário e senha para acessar a área de gerenciamento. (Funcionalidade Futura) | Administrador  |
| RF002 | Adicionar Projeto      | O Administrador, uma vez autenticado, deve poder adicionar um novo projeto, fornecendo título, descrição, tecnologias e URLs. | Administrador  |
| RF003 | Editar Projeto         | O Administrador deve poder editar as informações de um projeto existente.                                                              | Administrador  |
| RF004 | Excluir Projeto        | O Administrador deve poder remover um projeto do portfólio.                                                                           | Administrador  |
| RF005 | Listar Projetos        | O Visitante deve poder visualizar uma lista com todos os projetos publicados na página inicial.                                          | Visitante      |
| RF006 | Visualizar Detalhes    | O Visitante deve poder ver os detalhes de cada projeto, incluindo descrição, tecnologias e links.                                      | Visitante      |

## 4. Requisitos Não Funcionais (RNF)

| ID     | Nome do Requisito | Descrição                                                                                                  |
| :----- | :---------------- | :--------------------------------------------------------------------------------------------------------- |
| RNF001 | Usabilidade       | A interface de gerenciamento para o Administrador deve ser intuitiva.                                        |
| RNF002 | Desempenho        | A página inicial com a lista de projetos deve carregar em menos de 3 segundos.                               |
| RNF003 | Compatibilidade   | O portfólio deve ser renderizado corretamente nas versões mais recentes dos navegadores Chrome, Firefox e Safari. |
| RNF004 | Segurança         | A senha do Administrador deve ser armazenada no banco de dados de forma criptografada.                       |