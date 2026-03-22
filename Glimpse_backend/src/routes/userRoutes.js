import { Router } from 'express';
import {
  getCreatedPins,
  getSavedPins,
  getUserProfile,
  upsertUser,
} from '../controllers/userController.js';

const router = Router();

router.post('/', upsertUser);
router.get('/:googleId', getUserProfile);
router.get('/:googleId/created-pins', getCreatedPins);
router.get('/:googleId/saved-pins', getSavedPins);

export default router;
