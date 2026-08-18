import request from "supertest";
import app from "../app.js";

describe("GET /api/health", () => {
  it("returns 200 with ok status", async () => {
    const res = await request(app).get("/api/health");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.message).toBe(
      "Renite API & Database Models are operational",
    );
    expect(res.body.timestamp).toBeDefined();
  });
});
