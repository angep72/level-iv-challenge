import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { validateRegister, validateLogin } from '../middleware/validation';

const router = Router();

/**
 * @route   POST /auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRegister, register);

/**
 * @route   POST /auth/login
 * @desc    Login user and get JWT token
 * @access  Public
 */
router.post('/login', validateLogin, login);

export default router;