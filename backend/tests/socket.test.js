import "dotenv/config";
import { jest } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";
import http from "http";
import { io as ioClient } from "socket.io-client";

import app from "../app.js";
import { initSocket } from "../sockets/chat.socket.js";

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

describe("Chat Socket.io", () => {
  let httpServer, port, baseUrl;

  let ownerToken, ownerId;
  let finderToken, finderId;
  let outsiderToken, outsiderId;

  let categoryId, materialId;
  let lostReportId, foundReportId;
  let matchId, caseId, conversationId;

  const timestamp = Date.now();
  const location = {
    latitude: 9.0054,
    longitude: 38.7636,
    place_name: "Bole",
    address: "Bole Road, Addis Ababa",
  };
  const incidentDate = new Date().toISOString();

  const owner = {
    full_name: `Socket Owner ${timestamp}`,
    email: `socket.owner.${timestamp}@example.com`,
    phone: `09${timestamp.toString().slice(-8)}`,
    password: "ReniteTest123!",
  };
  const finder = {
    full_name: `Socket Finder ${timestamp}`,
    email: `socket.finder.${timestamp}@example.com`,
    phone: `08${timestamp.toString().slice(-8)}`,
    password: "ReniteTest123!",
  };
  const outsider = {
    full_name: `Socket Outsider ${timestamp}`,
    email: `socket.outsider.${timestamp}@example.com`,
    phone: `07${timestamp.toString().slice(-8)}`,
    password: "ReniteTest123!",
  };

  async function registerAndGetToken(payload) {
    const response = await request(app).post("/api/v1/auth/register").send(payload);
    expect(response.statusCode).toBe(201);
    return { token: response.body.data.accessToken, id: response.body.data.user.id };
  }

  function connectClient(token) {
    return ioClient(baseUrl, {
      auth: { token },
      transports: ["websocket"],
      forceNew: true,
    });
  }

  function waitFor(socket, event) {
    return new Promise((resolve) => socket.once(event, resolve));
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

    // Spin up a real HTTP server + Socket.io on an ephemeral port —
    // socket.io-client needs an actual bound port, unlike Supertest
    // which never really listens.
    httpServer = http.createServer(app);
    initSocket(httpServer, "*");
    await new Promise((resolve) => httpServer.listen(0, resolve));
    port = httpServer.address().port;
    baseUrl = `http://localhost:${port}`;

    const category = await Category.create({
      name: `Socket Category ${timestamp}`,
      description: "Category used by socket tests",
      status: "ACTIVE",
    });
    categoryId = category._id;

    const material = await Material.create({
      category_id: categoryId,
      name: `Socket Material ${timestamp}`,
      description: "Material used by socket tests",
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
      user_id: ownerId, category_id: categoryId, material_id: materialId,
      type: "LOST", title: "Socket test lost item", status: "ACTIVE",
      location, incident_date: incidentDate, token: `socket-lost-${timestamp}`,
    });
    lostReportId = lostReport._id;

    const foundReport = await Report.create({
      user_id: finderId, category_id: categoryId, material_id: materialId,
      type: "FOUND", title: "Socket test found item", status: "ACTIVE",
      location, incident_date: incidentDate, token: `socket-found-${timestamp}`,
    });
    foundReportId = foundReport._id;

    const match = await Match.create({
      lost_report_id: lostReportId, found_report_id: foundReportId,
      score: 95, source: "RULE_BASED", status: "ACCEPTED",
    });
    matchId = match._id;

    await Verification.create({
      match_id: matchId, initiated_by: ownerId, method: "OWNERSHIP_PROOF",
      status: "VERIFIED", verified_at: new Date(),
    });

    const openRes = await request(app)
      .post("/api/v1/recovery-cases")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ match_id: matchId.toString() });
    caseId = openRes.body.data._id;

    const convRes = await request(app)
      .post(`/api/v1/recovery/${caseId}/conversation`)
      .set("Authorization", `Bearer ${ownerToken}`);
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

    await new Promise((resolve) => httpServer.close(resolve));
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }, 30000);

  describe("Connection authentication", () => {
    test("rejects a connection with no token", (done) => {
      const socket = connectClient(undefined);
      socket.on("connect_error", (err) => {
        expect(err.message).toBe("NO_TOKEN");
        socket.close();
        done();
      });
    });

    test("rejects a connection with an invalid token", (done) => {
      const socket = connectClient("not-a-real-token");
      socket.on("connect_error", (err) => {
        expect(err.message).toBe("INVALID_TOKEN");
        socket.close();
        done();
      });
    });

    test("accepts a connection with a valid token", (done) => {
      const socket = connectClient(ownerToken);
      socket.on("connect", () => {
        expect(socket.connected).toBe(true);
        socket.close();
        done();
      });
    });
  });

  describe("Joining a conversation", () => {
    test("a participant can join the conversation room", (done) => {
      const socket = connectClient(ownerToken);
      socket.on("connect", () => {
        socket.emit("conversation:join", conversationId, (ack) => {
          expect(ack.ok).toBe(true);
          socket.close();
          done();
        });
      });
    });

    test("an outsider cannot join the conversation room", (done) => {
      const socket = connectClient(outsiderToken);
      socket.on("connect", () => {
        socket.emit("conversation:join", conversationId, (ack) => {
          expect(ack.ok).toBe(false);
          expect(ack.error).toBe("FORBIDDEN");
          socket.close();
          done();
        });
      });
    });
  });

  describe("Real-time message delivery", () => {
    let ownerSocket, finderSocket;

    beforeAll((done) => {
      ownerSocket = connectClient(ownerToken);
      finderSocket = connectClient(finderToken);
      let readyCount = 0;
      const onReady = () => {
        readyCount += 1;
        if (readyCount === 2) done();
      };
      ownerSocket.on("connect", () => {
        ownerSocket.emit("conversation:join", conversationId, onReady);
      });
      finderSocket.on("connect", () => {
        finderSocket.emit("conversation:join", conversationId, onReady);
      });
    });

    afterAll(() => {
      ownerSocket.close();
      finderSocket.close();
    });

    test("a message sent by one participant is received by the other in real time", async () => {
      const received = waitFor(finderSocket, "message:new");

      ownerSocket.emit("message:send", { conversationId, body: "Meet at Bole tomorrow?" }, (ack) => {
        expect(ack.ok).toBe(true);
      });

      const message = await received;
      expect(message.body).toBe("Meet at Bole tomorrow?");
      expect(message.sender_id).toBe(ownerId);
      expect(message.conversation_id).toBe(conversationId);
    });

    test("an edit is broadcast to the other participant", async () => {
      const sent = await new Promise((resolve) => {
        finderSocket.once("message:new", resolve);
        ownerSocket.emit("message:send", { conversationId, body: "Original text" }, () => {});
      });

      const edited = waitFor(finderSocket, "message:edited");
      ownerSocket.emit(
        "message:edit",
        { conversationId, messageId: sent._id, body: "Corrected text" },
        (ack) => expect(ack.ok).toBe(true),
      );

      const editedMessage = await edited;
      expect(editedMessage.body).toBe("Corrected text");
      expect(editedMessage.edited_at).toBeDefined();
    });

    test("a delete is broadcast to the other participant", async () => {
      const sent = await new Promise((resolve) => {
        finderSocket.once("message:new", resolve);
        ownerSocket.emit("message:send", { conversationId, body: "Oops wrong chat" }, () => {});
      });

      const deleted = waitFor(finderSocket, "message:deleted");
      ownerSocket.emit("message:delete", { conversationId, messageId: sent._id }, (ack) => {
        expect(ack.ok).toBe(true);
      });

      const deletedEvent = await deleted;
      expect(deletedEvent.messageId).toBe(sent._id);
    });

    test("cannot edit another participant's message via socket", async () => {
      const sent = await new Promise((resolve) => {
        ownerSocket.once("message:new", resolve);
        finderSocket.emit("message:send", { conversationId, body: "finder's message" }, () => {});
      });

      const ack = await new Promise((resolve) => {
        ownerSocket.emit(
          "message:edit",
          { conversationId, messageId: sent._id, body: "hijack attempt" },
          resolve,
        );
      });

      expect(ack.ok).toBe(false);
      expect(ack.error).toBe("FORBIDDEN");
    });
  });
});