import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/schema.js';

const jwtSecret = process.env.JWT_SECRET;

// Register user
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    console.log('Registration Payload: ', { name, email, password });

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).send('User already exists');
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({ name, email, password: hashedPassword });
    const savedUser = await newUser.save();

    if (!jwtSecret) {
      throw new Error('Token is not defined');
    }

    // Generate token
    const token = jwt.sign(
      { userId: savedUser._id, email: savedUser.email },
      jwtSecret,
      {
        expiresIn: '2h',
      }
    );

    // Return token
    res.status(201).json({ message: 'User is registered successfully', token });
  } catch (error) {
    res.status(500).send(`Error in registerUser: ${(error as Error).message}`);
  }
};

// User login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    console.log('Login Payload: ', { email, password });

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).send('Unknown credentials');
      return;
    }

    // Comparing the password
    const isMatch = user.password
      ? await bcrypt.compare(password, user.password)
      : false;
    if (!isMatch) {
      res.status(400).send('Unknown credentials');
      return;
    }

    if (!jwtSecret) {
      throw new Error('Token is not defined');
    }

    // generate token
    const token = jwt.sign({ userId: user._id, email: user.email }, jwtSecret, {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).send(`Error in loginUser: ${(error as Error).message}`);
  }
};
