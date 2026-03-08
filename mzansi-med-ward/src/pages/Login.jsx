import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    const success = login(username.toLowerCase());
    
    if (success) {
      import('../data/mockDatabase').then(({ users }) => {
        const loggedInUser = users.find(u => u.username === username.toLowerCase());
        
        if (loggedInUser.role === 'Doctor') {
          navigate('/doctor-dashboard');
        } else {
          navigate('/nurse-dashboard');
        }
      });
    } else {
      setError('Staff ID not found. Try "dr.smith" or "sr.khumalo"');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border-t-4 border-blue-600">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Mzansi Med-Ward</h2>
        <p className="text-gray-500 mb-6">Enter your Staff ID to access your shift dashboard.</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Staff ID / Username
            </label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. sr.khumalo"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-200"
          >
            Start Shift
          </button>
        </form>

        <div className="mt-8 bg-blue-50 p-5 rounded-xl border border-blue-100 text-sm text-blue-900 shadow-sm">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            👋 Try the Live Demo
          </h3>
          <p className="mb-3 opacity-80 text-xs">
            Enter one of the usernames below to explore different role-based views. (No password required).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="bg-white p-2 rounded border border-blue-50">
              <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Doctor</span>
              <code className="font-mono font-bold text-blue-700">dr.smith</code>
            </div>
            <div className="bg-white p-2 rounded border border-blue-50">
              <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Ward Sister (PN)</span>
              <code className="font-mono font-bold text-blue-700">sr.khumalo</code>
            </div>
            <div className="bg-white p-2 rounded border border-blue-50">
              <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Enrolled Nurse</span>
              <code className="font-mono font-bold text-blue-700">en.naidoo</code>
            </div>
            <div className="bg-white p-2 rounded border border-blue-50">
              <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Nursing Aux (ENA)</span>
              <code className="font-mono font-bold text-blue-700">ena.peters</code>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}