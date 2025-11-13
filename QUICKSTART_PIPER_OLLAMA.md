# 🚀 QUICK START GUIDE - PIPER + OLLAMA

## ⚡ FASTEST SETUP (5 Minutes)

### Step 1: Piper Setup (Windows)

```bash
# Run in PowerShell or Command Prompt
setup-piper.bat

# What it does:
# ✅ Installs Piper via pip
# ✅ Downloads voice models (~1GB)
# ✅ Creates .env configuration
# ✅ Tests the installation
```

### Step 2: Ollama Setup (Windows)

```bash
# Run the setup script
setup-ollama.bat

# What it does:
# ✅ Installs Ollama (if needed)
# ✅ Starts Ollama service
# ✅ Downloads LLM model (~4-8GB)
# ✅ Updates .env configuration
# ✅ Tests the connection
```

### Step 3: Mac/Linux Setup

```bash
# For Piper
chmod +x setup-piper.sh
./setup-piper.sh

# For Ollama
chmod +x setup-ollama.sh
./setup-ollama.sh
```

---

## 🏃 START PROJECT PEGASUS

### Terminal 1: Start Piper TTS Service

```bash
# Windows
node backend/piper-service.js

# Output should show:
# ✅ 🎤 Piper TTS Service running on http://localhost:5003
```

### Terminal 2: Start Ollama Service

```bash
# Windows
ollama serve

# Or just ensure Ollama is running (it starts on boot after installation)
# It runs on http://localhost:11434
```

### Terminal 3: Start Ollama Backend Service

```bash
cd backend
node ollama-service.js

# Output should show:
# ✅ 🧠 Ollama LLM Service running on http://localhost:5004
```

### Terminal 4: Start Backend Server

```bash
cd backend
node server.js

# Output should show:
# ✅ Server running on http://localhost:3001
```

### Terminal 5: Start Frontend

```bash
npm start

# Opens http://localhost:3000 in your browser
```

---

## 🧪 QUICK TESTS

### Test Piper TTS

```bash
# Windows
curl -X POST http://localhost:5003/tts ^
  -H "Content-Type: application/json" ^
  -d "{\"text\":\"Hello from Project Pegasus\",\"voice\":\"en_US_male\"}" ^
  > output.wav

# Mac/Linux
curl -X POST http://localhost:5003/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello from Project Pegasus","voice":"en_US_male"}' \
  > output.wav
```

### Test Ollama

```bash
# Windows
curl -X POST http://localhost:5004/generate ^
  -H "Content-Type: application/json" ^
  -d "{\"prompt\":\"Hello, who are you?\"}"

# Mac/Linux
curl -X POST http://localhost:5004/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Hello, who are you?"}'
```

### Test Full Integration

```bash
# Windows
curl -X POST http://localhost:3001/api/llm/generate ^
  -H "Content-Type: application/json" ^
  -d "{\"prompt\":\"What is Project Pegasus?\"}"

# Mac/Linux
curl -X POST http://localhost:3001/api/llm/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"What is Project Pegasus?"}'
```

---

## 📦 WHAT EACH COMPONENT DOES

| Component | Port | Purpose | Status |
|-----------|------|---------|--------|
| **Frontend** | 3000 | React UI for user interaction | http://localhost:3000 |
| **Backend** | 3001 | Main server handling API requests | http://localhost:3001 |
| **Piper TTS** | 5003 | Text-to-Speech service | http://localhost:5003 |
| **Ollama Service** | 5004 | LLM wrapper service | http://localhost:5004 |
| **Ollama API** | 11434 | Raw Ollama API | http://localhost:11434 |

---

## 🎤 PIPER VOICES AVAILABLE

| Voice ID | Model | Language | Gender | Use Case |
|----------|-------|----------|--------|----------|
| `en_US_male` | en_US-lessac-medium | English US | Male | Default, natural |
| `en_US_female` | en_US-hfc_female-medium | English US | Female | Alternative voice |
| `en_GB` | en_GB-alan-medium | English UK | Male | British accent |
| `hi_IN` | hi_IN-google-medium | Hindi | Male | Hindi language |

### Usage:

```bash
# Change voice by using different voice IDs
curl -X POST http://localhost:5003/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Namaste","voice":"hi_IN"}'
```

---

## 🧠 OLLAMA MODELS AVAILABLE

| Model | Size | Speed | Quality | Best For |
|-------|------|-------|---------|----------|
| **mistral** | ~4GB | ⚡⚡⚡ Fast | ⭐⭐⭐⭐ | Recommended |
| **neural-chat** | ~4GB | ⚡⚡⚡ Fast | ⭐⭐⭐⭐ | Chat |
| **dolphin-mixtral** | ~8GB | ⚡⚡ Medium | ⭐⭐⭐⭐⭐ | Reasoning |
| **orca-mini** | ~3GB | ⚡⚡⚡⚡ Very Fast | ⭐⭐⭐ | Low resource |
| **phi** | ~2.7GB | ⚡⚡⚡⚡ Very Fast | ⭐⭐⭐ | Ultra-fast |
| **llama2** | ~4GB | ⚡⚡ Medium | ⭐⭐⭐⭐ | Versatile |

### Switch Model:

```bash
# Download a new model
ollama pull neural-chat

# Update .env
OLLAMA_MODEL=neural-chat

# Restart services
```

---

## 🔗 LINKING YOUR EXTERNAL PIPER

If you have Piper installed elsewhere:

### Option 1: Update Path in .env

```env
# Replace path to your Piper installation
PIPER_PATH=C:\path\to\your\piper\piper.exe
# Mac/Linux:
# PIPER_PATH=/path/to/piper/piper
```

### Option 2: Use System Piper

If Piper is in your system PATH:

```env
PIPER_PATH=piper
```

### Option 3: Direct Path in Code

Edit `backend/piper-service.js`:

```javascript
const PIPER_PATH = process.env.PIPER_PATH || 'C:\\your\\custom\\path\\piper.exe';
```

---

## ⚙️ ENVIRONMENT VARIABLES

Create `.env` file in project root:

```env
# === BACKEND ===
PORT=3001
DATABASE=./lala_ai.db

# === PIPER TTS ===
PIPER_ENABLED=true
PIPER_PATH=piper
PIPER_MODELS=~/.piper/models
PIPER_PORT=5003
PIPER_DEFAULT_VOICE=en_US-lessac-medium
PIPER_SPEED=1.0

# === OLLAMA LLM ===
OLLAMA_ENABLED=true
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=mistral
OLLAMA_PORT=5004
OLLAMA_TEMPERATURE=0.7
```

---

## 🐛 TROUBLESHOOTING

### "Piper command not found"

```bash
# Check installation
where piper              # Windows
which piper              # Mac/Linux

# Reinstall
pip install piper-tts

# Or add to .env
PIPER_PATH=C:\Users\YourUsername\.local\bin\piper.exe
```

### "Cannot reach Ollama"

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama manually
ollama serve

# Check firewall (Windows)
# Settings > Security > Firewall > Allow apps through
```

### "Model not found"

```bash
# List available models
ollama list

# Download missing model
ollama pull mistral

# Check .env OLLAMA_MODEL matches
```

### High Memory Usage

```bash
# Switch to smaller model
ollama pull orca-mini
# Update .env
OLLAMA_MODEL=orca-mini
```

### Slow Response Times

```bash
# Check if model is loading
# First request takes longer as model loads into memory

# Use faster model
ollama pull phi
# Update .env
OLLAMA_MODEL=phi
```

---

## 📝 COMMON TASKS

### Add New Language to Piper

```bash
# 1. Check available models at:
#    https://huggingface.co/rhasspy/piper-voices

# 2. Model names follow pattern: [language_country]-[speaker]-[quality]
#    Example: hi_IN-google-medium (Hindi India Google voice medium quality)

# 3. Update in piper-service.js:
const VOICES = {
  'hi_IN': {
    model: 'hi_IN-google-medium',
    language: 'Hindi',
    gender: 'Male'
  }
};

# 4. Restart piper-service.js
node backend/piper-service.js
```

### Use Different LLM Model

```bash
# 1. List available
ollama list

# 2. Pull new model
ollama pull llama2

# 3. Update .env
OLLAMA_MODEL=llama2

# 4. Restart ollama-service.js
node backend/ollama-service.js
```

### Test Specific Configuration

```bash
# Test Piper with specific voice
curl -X POST http://localhost:5003/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Test","voice":"en_GB","speed":1.2}'

# Test Ollama with specific model
curl -X POST http://localhost:5004/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Hello","model":"mistral","temperature":0.5}'
```

---

## 🎯 NEXT STEPS

1. ✅ Run setup scripts (setup-piper.bat / setup-ollama.bat)
2. ✅ Start all 5 services in separate terminals
3. ✅ Open http://localhost:3000 in browser
4. ✅ Test the chat interface
5. ✅ Customize voices and models as needed

---

## 📞 NEED HELP?

- **Piper Issues**: https://github.com/rhasspy/piper
- **Ollama Issues**: https://github.com/ollama/ollama
- **Project Pegasus**: See PIPER_OLLAMA_INTEGRATION.md

---

**Your AI, Your Rules, Your Control** 🚀
