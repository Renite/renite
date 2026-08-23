import "dotenv/config";
import { jest } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";

import app from "../app.js";

import User from "../models/User.js";
import Report from "../models/Report.js";
import Match from "../models/Match.js";
import Verification from "../models/Verification.js";
import RecoveryCase from "../models/RecoveryCase.js";
import RecoveryParticipant from "../models/RecoveryParticipant.js";
import Category from "../models/Category.js";
import Material from "../models/Material.js";

describe("Recovery Case API", () => {
  let ownerToken, ownerId;
  let finderToken, finderId;
  let policeToken, policeId;
  let adminToken, adminId;
  let outsiderToken, outsiderId;

  let categoryId, materialId;
  let lostReportId, foundReportId;
  let matchId;
  let caseId;

  const timestamp = Date.now();

  const location = {
    latitude: 9.0054,
    longitude: 38.7636,
    place_name: "Bole",
    address: "Bole Road, Addis Ababa",
  };
  const incidentDate = new Date().toISOString();

  const owner = {
    full_name: `Case Owner ${timestamp}`,
    email: `case.owner.${timestamp}@example.com`,
    phone: `09${timestamp.toString().slice(-8)}`,
    password: "ReniteTest123!",
  };
  const finder = {
    full_name: `Case Finder ${timestamp}`,
    email: `case.finder.${timestamp}@example.com`,
    phone: `08${timestamp.toString().slice(-8)}`,
    password: "ReniteTest123!",
  };
  const police = {
    full_name: `Case Police ${timestamp}`,
    email: `case.police.${timestamp}@example.com`,
    phone: `07${timestamp.toString().slice(-8)}`,
    password: "ReniteTest123!",
  };
  const admin = {
    full_name: `Case Admin ${timestamp}`,
    email: `case.admin.${timestamp}@example.com`,
    phone: `06${timestamp.toString().slice(-8)}`,
    password: "ReniteTest123!",
  };
  const outsider = {
    full_name: `Case Outsider ${timestamp}`,
    email: `case.outsider.${timestamp}@example.com`,
    phone: `05${timestamp.toString().slice(-8)}`,
    password: "ReniteTest123!",
  };

  async function registerAndGetToken(payload) {
    const response = await request(app).post("/api/v1/auth/register").send(payload);
    expect(response.statusCode).toBe(201);
    return { token: response.body.data.accessToken, id: response.body.data.user.id };
  }

  async function loginAndGetToken(payload) {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ identifier: payload.email, password: payload.password });
    expect(response.statusCode).toBe(200);
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

    await RecoveryParticipant.deleteMany({});
    await RecoveryCase.deleteMany({});
    await Verification.deleteMany({});
    await Match.deleteMany({});
    await User.deleteMany({
      email: { $in: [owner.email, finder.email, police.email, admin.email, outsider.email] },
    });

    const category = await Category.create({
      name: `Case Category ${timestamp}`,
      description: "Category used by recovery case tests",
      status: "ACTIVE",
    });
    categoryId = category._id;

    const material = await Material.create({
      category_id: categoryId,
      name: `Case Material ${timestamp}`,
      description: "Material used by recovery case tests",
      status: "ACTIVE",
    });
    materialId = material._id;

    const regOwner = await registerAndGetToken(owner);
    ownerId = regOwner.id;
    ownerToken = regOwner.token;

    const regFinder = await registerAndGetToken(finder);
    finderId = regFinder.id;
    finderToken = regFinder.token;

    const regPolice = await registerAndGetToken(police);
    policeId = regPolice.id;
    await User.findByIdAndUpdate(policeId, { role: "police" });
    policeToken = await loginAndGetToken(police);

    const regAdmin = await registerAndGetToken(admin);
    adminId = regAdmin.id;
    await User.findByIdAndUpdate(adminId, { role: "admin" });
    adminToken = await loginAndGetToken(admin);

    const regOutsider = await registerAndGetToken(outsider);
    outsiderId = regOutsider.id;
    outsiderToken = regOutsider.token;

    const lostReport = await Report.create({
      user_id: ownerId,
      category_id: categoryId,
      material_id: materialId,
      type: "LOST",
      title: "Case test lost backpack",
      description: "Fixture for recovery case tests",
      status: "ACTIVE",
      location,
      incident_date: incidentDate,
      token: `case-lost-${timestamp}`,
    });
    lostReportId = lostReport._id;

    const foundReport = await Report.create({
      user_id: finderId,
      category_id: categoryId,
      material_id: materialId,
      type: "FOUND",
      title: "Case test found backpack",
      description: "Fixture for recovery case tests",
      status: "ACTIVE",
      location,
      incident_date: incidentDate,
      token: `case-found-${timestamp}`,
    });
    foundReportId = foundReport._id;

    // Bypass the matching engine and verification review flow —
    // recovery case tests only need a Match that is ACCEPTED with
    // a VERIFIED verification already attached to it.
    const match = await Match.create({
      lost_report_id: lostReportId,
      found_report_id: foundReportId,
      score: 95,
      source: "RULE_BASED",
      status: "ACCEPTED",
    });
    matchId = match._id;

    await Verification.create({
      match_id: matchId,
      initiated_by: ownerId,
      method: "OWNERSHIP_PROOF",
      status: "VERIFIED",
      verified_at: new Date(),
    });
  }, 30000);

  afterAll(async () => {
    if (caseId) {
      await RecoveryParticipant.deleteMany({ recovery_case_id: caseId });
      await RecoveryCase.deleteMany({ _id: caseId });
    }
    if (matchId) {
      await Verification.deleteMany({ match_id: matchId });
      await Match.deleteMany({ _id: matchId });
    }
    if (lostReportId || foundReportId) {
      await Report.deleteMany({ _id: { $in: [lostReportId, foundReportId].filter(Boolean) } });
    }
    await User.deleteMany({
      _id: { $in: [ownerId, finderId, policeId, adminId, outsiderId].filter(Boolean) },
    });
    if (materialId) await Material.deleteOne({ _id: materialId });
    if (categoryId) await Category.deleteOne({ _id: categoryId });
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }, 30000);

  describe("Authentication", () => {
    test("rejects unauthenticated case creation", async () => {
      const response = await request(app)
        .post("/api/v1/recovery-cases")
        .send({ match_id: matchId?.toString() });
      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe("Opening a recovery case", () => {
    test("rejects an unrelated user opening a case", async () => {
      const response = await request(app)
        .post("/api/v1/recovery-cases")
        .set("Authorization", `Bearer ${outsiderToken}`)
        .send({ match_id: matchId.toString() });

      expect(response.statusCode).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("FORBIDDEN");
    });

    test("a match participant can open a recovery case", async () => {
      const response = await request(app)
        .post("/api/v1/recovery-cases")
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({ match_id: matchId.toString() });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe("OPEN");
      expect(response.body.data.match_id.toString()).toBe(matchId.toString());

      caseId = response.body.data._id;
      expect(caseId).toBeDefined();
    });

    test("rejects opening a second case for the same match", async () => {
      const response = await request(app)
        .post("/api/v1/recovery-cases")
        .set("Authorization", `Bearer ${finderToken}`)
        .send({ match_id: matchId.toString() });

      expect(response.statusCode).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("CASE_EXISTS");
    });

    test("both report owners are enrolled as participants", async () => {
      const participants = await RecoveryParticipant.find({ recovery_case_id: caseId });
      const roles = participants.map((p) => p.role).sort();
      expect(roles).toEqual(["FINDER", "OWNER"]);
    });
  });

  describe("Recovery case retrieval", () => {
    test("a participant (owner) can retrieve the case", async () => {
      const response = await request(app)
        .get(`/api/v1/recovery-cases/${caseId}`)
        .set("Authorization", `Bearer ${ownerToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(caseId);
      expect(response.body.data.participants).toBeDefined();
      expect(response.body.data.participants.length).toBe(2);
    });

    test("the other participant (finder) can retrieve the case", async () => {
      const response = await request(app)
        .get(`/api/v1/recovery-cases/${caseId}`)
        .set("Authorization", `Bearer ${finderToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test("an outsider cannot retrieve the case", async () => {
      const response = await request(app)
        .get(`/api/v1/recovery-cases/${caseId}`)
        .set("Authorization", `Bearer ${outsiderToken}`);

      expect(response.statusCode).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("FORBIDDEN");
    });

    test("police can retrieve the case despite not being a participant", async () => {
      const response = await request(app)
        .get(`/api/v1/recovery-cases/${caseId}`)
        .set("Authorization", `Bearer ${policeToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test("admin can retrieve the case", async () => {
      const response = await request(app)
        .get(`/api/v1/recovery-cases/${caseId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test("returns 404 for a non-existing case", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/v1/recovery-cases/${fakeId}`)
        .set("Authorization", `Bearer ${ownerToken}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.error.code).toBe("CASE_NOT_FOUND");
    });

    test("finds the case by match ID", async () => {
      const response = await request(app)
        .get(`/api/v1/recovery-cases/match/${matchId}`)
        .set("Authorization", `Bearer ${ownerToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.data._id).toBe(caseId);
    });
  });

  describe("Recovery case status transitions", () => {
    test("an outsider cannot change status", async () => {
      const response = await request(app)
        .patch(`/api/v1/recovery-cases/${caseId}/status`)
        .set("Authorization", `Bearer ${outsiderToken}`)
        .send({ status: "IN_PROGRESS" });

      expect(response.statusCode).toBe(403);
      expect(response.body.error.code).toBe("FORBIDDEN");
    });

    test("rejects an invalid status value", async () => {
      const response = await request(app)
        .patch(`/api/v1/recovery-cases/${caseId}/status`)
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({ status: "SOMETHING_ELSE" });

      expect(response.statusCode).toBe(400);
      expect(response.body.error.code).toBe("VALIDATION_ERROR");
    });

    test("a participant cannot self-declare DISPUTED", async () => {
      const response = await request(app)
        .patch(`/api/v1/recovery-cases/${caseId}/status`)
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({ status: "DISPUTED" });

      expect(response.statusCode).toBe(403);
      expect(response.body.error.code).toBe("FORBIDDEN");
    });

    test("a participant can move the case to IN_PROGRESS", async () => {
      const response = await request(app)
        .patch(`/api/v1/recovery-cases/${caseId}/status`)
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({ status: "IN_PROGRESS" });

      expect(response.statusCode).toBe(200);
      expect(response.body.data.status).toBe("IN_PROGRESS");
    });

    test("a participant can move the case to HANDOFF_PENDING", async () => {
      const response = await request(app)
        .patch(`/api/v1/recovery-cases/${caseId}/status`)
        .set("Authorization", `Bearer ${finderToken}`)
        .send({ status: "HANDOFF_PENDING" });

      expect(response.statusCode).toBe(200);
      expect(response.body.data.status).toBe("HANDOFF_PENDING");
    });

    test("completing the case sets completed_at", async () => {
      const response = await request(app)
        .patch(`/api/v1/recovery-cases/${caseId}/status`)
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({ status: "COMPLETED" });

      expect(response.statusCode).toBe(200);
      expect(response.body.data.status).toBe("COMPLETED");
      expect(response.body.data.completed_at).toBeDefined();
      expect(response.body.data.completed_at).not.toBeNull();
    });

    test("completing the case marks both linked reports as RECOVERED", async () => {
      const lostRes = await request(app).get(`/api/v1/reports/${lostReportId}`);
      const foundRes = await request(app).get(`/api/v1/reports/${foundReportId}`);

      expect(lostRes.body.data.status).toBe("RECOVERED");
      expect(foundRes.body.data.status).toBe("RECOVERED");
    });
  });

  describe("Police escalation", () => {
    test("police can mark a case DISPUTED even without being a participant", async () => {
      // Uses a fresh case so we're not fighting the already-COMPLETED one above.
      const secondMatch = await Match.create({
        lost_report_id: lostReportId,
        found_report_id: foundReportId,
        score: 80,
        source: "MANUAL",
        status: "ACCEPTED",
      });
      await Verification.create({
        match_id: secondMatch._id,
        initiated_by: ownerId,
        method: "MANUAL",
        status: "VERIFIED",
        verified_at: new Date(),
      });
      const openRes = await request(app)
        .post("/api/v1/recovery-cases")
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({ match_id: secondMatch._id.toString() });
      expect(openRes.statusCode).toBe(201);

      const disputeRes = await request(app)
        .patch(`/api/v1/recovery-cases/${openRes.body.data._id}/status`)
        .set("Authorization", `Bearer ${policeToken}`)
        .send({ status: "DISPUTED" });

      expect(disputeRes.statusCode).toBe(200);
      expect(disputeRes.body.data.status).toBe("DISPUTED");

      // Cleanup specific to this sub-test's extra fixtures.
      await RecoveryParticipant.deleteMany({ recovery_case_id: openRes.body.data._id });
      await RecoveryCase.deleteMany({ _id: openRes.body.data._id });
      await Verification.deleteMany({ match_id: secondMatch._id });
      await Match.deleteMany({ _id: secondMatch._id });
    });
  });
});
