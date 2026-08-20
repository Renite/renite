import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import Asset from '../models/asset.model.js';
import Case from '../models/case.model.js';
import Volunteer from '../models/volunteer.model.js';

const router = Router();

router.get('/summary', authenticate, async (req, res) => {
  try {
    const totalAssets = await Asset.countDocuments();
    const activeCases = await Case.countDocuments({ status: { $ne: 'CLOSED' } });
    const activeVolunteers = await Volunteer.countDocuments({ isActive: true });

    const recentCases = await Case.find().sort({ updatedAt: -1 }).limit(3);
    const recentActivity = recentCases.map(c => ({
      time: new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Case ${c.code} status updated to ${c.status}`
    }));

    res.status(200).json({
      success: true,
      data: {
        stats: { totalAssets, activeCases, activeVolunteers },
        recentActivity: recentActivity.length > 0 ? recentActivity : [
          { time: 'System', text: 'Database synchronized successfully.' }
        ]
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;