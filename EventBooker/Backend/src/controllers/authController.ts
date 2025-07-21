import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ApiResponse } from '../types';
import { User } from '../model/index'

dotenv.config();

// JWT config
const jwtSecret: string = process.env.JWT_SECRET ?? '';
const jwtExpiresIn: string = process.env.JWT_EXPIRES_IN ?? '1h';

if (!jwtSecret) {
  throw new Error('JWT_SECRET environment variable is not defined.');
}

interface JwtPayload {
  userId: string;
  email: string;
  role: 'customer' | 'admin';
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, role = 'customer' } = req.body;

    const existingUser = await User.findOne({ email }).select('_id');
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'User already exists'
      } as ApiResponse);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      role
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
      { userId: savedUser._id, email: savedUser.email, role: savedUser.role } as JwtPayload,
      jwtSecret,
      { expiresIn: jwtExpiresIn } as jwt.SignOptions
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: savedUser._id,
          email: savedUser.email,
          name: savedUser.name,
          role: savedUser.role
        },
        token
      }
    } as ApiResponse);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      } as ApiResponse);
      return;
    }

    // ✅ Compare password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      } as ApiResponse);
      return;
    }

    // ✅ Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role } as JwtPayload,
      jwtSecret,
      { expiresIn: jwtExpiresIn } as jwt.SignOptions
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      }
    } as ApiResponse);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};
