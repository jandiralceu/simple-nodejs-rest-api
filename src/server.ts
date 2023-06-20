import { app } from "./app";
import { env } from "./env";

app.listen({ port: env.PORT, host: "0.0.0.0" })
  .then(() => {
    console.log("Server is running...");
  })
  .catch((_) => {
    console.log("Error on running the application...");
  });
