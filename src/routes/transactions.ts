import { type FastifyInstance } from "fastify";
import { z } from "zod";
import { randomUUID } from "node:crypto";

import { knex } from "../database";

export async function transactionsRoutes (app: FastifyInstance): Promise<void> {
  app.get("/", async () => {
    return (await knex("transactions").select("*"));
  });

  app.post("/", async (request, reply) => {
    const createTransactionsBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"])
    });

    const body = createTransactionsBodySchema.parse(request.body);

    await knex("transactions").insert({
      id: randomUUID(),
      title: body.title,
      amount: body.type === "credit" ? body.amount : body.amount * -1
    });

    // eslint-disable-next-line @typescript-eslint/return-await
    return reply.status(201).send();
  });
  // app.put("/", async () => {
  //   return (await knex("transactions").where("amount", 1000).select("*"));
  // });
  // app.delete("/", async () => {
  //   return (await knex("transactions").where("amount", 1000).select("*"));
  // });
}
