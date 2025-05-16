import { ChatMessage, FirstAidGuide, Medication } from '../types';
import axios from 'axios';

const API_BASE_URL = 'https://api.openai.com/v1';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
    formData.append('audio', audioBlob);

    const response = await axios.post(`${API_URL}/transcribe`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.transcription;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error('Failed to transcribe audio');
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
    const response = await axios.post(`${API_URL}/first-aid`, { symptom });
    // The backend always returns instructions and videoUrl
    return {
      symptom,
      solution: response.data.instructions,
      description: 'Please seek professional medical help if symptoms persist or worsen.',
      videoUrl: response.data.videoUrl,
      mediaUrls: []
    };
  } catch (error) {
    console.error('First aid guide retrieval failed:', error);
    // Fallback to OpenAI API call if backend call fails
    const response = await apiCall('/chat/completions', 'POST', {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a first aid guide assistant. Provide clear, step-by-step instructions for handling medical emergencies. Also, suggest a relevant YouTube video URL for a demo. If no video is available, respond with "No video available."'
        },
        {
          role: 'user',
          content: `Provide first aid instructions for: ${symptom}`
        }
      ],
      temperature: 0.3
    });

    const content = response.choices[0].message.content;
    // Check if the response indicates no video is available
    const noVideoAvailable = content.includes('No video available');
    let videoUrl = 'https://www.youtube.com/embed/OSPIIcB2bQA'; // Default video

    if (!noVideoAvailable) {
      // Extract YouTube video ID from the response
      const videoIdMatch = content.match(/https:\/\/www\.youtube\.com\/watch\?v=([\w-]+)/);
      if (videoIdMatch) {
        const videoId = videoIdMatch[1];
        videoUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    }

    return {
      symptom,
      solution: content,
      description: 'Please seek professional medical help if symptoms persist or worsen.',
      videoUrl,
      mediaUrls: []
    };
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

// User/Profile
export const getUser = (id: string) => axios.get(`${API_URL}/users/${id}`);
export const updateUser = (id: string, data: any) => axios.put(`${API_URL}/users/${id}`, data);

// Appointments
export const getAppointments = (userId: string) => axios.get(`${API_URL}/appointments`, { params: { userId } });
export const createAppointment = (data: any) => axios.post(`${API_URL}/appointments`, data);

// Prescriptions
export const getPrescriptions = (userId: string) => axios.get(`${API_URL}/prescriptions`, { params: { userId } });
export const createPrescription = (data: any) => axios.post(`${API_URL}/prescriptions`, data);

// Create a new user
export const createUser = async (userData: { email: string; password: string; role: string }): Promise<any> => {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Invalid email format');
    }

    // Validate password criteria
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(userData.password)) {
      throw new Error('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    }

    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  } catch (error) {
    console.error('User creation failed:', error);
    throw error;
  }
};

// Sign up a new user
export const signUp = async (userData: { email: string; password: string; role: string }): Promise<any> => {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Invalid email format');
    }

    // Validate password criteria
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(userData.password)) {
      throw new Error('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    }

    const response = await axios.post(`${API_URL}/users/signup`, userData);
    return response.data;
  } catch (error) {
    console.error('Sign up failed:', error);
    throw error;
  }
};

// Login user
export const login = async (userData: { email: string; password: string }): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, userData);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Create a new account
export const createAccount = async (userData: { email: string; password: string; role: string }): Promise<any> => {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Invalid email format');
    }

    // Validate password criteria
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(userData.password)) {
      throw new Error('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    }

    const response = await axios.post(`${API_URL}/users/create`, userData);
    return response.data;
  } catch (error) {
    console.error('Account creation failed:', error);
    throw error;
  }
};