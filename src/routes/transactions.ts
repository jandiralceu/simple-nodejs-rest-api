import { type FastifyInstance } from "fastify";
import { z } from "zod";
import { randomUUID } from "node:crypto";

import { knex } from "../database";
import { validateSessionId } from "../middlewares";

export async function transactionsRoutes (app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", async () => {});

  app.get("/", { preHandler: [validateSessionId] }, async (request, _) => {
    const transactions = await knex("transactions")
      .where("session_id", request.cookies.sessionId)
      .select("*");

    return { transactions };
  });

  app.get("/:id", { preHandler: [validateSessionId] }, async (request, _) => {
    const getTransactionsParamsSchema = z.object({
      id: z.string().uuid()
    });

    const { id } = getTransactionsParamsSchema.parse(request.params);

    return (await knex("transactions")
      .where({
        id,
        session_id: request.cookies.sessionId
      })
      .first());
  });

  app.get("/summary", { preHandler: [validateSessionId] }, async (request, _) => {
    const summary = await knex("transactions")
      .where("session_id", request.cookies.sessionId)
      .sum("amount", { as: "amount" })
      .first();

    return { summary };
  });

  app.post("/", async (request, reply) => {
    const createTransactionsBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"])
    });
    const body = createTransactionsBodySchema.parse(request.body);
    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();

      reply.cookie("sessionId", sessionId, {
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      });
    }

    await knex("transactions").insert({
      id: randomUUID(),
      title: body.title,
      amount: body.type === "credit" ? body.amount : body.amount * -1,
      session_id: sessionId
    });

    return reply.status(201).send();
  });
}
