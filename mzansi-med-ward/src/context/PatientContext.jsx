import { createContext, useState, useContext } from 'react';
import { patients as initialPatients } from '../data/mockDatabase';

const PatientContext = createContext();

export const PatientProvider = ({ children }) => {
  const [patients, setPatients] = useState(initialPatients);

  const admitPatient = (newPatient) => {
    setPatients([...patients, newPatient]);
  };

  const addNote = (patientId, newNote) => {
    setPatients(patients.map(p => {
      if (p.id === patientId) {
        return { ...p, notes: [newNote, ...(p.notes || [])] };
      }
      return p;
    }));
  };

  const addVitals = (patientId, newVitals, newStatus) => {
    setPatients(patients.map(p => {
      if (p.id === patientId) {
        return { 
          ...p, 
          status: newStatus, 
          vitalsHistory: [newVitals, ...(p.vitalsHistory || [])] 
        };
      }
      return p;
    }));
  };

  const transferPatient = (patientId, newWard) => {
    setPatients(patients.map(p => {
      if (p.id === patientId) {
        const transferNote = {
          id: `n-${Date.now()}`,
          timestamp: new Date().toISOString(),
          author: "System",
          role: "Admin",
          text: `🔄 Patient transferred to ${newWard} Ward.`
        };
        return { ...p, ward: newWard, notes: [transferNote, ...(p.notes || [])] };
      }
      return p;
    }));
  };

  const dischargePatient = (patientId) => {
    setPatients(patients.map(p => {
      if (p.id === patientId) {
        return { ...p, ward: "Discharged", status: "Green" }; 
      }
      return p;
    }));
  };

  const administerMed = (patientId, medId, nurseName) => {
    setPatients(patients.map(p => {
      if (p.id === patientId) {
        const med = p.medications?.find(m => m.id === medId);
        if (!med) return p;

        const updatedMeds = p.medications.map(m => {
          if (m.id === medId) {
            return {
              ...m,
              history: [{ timestamp: new Date().toISOString(), by: nurseName }, ...(m.history || [])]
            };
          }
          return m;
        });

        const autoNote = {
          id: `n-${Date.now()}`,
          timestamp: new Date().toISOString(),
          author: "System",
          role: "MAR",
          text: `💊 Administered: ${med.name} ${med.dose} (${med.route}) by ${nurseName}`
        };

        return { ...p, medications: updatedMeds, notes: [autoNote, ...(p.notes || [])] };
      }
      return p;
    }));
  };

  return (
    <PatientContext.Provider value={{ patients, admitPatient, addNote, addVitals, transferPatient, dischargePatient, administerMed }}>
      {children}
    </PatientContext.Provider>
  );
}; 

export const usePatients = () => useContext(PatientContext);