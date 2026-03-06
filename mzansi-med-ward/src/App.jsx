import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import NurseDashboard from './pages/NurseDashboard';
import DoctorDashboard from './pages/DoctorDashboard';

export default function App() {
  const { currentUser } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Routes>
          <Route path="/" element={<Login />} />
          
          <Route 
            path="/doctor-dashboard" 
            element={currentUser?.role === 'Doctor' ? <DoctorDashboard /> : <Navigate to="/" />} 
          />
          
          <Route 
            path="/nurse-dashboard" 
            element={currentUser && currentUser.role !== 'Doctor' ? <NurseDashboard /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}