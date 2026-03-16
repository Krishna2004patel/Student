import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const studentExists = await Student.findOne({ email });
    if (studentExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const student = await Student.create({
      name,
      email,
      password,
      role: role || 'student'
    });

    if (student) {
      res.status(201).json({
        _id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
        token: generateToken(student._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check for user
    const student = await Student.findOne({ email });

    if (student && (await student.comparePassword(password))) {
      res.json({
        _id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
        token: generateToken(student._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
