import { ChatMessage, FirstAidGuide, Medication } from '../types';

const API_BASE_URL = 'https://api.openai.com/v1';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Helper function for API calls
const apiCall = async (endpoint: string, method: string = 'GET', data?: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      ...(data && { body: JSON.stringify(data) })
    });
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Chat with GPT
export const chatWithGPT = async (message: string): Promise<ChatMessage> => {
  try {
    const response = await apiCall('/chat/completions', 'POST', {
      model: 'gpt-4',
      messages: [{ role: 'user', content: message }],
      temperature: 0.7,
      max_tokens: 150
    });

    return {
      id: Date.now().toString(),
      senderId: 'ai',
      senderName: 'AI Assistant',
      senderRole: 'ai',
      content: response.choices[0].message.content,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Chat with GPT failed:', error);
    throw error;
  }
};

// Transcribe audio using Whisper
export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('model', 'whisper-1');
    
    const response = await fetch(`${API_BASE_URL}/audio/transcriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Transcription failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Transcription failed:', error);
    throw error;
  }
};

// Get diagnosis based on symptoms
export const getDiagnosis = async (symptoms: string): Promise<any> => {
  try {
    const response = await apiCall('/chat/completions', 'POST', {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a medical diagnosis assistant. Analyze the symptoms and provide a possible diagnosis with confidence level and recommendations.'
        },
        {
          role: 'user',
          content: `Patient symptoms: ${symptoms}`
        }
      ],
      temperature: 0.3
    });

    const result = response.choices[0].message.content;
    return {
      diagnosis: result,
      confidence: 0.85,
      recommendations: ['Please consult with a healthcare professional to confirm this diagnosis.']
    };
  } catch (error) {
    console.error('Diagnosis failed:', error);
    throw error;
  }
};

// Get first aid guide
export const getFirstAidGuide = async (symptom: string): Promise<FirstAidGuide> => {
  try {
    const response = await apiCall('/chat/completions', 'POST', {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a first aid guide assistant. Provide clear, step-by-step instructions for handling medical emergencies.'
        },
        {
          role: 'user',
          content: `Provide first aid instructions for: ${symptom}`
        }
      ],
      temperature: 0.3
    });

    const content = response.choices[0].message.content;
    return {
      symptom,
      solution: content,
      description: 'Please seek professional medical help if symptoms persist or worsen.',
      mediaUrls: []
    };
  } catch (error) {
    console.error('First aid guide retrieval failed:', error);
    throw error;
  }
};

// Get medication pricing
export const getMedicationPricing = async (medicationName: string): Promise<Medication> => {
  try {
    const response = await apiCall('/chat/completions', 'POST', {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a medication information assistant. Provide details about medications including dosage, frequency, and estimated price.'
        },
        {
          role: 'user',
          content: `Provide information about: ${medicationName}`
        }
      ],
      temperature: 0.3
    });

    const content = response.choices[0].message.content;
    // Parse the GPT response to extract medication details
    const lines = content.split('\n');
    return {
      name: medicationName,
      dosage: lines[0] || 'Consult your doctor',
      frequency: lines[1] || 'As prescribed',
      duration: lines[2] || 'As directed',
      price: parseFloat(lines[3]) || 0
    };
  } catch (error) {
    console.error('Medication pricing retrieval failed:', error);
    throw error;
  }
};