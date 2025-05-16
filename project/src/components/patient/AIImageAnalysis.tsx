import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface AnalysisResult {
  severity: string;
  diagnosis: string;
  remedies: {
    traditional: string;
    modern: string;
  };
  healingTime: string;
  warning: string;
}

const AIImageAnalysis: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/ai/analyze-image', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to analyze image.');
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError('Failed to analyze image.');
    } finally {
      setLoading(false);
    }
  };

  // Try to parse fallback JSON if severity is unknown and warning looks like JSON
  let displayResult: AnalysisResult | null = result;
  if (
    result &&
    result.severity === 'unknown' &&
    result.warning &&
    result.warning.trim().startsWith('{')
  ) {
    try {
      displayResult = JSON.parse(result.warning);
    } catch {
      // leave as is
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-8">
      <Card>
        <h2 className="text-xl font-semibold mb-4">AI Image Analysis</h2>
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700"
            required
          />
          <Button type="submit" variant="primary" disabled={loading || !file}>
            {loading ? 'Analyzing...' : 'Analyze Image'}
          </Button>
        </form>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {displayResult && (
          <div className="space-y-6 border-t pt-6 mt-4">
            <div className="text-xl font-bold text-blue-800 mb-2">
              Type of Injury/Disease: <span className="text-black">{displayResult.diagnosis}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">Severity:</span>
              <span className={`px-2 py-1 rounded text-white ${
                displayResult.severity === 'critical' ? 'bg-red-600' :
                displayResult.severity === 'severe' ? 'bg-orange-500' :
                displayResult.severity === 'moderate' ? 'bg-yellow-500 text-gray-900' :
                displayResult.severity === 'mild' ? 'bg-green-500' : 'bg-gray-400'
              }`}>
                {displayResult.severity.charAt(0).toUpperCase() + displayResult.severity.slice(1)}
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Estimated Healing Time:</span> {displayResult.healingTime}
            </div>
            <div>
              <span className="font-semibold text-gray-700">Remedies:</span>
              <ul className="list-disc ml-6 mt-1">
                <li><span className="font-semibold">Traditional:</span> {displayResult.remedies.traditional}</li>
                <li><span className="font-semibold">Modern:</span> {displayResult.remedies.modern}</li>
              </ul>
            </div>
            {displayResult.warning && (
              <div className="text-red-600 font-bold border border-red-200 bg-red-50 rounded p-2">
                {displayResult.warning}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AIImageAnalysis; 