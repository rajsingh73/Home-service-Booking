const Booking = require('../models/Booking');
const ProviderProfile = require('../models/ProviderProfile');

const createBooking = async (req, res) => {
  try {
    const { providerId, serviceType, date, time } = req.body;
    // Check if slot is available
    const profile = await ProviderProfile.findOne({ userId: providerId });
    if (!profile) return res.status(404).json({ message: 'Provider not found' });
    const day = profile.availability.find(a => a.date === date);
    if (!day || !day.slots.includes(time)) return res.status(400).json({ message: 'Slot not available' });
    // Check if already booked
    const existing = await Booking.findOne({ providerId, date, time });
    if (existing) return res.status(400).json({ message: 'Slot already booked' });
    const booking = new Booking({
      userId: req.user.id,
      providerId,
      serviceType,
      date,
      time,
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).populate('providerId', 'name');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ providerId: req.user.id }).populate('userId', 'name');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    await Booking.findByIdAndDelete(id);
    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const markBookingCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    booking.status = 'completed';
    await booking.save();
    res.json({ message: 'Booking marked as completed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createBooking, getUserBookings, getProviderBookings, cancelBooking, markBookingCompleted }; 