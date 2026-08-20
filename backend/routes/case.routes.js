import { Router } from 'express';
import { authenticate, can } from '../middleware/auth.middleware.js';
import Case from '../models/case.model.js';

const router = Router();

// Get list of cases
router.get('/', authenticate, can('case:read'), async (req, res) => {
  try {
    const cases = await Case.find().sort({ createdAt: -1 }).limit(50);
    res.status(200).json({ success: true, data: cases });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single case by code or ID (powers TrackStatus.jsx)
router.get('/:id', authenticate, can('case:read'), async (req, res) => {
  try {
    const identifier = req.params.id.toUpperCase();
    
    // Search by custom tracking code (e.g., MP-9021) or MongoDB _id if valid
    const query = {
      $or: [
        { code: identifier },
        ...(identifier.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: identifier }] : [])
      ]
    };

    const foundCase = await Case.findOne(query);

    if (!foundCase) {
      return res.status(404).json({ 
        success: false, 
        error: `Case with reference ${req.params.id} was not found.` 
      });
    }

    res.status(200).json({ success: true, data: foundCase });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Close case
router.patch('/:id/close', authenticate, can('case:close'), async (req, res) => {
  try {
    const identifier = req.params.id.toUpperCase();
    const updatedCase = await Case.findOneAndUpdate(
      { $or: [{ code: identifier }, { _id: identifier.match(/^[0-9a-fA-F]{24}$/) ? identifier : null }] },
      { status: 'CLOSED' },
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    res.status(200).json({ success: true, data: updatedCase });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;