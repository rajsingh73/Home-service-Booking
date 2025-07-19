const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  date: { type: String, required: true },
  slots: [{ type: String, required: true }],
});

const providerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  servicesOffered: [{ type: String, required: true }],
  description: { type: String },
  availability: [availabilitySchema],
});

module.exports = mongoose.model('ProviderProfile', providerProfileSchema); 