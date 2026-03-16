import express from 'express';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../controllers/courseController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getCourses)
  .post(protect, admin, createCourse);

router.route('/:id')
  .put(protect, admin, updateCourse)
  .delete(protect, admin, deleteCourse);

export default router;
