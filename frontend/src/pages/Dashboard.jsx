import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { BookOpen, GraduationCap, CheckCircle } from 'lucide-react';
import authService from '../services/auth.service';
import courseService from '../services/course.service';
import studentService from '../services/student.service';

const Dashboard = () => {
  const [currentUserData, setCurrentUserData] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const user = authService.getCurrentUser();

  const fetchData = async () => {
    try {
      setLoading(true);
      const studentData = await studentService.getStudent(user._id);
      setCurrentUserData(studentData);
      
      const coursesData = await courseService.getCourses();
      setAllCourses(coursesData);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      if(!currentUserData) return;
      const enrolledIds = currentUserData.enrolledCourses.map(c => c._id);
      if(enrolledIds.includes(courseId)) {
        return toast.error('Already enrolled in this course');
      }
      
      const updatedCourses = [...enrolledIds, courseId];
      await studentService.updateStudent(user._id, { enrolledCourses: updatedCourses });
      toast.success('Successfully enrolled!');
      fetchData(); // Refresh data
    } catch (error) {
      toast.error('Failed to enroll');
    }
  };

  const handleDrop = async (courseId) => {
    if(window.confirm('Are you sure you want to drop this course?')) {
      try {
        const enrolledIds = currentUserData.enrolledCourses.filter(c => c._id !== courseId).map(c => c._id);
        await studentService.updateStudent(user._id, { enrolledCourses: enrolledIds });
        toast.success('Course dropped');
        fetchData();
      } catch(error) {
        toast.error('Failed to drop course');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  // Admin and student see slightly different generalized dashboards
  // For students they see their enrolled courses + available courses
  // For admins they see a simple summary since they have the "Manage Courses/Students" pages.

  if (user.role === 'admin') {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 bg-blue-50 w-24 h-24 rounded-full group-hover:scale-150 transition-transform duration-500 ease-in-out opacity-50 z-0"></div>
              <div className="relative z-10">
                 <h2 className="text-lg font-semibold text-gray-900 mb-2">Total Courses Platform-wide</h2>
                 <p className="text-4xl font-bold text-blue-600">{allCourses.length}</p>
                 <p className="text-sm text-gray-500 mt-4">Manage this in the "Manage Courses" tab.</p>
              </div>
            </div>
         </div>
      </div>
    );
  }

  const enrolledCourseIds = currentUserData?.enrolledCourses?.map(c => c._id) || [];
  const availableCourses = allCourses.filter(c => !enrolledCourseIds.includes(c._id));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your active courses and find new ones to enroll in.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
             <GraduationCap className="absolute right-[-1rem] bottom-[-1rem] w-32 h-32 text-white/10" />
             <div className="relative z-10">
               <h3 className="text-blue-100 font-medium tracking-wide">Total Enrolled Credits</h3>
               <p className="text-5xl font-bold mt-2">
                 {currentUserData?.enrolledCourses?.reduce((acc, curr) => acc + curr.credits, 0) || 0}
               </p>
               <p className="text-blue-100 text-sm mt-4">Across {currentUserData?.enrolledCourses?.length || 0} active courses</p>
             </div>
        </div>
      </div>

      {/* Enrolled Courses */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Current Enrollments
        </h2>
        {currentUserData?.enrolledCourses?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentUserData.enrolledCourses.map(course => (
              <div key={course._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {course.courseCode}
                    </span>
                    <span className="text-sm font-medium text-gray-500">{course.credits} Credits</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{course.courseName}</h3>
                  <p className="text-sm text-gray-600 flex items-center mb-4">
                    <BookOpen className="w-4 h-4 mr-1.5" /> Instructor: {course.instructor}
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">
                      {course.semester}
                    </span>
                    <button 
                      onClick={() => handleDrop(course._id)}
                      className="text-sm font-medium text-red-600 hover:text-red-700 transition"
                    >
                      Drop Course
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
            You are not enrolled in any courses yet. Look below to find available courses!
          </div>
        )}
      </div>

      {/* Available Courses */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 pt-4 border-t border-gray-200">
          Available Courses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableCourses.map((course) => (
             <div key={course._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:border-blue-300 transition group">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition">{course.courseName}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{course.courseCode} • {course.credits} Credits • {course.semester}</p>
                  
                  <button 
                    onClick={() => handleEnroll(course._id)}
                    className="w-full bg-blue-50 text-blue-700 font-medium py-2 rounded-lg hover:bg-blue-600 hover:text-white transition"
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
          ))}
          {availableCourses.length === 0 && (
            <div className="col-span-full bg-gray-50 rounded-xl border border-gray-200 p-8 text-center text-gray-500">
              No new courses available to enroll in.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
