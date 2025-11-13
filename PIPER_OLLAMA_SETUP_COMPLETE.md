# 🎤🧠 PIPER + OLLAMA INTEGRATION - COMPLETE SETUP SUMMARY

## What Was Created?

Your Project Pegasus now has **complete support for Piper TTS and Ollama LLM** integration!

---

## 📋 FILES CREATED

### Documentation
- ✅ **PIPER_OLLAMA_INTEGRATION.md** - Comprehensive 500+ line integration guide
- ✅ **QUICKSTART_PIPER_OLLAMA.md** - Quick start guide (5-10 min setup)

### Backend Services
- ✅ **backend/piper-service.js** - Piper TTS microservice with multiple voices
- ✅ **backend/ollama-service.js** - Ollama LLM wrapper service

### Setup Scripts (Automated Installation)
- ✅ **setup-piper.bat** - Windows automated Piper setup
- ✅ **setup-piper.sh** - Mac/Linux automated Piper setup
- ✅ **setup-ollama.bat** - Windows automated Ollama setup
- ✅ **setup-ollama.sh** - Mac/Linux automated Ollama setup

---

## 🚀 QUICK START (5 MINUTES)

### For Windows Users:

**Terminal 1 - Setup Piper:**
```bash
setup-piper.bat
# Installs Piper, downloads voice models, creates .env
```

**Terminal 2 - Setup Ollama:**
```bash
setup-ollama.bat
# Installs Ollama, downloads LLM model, updates .env
```

**After Setup - Start Services (5 terminals):**

```bash
# Terminal 1: Piper TTS Service
node backend/piper-service.js

# Terminal 2: Ollama Service (ensure it's running)
ollama serve

# Terminal 3: Ollama Backend Service
cd backend
node ollama-service.js

# Terminal 4: Main Backend Server
cd backend
node server.js

# Terminal 5: Frontend
npm start
```

### For Mac/Linux Users:

```bash
chmod +x setup-piper.sh setup-ollama.sh
./setup-piper.sh
./setup-ollama.sh
```

Then follow the same 5 terminals above.

---

## 🎯 LINKING YOUR EXISTING PIPER

### Option 1: If Piper is Already Installed

Edit `.env`:
```env
# Point to your Piper installation
PIPER_PATH=C:\path\to\your\piper\piper.exe
# or Mac/Linux:
# PIPER_PATH=/path/to/piper/piper
```

### Option 2: Use System Piper

If Piper is in your system PATH:
```env
PIPER_PATH=piper
```

### Option 3: Direct Code Update

Edit `backend/piper-service.js` line 8:
```javascript
const PIPER_PATH = process.env.PIPER_PATH || '/your/custom/path/piper';
```

---

## 🧠 OLLAMA SETUP - DOWNLOAD MODELS

### Automatic (Setup Script)

```bash
setup-ollama.bat  # Windows - Choose from menu
```

### Manual

```bash
# Download a model (choose one):
ollama pull mistral              # Recommended (~4GB)
ollama pull neural-chat          # Chat optimized (~4GB)
ollama pull dolphin-mixtral      # Good reasoning (~8GB)
ollama pull orca-mini            # Lightweight (~3GB)
ollama pull phi                  # Very fast (~2.7GB)

# Update .env
OLLAMA_MODEL=mistral

# Restart service
node backend/ollama-service.js
```

---

## 🔌 SERVICE ENDPOINTS

| Service | Port | Endpoints | Purpose |
|---------|------|-----------|---------|
| **Piper TTS** | 5003 | `POST /tts`, `GET /voices` | Convert text to speech |
| **Ollama** | 5004 | `POST /generate`, `POST /chat`, `GET /models` | Generate LLM responses |
| **Main Backend** | 3001 | `/api/llm/generate`, `/tts` | Unified API |
| **Frontend** | 3000 | Web UI | User interface |

---

## 📊 AVAILABLE VOICES (Piper)

```bash
# Default voice - English US Male
"voice": "en_US_male"

# Other available voices
"voice": "en_US_female"     # English US Female
"voice": "en_GB"            # English UK
"voice": "hi_IN"            # Hindi
```

### Test a Voice:

```bash
curl -X POST http://localhost:5003/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello","voice":"hi_IN"}'
```

---

## 🧠 AVAILABLE MODELS (Ollama)

| Model | Speed | Quality | RAM | Size | Best For |
|-------|-------|---------|-----|------|----------|
| mistral | ⚡⚡⚡ | ⭐⭐⭐⭐ | 8GB | 4GB | **Recommended** |
| neural-chat | ⚡⚡⚡ | ⭐⭐⭐⭐ | 8GB | 4GB | Chat |
| phi | ⚡⚡⚡⚡ | ⭐⭐⭐ | 4GB | 2.7GB | Low resource |
| orca-mini | ⚡⚡⚡ | ⭐⭐⭐ | 6GB | 3GB | Lightweight |
| dolphin-mixtral | ⚡⚡ | ⭐⭐⭐⭐⭐ | 16GB | 8GB | Best quality |

---

## 🧪 TESTING

### Test Piper

```bash
curl -X POST http://localhost:5003/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello from Project Pegasus","voice":"en_US_male"}' \
  > output.wav
```

### Test Ollama

```bash
curl -X POST http://localhost:5004/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"What is artificial intelligence?"}'
```

### Test Full Integration

```bash
curl -X POST http://localhost:3001/api/llm/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Hello, who are you?"}'
```

---

## ✅ ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│                      http://localhost:3000                   │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────────┐
│              Main Backend Server (Express.js)               │
│                 http://localhost:3001                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Routes: /api/llm/generate, /api/llm/chat, /tts     │  │
│  └───────┬──────────────────────────┬──────────────────┘  │
└─────────┼──────────────────────────┼────────────────────┘
          │                          │
          ↓                          ↓
┌──────────────────────┐    ┌──────────────────────┐
│  Piper TTS Service   │    │ Ollama LLM Service   │
│  localhost:5003      │    │  localhost:5004      │
│                      │    │                      │
│ • /tts               │    │ • /generate          │
│ • /voices            │    │ • /chat              │
│ • /batch             │    │ • /models            │
└──────────────────────┘    └──────────────────────┘
         │                          │
         ↓                          ↓
┌──────────────────────┐    ┌──────────────────────┐
│    Piper Binary      │    │  Ollama API Service  │
│  (Voice Generation)  │    │  localhost:11434     │
│ • Models in          │    │                      │
│   ~/.piper/models    │    │ • LLM Models         │
└──────────────────────┘    │ • Embeddings         │
                            │ • Generation         │
                            └──────────────────────┘
```

---

## 🛠️ CONFIGURATION FILES

### `.env` (Project Root)

```env
# Backend
PORT=3001
DATABASE=./lala_ai.db

# Piper TTS
PIPER_ENABLED=true
PIPER_PATH=piper
PIPER_MODELS=~/.piper/models
PIPER_PORT=5003
PIPER_DEFAULT_VOICE=en_US-lessac-medium
PIPER_SPEED=1.0

# Ollama LLM
OLLAMA_ENABLED=true
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=mistral
OLLAMA_PORT=5004
OLLAMA_TEMPERATURE=0.7
```

---

## 💡 USAGE EXAMPLES

### Example 1: Generate Speech

```javascript
// In your React component
const playTTS = async (text, voice = 'en_US_male') => {
  const response = await fetch('/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice })
  });
  
  const audioBlob = await response.blob();
  const audio = new Audio(URL.createObjectURL(audioBlob));
  audio.play();
};

// Usage
playTTS("Hello from Project Pegasus!", "en_US_male");
```

### Example 2: Get LLM Response

```javascript
// In your backend
const getLLMResponse = async (userMessage) => {
  const response = await fetch('http://localhost:5004/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: userMessage,
      temperature: 0.7
    })
  });
  
  const data = await response.json();
  return data.response;
};
```

### Example 3: Chat with LLM

```javascript
// Chat endpoint
app.post('/api/llm/chat', async (req, res) => {
  const { messages } = req.body;
  
  const response = await fetch('http://localhost:5004/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      model: 'mistral'
    })
  });
  
  const data = await response.json();
  res.json(data);
});
```

---

## 🐛 COMMON ISSUES & SOLUTIONS

### Issue: "Piper command not found"
```bash
# Solution 1: Check if installed
pip list | grep piper-tts

# Solution 2: Reinstall
pip install piper-tts

# Solution 3: Check path in .env
PIPER_PATH=C:\Users\YourUsername\.local\bin\piper.exe
```

### Issue: "Cannot reach Ollama"
```bash
# Solution 1: Check if running
curl http://localhost:11434/api/tags

# Solution 2: Start Ollama
ollama serve

# Solution 3: Check firewall (Windows)
# Settings > Firewall > Allow apps through > Add Ollama
```

### Issue: "Model not found"
```bash
# Solution: Download model
ollama pull mistral

# Verify
ollama list
```

### Issue: Slow responses
```bash
# Use faster model
OLLAMA_MODEL=phi  # Fastest (~2.7GB)

# Or
OLLAMA_MODEL=orca-mini  # Lightweight (~3GB)
```

---

## 📚 DETAILED DOCUMENTATION

For more detailed information, see:
- **PIPER_OLLAMA_INTEGRATION.md** - Complete integration guide
- **QUICKSTART_PIPER_OLLAMA.md** - Quick reference
- **README.md** - Project overview

---

## 🎯 NEXT STEPS

1. **Run Setup Scripts** (setup-piper.bat / setup-ollama.bat)
2. **Start All Services** (5 terminals)
3. **Test Endpoints** (curl commands above)
4. **Customize Configuration** (.env file)
5. **Integrate with Frontend** (React components)
6. **Deploy** (Docker or cloud)

---

## 📦 SYSTEM REQUIREMENTS

- **RAM**: 
  - Minimum: 4GB
  - Recommended: 8GB+
- **Disk Space**:
  - Piper: ~2GB
  - Ollama Model: 2-8GB (depends on model)
- **Internet**: For downloading models
- **Ports**: 3000, 3001, 5003, 5004, 11434

---

## ✨ KEY FEATURES

✅ **Multiple Voices** - 4 built-in voices (English, Hindi)  
✅ **Multiple LLM Models** - 5+ models to choose from  
✅ **Easy Setup** - Automated setup scripts  
✅ **Quick Linking** - Connect your existing Piper/Ollama  
✅ **Production Ready** - Error handling, logging, health checks  
✅ **Microservices** - Independent, scalable services  
✅ **Open Source** - MIT License  

---

## 🚀 YOU'RE ALL SET!

Your Project Pegasus now has:
- 🎤 Text-to-Speech via Piper
- 🧠 LLM Generation via Ollama
- 🔌 Easy integration endpoints
- 📖 Complete documentation
- ⚡ Automated setup scripts

**Happy coding!** 🎉

---

**Made with ❤️ for Project Pegasus**

*Your AI, Your Rules, Your Control* 🚀
