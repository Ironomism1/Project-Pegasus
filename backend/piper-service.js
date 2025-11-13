const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());

// Configuration from environment or defaults
const PIPER_PATH = process.env.PIPER_PATH || 'piper';
const MODELS_PATH = process.env.PIPER_MODELS || path.join(require('os').homedir(), '.piper', 'models');
const OUTPUT_DIR = path.join(__dirname, 'generated_audio');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Available voices configuration
const VOICES = {
  'en_US_male': {
    model: 'en_US-lessac-medium',
    language: 'English US',
    gender: 'Male'
  },
  'en_US_female': {
    model: 'en_US-hfc_female-medium',
    language: 'English US',
    gender: 'Female'
  },
  'en_GB': {
    model: 'en_GB-alan-medium',
    language: 'English UK',
    gender: 'Male'
  },
  'hi_IN': {
    model: 'hi_IN-google-medium',
    language: 'Hindi',
    gender: 'Male'
  },
};

console.log('🎤 Piper TTS Service Configuration:');
console.log('   Piper Path:', PIPER_PATH);
console.log('   Models Path:', MODELS_PATH);
console.log('   Output Directory:', OUTPUT_DIR);
console.log('   Available Voices:', Object.keys(VOICES).length);

/**
 * POST /tts
 * Convert text to speech
 * Body: { text: string, voice?: string, speed?: number }
 */
app.post('/tts', async (req, res) => {
  try {
    const { text, voice = 'en_US_male', speed = 1.0 } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!VOICES[voice]) {
      return res.status(400).json({ 
        error: 'Invalid voice', 
        availableVoices: Object.keys(VOICES) 
      });
    }

    const modelName = VOICES[voice].model;
    const outputFile = path.join(OUTPUT_DIR, `audio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.wav`);

    console.log(`🎤 Generating TTS: "${text.substring(0, 50)}..." with voice: ${voice}`);

    // Spawn Piper process
    const piperProcess = spawn(PIPER_PATH, [
      '--model', modelName,
      '--output_file', outputFile,
      '--speed', speed.toString(),
    ], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // Track process
    let processError = '';
    let processOutput = '';

    piperProcess.stderr.on('data', (data) => {
      processError += data.toString();
    });

    piperProcess.stdout.on('data', (data) => {
      processOutput += data.toString();
    });

    // Send text to Piper via stdin
    piperProcess.stdin.write(text);
    piperProcess.stdin.end();

    // Handle process completion
    piperProcess.on('close', (code) => {
      if (code === 0 && fs.existsSync(outputFile)) {
        // Check file size
        const stats = fs.statSync(outputFile);
        console.log(`✅ TTS generated: ${stats.size} bytes`);

        // Send audio file
        res.type('audio/wav').sendFile(outputFile, (err) => {
          if (!err) {
            // Clean up after sending
            setTimeout(() => {
              try {
                fs.unlinkSync(outputFile);
              } catch (e) {
                console.error('Cleanup error:', e.message);
              }
            }, 1000);
          }
        });
      } else {
        const errorMsg = processError || `Piper exited with code ${code}`;
        console.error('❌ Piper TTS Error:', errorMsg);
        res.status(500).json({ 
          error: 'Piper TTS failed',
          details: errorMsg,
          exitCode: code
        });
      }
    });

    piperProcess.on('error', (err) => {
      console.error('❌ Process Error:', err.message);
      res.status(500).json({ 
        error: 'Piper process error',
        details: err.message,
        hint: `Make sure Piper is installed at: ${PIPER_PATH}`
      });
    });

  } catch (error) {
    console.error('❌ Endpoint Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /voices
 * Get available voices
 */
app.get('/voices', (req, res) => {
  res.json({
    status: 'success',
    voices: Object.entries(VOICES).map(([key, value]) => ({
      id: key,
      ...value
    })),
    default: 'en_US_male',
    speedRange: { min: 0.5, max: 2.0, default: 1.0 }
  });
});

/**
 * POST /batch
 * Convert multiple texts to speech
 */
app.post('/batch', async (req, res) => {
  try {
    const { texts = [], voice = 'en_US_male' } = req.body;

    if (!Array.isArray(texts) || texts.length === 0) {
      return res.status(400).json({ error: 'Texts array is required and must not be empty' });
    }

    const results = [];
    
    for (const text of texts) {
      try {
        const modelName = VOICES[voice].model;
        const outputFile = path.join(OUTPUT_DIR, `audio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.wav`);

        await new Promise((resolve, reject) => {
          const piperProcess = spawn(PIPER_PATH, [
            '--model', modelName,
            '--output_file', outputFile,
          ]);

          piperProcess.stdin.write(text);
          piperProcess.stdin.end();

          piperProcess.on('close', (code) => {
            if (code === 0 && fs.existsSync(outputFile)) {
              const stats = fs.statSync(outputFile);
              results.push({ 
                text: text.substring(0, 50), 
                file: path.basename(outputFile),
                size: stats.size,
                status: 'success'
              });
              resolve();
            } else {
              reject(new Error(`Piper failed with code ${code}`));
            }
          });

          piperProcess.on('error', reject);
        });
      } catch (err) {
        results.push({ 
          text: text.substring(0, 50), 
          status: 'error',
          error: err.message 
        });
      }
    }

    res.json({ results, total: texts.length });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'Piper TTS Service',
    port: PORT,
    piper: PIPER_PATH,
    modelsPath: MODELS_PATH,
    voicesAvailable: Object.keys(VOICES).length
  });
});

/**
 * GET /config
 * Get current configuration
 */
app.get('/config', (req, res) => {
  res.json({
    piperPath: PIPER_PATH,
    modelsPath: MODELS_PATH,
    outputDirectory: OUTPUT_DIR,
    voices: Object.keys(VOICES),
    supportedLanguages: Object.values(VOICES).map(v => v.language)
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err.message);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

const PORT = process.env.PIPER_PORT || 5003;
app.listen(PORT, () => {
  console.log(`\n✅ 🎤 Piper TTS Service running on http://localhost:${PORT}`);
  console.log(`   Endpoint: POST /tts`);
  console.log(`   Get Voices: GET /voices`);
  console.log(`   Health: GET /health`);
  console.log(`\nUsage Example:`);
  console.log(`   curl -X POST http://localhost:${PORT}/tts \\`);
  console.log(`     -H "Content-Type: application/json" \\`);
  console.log(`     -d '{"text":"Hello world","voice":"en_US_male"}' \\`);
  console.log(`     > output.wav\n`);
});
