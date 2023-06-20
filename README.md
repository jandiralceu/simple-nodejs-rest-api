# Simple rest api

## Create migrations

```node
npx knex migrate:make create-documents -x ts 
```

## Running migrations

```node
npm run migrate:latest
```

## Canceling migrations

```node
npx knex migrate:rollback
```
