import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';

// Mock data for upcoming appointments
const upcomingAppointments = [
  {
    id: '1',
    doctorName: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    date: '2023-06-15',
    time: '10:30 AM',
  },
  {
    id: '2',
    doctorName: 'Dr. Michael Chen',
    specialty: 'General Practitioner',
    date: '2023-06-22',
    time: '02:15 PM',
  },
];

// Mock data for prescriptions
const prescriptions = [
  {
    id: '1',
    name: 'Amoxicillin',
    dosage: '500mg',
    frequency: 'Three times daily',
    duration: 'For 7 days',
    date: '2023-06-01',
  },
  {
    id: '2',
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    duration: 'Ongoing',
    date: '2023-05-15',
  },
];

// Mock data for vitals
const vitalsData = [
  { date: '2023-06-01', heartRate: 72, bloodPressure: '120/80', temperature: 98.6 },
  { date: '2023-05-15', heartRate: 75, bloodPressure: '122/82', temperature: 98.4 },
  { date: '2023-05-01', heartRate: 70, bloodPressure: '118/78', temperature: 98.7 },
  { date: '2023-04-15', heartRate: 73, bloodPressure: '121/81', temperature: 98.5 },
  { date: '2023-04-01', heartRate: 74, bloodPressure: '123/83', temperature: 98.8 },
];

const PatientDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-400 bg-opacity-30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
              <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-400 bg-opacity-30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Active Prescriptions</h3>
              <p className="text-2xl font-bold">{prescriptions.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-400 bg-opacity-30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Heart Rate</h3>
              <p className="text-2xl font-bold">{vitalsData[0].heartRate} BPM</p>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Vitals Tracking</h2>
            
            <div className="h-64 relative">
              {/* This would be a real chart in a production app */}
              <svg className="w-full h-full" viewBox="0 0 800 200">
                {/* Heart Rate Line */}
                <path
                  d="M50,150 L200,120 L350,140 L500,100 L650,110 L800,90"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                />
                
                {/* Blood Pressure Line */}
                <path
                  d="M50,130 L200,140 L350,120 L500,130 L650,120 L800,110"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                />
                
                {/* Temperature Line */}
                <path
                  d="M50,100 L200,105 L350,95 L500,100 L650,90 L800,95"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="3"
                />
                
                {/* X-axis */}
                <line x1="50" y1="180" x2="800" y2="180" stroke="#E5E7EB" strokeWidth="1" />
                
                {/* Y-axis */}
                <line x1="50" y1="50" x2="50" y2="180" stroke="#E5E7EB" strokeWidth="1" />
                
                {/* X-axis labels */}
                <text x="50" y="195" fontSize="12" fill="#6B7280">Apr 1</text>
                <text x="200" y="195" fontSize="12" fill="#6B7280">Apr 15</text>
                <text x="350" y="195" fontSize="12" fill="#6B7280">May 1</text>
                <text x="500" y="195" fontSize="12" fill="#6B7280">May 15</text>
                <text x="650" y="195" fontSize="12" fill="#6B7280">Jun 1</text>
                <text x="800" y="195" fontSize="12" fill="#6B7280">Jun 15</text>
              </svg>
              
              <div className="absolute top-0 right-0 flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                  <span className="text-xs text-gray-600">Heart Rate</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                  <span className="text-xs text-gray-600">Blood Pressure</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-1"></div>
                  <span className="text-xs text-gray-600">Temperature</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-900 mb-3">Recent Measurements</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Heart Rate
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Blood Pressure
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Temperature
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {vitalsData.map((vital, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(vital.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vital.heartRate} BPM
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vital.bloodPressure} mmHg
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vital.temperature}°F
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
            
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-md font-medium text-gray-900">{appointment.doctorName}</h3>
                        <p className="text-sm text-gray-500">{appointment.specialty}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                    </div>
                    <div className="mt-3 flex items-center text-sm text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No upcoming appointments.</p>
            )}
            
            <div className="mt-4">
              <Link to="/patient/appointments/book">
                <Button variant="primary" className="w-full">
                  Book New Appointment
                </Button>
              </Link>
            </div>
          </Card>
          
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Prescriptions</h2>
            
            {prescriptions.length > 0 ? (
              <div className="space-y-4">
                {prescriptions.map((prescription) => (
                  <div key={prescription.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between">
                      <h3 className="text-md font-medium text-gray-900">{prescription.name}</h3>
                      <span className="text-xs text-gray-500">
                        {new Date(prescription.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1 text-sm text-gray-700">
                      <p>Dosage: {prescription.dosage}</p>
                      <p>Frequency: {prescription.frequency}</p>
                      <p>Duration: {prescription.duration}</p>
                    </div>
                    <div className="mt-3 flex justify-between">
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Refill Request
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No active prescriptions.</p>
            )}
            
            <div className="mt-4">
              <Link to="/patient/prescriptions">
                <Button variant="outline" className="w-full">
                  View All Prescriptions
                </Button>
              </Link>
            </div>
          </Card>
          
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            
            <div className="space-y-3">
              <Link to="/emergency-chat">
                <Button
                  variant="danger"
                  className="w-full justify-start"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                >
                  Emergency Chat
                </Button>
              </Link>
              
              <Link to="/first-aid">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                >
                  First Aid Guide
                </Button>
              </Link>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              >
                Download Medical Records
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                }
              >
                Message Your Doctor
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;