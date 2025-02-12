# Library Management System

Este é um projeto de gestão de livros desenvolvido em Laravel 11, em específico a parte final do projeto anterior.

## Requisitos

- **PHP** >= 8.3
- **MySQL** >= 8.0.33
- **Laravel** 11
- **Vue.js** 3
- **IDE** (PhpStorm ou VS Code)

## Instalação

Clone o repositório:

```sh
git clone https://github.com/r-andomguy/library-final-task.git
cd library-final-task
```

Instale as dependências do Laravel:

```sh
composer install
```

Copie o arquivo de configuração:

```sh
cp .env.example .env
```

Configure o banco de dados no arquivo `.env` e execute as migrações:

```sh
php artisan migrate --seed
```

Gere a chave da aplicação:

```sh
php artisan key:generate
```

Inicie o servidor:

```sh
php artisan serve
```

## Funcionalidades
```
funcionalidades completas estão na branch main.
```
### CRUD de Livros utilizando API.

- Criar, editar, visualizar e excluir livros.
- Cada livro possui título, descrição, data de publicação e um autor.
- Seeder para preencher 10 autores automaticamente.

### CRUD de Autores utilizando API.

- API para gestão de autores com autenticação via Laravel Sanctum.
- Endpoint para listar livros de um autor específico.
- Impede a exclusão de autores com livros associados.

## Observações:
```
Há pontos para ajuste futuro, em específico em cada crud para retornar mensagens 
de erro personalizadas. Outro ponto é o redirecionamento dos usuários não logados
para a tela princiál ou tela de login.
