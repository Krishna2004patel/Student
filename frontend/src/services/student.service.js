import api from './api';

const getStudents = async () => {
  const response = await api.get('/students');
  return response.data;
};

const getStudent = async (id) => {
  const response = await api.get(`/students/${id}`);
  return response.data;
};

const updateStudent = async (id, studentData) => {
  const response = await api.put(`/students/${id}`, studentData);
  return response.data;
};

const studentService = {
  getStudents,
  getStudent,
  updateStudent,
};

export default studentService;
