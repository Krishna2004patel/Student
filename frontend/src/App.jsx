import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Students from './pages/Students';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes directly mapped under Layout */}
        <Route 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Admin only routes */}
          <Route 
            path="/courses" 
            element={
              <ProtectedRoute adminOnly={true}>
                <Courses />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/students" 
            element={
              <ProtectedRoute adminOnly={true}>
                <Students />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
