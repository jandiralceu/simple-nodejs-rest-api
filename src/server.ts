import fastify from "fastify";
import cookie from "@fastify/cookie";
import { transactionsRoutes } from "./routes/transactions";

const app = fastify();
// eslint-disable-next-line
app.register(cookie);
// eslint-disable-next-line
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
