# API de Vídeos e Categorias

Esta é uma API construída com Node.js, Express e MongoDB que permite aos usuários gerenciar vídeos e categorias.

## Funcionalidades

### Categorias

- **POST /category**: Cria uma nova categoria. O corpo da solicitação deve ser um JSON com a propriedade `name`.
- **GET /categories**: Retorna todas as categorias.
- **PUT /categoria/:id**: Atualiza uma categoria existente. O corpo da solicitação deve ser um JSON com a propriedade `name`.
- **DELETE /categoria/:id**: Exclui uma categoria existente.

### Vídeos

- **POST /videos**: Cria um novo vídeo. O corpo da solicitação deve ser um JSON com as propriedades `title`, `description`, `category`, `videoUrl` e `thumbnail`.
- **GET /videos**: Retorna todos os vídeos.
- **GET /videos/:id**: Retorna um vídeo específico.
- **PUT /videos/:id**: Atualiza um vídeo existente. O corpo da solicitação deve ser um JSON com as propriedades `title`, `description`, `category`, `videoUrl` e `thumbnail`.
- **DELETE /videos/:id**: Exclui um vídeo existente.

## Como usar

1. Clone este repositório.
2. Instale as dependências com `npm install`.
3. Inicie o servidor com `npm start`.
4. A API estará disponível em `http://localhost:3333`.

## Contribuindo

Se você quiser contribuir para este projeto, por favor, faça um fork do repositório e envie um pull request.

## Licença

Este projeto está licenciado sob a licença MIT.
