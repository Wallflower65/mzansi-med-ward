import { useState } from 'react';
import { usePatients } from '../context/PatientContext';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';

export default function AdmitPatientModal({ onClose }) {
  const { admitPatient } = usePatients();
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: 'M',
    diagnosis: '',
    allergies: '',
    bed: '',
    hr: '',
    bpSystolic: '',
    bpDiastolic: '',
    spo2: ''
  });

  const calculateAge = (dobString) => {
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const calculateEC_TEWS = (hr, sysBp, spo2) => {
    let score = 0;

    if (hr > 120 || hr < 40) score += 3;
    else if (hr >= 111) score += 2;
    else if (hr >= 101 || hr <= 50) score += 1;

    if (sysBp < 90 || sysBp >= 220) score += 3;
    else if (sysBp <= 100) score += 2;
    else if (sysBp <= 110) score += 1;

    if (spo2 < 92) score += 3;
    else if (spo2 <= 94) score += 2;

    if (score >= 6) return 'Red';
    if (score >= 3) return 'Orange';
    if (score >= 1) return 'Yellow';
    return 'Green';
  };

  const calculateWardEWS = (hr, sysBp, spo2) => {
    if (hr > 130 || hr < 40 || sysBp < 90 || spo2 < 90) return 'Red';
    if (hr > 110 || sysBp > 160 || sysBp < 100 || spo2 < 94) return 'Orange';
    return 'Green';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const numHr = Number(formData.hr);
    const numSysBp = Number(formData.bpSystolic);
    const numSpo2 = Number(formData.spo2);
    
    const status = currentUser.ward === 'EC' 
      ? calculateEC_TEWS(numHr, numSysBp, numSpo2)
      : calculateWardEWS(numHr, numSysBp, numSpo2);

    const calculatedAge = calculateAge(formData.dob);

    const newPatient = {
      id: `p-${Date.now()}`,
      name: formData.name,
      dob: formData.dob,
      age: calculatedAge,
      gender: formData.gender,
      ward: currentUser.ward,
      bed: formData.bed,
      status: status,
      admissionDate: new Date().toISOString(),
      diagnosis: formData.diagnosis || "Awaiting Diagnosis",
      allergies: formData.allergies ? formData.allergies.split(',').map(a => a.trim()) : ["None"],
      chronicConditions: [], 
      medications: [],
      vitalsHistory: [
        { 
          timestamp: new Date().toISOString(), 
          hr: numHr, 
          bp: `${formData.bpSystolic}/${formData.bpDiastolic}`, 
          spo2: numSpo2, 
          loggedBy: currentUser.name 
        }
      ],
      notes: [
        { 
          id: `n-${Date.now()}`, 
          timestamp: new Date().toISOString(), 
          author: currentUser.name, 
          role: currentUser.role, 
          text: `Admitted to ${currentUser.ward}. ${currentUser.ward === 'EC' ? 'TEWS Triage' : 'Ward EWS'} applied.` 
        }
      ]
    };

    admitPatient(newPatient);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden my-8">
        <div className="flex justify-between items-center p-4 border-b bg-blue-50">
          <h3 className="font-bold text-lg text-blue-900">Admit New Patient</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition-colors">
            <X />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Patient Name</label>
              <input required type="text" className="w-full border p-2 rounded mt-1 outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input required type="date" className="w-full border p-2 rounded mt-1 text-sm outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({...formData, dob: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select className="w-full border p-2 rounded mt-1 bg-white outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({...formData, gender: e.target.value})}>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Primary Diagnosis</label>
              <input required type="text" placeholder="e.g. Pneumonia" className="w-full border p-2 rounded mt-1 outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({...formData, diagnosis: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Allergies</label>
              <input type="text" placeholder="e.g. Penicillin (or 'None')" className="w-full border p-2 rounded mt-1 outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({...formData, allergies: e.target.value})} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Bed Number</label>
              <input required type="number" className="w-full border p-2 rounded mt-1 outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({...formData, bed: e.target.value})} />
            </div>
          </div>

          <div className="border-t pt-4 bg-gray-50 -mx-4 px-4 pb-4">
            <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
              Initial Vitals ({currentUser.ward === 'EC' ? 'TEWS' : 'EWS'})
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600">Heart Rate</label>
                <input required type="number" placeholder="bpm" className="w-full border p-2 rounded mt-1 bg-white outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({...formData, hr: e.target.value})} />
              </div>
              <div className="col-span-2 flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600">Systolic BP</label>
                  <input required type="number" placeholder="120" className="w-full border p-2 rounded mt-1 bg-white outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({...formData, bpSystolic: e.target.value})} />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600">Diastolic BP</label>
                  <input required type="number" placeholder="80" className="w-full border p-2 rounded mt-1 bg-white outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({...formData, bpDiastolic: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600">SpO2 %</label>
                <input required type="number" placeholder="%" className="w-full border p-2 rounded mt-1 bg-white outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({...formData, spo2: e.target.value})} />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 mt-2 transition-colors">
            Admit to {currentUser.ward}
          </button>
        </form>
      </div>
    </div>
  );
}