import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { generatePrescription } from '../../api/consultation';

const SmartPrescription: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [condition, setCondition] = useState('');
  const [loading, setLoading] = useState(false);
  const [prescription, setPrescription] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPrescription(null);
    setError(null);
    try {
      const result = await generatePrescription(symptoms, condition);
      setPrescription(result);
    } catch (err) {
      setError('Failed to generate prescription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Smart Prescription Generator</h2>
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={symptoms}
              onChange={e => setSymptoms(e.target.value)}
              placeholder="e.g. fever, cough, headache"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition (optional)</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={condition}
              onChange={e => setCondition(e.target.value)}
              placeholder="e.g. suspected flu"
            />
          </div>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Prescription'}
          </Button>
        </form>
        {error && <div className="mt-4 text-red-600">{error}</div>}
        {prescription && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">AI-Suggested Prescription</h3>
            <pre className="bg-gray-50 border border-gray-200 rounded-md p-4 whitespace-pre-wrap text-gray-800">{prescription}</pre>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SmartPrescription; 