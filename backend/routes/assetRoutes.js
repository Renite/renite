import express from 'express';
import Asset from '../models/Asset.js';

const router = express.Router();

// Get all assets
router.get('/', async (req, res) => {
  try {
    const assets = await Asset.find().sort({ created_at: -1 });
    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register a new asset
router.post('/', async (req, res) => {
  try {
    const newAsset = new Asset(req.body);
    const savedAsset = await newAsset.save();
    res.status(201).json(savedAsset);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update asset status (e.g., Report Lost / Recovered)
router.put('/:id', async (req, res) => {
  try {
    const updatedAsset = await Asset.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!updatedAsset) return res.status(404).json({ error: 'Asset not found' });
    res.json(updatedAsset);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;