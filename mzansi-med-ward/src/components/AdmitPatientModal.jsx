import { useState } from 'react';
import { usePatients } from '../context/PatientContext';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';

export default function AdmitPatientModal({ onClose }) {
  const { admitPatient } = usePatients();
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    bed: '',
    hr: '',
    bpSystolic: '',
    bpDiastolic: '',
    spo2: ''
  });

  const calculateStatus = (hr, sysBp, spo2) => {
    if (hr > 120 || sysBp > 160 || spo2 < 92) return 'Red';
    if (hr > 100 || sysBp > 140 || spo2 < 95) return 'Orange';
    return 'Green';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const status = calculateStatus(
      Number(formData.hr), 
      Number(formData.bpSystolic), 
      Number(formData.spo2)
    );

    const newPatient = {
      id: `p-${Date.now()}`, 
      name: formData.name,
      ward: currentUser.ward, 
      bed: formData.bed,
      vitals: { 
        hr: formData.hr, 
        bp: `${formData.bpSystolic}/${formData.bpDiastolic}`, 
        spo2: formData.spo2 
      },
      status: status
    };

    admitPatient(newPatient);
    onClose(); 
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b bg-blue-50">
          <h3 className="font-bold text-lg text-blue-900">Admit New Patient</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500"><X /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Patient Name</label>
              <input required type="text" className="w-full border p-2 rounded mt-1" onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bed Number</label>
              <input required type="number" className="w-full border p-2 rounded mt-1" onChange={e => setFormData({...formData, bed: e.target.value})} />
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Initial Vitals</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-600">Heart Rate</label>
                <input required type="number" placeholder="bpm" className="w-full border p-2 rounded mt-1" onChange={e => setFormData({...formData, hr: e.target.value})} />
              </div>
              <div className="col-span-2 flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs text-gray-600">Systolic BP</label>
                  <input required type="number" placeholder="120" className="w-full border p-2 rounded mt-1" onChange={e => setFormData({...formData, bpSystolic: e.target.value})} />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-600">Diastolic BP</label>
                  <input required type="number" placeholder="80" className="w-full border p-2 rounded mt-1" onChange={e => setFormData({...formData, bpDiastolic: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600">SpO2 %</label>
                <input required type="number" placeholder="%" className="w-full border p-2 rounded mt-1" onChange={e => setFormData({...formData, spo2: e.target.value})} />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 mt-2">
            Admit to {currentUser.ward} Ward
          </button>
        </form>
      </div>
    </div>
  );
}