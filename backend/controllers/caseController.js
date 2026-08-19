const Case = require('../models/Case');

exports.getCaseByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const foundCase = await Case.findOne({ code: code.toUpperCase() });
    
    if (!foundCase) {
      return res.status(404).json({ error: `Case with code ${code} could not be found.` });
    }
    
    res.status(200).json(foundCase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};