import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { chatWithGPT } from '../../api';
import { ChatMessage } from '../../types';

const EmergencyChat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: 'ai',
      senderName: 'AI Assistant',
      senderRole: 'ai',
      content: 'Hello! This is the emergency chat. How can I help you today?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Mock patient data for sidebar
  const patientData = {
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    bloodType: 'A+',
    allergies: ['Penicillin', 'Peanuts'],
    conditions: ['Hypertension', 'Type 2 Diabetes'],
    medications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
    ],
    vitals: {
      heartRate: 72,
      bloodPressure: '120/80',
      temperature: 98.6,
      oxygenLevel: 98,
    },
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: user?.id || 'user',
      senderName: user?.name || 'You',
      senderRole: user?.role || 'patient',
      content: newMessage,
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);
    
    try {
      const response = await chatWithGPT(newMessage);
      setMessages((prev) => [...prev, response]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback response
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        senderId: 'ai',
        senderName: 'AI Assistant',
        senderRole: 'ai',
        content: 'I apologize, but I am unable to process your request at the moment. Please try again later.',
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
      <div className="lg:col-span-3">
        <Card className="h-full flex flex-col">
          <div className="mb-4 border-b border-gray-200 pb-4">
            <h2 className="text-lg font-semibold text-gray-900">Emergency Chat</h2>
            <p className="text-sm text-gray-500">
              Get immediate assistance for urgent medical concerns.
            </p>
          </div>
          
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderRole === 'ai' ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.senderRole === 'ai'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  <div className="flex items-center mb-1">
                    <span className={`text-xs font-medium ${
                      message.senderRole === 'ai' ? 'text-gray-500' : 'text-blue-100'
                    }`}>
                      {message.senderName}
                    </span>
                    <span className={`text-xs ml-2 ${
                      message.senderRole === 'ai' ? 'text-gray-400' : 'text-blue-100'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSendMessage} className="mt-auto">
            <div className="flex items-center border-t border-gray-200 pt-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 rounded-l-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
                disabled={isLoading}
              />
              <Button
                type="submit"
                variant="primary"
                className="rounded-l-none"
                isLoading={isLoading}
                disabled={isLoading || !newMessage.trim()}
              >
                Send
              </Button>
            </div>
          </form>
        </Card>
      </div>
      
      <div>
        <Card className="h-full">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Information</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Personal Details</h4>
              <div className="bg-gray-50 rounded-md p-3">
                <p className="text-sm text-gray-800 mb-1">
                  <span className="font-medium">Name:</span> {patientData.name}
                </p>
                <p className="text-sm text-gray-800 mb-1">
                  <span className="font-medium">Age:</span> {patientData.age}
                </p>
                <p className="text-sm text-gray-800 mb-1">
                  <span className="font-medium">Gender:</span> {patientData.gender}
                </p>
                <p className="text-sm text-gray-800">
                  <span className="font-medium">Blood Type:</span> {patientData.bloodType}
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Current Vitals</h4>
              <div className="bg-gray-50 rounded-md p-3">
                <p className="text-sm text-gray-800 mb-1">
                  <span className="font-medium">Heart Rate:</span> {patientData.vitals.heartRate} BPM
                </p>
                <p className="text-sm text-gray-800 mb-1">
                  <span className="font-medium">Blood Pressure:</span> {patientData.vitals.bloodPressure} mmHg
                </p>
                <p className="text-sm text-gray-800 mb-1">
                  <span className="font-medium">Temperature:</span> {patientData.vitals.temperature}°F
                </p>
                <p className="text-sm text-gray-800">
                  <span className="font-medium">Oxygen Level:</span> {patientData.vitals.oxygenLevel}%
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Medical Conditions</h4>
              <div className="bg-gray-50 rounded-md p-3">
                <ul className="list-disc list-inside text-sm text-gray-800">
                  {patientData.conditions.map((condition, index) => (
                    <li key={index}>{condition}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Allergies</h4>
              <div className="bg-gray-50 rounded-md p-3">
                <ul className="list-disc list-inside text-sm text-gray-800">
                  {patientData.allergies.map((allergy, index) => (
                    <li key={index}>{allergy}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Current Medications</h4>
              <div className="bg-gray-50 rounded-md p-3 space-y-2">
                {patientData.medications.map((medication, index) => (
                  <div key={index} className="text-sm text-gray-800">
                    <p className="font-medium">{medication.name}</p>
                    <p>{medication.dosage}, {medication.frequency}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-2">
              <Button variant="outline" className="w-full">
                View Full Medical History
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EmergencyChat;