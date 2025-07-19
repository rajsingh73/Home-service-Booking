const Review = require('../models/Review');
const Booking = require('../models/Booking');

const addReview = async (req, res) => {
  try {
    const { providerId, rating, comment, bookingId } = req.body;
    // Check if user has a booking with provider
    const booking = await Booking.findOne({ userId: req.user.id, providerId, _id: bookingId, status: 'booked' });
    if (!booking) return res.status(400).json({ message: 'You can only review after booking' });
    // Check if already reviewed
    const existing = await Review.findOne({ userId: req.user.id, providerId });
    if (existing) return res.status(400).json({ message: 'You have already reviewed this provider' });
    const review = new Review({ userId: req.user.id, providerId, rating, comment });
    await review.save();
    // Mark booking as completed
    booking.status = 'completed';
    await booking.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getProviderReviews = async (req, res) => {
  try {
    const { providerId } = req.params;
    const reviews = await Review.find({ providerId }).populate('userId', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addReview, getProviderReviews }; 