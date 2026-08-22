import "dotenv/config";
import { jest } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";

import app from "../app.js";

import User from "../models/User.js";
import Report from "../models/Report.js";
import Match from "../models/Match.js";
import Verification from "../models/Verification.js";
import Category from "../models/Category.js";
import Material from "../models/Material.js";

describe("Verification API", () => {
  let userToken;
  let userId;

  let secondUserToken;
  let secondUserId;

  let policeToken;
  let policeId;

  let adminToken;
  let adminId;

  let outsiderToken;
  let outsiderId;

  let categoryId;
  let materialId;

  let lostReportId;
  let foundReportId;
  let matchId;

  let verificationId;

  const timestamp = Date.now();

  const user = {
    full_name: `Verification User ${timestamp}`,
    email: `verification.user.${timestamp}@example.com`,
    phone: `09${timestamp.toString().slice(-8)}`,
    password: "ReniteTest123!",
  };

  const secondUser = {
    full_name: `Verification Second User ${timestamp}`,
    email: `verification.second.${timestamp}@example.com`,
    phone: `08${timestamp.toString().slice(-8)}`,
    password: "ReniteTest123!",
  };

  const police = {
    full_name: `Verification Police ${timestamp}`,
    email: `verification.police.${timestamp}@example.com`,
    phone: `07${timestamp.toString().slice(-8)}`,
    password: "ReniteTest123!",
  };

  const admin = {
    full_name: `Verification Admin ${timestamp}`,
    email: `verification.admin.${timestamp}@example.com`,
    phone: `06${timestamp.toString().slice(-8)}`,
    password: "ReniteTest123!",
  };

  const outsider = {
    full_name: `Verification Outsider ${timestamp}`,
    email: `verification.outsider.${timestamp}@example.com`,
    phone: `05${timestamp.toString().slice(-8)}`,
    password: "ReniteTest123!",
  };

  const location = {
    latitude: 9.0054,
    longitude: 38.7636,
    place_name: "Bole",
    address: "Bole Road, Addis Ababa",
  };

  const incidentDate = new Date().toISOString();

  async function registerAndGetToken(payload) {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(payload);

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.user).toBeDefined();

    return {
      token: response.body.data.accessToken,
      id: response.body.data.user.id,
    };
  }

  // FIX: login expects `identifier` (email or phone), not `email`.
  async function loginAndGetToken(payload) {
    const response = await request(app).post("/api/v1/auth/login").send({
      identifier: payload.email,
      password: payload.password,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.accessToken).toBeDefined();

    return response.body.data.accessToken;
  }

  beforeAll(async () => {
    jest.setTimeout(30000);

    if (!process.env.TEST_MONGODB_URL) {
      throw new Error("TEST_MONGODB_URL is not configured");
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.TEST_MONGODB_URL);
    }

    await Verification.deleteMany({});
    await Match.deleteMany({});

    await User.deleteMany({
      email: {
        $in: [
          user.email,
          secondUser.email,
          police.email,
          admin.email,
          outsider.email,
        ],
      },
    });

    const category = await Category.create({
      name: `Verification Category ${timestamp}`,
      description: "Category used by verification tests",
      status: "ACTIVE",
    });
    categoryId = category._id;

    const material = await Material.create({
      category_id: categoryId,
      name: `Verification Material ${timestamp}`,
      description: "Material used by verification tests",
      status: "ACTIVE",
    });
    materialId = material._id;

    const registeredUser = await registerAndGetToken(user);
    userId = registeredUser.id;
    userToken = registeredUser.token;

    const registeredSecondUser = await registerAndGetToken(secondUser);
    secondUserId = registeredSecondUser.id;
    secondUserToken = registeredSecondUser.token;

    const registeredPolice = await registerAndGetToken(police);
    policeId = registeredPolice.id;
    await User.findByIdAndUpdate(policeId, { role: "police" });
    policeToken = await loginAndGetToken(police);

    const registeredAdmin = await registerAndGetToken(admin);
    adminId = registeredAdmin.id;
    await User.findByIdAndUpdate(adminId, { role: "admin" });
    adminToken = await loginAndGetToken(admin);

    const registeredOutsider = await registerAndGetToken(outsider);
    outsiderId = registeredOutsider.id;
    outsiderToken = registeredOutsider.token;

    const lostReport = await Report.create({
      user_id: userId,
      category_id: categoryId,
      material_id: materialId,
      type: "LOST",
      title: "Verification black backpack lost",
      description: "Black backpack used as verification fixture",
      status: "ACTIVE",
      location,
      incident_date: incidentDate,
      token: `verification-lost-${timestamp}`,
    });
    lostReportId = lostReport._id;

    const foundReport = await Report.create({
      user_id: secondUserId,
      category_id: categoryId,
      material_id: materialId,
      type: "FOUND",
      title: "Verification black backpack found",
      description: "Black backpack found as verification fixture",
      status: "ACTIVE",
      location,
      incident_date: incidentDate,
      token: `verification-found-${timestamp}`,
    });
    foundReportId = foundReport._id;

    /*
     * IMPORTANT:
     * Do NOT depend on the matching engine here — verification tests
     * are testing BE-008 only, we just need a valid Match document.
     *
     * FIX: status must be ACCEPTED, not PENDING — verification.service.js
     * requires an ACCEPTED match before a verification can be created.
     */
    const match = await Match.create({
      lost_report_id: lostReportId,
      found_report_id: foundReportId,
      score: 90,
      source: "RULE_BASED",
      status: "ACCEPTED",
    });
    matchId = match._id;

    expect(matchId).toBeDefined();
  }, 30000);

  afterAll(async () => {
    if (verificationId) {
      await Verification.deleteMany({ _id: verificationId });
    }
    if (matchId) {
      await Match.deleteMany({ _id: matchId });
    }
    if (lostReportId || foundReportId) {
      await Report.deleteMany({
        _id: { $in: [lostReportId, foundReportId].filter(Boolean) },
      });
    }
    await User.deleteMany({
      _id: { $in: [userId, secondUserId, policeId, adminId, outsiderId].filter(Boolean) },
    });
    if (materialId) await Material.deleteOne({ _id: materialId });
    if (categoryId) await Category.deleteOne({ _id: categoryId });
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }, 30000);

  describe("Authentication", () => {
    test("rejects unauthenticated verification creation", async () => {
      const response = await request(app).post("/api/v1/verification").send({
        match_id: matchId.toString(),
        method: "MANUAL",
      });
      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test("rejects unauthenticated pending queue access", async () => {
      const response = await request(app).get("/api/v1/verification/pending");
      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe("Verification creation", () => {
    test("match participant can create a verification", async () => {
      const response = await request(app)
        .post("/api/v1/verification")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          match_id: matchId.toString(),
          method: "OWNERSHIP_PROOF",
          evidence_reference: "document-reference-001",
          notes: "Ownership document submitted",
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);

      const verification = response.body.data;
      expect(verification).toBeDefined();
      expect(verification._id).toBeDefined();
      expect(verification.match_id).toBeDefined();
      expect(verification.initiated_by).toBeDefined();
      expect(verification.method).toBe("OWNERSHIP_PROOF");
      expect(verification.status).toBe("PENDING");

      verificationId = verification._id;
    });

    test("rejects a second pending verification for the same match", async () => {
      const response = await request(app)
        .post("/api/v1/verification")
        .set("Authorization", `Bearer ${secondUserToken}`)
        .send({ match_id: matchId.toString(), method: "MANUAL" });

      expect(response.statusCode).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("VERIFICATION_EXISTS");
    });

    test("rejects verification creation for an unrelated user", async () => {
      const response = await request(app)
        .post("/api/v1/verification")
        .set("Authorization", `Bearer ${outsiderToken}`)
        .send({ match_id: matchId.toString(), method: "MANUAL" });

      expect(response.statusCode).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("FORBIDDEN");
    });

    test("rejects missing required fields", async () => {
      const response = await request(app)
        .post("/api/v1/verification")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ match_id: matchId.toString() });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("VALIDATION_ERROR");
    });

    test("rejects an invalid verification method", async () => {
      const response = await request(app)
        .post("/api/v1/verification")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ match_id: matchId.toString(), method: "FACE_SCAN" });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("VALIDATION_ERROR");
    });

    test("rejects verification for a non-existing match", async () => {
      const fakeMatchId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .post("/api/v1/verification")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ match_id: fakeMatchId.toString(), method: "MANUAL" });

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("MATCH_NOT_FOUND");
    });
  });

  describe("Verification retrieval", () => {
    test("participant can retrieve their verification", async () => {
      const response = await request(app)
        .get(`/api/v1/verification/${verificationId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(verificationId);
      expect(response.body.data.status).toBe("PENDING");
    });

    test("the other match participant can retrieve the verification", async () => {
      const response = await request(app)
        .get(`/api/v1/verification/${verificationId}`)
        .set("Authorization", `Bearer ${secondUserToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test("outsider cannot retrieve the verification", async () => {
      const response = await request(app)
        .get(`/api/v1/verification/${verificationId}`)
        .set("Authorization", `Bearer ${outsiderToken}`);

      expect(response.statusCode).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("FORBIDDEN");
    });

    test("police can retrieve the verification", async () => {
      const response = await request(app)
        .get(`/api/v1/verification/${verificationId}`)
        .set("Authorization", `Bearer ${policeToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test("admin can retrieve the verification", async () => {
      const response = await request(app)
        .get(`/api/v1/verification/${verificationId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test("returns 404 for a non-existing verification", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/v1/verification/${fakeId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("VERIFICATION_NOT_FOUND");
    });
  });

  describe("Match verification listing", () => {
    test("match participant can list verifications", async () => {
      const response = await request(app)
        .get(`/api/v1/verification/match/${matchId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    });

    test("outsider cannot list verifications for a match", async () => {
      const response = await request(app)
        .get(`/api/v1/verification/match/${matchId}`)
        .set("Authorization", `Bearer ${outsiderToken}`);

      expect(response.statusCode).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("FORBIDDEN");
    });

    test("police can list verifications for a match", async () => {
      const response = await request(app)
        .get(`/api/v1/verification/match/${matchId}`)
        .set("Authorization", `Bearer ${policeToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test("admin can list verifications for a match", async () => {
      const response = await request(app)
        .get(`/api/v1/verification/match/${matchId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe("Police and admin review queue", () => {
    test("normal user cannot access pending verification queue", async () => {
      const response = await request(app)
        .get("/api/v1/verification/pending")
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.statusCode).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("FORBIDDEN");
    });

    test("outsider cannot access pending verification queue", async () => {
      const response = await request(app)
        .get("/api/v1/verification/pending")
        .set("Authorization", `Bearer ${outsiderToken}`);

      expect(response.statusCode).toBe(403);
      expect(response.body.success).toBe(false);
    });

    test("police can access pending verification queue", async () => {
      const response = await request(app)
        .get("/api/v1/verification/pending")
        .set("Authorization", `Bearer ${policeToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);

      const found = response.body.data.find((item) => item._id === verificationId);
      expect(found).toBeDefined();
      expect(found.status).toBe("PENDING");
    });

    test("admin can access pending verification queue", async () => {
      const response = await request(app)
        .get("/api/v1/verification/pending")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe("Verification review", () => {
    test("normal user cannot approve a verification", async () => {
      const response = await request(app)
        .patch(`/api/v1/verification/${verificationId}/status`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ status: "VERIFIED" });

      expect(response.statusCode).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("FORBIDDEN");
    });

    test("outsider cannot approve a verification", async () => {
      const response = await request(app)
        .patch(`/api/v1/verification/${verificationId}/status`)
        .set("Authorization", `Bearer ${outsiderToken}`)
        .send({ status: "VERIFIED" });

      expect(response.statusCode).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("FORBIDDEN");
    });

    test("rejects an invalid review status", async () => {
      const response = await request(app)
        .patch(`/api/v1/verification/${verificationId}/status`)
        .set("Authorization", `Bearer ${policeToken}`)
        .send({ status: "MAYBE" });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("VALIDATION_ERROR");
    });

    test("police can verify a pending verification", async () => {
      const response = await request(app)
        .patch(`/api/v1/verification/${verificationId}/status`)
        .set("Authorization", `Bearer ${policeToken}`)
        .send({ status: "VERIFIED", notes: "Evidence reviewed and ownership confirmed" });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe("VERIFIED");
      expect(response.body.data.verified_at).toBeDefined();
      expect(response.body.data.verified_at).not.toBeNull();
      expect(response.body.data.notes).toBe("Evidence reviewed and ownership confirmed");
    });

    test("cannot review the same verification twice", async () => {
      const response = await request(app)
        .patch(`/api/v1/verification/${verificationId}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "REJECTED" });

      expect(response.statusCode).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("VERIFICATION_ALREADY_REVIEWED");
    });
  });

  describe("Admin authorization", () => {
    test("admin can access a verification", async () => {
      const response = await request(app)
        .get(`/api/v1/verification/${verificationId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test("admin can access the verification queue", async () => {
      const response = await request(app)
        .get("/api/v1/verification/pending")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});
