#!/bin/bash

# ==========================================
# Piper TTS Setup Script for Mac/Linux
# ==========================================

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║  🎤 PIPER TTS SETUP FOR PROJECT PEGASUS - MAC/LINUX   ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Check Python installation
echo "[1/6] Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found! Please install Python 3.8+"
    echo "   Mac: brew install python3"
    echo "   Linux: sudo apt-get install python3 python3-pip"
    exit 1
fi
python3 --version
echo "✅ Python found"

# Install espeak-ng (required dependency)
echo ""
echo "[2/6] Installing espeak-ng (Text-to-Speech engine)..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # Mac
    if ! command -v brew &> /dev/null; then
        echo "❌ Homebrew not found! Please install Homebrew first:"
        echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
    brew install espeak-ng
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    sudo apt-get update
    sudo apt-get install -y espeak-ng
else
    echo "⚠️  Unsupported OS. Please install espeak-ng manually."
fi
echo "✅ espeak-ng installed"

# Install Piper via pip
echo ""
echo "[3/6] Installing Piper TTS via pip..."
pip3 install piper-tts
if [ $? -eq 0 ]; then
    echo "✅ Piper installed successfully"
else
    echo "❌ Piper installation failed"
    exit 1
fi

# Create Piper models directory
echo ""
echo "[4/6] Creating Piper models directory..."
PIPER_MODELS=~/.piper/models
mkdir -p "$PIPER_MODELS"
echo "✅ Created: $PIPER_MODELS"

# Download Piper models
echo ""
echo "[5/6] Downloading Piper voice models..."
echo "This will download models to: $PIPER_MODELS"
echo ""
python3 -m piper --download
if [ $? -eq 0 ]; then
    echo "✅ Models downloaded successfully"
else
    echo "⚠️  Warning: Model download may have encountered issues"
fi

# Create .env file
echo ""
echo "[6/6] Creating .env configuration file..."
if [ ! -f ".env" ]; then
    cat > .env << EOF
# Piper Configuration
PIPER_ENABLED=true
PIPER_PATH=/usr/local/bin/piper
PIPER_MODELS=$PIPER_MODELS
PIPER_PORT=5003
PIPER_DEFAULT_VOICE=en_US-lessac-medium
PIPER_SPEED=1.0

# Ollama Configuration
OLLAMA_ENABLED=true
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=mistral
OLLAMA_PORT=5004
OLLAMA_TEMPERATURE=0.7
EOF
    echo "✅ Created .env file"
else
    echo "⚠️  .env file already exists, skipping"
fi

# Verify installation
echo ""
echo "[VERIFY] Testing Piper installation..."
echo "Hello from Project Pegasus" | piper --model en_US-lessac-medium --output_file test_audio.wav
if [ -f test_audio.wav ]; then
    echo "✅ Piper test successful! Audio file created."
    rm test_audio.wav
else
    echo "❌ Piper test failed. Please check installation."
fi

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║  ✅ PIPER SETUP COMPLETE                              ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo "1. Start Piper service:"
echo "   node backend/piper-service.js"
echo ""
echo "2. Test Piper:"
echo '   curl -X POST http://localhost:5003/tts \'
echo '     -H "Content-Type: application/json" \'
echo '     -d "{\"text\":\"Hello world\",\"voice\":\"en_US_male\"}" \'
echo "     > output.wav"
echo ""
echo "Available Voices:"
echo "   - en_US_male (default)"
echo "   - en_US_female"
echo "   - en_GB"
echo "   - hi_IN (Hindi)"
echo ""
