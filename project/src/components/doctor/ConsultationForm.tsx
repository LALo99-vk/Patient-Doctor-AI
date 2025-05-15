import React, { useState, useRef, useEffect } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { transcribeAudio } from '../../api';

interface ConsultationFormProps {
  patientId?: string;
  patientName?: string;
}

const ConsultationForm: React.FC<ConsultationFormProps> = ({ patientId, patientName = 'Patient' }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [processedData, setProcessedData] = useState<{
    patientName: string;
    symptoms: string[];
    diagnosis: string;
    medications: { name: string; dosage: string; frequency: string; duration: string }[];
  }>({
    patientName: patientName,
    symptoms: [],
    diagnosis: '',
    medications: [],
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [notes, setNotes] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
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
          const text = await transcribeAudio(audioBlob);
          setTranscription(prev => prev + ' ' + text);
          
          // Process the transcription to extract structured data
          // In a real app, this would be done by the backend
          processTranscription(text);
        } catch (error) {
          console.error('Transcription error:', error);
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
      
      // Stop all audio tracks
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  };
  
  const processTranscription = (text: string) => {
    // This is a simplified example of how to process the transcription
    // In a real app, this would be done by the backend using NLP
    
    // Extract symptoms (look for keywords like "complains of", "symptoms include", etc.)
    const symptomsMatch = text.match(/symptoms?:?\s*([^.]+)/i) || 
                         text.match(/complains of\s*([^.]+)/i) ||
                         text.match(/presenting with\s*([^.]+)/i);
    
    // Extract diagnosis (look for keywords like "diagnosis", "assessment", etc.)
    const diagnosisMatch = text.match(/diagnosis:?\s*([^.]+)/i) || 
                          text.match(/assessment:?\s*([^.]+)/i) ||
                          text.match(/impression:?\s*([^.]+)/i);
    
    // Extract medications (look for keywords like "prescribe", "medication", etc.)
    const medicationsMatch = text.match(/medications?:?\s*([^.]+)/i) || 
                            text.match(/prescribe:?\s*([^.]+)/i) ||
                            text.match(/treatment:?\s*([^.]+)/i);
    
    // Update the processed data
    setProcessedData(prev => {
      const newData = { ...prev };
      
      if (symptomsMatch && symptomsMatch[1]) {
        const symptomsText = symptomsMatch[1].trim();
        const symptomsArray = symptomsText.split(/,\s*|\sand\s/).map(s => s.trim());
        newData.symptoms = [...new Set([...newData.symptoms, ...symptomsArray])];
      }
      
      if (diagnosisMatch && diagnosisMatch[1]) {
        newData.diagnosis = diagnosisMatch[1].trim();
      }
      
      if (medicationsMatch && medicationsMatch[1]) {
        const medicationsText = medicationsMatch[1].trim();
        const medicationsArray = medicationsText.split(/,\s*|\sand\s/).map(m => m.trim());
        
        const newMedications = medicationsArray.map(med => {
          // Try to extract dosage and frequency information
          const dosageMatch = med.match(/(\d+\s*mg|\d+\s*ml)/i);
          const frequencyMatch = med.match(/(once|twice|three times|daily|weekly|monthly|every \d+ hours)/i);
          const durationMatch = med.match(/(for \d+ days|for \d+ weeks|for \d+ months)/i);
          
          return {
            name: med.split(/\d+\s*mg|\d+\s*ml/i)[0].trim(),
            dosage: dosageMatch ? dosageMatch[0] : '',
            frequency: frequencyMatch ? frequencyMatch[0] : '',
            duration: durationMatch ? durationMatch[0] : '',
          };
        });
        
        newData.medications = [...newData.medications, ...newMedications];
      }
      
      return newData;
    });
    
    // Update notes
    setNotes(prev => prev + ' ' + text);
  };
  
  const handleSave = () => {
    setIsSaving(true);
    
    // In a real app, this would send the data to the backend
    setTimeout(() => {
      setIsSaving(false);
      alert('Consultation saved successfully!');
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900">Voice Transcription</h3>
          <p className="text-sm text-gray-500">Record your consultation notes and they will be automatically transcribed and categorized.</p>
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
      
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900">Consultation Details</h3>
          <p className="text-sm text-gray-500">Review and edit the automatically extracted information.</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Patient Name
            </label>
            <input
              type="text"
              value={processedData.patientName}
              onChange={(e) => setProcessedData({ ...processedData, patientName: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Symptoms
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {processedData.symptoms.map((symptom, index) => (
                <div key={index} className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm flex items-center">
                  {symptom}
                  <button
                    onClick={() => {
                      const newSymptoms = [...processedData.symptoms];
                      newSymptoms.splice(index, 1);
                      setProcessedData({ ...processedData, symptoms: newSymptoms });
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                placeholder="Add a symptom..."
                className="flex-1 rounded-l-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    setProcessedData({
                      ...processedData,
                      symptoms: [...processedData.symptoms, e.currentTarget.value.trim()],
                    });
                    e.currentTarget.value = '';
                  }
                }}
              />
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                onClick={(e) => {
                  const input = e.currentTarget.previousSibling as HTMLInputElement;
                  if (input.value.trim()) {
                    setProcessedData({
                      ...processedData,
                      symptoms: [...processedData.symptoms, input.value.trim()],
                    });
                    input.value = '';
                  }
                }}
              >
                Add
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Diagnosis
            </label>
            <textarea
              value={processedData.diagnosis}
              onChange={(e) => setProcessedData({ ...processedData, diagnosis: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medications
            </label>
            <div className="space-y-4 mb-4">
              {processedData.medications.map((medication, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Medication Name
                          </label>
                          <input
                            type="text"
                            value={medication.name}
                            onChange={(e) => {
                              const newMedications = [...processedData.medications];
                              newMedications[index].name = e.target.value;
                              setProcessedData({ ...processedData, medications: newMedications });
                            }}
                            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Dosage
                          </label>
                          <input
                            type="text"
                            value={medication.dosage}
                            onChange={(e) => {
                              const newMedications = [...processedData.medications];
                              newMedications[index].dosage = e.target.value;
                              setProcessedData({ ...processedData, medications: newMedications });
                            }}
                            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Frequency
                          </label>
                          <input
                            type="text"
                            value={medication.frequency}
                            onChange={(e) => {
                              const newMedications = [...processedData.medications];
                              newMedications[index].frequency = e.target.value;
                              setProcessedData({ ...processedData, medications: newMedications });
                            }}
                            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Duration
                          </label>
                          <input
                            type="text"
                            value={medication.duration}
                            onChange={(e) => {
                              const newMedications = [...processedData.medications];
                              newMedications[index].duration = e.target.value;
                              setProcessedData({ ...processedData, medications: newMedications });
                            }}
                            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const newMedications = [...processedData.medications];
                        newMedications.splice(index, 1);
                        setProcessedData({ ...processedData, medications: newMedications });
                      }}
                      className="ml-4 text-red-600 hover:text-red-800"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <Button
              onClick={() => {
                setProcessedData({
                  ...processedData,
                  medications: [
                    ...processedData.medications,
                    { name: '', dosage: '', frequency: '', duration: '' },
                  ],
                });
              }}
              variant="outline"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              }
            >
              Add Medication
            </Button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
              rows={4}
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button variant="outline">Cancel</Button>
            <Button
              variant="primary"
              isLoading={isSaving}
              onClick={handleSave}
            >
              Save Consultation
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ConsultationForm;