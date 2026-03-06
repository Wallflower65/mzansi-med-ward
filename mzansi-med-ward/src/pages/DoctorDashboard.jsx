import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePatients } from '../context/PatientContext'; 
import PatientCard from '../components/PatientCard';
import PatientChartModal from '../components/PatientChartModal';
import Footer from '../components/Footer';
import { LogOut, ActivitySquare } from 'lucide-react';

export default function DoctorDashboard() {
  const { currentUser, logout } = useAuth();
  const { patients } = usePatients(); 
  const [selectedPatient, setSelectedPatient] = useState(null);

  const medicalPatients = patients.filter(p => p.ward === 'Medical');
  const surgicalPatients = patients.filter(p => p.ward === 'Surgical');
  const ecPatients = patients.filter(p => p.ward === 'EC');

  const renderWardSection = (title, wardPatients) => (
    <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-xl font-bold text-gray-800">{title} Ward</h2>
        <span className="text-sm font-semibold px-3 py-1 bg-gray-100 rounded-full text-gray-600">
          {wardPatients.length} Patients
        </span>
      </div>
      
      {wardPatients.length === 0 ? (
        <p className="text-gray-500 italic">No patients currently admitted.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wardPatients.map(patient => (
            <PatientCard 
              key={patient.id} 
              patient={patient} 
              onClick={() => setSelectedPatient(patient)}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 relative">
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center mb-8 bg-blue-900 text-white p-5 rounded-xl shadow-md">
          <div className="flex items-center gap-3">
            <ActivitySquare className="w-8 h-8 text-blue-300" />
            <div>
              <h1 className="text-2xl font-bold">Hospital Overview (On-Call)</h1>
              <p className="text-blue-200 text-sm">
                Dr. {currentUser.name} • All Wards Active
              </p>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-blue-800 hover:bg-red-600 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            End Shift
          </button>
        </div>

        <div className="max-w-7xl mx-auto">
          {renderWardSection("Emergency Centre (EC)", ecPatients)}
          {renderWardSection("Medical", medicalPatients)}
          {renderWardSection("Surgical", surgicalPatients)}
        </div>
      </div>

      <Footer />

      {selectedPatient && (
        <PatientChartModal 
          patient={patients.find(p => p.id === selectedPatient.id)} 
          onClose={() => setSelectedPatient(null)} 
        />
      )}
    </div>
  );
}