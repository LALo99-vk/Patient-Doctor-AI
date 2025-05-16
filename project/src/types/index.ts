export interface User {
  id: string;
  name: string;
  email: string;
  role: 'doctor' | 'patient';
  licenseId?: string; // For doctors only
  // Patient profile fields
  profilePic?: string;
  phone?: string;
  address?: string;
  gender?: string;
  age?: number;
  bloodType?: string;
  allergies?: string[];
  conditions?: string[];
  careRecipients?: { id: string; name: string; email: string }[];
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodType?: string;
  allergies?: string[];
  conditions?: string[];
  medications?: string[];
  consultations?: Consultation[];
}

export interface Doctor {
  id: string;
  name: string;
  licenseId: string;
  specialization: string;
  patients?: string[]; // Patient IDs
  schedule?: Appointment[];
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Consultation {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  patientName: string;
  symptoms: string[];
  diagnosis: string;
  medications: Medication[];
  notes: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  price?: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'doctor' | 'patient' | 'ai';
  content: string;
  timestamp: string;
  attachments?: string[];
}

export interface Vital {
  id: string;
  patientId: string;
  type: 'heartRate' | 'bloodPressure' | 'temperature' | 'oxygenLevel' | 'glucose';
  value: number;
  unit: string;
  timestamp: string;
}

export interface FirstAidGuide {
  symptom: string;
  solution: string;
  description: string;
  mediaUrls?: string[];
  videoUrl?: string;
}