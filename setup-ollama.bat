@echo off
REM ==========================================
REM Ollama LLM Setup Script for Windows
REM ==========================================

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║  🧠 OLLAMA LLM SETUP FOR PROJECT PEGASUS - WINDOWS    ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Check if Ollama is installed
echo [1/4] Checking Ollama installation...
ollama --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Ollama not found!
    echo.
    echo Please download and install Ollama from: https://ollama.ai
    echo.
    echo Or use this direct download:
    echo   https://ollama.ai/download
    echo.
    pause
    exit /b 1
)
ollama --version
echo ✅ Ollama found

REM Start Ollama service (if not already running)
echo.
echo [2/4] Starting Ollama service...
echo Checking if Ollama is running on http://localhost:11434...
curl -s http://localhost:11434/api/tags >nul 2>&1
if %errorlevel% neq 0 (
    echo Starting Ollama in background...
    start /B ollama serve
    timeout /t 5 /nobreak
) else (
    echo ✅ Ollama is already running
)

REM Download default model
echo.
echo [3/4] Downloading Ollama model...
echo.
echo Available models:
echo   1. mistral (Recommended - Fast, good quality, ~4GB)
echo   2. neural-chat (Optimized for chat, ~4GB)
echo   3. dolphin-mixtral (Good reasoning, ~8GB)
echo   4. orca-mini (Lightweight, ~3GB)
echo   5. phi (Very fast, ~2.7GB)
echo.
set /p MODEL_CHOICE="Select model (default=1): "
if "%MODEL_CHOICE%"=="" set MODEL_CHOICE=1

if "%MODEL_CHOICE%"=="1" set MODEL=mistral
if "%MODEL_CHOICE%"=="2" set MODEL=neural-chat
if "%MODEL_CHOICE%"=="3" set MODEL=dolphin-mixtral
if "%MODEL_CHOICE%"=="4" set MODEL=orca-mini
if "%MODEL_CHOICE%"=="5" set MODEL=phi

if "%MODEL%"=="" (
    set MODEL=mistral
    echo Using default: mistral
)

echo.
echo Downloading %MODEL% (this may take several minutes)...
ollama pull %MODEL%
if %errorlevel% equ 0 (
    echo ✅ Model %MODEL% downloaded successfully
) else (
    echo ❌ Model download failed
    pause
    exit /b 1
)

REM Create/Update .env file
echo.
echo [4/4] Updating .env configuration...
if exist .env (
    echo Updating existing .env file...
    (
        for /f "tokens=*" %%A in (.env) do (
            if not "%%A"=="" (
                if not "%%A:~0,12%"=="OLLAMA_MODEL" (
                    echo %%A
                )
            )
        )
        echo OLLAMA_MODEL=%MODEL%
    ) > .env.tmp
    move /Y .env.tmp .env
) else (
    (
        echo # Ollama Configuration
        echo OLLAMA_ENABLED=true
        echo OLLAMA_URL=http://localhost:11434
        echo OLLAMA_MODEL=%MODEL%
        echo OLLAMA_PORT=5004
        echo OLLAMA_TEMPERATURE=0.7
    ) > .env
)
echo ✅ Updated .env file

REM Verify installation
echo.
echo [VERIFY] Testing Ollama connection...
curl -s -X POST http://localhost:11434/api/generate ^
  -H "Content-Type: application/json" ^
  -d "{\"model\":\"%MODEL%\",\"prompt\":\"Hello\",\"stream\":false}" >nul 2>&1

if %errorlevel% equ 0 (
    echo ✅ Ollama test successful!
) else (
    echo ⚠️  Could not reach Ollama. Make sure it's running.
)

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║  ✅ OLLAMA SETUP COMPLETE                             ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo Model installed: %MODEL%
echo.
echo Next steps:
echo 1. Start Ollama service (if not already running):
echo    ollama serve
echo.
echo 2. Start Ollama backend service:
echo    node backend\ollama-service.js
echo.
echo 3. Test Ollama:
echo    curl -X POST http://localhost:5004/generate ^
echo      -H "Content-Type: application/json" ^
echo      -d "{\"prompt\":\"Hello, who are you?\"}"
echo.
echo Installed Model: %MODEL%
echo Port: 11434 (Ollama API)
echo Service Port: 5004 (Project Pegasus)
echo.
echo To use a different model:
echo   ollama pull ^<model-name^>
echo.
pause
