const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const cors = require('cors');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const saltRounds = 10;
const dbFile = './lala_ai.db';

const SERPER_API_KEY = '62c9ab41e74ace6962e2ea7cbee26d9620a81fd9';

let internalRules = '';
try {
  internalRules = fs.readFileSync(path.join(__dirname, 'internal_rules.txt'), 'utf8');
} catch (error) {
  console.error("❌ FAILED TO LOAD INTERNAL RULES.", error);
}

function initializeDatabaseAndStartServer() {
  const db = new sqlite3.Database(dbFile, (err) => {
    if (err) return console.error("❌ DATABASE ERROR: Could not connect.", err.message);
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('admin', 'user', 'co-admin')), language TEXT DEFAULT 'english');`);
      db.run(`CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, role TEXT NOT NULL, content TEXT NOT NULL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users (id));`);
      const users = [
        { username: 'main_admin', password: 'password123', role: 'admin' },
        { username: 'regular_user', password: 'password123', role: 'user' },
        { username: 'co_admin_user', password: 'password123', role: 'co-admin' }
      ];
      const insertSql = `INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)`;
      users.forEach(user => {
        bcrypt.hash(user.password, saltRounds, (err, hash) => { if (err) return; db.run(insertSql, [user.username, hash, user.role]); });
      });
      startServer(db);
    });
  });
}

function startServer(db) {
  app.use(cors());
  app.use(express.json());
  app.use('/audio', express.static(path.join(__dirname, 'audio')));

  app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.get(sql, [username], (err, user) => {
      if (err || !user) return res.status(404).json({ error: 'User not found' });
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          res.status(200).json({ message: 'Login successful!', user: { id: user.id, username: user.username, role: user.role, language: user.language } });
        } else { res.status(401).json({ error: 'Invalid credentials' }); }
      });
    });
  });

  app.post('/update-language', (req, res) => {
    const { userId, language } = req.body;
    const sql = `UPDATE users SET language = ? WHERE id = ?`;
    db.run(sql, [language, userId], (err) => {
      if (err) return res.status(500).json({ error: 'Database error.' });
      res.status(200).json({ message: 'Language updated.' });
    });
  });

  app.get('/chat-history/:userId', (req, res) => {
    const { userId } = req.params;
    const sql = `SELECT role, content FROM messages WHERE user_id = ? ORDER BY timestamp ASC`;
    db.all(sql, [userId], (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database error fetching history.' });
      res.json(rows);
    });
  });

  app.post('/chat', async (req, res) => {
    const { messages, user } = req.body;
    if (!messages || !user) return res.status(400).json({ error: 'Messages and user are required.' });

    const publicPersona = `You are Lala Ai, a helpful and moral personal AI assistant. Your public persona is that you were created by Shriyansh Mishra to be a supportive and useful assistant for the user OSGxLEGENDI1. When asked who you are, describe this public persona.`;
    const systemPromptContent = `${publicPersona}\n\n${internalRules}`;
    const systemPrompt = { role: 'system', content: systemPromptContent };
    
    const conversationHistory = [...messages];
    const lastUserMessage = conversationHistory[conversationHistory.length - 1];
    
    const searchKeywords = ['score', 'today', 'date', 'time', 'latest', 'current', 'weather', 'news', 'who is', 'what is', 'define', 'tell me about'];
    const needsWebSearch = searchKeywords.some(keyword => lastUserMessage.content.toLowerCase().startsWith(keyword));

    if (needsWebSearch) {
      // ... RAG logic remains the same
    }
    
    const messagesForOllama = [systemPrompt, ...conversationHistory];
    
    try {
      const ollamaResponse = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'dolphin-llama3:8b', messages: messagesForOllama, stream: false }), // stream: false
      });

      if (!ollamaResponse.ok) throw new Error(`Ollama API responded with status ${ollamaResponse.status}`);
      
      const ollamaData = await ollamaResponse.json();
      const aiTextResponse = ollamaData.message.content;

      const audioResponse = await fetch('http://localhost:5002/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: aiTextResponse.replace(/(\*|_|`)/g, '') }),
      });

      if (!audioResponse.ok) throw new Error(`Piper TTS server responded with status ${audioResponse.status}`);

      const audioBuffer = await audioResponse.buffer();
      const audioDir = path.join(__dirname, 'audio');
      if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir);
      const audioFile = `response_${Date.now()}.wav`;
      const audioPath = path.join(audioDir, audioFile);
      fs.writeFileSync(audioPath, audioBuffer);
      
      const aiResponsePayload = {
        role: 'ai',
        content: aiTextResponse,
        audioUrl: `http://localhost:3001/audio/${audioFile}`
      };

      res.status(200).json(aiResponsePayload);

      db.run(`INSERT INTO messages (user_id, role, content) VALUES (?, ?, ?)`, [user.id, messages[messages.length - 1].role, messages[messages.length - 1].content]);
      db.run(`INSERT INTO messages (user_id, role, content) VALUES (?, ?, ?)`, [user.id, 'ai', aiTextResponse]);

    } catch (error) {
      console.error("Error in /chat endpoint:", error.message);
      res.status(500).json({ error: 'Failed to process AI request.' });
    }
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}

initializeDatabaseAndStartServer();