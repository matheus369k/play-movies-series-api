<h1 align='center'>Play Movies and Series - API Node</h1>

<div align='center'>

[Descrição](#descrição)
|
[Iniciando](#iniciando)
|
[Dependências](#dependências)
|
[Rotas](#rotas)
|
[Licença](#licença)

</div>

<div align='center'>
  <img src='https://img.shields.io/github/license/matheus369k/play-movies-series-api.svg'/>
  <img src='https://img.shields.io/github/watchers/matheus369k/play-movies-series-api.svg' />
</div>

## Descrição

A aplicação e a API do projeto **[Play Movies Series](https://github.com/matheus369k/play-movies-series)**, um site fictício de Stream de filmes and series.

Principais Funcionalidade:

- registro e login de usuário.
- validação com jwt(json web token), para login automático.
- atualização de perfil, com upload de imagens.
- criação de avaliação da media/filme, usando o like e dis-like.
- contagem de like e des-like de todos os usuários, com o redis.
- salvar e remover, filme para assistir mais tarde.

## Dependências

- Git - [baixar](https://git-scm.com)
- Node - [baixar](https://nodejs.org/pt)
- Docker ( Recomendado ) - [baixar](https://www.docker.com/)
- VSCode ( Recomendado ) - [baixar](https://code.visualstudio.com)
- Front-end ( Recomendado ) - [repositório](https://github.com/matheus369k/play-movies-series)

## Iniciando

Para testar o projeto na sua maquina, recomenda-se clonar o repositório em uma pasta local, como seguinte comando.

### Instalando o projeto

Digite no terminal:

**HTTPS**

```
$ git clone https://github.com/matheus369k/play-movies-series-api.git
```

Acesse o projeto com seguinte comando

```
$ play-movies-series-api
```

Instalando as dependências

```
$ npm install
```

inicie o docker e insira o comando

```
$ docker compose up -d
```

### Configurando

crie um arquivo **.env** e adicione as variáveis ambiente a seguir

```
// Obrigatório
# Database
DATABASE_URL=postgresql://root:root@localhost:5432/users

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET_KEY=8b09ede2-c721-48b0-9f37-d542a55f378b

// Opcional
# Server
PORT=3333
WEB_URL=http://localhost:3000
```

Esse comando ira criar as tabela no banco de dados.

```
$ npm run db:migrate
$ npm run db:generate
```

Aplicação pronta, use o comando abaixo para rodar a aplicação

```
$ npm run dev
```

## Rotas

Para testar e ver em primeira mão a estrutura e o funcionamento das rotas, acesse [client.http](./client.http).

## 📜Licença

Para o projeto fora usado a licença 🔗[MIT](/LICENSE.txt).
