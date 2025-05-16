import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  lastVisit: string;
  condition: string;
  status: string;
  email?: string;
  phone?: string;
  address?: string;
  bloodType?: string;
  allergies?: string[];
  conditions?: string[];
}

const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would be an API call
    // For now, we'll use mock data
    const mockPatient: Patient = {
      id: id || '1',
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      lastVisit: '2023-05-15',
      condition: 'Hypertension',
      status: 'Stable',
      email: 'john.doe@example.com',
      phone: '+1 234 567 8900',
      address: '123 Main St, City, State',
      bloodType: 'O+',
      allergies: ['Penicillin', 'Pollen'],
      conditions: ['Hypertension', 'Type 2 Diabetes']
    };
    setPatient(mockPatient);
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!patient) {
    return <div className="flex items-center justify-center min-h-screen">Patient not found</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Patient Details</h1>
        <div className="space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/doctor/consultations/new?patientId=${patient.id}`)}
          >
            New Consultation
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/doctor/patients')}
          >
            Back to Patients
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Name</label>
              <p className="mt-1 text-sm text-gray-900">{patient.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Age</label>
              <p className="mt-1 text-sm text-gray-900">{patient.age} years</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Gender</label>
              <p className="mt-1 text-sm text-gray-900">{patient.gender}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Email</label>
              <p className="mt-1 text-sm text-gray-900">{patient.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Phone</label>
              <p className="mt-1 text-sm text-gray-900">{patient.phone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Address</label>
              <p className="mt-1 text-sm text-gray-900">{patient.address}</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Blood Type</label>
              <p className="mt-1 text-sm text-gray-900">{patient.bloodType}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Current Condition</label>
              <p className="mt-1 text-sm text-gray-900">{patient.condition}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Status</label>
              <p className="mt-1 text-sm text-gray-900">{patient.status}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Allergies</label>
              <ul className="mt-1 text-sm text-gray-900 list-disc list-inside">
                {patient.allergies?.map((allergy, index) => (
                  <li key={index}>{allergy}</li>
                ))}
              </ul>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Medical Conditions</label>
              <ul className="mt-1 text-sm text-gray-900 list-disc list-inside">
                {patient.conditions?.map((condition, index) => (
                  <li key={index}>{condition}</li>
                ))}
              </ul>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Last Visit</label>
              <p className="mt-1 text-sm text-gray-900">{new Date(patient.lastVisit).toLocaleDateString()}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PatientDetails; 