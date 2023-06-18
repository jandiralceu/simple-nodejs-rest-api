import { type FastifyReply, type FastifyRequest } from "fastify";

export async function validateSessionId (
  request: FastifyRequest,
  reply: FastifyReply): Promise<void> {
  const sessionId = request.cookies.sessionId;

  if (!sessionId) {
    return reply.status(401).send({
      error: "Not authorized. Please, create a transaction!"
    });
  }
}
