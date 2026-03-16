import Course from '../models/Course.js';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Admin
export const createCourse = async (req, res) => {
  try {
    const { courseName, courseCode, instructor, credits, semester } = req.body;

    const courseExists = await Course.findOne({ courseCode });

    if (courseExists) {
      return res.status(400).json({ message: 'Course already exists' });
    }

    const course = new Course({
      courseName,
      courseCode,
      instructor,
      credits,
      semester,
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
export const updateCourse = async (req, res) => {
  try {
    const { courseName, courseCode, instructor, credits, semester } = req.body;

    const course = await Course.findById(req.params.id);

    if (course) {
      course.courseName = courseName || course.courseName;
      course.courseCode = courseCode || course.courseCode;
      course.instructor = instructor || course.instructor;
      course.credits = credits || course.credits;
      course.semester = semester || course.semester;

      const updatedCourse = await course.save();
      res.json(updatedCourse);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      await course.deleteOne();
      res.json({ message: 'Course removed' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
