import api from './api';

const getCourses = async () => {
  const response = await api.get('/courses');
  return response.data;
};

const getCourse = async (id) => {
  const response = await api.get(`/courses/${id}`);
  return response.data;
};

const createCourse = async (courseData) => {
  const response = await api.post('/courses', courseData);
  return response.data;
};

const updateCourse = async (id, courseData) => {
  const response = await api.put(`/courses/${id}`, courseData);
  return response.data;
};

const deleteCourse = async (id) => {
  const response = await api.delete(`/courses/${id}`);
  return response.data;
};

const courseService = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};

export default courseService;
