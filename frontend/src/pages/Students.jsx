import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Link2 } from 'lucide-react';
import studentService from '../services/student.service';
import courseService from '../services/course.service';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsData, coursesData] = await Promise.all([
        studentService.getStudents(),
        courseService.getCourses()
      ]);
      // filter out admins from view
      setStudents(studentsData.filter(s => s.role === 'student'));
      setCourses(coursesData);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAssignModal = (student) => {
    setSelectedStudent(student);
    setSelectedCourseId('');
    setIsModalOpen(true);
  };

  const handleAssignCourse = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) return toast.error('Please select a course');
    
    // Check if implicitly already enrolled
    const isEnrolled = selectedStudent.enrolledCourses.some(c => c._id === selectedCourseId);
    if (isEnrolled) {
      return toast.error('Student is already enrolled in this course');
    }

    try {
      const updatedCourses = [...selectedStudent.enrolledCourses.map(c => c._id), selectedCourseId];
      await studentService.updateStudent(selectedStudent._id, { enrolledCourses: updatedCourses });
      toast.success('Course assigned successfully');
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to assign course');
    }
  };

  const handleRemoveCourse = async (studentId, courseId, currentEnrolled) => {
    if(window.confirm('Remove this course from student?')){
      try {
        const updatedCourses = currentEnrolled.filter(c => c._id !== courseId).map(c => c._id);
        await studentService.updateStudent(studentId, { enrolledCourses: updatedCourses });
        toast.success('Course removed from student');
        fetchData();
      } catch (error) {
        toast.error('Failed to remove course');
      }
    }
  }

  if (loading) {
    return <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Directory</h1>
        <p className="text-gray-500 text-sm mt-1">Manage global student accounts and their enrollments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {students.map((student) => (
          <div key={student._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl uppercase ring-2 ring-white">
                  {student.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </div>
              </div>
              <button
                onClick={() => openAssignModal(student)}
                className="text-sm bg-gray-50 text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 transition font-medium flex items-center"
              >
                <Link2 className="w-4 h-4 mr-1.5" /> Assign Course
              </button>
            </div>
            
            <div className="mt-auto">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 border-t pt-4">Enrolled Courses ({student.enrolledCourses?.length || 0})</h4>
              {student.enrolledCourses?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {student.enrolledCourses.map(course => (
                    <span 
                      key={course._id} 
                      className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                    >
                      {course.courseCode}
                      <button 
                        onClick={() => handleRemoveCourse(student._id, course._id, student.enrolledCourses)}
                        className="ml-1.5 text-blue-400 hover:text-red-500 font-bold"
                      >×</button>
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-gray-400 italic">No courses assigned yet.</span>
              )}
            </div>
          </div>
        ))}
        {students.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500">No students registered yet.</p>
          </div>
        )}
      </div>

      {/* Assign Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">
              Assign Course to {selectedStudent?.name}
            </h3>
            
            <form onSubmit={handleAssignCourse}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  required
                >
                  <option value="" disabled>-- Choose a course --</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.courseCode} - {course.courseName}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition">
                  Assign Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
