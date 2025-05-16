require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const OpenAI = require('openai');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  profilePic: String,
  phone: String,
  address: String,
  gender: String,
  age: Number,
  bloodType: String,
  allergies: [String],
  conditions: [String],
  role: String,
  caregivers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // users who can view this patient's data
  careRecipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // patients this user can view (if caregiver)
});
const User = mongoose.model('User', userSchema);

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
  userId: String,
  doctor: String,
  date: String,
  time: String,
  status: String,
});
const Appointment = mongoose.model('Appointment', appointmentSchema);

// Prescription Schema
const prescriptionSchema = new mongoose.Schema({
  userId: String,
  name: String,
  dosage: String,
  frequency: String,
  duration: String,
  date: String,
  status: String,
  doctorName: String,
  instructions: String,
});
const Prescription = mongoose.model('Prescription', prescriptionSchema);

// User routes
app.get('/api/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});
app.put('/api/users/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
});

// Appointment routes
app.get('/api/appointments', async (req, res) => {
  const { userId } = req.query;
  const appointments = await Appointment.find({ userId });
  res.json(appointments);
});
app.post('/api/appointments', async (req, res) => {
  const appointment = new Appointment(req.body);
  await appointment.save();
  res.json(appointment);
});

// Prescription routes
app.get('/api/prescriptions', async (req, res) => {
  const { userId } = req.query;
  const prescriptions = await Prescription.find({ userId });
  res.json(prescriptions);
});
app.post('/api/prescriptions', async (req, res) => {
  const prescription = new Prescription(req.body);
  await prescription.save();
  res.json(prescription);
});

// Transcribe audio endpoint
app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const audioBuffer = req.file.buffer;
    
    // Convert buffer to base64
    const base64Audio = audioBuffer.toString('base64');
    
    // Call OpenAI Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: {
        buffer: audioBuffer,
        name: 'audio.wav',
        type: 'audio/wav'
      },
      model: 'whisper-1'
    });

    res.json({ transcription: transcription.text });
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

// Add a caregiver to a patient (by email)
app.post('/api/patients/:id/caregivers', async (req, res) => {
  const patientId = req.params.id;
  const { caregiverEmail } = req.body;
  const caregiver = await User.findOne({ email: caregiverEmail });
  if (!caregiver) return res.status(404).json({ error: 'Caregiver not found' });
  // Add caregiver to patient
  await User.findByIdAndUpdate(patientId, { $addToSet: { caregivers: caregiver._id } });
  // Add patient to caregiver's careRecipients
  await User.findByIdAndUpdate(caregiver._id, { $addToSet: { careRecipients: patientId } });
  res.json({ success: true });
});

// Remove a caregiver from a patient
app.delete('/api/patients/:id/caregivers/:caregiverId', async (req, res) => {
  const patientId = req.params.id;
  const caregiverId = req.params.caregiverId;
  await User.findByIdAndUpdate(patientId, { $pull: { caregivers: caregiverId } });
  await User.findByIdAndUpdate(caregiverId, { $pull: { careRecipients: patientId } });
  res.json({ success: true });
});

// List caregivers for a patient
app.get('/api/patients/:id/caregivers', async (req, res) => {
  const patient = await User.findById(req.params.id).populate('caregivers', 'name email');
  res.json(patient.caregivers);
});

// List patients a caregiver can access
app.get('/api/caregivers/:id/patients', async (req, res) => {
  const caregiver = await User.findById(req.params.id).populate('careRecipients', 'name email');
  res.json(caregiver.careRecipients);
});

// AI Image Analysis Endpoint
app.post('/api/ai/analyze-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }
    // Send image to OpenAI Vision API (GPT-4V)
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a medical AI assistant. Analyze the uploaded image for skin, hair, wounds, burns, or allergies. You must respond in the following JSON format: { "severity": "mild/moderate/severe/critical", "diagnosis": "short diagnosis", "remedies": { "traditional": "traditional remedies", "modern": "modern remedies" }, "healingTime": "estimated healing time", "warning": "warning if serious, else empty string" }'
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Analyze this image and provide the required information in the specified JSON format.' },
            { type: 'image_url', image_url: { url: `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` } }
          ]
        }
      ],
      max_tokens: 600
    });

    // Try to parse the JSON from the AI's response
    let result = null;
    try {
      const content = response.choices[0].message.content;
      result = JSON.parse(content);
      
      // Validate the required fields
      if (!result.severity || !result.diagnosis || !result.remedies || !result.healingTime) {
        throw new Error('Missing required fields in AI response');
      }
      
      // Ensure remedies has both traditional and modern fields
      if (!result.remedies.traditional || !result.remedies.modern) {
        throw new Error('Missing remedies fields in AI response');
      }
      
      res.json(result);
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      // Return a more informative error response
      return res.status(500).json({
        error: 'Failed to analyze image',
        details: 'The AI response could not be properly formatted. Please try again.',
        rawResponse: response.choices[0].message.content
      });
    }
  } catch (error) {
    console.error('AI image analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
});

// First Aid Guide Endpoint (AI)
app.post('/api/first-aid', async (req, res) => {
  try {
    const { symptom } = req.body;
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a first aid assistant. For any given symptom or emergency, provide clear, step-by-step first aid instructions (do not change the instructions format). Always include a relevant YouTube video link for a demo as the field videoUrl. If you cannot find a specific video, use 'https://www.youtube.com/watch?v=OSPIIcB2bQA' as a general first aid demo. Respond in JSON with keys: instructions, videoUrl.`
        },
        {
          role: 'user',
          content: `First aid instructions for: ${symptom}`
        }
      ],
      max_tokens: 600
    });
    let result = null;
    try {
      result = JSON.parse(response.choices[0].message.content);
    } catch (e) {
      return res.json({ instructions: response.choices[0].message.content, videoUrl: 'https://www.youtube.com/watch?v=OSPIIcB2bQA' });
    }
    // Fallback if videoUrl is missing or empty
    if (!result.videoUrl) {
      result.videoUrl = 'https://www.youtube.com/watch?v=OSPIIcB2bQA';
    }
    res.json(result);
  } catch (error) {
    console.error('First aid AI error:', error);
    res.status(500).json({ error: 'Failed to get first aid instructions' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 