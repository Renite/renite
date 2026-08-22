import Report from '../models/Report.js';
import { AppError } from './auth.service.js';

const VALID_TYPES = ['LOST', 'FOUND'];
const VALID_STATUSES = ['ACTIVE', 'MATCHED', 'IN_VERIFICATION', 'RECOVERED', 'CLOSED', 'CANCELLED'];

export const searchService = {
  async searchReports(query) {
    const { q, type, status, category_id, material_id, from, to, lat, lng, radius_km, page = 1, limit = 20 } = query;

    if (type && !VALID_TYPES.includes(type)) {
      throw new AppError(400, 'VALIDATION_ERROR', 'type must be LOST or FOUND');
    }
    if (status && !VALID_STATUSES.includes(status)) {
      throw new AppError(400, 'VALIDATION_ERROR', `status must be one of: ${VALID_STATUSES.join(', ')}`);
    }

    const filter = { deleted_at: null, status: status || 'ACTIVE' };
    if (type) filter.type = type;
    if (category_id) filter.category_id = category_id;
    if (material_id) filter.material_id = material_id;

    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), 'i');
      filter.$or = [{ title: regex }, { description: regex }];
    }

    if (from || to) {
      filter.incident_date = {};
      if (from) filter.incident_date.$gte = new Date(from);
      if (to) filter.incident_date.$lte = new Date(to);
    }

    // Approximate radius search via bounding box (no geospatial index needed)
    if (lat && lng && radius_km) {
      const latF = parseFloat(lat), lngF = parseFloat(lng), radius = parseFloat(radius_km);
      const latDelta = radius / 111;
      const lngDelta = radius / (111 * Math.cos((latF * Math.PI) / 180));
      filter['location.latitude'] = { $gte: latF - latDelta, $lte: latF + latDelta };
      filter['location.longitude'] = { $gte: lngF - lngDelta, $lte: lngF + lngDelta };
    }

    const skip = (page - 1) * limit;
    const [reports, total] = await Promise.all([
      Report.find(filter).sort({ created_at: -1 }).skip(skip).limit(Number(limit)),
      Report.countDocuments(filter)
    ]);
    return { reports, total, page: Number(page), limit: Number(limit) };
  }
};
