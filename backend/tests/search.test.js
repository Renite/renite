import "dotenv/config";
import { jest } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";

import app from "../app.js";
import User from "../models/User.js";
import Report from "../models/Report.js";
import Category from "../models/Category.js";
import Material from "../models/Material.js";

describe("Report Search API", () => {
  let accessToken;
  let userId;
  let category;
  let material;

  let reportLost;
  let reportFound;
  let reportOutside;
  let reportInactive;

  const unique = Date.now();

  const testUser = {
    full_name: `Search Test ${unique}`,
    email: `search.test.${unique}@example.com`,
    phone: `09${unique.toString().slice(-8)}`,
    password: "ReniteTest123!",
  };

  beforeAll(async () => {
    if (!process.env.TEST_MONGODB_URL) {
      throw new Error("TEST_MONGODB_URL is not configured");
    }

    await mongoose.connect(process.env.TEST_MONGODB_URL);

    console.log(`✅ Test DB connected: ${mongoose.connection.name}`);

    // Clean previous test data if necessary
    await User.deleteMany({ email: testUser.email });

    // Register test user
    const registerResponse = await request(app)
      .post("/api/v1/auth/register")
      .send(testUser);

    if (registerResponse.statusCode !== 201) {
      throw new Error(
        `Test user registration failed: ${JSON.stringify(
          registerResponse.body,
        )}`,
      );
    }

    accessToken = registerResponse.body.data.accessToken;
    userId = registerResponse.body.data.user.id;

    // Create category directly
    category = await Category.create({
      name: `Search Category ${unique}`,
      description: "Category for search tests",
      status: "ACTIVE",
    });

    // Create material directly
    material = await Material.create({
      category_id: category._id,
      name: `Search Material ${unique}`,
      description: "Material for search tests",
      status: "ACTIVE",
    });

    // ---------------------------------------------------------
    // Report 1 — LOST / ACTIVE
    // Keyword: laptop
    // Location: Addis Ababa
    // ---------------------------------------------------------
    reportLost = await Report.create({
      user_id: userId,
      category_id: category._id,
      material_id: material._id,
      type: "LOST",
      title: "Lost Laptop",
      description: "I lost my black laptop near Bole",
      status: "ACTIVE",
      location: {
        latitude: 9.0054,
        longitude: 38.7636,
        place_name: "Bole",
        address: "Bole Road, Addis Ababa",
      },
      incident_date: new Date("2026-08-10T10:00:00Z"),
      token: `search-${unique}-lost`,
    });

    // ---------------------------------------------------------
    // Report 2 — FOUND / ACTIVE
    // Keyword: phone
    // Location: Addis Ababa
    // ---------------------------------------------------------
    reportFound = await Report.create({
      user_id: userId,
      category_id: category._id,
      material_id: material._id,
      type: "FOUND",
      title: "Found Phone",
      description: "Found a smartphone near Meskel Square",
      status: "ACTIVE",
      location: {
        latitude: 9.01,
        longitude: 38.761,
        place_name: "Meskel Square",
        address: "Meskel Square, Addis Ababa",
      },
      incident_date: new Date("2026-08-15T10:00:00Z"),
      token: `search-${unique}-found`,
    });

    // ---------------------------------------------------------
    // Report 3 — LOST / ACTIVE / FAR AWAY
    // Keyword: wallet
    // Location: far from Addis search point
    // ---------------------------------------------------------
    reportOutside = await Report.create({
      user_id: userId,
      category_id: category._id,
      material_id: material._id,
      type: "LOST",
      title: "Lost Wallet",
      description: "Brown wallet lost while travelling",
      status: "ACTIVE",
      location: {
        latitude: 8.98,
        longitude: 38.7,
        place_name: "Outside Search Area",
        address: "Outside search radius",
      },
      incident_date: new Date("2026-08-05T10:00:00Z"),
      token: `search-${unique}-outside`,
    });

    // ---------------------------------------------------------
    // Report 4 — LOST / CLOSED
    // Used to verify default ACTIVE filtering
    // ---------------------------------------------------------
    reportInactive = await Report.create({
      user_id: userId,
      category_id: category._id,
      material_id: material._id,
      type: "LOST",
      title: "Closed Camera",
      description: "Old camera report",
      status: "CLOSED",
      location: {
        latitude: 9.0054,
        longitude: 38.7636,
        place_name: "Bole",
        address: "Bole Road, Addis Ababa",
      },
      incident_date: new Date("2026-08-01T10:00:00Z"),
      token: `search-${unique}-closed`,
    });

    console.log("✅ Search test fixtures created");
  }, 30000);

  afterAll(async () => {
    if (userId) {
      await Report.deleteMany({ user_id: userId });
      await User.deleteMany({ _id: userId });
    }

    if (material?._id) {
      await Material.deleteOne({ _id: material._id });
    }

    if (category?._id) {
      await Category.deleteOne({ _id: category._id });
    }

    await mongoose.connection.close();
  }, 30000);

  // ============================================================
  // Authentication
  // ============================================================

  describe("Authentication", () => {
    test("allows public report search without authentication", async () => {
      const response = await request(app).get("/api/v1/search/reports");

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  // ============================================================
  // Keyword search
  // ============================================================

  describe("Keyword search", () => {
    test("matches keyword in title", async () => {
      const response = await request(app)
        .get("/api/v1/search/reports")
        .query({ q: "laptop" });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);

      const reports = response.body.data.reports || response.body.data;

      expect(reports.length).toBeGreaterThan(0);

      expect(
        reports.some((report) => report._id === reportLost._id.toString()),
      ).toBe(true);
    });

    test("matches keyword in description", async () => {
      const response = await request(app)
        .get("/api/v1/search/reports")
        .query({ q: "smartphone" });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);

      const reports = response.body.data.reports || response.body.data;

      expect(
        reports.some((report) => report._id === reportFound._id.toString()),
      ).toBe(true);
    });

    test("keyword search is case-insensitive", async () => {
      const response = await request(app)
        .get("/api/v1/search/reports")
        .query({ q: "LAPTOP" });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);

      const reports = response.body.data.reports || response.body.data;

      expect(
        reports.some((report) => report._id === reportLost._id.toString()),
      ).toBe(true);
    });
  });

  // ============================================================
  // Type filtering
  // ============================================================

  describe("Type filtering", () => {
    test("filters LOST reports", async () => {
      const response = await request(app)
        .get("/api/v1/search/reports")
        .query({ type: "LOST" });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);

      const reports = response.body.data.reports || response.body.data;

      expect(reports.length).toBeGreaterThan(0);

      for (const report of reports) {
        expect(report.type).toBe("LOST");
      }
    });

    test("filters FOUND reports", async () => {
      const response = await request(app)
        .get("/api/v1/search/reports")
        .query({ type: "FOUND" });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);

      const reports = response.body.data.reports || response.body.data;

      expect(reports.length).toBeGreaterThan(0);

      for (const report of reports) {
        expect(report.type).toBe("FOUND");
      }
    });
  });

  // ============================================================
  // Status filtering
  // ============================================================

  describe("Status filtering", () => {
    test("defaults to ACTIVE reports", async () => {
      const response = await request(app).get("/api/v1/search/reports");

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);

      const reports = response.body.data.reports || response.body.data;

      for (const report of reports) {
        expect(report.status).toBe("ACTIVE");
      }

      expect(
        reports.some((report) => report._id === reportInactive._id.toString()),
      ).toBe(false);
    });

    test("filters reports by status", async () => {
      const response = await request(app)
        .get("/api/v1/search/reports")
        .query({ status: "CLOSED" });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);

      const reports = response.body.data.reports || response.body.data;

      expect(
        reports.some((report) => report._id === reportInactive._id.toString()),
      ).toBe(true);

      for (const report of reports) {
        expect(report.status).toBe("CLOSED");
      }
    });
  });

  // ============================================================
  // Category filtering
  // ============================================================

  describe("Category filtering", () => {
    test("filters reports by category_id", async () => {
      const response = await request(app).get("/api/v1/search/reports").query({
        category_id: category._id.toString(),
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);

      const reports = response.body.data.reports || response.body.data;

      expect(reports.length).toBeGreaterThan(0);

      for (const report of reports) {
        expect(report.category_id.toString()).toBe(category._id.toString());
      }
    });
  });

  // ============================================================
  // Material filtering
  // ============================================================

  describe("Material filtering", () => {
    test("filters reports by material_id", async () => {
      const response = await request(app).get("/api/v1/search/reports").query({
        material_id: material._id.toString(),
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);

      const reports = response.body.data.reports || response.body.data;

      expect(reports.length).toBeGreaterThan(0);

      for (const report of reports) {
        expect(report.material_id.toString()).toBe(material._id.toString());
      }
    });
  });

  // ============================================================
  // Date range
  // ============================================================

  describe("Date range filtering", () => {
    test("filters reports using from and to dates", async () => {
      const response = await request(app).get("/api/v1/search/reports").query({
        from: "2026-08-09",
        to: "2026-08-11",
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);

      const reports = response.body.data.reports || response.body.data;

      expect(
        reports.some((report) => report._id === reportLost._id.toString()),
      ).toBe(true);

      expect(
        reports.some((report) => report._id === reportFound._id.toString()),
      ).toBe(false);
    });
  });

  // ============================================================
  // Location / radius search
  // ============================================================

  describe("Location search", () => {
    test("returns reports within the requested radius", async () => {
      const response = await request(app).get("/api/v1/search/reports").query({
        lat: 9.0054,
        lng: 38.7636,
        radius_km: 2,
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);

      const reports = response.body.data.reports || response.body.data;

      expect(
        reports.some((report) => report._id === reportLost._id.toString()),
      ).toBe(true);

      expect(
        reports.some((report) => report._id === reportOutside._id.toString()),
      ).toBe(false);
    });
  });

  // ============================================================
  // Invalid filters
  // ============================================================

  describe("Validation", () => {
    test("rejects an invalid type", async () => {
      const response = await request(app).get("/api/v1/search/reports").query({
        type: "INVALID",
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("VALIDATION_ERROR");
    });

    test("rejects an invalid status", async () => {
      const response = await request(app).get("/api/v1/search/reports").query({
        status: "INVALID",
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  // ============================================================
  // Empty results
  // ============================================================

  describe("Empty results", () => {
    test("returns 200 with an empty array when nothing matches", async () => {
      const response = await request(app).get("/api/v1/search/reports").query({
        q: "this-report-definitely-does-not-exist",
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);

      const reports = response.body.data.reports || response.body.data;

      expect(Array.isArray(reports)).toBe(true);
      expect(reports).toHaveLength(0);
    });
  });
});
