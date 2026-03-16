import { Link } from 'react-router-dom';
import { BookOpen, Users, ShieldCheck, GraduationCap } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900 tracking-tight">EduPortal</span>
        </div>
        <div className="space-x-4">
          <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">Log in</Link>
          <Link to="/signup" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition">
            Sign up free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight">
          Manage your courses <br className="hidden md:block"/>
          <span className="text-blue-600">beautifully.</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          The all-in-one portal for students and administrators to manage curriculum, enrollments, and academic progress seamlessly.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/signup" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 hover:shadow-lg transition-all transform hover:-translate-y-1">
            Get Started Now
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <GraduationCap className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Student Dashboard</h3>
              <p className="text-gray-500">View enrolled courses and explore new curriculum opportunities all in one place.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Admin Controls</h3>
              <p className="text-gray-500">Powerful administrative features to create, update, and manage global course catalogs.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">User Management</h3>
              <p className="text-gray-500">Easily manage student accounts and assign courses directly to enrolled participants.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
