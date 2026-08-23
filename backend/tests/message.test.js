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
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import Category from "../models/Category.js";
import Material from "../models/Material.js";

describe("Message API", () => {
  let ownerToken, ownerId;
  let finderToken, finderId;
  let outsiderToken, outsiderId;

  let categoryId, materialId;
  let lostReportId, foundReportId;
  let matchId, caseId, conversationId;
  let messageId;

  const timestamp = Date.now();

  const location = {
    latitude: 9.0054,
    longitude: 38.7636,
    place_name: "Bole",
    address: "Bole Road, Addis Ababa",
  };
  const incidentDate = new Date().toISOString();

  const owner = {
    full_name: `Msg Owner ${timestamp}`,
    email: `msg.owner.${timestamp}@example.com`,
    phone: `09${timestamp.toString().slice(-8)}`,
    password: "ReniteTest123!",
  };
  const finder = {
    full_name: `Msg Finder ${timestamp}`,
    email: `msg.finder.${timestamp}@example.com`,
    phone: `08${timestamp.toString().slice(-8)}`,
    password: "ReniteTest123!",
  };
  const outsider = {
    full_name: `Msg Outsider ${timestamp}`,
    email: `msg.outsider.${timestamp}@example.com`,
    phone: `07${timestamp.toString().slice(-8)}`,
    password: "ReniteTest123!",
  };

  async function registerAndGetToken(payload) {
    const response = await request(app).post("/api/v1/auth/register").send(payload);
    expect(response.statusCode).toBe(201);
    return { token: response.body.data.accessToken, id: response.body.data.user.id };
  }

  beforeAll(async () => {
    jest.setTimeout(30000);

    if (!process.env.TEST_MONGODB_URL) {
      throw new Error("TEST_MONGODB_URL is not configured");
    }
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.TEST_MONGODB_URL);
    }

    await Message.deleteMany({});
    await Conversation.deleteMany({});
    await RecoveryParticipant.deleteMany({});
    await RecoveryCase.deleteMany({});
    await Verification.deleteMany({});
    await Match.deleteMany({});
    await User.deleteMany({
      email: { $in: [owner.email, finder.email, outsider.email] },
    });

    const category = await Category.create({
      name: `Msg Category ${timestamp}`,
      description: "Category used by message tests",
      status: "ACTIVE",
    });
    categoryId = category._id;

    const material = await Material.create({
      category_id: categoryId,
      name: `Msg Material ${timestamp}`,
      description: "Material used by message tests",
      status: "ACTIVE",
    });
    materialId = material._id;

    const regOwner = await registerAndGetToken(owner);
    ownerId = regOwner.id;
    ownerToken = regOwner.token;

    const regFinder = await registerAndGetToken(finder);
    finderId = regFinder.id;
    finderToken = regFinder.token;

    const regOutsider = await registerAndGetToken(outsider);
    outsiderId = regOutsider.id;
    outsiderToken = regOutsider.token;

    const lostReport = await Report.create({
      user_id: ownerId,
      category_id: categoryId,
      material_id: materialId,
      type: "LOST",
      title: "Message test lost item",
      description: "Fixture for message tests",
      status: "ACTIVE",
      location,
      incident_date: incidentDate,
      token: `msg-lost-${timestamp}`,
    });
    lostReportId = lostReport._id;

    const foundReport = await Report.create({
      user_id: finderId,
      category_id: categoryId,
      material_id: materialId,
      type: "FOUND",
      title: "Message test found item",
      description: "Fixture for message tests",
      status: "ACTIVE",
      location,
      incident_date: incidentDate,
      token: `msg-found-${timestamp}`,
    });
    foundReportId = foundReport._id;

    // Build the full chain directly via models — matching/verification
    // engines are tested elsewhere; here we just need a valid, OPEN
    // recovery case with a conversation attached.
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

    const openRes = await request(app)
      .post("/api/v1/recovery-cases")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ match_id: matchId.toString() });
    expect(openRes.statusCode).toBe(201);
    caseId = openRes.body.data._id;

    const convRes = await request(app)
      .post(`/api/v1/recovery/${caseId}/conversation`)
      .set("Authorization", `Bearer ${ownerToken}`);
    expect(convRes.statusCode).toBe(201);
    conversationId = convRes.body.data._id;
  }, 30000);

  afterAll(async () => {
    if (conversationId) await Message.deleteMany({ conversation_id: conversationId });
    if (conversationId) await Conversation.deleteMany({ _id: conversationId });
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
    await User.deleteMany({ _id: { $in: [ownerId, finderId, outsiderId].filter(Boolean) } });
    if (materialId) await Material.deleteOne({ _id: materialId });
    if (categoryId) await Category.deleteOne({ _id: categoryId });
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }, 30000);

  describe("Authentication", () => {
    test("rejects unauthenticated message send", async () => {
      const response = await request(app)
        .post(`/api/v1/conversations/${conversationId}/messages`)
        .send({ body: "hello" });

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe("Sending messages", () => {
    test("a participant (owner) can send a message", async () => {
      const response = await request(app)
        .post(`/api/v1/conversations/${conversationId}/messages`)
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({ body: "I think I found your item, is it black?" });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.body).toBe("I think I found your item, is it black?");
      expect(response.body.data.message_type).toBe("TEXT");
      expect(response.body.data.sender_id).toBe(ownerId);

      messageId = response.body.data._id;
    });

    test("the other participant (finder) can also send a message", async () => {
      const response = await request(app)
        .post(`/api/v1/conversations/${conversationId}/messages`)
        .set("Authorization", `Bearer ${finderToken}`)
        .send({ body: "Yes, black with a red zipper." });

      expect(response.statusCode).toBe(201);
      expect(response.body.data.sender_id).toBe(finderId);
    });

    test("rejects an unrelated user sending a message", async () => {
      const response = await request(app)
        .post(`/api/v1/conversations/${conversationId}/messages`)
        .set("Authorization", `Bearer ${outsiderToken}`)
        .send({ body: "let me in" });

      expect(response.statusCode).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("FORBIDDEN");
    });

    test("rejects an empty body", async () => {
      const response = await request(app)
        .post(`/api/v1/conversations/${conversationId}/messages`)
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({ body: "   " });

      expect(response.statusCode).toBe(400);
      expect(response.body.error.code).toBe("VALIDATION_ERROR");
    });

    test("rejects a client attempting to send a SYSTEM message", async () => {
      const response = await request(app)
        .post(`/api/v1/conversations/${conversationId}/messages`)
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({ body: "fake system note", message_type: "SYSTEM" });

      expect(response.statusCode).toBe(400);
      expect(response.body.error.code).toBe("VALIDATION_ERROR");
    });

    test("rejects a non-existing conversation", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .post(`/api/v1/conversations/${fakeId}/messages`)
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({ body: "hello" });

      expect(response.statusCode).toBe(404);
      expect(response.body.error.code).toBe("CONVERSATION_NOT_FOUND");
    });
  });

  describe("Listing messages", () => {
    test("a participant can list messages, newest first", async () => {
      const response = await request(app)
        .get(`/api/v1/conversations/${conversationId}/messages`)
        .set("Authorization", `Bearer ${ownerToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.messages)).toBe(true);
      expect(response.body.data.messages.length).toBeGreaterThanOrEqual(2);
      expect(response.body.data.total).toBeGreaterThanOrEqual(2);

      const [first, second] = response.body.data.messages;
      expect(new Date(first.created_at).getTime()).toBeGreaterThanOrEqual(
        new Date(second.created_at).getTime(),
      );
    });

    test("an outsider cannot list messages", async () => {
      const response = await request(app)
        .get(`/api/v1/conversations/${conversationId}/messages`)
        .set("Authorization", `Bearer ${outsiderToken}`);

      expect(response.statusCode).toBe(403);
      expect(response.body.error.code).toBe("FORBIDDEN");
    });
  });

  describe("Editing messages", () => {
    test("the sender can edit their own message", async () => {
      const response = await request(app)
        .patch(`/api/v1/conversations/${conversationId}/messages/${messageId}`)
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({ body: "I think I found your item, is it navy blue?" });

      expect(response.statusCode).toBe(200);
      expect(response.body.data.body).toBe("I think I found your item, is it navy blue?");
      expect(response.body.data.edited_at).toBeDefined();
      expect(response.body.data.edited_at).not.toBeNull();
    });

    test("another participant cannot edit someone else's message", async () => {
      const response = await request(app)
        .patch(`/api/v1/conversations/${conversationId}/messages/${messageId}`)
        .set("Authorization", `Bearer ${finderToken}`)
        .send({ body: "hijacked" });

      expect(response.statusCode).toBe(403);
      expect(response.body.error.code).toBe("FORBIDDEN");
    });

    test("returns 404 for a non-existing message", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .patch(`/api/v1/conversations/${conversationId}/messages/${fakeId}`)
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({ body: "edit" });

      expect(response.statusCode).toBe(404);
      expect(response.body.error.code).toBe("MESSAGE_NOT_FOUND");
    });
  });

  describe("Deleting messages", () => {
    test("another participant cannot delete someone else's message", async () => {
      const response = await request(app)
        .delete(`/api/v1/conversations/${conversationId}/messages/${messageId}`)
        .set("Authorization", `Bearer ${finderToken}`);

      expect(response.statusCode).toBe(403);
      expect(response.body.error.code).toBe("FORBIDDEN");
    });

    test("the sender can soft-delete their own message", async () => {
      const response = await request(app)
        .delete(`/api/v1/conversations/${conversationId}/messages/${messageId}`)
        .set("Authorization", `Bearer ${ownerToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.data.deleted).toBe(true);
    });

    test("a deleted message no longer appears in the listing", async () => {
      const response = await request(app)
        .get(`/api/v1/conversations/${conversationId}/messages`)
        .set("Authorization", `Bearer ${ownerToken}`);

      const found = response.body.data.messages.find((m) => m._id === messageId);
      expect(found).toBeUndefined();
    });
  });
});
