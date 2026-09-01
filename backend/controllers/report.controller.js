import { reportService } from '../services/report.service.js';
import { logAudit } from '../utils/audit.js';

// -- emergency reports --
export async function createEmergency(req, res, next) {
  try {
    const report = await reportService.createEmergencyReport(req.body);
    logAudit(req, { action: 'EMERGENCY_REPORT_CREATED', description: `id=${report.id} type=${report.type}` });
    res.status(201).json({ success: true, data: report });
  } catch (err) { next(err); }
}

export async function listEmergency(req, res, next) {
  try {
    const result = await reportService.listEmergencyReports(req.query);
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function updateEmergencyStatus(req, res, next) {
  try {
    const report = await reportService.updateEmergencyStatus(req.params.id, req.body.status, req.user.role);
    logAudit(req, { action: 'EMERGENCY_REPORT_STATUS_CHANGED', description: `id=${report.id} status=${report.status}` });
    res.status(200).json({ success: true, data: report });
  } catch (err) { next(err); }
}

// -- stolen assets --
export async function createAsset(req, res, next) {
  try {
    const asset = await reportService.createStolenAsset(req.body);
    logAudit(req, { action: 'STOLEN_ASSET_CREATED', description: `id=${asset.id} asset_name=${asset.asset_name}` });
    res.status(201).json({ success: true, data: asset });
  } catch (err) { next(err); }
}

export async function listAssets(req, res, next) {
  try {
    const result = await reportService.listStolenAssets(req.query);
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function updateAssetStatus(req, res, next) {
  try {
    const asset = await reportService.updateStolenAssetStatus(req.params.id, req.body.status, req.user.role);
    logAudit(req, { action: 'STOLEN_ASSET_STATUS_CHANGED', description: `id=${asset.id} status=${asset.status}` });
    res.status(200).json({ success: true, data: asset });
  } catch (err) { next(err); }
}

// -- devices --
export async function registerDevice(req, res, next) {
  try {
    const device = await reportService.registerDevice(req.user.id, req.user.fayda_id, req.body);
    logAudit(req, { action: 'DEVICE_REGISTERED', description: `id=${device.id} token=${device.recovery_token}` });
    res.status(201).json({ success: true, data: device });
  } catch (err) { next(err); }
}

export async function listMyDevices(req, res, next) {
  try {
    const devices = await reportService.listMyDevices(req.user.id);
    res.status(200).json({ success: true, data: devices });
  } catch (err) { next(err); }
}

export async function listAllDevices(req, res, next) {
  try {
    const result = await reportService.listAllDevices(req.query);
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function deleteDevice(req, res, next) {
  try {
    const result = await reportService.deleteDevice(req.params.id);
    logAudit(req, { action: 'DEVICE_DELETED', description: `id=${req.params.id}` });
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function lookupDeviceByToken(req, res, next) {
  try {
    const device = await reportService.lookupDeviceByToken(req.query.token);
    res.status(200).json({ success: true, data: device });
  } catch (err) { next(err); }
}

export async function lookupCitizenByFaydaId(req, res, next) {
  try {
    const citizen = await reportService.lookupCitizenByFaydaId(req.query.fayda_id);
    res.status(200).json({ success: true, data: citizen });
  } catch (err) { next(err); }
}
