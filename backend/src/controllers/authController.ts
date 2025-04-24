
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import { config } from '../config';
import userModel, { userSchema, loginSchema } from '../models/user';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, name, role = 'user' } = req.body;
    
    // Check if user already exists
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      throw ApiError.conflict('Email already in use');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user in database
    const newUser = await userModel.create({
      email,
      name,
      password: hashedPassword,
      role,
    });
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;
    
    // Send response
    ApiResponse.created(res, userWithoutPassword, 'User registered successfully');
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await userModel.findByEmail(email);
    if (!user) {
      throw ApiError.unauthorized('Invalid credentials');
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid credentials');
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        role: user.role 
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    // Generate refresh token
    const refreshToken = jwt.sign(
      { id: user.id },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn }
    );
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    // Send response
    ApiResponse.success(res, {
      user: userWithoutPassword,
      token,
      refreshToken,
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      throw ApiError.badRequest('Refresh token is required');
    }
    
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as { id: number };
      
      // Find user
      const user = await userModel.findById(decoded.id);
      if (!user) {
        throw ApiError.unauthorized('Invalid refresh token');
      }
      
      // Generate new tokens
      const newToken = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          role: user.role 
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );
      
      const newRefreshToken = jwt.sign(
        { id: user.id },
        config.jwt.refreshSecret,
        { expiresIn: config.jwt.refreshExpiresIn }
      );
      
      // Send response
      ApiResponse.success(res, {
        token: newToken,
        refreshToken: newRefreshToken,
      }, 'Token refreshed successfully');
    } catch (error) {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }
  } catch (error) {
    next(error);
  }
};
