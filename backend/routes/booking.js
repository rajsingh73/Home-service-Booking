const express = require('express');
const router = express.Router();
const { auth, requireRole } = require('../middleware/auth');
const {
  createBooking,
  getUserBookings,
  getProviderBookings,
  cancelBooking,
  markBookingCompleted,
} = require('../controllers/bookingController');

router.post('/', auth, requireRole('user'), createBooking);
router.get('/user', auth, requireRole('user'), getUserBookings);
router.get('/provider', auth, requireRole('provider'), getProviderBookings);
router.delete('/:id', auth, requireRole('user'), cancelBooking);
router.patch('/:id/complete', auth, requireRole('user'), markBookingCompleted);

module.exports = router; 