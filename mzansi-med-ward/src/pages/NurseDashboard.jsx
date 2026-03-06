import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePatients } from '../context/PatientContext';
import PatientCard from '../components/PatientCard';
import AdmitPatientModal from '../components/AdmitPatientModal';
import PatientChartModal from '../components/PatientChartModal';
import Footer from '../components/Footer';
import { LogOut, Plus } from 'lucide-react';

export default function NurseDashboard() {
  const { currentUser, logout } = useAuth();
  const { patients } = usePatients(); 
  const [isAdmitOpen, setIsAdmitOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null); 

  const myPatients = patients.filter(patient => patient.ward === currentUser.ward);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 relative">
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Mzansi Med-Ward</h1>
            <p className="text-gray-500">Welcome back, <span className="font-bold text-blue-600">{currentUser.name}</span></p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right border-r pr-4 border-gray-200">
              <p className="text-sm font-bold text-gray-800">Assigned Ward:</p>
              <p className="text-sm text-gray-500 uppercase tracking-wider">{currentUser.ward}</p>
            </div>
            <button onClick={logout} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition">
              <LogOut className="w-4 h-4" /> End Shift
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-700">Current Patients ({myPatients.length})</h2>
            <button 
              onClick={() => setIsAdmitOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
            >
              <Plus className="w-5 h-5" /> Admit Patient
            </button>
          </div>
          
          {myPatients.length === 0 ? (
            <div className="text-center p-10 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
              <p className="text-gray-500">No patients currently admitted.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myPatients.map(patient => (
                <PatientCard 
                  key={patient.id} 
                  patient={patient} 
                  onClick={() => setSelectedPatient(patient)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />

      {isAdmitOpen && <AdmitPatientModal onClose={() => setIsAdmitOpen(false)} />}
      
      {selectedPatient && (
        <PatientChartModal 
          patient={patients.find(p => p.id === selectedPatient.id)} 
          onClose={() => setSelectedPatient(null)} 
        />
      )}
    </div>
  );
}