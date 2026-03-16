import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
  },
  courseCode: {
    type: String,
    required: true,
    unique: true,
  },
  instructor: {
    type: String,
    required: true,
  },
  credits: {
    type: Number,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  }
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
