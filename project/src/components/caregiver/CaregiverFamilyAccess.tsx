import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

interface Patient {
  id: string;
  name: string;
  email: string;
}

const CaregiverFamilyAccess: React.FC = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/caregivers/${user.id}/patients`);
        const data = await res.json();
        setPatients(data);
      } catch (err) {
        setError('Failed to load patients.');
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [user]);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Family Access - Care Recipients</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && patients.length === 0 && <div>No patients to monitor.</div>}
      <ul className="space-y-4">
        {patients.map((patient) => (
          <li key={patient.id} className="bg-white border rounded-md p-4 flex items-center justify-between">
            <div>
              <div className="font-medium text-lg">{patient.name}</div>
              <div className="text-gray-500 text-sm">{patient.email}</div>
            </div>
            <Link
              to={`/caregiver/patient/${patient.id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              View as
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CaregiverFamilyAccess; 