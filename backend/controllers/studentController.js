import Student from '../models/Student.js';
import bcrypt from 'bcryptjs';

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find({}).select('-password').populate('enrolledCourses');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student profile
// @route   GET /api/students/:id
// @access  Private
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-password').populate('enrolledCourses');
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new student (admin only typically, or signup)
// @route   POST /api/students
// @access  Private/Admin
export const createStudent = async (req, res) => {
  try {
    const { name, email, password, role, enrolledCourses } = req.body;

    const studentExists = await Student.findOne({ email });

    if (studentExists) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    const student = new Student({
      name,
      email,
      password,
      role: role || 'student',
      enrolledCourses: enrolledCourses || []
    });

    const createdStudent = await student.save();
    
    // Return without password
    const returnedStudent = await Student.findById(createdStudent._id).select('-password');
    res.status(201).json(returnedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Private
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (student) {
      student.name = req.body.name || student.name;
      student.email = req.body.email || student.email;
      if (req.body.role && req.user.role === 'admin') {
         student.role = req.body.role;
      }
      if (req.body.enrolledCourses) {
         student.enrolledCourses = req.body.enrolledCourses;
      }
      
      if (req.body.password) {
        student.password = req.body.password;
        // The pre-save hook will hash it
      }

      const updatedStudent = await student.save();
      
      const returnedStudent = await Student.findById(updatedStudent._id).select('-password').populate('enrolledCourses');
      res.json(returnedStudent);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Private/Admin
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (student) {
      await student.deleteOne();
      res.json({ message: 'Student removed' });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
