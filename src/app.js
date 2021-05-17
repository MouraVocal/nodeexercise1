const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
const repositoryLikes = [];

function validateId(request, response, next){
  if(!isUuid){
    response.status(400).json({ error: 'Invalid Id Project.'})
  }

  return next();
}

app.get("/repositories", (request, response) => {
  //Rota que lista todos os repositórios
    return response.json(repositories);
});

app.post("/repositories", validateId, (request, response) => {
  // A rota deve receber title, url e techs dentro do corpo da requisição, sendo a URL o link para o github desse repositório. Ao cadastrar um novo projeto, ele deve ser armazenado dentro de um objeto no seguinte formato: { id: "uuid", title: 'Desafio Node.js', url: 'http://github.com/...', techs: ["Node.js", "..."], likes: 0 }; Certifique-se que o ID seja um UUID, e de sempre iniciar os likes como 0.

  // A rota deve aumentar o número de likes do repositório específico escolhido através do id presente nos parâmetros da rota, a cada chamada dessa rota, o número de likes deve ser aumentado em 1;

  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repositories);
});

app.put("/repositories/:id", validateId, (request, response) => {
  //deve alterar apenas o title, a url e as techs do repositório que possua o id igual ao id presente nos parâmetros da rota
  const { id } = request.params;

  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not founded'});
  };

  const { likes } = repositories[repositoryIndex];

  const repository = { id, title, url, techs, likes };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", validateId, (request, response) => {
  //A rota deve deletar o repositório com o id presente nos parâmetros da rota
  // TODO
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not founded'})
  };

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex === -1) {
    return response.status(400).json({ error: 'Repository does not exist.'})
  }

  repositories[repositoryIndex].likes++

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;