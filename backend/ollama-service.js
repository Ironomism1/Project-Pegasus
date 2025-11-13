const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(express.json());

// Configuration from environment
const OLLAMA_BASE_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || 'mistral';
const DEFAULT_TEMPERATURE = parseFloat(process.env.OLLAMA_TEMPERATURE) || 0.7;

console.log('🧠 Ollama Service Configuration:');
console.log('   Base URL:', OLLAMA_BASE_URL);
console.log('   Default Model:', DEFAULT_MODEL);
console.log('   Temperature:', DEFAULT_TEMPERATURE);

/**
 * POST /generate
 * Generate text from LLM
 * Body: { prompt: string, model?: string, temperature?: number, num_predict?: number }
 */
app.post('/generate', async (req, res) => {
  try {
    const { 
      prompt, 
      model = DEFAULT_MODEL, 
      temperature = DEFAULT_TEMPERATURE,
      num_predict = 128
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log(`🧠 Generating response with ${model}...`);
    console.log(`   Prompt: "${prompt.substring(0, 50)}..."`);

    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        temperature,
        num_predict,
        stream: false,
      }),
      timeout: 30000
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Ollama Error (${response.status}):`, errorText);
      return res.status(response.status).json({ 
        error: 'Ollama service error',
        details: errorText 
      });
    }

    const data = await response.json();
    console.log(`✅ Response generated: ${data.response.length} characters`);

    res.json({
      status: 'success',
      response: data.response,
      model: data.model,
      promptTokens: data.prompt_eval_count,
      responseTokens: data.eval_count,
      totalTime: data.eval_duration
    });

  } catch (error) {
    console.error('❌ Generate Error:', error.message);
    res.status(500).json({ 
      error: error.message,
      hint: `Make sure Ollama is running at ${OLLAMA_BASE_URL}`
    });
  }
});

/**
 * POST /chat
 * Chat with LLM
 * Body: { messages: Array, model?: string, temperature?: number }
 */
app.post('/chat', async (req, res) => {
  try {
    const { 
      messages, 
      model = DEFAULT_MODEL,
      temperature = DEFAULT_TEMPERATURE
    } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    console.log(`💬 Chat with ${model}:`);
    console.log(`   Messages: ${messages.length}`);

    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        stream: false,
      }),
      timeout: 30000
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Ollama Chat Error (${response.status}):`, errorText);
      return res.status(response.status).json({ 
        error: 'Ollama service error',
        details: errorText 
      });
    }

    const data = await response.json();
    console.log(`✅ Chat response: ${data.message.content.length} characters`);

    res.json({
      status: 'success',
      message: data.message.content,
      model: data.model,
      role: data.message.role
    });

  } catch (error) {
    console.error('❌ Chat Error:', error.message);
    res.status(500).json({ 
      error: error.message,
      hint: `Make sure Ollama is running at ${OLLAMA_BASE_URL}`
    });
  }
});

/**
 * GET /models
 * List available models
 */
app.get('/models', async (req, res) => {
  try {
    console.log('📋 Fetching available models...');

    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      timeout: 10000
    });

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: 'Cannot fetch models from Ollama' 
      });
    }

    const data = await response.json();
    console.log(`✅ Found ${data.models ? data.models.length : 0} models`);

    res.json({
      status: 'success',
      models: data.models || [],
      modelCount: (data.models || []).length
    });

  } catch (error) {
    console.error('❌ Models Error:', error.message);
    res.status(500).json({ 
      error: error.message,
      hint: `Make sure Ollama is running at ${OLLAMA_BASE_URL}`
    });
  }
});

/**
 * GET /pull/:model
 * Pull/download a model
 */
app.get('/pull/:model', async (req, res) => {
  try {
    const { model } = req.params;

    if (!model) {
      return res.status(400).json({ error: 'Model name is required' });
    }

    console.log(`⬇️  Pulling model: ${model}...`);

    const response = await fetch(`${OLLAMA_BASE_URL}/api/pull`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: model, stream: false }),
      timeout: 300000 // 5 minute timeout for pulling
    });

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: 'Failed to pull model'
      });
    }

    const data = await response.json();
    console.log(`✅ Model pulled: ${model}`);

    res.json({
      status: 'success',
      message: `Model ${model} pulled successfully`,
      data
    });

  } catch (error) {
    console.error('❌ Pull Error:', error.message);
    res.status(500).json({ 
      error: error.message,
      hint: 'Pulling models can take several minutes'
    });
  }
});

/**
 * POST /embeddings
 * Generate embeddings for text
 */
app.post('/embeddings', async (req, res) => {
  try {
    const { text, model = DEFAULT_MODEL } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    console.log(`📊 Generating embeddings with ${model}...`);

    const response = await fetch(`${OLLAMA_BASE_URL}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt: text
      }),
      timeout: 30000
    });

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: 'Failed to generate embeddings'
      });
    }

    const data = await response.json();
    console.log(`✅ Embeddings generated: ${data.embedding.length} dimensions`);

    res.json({
      status: 'success',
      embedding: data.embedding,
      dimensions: data.embedding.length
    });

  } catch (error) {
    console.error('❌ Embeddings Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', async (req, res) => {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      timeout: 5000
    });

    if (response.ok) {
      const data = await response.json();
      res.json({ 
        status: 'healthy',
        service: 'Ollama LLM Service',
        port: PORT,
        ollamaUrl: OLLAMA_BASE_URL,
        defaultModel: DEFAULT_MODEL,
        modelCount: (data.models || []).length
      });
    } else {
      res.status(503).json({ 
        error: 'Ollama service unavailable',
        status: response.status 
      });
    }
  } catch (error) {
    res.status(503).json({ 
      error: 'Cannot reach Ollama service',
      hint: `Make sure Ollama is running at ${OLLAMA_BASE_URL}`,
      details: error.message
    });
  }
});

/**
 * GET /config
 * Get current configuration
 */
app.get('/config', (req, res) => {
  res.json({
    ollamaUrl: OLLAMA_BASE_URL,
    defaultModel: DEFAULT_MODEL,
    defaultTemperature: DEFAULT_TEMPERATURE,
    endpoints: {
      generate: 'POST /generate',
      chat: 'POST /chat',
      models: 'GET /models',
      pullModel: 'GET /pull/:model',
      embeddings: 'POST /embeddings',
      health: 'GET /health'
    }
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

const PORT = process.env.OLLAMA_PORT || 5004;
app.listen(PORT, () => {
  console.log(`\n✅ 🧠 Ollama LLM Service running on http://localhost:${PORT}`);
  console.log(`   Base URL: ${OLLAMA_BASE_URL}`);
  console.log(`   Default Model: ${DEFAULT_MODEL}`);
  console.log('\nEndpoints:');
  console.log(`   Generate: POST /generate`);
  console.log(`   Chat: POST /chat`);
  console.log(`   Models: GET /models`);
  console.log(`   Health: GET /health`);
  console.log('\nUsage Example:');
  console.log(`   curl -X POST http://localhost:${PORT}/generate \\`);
  console.log(`     -H "Content-Type: application/json" \\`);
  console.log(`     -d '{"prompt":"Hello, who are you?"}'\n`);
});
