import { useState } from 'react';
import { usePatients } from '../context/PatientContext';
import { useAuth } from '../context/AuthContext';
import { X, Activity, MessageSquare, AlertTriangle, Pill, Clock } from 'lucide-react';

export default function PatientChartModal({ patient, onClose }) {
  const { addNote, addVitals, transferPatient, dischargePatient, administerMed } = usePatients();
  const { currentUser } = useAuth();
  
  const [noteText, setNoteText] = useState('');
  const [vitalsForm, setVitalsForm] = useState({ hr: '', bpSys: '', bpDia: '', spo2: '' });
  const [selectedWard, setSelectedWard] = useState('Medical'); 
  const [activeTab, setActiveTab] = useState('overview'); 

  const handleAddVitals = (e) => {
    e.preventDefault();
    const hr = Number(vitalsForm.hr);
    const sys = Number(vitalsForm.bpSys);
    const spo2 = Number(vitalsForm.spo2);
    
    let newStatus = 'Green';
    if (hr > 120 || sys > 160 || spo2 < 92) newStatus = 'Red';
    else if (hr > 100 || sys > 140 || spo2 < 95) newStatus = 'Orange';

    const newVitalsEntry = { timestamp: new Date().toISOString(), hr: vitalsForm.hr, bp: `${vitalsForm.bpSys}/${vitalsForm.bpDia}`, spo2: vitalsForm.spo2, loggedBy: currentUser.name };
    addVitals(patient.id, newVitalsEntry, newStatus);
    setVitalsForm({ hr: '', bpSys: '', bpDia: '', spo2: '' });
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    const newNoteEntry = { id: `n-${Date.now()}`, timestamp: new Date().toISOString(), author: currentUser.name, role: currentUser.role, text: noteText };
    addNote(patient.id, newNoteEntry);
    setNoteText('');
  };

  const handleTransfer = () => {
    if (window.confirm(`Transfer ${patient.name} to ${selectedWard} Ward?`)) {
      transferPatient(patient.id, selectedWard);
      onClose(); 
    }
  };

  const handleDischarge = () => {
    if (window.confirm(`Are you sure you want to discharge ${patient.name}?`)) {
      dischargePatient(patient.id);
      onClose();
    }
  };

  const handleSignOff = (medId, medName) => {
    if (window.confirm(`Confirm administration of ${medName}?`)) {
      administerMed(patient.id, medId, currentUser.name);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-ZA', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });
  };

  const getTimelineEvents = () => {
    const vitals = (patient.vitalsHistory || []).map(v => ({ ...v, type: 'VITAL' }));
    const notes = (patient.notes || []).map(n => ({ ...n, type: 'NOTE' }));
    
    const allEvents = [...vitals, ...notes].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    const grouped = {};
    allEvents.forEach(event => {
      const dateStr = new Date(event.timestamp).toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      if (!grouped[dateStr]) grouped[dateStr] = [];
      grouped[dateStr].push(event);
    });
    
    return grouped;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-50 rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        
        <div className="bg-blue-900 text-white p-4 flex justify-between items-start shrink-0">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              {patient.name} 
              <span className={`text-xs px-3 py-1 rounded-full font-bold ${patient.status === 'Red' ? 'bg-red-500' : patient.status === 'Orange' ? 'bg-orange-500' : 'bg-emerald-500'}`}>{patient.status} STATUS</span>
            </h2>
            <p className="text-blue-200 mt-1 text-sm">
              {patient.gender} • {patient.age}y • DOB: {patient.dob} • Bed {patient.bed} ({patient.ward} Ward)
              {patient.admissionDate && ` • Admitted: ${formatDate(patient.admissionDate)}`}
            </p>
          </div>
          <button onClick={onClose} className="hover:bg-blue-800 p-2 rounded-full transition"><X /></button>
        </div>

        <div className="bg-white border-b border-gray-200 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
            <div><p className="text-xs font-bold text-gray-500 uppercase">Primary Diagnosis</p><p className="font-semibold text-gray-800">{patient.diagnosis || "Not documented"}</p></div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-red-500" /> Allergies</p>
              <div className="flex gap-1 flex-wrap mt-1">
                {patient.allergies?.map((allergy, idx) => (<span key={idx} className={`text-xs font-bold px-2 py-0.5 rounded ${allergy.toLowerCase() === 'none' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-700 border border-red-200'}`}>{allergy}</span>)) || <span className="text-sm text-gray-500">Unknown</span>}
              </div>
            </div>
            <div><p className="text-xs font-bold text-gray-500 uppercase">Chronic Conditions</p><p className="text-sm text-gray-700">{patient.chronicConditions?.join(", ") || "None"}</p></div>
          </div>
          {currentUser.role === 'Doctor' && (
            <div className="flex items-center gap-2 border-l pl-4 border-gray-200">
              <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                  <select className="border text-sm rounded p-1" value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)}><option value="Medical">Medical</option><option value="Surgical">Surgical</option><option value="ICU">ICU</option><option value="EC">EC</option></select>
                  <button onClick={handleTransfer} className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-bold px-3 py-1 rounded transition">Transfer</button>
                </div>
                <button onClick={handleDischarge} className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold px-3 py-1.5 rounded transition w-full">Discharge</button>
              </div>
            </div>
          )}
        </div>

        <div className="flex bg-white px-4 border-b border-gray-200 shrink-0 overflow-x-auto">
          <button onClick={() => setActiveTab('overview')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'border-blue-600 text-blue-800' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
            Clinical Overview
          </button>
          <button onClick={() => setActiveTab('mar')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'mar' ? 'border-blue-600 text-blue-800' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
            <Pill className="w-4 h-4" /> e-MAR (Medications)
          </button>
          <button onClick={() => setActiveTab('timeline')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'timeline' ? 'border-blue-600 text-blue-800' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
            <Clock className="w-4 h-4" /> Admission Timeline
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col p-4 bg-slate-50">
          
          {activeTab === 'overview' && (
            <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden">
              <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-3 bg-gray-100 font-bold text-gray-700 flex items-center gap-2 border-b"><Activity className="w-5 h-5" /> Vitals Flowsheet</div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {patient.vitalsHistory?.map((v, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50 text-sm">
                      <div className="grid grid-cols-3 gap-4 font-mono text-gray-800 font-bold"><span>❤️ {v.hr}</span><span>🩸 {v.bp}</span><span>💨 {v.spo2}%</span></div>
                      <div className="text-right text-xs text-gray-500"><p>{formatDate(v.timestamp)}</p><p>By: {v.loggedBy}</p></div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleAddVitals} className="p-4 bg-blue-50 border-t mt-auto">
                  <div className="flex gap-2">
                    <input required type="number" placeholder="HR" className="w-16 p-2 border rounded text-sm" value={vitalsForm.hr} onChange={e => setVitalsForm({...vitalsForm, hr: e.target.value})} />
                    <input required type="number" placeholder="Sys" className="w-16 p-2 border rounded text-sm" value={vitalsForm.bpSys} onChange={e => setVitalsForm({...vitalsForm, bpSys: e.target.value})} />
                    <span className="text-xl text-gray-400">/</span>
                    <input required type="number" placeholder="Dia" className="w-16 p-2 border rounded text-sm" value={vitalsForm.bpDia} onChange={e => setVitalsForm({...vitalsForm, bpDia: e.target.value})} />
                    <input required type="number" placeholder="SpO2%" className="w-20 p-2 border rounded text-sm" value={vitalsForm.spo2} onChange={e => setVitalsForm({...vitalsForm, spo2: e.target.value})} />
                    <button type="submit" className="bg-blue-600 text-white px-4 rounded font-bold hover:bg-blue-700">Save</button>
                  </div>
                </form>
              </div>

              <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-3 bg-gray-100 font-bold text-gray-700 flex items-center gap-2 border-b"><MessageSquare className="w-5 h-5" /> Multidisciplinary Notes</div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {patient.notes?.map((note) => (
                    <div key={note.id} className="p-3 border-l-4 border-blue-500 bg-slate-50 rounded-r-lg">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-sm text-gray-800">{note.author} <span className="text-xs font-normal text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full ml-1">{note.role}</span></span>
                        <span className="text-xs text-gray-500">{formatDate(note.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.text}</p>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleAddNote} className="p-4 bg-gray-50 border-t mt-auto">
                  <textarea required className="w-full border rounded p-2 text-sm resize-none outline-none" rows="2" placeholder={`Type clinical note here...`} value={noteText} onChange={e => setNoteText(e.target.value)}></textarea>
                  <div className="flex justify-end mt-2"><button type="submit" className="bg-slate-800 text-white px-6 py-2 rounded text-sm font-bold">Add Note</button></div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'mar' && (
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-bold text-gray-800">Prescribed Medications</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {patient.medications?.map((med) => (
                  <div key={med.id} className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2"><h4 className="text-lg font-bold text-blue-900">{med.name}</h4><span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded">{med.route}</span></div>
                      <p className="text-sm text-gray-700 mt-1"><span className="font-semibold">Dose:</span> {med.dose} &nbsp;•&nbsp; <span className="font-semibold">Freq:</span> {med.frequency} &nbsp;•&nbsp; <span className="font-semibold">Time:</span> {med.time}</p>
                      {med.history?.length > 0 && <p className="text-xs text-emerald-600 font-medium mt-2">✓ Last given: {formatDate(med.history[0].timestamp)} by {med.history[0].by}</p>}
                    </div>
                    {['PN', 'EN', 'ENA'].includes(currentUser.role) && (
                      <button onClick={() => handleSignOff(med.id, med.name)} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg shadow-sm whitespace-nowrap">Sign Off</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto">
                {Object.entries(getTimelineEvents()).length === 0 ? (
                  <p className="text-center text-gray-500 mt-10">No history documented yet.</p>
                ) : (
                  Object.entries(getTimelineEvents()).map(([date, events]) => (
                    <div key={date} className="mb-8 relative">
                      <div className="sticky top-0 bg-blue-50/95 backdrop-blur-sm border border-blue-100 text-blue-900 font-bold px-4 py-2 rounded-lg shadow-sm z-10 mb-4 inline-block">
                        📅 {date}
                      </div>
                      
                      <div className="absolute top-10 bottom-0 left-6 w-0.5 bg-gray-200"></div>

                      <div className="space-y-4">
                        {events.map((ev, idx) => (
                          <div key={idx} className="relative pl-14">
                            <div className={`absolute left-[21px] top-4 w-3 h-3 rounded-full border-2 border-white shadow-sm ${ev.type === 'VITAL' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                            
                            <div className="bg-white border border-gray-100 shadow-sm rounded-lg p-3 hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start mb-2">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${ev.type === 'VITAL' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                                  {ev.type === 'VITAL' ? 'Vitals Recorded' : 'Clinical Note'}
                                </span>
                                <span className="text-xs text-gray-400 font-mono">
                                  {new Date(ev.timestamp).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              
                              {ev.type === 'VITAL' ? (
                                <div className="grid grid-cols-3 gap-2 bg-gray-50 p-2 rounded text-sm font-mono text-gray-700">
                                  <span>❤️ {ev.hr} bpm</span>
                                  <span>🩸 {ev.bp}</span>
                                  <span>💨 {ev.spo2}%</span>
                                </div>
                              ) : (
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{ev.text}</p>
                              )}
                              
                              <p className="text-right text-xs text-gray-400 mt-2 italic">
                                Logged by: {ev.loggedBy || ev.author} {ev.role && `(${ev.role})`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}