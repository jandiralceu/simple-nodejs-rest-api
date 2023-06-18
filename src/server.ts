import fastify from "fastify";

import { transactionsRoutes } from "./routes/transactions";

const app = fastify();

// eslint-disable-next-line @typescript-eslint/no-floating-promises
app.register(transactionsRoutes, {
  prefix: "transactions"
});

app.listen({ port: 3333 })
  .then(() => {
    console.log("Server is running...");
  })
  .catch((_) => {
    console.log("Error on running the application...");
  });
