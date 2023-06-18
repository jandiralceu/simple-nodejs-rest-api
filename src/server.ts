import fastify from "fastify";

import { knex } from "./database";

const app = fastify();

app.get("/hello", async () => {
  return (await knex("sqlite_schema").select("*"));
});

app.listen({ port: 3333 })
  .then(() => {
    console.log("Server is running...");
  })
  .catch((_) => {
    console.log("Error on running the application...");
  });
