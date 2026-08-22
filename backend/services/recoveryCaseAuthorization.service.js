import RecoveryParticipant from '../models/RecoveryParticipant.js';
import { AppError } from './auth.service.js';

const PRIVILEGED_ROLES = ['admin', 'police'];

export async function assertCanViewRecoveryCase(recoveryCase, userId, userRole) {
  if (PRIVILEGED_ROLES.includes(userRole)) return;

  const participant = await RecoveryParticipant.findOne({
    recovery_case_id: recoveryCase._id,
    user_id: userId,
  });

  if (!participant) {
    throw new AppError(
      403,
      'FORBIDDEN',
      'You are not a participant in this recovery case'
    );
  }
}

export async function assertParticipant(recoveryCaseId, userId) {
  const participant = await RecoveryParticipant.findOne({
    recovery_case_id: recoveryCaseId,
    user_id: userId,
  });

  if (!participant) {
    throw new AppError(
      403,
      'FORBIDDEN',
      'You are not a participant in this recovery case'
    );
  }

  return participant;
}