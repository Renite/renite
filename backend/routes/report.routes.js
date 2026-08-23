import { Router } from 'express';
import {
  createEmergency, listEmergency, updateEmergencyStatus,
  createAsset, listAssets, updateAssetStatus,
  registerDevice, listMyDevices, listAllDevices, deleteDevice
} from '../controllers/report.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

// Public: matches the emergency_reports/stolen_assets RLS SELECT/INSERT
// policies (open to public) -- reporting an emergency shouldn't require
// an account, and the directory is meant to be publicly browsable.
router.get('/emergency-reports', listEmergency);
router.post('/emergency-reports', createEmergency);
router.patch('/emergency-reports/:id/status', authenticate, authorize('admin', 'police'), updateEmergencyStatus);

router.get('/stolen-assets', listAssets);
router.post('/stolen-assets', createAsset);
router.patch('/stolen-assets/:id/status', authenticate, authorize('admin', 'police'), updateAssetStatus);

// Devices: owner-scoped now that devices RLS is locked to own-user.
router.post('/devices', authenticate, registerDevice);
router.get('/devices/me', authenticate, listMyDevices);
router.get('/devices', authenticate, authorize('admin'), listAllDevices);
router.delete('/devices/:id', authenticate, authorize('admin'), deleteDevice);

export default router;
