## Description
File encryption example with public / private key. API docs for the project are available with a Swagger documentation at `/api`.
Run `docker-compose up --build -V -d` and go to `http://localhost:3000/api`

## Before first run

1. Run `npm install`
2. Copy `.env.example` to `.env` and fill it with your data
3. Run tests `npm run test`

## Running with docker

```bash
$ docker-compose up --build -V -d
```

## Running without docker

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
## License

[MIT licensed](LICENSE).
