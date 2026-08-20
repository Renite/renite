import 'dotenv/config';
import { jest } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';

import app from '../app.js';
import User from '../models/User.js';
import RecoveryCase from '../models/RecoveryCase.js';
import RecoveryParticipant from '../models/RecoveryParticipant.js';
import Conversation from '../models/Conversation.js';

// This test focuses on BE-010.1 and creates the minimum recovery-case fixtures
// directly. The recovery-case API itself is covered by recoveryCase.test.js.
describe('Conversation API', () => {
  let ownerToken;
  let finderToken;
  let policeToken;
  let adminToken;
  let outsiderToken;
  let ownerId;
  let finderId;
  let policeId;
  let adminId;
  let outsiderId;
  let recoveryCaseId;

  const timestamp = Date.now();

  const users = {
    owner: {
      full_name: `Conversation Owner ${timestamp}`,
      email: `conversation.owner.${timestamp}@example.com`,
      phone: `19${timestamp.toString().slice(-8)}`,
      password: 'ReniteTest123!',
    },
    finder: {
      full_name: `Conversation Finder ${timestamp}`,
      email: `conversation.finder.${timestamp}@example.com`,
      phone: `18${timestamp.toString().slice(-8)}`,
      password: 'ReniteTest123!',
    },
    police: {
      full_name: `Conversation Police ${timestamp}`,
      email: `conversation.police.${timestamp}@example.com`,
      phone: `17${timestamp.toString().slice(-8)}`,
      password: 'ReniteTest123!',
    },
    admin: {
      full_name: `Conversation Admin ${timestamp}`,
      email: `conversation.admin.${timestamp}@example.com`,
      phone: `16${timestamp.toString().slice(-8)}`,
      password: 'ReniteTest123!',
    },
    outsider: {
      full_name: `Conversation Outsider ${timestamp}`,
      email: `conversation.outsider.${timestamp}@example.com`,
      phone: `15${timestamp.toString().slice(-8)}`,
      password: 'ReniteTest123!',
    },
  };

  async function registerAndGetToken(payload) {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(payload);
    expect(response.statusCode).toBe(201);
    return {
      token: response.body.data.accessToken,
      id: response.body.data.user.id,
    };
  }

  async function loginAndGetToken(payload) {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ identifier: payload.email, password: payload.password });
    expect(response.statusCode).toBe(200);
    return response.body.data.accessToken;
  }

  beforeAll(async () => {
    jest.setTimeout(30000);

    if (!process.env.TEST_MONGODB_URL) {
      throw new Error('TEST_MONGODB_URL is not configured');
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.TEST_MONGODB_URL);
    }

    await Conversation.deleteMany({});
    await RecoveryParticipant.deleteMany({});
    await RecoveryCase.deleteMany({});
    await User.deleteMany({
      email: {
        $in: Object.values(users).map((user) => user.email),
      },
    });

    const owner = await registerAndGetToken(users.owner);
    ownerId = owner.id;
    ownerToken = owner.token;

    const finder = await registerAndGetToken(users.finder);
    finderId = finder.id;
    finderToken = finder.token;

    const police = await registerAndGetToken(users.police);
    policeId = police.id;
    await User.findByIdAndUpdate(policeId, { role: 'police' });
    policeToken = await loginAndGetToken(users.police);

    const admin = await registerAndGetToken(users.admin);
    adminId = admin.id;
    await User.findByIdAndUpdate(adminId, { role: 'admin' });
    adminToken = await loginAndGetToken(users.admin);

    const outsider = await registerAndGetToken(users.outsider);
    outsiderId = outsider.id;
    outsiderToken = outsider.token;

    const recoveryCase = await RecoveryCase.create({
      match_id: new mongoose.Types.ObjectId(),
      status: 'OPEN',
    });
    recoveryCaseId = recoveryCase._id;

    await RecoveryParticipant.create([
      {
        recovery_case_id: recoveryCaseId,
        user_id: ownerId,
        role: 'OWNER',
      },
      {
        recovery_case_id: recoveryCaseId,
        user_id: finderId,
        role: 'FINDER',
      },
    ]);
  }, 30000);

  afterAll(async () => {
    if (recoveryCaseId) {
      await Conversation.deleteMany({ recovery_case_id: recoveryCaseId });
      await RecoveryParticipant.deleteMany({ recovery_case_id: recoveryCaseId });
      await RecoveryCase.deleteOne({ _id: recoveryCaseId });
    }

    await User.deleteMany({
      _id: { $in: [ownerId, finderId, policeId, adminId, outsiderId].filter(Boolean) },
    });

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }, 30000);

  test('rejects unauthenticated conversation creation', async () => {
    const response = await request(app)
      .post(`/api/v1/recovery/${recoveryCaseId}/conversation`)
      .send({});

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test('a recovery participant can create a conversation', async () => {
    const response = await request(app)
      .post(`/api/v1/recovery/${recoveryCaseId}/conversation`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({});

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.recovery_case_id.toString()).toBe(recoveryCaseId.toString());
    expect(response.body.data.status).toBe('ACTIVE');
  });

  test('creating the same conversation again returns the existing conversation', async () => {
    const before = await Conversation.countDocuments({
      recovery_case_id: recoveryCaseId,
      deleted_at: null,
    });

    const response = await request(app)
      .post(`/api/v1/recovery/${recoveryCaseId}/conversation`)
      .set('Authorization', `Bearer ${finderToken}`)
      .send({});

    const after = await Conversation.countDocuments({
      recovery_case_id: recoveryCaseId,
      deleted_at: null,
    });

    expect(response.statusCode).toBe(201);
    expect(after).toBe(before);
  });

  test('a recovery participant can retrieve the conversation', async () => {
    const response = await request(app)
      .get(`/api/v1/recovery/${recoveryCaseId}/conversation`)
      .set('Authorization', `Bearer ${finderToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.recovery_case_id.toString()).toBe(recoveryCaseId.toString());
  });

  test('an outsider cannot retrieve the conversation', async () => {
    const response = await request(app)
      .get(`/api/v1/recovery/${recoveryCaseId}/conversation`)
      .set('Authorization', `Bearer ${outsiderToken}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('NOT_AUTHORIZED');
  });

  test('an outsider cannot create a conversation', async () => {
    const otherCaseId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .post(`/api/v1/recovery/${otherCaseId}/conversation`)
      .set('Authorization', `Bearer ${outsiderToken}`)
      .send({});

    expect(response.statusCode).toBe(404);
    expect(response.body.error.code).toBe('RECOVERY_CASE_NOT_FOUND');
  });

  test('police can retrieve the conversation under existing recovery-case access rules', async () => {
    const response = await request(app)
      .get(`/api/v1/recovery/${recoveryCaseId}/conversation`)
      .set('Authorization', `Bearer ${policeToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test('admin can retrieve the conversation under existing recovery-case access rules', async () => {
    const response = await request(app)
      .get(`/api/v1/recovery/${recoveryCaseId}/conversation`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test('returns 404 when no conversation exists', async () => {
    const newCase = await RecoveryCase.create({
      match_id: new mongoose.Types.ObjectId(),
      status: 'OPEN',
    });

    await RecoveryParticipant.create({
      recovery_case_id: newCase._id,
      user_id: ownerId,
      role: 'OWNER',
    });

    const response = await request(app)
      .get(`/api/v1/recovery/${newCase._id}/conversation`)
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.error.code).toBe('CONVERSATION_NOT_FOUND');

    await RecoveryParticipant.deleteMany({ recovery_case_id: newCase._id });
    await RecoveryCase.deleteOne({ _id: newCase._id });
  });

  test('rejects an invalid recovery case ID', async () => {
    const response = await request(app)
      .get('/api/v1/recovery/not-an-object-id/conversation')
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.error.code).toBe('INVALID_RECOVERY_CASE_ID');
  });
});
