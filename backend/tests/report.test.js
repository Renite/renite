import "dotenv/config";
import { jest } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";

import app from "../app.js";
import User from "../models/User.js";
import Report from "../models/Report.js";
import Category from "../models/Category.js";
import Material from "../models/Material.js";

describe("Report Management API", () => {
  let accessToken;
  let userId;
  let categoryId;
  let materialId;
  let reportId;

  const timestamp = Date.now();

  const testUser = {
    full_name: `Report Test ${timestamp}`,
    email: `report.test.${timestamp}@example.com`,
    phone: `09${timestamp.toString().slice(-8)}`,
    password: "ReniteTest123!",
  };

  beforeAll(async () => {
    jest.setTimeout(30000);

    if (!process.env.TEST_MONGODB_URL) {
      throw new Error("TEST_MONGODB_URL is not configured");
    }

    // Make sure we are connected to the test database.
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.TEST_MONGODB_URL);
    }

    console.log(`✅ Test DB connected: ${mongoose.connection.name}`);

    // Clean up anything from a previous run.
    await User.deleteMany({ email: testUser.email });

    // Create a category required by Report.
    const category = await Category.create({
      name: `Report Test Category ${timestamp}`,
      description: "Category used by report tests",
      status: "ACTIVE",
    });

    categoryId = category._id;

    // Create a material belonging to the category.
    const material = await Material.create({
      category_id: categoryId,
      name: `Report Test Material ${timestamp}`,
      description: "Material used by report tests",
      status: "ACTIVE",
    });

    materialId = material._id;

    console.log("✅ Test category:", categoryId.toString());
    console.log("✅ Test material:", materialId.toString());
  }, 30000);

  afterAll(async () => {
    if (userId) {
      await Report.deleteMany({ user_id: userId });
      await User.deleteOne({ _id: userId });
    }

    if (materialId) {
      await Material.deleteOne({ _id: materialId });
    }

    if (categoryId) {
      await Category.deleteOne({ _id: categoryId });
    }

    await mongoose.connection.close();
  }, 30000);

  describe("Authentication", () => {
    test("rejects unauthenticated report creation", async () => {
      const response = await request(app).post("/api/v1/reports").send({
        category_id: categoryId,
        material_id: materialId,
        type: "LOST",
        title: "Unauthenticated report",
        incident_date: new Date().toISOString(),
      });

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe("Report creation", () => {
    test("creates a LOST report for an authenticated user", async () => {
      const registerResponse = await request(app)
        .post("/api/v1/auth/register")
        .send(testUser);

      expect(registerResponse.statusCode).toBe(201);
      expect(registerResponse.body.success).toBe(true);

      accessToken = registerResponse.body.data.accessToken;
      userId = registerResponse.body.data.user.id;

      expect(accessToken).toBeDefined();
      expect(userId).toBeDefined();

      const response = await request(app)
        .post("/api/v1/reports")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          category_id: categoryId.toString(),
          material_id: materialId.toString(),
          type: "LOST",
          title: "Lost phone",
          description: "I lost my phone around Bole.",
          location: {
            latitude: 9.0054,
            longitude: 38.7636,
            place_name: "Bole",
            address: "Bole Road, Addis Ababa",
          },
          incident_date: new Date().toISOString(),
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.user_id.toString()).toBe(userId);
      expect(response.body.data.category_id.toString()).toBe(
        categoryId.toString(),
      );
      expect(response.body.data.material_id.toString()).toBe(
        materialId.toString(),
      );

      expect(response.body.data.type).toBe("LOST");
      expect(response.body.data.title).toBe("Lost phone");
      expect(response.body.data.status).toBe("ACTIVE");
      expect(response.body.data.token).toBeDefined();

      reportId = response.body.data._id;

      expect(reportId).toBeDefined();
    });

    test("creates a FOUND report", async () => {
      const response = await request(app)
        .post("/api/v1/reports")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          category_id: categoryId.toString(),
          material_id: materialId.toString(),
          type: "FOUND",
          title: "Found wallet",
          description: "Found a wallet near the road.",
          location: {
            place_name: "Addis Ababa",
            address: "Addis Ababa",
          },
          incident_date: new Date().toISOString(),
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);

      expect(response.body.data.type).toBe("FOUND");
      expect(response.body.data.title).toBe("Found wallet");
      expect(response.body.data.status).toBe("ACTIVE");
      expect(response.body.data.token).toBeDefined();
    });

    test("rejects missing required fields", async () => {
      const response = await request(app)
        .post("/api/v1/reports")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          title: "Incomplete report",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("VALIDATION_ERROR");
    });

    test("rejects invalid report type", async () => {
      const response = await request(app)
        .post("/api/v1/reports")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          category_id: categoryId.toString(),
          material_id: materialId.toString(),
          type: "INVALID",
          title: "Invalid type report",
          incident_date: new Date().toISOString(),
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("VALIDATION_ERROR");
    });

    test("rejects a non-existing category", async () => {
      const fakeCategoryId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .post("/api/v1/reports")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          category_id: fakeCategoryId.toString(),
          material_id: materialId.toString(),
          type: "LOST",
          title: "Missing category",
          incident_date: new Date().toISOString(),
        });

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("CATEGORY_NOT_FOUND");
    });

    test("rejects a non-existing material", async () => {
      const fakeMaterialId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .post("/api/v1/reports")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          category_id: categoryId.toString(),
          material_id: fakeMaterialId.toString(),
          type: "LOST",
          title: "Missing material",
          incident_date: new Date().toISOString(),
        });

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("MATERIAL_NOT_FOUND");
    });
  });

  describe("Public report listing", () => {
    test("lists active reports publicly", async () => {
      const response = await request(app).get("/api/v1/reports");

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.reports).toBeDefined();
      expect(Array.isArray(response.body.data.reports)).toBe(true);

      expect(response.body.data.page).toBe(1);
      expect(response.body.data.limit).toBe(20);
    });

    test("filters reports by type", async () => {
      const response = await request(app)
        .get("/api/v1/reports")
        .query({ type: "LOST" });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);

      for (const report of response.body.data.reports) {
        expect(report.type).toBe("LOST");
      }
    });

    test("filters reports by status", async () => {
      const response = await request(app)
        .get("/api/v1/reports")
        .query({ status: "ACTIVE" });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);

      for (const report of response.body.data.reports) {
        expect(report.status).toBe("ACTIVE");
      }
    });

    test("rejects an invalid type filter", async () => {
      const response = await request(app)
        .get("/api/v1/reports")
        .query({ type: "INVALID" });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("VALIDATION_ERROR");
    });

    test("rejects an invalid status filter", async () => {
      const response = await request(app)
        .get("/api/v1/reports")
        .query({ status: "INVALID" });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("Report retrieval", () => {
    test("gets a report publicly by ID", async () => {
      const response = await request(app).get(`/api/v1/reports/${reportId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);

      expect(response.body.data._id).toBe(reportId);
      expect(response.body.data.title).toBe("Lost phone");
      expect(response.body.data.type).toBe("LOST");
    });

    test("returns 404 for a non-existing report", async () => {
      const fakeReportId = new mongoose.Types.ObjectId();

      const response = await request(app).get(
        `/api/v1/reports/${fakeReportId}`,
      );

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("REPORT_NOT_FOUND");
    });
  });

  describe("Report update", () => {
    test("updates the report as the owner", async () => {
      const response = await request(app)
        .patch(`/api/v1/reports/${reportId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          title: "Lost phone - updated",
          description: "Updated description",
          location: {
            place_name: "Piassa",
            address: "Piassa, Addis Ababa",
          },
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);

      expect(response.body.data.title).toBe("Lost phone - updated");
      expect(response.body.data.description).toBe("Updated description");
      expect(response.body.data.location.place_name).toBe("Piassa");
    });

    test("rejects update from another user", async () => {
      const anotherUser = {
        full_name: `Another Report User ${Date.now()}`,
        email: `another.report.${Date.now()}@example.com`,
        phone: `09${Date.now().toString().slice(-8)}`,
        password: "ReniteTest123!",
      };

      const registerResponse = await request(app)
        .post("/api/v1/auth/register")
        .send(anotherUser);

      expect(registerResponse.statusCode).toBe(201);

      const anotherToken = registerResponse.body.data.accessToken;

      const response = await request(app)
        .patch(`/api/v1/reports/${reportId}`)
        .set("Authorization", `Bearer ${anotherToken}`)
        .send({
          title: "Someone else's report",
        });

      expect(response.statusCode).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("FORBIDDEN");

      // Clean up the second test user.
      await User.deleteOne({
        email: anotherUser.email,
      });
    });
  });

  describe("Report status", () => {
    test("owner can change report status", async () => {
      const response = await request(app)
        .patch(`/api/v1/reports/${reportId}/status`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          status: "MATCHED",
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe("MATCHED");
    });

    test("rejects an invalid status", async () => {
      const response = await request(app)
        .patch(`/api/v1/reports/${reportId}/status`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          status: "INVALID",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("Report deletion", () => {
    test("owner can soft-delete the report", async () => {
      const response = await request(app)
        .delete(`/api/v1/reports/${reportId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.deleted).toBe(true);
    });

    test("deleted report cannot be retrieved", async () => {
      const response = await request(app).get(`/api/v1/reports/${reportId}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("REPORT_NOT_FOUND");
    });
  });
});
