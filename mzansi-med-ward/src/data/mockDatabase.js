export const users = [
  { id: "u1", username: "dr.smith", role: "Doctor", ward: "All", name: "Dr. Smith" },
  { id: "u2", username: "sr.khumalo", role: "PN", ward: "Medical", name: "Sr. Khumalo" },
  { id: "u3", username: "en.naidoo", role: "EN", ward: "Surgical", name: "Nurse Naidoo" },
  { id: "u4", username: "ena.peters", role: "ENA", ward: "EC", name: "Nurse Peters" }
];

export const patients = [
  { 
    id: "p1", 
    name: "J. Doe", 
    dob: "1985-04-12",
    age: 40,
    gender: "M",
    ward: "Medical", 
    bed: 1, 
    status: "Green",
    admissionDate: "2026-03-03T08:00:00",
    diagnosis: "Community Acquired Pneumonia",
    allergies: ["Penicillin", "Latex"],
    chronicConditions: ["Hypertension"],
    medications: [
      { id: "m1", name: "Ceftriaxone", dose: "1g", route: "IV", frequency: "Daily", time: "08:00" },
      { id: "m2", name: "Paracetamol", dose: "1g", route: "PO", frequency: "QID (6-hourly)", time: "PRN" }
    ],
    vitalsHistory: [
      { timestamp: "2026-03-05T14:00:00", hr: 85, bp: "120/80", spo2: 98, loggedBy: "Sr. Khumalo" }
    ],
    notes: [
      { id: "n1", timestamp: "2026-03-05T09:00:00", author: "Dr. Smith", role: "Doctor", text: "Patient stable. Awaiting blood results." }
    ]
  },
  { 
    id: "p2", 
    name: "S. Nkosi", 
    dob: "1992-11-23",
    age: 33,
    gender: "F",
    ward: "EC",
    bed: 4, 
    status: "Red",
    admissionDate: "2026-03-05T13:00:00",
    diagnosis: "Suspected Appendicitis",
    allergies: ["None"],
    chronicConditions: ["Asthma"],
    medications: [
      { id: "m3", name: "Morphine", dose: "5mg", route: "IV", frequency: "STAT", time: "Immediate" },
      { id: "m4", name: "Ringer's Lactate", dose: "1L", route: "IV", frequency: "Continuous", time: "125ml/hr" }
    ],
    vitalsHistory: [
      { timestamp: "2026-03-05T14:30:00", hr: 125, bp: "165/95", spo2: 89, loggedBy: "Nurse Peters" }
    ],
    notes: [
      { id: "n3", timestamp: "2026-03-05T14:35:00", author: "Nurse Peters", role: "ENA", text: "Patient in severe abdominal pain. Tachycardic." }
    ]
  }
];