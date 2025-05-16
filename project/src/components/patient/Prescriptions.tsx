import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface Prescription {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  date: string;
  status: 'active' | 'completed' | 'refill_requested';
  doctorName: string;
  instructions?: string;
}

const Prescriptions: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    {
      id: '1',
      name: 'Amoxicillin',
      dosage: '500mg',
      frequency: 'Three times daily',
      duration: 'For 7 days',
      date: '2024-03-15',
      status: 'active',
      doctorName: 'Dr. Sarah Johnson',
      instructions: 'Take with food. Complete the full course even if symptoms improve.'
    },
    {
      id: '2',
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      duration: 'Ongoing',
      date: '2024-02-20',
      status: 'active',
      doctorName: 'Dr. Michael Chen',
      instructions: 'Take in the morning. Monitor blood pressure regularly.'
    }
  ]);

  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  const handleRefillRequest = (prescriptionId: string) => {
    setPrescriptions(prescriptions.map(prescription => 
      prescription.id === prescriptionId 
        ? { ...prescription, status: 'refill_requested' }
        : prescription
    ));
  };

  const handleViewDetails = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
  };

  const handleCloseDetails = () => {
    setSelectedPrescription(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Prescriptions</h1>
      </div>

      <div className="grid gap-6">
        {prescriptions.map((prescription) => (
          <Card key={prescription.id} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{prescription.name}</h3>
                <p className="text-sm text-gray-500">Prescribed by {prescription.doctorName}</p>
                <div className="mt-2 space-y-1 text-sm text-gray-700">
                  <p>Dosage: {prescription.dosage}</p>
                  <p>Frequency: {prescription.frequency}</p>
                  <p>Duration: {prescription.duration}</p>
                  <p>Date: {new Date(prescription.date).toLocaleDateString()}</p>
                </div>
                <span className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  prescription.status === 'active' ? 'bg-green-100 text-green-800' :
                  prescription.status === 'refill_requested' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {prescription.status.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </span>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleViewDetails(prescription)}
                >
                  Details
                </Button>
                {prescription.status === 'active' && (
                  <Button
                    variant="outline"
                    onClick={() => handleRefillRequest(prescription.id)}
                  >
                    Request Refill
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Prescription Details Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedPrescription.name} Details
              </h2>
              <Button
                variant="outline"
                onClick={handleCloseDetails}
              >
                Close
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Prescription Information</h3>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">Doctor:</span> {selectedPrescription.doctorName}</p>
                  <p><span className="font-medium">Dosage:</span> {selectedPrescription.dosage}</p>
                  <p><span className="font-medium">Frequency:</span> {selectedPrescription.frequency}</p>
                  <p><span className="font-medium">Duration:</span> {selectedPrescription.duration}</p>
                  <p><span className="font-medium">Date Prescribed:</span> {new Date(selectedPrescription.date).toLocaleDateString()}</p>
                </div>
              </div>
              {selectedPrescription.instructions && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Instructions</h3>
                  <p className="mt-2 text-gray-700">{selectedPrescription.instructions}</p>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <span className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selectedPrescription.status === 'active' ? 'bg-green-100 text-green-800' :
                  selectedPrescription.status === 'refill_requested' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedPrescription.status.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Prescriptions; 