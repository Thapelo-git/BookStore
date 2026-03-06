import express from "express";
import {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} from '../controllers/addressController';

import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/', auth, getAddresses);
router.post('/', auth, createAddress);
router.put('/:id', auth, updateAddress);
router.delete('/:id', auth, deleteAddress);

export default router;

