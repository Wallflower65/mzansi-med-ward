import { Activity, Heart, Droplets, User } from 'lucide-react';

export default function PatientCard({ patient, onClick }) {
  const statusStyles = {
    Red: 'border-red-500 bg-red-50 text-red-900 hover:bg-red-100',
    Orange: 'border-orange-500 bg-orange-50 text-orange-900 hover:bg-orange-100',
    Green: 'border-emerald-500 bg-emerald-50 text-emerald-900 hover:bg-emerald-100',
  };

  const cardStyle = statusStyles[patient.status] || 'border-gray-200 bg-white text-gray-800';
  
  const currentVitals = patient.vitalsHistory && patient.vitalsHistory.length > 0 
    ? patient.vitalsHistory[0] 
    : { hr: '--', bp: '--', spo2: '--' };

  return (
    <div 
      onClick={onClick}
      className={`p-5 rounded-xl border-l-8 shadow-sm transition-all hover:shadow-md cursor-pointer ${cardStyle}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold">{patient.name}</h3>
          <div className="flex items-center gap-2 text-sm opacity-80 mt-1">
            <User className="w-3 h-3" />
            <span>{patient.gender} • {patient.age}y</span>
            <span>• Bed {patient.bed}</span>
          </div>
          <p className="text-xs opacity-70 mt-1">DOB: {patient.dob}</p>
        </div>
        
        {patient.status !== 'Green' && (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/50 backdrop-blur-sm border border-current">
            {patient.status === 'Red' ? '🚨 URGENT' : '⚠️ REVIEW'}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 bg-white/60 p-3 rounded-lg">
        <div className="flex flex-col items-center">
          <Heart className="w-5 h-5 mb-1 opacity-70" />
          <span className="font-bold">{currentVitals.hr}</span>
          <span className="text-xs opacity-70">bpm</span>
        </div>
        <div className="flex flex-col items-center border-l border-r border-current/20">
          <Activity className="w-5 h-5 mb-1 opacity-70" />
          <span className="font-bold">{currentVitals.bp}</span>
          <span className="text-xs opacity-70">mmHg</span>
        </div>
        <div className="flex flex-col items-center">
          <Droplets className="w-5 h-5 mb-1 opacity-70" />
          <span className="font-bold">{currentVitals.spo2}%</span>
          <span className="text-xs opacity-70">SpO2</span>
        </div>
      </div>
      
      {patient.notes && patient.notes.length > 0 && (
        <div className="mt-3 text-xs text-right opacity-70 italic font-medium">
          {patient.notes.length} Clinical Note(s) available
        </div>
      )}
    </div>
  );
}