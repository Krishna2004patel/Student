import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { BookOpen, Plus, Trash2, Edit } from 'lucide-react';
import courseService from '../services/course.service';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  
  const [formData, setFormData] = useState({
    courseName: '',
    courseCode: '',
    instructor: '',
    credits: '',
    semester: ''
  });

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getCourses();
      setCourses(data);
    } catch (error) {
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openModal = (course = null) => {
    if (course) {
      setCurrentCourse(course);
      setFormData({
        courseName: course.courseName,
        courseCode: course.courseCode,
        instructor: course.instructor,
        credits: course.credits,
        semester: course.semester
      });
    } else {
      setCurrentCourse(null);
      setFormData({
        courseName: '', courseCode: '', instructor: '', credits: '', semester: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCourse(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentCourse) {
        await courseService.updateCourse(currentCourse._id, formData);
        toast.success('Course updated successfully');
      } else {
        await courseService.createCourse(formData);
        toast.success('Course created successfully');
      }
      closeModal();
      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save course');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseService.deleteCourse(id);
        toast.success('Course deleted successfully');
        fetchCourses();
      } catch (error) {
        toast.error('Failed to delete course');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-500 text-sm mt-1">Create, update, and manage the curriculum.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Course
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 rounded-lg text-blue-600">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{course.courseName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.courseCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.instructor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.credits}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {course.semester}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openModal(course)} className="text-blue-600 hover:text-blue-900 mr-4">
                      <Edit className="w-4 h-4 inline" />
                    </button>
                    <button onClick={() => handleDelete(course._id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No courses found. Add your first course!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">
              {currentCourse ? 'Edit Course' : 'Create New Course'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                <input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" value={formData.courseName} onChange={(e) => setFormData({...formData, courseName: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                  <input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" value={formData.courseCode} onChange={(e) => setFormData({...formData, courseCode: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
                  <input required type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" value={formData.credits} onChange={(e) => setFormData({...formData, credits: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
                <input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" value={formData.instructor} onChange={(e) => setFormData({...formData, instructor: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                <input required type="text" placeholder="e.g. Fall 2024" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" value={formData.semester} onChange={(e) => setFormData({...formData, semester: e.target.value})} />
              </div>
              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition">
                  {currentCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
