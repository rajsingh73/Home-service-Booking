const ProviderProfile = require('../models/ProviderProfile');
const User = require('../models/User');

// Virtual workers data
const virtualWorkers = {
  Plumber: [
    { name: 'Ravi Kumar', age: 32, photo: 'https://randomuser.me/api/portraits/men/32.jpg', description: 'Expert in pipe repairs and installations.' },
    { name: 'Amit Singh', age: 28, photo: 'https://randomuser.me/api/portraits/men/28.jpg', description: 'Specialist in bathroom fittings.' },
    { name: 'Suresh Yadav', age: 40, photo: 'https://randomuser.me/api/portraits/men/40.jpg', description: 'Experienced in all plumbing services.' },
    { name: 'Vikas Sharma', age: 35, photo: 'https://randomuser.me/api/portraits/men/35.jpg', description: 'Quick and reliable plumber.' },
    { name: 'Manoj Verma', age: 30, photo: 'https://randomuser.me/api/portraits/men/30.jpg', description: 'Affordable and skilled.' },
    { name: 'Deepak Joshi', age: 27, photo: 'https://randomuser.me/api/portraits/men/27.jpg', description: 'Expert in leak detection.' },
    { name: 'Rahul Chauhan', age: 29, photo: 'https://randomuser.me/api/portraits/men/29.jpg', description: 'Friendly and professional.' },
    { name: 'Sanjay Patel', age: 38, photo: 'https://randomuser.me/api/portraits/men/38.jpg', description: 'Trusted by many families.' },
  ],
  Electrician: [
    { name: 'Sunil Mehra', age: 34, photo: 'https://randomuser.me/api/portraits/men/34.jpg', description: 'Certified electrician for all needs.' },
    { name: 'Anil Gupta', age: 31, photo: 'https://randomuser.me/api/portraits/men/31.jpg', description: 'Expert in wiring and repairs.' },
    { name: 'Pankaj Saini', age: 29, photo: 'https://randomuser.me/api/portraits/men/29.jpg', description: 'Quick and safe solutions.' },
    { name: 'Ramesh Kumar', age: 36, photo: 'https://randomuser.me/api/portraits/men/36.jpg', description: 'Specialist in home automation.' },
    { name: 'Ajay Singh', age: 33, photo: 'https://randomuser.me/api/portraits/men/33.jpg', description: 'Affordable and reliable.' },
    { name: 'Vivek Jain', age: 28, photo: 'https://randomuser.me/api/portraits/men/28.jpg', description: 'Expert in electrical safety.' },
    { name: 'Sandeep Rana', age: 37, photo: 'https://randomuser.me/api/portraits/men/37.jpg', description: 'Trusted by many.' },
    { name: 'Rajesh Tiwari', age: 35, photo: 'https://randomuser.me/api/portraits/men/35.jpg', description: 'Professional and friendly.' },
  ],
  Carpenter: [
    { name: 'Mahesh Rawat', age: 41, photo: 'https://randomuser.me/api/portraits/men/41.jpg', description: 'Expert in furniture making.' },
    { name: 'Dinesh Kumar', age: 39, photo: 'https://randomuser.me/api/portraits/men/39.jpg', description: 'Specialist in woodwork.' },
    { name: 'Vinod Sharma', age: 36, photo: 'https://randomuser.me/api/portraits/men/36.jpg', description: 'Affordable and skilled.' },
    { name: 'Prakash Singh', age: 33, photo: 'https://randomuser.me/api/portraits/men/33.jpg', description: 'Quick and reliable.' },
    { name: 'Rohit Mehra', age: 29, photo: 'https://randomuser.me/api/portraits/men/29.jpg', description: 'Expert in modular kitchens.' },
    { name: 'Sanjay Kumar', age: 38, photo: 'https://randomuser.me/api/portraits/men/38.jpg', description: 'Trusted by many.' },
    { name: 'Akhil Verma', age: 32, photo: 'https://randomuser.me/api/portraits/men/32.jpg', description: 'Professional and friendly.' },
    { name: 'Gaurav Chauhan', age: 35, photo: 'https://randomuser.me/api/portraits/men/35.jpg', description: 'Expert in repairs.' },
  ],
  Cleaner: [
    { name: 'Priya Sharma', age: 27, photo: 'https://randomuser.me/api/portraits/women/27.jpg', description: 'Expert in home cleaning.' },
    { name: 'Anita Verma', age: 30, photo: 'https://randomuser.me/api/portraits/women/30.jpg', description: 'Affordable and reliable.' },
    { name: 'Kavita Singh', age: 25, photo: 'https://randomuser.me/api/portraits/women/25.jpg', description: 'Quick and efficient.' },
    { name: 'Meena Kumari', age: 32, photo: 'https://randomuser.me/api/portraits/women/32.jpg', description: 'Trusted by many.' },
    { name: 'Sunita Yadav', age: 29, photo: 'https://randomuser.me/api/portraits/women/29.jpg', description: 'Professional and friendly.' },
    { name: 'Ritu Jain', age: 28, photo: 'https://randomuser.me/api/portraits/women/28.jpg', description: 'Expert in deep cleaning.' },
    { name: 'Shalini Gupta', age: 31, photo: 'https://randomuser.me/api/portraits/women/31.jpg', description: 'Specialist in kitchen cleaning.' },
    { name: 'Neha Saini', age: 26, photo: 'https://randomuser.me/api/portraits/women/26.jpg', description: 'Affordable and skilled.' },
  ],
  Painter: [
    { name: 'Rajeev Sharma', age: 37, photo: 'https://randomuser.me/api/portraits/men/37.jpg', description: 'Expert in wall painting.' },
    { name: 'Amit Kumar', age: 34, photo: 'https://randomuser.me/api/portraits/men/34.jpg', description: 'Affordable and reliable.' },
    { name: 'Suresh Mehra', age: 40, photo: 'https://randomuser.me/api/portraits/men/40.jpg', description: 'Professional and friendly.' },
    { name: 'Vijay Singh', age: 36, photo: 'https://randomuser.me/api/portraits/men/36.jpg', description: 'Expert in texture painting.' },
    { name: 'Rakesh Yadav', age: 33, photo: 'https://randomuser.me/api/portraits/men/33.jpg', description: 'Trusted by many.' },
    { name: 'Deepak Chauhan', age: 29, photo: 'https://randomuser.me/api/portraits/men/29.jpg', description: 'Quick and efficient.' },
    { name: 'Sanjay Gupta', age: 35, photo: 'https://randomuser.me/api/portraits/men/35.jpg', description: 'Expert in home painting.' },
    { name: 'Vikas Jain', age: 32, photo: 'https://randomuser.me/api/portraits/men/32.jpg', description: 'Affordable and skilled.' },
  ],
};

const getProvidersByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    let providers = await ProviderProfile.find({ servicesOffered: category }).populate('userId', 'name email');
    // Map real providers to match virtual worker structure
    const realProviders = providers.map(p => ({
      _id: p.userId?._id, // Use userId for profile navigation
      name: p.userId?.name,
      age: 30, // Placeholder age
      photo: 'https://randomuser.me/api/portraits/men/1.jpg', // Placeholder photo
      description: p.description,
      isVirtual: false,
      rating: 4.5, // Default rating for real providers
    }));
    // Add virtual workers if less than 8
    let virtual = virtualWorkers[category] || [];
    // Add _id, isVirtual, and random rating to virtual workers
    virtual = virtual.map((v, i) => ({ ...v, _id: `virtual-${category}-${i}`, isVirtual: true, rating: (Math.random() * 1.5 + 3.5).toFixed(1) }));
    const allProviders = [...realProviders, ...virtual].slice(0, 8);
    res.json(allProviders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getProviderProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await ProviderProfile.findOne({ userId: id }).populate('userId', 'name email');
    if (!profile) return res.status(404).json({ message: 'Provider not found' });
    // Get all bookings for this provider
    const Booking = require('../models/Booking');
    const bookings = await Booking.find({ providerId: id });
    // Remove booked slots from availability
    const updatedAvailability = profile.availability.map(day => {
      const bookedSlots = bookings.filter(b => b.date === day.date).map(b => b.time);
      return {
        date: day.date,
        slots: day.slots.filter(slot => !bookedSlots.includes(slot)),
      };
    });
    const profileObj = profile.toObject();
    profileObj.availability = updatedAvailability;
    res.json(profileObj);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createOrUpdateProfile = async (req, res) => {
  try {
    const { servicesOffered, description } = req.body;
    const userId = req.user.id;
    let profile = await ProviderProfile.findOne({ userId });
    if (profile) {
      profile.servicesOffered = servicesOffered;
      profile.description = description;
      await profile.save();
    } else {
      profile = new ProviderProfile({ userId, servicesOffered, description });
      await profile.save();
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const setAvailability = async (req, res) => {
  try {
    const userId = req.user.id;
    const { availability } = req.body; // [{date, slots}]
    const profile = await ProviderProfile.findOne({ userId });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    profile.availability = availability;
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProvidersByCategory, getProviderProfile, createOrUpdateProfile, setAvailability }; 