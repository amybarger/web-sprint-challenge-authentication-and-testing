const supertest = require("supertest");
const server = require("../server");
const db = require("../database/dbConfig");

beforeEach(async () => {
  await db.run();
});

afterAll(async () => {
  await db.destroy();
});

describe("POST /login", async () => {
  const res = await supertest(server)
    .post("/login")
    .send({ username: "CurlyQ", password: "Omg1324" });
  expect(res.statusCode).toBe(201);
  expect(res.body.name).toBe("CurlyQ");
});

describe("POST /register", async () => {
  const res = await supertest(server)
    .post("/register")
    .send({ username: "GoGirl1234", password: "Heyhihello" });
  expect(res.statusCode).toBe(201);
  expect(res.body.name).toBe("GoGirl1234");
});
