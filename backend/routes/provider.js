const express = require('express');
const router = express.Router();
const { auth, requireRole } = require('../middleware/auth');
const {
  getProvidersByCategory,
  getProviderProfile,
  createOrUpdateProfile,
  setAvailability,
} = require('../controllers/providerController');

router.get('/', getProvidersByCategory);
router.get('/:id', getProviderProfile);
router.post('/profile', auth, requireRole('provider'), createOrUpdateProfile);
router.post('/availability', auth, requireRole('provider'), setAvailability);

module.exports = router; 