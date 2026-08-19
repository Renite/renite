import "dotenv/config";
import request from "supertest";
import mongoose from "mongoose";

import app from "../app.js";
import User from "../models/User.js";
import Profile from "../models/Profile.js";

describe("Profile Management API", () => {
  let accessToken;
  let userId;

  const testUser = {
    full_name: `Profile Test ${Date.now()}`,
    email: `profile.test.${Date.now()}@example.com`,
    phone: `09${Date.now().toString().slice(-8)}`,
    password: "ReniteTest123!",
  };

  beforeAll(async () => {
    // The test environment should provide TEST_MONGODB_URL.
    if (!process.env.TEST_MONGODB_URL) {
      throw new Error("TEST_MONGODB_URL is not configured");
    }

    await mongoose.connect(process.env.TEST_MONGODB_URL);

    await User.deleteMany({ email: testUser.email });
  });

  afterAll(async () => {
    if (userId) {
      await Profile.deleteMany({ user_id: userId });
      await User.deleteMany({ _id: userId });
    }
    await mongoose.connection.close();
  });

  describe("Authentication", () => {
    test("rejects unauthenticated profile requests", async () => {
      const response = await request(app).get("/api/v1/profile/me");

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  // Runs once — the profile it creates is intentionally left in place
  // for the retrieval/update/deletion tests below, which depend on it.
  describe("Profile creation", () => {
    test("creates a profile for an authenticated user", async () => {
      const registerResponse = await request(app)
        .post("/api/v1/auth/register")
        .send(testUser);

      expect(registerResponse.statusCode).toBe(201);
      expect(registerResponse.body.success).toBe(true);

      accessToken = registerResponse.body.data.accessToken;
      userId = registerResponse.body.data.user.id;

      const response = await request(app)
        .post("/api/v1/profile")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          first_name: "Lucky",
          last_name: "Test",
          display_name: "Lucky",
          language: "en",
          location: "Addis Ababa",
          bio: "Testing profile management",
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.first_name).toBe("Lucky");
      expect(response.body.data.last_name).toBe("Test");
    });

    test("rejects duplicate profile creation", async () => {
      // A profile already exists from the previous test — this alone
      // should be enough to trigger the conflict.
      const response = await request(app)
        .post("/api/v1/profile")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ first_name: "Another", last_name: "Profile" });

      expect(response.statusCode).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("PROFILE_EXISTS");
    });
  });

  describe("Profile retrieval", () => {
    test("gets the authenticated user profile", async () => {
      const response = await request(app)
        .get("/api/v1/profile/me")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.display_name).toBe("Lucky");
    });
  });

  describe("Profile update", () => {
    test("updates the authenticated user profile", async () => {
      const response = await request(app)
        .patch("/api/v1/profile/me")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ display_name: "Lucky Renite", bio: "Updated profile" });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.display_name).toBe("Lucky Renite");
      expect(response.body.data.bio).toBe("Updated profile");
    });

    test("rejects an empty first name", async () => {
      const response = await request(app)
        .patch("/api/v1/profile/me")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ first_name: "" });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("VALIDATION_ERROR");
    });

    test("rejects a bio longer than 500 characters", async () => {
      const response = await request(app)
        .patch("/api/v1/profile/me")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ bio: "a".repeat(501) });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  // Deletion tests run last and deliberately depend on all prior state.
  describe("Profile deletion", () => {
    test("soft-deletes the authenticated user profile", async () => {
      const response = await request(app)
        .delete("/api/v1/profile/me")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.deleted).toBe(true);
    });

    test("cannot retrieve a deleted profile", async () => {
      const response = await request(app)
        .get("/api/v1/profile/me")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("PROFILE_NOT_FOUND");
    });
  });
});
