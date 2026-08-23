import { searchService } from '../services/search.service.js';

export async function search(req, res, next) {
  try {
    const result = await searchService.search(req.query);
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
}
