# 🎉 PIPER + OLLAMA SETUP - INSTALLATION GUIDE

## 📦 WHAT YOU HAVE NOW

```
Project Pegasus/
├── 🎤 PIPER TTS (Text-to-Speech)
│   ├── ✅ backend/piper-service.js (Microservice)
│   ├── ✅ setup-piper.bat (Windows automation)
│   ├── ✅ setup-piper.sh (Mac/Linux automation)
│   └── ✅ Multiple voice models available
│
├── 🧠 OLLAMA LLM (Language Models)
│   ├── ✅ backend/ollama-service.js (Microservice)
│   ├── ✅ setup-ollama.bat (Windows automation)
│   ├── ✅ setup-ollama.sh (Mac/Linux automation)
│   └── ✅ Multiple models (mistral, neural-chat, etc)
│
└── 📚 DOCUMENTATION
    ├── ✅ PIPER_OLLAMA_INTEGRATION.md (500+ lines complete guide)
    ├── ✅ QUICKSTART_PIPER_OLLAMA.md (Quick reference)
    ├── ✅ PIPER_OLLAMA_SETUP_COMPLETE.md (This file)
    └── ✅ README.md (Updated with links)
```

---

## 🏃 FASTEST SETUP - 3 COMMANDS

### Windows:
```powershell
# Run these in sequence (wait for each to finish)

# Command 1: Install Piper
setup-piper.bat

# Command 2: Install Ollama
setup-ollama.bat

# Command 3: Start everything (follow terminal instructions)
```

### Mac/Linux:
```bash
# Run these in sequence
chmod +x setup-piper.sh setup-ollama.sh
./setup-piper.sh
./setup-ollama.sh
```

---

## 🎯 STEP-BY-STEP MANUAL SETUP

### Windows Setup

#### Step 1: Install Piper TTS
```bash
# Option A: Automated
setup-piper.bat

# Option B: Manual
pip install piper-tts

# Download voice models
python -m piper --download
```

#### Step 2: Install Ollama
```bash
# Option A: Automated
setup-ollama.bat

# Option B: Manual
# 1. Download from https://ollama.ai
# 2. Install and run
# 3. Download model: ollama pull mistral
```

#### Step 3: Download Model
```bash
# If not already done by setup script
ollama pull mistral    # Recommended (~4GB)
```

#### Step 4: Create .env File
```env
PIPER_ENABLED=true
PIPER_PATH=piper
PIPER_MODELS=%USERPROFILE%\.piper\models
PIPER_PORT=5003

OLLAMA_ENABLED=true
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=mistral
OLLAMA_PORT=5004
```

#### Step 5: Start Services (Open 5 Terminal Tabs)

**Terminal 1: Piper TTS**
```bash
node backend/piper-service.js
# Output: ✅ 🎤 Piper TTS Service running on http://localhost:5003
```

**Terminal 2: Ollama (ensure it's running)**
```bash
ollama serve
# Output: Ready to accept connections
```

**Terminal 3: Ollama Service**
```bash
cd backend
node ollama-service.js
# Output: ✅ 🧠 Ollama LLM Service running on http://localhost:5004
```

**Terminal 4: Main Backend**
```bash
cd backend
node server.js
# Output: ✅ Server running on http://localhost:3001
```

**Terminal 5: Frontend**
```bash
npm start
# Output: Opens http://localhost:3000
```

---

## 🎤 LINKING YOUR EXTERNAL PIPER

### If Piper is installed in a different location:

#### Option 1: Update .env
```env
# Windows
PIPER_PATH=C:\Users\YourName\AppData\Local\Programs\piper\piper.exe

# Mac
PIPER_PATH=/usr/local/bin/piper

# Linux
PIPER_PATH=/usr/bin/piper
```

#### Option 2: Update Code
Edit `backend/piper-service.js` line 8:
```javascript
const PIPER_PATH = process.env.PIPER_PATH || 'C:\\your\\custom\\path\\piper.exe';
```

#### Option 3: Check Current Piper Location
```bash
# Windows
where piper

# Mac/Linux
which piper
```

---

## 🧠 DOWNLOAD OLLAMA MODELS

### Available Models:

| Model | Download | Size | Speed | Best For |
|-------|----------|------|-------|----------|
| mistral | `ollama pull mistral` | ~4GB | ⚡⚡⚡ Fast | ✅ **RECOMMENDED** |
| neural-chat | `ollama pull neural-chat` | ~4GB | ⚡⚡⚡ Fast | Chat |
| phi | `ollama pull phi` | ~2.7GB | ⚡⚡⚡⚡ Very Fast | Low resource |
| orca-mini | `ollama pull orca-mini` | ~3GB | ⚡⚡⚡ | Lightweight |
| dolphin-mixtral | `ollama pull dolphin-mixtral` | ~8GB | ⚡⚡ Medium | Best quality |
| llama2 | `ollama pull llama2` | ~4GB | ⚡⚡ Medium | Versatile |

### Download Command:
```bash
# Recommended for first-time setup:
ollama pull mistral

# Or choose from above
ollama pull neural-chat
```

### Switch Model:
```bash
# 1. Download new model
ollama pull neural-chat

# 2. Update .env
OLLAMA_MODEL=neural-chat

# 3. Restart ollama-service.js
```

---

## 🎤 AVAILABLE PIPER VOICES

### English Voices:
```bash
# US English Male (default)
"voice": "en_US_male"

# US English Female
"voice": "en_US_female"

# UK English
"voice": "en_GB"
```

### Other Languages:
```bash
# Hindi
"voice": "hi_IN"

# More languages available in Hugging Face
# https://huggingface.co/rhasspy/piper-voices
```

### Add New Voice:
```javascript
// Edit backend/piper-service.js

const VOICES = {
  'hi_IN': {
    model: 'hi_IN-google-medium',
    language: 'Hindi',
    gender: 'Male'
  }
};
```

---

## 🧪 TEST YOUR SETUP

### Test 1: Piper TTS

```bash
curl -X POST http://localhost:5003/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello from Project Pegasus","voice":"en_US_male"}' \
  > test_audio.wav

# Should create test_audio.wav file
```

### Test 2: Ollama LLM

```bash
curl -X POST http://localhost:5004/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"What is Project Pegasus?"}'

# Should return LLM response
```

### Test 3: Full Integration

```bash
curl -X POST http://localhost:3001/api/llm/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Hello, who are you?"}'

# Should return unified response
```

---

## 📊 SERVICE ARCHITECTURE

```
┌─────────────────────┐
│  Your Browser       │
│ :3000 (Frontend)    │
└──────────┬──────────┘
           │ HTTP
           ↓
┌─────────────────────────────┐
│ Express.js Backend Server   │
│ :3001 (Main API)            │
└──────┬──────────────┬────────┘
       │              │
       ↓ HTTP         ↓ HTTP
┌────────────┐   ┌──────────────────┐
│ Piper TTS  │   │ Ollama LLM       │
│ :5003      │   │ :5004            │
├────────────┤   ├──────────────────┤
│ Speech     │   │ Text Generation  │
│ Synthesis  │   │ Chat             │
│            │   │ Embeddings       │
└─────┬──────┘   └────────┬─────────┘
      │ System Call       │ HTTP to :11434
      ↓                   ↓
  Piper Binary      Ollama Binary
```

---

## 🎯 QUICK REFERENCE

### Environment Variables (.env)

```env
# Piper Configuration
PIPER_ENABLED=true              # Enable/disable
PIPER_PATH=piper                # Path to piper executable
PIPER_MODELS=~/.piper/models    # Models directory
PIPER_PORT=5003                 # Service port
PIPER_DEFAULT_VOICE=en_US_male  # Default voice
PIPER_SPEED=1.0                 # Speech speed

# Ollama Configuration  
OLLAMA_ENABLED=true             # Enable/disable
OLLAMA_URL=http://localhost:11434  # Ollama API
OLLAMA_MODEL=mistral            # Default model
OLLAMA_PORT=5004                # Service port
OLLAMA_TEMPERATURE=0.7          # Creativity (0-1)
```

### Port Reference

| Port | Service | Status |
|------|---------|--------|
| 3000 | Frontend | Your UI |
| 3001 | Backend | Main API |
| 5003 | Piper TTS | Text→Speech |
| 5004 | Ollama Wrapper | LLM API |
| 11434 | Ollama Native | Direct Ollama |

---

## 🐛 TROUBLESHOOTING

### Problem: "Piper command not found"
```bash
# Solution 1: Check installation
pip list | grep piper

# Solution 2: Reinstall
pip install piper-tts --upgrade

# Solution 3: Full path in .env
PIPER_PATH=C:\Users\YourName\.local\bin\piper.exe
```

### Problem: "Cannot connect to Ollama"
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama
ollama serve

# Check Windows Firewall
# Settings > Security > Firewall > Allow apps through
```

### Problem: "Model not found"
```bash
# List available models
ollama list

# Download missing model
ollama pull mistral
```

### Problem: Services not talking to each other
```bash
# Check all services are running
# Terminal 1: piper-service.js
# Terminal 2: ollama serve
# Terminal 3: ollama-service.js
# Terminal 4: server.js (backend)
# Terminal 5: npm start (frontend)

# Check ports
netstat -ano | findstr :5003   # Piper
netstat -ano | findstr :5004   # Ollama service
netstat -ano | findstr :11434  # Ollama API
```

### Problem: Slow responses
```bash
# Use faster model
OLLAMA_MODEL=phi    # Fastest

# Or
OLLAMA_MODEL=orca-mini  # Balanced

# Ensure 8GB+ RAM available
# First request takes longer (model loading)
```

---

## 📚 COMPLETE DOCUMENTATION

For more details, see:

1. **PIPER_OLLAMA_INTEGRATION.md**
   - Detailed setup instructions
   - Code integration examples
   - Advanced configuration
   - Docker setup

2. **QUICKSTART_PIPER_OLLAMA.md**
   - Quick reference guide
   - Common tasks
   - All endpoints

3. **README.md**
   - Project overview
   - Quick start
   - Features

4. **PIPER_OLLAMA_SETUP_COMPLETE.md**
   - Architecture overview
   - Usage examples
   - System requirements

---

## ✅ VERIFICATION CHECKLIST

After setup, verify everything:

- [ ] Piper installed: `piper --version`
- [ ] Ollama installed: `ollama --version`
- [ ] Piper models downloaded: Check `~/.piper/models`
- [ ] Ollama model downloaded: `ollama list`
- [ ] .env file created with correct paths
- [ ] Terminal 1: `node backend/piper-service.js` ✅
- [ ] Terminal 2: `ollama serve` ✅
- [ ] Terminal 3: `node backend/ollama-service.js` ✅
- [ ] Terminal 4: `node backend/server.js` ✅
- [ ] Terminal 5: `npm start` ✅
- [ ] Browser opens at http://localhost:3000 ✅
- [ ] Test Piper: GET speech generated ✅
- [ ] Test Ollama: GET LLM response ✅
- [ ] Frontend shows chat interface ✅

---

## 🚀 NEXT STEPS

1. ✅ Run setup scripts or manual setup
2. ✅ Start all 5 services
3. ✅ Test with curl commands
4. ✅ Open http://localhost:3000
5. ✅ Try the chat interface
6. ✅ Customize voices/models
7. ✅ Deploy to production

---

## 💬 VOICE/MODEL CUSTOMIZATION

### Change Piper Voice:
```javascript
// In React component
const playTTS = async (text, voice = 'en_GB') => {
  const response = await fetch('/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice })
  });
  // ...
};
```

### Change Ollama Model:
```bash
# 1. Download model
ollama pull neural-chat

# 2. Update .env
OLLAMA_MODEL=neural-chat

# 3. Restart service
```

### Adjust TTS Speed:
```javascript
// Play faster or slower speech
const playTTS = async (text, voice, speed = 1.2) => {
  const response = await fetch('/tts', {
    method: 'POST',
    body: JSON.stringify({ text, voice, speed })
  });
};
```

---

## 🎉 YOU'RE ALL SET!

Your Project Pegasus now has:
- 🎤 Professional Text-to-Speech (Piper)
- 🧠 Advanced Language Models (Ollama)
- ⚡ Fast, local, offline-capable AI
- 📖 Complete documentation
- 🔧 Easy setup and configuration
- 🚀 Ready for production

---

**Happy coding! Your AI, Your Rules, Your Control** 🚀

---

## 📞 NEED MORE HELP?

- **Piper**: https://github.com/rhasspy/piper
- **Ollama**: https://github.com/ollama/ollama
- **Project Pegasus**: https://github.com/Ironomism1/Project-Pegasus

Last Updated: November 13, 2025 ✅
