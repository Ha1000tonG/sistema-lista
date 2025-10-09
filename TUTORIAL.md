# Guia Rápido do Usuário: Quadro Kanban

Bem-vindo ao nosso Quadro Kanban! Esta ferramenta foi projetada para ajudar você e sua equipe a organizar tarefas de forma visual, simples e eficiente. Siga este guia para aprender a usar as principais funcionalidades.

## Primeiros Passos 🚀

### 1. Cadastrar um Novo Usuário
Para começar a usar o quadro, você precisa de uma conta.
- Na tela inicial, clique no link ou botão para **"Cadastrar"**.
- Preencha seu nome de usuário e senha nos campos indicados.
- Clique em **"Criar Conta"** e pronto! Você será redirecionado para a tela de login.

### 2. Fazer Login
- Na tela inicial, digite o nome de usuário e a senha que você acabou de criar.
- Clique em **"Entrar"** para acessar o quadro Kanban.

---

## Gerenciando suas Tarefas (Cartões) 📋

O coração do sistema são os cartões, que representam suas tarefas.

### Adicionar uma Nova Tarefa
1.  Clique no botão verde **"Adicionar Tarefa"**.
2.  Uma janela se abrirá com os seguintes campos:
    * **Título:** Um nome curto e objetivo para sua tarefa. (Obrigatório)
    * **Descrição:** Detalhes adicionais sobre o que precisa ser feito.
    * **Tags:** Palavras-chave para categorizar sua tarefa (Ex: `Urgente`, `Design`, `Correção`). Separe as tags por vírgula.
3.  Clique em **"Salvar"**. Sua nova tarefa aparecerá na coluna "A Fazer".

### Movendo os Cartões (Arrastar e Soltar)
A principal funcionalidade de um quadro Kanban é mover as tarefas entre as colunas para representar seu progresso.
-   Para mover um cartão, simplesmente **clique sobre ele, segure o botão do mouse e arraste-o** para a coluna desejada ("Em Andamento" ou "Concluído").
-   Você também pode reordenar os cartões dentro de uma mesma coluna, arrastando-os para cima ou para baixo para definir prioridades.

### Editando uma Tarefa
Você pode alterar os detalhes de um cartão a qualquer momento.
1.  Encontre o cartão que deseja modificar.
2.  Clique no botão **"Editar"**.
3.  Na janela de edição, você pode alterar:
    * **Título, Descrição e Tags:** Assim como na criação.
    * **Proprietário:** Este é um campo especial. Veja abaixo.

#### Transferindo a Propriedade de um Cartão
Na tela de edição, o campo **"Proprietário"** permite que você transfira a responsabilidade (e o controle) de um cartão para outro usuário.
-   Clique na lista e selecione o novo usuário.
-   Ao salvar, o cartão passará a pertencer a essa pessoa.

### Excluindo uma Tarefa
- Para remover um cartão permanentemente, clique no **ícone de lixeira** (🗑️).
- Uma mensagem de confirmação aparecerá para evitar exclusões acidentais.

---

## Regras Importantes de Permissão 🔑

Para garantir a organização e a segurança das tarefas, existe uma regra fundamental:

> **Apenas o proprietário de um cartão pode editá-lo, excluí-lo ou transferir sua propriedade para outra pessoa.**

Isso significa que você tem total controle sobre as tarefas que cria, e outros usuários não podem alterá-las sem a sua permissão (que é dada ao transferir a propriedade).

---

## Gerenciamento da Conta ⚙️

### Excluir sua Conta
- No topo da página, você encontrará o botão **"Excluir Conta"**.
- **Atenção:** Esta ação é **irreversível**. Ao clicar, sua conta de usuário e **todos os cartões que você criou** serão apagados permanentemente do sistema.

### Sair (Logout)
- Para encerrar sua sessão com segurança, clique no botão **"Sair"**.
- Você será levado de volta para a tela de login.

---

## Ferramenta de Demonstração ⚠️

### O Botão "Restaurar Base de Demonstração"
Este botão especial foi criado para apresentações ou para reiniciar o ambiente de teste rapidamente.

-   **O que ele faz?** Ao ser clicado, este botão executa uma ação drástica: **apaga TODOS os usuários e TODOS os cartões** do sistema. Em seguida, ele cria um único usuário padrão `Admin` (senha: `123`) com três cartões de exemplo.
-   **ATENÇÃO:** Use esta função com extremo cuidado. Ela **apaga todos os dados permanentemente** e não pode ser desfeita.