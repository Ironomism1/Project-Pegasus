# 🚀 QUICK REFERENCE - PIPER + OLLAMA

## ⚡ FASTEST START (Copy & Paste)

### Windows - Run Once:
```bash
setup-piper.bat
setup-ollama.bat
```

### Mac/Linux - Run Once:
```bash
chmod +x setup-*.sh
./setup-piper.sh
./setup-ollama.sh
```

---

## 🏃 START SERVICES (Every Time - 5 Terminals)

**Terminal 1:**
```bash
node backend/piper-service.js
```

**Terminal 2:**
```bash
ollama serve
```

**Terminal 3:**
```bash
cd backend && node ollama-service.js
```

**Terminal 4:**
```bash
cd backend && node server.js
```

**Terminal 5:**
```bash
npm start
```

---

## 🧪 TEST COMMANDS

### Test Piper:
```bash
curl -X POST http://localhost:5003/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello","voice":"en_US_male"}'
```

### Test Ollama:
```bash
curl -X POST http://localhost:5004/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Who are you?"}'
```

---

## 🎯 PORTS

| Port | Service |
|------|---------|
| 3000 | Frontend |
| 3001 | Backend |
| 5003 | Piper |
| 5004 | Ollama Service |
| 11434 | Ollama API |

---

## 📁 KEY FILES

- **PIPER_OLLAMA_INTEGRATION.md** - Complete guide
- **INSTALLATION_GUIDE.md** - Step by step
- **QUICKSTART_PIPER_OLLAMA.md** - Quick ref
- **backend/piper-service.js** - TTS service
- **backend/ollama-service.js** - LLM service

---

## 🎤 VOICES

```
en_US_male (default)
en_US_female
en_GB
hi_IN (Hindi)
```

---

## 🧠 MODELS

```
mistral (Recommended)
neural-chat
phi (Fast)
orca-mini (Light)
dolphin-mixtral (Best)
```

---

## 🔗 LINK EXTERNAL PIPER

Edit `.env`:
```env
PIPER_PATH=C:\your\path\piper.exe
```

---

## 🐛 QUICK FIXES

**"Piper not found":**
```bash
pip install piper-tts
```

**"Can't reach Ollama":**
```bash
ollama serve
```

**"Model not found":**
```bash
ollama pull mistral
```

---

**Repository:** https://github.com/Ironomism1/Project-Pegasus  
**Updated:** Nov 13, 2025 ✅
