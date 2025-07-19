const express = require('express');
const router = express.Router();
const { auth, requireRole } = require('../middleware/auth');
const { addReview, getProviderReviews } = require('../controllers/reviewController');

router.post('/', auth, requireRole('user'), addReview);
router.get('/:providerId', getProviderReviews);

module.exports = router; 