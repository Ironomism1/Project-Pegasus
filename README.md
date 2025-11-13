z# Project Pegasus 🚀

**An Advanced AI-Powered Voice Assistant with Full User Control**

Project Pegasus is a sophisticated, open-source AI assistant system that combines voice interaction, multi-language support, and a custom-built machine learning model. It's designed to be powerful, privacy-focused, and fully under your control—not locked behind cloud services.

---

## 🎯 Project Vision

Project Pegasus aims to create an intelligent, uncensored AI assistant that:
- **Operates Locally**: Runs on your own hardware without relying on external cloud services
- **Respects Privacy**: Asks for permission before accessing sensitive data and can store everything locally
- **Learns Continuously**: Improves over time and can be customized to your specific needs
- **Supports Multiple Languages**: Currently supports English, Hindi, and Hinglish
- **Stays Affordable**: Custom model optimized to fit within 500GB, scalable with additional storage

---

## ✨ Current Features

### Core Features
- **Voice Interface**: Natural language voice input and processing
- **Chat Interface**: Intuitive chat-based interaction
- **Multi-Language Support**: English, Hindi, and Hinglish (Hindi-English Mix)
- **Custom AI Model**: Open-sourced, cracked model with full admin control
- **User Authentication**: Secure login system with role-based access (Admin, Co-admin, User)
- **Persistent Storage**: SQLite database for user data and conversation history
- **Audio Support**: Built-in audio handling capabilities

### Technical Architecture
- **Frontend**: React-based UI with GSAP animations
- **Backend**: Express.js REST API
- **Database**: SQLite for local data storage
- **Security**: Bcrypt password hashing, CORS protection
- **Speech Recognition**: Web-based speech recognition capabilities
- **Internationalization**: i18n support for multiple languages

---

## 🔮 Planned Features

### Near-Term
- Improved UI/UX with sleek animations
- Animated responses with data pointers
- Self-learning capabilities
- Web scraping integration for latest information
- Storage optimization and duplicate data removal

### Future Enhancements
- **System Control**: PC and mobile device automation
- **Multi-Model Support**: Support for multiple specialized models (image generation, audio synthesis, etc.)
- **Advanced Privacy**: Granular permission controls for data access
- **Robotic Integration**: Support for robotic hardware with custom-built body
- **Simulated Learning**: Training via simulated environments

---

## 📋 Prerequisites

Before setting up Project Pegasus, ensure you have:
- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **Python** (optional, for future model training)
- At least 1GB of disk space for initial setup

---

## 🚀 Getting Started

### 1. **Clone the Repository**
```bash
git clone https://github.com/Ironomism1/Project-Pegasus.git
cd Project-Pegasus
```

### 2. **Install Frontend Dependencies**
```bash
npm install
```

### 3. **Install Backend Dependencies**
```bash
cd backend
npm install
cd ..
```

### 4. **Start the Backend Server**
Open a new terminal window and run:
```bash
cd backend
node server.js
```
The backend server will run on `http://localhost:3001`

### 5. **Start the Frontend (in original terminal)**
```bash
npm start
```
The application will open at `http://localhost:3000`

### 6. **Access the Application**
- Open your browser and navigate to `http://localhost:3000`
- Login with default credentials:
  - **Username**: `main_admin` | **Password**: `password123` (Admin role)
  - **Username**: `regular_user` | **Password**: `password123` (User role)
  - **Username**: `co_admin_user` | **Password**: `password123` (Co-admin role)

⚠️ **Security Note**: Change these credentials in production!

---

## 🏗️ Project Structure

```
project-pegasus/
├── public/                 # Static files
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/                    # React frontend source code
│   ├── components/
│   │   ├── ChatWindow.js   # Main chat interface
│   │   ├── LoginPage.js    # User authentication
│   │   ├── LanguageModal.js # Language selection
│   │   ├── SettingsModal.js # User settings
│   │   └── UserPage.js     # User dashboard
│   ├── locales/            # i18n translation files
│   │   ├── en/translation.json
│   │   ├── hi/translation.json
│   ├── App.js              # Main React component
│   ├── i18n.js             # i18n configuration
│   └── index.js            # React entry point
├── backend/                # Express.js backend
│   ├── server.js           # Main server file
│   ├── internal_rules.txt  # AI behavior rules
│   ├── audio/              # Audio files storage
│   └── package.json        # Backend dependencies
├── Models/                 # AI Models
│   ├── Parts/
│   └── [Model files]
├── package.json            # Frontend dependencies
└── README.md               # This file
```

---

## 🛠️ Technology Stack

### Frontend
- **React 19.2**: Modern UI framework
- **React Router**: Navigation and routing
- **i18next**: Internationalization
- **GSAP**: Advanced animations
- **React Speech Recognition**: Voice input
- **React Icons**: Icon library
- **React Markdown**: Markdown rendering

### Backend
- **Express.js**: REST API framework
- **SQLite3**: Lightweight database
- **Bcrypt**: Password hashing
- **CORS**: Cross-origin resource sharing
- **Cheerio**: Web scraping
- **Node Fetch**: HTTP requests

---

## 🔐 Security Features

- **Role-Based Access Control**: Admin, Co-admin, and User roles
- **Password Hashing**: Bcrypt with 10 salt rounds
- **Secure Database**: SQLite with proper table structure
- **CORS Protection**: Whitelist origin requests
- **Input Validation**: Server-side validation on all inputs

---

## 📝 Default Users

| Username | Password | Role |
|----------|----------|------|
| main_admin | password123 | Admin |
| regular_user | password123 | User |
| co_admin_user | password123 | Co-admin |

---

## 🎤 Using Voice Features

1. Click the microphone icon in the chat interface
2. Speak your query
3. The AI will process and respond
4. Select your preferred language from settings

---

## 🌍 Language Support

Project Pegasus currently supports:
- **English**: Full support
- **Hindi**: Full support  
- **Hinglish**: Hindi-English mix for natural Indian English speakers

Add more languages by extending the translation files in `src/locales/`

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin', 'user', 'co-admin')),
  language TEXT DEFAULT 'english'
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

---

## 🚦 Running Commands Reference

### Development
```bash
# Start frontend
npm start

# Start backend (in separate terminal)
cd backend && node server.js

# Build frontend for production
npm run build

# Run tests
npm test
```

### Backend Server
```bash
# Default runs on port 3001
node backend/server.js
```

---

## 🐛 Troubleshooting

### Backend won't start
- Ensure port 3001 is available
- Check Node.js version: `node -v`
- Verify SQLite is installed: `npm list sqlite3`

### Frontend won't start
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules`: `rm -r node_modules`
- Reinstall: `npm install`

### Database errors
- Delete old database: `rm backend/lala_ai.db`
- Restart backend to create new database

### Port conflicts
- Change port in `backend/server.js` if 3001 is in use

---

## 🚀 Future Roadmap

- [ ] GPU acceleration for faster inference
- [ ] Fine-tuning capabilities for custom knowledge
- [ ] Multi-model support (vision, audio generation)
- [ ] Desktop app wrapper (Electron)
- [ ] Mobile app integration
- [ ] Real-time model updates
- [ ] Privacy-first data encryption
- [ ] Robotic hardware support

---

## 📄 License

This project is licensed under the ISC License.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

---

## 💡 Project Goals

**Short Term**: Build a robust, fully functional AI assistant with voice support and multi-language capabilities.

**Medium Term**: Optimize storage efficiency, add self-learning features, and implement advanced UI animations.

**Long Term**: Create a complete ecosystem with PC/mobile control, multiple specialized models, and robotic hardware integration.

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the internal_rules.txt for AI behavior guidelines

---


*"Your AI, Your Rules, Your Control"*
