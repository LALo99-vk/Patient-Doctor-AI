import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { analyzeConsultation, saveConsultation, getConsultation, updateConsultation } from '../../api/consultation';
import { transcribeAudio } from '../../api';

interface ConsultationFormProps {
  patientId?: string;
  patientName?: string;
}

interface ConsultationAnalysis {
  symptoms: string[];
  possibleDiagnoses: string[];
  recommendedTests: string[];
  treatmentSuggestions: string[];
  riskFactors: string[];
  summary: string;
}

const ConsultationForm: React.FC<ConsultationFormProps> = ({ patientId, patientName = 'Patient' }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ConsultationAnalysis | null>(null);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (id) {
      loadConsultation();
    }
  }, [id]);

  const loadConsultation = async () => {
    try {
      const consultation = await getConsultation(id!);
      setTranscription(consultation.transcription);
      setAnalysis(consultation.analysis);
      setDoctorNotes(consultation.doctorNotes);
    } catch (error) {
      console.error('Error loading consultation:', error);
    }
  };
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        
        try {
          // Convert audio to text using speech-to-text API
          const text = await transcribeAudio(audioBlob);
          setTranscription(prev => prev + ' ' + text);
          
          // Analyze the transcription using ChatGPT
          await analyzeTranscription(text);
        } catch (error) {
          console.error('Error processing audio:', error);
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const analyzeTranscription = async (text: string) => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeConsultation(text);
      setAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing transcription:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleSave = async () => {
    if (!analysis) return;
    
    setIsSaving(true);
    try {
      const consultationData = {
        patientId: patientId || '',
        transcription,
        analysis,
        doctorNotes,
        status: 'completed' as const
      };

      if (id) {
        await updateConsultation(id, consultationData);
      } else {
        await saveConsultation(consultationData);
      }
      
      navigate('/doctor/consultations');
    } catch (error) {
      console.error('Error saving consultation:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900">Voice Transcription</h3>
          <p className="text-sm text-gray-500">Record your consultation notes and they will be automatically transcribed and analyzed.</p>
        </div>
        
        <div className="flex items-center space-x-4 mb-6">
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            variant={isRecording ? 'danger' : 'primary'}
            icon={
              isRecording ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
              )
            }
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>
          
          {isRecording && (
            <div className="flex items-center">
              <span className="relative flex h-3 w-3 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-sm text-gray-600">Recording...</span>
            </div>
          )}

          {isAnalyzing && (
            <div className="flex items-center">
              <span className="text-sm text-gray-600">Analyzing transcription...</span>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transcription
          </label>
          <div className="border border-gray-300 rounded-md p-4 h-40 overflow-y-auto bg-gray-50">
            {transcription ? (
              <p className="text-gray-800">{transcription}</p>
            ) : (
              <p className="text-gray-400 italic">Transcription will appear here...</p>
            )}
          </div>
        </div>
      </Card>
      
      {/* Show only the summary after analysis */}
      {analysis && (
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">Consultation Summary</h3>
            <p className="text-sm text-gray-500">AI-generated summary of the consultation, including important and sensitive information.</p>
          </div>
          <div className="text-gray-800 whitespace-pre-line text-base">
            {analysis.summary}
          </div>
        </Card>
      )}
      
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900">Doctor's Notes</h3>
          <p className="text-sm text-gray-500">Add your professional assessment and notes.</p>
        </div>
        
        <div className="space-y-4">
          <textarea
            value={doctorNotes}
            onChange={(e) => setDoctorNotes(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
            rows={4}
            placeholder="Enter your notes here..."
          />
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate('/doctor/consultations')}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isSaving || !analysis}
            >
              {isSaving ? 'Saving...' : 'Save Consultation'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ConsultationForm;