#!/bin/bash

# ==========================================
# Ollama LLM Setup Script for Mac/Linux
# ==========================================

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║  🧠 OLLAMA LLM SETUP FOR PROJECT PEGASUS - MAC/LINUX ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Check if Ollama is installed
echo "[1/4] Checking Ollama installation..."
if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama not found!"
    echo ""
    echo "Please download and install Ollama from:"
    echo "   Mac: https://ollama.ai"
    echo "   Linux: https://ollama.ai/download"
    echo ""
    echo "Or use these commands:"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "   Mac: brew install ollama"
    else
        echo "   Linux: curl -fsSL https://ollama.ai/install.sh | sh"
    fi
    exit 1
fi
ollama --version
echo "✅ Ollama found"

# Check if Ollama is running
echo ""
echo "[2/4] Checking Ollama service..."
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "✅ Ollama is already running"
else
    echo "Starting Ollama service in background..."
    nohup ollama serve > /dev/null 2>&1 &
    sleep 5
    if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        echo "✅ Ollama service started"
    else
        echo "❌ Failed to start Ollama"
        exit 1
    fi
fi

# Select and download model
echo ""
echo "[3/4] Selecting Ollama model..."
echo ""
echo "Available models:"
echo "  1. mistral (Recommended - Fast, good quality, ~4GB)"
echo "  2. neural-chat (Optimized for chat, ~4GB)"
echo "  3. dolphin-mixtral (Good reasoning, ~8GB)"
echo "  4. orca-mini (Lightweight, ~3GB)"
echo "  5. phi (Very fast, ~2.7GB)"
echo ""
read -p "Select model (default=1): " MODEL_CHOICE
MODEL_CHOICE=${MODEL_CHOICE:-1}

case $MODEL_CHOICE in
    1) MODEL="mistral" ;;
    2) MODEL="neural-chat" ;;
    3) MODEL="dolphin-mixtral" ;;
    4) MODEL="orca-mini" ;;
    5) MODEL="phi" ;;
    *) MODEL="mistral" ;;
esac

echo ""
echo "Downloading $MODEL (this may take several minutes)..."
ollama pull $MODEL
if [ $? -eq 0 ]; then
    echo "✅ Model $MODEL downloaded successfully"
else
    echo "❌ Model download failed"
    exit 1
fi

# Create/Update .env file
echo ""
echo "[4/4] Updating .env configuration..."
if [ -f ".env" ]; then
    # Update existing .env
    grep -v "OLLAMA_MODEL" .env > .env.tmp
    cat .env.tmp > .env
    rm .env.tmp
    echo "OLLAMA_MODEL=$MODEL" >> .env
    echo "Updating existing .env file..."
else
    # Create new .env
    cat > .env << EOF
# Ollama Configuration
OLLAMA_ENABLED=true
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=$MODEL
OLLAMA_PORT=5004
OLLAMA_TEMPERATURE=0.7
EOF
    echo "Creating new .env file..."
fi
echo "✅ Updated .env file"

# Verify installation
echo ""
echo "[VERIFY] Testing Ollama connection..."
RESULT=$(curl -s -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d "{\"model\":\"$MODEL\",\"prompt\":\"Hello\",\"stream\":false}" 2>/dev/null)

if [ $? -eq 0 ] && [ ! -z "$RESULT" ]; then
    echo "✅ Ollama test successful!"
else
    echo "⚠️  Could not reach Ollama. Make sure it's running."
fi

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║  ✅ OLLAMA SETUP COMPLETE                             ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "Model installed: $MODEL"
echo ""
echo "Next steps:"
echo "1. Start Ollama service (if not already running):"
echo "   ollama serve"
echo ""
echo "2. Start Ollama backend service:"
echo "   node backend/ollama-service.js"
echo ""
echo "3. Test Ollama:"
echo '   curl -X POST http://localhost:5004/generate \'
echo '     -H "Content-Type: application/json" \'
echo '     -d "{\"prompt\":\"Hello, who are you?\"}"'
echo ""
echo "Installed Model: $MODEL"
echo "Port: 11434 (Ollama API)"
echo "Service Port: 5004 (Project Pegasus)"
echo ""
echo "To use a different model:"
echo "   ollama pull <model-name>"
echo ""
