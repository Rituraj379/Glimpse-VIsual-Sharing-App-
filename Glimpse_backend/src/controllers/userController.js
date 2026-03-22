import { Pin } from '../models/Pin.js';
import { User } from '../models/User.js';
import { serializePin, serializeUser } from '../utils/serializers.js';

export const upsertUser = async (req, res) => {
  const { googleId, userName, image } = req.body;

  if (!googleId || !userName || !image) {
    res.status(400).json({ message: 'googleId, userName, and image are required' });
    return;
  }

  const user = await User.findOneAndUpdate(
    { googleId },
    { googleId, userName, image },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  res.status(200).json(serializeUser(user));
};

export const getUserProfile = async (req, res) => {
  const user = await User.findOne({ googleId: req.params.googleId });

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  res.json(serializeUser(user));
};

export const getCreatedPins = async (req, res) => {
  const user = await User.findOne({ googleId: req.params.googleId });

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const pins = await Pin.find({ postedBy: user._id })
    .populate('postedBy')
    .populate('saves')
    .sort({ createdAt: -1 });

  res.json(pins.map(serializePin));
};

export const getSavedPins = async (req, res) => {
  const user = await User.findOne({ googleId: req.params.googleId });

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const pins = await Pin.find({ saves: user._id })
    .populate('postedBy')
    .populate('saves')
    .sort({ createdAt: -1 });

  res.json(pins.map(serializePin));
};
