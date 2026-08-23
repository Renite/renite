import "dotenv/config";
import { jest } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";

import app from "../app.js";
import User from "../models/User.js";
import Report from "../models/Report.js";
import Match from "../models/Match.js";
import Category from "../models/Category.js";
import Material from "../models/Material.js";

jest.setTimeout(30000);

describe("Match Engine API", () => {
  let reporterToken;
  let reporterId;

  let finderToken;
  let finderId;

  let outsiderToken;
  let outsiderId;

  let categoryId;
  let materialId;

  let lostReportId;
  let foundReportId;
  let matchId;

  const timestamp = Date.now();

  const sharedLocation = {
    latitude: 9.0054,
    longitude: 38.7636,
    place_name: "Bole",
    address: "Bole Road, Addis Ababa",
  };

  const sharedDate = new Date().toISOString();

  const reporter = {
    full_name: `Match Reporter ${timestamp}`,
    email: `match.reporter.${timestamp}@example.com`,
    phone: `09${timestamp.toString().slice(-8)}`,
    password: "ReniteTest123!",
  };

  const finder = {
    full_name: `Match Finder ${timestamp}`,
    email: `match.finder.${timestamp}@example.com`,
    phone: `08${timestamp.toString().slice(-8)}`,
    password: "ReniteTest123!",
  };

  const outsider = {
    full_name: `Match Outsider ${timestamp}`,
    email: `match.outsider.${timestamp}@example.com`,
    phone: `07${timestamp.toString().slice(-8)}`,
    password: "ReniteTest123!",
  };

  beforeAll(async () => {
    if (!process.env.TEST_MONGODB_URL) {
      throw new Error("TEST_MONGODB_URL is not configured");
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.TEST_MONGODB_URL);
    }

    await User.deleteMany({
      email: {
        $in: [reporter.email, finder.email, outsider.email],
      },
    });

    const category = await Category.create({
      name: `Match Test Category ${timestamp}`,
      description: "Category used by match tests",
      status: "ACTIVE",
    });

    categoryId = category._id;

    const material = await Material.create({
      category_id: categoryId,
      name: `Match Test Material ${timestamp}`,
      description: "Material used by match tests",
      status: "ACTIVE",
    });

    materialId = material._id;

    // Register reporter.
    const reporterResponse = await request(app)
      .post("/api/v1/auth/register")
      .send(reporter);

    expect(reporterResponse.statusCode).toBe(201);

    reporterToken = reporterResponse.body.data.accessToken;
    reporterId = reporterResponse.body.data.user.id;

    // Register finder.
    const finderResponse = await request(app)
      .post("/api/v1/auth/register")
      .send(finder);

    expect(finderResponse.statusCode).toBe(201);

    finderToken = finderResponse.body.data.accessToken;
    finderId = finderResponse.body.data.user.id;

    // Register outsider.
    const outsiderResponse = await request(app)
      .post("/api/v1/auth/register")
      .send(outsider);

    expect(outsiderResponse.statusCode).toBe(201);

    outsiderToken = outsiderResponse.body.data.accessToken;
    outsiderId = outsiderResponse.body.data.user.id;
  });

  afterAll(async () => {
    // Delete matches first because they reference the reports.
    await Match.deleteMany({
      $or: [
        ...(lostReportId ? [{ lost_report_id: lostReportId }] : []),
        ...(foundReportId ? [{ found_report_id: foundReportId }] : []),
      ],
    });

    if (lostReportId || foundReportId) {
      await Report.deleteMany({
        _id: {
          $in: [lostReportId, foundReportId].filter(Boolean),
        },
      });
    }

    await User.deleteMany({
      _id: {
        $in: [reporterId, finderId, outsiderId].filter(Boolean),
      },
    });

    if (materialId) {
      await Material.deleteOne({ _id: materialId });
    }

    if (categoryId) {
      await Category.deleteOne({ _id: categoryId });
    }

    await mongoose.connection.close();
  });

  // ---------------------------------------------------------
  // Authentication
  // ---------------------------------------------------------

  describe("Authentication", () => {
    test("rejects unauthenticated match generation", async () => {
      const response = await request(app).post(
        `/api/v1/matches/generate/${new mongoose.Types.ObjectId()}`,
      );

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test("rejects unauthenticated match listing", async () => {
      const response = await request(app).get(
        `/api/v1/matches/report/${new mongoose.Types.ObjectId()}`,
      );

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test("rejects unauthenticated single match retrieval", async () => {
      const response = await request(app).get(
        `/api/v1/matches/${new mongoose.Types.ObjectId()}`,
      );

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test("rejects unauthenticated match status update", async () => {
      const response = await request(app)
        .patch(`/api/v1/matches/${new mongoose.Types.ObjectId()}/status`)
        .send({ status: "ACCEPTED" });

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  // ---------------------------------------------------------
  // Fixture Reports
  // ---------------------------------------------------------

  describe("Fixture reports", () => {
    test("creates a LOST report", async () => {
      const response = await request(app)
        .post("/api/v1/reports")
        .set("Authorization", `Bearer ${reporterToken}`)
        .send({
          category_id: categoryId.toString(),
          material_id: materialId.toString(),
          type: "LOST",
          title: "Lost black backpack",
          description: "Black backpack lost near Bole",
          location: sharedLocation,
          incident_date: sharedDate,
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);

      lostReportId = response.body.data._id;

      expect(lostReportId).toBeDefined();
      expect(response.body.data.type).toBe("LOST");
      expect(response.body.data.status).toBe("ACTIVE");
    });

    test("creates a matching FOUND report", async () => {
      const response = await request(app)
        .post("/api/v1/reports")
        .set("Authorization", `Bearer ${finderToken}`)
        .send({
          category_id: categoryId.toString(),
          material_id: materialId.toString(),
          type: "FOUND",
          title: "Found black backpack",
          description: "Black backpack found near Bole",
          location: sharedLocation,
          incident_date: sharedDate,
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);

      foundReportId = response.body.data._id;

      expect(foundReportId).toBeDefined();
      expect(response.body.data.type).toBe("FOUND");
      expect(response.body.data.status).toBe("ACTIVE");
    });
  });

  // ---------------------------------------------------------
  // Match Generation
  // ---------------------------------------------------------

  describe("Match generation", () => {
    test("manual generation succeeds", async () => {
      const response = await request(app)
        .post(`/api/v1/matches/generate/${lostReportId}`)
        .set("Authorization", `Bearer ${reporterToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);

      expect(response.body.data.generated).toBeGreaterThanOrEqual(0);
    });

    test("manual generation is idempotent", async () => {
      const response = await request(app)
        .post(`/api/v1/matches/generate/${lostReportId}`)
        .set("Authorization", `Bearer ${reporterToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);

      expect(response.body.data.generated).toBeGreaterThanOrEqual(0);
    });

    test("a match exists between the LOST and FOUND reports", async () => {
      const response = await request(app)
        .get(`/api/v1/matches/report/${lostReportId}`)
        .set("Authorization", `Bearer ${reporterToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);

      expect(response.body.data.length).toBeGreaterThanOrEqual(1);

      const match = response.body.data.find(
        (item) =>
          item.lost_report_id?._id?.toString() === lostReportId.toString() ||
          item.lost_report_id?.toString() === lostReportId.toString(),
      );

      expect(match).toBeDefined();

      expect(match.score).toBeGreaterThanOrEqual(40);
      expect(match.status).toBe("PENDING");
      expect(match.source).toBe("RULE_BASED");

      matchId = match._id;

      expect(matchId).toBeDefined();
    });

    test("gets matches for the FOUND report", async () => {
      const response = await request(app)
        .get(`/api/v1/matches/report/${foundReportId}`)
        .set("Authorization", `Bearer ${finderToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    });

    test("gets a single match by ID", async () => {
      const response = await request(app)
        .get(`/api/v1/matches/${matchId}`)
        .set("Authorization", `Bearer ${reporterToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);

      expect(response.body.data._id).toBeDefined();
      expect(response.body.data.status).toBe("PENDING");

      expect(
        response.body.data.lost_report_id?._id?.toString() ||
          response.body.data.lost_report_id?.toString(),
      ).toBe(lostReportId.toString());

      expect(
        response.body.data.found_report_id?._id?.toString() ||
          response.body.data.found_report_id?.toString(),
      ).toBe(foundReportId.toString());
    });

    test("returns 404 for a non-existing match", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/v1/matches/${fakeId}`)
        .set("Authorization", `Bearer ${reporterToken}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("MATCH_NOT_FOUND");
    });
  });

  // ---------------------------------------------------------
  // Match Authorization
  // ---------------------------------------------------------

  describe("Match authorization", () => {
    test("rejects status change from an unrelated user", async () => {
      const response = await request(app)
        .patch(`/api/v1/matches/${matchId}/status`)
        .set("Authorization", `Bearer ${outsiderToken}`)
        .send({
          status: "ACCEPTED",
        });

      expect(response.statusCode).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("FORBIDDEN");
    });
  });

  // ---------------------------------------------------------
  // Match Status
  // ---------------------------------------------------------

  describe("Match status updates", () => {
    test("rejects an invalid status value", async () => {
      const response = await request(app)
        .patch(`/api/v1/matches/${matchId}/status`)
        .set("Authorization", `Bearer ${reporterToken}`)
        .send({
          status: "MAYBE",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("VALIDATION_ERROR");
    });

    test("the lost report owner can accept the match", async () => {
      const response = await request(app)
        .patch(`/api/v1/matches/${matchId}/status`)
        .set("Authorization", `Bearer ${reporterToken}`)
        .send({
          status: "ACCEPTED",
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe("ACCEPTED");
    });

    test("accepting the match marks both reports as MATCHED", async () => {
      const lostResponse = await request(app).get(
        `/api/v1/reports/${lostReportId}`,
      );

      const foundResponse = await request(app).get(
        `/api/v1/reports/${foundReportId}`,
      );

      expect(lostResponse.statusCode).toBe(200);
      expect(foundResponse.statusCode).toBe(200);

      expect(lostResponse.body.data.status).toBe("MATCHED");
      expect(foundResponse.body.data.status).toBe("MATCHED");
    });

    test("match remains ACCEPTED after retrieval", async () => {
      const response = await request(app)
        .get(`/api/v1/matches/${matchId}`)
        .set("Authorization", `Bearer ${reporterToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe("ACCEPTED");
    });
  });
});
