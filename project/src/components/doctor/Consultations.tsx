import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface Consultation {
  id: string;
  patientName: string;
  date: string;
  time: string;
  symptoms: string[];
  diagnosis: string;
  status: 'completed' | 'in-progress' | 'scheduled';
}

const Consultations: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([
    {
      id: '1',
      patientName: 'John Doe',
      date: '2024-03-20',
      time: '09:00 AM',
      symptoms: ['Fever', 'Cough', 'Fatigue'],
      diagnosis: 'Common Cold',
      status: 'completed'
    },
    {
      id: '2',
      patientName: 'Jane Smith',
      date: '2024-03-20',
      time: '10:30 AM',
      symptoms: ['Headache', 'Nausea'],
      diagnosis: 'Migraine',
      status: 'in-progress'
    },
    {
      id: '3',
      patientName: 'Robert Johnson',
      date: '2024-03-20',
      time: '01:15 PM',
      symptoms: ['Back Pain'],
      diagnosis: 'Muscle Strain',
      status: 'scheduled'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (consultationId: string, newStatus: 'completed' | 'in-progress' | 'scheduled') => {
    setConsultations(consultations.map(consultation => 
      consultation.id === consultationId ? { ...consultation, status: newStatus } : consultation
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Consultations</h1>
        <Link to="/doctor/consultations/new">
          <Button variant="primary">
            New Consultation
          </Button>
        </Link>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Symptoms
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diagnosis
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {consultations.map((consultation) => (
                <tr key={consultation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{consultation.patientName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(consultation.date).toLocaleDateString()} at {consultation.time}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {consultation.symptoms.map((symptom, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{consultation.diagnosis}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={consultation.status}
                      onChange={(e) => handleStatusChange(consultation.id, e.target.value as 'completed' | 'in-progress' | 'scheduled')}
                      className={`text-sm rounded-full px-2 py-1 font-semibold ${getStatusColor(consultation.status)}`}
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/doctor/consultations/${consultation.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </Link>
                    <Link
                      to={`/doctor/consultations/${consultation.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this consultation?')) {
                          setConsultations(consultations.filter(c => c.id !== consultation.id));
                        }
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Consultations; 