import fs from 'fs/promises';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { Pin } from '../models/Pin.js';
import { User } from '../models/User.js';
import { serializePin } from '../utils/serializers.js';

const pinPopulation = [
  { path: 'postedBy' },
  { path: 'saves' },
  { path: 'comments.postedBy' },
];

const uploadsDir = path.resolve('uploads');
const buildImageUrl = (req, fileName) => `${req.protocol}://${req.get('host')}/uploads/${fileName}`;
const isGuestUser = (user) => user?.googleId?.startsWith('guest-');
const hasCloudinaryConfig = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );

const getSafeFileName = (originalName) => originalName.replace(/\s+/g, '-').toLowerCase();

const uploadToCloudinary = (fileBuffer, originalName) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: process.env.CLOUDINARY_FOLDER || 'glimpse',
        resource_type: 'image',
        public_id: `${Date.now()}-${getSafeFileName(originalName).replace(/\.[^.]+$/, '')}`,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result.secure_url);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

const saveImageLocally = async (req, file) => {
  await fs.mkdir(uploadsDir, { recursive: true });
  const fileName = `${Date.now()}-${getSafeFileName(file.originalname)}`;
  await fs.writeFile(path.join(uploadsDir, fileName), file.buffer);
  return buildImageUrl(req, fileName);
};

const resolveImageUrl = async (req, file) => {
  if (hasCloudinaryConfig()) {
    return uploadToCloudinary(file.buffer, file.originalname);
  }

  return saveImageLocally(req, file);
};

export const getPins = async (req, res) => {
  const { category, search } = req.query;
  const filter = {};

  if (category) {
    filter.category = category.toLowerCase();
  }

  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [{ title: regex }, { about: regex }, { category: regex }];
  }

  const pins = await Pin.find(filter)
    .populate(pinPopulation)
    .sort({ createdAt: -1 });

  res.json(pins.map(serializePin));
};

export const getPinById = async (req, res) => {
  const pin = await Pin.findById(req.params.pinId).populate(pinPopulation);

  if (!pin) {
    res.status(404).json({ message: 'Pin not found' });
    return;
  }

  const relatedPins = await Pin.find({
    _id: { $ne: pin._id },
    category: pin.category,
  })
    .populate(pinPopulation)
    .sort({ createdAt: -1 })
    .limit(20);

  res.json({
    pin: serializePin(pin),
    relatedPins: relatedPins.map(serializePin),
  });
};

export const createPin = async (req, res) => {
  const { title, about, destination, category, userId } = req.body;

  if (!title || !about || !destination || !category || !userId) {
    res.status(400).json({ message: 'title, about, destination, category, and userId are required' });
    return;
  }

  if (!req.file) {
    res.status(400).json({ message: 'Image upload is required' });
    return;
  }

  const user = await User.findOne({ googleId: userId });

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  if (isGuestUser(user)) {
    res.status(403).json({ message: 'Guests cannot create pins' });
    return;
  }

  const imageUrl = await resolveImageUrl(req, req.file);

  const pin = await Pin.create({
    title,
    about,
    destination,
    category: category.toLowerCase(),
    imageUrl,
    postedBy: user._id,
  });

  const createdPin = await Pin.findById(pin._id).populate(pinPopulation);
  res.status(201).json(serializePin(createdPin));
};

export const savePin = async (req, res) => {
  const { userId } = req.body;
  const user = await User.findOne({ googleId: userId });

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  if (isGuestUser(user)) {
    res.status(403).json({ message: 'Guests cannot save pins' });
    return;
  }

  const pin = await Pin.findById(req.params.pinId);

  if (!pin) {
    res.status(404).json({ message: 'Pin not found' });
    return;
  }

  if (!pin.saves.some((savedId) => savedId.equals(user._id))) {
    pin.saves.push(user._id);
    await pin.save();
  }

  const updatedPin = await Pin.findById(pin._id).populate(pinPopulation);
  res.json(serializePin(updatedPin));
};

export const deletePin = async (req, res) => {
  const { userId } = req.query;
  const user = await User.findOne({ googleId: userId });

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  if (isGuestUser(user)) {
    res.status(403).json({ message: 'Guests cannot delete pins' });
    return;
  }

  const pin = await Pin.findById(req.params.pinId).populate('postedBy');

  if (!pin) {
    res.status(404).json({ message: 'Pin not found' });
    return;
  }

  if (!pin.postedBy._id.equals(user._id)) {
    res.status(403).json({ message: 'You can only delete your own pins' });
    return;
  }

  await Pin.findByIdAndDelete(pin._id);
  res.status(204).send();
};

export const addComment = async (req, res) => {
  const { userId, comment } = req.body;

  if (!comment?.trim()) {
    res.status(400).json({ message: 'Comment is required' });
    return;
  }

  const user = await User.findOne({ googleId: userId });

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  if (isGuestUser(user)) {
    res.status(403).json({ message: 'Guests cannot comment on pins' });
    return;
  }

  const pin = await Pin.findById(req.params.pinId);

  if (!pin) {
    res.status(404).json({ message: 'Pin not found' });
    return;
  }

  pin.comments.push({
    comment: comment.trim(),
    postedBy: user._id,
  });

  await pin.save();

  const updatedPin = await Pin.findById(pin._id).populate(pinPopulation);
  res.status(201).json(serializePin(updatedPin));
};

export const deleteComment = async (req, res) => {
  const { userId } = req.query;
  const user = await User.findOne({ googleId: userId });

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  if (isGuestUser(user)) {
    res.status(403).json({ message: 'Guests cannot delete comments' });
    return;
  }

  const pin = await Pin.findById(req.params.pinId);

  if (!pin) {
    res.status(404).json({ message: 'Pin not found' });
    return;
  }

  const comment = pin.comments.id(req.params.commentId);

  if (!comment) {
    res.status(404).json({ message: 'Comment not found' });
    return;
  }

  if (!comment.postedBy.equals(user._id)) {
    res.status(403).json({ message: 'You can only delete your own comments' });
    return;
  }

  pin.comments.pull({ _id: comment._id });
  await pin.save();

  const updatedPin = await Pin.findById(pin._id).populate(pinPopulation);
  res.json(serializePin(updatedPin));
};
