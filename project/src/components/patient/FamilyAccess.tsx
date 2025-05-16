import React, { useEffect, useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface Caregiver {
  id: string;
  name: string;
  email: string;
}

const FamilyAccess: React.FC = () => {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Assume patientId is available from auth context or props
  const patientId = localStorage.getItem('userId');

  const fetchCaregivers = async () => {
    if (!patientId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/patients/${patientId}/caregivers`);
      const data = await res.json();
      setCaregivers(data.map((c: any) => ({ id: c._id || c.id, name: c.name, email: c.email })));
    } catch (err) {
      setError('Failed to load caregivers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaregivers();
    // eslint-disable-next-line
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/patients/${patientId}/caregivers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caregiverEmail: email })
      });
      if (!res.ok) throw new Error('Caregiver not found or already added.');
      setSuccess('Caregiver invited successfully!');
      setEmail('');
      fetchCaregivers();
    } catch (err) {
      setError('Failed to invite caregiver.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (caregiverId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/patients/${patientId}/caregivers/${caregiverId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to remove caregiver.');
      setSuccess('Caregiver removed.');
      fetchCaregivers();
    } catch (err) {
      setError('Failed to remove caregiver.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Family Access</h2>
        <form onSubmit={handleInvite} className="flex gap-2 mb-6">
          <input
            type="email"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Caregiver's email"
            required
          />
          <Button type="submit" variant="primary" disabled={loading}>
            Invite
          </Button>
        </form>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <h3 className="text-lg font-medium mb-2">Current Caregivers</h3>
        {loading && <div>Loading...</div>}
        <ul className="space-y-2">
          {caregivers.map(c => (
            <li key={c.id} className="flex items-center justify-between bg-gray-50 border rounded px-3 py-2">
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-gray-500 text-sm">{c.email}</div>
              </div>
              <Button variant="danger" onClick={() => handleRemove(c.id)} disabled={loading}>
                Remove
              </Button>
            </li>
          ))}
          {caregivers.length === 0 && !loading && <li className="text-gray-500">No caregivers added yet.</li>}
        </ul>
      </Card>
    </div>
  );
};

export default FamilyAccess; 