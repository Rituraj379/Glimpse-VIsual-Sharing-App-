import { Router } from 'express';
import {
  addComment,
  createPin,
  deleteComment,
  deletePin,
  getPinById,
  getPins,
  savePin,
} from '../controllers/pinController.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/', getPins);
router.get('/:pinId', getPinById);
router.post('/', upload.single('image'), createPin);
router.patch('/:pinId/save', savePin);
router.delete('/:pinId', deletePin);
router.post('/:pinId/comments', addComment);
router.delete('/:pinId/comments/:commentId', deleteComment);

export default router;
