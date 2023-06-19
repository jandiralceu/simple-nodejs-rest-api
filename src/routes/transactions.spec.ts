import { execSync } from "node:child_process";
import { it, beforeAll, describe, afterAll, expect, beforeEach } from "vitest";
import request from "supertest";
import { faker } from "@faker-js/faker";

import { app } from "../app";
import { knex } from "../database";

const transactionType = ["credit", "debit"];

describe("should test transactions", () => {
  beforeAll(async () => {
    app.ready();
    execSync("npx knex migrate:latest");
  });

  afterAll(() => {
    app.close();
  });

  beforeEach(() => {
    // execSync("npx knex migrate:rollback --all");

    knex("transactions").clear("columns");
  });

  it("should create a transaction", async () => {
    await request(app.server).post("/transactions").send({
      type: faker.helpers.arrayElement(transactionType),
      amount: faker.number.float({ min: 1, max: 1000 }),
      title: faker.lorem.words({ min: 4, max: 6 })
    }).expect(201);
  });

  it("should list all transactions", async () => {
    const createTransactionResponse = await request(app.server).post("/transactions").send({
      type: faker.helpers.arrayElement(transactionType),
      amount: faker.number.float({ min: 1, max: 1000 }),
      title: faker.lorem.words({ min: 4, max: 6 })
    });

    const cookies = createTransactionResponse.get("Set-Cookie");

    const listTransactionsResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies)
      .expect(200);

    expect(listTransactionsResponse.body.transactions).toHaveLength(1);
  });

  it("should get a transaction by id", async () => {
    const createTransactionResponse = await request(app.server).post("/transactions").send({
      type: faker.helpers.arrayElement(transactionType),
      amount: faker.number.float({ min: 1, max: 1000 }),
      title: faker.lorem.words({ min: 4, max: 6 })
    });

    const cookies = createTransactionResponse.get("Set-Cookie");

    const listTransactionsResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies);
    const id = listTransactionsResponse.body.transactions[0].id;

    const transactionById = await request(app.server)
      .get(`/transactions/${id}`)
      .set("Cookie", cookies);

    expect(transactionById.body).toHaveProperty("id", id);
  });

  it("should get a transaction summary", async () => {
    const firstTransaction = {
      type: faker.helpers.arrayElement(transactionType),
      amount: faker.number.float({ min: 1, max: 1000 }),
      title: faker.lorem.words({ min: 4, max: 6 })
    };

    const secondTransaction = {
      type: faker.helpers.arrayElement(transactionType),
      amount: faker.number.float({ min: 1, max: 1000 }),
      title: faker.lorem.words({ min: 4, max: 6 })
    };

    const firstTransactionResponse = await request(app.server).post("/transactions")
      .send(firstTransaction);

    const cookies = firstTransactionResponse.get("Set-Cookie");

    await request(app.server).post("/transactions")
      .send(secondTransaction).set("Cookie", cookies);

    const getSummaryTransactions = await request(app.server)
      .get("/transactions/summary")
      .set("Cookie", cookies);

    expect(getSummaryTransactions.body.summary).toHaveProperty("amount");
  });
});
