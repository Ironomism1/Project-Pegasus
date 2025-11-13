@echo off
REM ==========================================
REM Piper TTS Setup Script for Windows
REM ==========================================

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║  🎤 PIPER TTS SETUP FOR PROJECT PEGASUS - WINDOWS      ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Check Python installation
echo [1/6] Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python not found! Please install Python 3.8+ from https://www.python.org
    pause
    exit /b 1
)
echo ✅ Python found

REM Install Piper via pip
echo.
echo [2/6] Installing Piper TTS via pip...
pip install piper-tts
if %errorlevel% neq 0 (
    echo ⚠️  Warning: Piper installation may have failed
) else (
    echo ✅ Piper installed successfully
)

REM Download espeak-ng
echo.
echo [3/6] Downloading espeak-ng (Text-to-Speech engine)...
echo Please download from: https://github.com/espeak-ng/espeak-ng/releases
echo Download "espeak-ng-X.XX_Windows-x64.msi" and run the installer
echo.
pause

REM Create Piper models directory
echo.
echo [4/6] Creating Piper models directory...
set PIPER_MODELS=%USERPROFILE%\.piper\models
if not exist "%PIPER_MODELS%" mkdir "%PIPER_MODELS%"
echo ✅ Created: %PIPER_MODELS%

REM Download Piper models
echo.
echo [5/6] Downloading Piper voice models...
echo This will download models to: %PIPER_MODELS%
echo.
python -m piper --download
if %errorlevel% equ 0 (
    echo ✅ Models downloaded successfully
) else (
    echo ⚠️  Warning: Model download may have encountered issues
)

REM Create .env file
echo.
echo [6/6] Creating .env configuration file...
if not exist ".env" (
    (
        echo # Piper Configuration
        echo PIPER_ENABLED=true
        echo PIPER_PATH=piper
        echo PIPER_MODELS=%PIPER_MODELS%
        echo PIPER_PORT=5003
        echo PIPER_DEFAULT_VOICE=en_US-lessac-medium
        echo PIPER_SPEED=1.0
        echo.
        echo # Ollama Configuration
        echo OLLAMA_ENABLED=true
        echo OLLAMA_URL=http://localhost:11434
        echo OLLAMA_MODEL=mistral
        echo OLLAMA_PORT=5004
        echo OLLAMA_TEMPERATURE=0.7
    ) > .env
    echo ✅ Created .env file
) else (
    echo ⚠️  .env file already exists, skipping
)

REM Verify installation
echo.
echo [VERIFY] Testing Piper installation...
echo "Hello from Project Pegasus" | piper --model en_US-lessac-medium --output_file test_audio.wav
if exist test_audio.wav (
    echo ✅ Piper test successful! Audio file created.
    del test_audio.wav
) else (
    echo ❌ Piper test failed. Please check installation.
)

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║  ✅ PIPER SETUP COMPLETE                              ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo Next steps:
echo 1. Start Piper service:
echo    node backend\piper-service.js
echo.
echo 2. Test Piper:
echo    curl -X POST http://localhost:5003/tts ^
echo      -H "Content-Type: application/json" ^
echo      -d "{\"text\":\"Hello world\",\"voice\":\"en_US_male\"}" ^
echo      > output.wav
echo.
echo Available Voices:
echo   - en_US_male (default)
echo   - en_US_female
echo   - en_GB
echo   - hi_IN (Hindi)
echo.
pause
