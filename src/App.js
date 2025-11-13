import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import LoginPage from './LoginPage';
import UserPage from './UserPage';

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    if (loggedInUser?.language) {
      const langCode = loggedInUser.language === 'hindi' ? 'hi' : 'en';
      i18n.changeLanguage(langCode);
    }
  }, [loggedInUser, i18n]);

  return (
    <Router>
      <Routes>
        {/* If user is logged in, redirect from login page to dashboard. Otherwise, show login page. */}
        <Route
          path="/"
          element={
            loggedInUser 
              ? <Navigate to="/dashboard" /> 
              : <LoginPage setLoggedInUser={setLoggedInUser} />
          }
        />

        {/* If user is logged in, show dashboard. Otherwise, redirect to login page. */}
        <Route
          path="/dashboard"
          element={
            loggedInUser 
              ? <UserPage user={loggedInUser} setLoggedInUser={setLoggedInUser} /> 
              : <Navigate to="/" />
          }
        />
        
        {/* A fallback route to redirect any other path */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;