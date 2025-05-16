import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

const Appointments: React.FC = () => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      doctorName: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      date: '2024-03-20',
      time: '10:30 AM',
      status: 'scheduled'
    },
    {
      id: '2',
      doctorName: 'Dr. Michael Chen',
      specialty: 'General Practitioner',
      date: '2024-03-22',
      time: '02:15 PM',
      status: 'scheduled'
    }
  ]);

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      doctorName: selectedDoctor,
      specialty: 'General Practitioner', // This would come from the doctor's data
      date: selectedDate,
      time: selectedTime,
      status: 'scheduled'
    };
    setAppointments([...appointments, newAppointment]);
    setShowBookingForm(false);
    // Reset form
    setSelectedDate('');
    setSelectedTime('');
    setSelectedDoctor('');
  };

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Appointments</h1>
        <Button 
          variant="primary"
          onClick={() => setShowBookingForm(true)}
        >
          Book New Appointment
        </Button>
      </div>

      {showBookingForm && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Book New Appointment</h2>
          <form onSubmit={handleBookAppointment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Doctor
              </label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select a doctor</option>
                <option value="Dr. Sarah Johnson">Dr. Sarah Johnson - Cardiologist</option>
                <option value="Dr. Michael Chen">Dr. Michael Chen - General Practitioner</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select a time</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="02:15 PM">02:15 PM</option>
                <option value="03:45 PM">03:45 PM</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowBookingForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Book Appointment
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-6">
        {appointments.map((appointment) => (
          <Card key={appointment.id} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {appointment.doctorName}
                </h3>
                <p className="text-sm text-gray-500">{appointment.specialty}</p>
                <div className="mt-2 flex items-center text-sm text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                </div>
                <span className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  appointment.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                  appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
              </div>
              {appointment.status === 'scheduled' && (
                <Button
                  variant="outline"
                  onClick={() => handleCancelAppointment(appointment.id)}
                >
                  Cancel Appointment
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Appointments; 