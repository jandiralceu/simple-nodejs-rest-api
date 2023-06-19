import { app } from "./app";
import { env } from "./env";

app.listen({ port: env.PORT })
  .then(() => {
    console.log("Server is running...");
  })
  .catch((_) => {
    console.log("Error on running the application...");
  });
