import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

interface ConsultationAnalysis {
  symptoms: string[];
  possibleDiagnoses: string[];
  recommendedTests: string[];
  treatmentSuggestions: string[];
  riskFactors: string[];
  summary: string;
}

export const analyzeConsultation = async (transcription: string): Promise<ConsultationAnalysis> => {
  try {
    const response = await axios.post(
      `${API_URL}/consultations/analyze`,
      { transcription },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error analyzing consultation:', error);
    throw error;
  }
};

export const saveConsultation = async (consultationData: {
  patientId: string;
  transcription: string;
  analysis: ConsultationAnalysis;
  doctorNotes: string;
  status: 'completed' | 'in-progress' | 'scheduled';
}) => {
  try {
    const response = await axios.post(
      `${API_URL}/consultations`,
      consultationData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error saving consultation:', error);
    throw error;
  }
};

export const getConsultation = async (consultationId: string) => {
  try {
    const response = await axios.get(`${API_URL}/consultations/${consultationId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching consultation:', error);
    throw error;
  }
};

export const updateConsultation = async (consultationId: string, updates: Partial<{
  transcription: string;
  analysis: ConsultationAnalysis;
  doctorNotes: string;
  status: 'completed' | 'in-progress' | 'scheduled';
}>) => {
  try {
    const response = await axios.put(
      `${API_URL}/consultations/${consultationId}`,
      updates,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating consultation:', error);
    throw error;
  }
};

/**
 * Smart Prescription Generator
 * Auto-suggests medicines and dosage using AI based on symptoms and condition.
 */
export const generatePrescription = async (symptoms: string, condition: string): Promise<string> => {
  try {
    const prompt = `You are a medical AI assistant. Based on the following symptoms and condition, suggest a prescription with medicine names, dosages, and brief instructions.\n\nSymptoms: ${symptoms}\nCondition: ${condition}\n\nFormat:\n- Medicine Name (Dosage, Frequency, Duration): Instructions`;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a helpful medical assistant.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 300
      })
    });
    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating prescription:', error);
    throw error;
  }
}; 