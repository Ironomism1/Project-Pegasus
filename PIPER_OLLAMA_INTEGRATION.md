# 🎤 PIPER TTS + OLLAMA INTEGRATION GUIDE

## Project Pegasus - Advanced Setup with Text-to-Speech and LLM

This guide covers integrating **Piper (Text-to-Speech)** and **Ollama (Large Language Models)** with Project Pegasus.

---

## 📋 TABLE OF CONTENTS

1. [Piper TTS Setup](#piper-tts-setup)
2. [Ollama LLM Setup](#ollama-llm-setup)
3. [Linking Piper to Project Pegasus](#linking-piper-to-project-pegasus)
4. [Linking Ollama to Project Pegasus](#linking-ollama-to-project-pegasus)
5. [Configuration](#configuration)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

---

## 🎤 PIPER TTS SETUP

### What is Piper?

Piper is an open-source neural Text-to-Speech (TTS) system that converts text to natural-sounding speech. It's lightweight and can run locally.

### Installation

#### Option 1: Using Python Package

```bash
# Install Piper via pip
pip install piper-tts

# Install espeak-ng (required dependency)
# Windows: Download from https://github.com/espeak-ng/espeak-ng/releases
# Mac: brew install espeak-ng
# Linux: sudo apt-get install espeak-ng
```

#### Option 2: Using Pre-built Binary

```bash
# Download from: https://github.com/rhasspy/piper/releases
# Extract to a known location (e.g., C:\piper or ~/piper)

# Windows Example:
# Download piper_windows_x64.zip
# Extract to: C:\piper

# Mac/Linux Example:
# wget https://github.com/rhasspy/piper/releases/download/[version]/piper_linux_x64.tar.gz
# tar -xzf piper_linux_x64.tar.gz -C ~/piper
```

#### Option 3: Using Docker

```bash
# Pull Piper Docker image
docker pull rhasspy/piper

# Run Piper in Docker
docker run -it -p 5002:5002 rhasspy/piper \
  piper --server 0.0.0.0:5002
```

### Download Piper Voice Models

Piper requires voice models. Download them based on your needs:

```bash
# Option 1: Download via Python
python -m piper --download

# Option 2: Manual Download
# Visit: https://huggingface.co/rhasspy/piper-voices

# Models location after download:
# Windows: C:\Users\[YourUsername]\.piper\models
# Mac: ~/.piper/models
# Linux: ~/.piper/models

# Popular Models:
# - en_US-lessac-medium.onnx (English US, good quality)
# - en_GB-alan-medium.onnx (English UK)
# - hi_IN-google-medium.onnx (Hindi)
# - multi_dataset-medium.onnx (Multilingual)
```

### Verify Piper Installation

```bash
# Test Piper TTS
echo "Hello world" | piper --model en_US-lessac-medium --output_file output.wav

# If successful, you'll see output.wav file created
```

---

## 🧠 OLLAMA LLM SETUP

### What is Ollama?

Ollama is a tool for running large language models locally on your machine. It's simple, fast, and supports multiple models.

### Installation

#### Windows Setup

```bash
# 1. Download Ollama installer
# Visit: https://ollama.ai

# 2. Run installer and follow the prompts

# 3. Verify installation
ollama --version

# 4. Start Ollama server (automatic on startup after installation)
ollama serve

# Server will run on: http://localhost:11434
```

#### Mac Setup

```bash
# 1. Download Ollama from https://ollama.ai
# 2. Install and run

# 3. Verify
ollama --version

# 4. Start server (if not already running)
ollama serve
```

#### Linux Setup

```bash
# Download and install
curl https://ollama.ai/install.sh | sh

# Start Ollama
ollama serve

# Runs on http://localhost:11434
```

### Download Ollama Models

Popular models for Project Pegasus:

```bash
# Lightweight Models (Fast, Lower Memory)
ollama pull mistral              # ~4GB - Fast, good quality
ollama pull neural-chat         # ~4GB - Optimized for chat
ollama pull dolphin-mixtral     # ~8GB - Good reasoning

# Medium Models (Balance)
ollama pull llama2              # ~4GB - Meta's model
ollama pull orca-mini           # ~3GB - Lightweight
ollama pull phi                 # ~2.7GB - Very fast

# Powerful Models (High Quality, More RAM needed)
ollama pull llama2-uncensored   # ~7GB - Uncensored version
ollama pull openchat            # ~4GB - Chat focused

# Multilingual Models
ollama pull orca-mini           # Supports multiple languages
ollama pull mistral             # Good multilingual support

# For Hindi Support
ollama pull neural-chat         # Has some Hindi capability
# Or fine-tune with Hindi data
```

### Run Ollama Model

```bash
# Start interactive chat with a model
ollama run mistral

# Your prompt here:
> Hello, who are you?

# Type 'exit' to quit
```

### Verify Ollama Setup

```bash
# Test API endpoint
curl http://localhost:11434/api/generate -d '{
  "model": "mistral",
  "prompt": "Hello",
  "stream": false
}'

# Expected response: {"response":"Hello! I am...","done":true}
```

---

## 🔗 LINKING PIPER TO PROJECT PEGASUS

### Step 1: Create Piper Service Backend

Create a new file: `backend/piper-service.js`

```javascript
const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// Configuration
const PIPER_PATH = process.env.PIPER_PATH || 'C:\\piper\\piper.exe'; // Windows
// For Mac/Linux: '/usr/local/bin/piper' or '~/piper/piper'

const MODELS_PATH = process.env.PIPER_MODELS || 
  'C:\\Users\\' + process.env.USERNAME + '\\.piper\\models'; // Windows

// Available voices
const VOICES = {
  'en_US_male': 'en_US-lessac-medium',
  'en_US_female': 'en_US-hfc_female-medium',
  'en_GB': 'en_GB-alan-medium',
  'hi_IN': 'hi_IN-google-medium',
};

// Text to Speech endpoint
app.post('/tts', async (req, res) => {
  try {
    const { text, voice = 'en_US_male', speed = 1.0 } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const modelName = VOICES[voice] || VOICES['en_US_male'];
    const outputFile = path.join(__dirname, `audio_${Date.now()}.wav`);

    // Prepare Piper command
    const piperProcess = spawn(PIPER_PATH, [
      '--model', modelName,
      '--output_file', outputFile,
      '--speed', speed.toString(),
    ]);

    // Send text to Piper via stdin
    piperProcess.stdin.write(text);
    piperProcess.stdin.end();

    // Wait for process to complete
    piperProcess.on('close', (code) => {
      if (code === 0 && fs.existsSync(outputFile)) {
        // Send audio file
        res.sendFile(outputFile, () => {
          // Clean up after sending
          fs.unlinkSync(outputFile);
        });
      } else {
        res.status(500).json({ error: 'Piper TTS failed' });
      }
    });

    piperProcess.on('error', (err) => {
      res.status(500).json({ error: 'Piper error: ' + err.message });
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Available voices endpoint
app.get('/voices', (req, res) => {
  res.json({
    voices: VOICES,
    default: 'en_US_male',
    description: 'Available voices for text-to-speech'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Piper TTS service running', port: 5003 });
});

const PORT = process.env.PIPER_PORT || 5003;
app.listen(PORT, () => {
  console.log(`🎤 Piper TTS Service running on http://localhost:${PORT}`);
});
```

### Step 2: Update Server Configuration

Edit `backend/server.js` to include Piper endpoint:

```javascript
// Add this route to backend/server.js

// Piper TTS endpoint
app.post('/tts', async (req, res) => {
  try {
    const response = await fetch('http://localhost:5003/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    if (response.ok) {
      const audioBuffer = await response.arrayBuffer();
      res.type('audio/wav').send(Buffer.from(audioBuffer));
    } else {
      res.status(500).json({ error: 'TTS service error' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get available TTS voices
app.get('/api/tts/voices', async (req, res) => {
  try {
    const response = await fetch('http://localhost:5003/voices');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Step 3: Environment Configuration

Create `.env` file in project root:

```env
# Piper Configuration
PIPER_PATH=C:\piper\piper.exe
# For Mac/Linux: /usr/local/bin/piper or ~/piper/piper
PIPER_MODELS=C:\Users\[YourUsername]\.piper\models
PIPER_PORT=5003

# Piper Settings
PIPER_DEFAULT_VOICE=en_US-lessac-medium
PIPER_SPEED=1.0
PIPER_SAMPLE_RATE=22050
```

### Step 4: Frontend Integration

Add to `src/ChatWindow.js`:

```javascript
// Function to play TTS
const playTTS = async (text, voice = 'en_US_male') => {
  try {
    const response = await fetch('/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice })
    });

    if (response.ok) {
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  } catch (error) {
    console.error('TTS Error:', error);
  }
};

// Usage example:
// playTTS("Hello, this is Project Pegasus speaking!", "en_US_male");
```

---

## 🧠 LINKING OLLAMA TO PROJECT PEGASUS

### Step 1: Create Ollama Service Backend

Create a new file: `backend/ollama-service.js`

```javascript
const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

// Configuration
const OLLAMA_BASE_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || 'mistral';

// Generate response from LLM
app.post('/generate', async (req, res) => {
  try {
    const { prompt, model = DEFAULT_MODEL, temperature = 0.7 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        temperature,
        stream: false,
      })
    });

    if (!response.ok) {
      return res.status(500).json({ error: 'Ollama service error' });
    }

    const data = await response.json();
    res.json({
      response: data.response,
      model: data.model,
      done: data.done
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const { messages, model = DEFAULT_MODEL } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
      })
    });

    if (!response.ok) {
      return res.status(500).json({ error: 'Ollama service error' });
    }

    const data = await response.json();
    res.json({
      message: data.message,
      model: data.model
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List available models
app.get('/models', async (req, res) => {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', async (req, res) => {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    if (response.ok) {
      res.json({ status: 'Ollama service running', url: OLLAMA_BASE_URL });
    } else {
      res.status(503).json({ error: 'Ollama service unavailable' });
    }
  } catch (error) {
    res.status(503).json({ error: 'Cannot reach Ollama service' });
  }
});

const PORT = process.env.OLLAMA_PORT || 5004;
app.listen(PORT, () => {
  console.log(`🧠 Ollama Service running on http://localhost:${PORT}`);
});
```

### Step 2: Update Main Server

Edit `backend/server.js`:

```javascript
// Add Ollama routes

// Generate LLM response
app.post('/api/llm/generate', async (req, res) => {
  try {
    const response = await fetch('http://localhost:5004/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Chat with LLM
app.post('/api/llm/chat', async (req, res) => {
  try {
    const response = await fetch('http://localhost:5004/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get available LLM models
app.get('/api/llm/models', async (req, res) => {
  try {
    const response = await fetch('http://localhost:5004/models');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Step 3: Environment Configuration

Add to `.env`:

```env
# Ollama Configuration
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=mistral
OLLAMA_PORT=5004
OLLAMA_TEMPERATURE=0.7

# Alternative models:
# OLLAMA_MODEL=neural-chat
# OLLAMA_MODEL=dolphin-mixtral
# OLLAMA_MODEL=llama2
```

### Step 4: Frontend Integration

Add to `src/ChatWindow.js`:

```javascript
// Function to get LLM response
const getLLMResponse = async (userMessage) => {
  try {
    const response = await fetch('/api/llm/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: userMessage,
        temperature: 0.7
      })
    });

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('LLM Error:', error);
    return 'Sorry, I could not generate a response.';
  }
};

// Usage in chat
const handleUserMessage = async (message) => {
  const response = await getLLMResponse(message);
  const responseWithTTS = await playTTS(response);
  return response;
};
```

---

## ⚙️ CONFIGURATION

### Full `.env` File

```env
# Backend Configuration
PORT=3001
DATABASE=./lala_ai.db

# Piper TTS Configuration
PIPER_ENABLED=true
PIPER_PATH=C:\piper\piper.exe
PIPER_MODELS=C:\Users\[YourUsername]\.piper\models
PIPER_PORT=5003
PIPER_DEFAULT_VOICE=en_US-lessac-medium
PIPER_SPEED=1.0

# Ollama LLM Configuration
OLLAMA_ENABLED=true
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=mistral
OLLAMA_PORT=5004
OLLAMA_TEMPERATURE=0.7

# Available Models (uncomment one)
# OLLAMA_MODEL=mistral
# OLLAMA_MODEL=neural-chat
# OLLAMA_MODEL=llama2
# OLLAMA_MODEL=dolphin-mixtral

# API Keys (if needed)
SERPER_API_KEY=your_api_key_here
```

### Platform-Specific Paths

#### Windows
```env
PIPER_PATH=C:\piper\piper.exe
PIPER_MODELS=C:\Users\YourUsername\.piper\models
```

#### Mac
```env
PIPER_PATH=/usr/local/bin/piper
PIPER_MODELS=~/.piper/models
```

#### Linux
```env
PIPER_PATH=/usr/bin/piper
PIPER_MODELS=~/.piper/models
```

---

## 🧪 TESTING

### Test Piper TTS

```bash
# Terminal 1: Start Piper service
node backend/piper-service.js

# Terminal 2: Test endpoint
curl -X POST http://localhost:5003/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello from Project Pegasus","voice":"en_US_male"}' \
  > output.wav
```

### Test Ollama

```bash
# Terminal 1: Ensure Ollama is running
ollama serve

# Terminal 2: Test endpoint
curl -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "mistral",
    "prompt": "Hello, who are you?",
    "stream": false
  }'
```

### Complete Test Flow

```bash
# Terminal 1: Start Piper
node backend/piper-service.js

# Terminal 2: Start Ollama
ollama serve

# Terminal 3: Start main backend
node backend/server.js

# Terminal 4: Start frontend
npm start
```

---

## 🐛 TROUBLESHOOTING

### Piper Issues

#### "Piper command not found"
```bash
# Check installation
which piper          # Mac/Linux
where piper          # Windows

# If not found, reinstall:
pip install piper-tts
```

#### "No module named 'piper_tts'"
```bash
# Install via pip
pip install piper-tts

# Or use binary version
# Download from: https://github.com/rhasspy/piper/releases
```

#### "espeak-ng not found"
```bash
# Windows: Download from https://github.com/espeak-ng/espeak-ng/releases
# Mac: brew install espeak-ng
# Linux: sudo apt-get install espeak-ng
```

#### Audio file not created
```bash
# Check Piper path in .env
# Verify model file exists in ~/.piper/models
# Check file permissions
```

### Ollama Issues

#### "Cannot reach Ollama service"
```bash
# Start Ollama
ollama serve

# Or if installed as service:
# Windows: Check system Services
# Mac: launchctl list | grep ollama
# Linux: systemctl status ollama
```

#### "Model not found"
```bash
# Download model first
ollama pull mistral

# List available models
ollama list
```

#### High memory usage
```bash
# Use smaller model
ollama pull orca-mini    # ~3GB
ollama pull phi          # ~2.7GB

# Or configure in .env
OLLAMA_MODEL=orca-mini
```

#### Slow response
```bash
# Check Ollama status
curl http://localhost:11434/api/tags

# Use faster model
# Mistral: Fast, good quality (~4GB)
# Neural-chat: Optimized for chat (~4GB)
```

### Integration Issues

#### Services not communicating
```bash
# Check ports are available
netstat -ano | findstr :5003   # Piper
netstat -ano | findstr :5004   # Ollama
netstat -ano | findstr :11434  # Ollama API

# Allow firewall access
# Windows Firewall > Allow apps through
```

#### CORS errors
```javascript
// Add to server.js if needed
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST']
}));
```

#### Slow startup
```bash
# Load models into memory on startup
ollama run mistral

# Or keep Ollama service running
ollama serve
```

---

## 🚀 ADVANCED SETUP

### Docker Compose Setup

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    environment:
      - OLLAMA_MODEL=mistral

  piper:
    image: rhasspy/piper:latest
    ports:
      - "5003:5002"
    volumes:
      - piper_data:/root/.piper

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    depends_on:
      - ollama
    environment:
      - OLLAMA_URL=http://ollama:11434
      - PIPER_PATH=/usr/bin/piper

  frontend:
    build: ./
    ports:
      - "3000:3000"

volumes:
  ollama_data:
  piper_data:
```

Start all services:
```bash
docker-compose up
```

### Performance Optimization

```env
# Use faster models
OLLAMA_MODEL=neural-chat    # Fast
PIPER_SPEED=1.2             # Faster speech

# Reduce latency
OLLAMA_NUM_GPU=1            # Use GPU if available
PIPER_SAMPLE_RATE=16000     # Lower quality, faster
```

### Multi-Language Support

```env
# Hindi voice
PIPER_DEFAULT_VOICE=hi_IN-google-medium

# English UK
PIPER_DEFAULT_VOICE=en_GB-alan-medium

# Multilingual model
OLLAMA_MODEL=mistral        # Supports ~70 languages
```

---

## 📞 RESOURCES

- **Piper GitHub**: https://github.com/rhasspy/piper
- **Ollama Website**: https://ollama.ai
- **Piper Models**: https://huggingface.co/rhasspy/piper-voices
- **Ollama Models**: https://ollama.ai/library
- **Espeak-ng**: https://github.com/espeak-ng/espeak-ng

---

## ✅ CHECKLIST

- [ ] Install Piper TTS
- [ ] Download Piper models
- [ ] Install Ollama
- [ ] Download Ollama model (mistral or other)
- [ ] Create `.env` with correct paths
- [ ] Create `piper-service.js`
- [ ] Create `ollama-service.js`
- [ ] Update `backend/server.js`
- [ ] Update `src/ChatWindow.js`
- [ ] Test Piper TTS service
- [ ] Test Ollama LLM service
- [ ] Test integration with main app
- [ ] Configure environment variables
- [ ] Set up auto-start on reboot

---

**Made with ❤️ for Project Pegasus**

*Your AI, Your Rules, Your Control* 🚀
