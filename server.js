import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

// Helper to read data
const readData = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading data.json:', err);
    return {};
  }
};

// Helper to write data
const writeData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing data.json:', err);
  }
};

// Get all data
app.get('/api/data', (req, res) => {
  res.json(readData());
});

// Generic update endpoint (can be made more specific if needed)
app.post('/api/update', (req, res) => {
  const { key, value } = req.body;
  if (!key) return res.status(400).json({ error: 'Key is required' });
  
  const data = readData();
  data[key] = value;
  writeData(data);
  res.json({ success: true, data: data[key] });
});

// Specific endpoints for better REST practices
app.get('/api/:key', (req, res) => {
  const { key } = req.params;
  const data = readData();
  res.json(data[key] || []);
});

app.post('/api/:key', (req, res) => {
  const { key } = req.params;
  const value = req.body;
  const data = readData();
  
  if (Array.isArray(data[key])) {
    // If it's an array, we assume it's adding a new item or updating one
    if (value.id) {
      const index = data[key].findIndex(item => item.id === value.id);
      if (index !== -1) {
        data[key][index] = { ...data[key][index], ...value };
      } else {
        data[key].push(value);
      }
    } else {
      data[key].push({ id: Date.now().toString(), ...value });
    }
  } else {
    data[key] = value;
  }
  
  writeData(data);
  res.json({ success: true, data: data[key] });
});

app.delete('/api/:key/:id', (req, res) => {
  const { key, id } = req.params;
  const data = readData();
  if (Array.isArray(data[key])) {
    data[key] = data[key].filter(item => String(item.id) !== String(id));
    writeData(data);
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Cannot delete from non-array key' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
