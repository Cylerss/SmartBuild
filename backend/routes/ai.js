const express = require('express');
const router = express.Router();
const { generatePlan } = require('../controllers/aiController');

// POST /api/ai - Generate AI construction plan
router.post('/', async (req, res) => {
  try {
    const { plotSize, budget, location, floors, direction, type, familySize, climate, notes, tab } = req.body;

    // Validate required fields
    if (!plotSize || !budget || !location || !floors || !type) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['plotSize', 'budget', 'location', 'floors', 'type']
      });
    }

    if (!tab) {
      return res.status(400).json({ error: 'Tab parameter is required' });
    }

    const validTabs = ['summary', 'cost', 'interior', 'vastu', 'timeline'];
    if (!validTabs.includes(tab)) {
      return res.status(400).json({ error: `Invalid tab. Must be one of: ${validTabs.join(', ')}` });
    }

    const result = await generatePlan(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('AI Route Error:', error.message);
    res.status(error.status || 500).json({ 
      error: 'Failed to generate plan',
      message: error.message 
    });
  }
});

module.exports = router;
