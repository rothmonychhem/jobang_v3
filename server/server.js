import express from 'express';
import dotenv from 'dotenv'; 
import offreRoute from './routes/offreEmploi.js';
import CandidatRoute from './routes/candidat.js';
import EntrepriseRoute from './routes/entreprise.js';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

// Middleware for JSON requests
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.use('/api/offreEmploi/', offreRoute);
app.use('/api/candidat/', CandidatRoute);
app.use('/api/entreprise/', EntrepriseRoute);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/client/build/index.html'))
);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // Start the server
    app.listen(process.env.PORT, () => {
      console.log(`Connected to MongoDB and backend is running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

// Test route
app.get('/', (req, res) => {
  res.json({ msg: 'Hi .... OHHH!!' });
});
