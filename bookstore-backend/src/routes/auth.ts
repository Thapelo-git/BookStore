import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,logout,forgotPassword,
  resetPassword
} from '../controllers/authController';
import { auth, createSession, removeSession  } from '../middleware/auth';
import {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  changePasswordValidation,forgotPasswordValidation,
  resetPasswordValidation
} from '../middleware/authValidation';
import { handleValidationErrors } from '../middleware/validationHandler';

const router = express.Router();


router.post('/register', registerValidation, handleValidationErrors, register);


router.post('/login', loginValidation, handleValidationErrors, login);


router.get('/me', auth, getMe);


router.put('/profile', auth, updateProfileValidation, handleValidationErrors, updateProfile);


router.put('/change-password', auth, changePasswordValidation, handleValidationErrors, changePassword);
router.post('/logout', auth, logout);

router.post('/forgot-password', forgotPasswordValidation, handleValidationErrors, forgotPassword);
router.post('/reset-password', resetPasswordValidation, handleValidationErrors, resetPassword);

export default router;