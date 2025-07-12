import React, { useState, useEffect } from 'react';
import './App.css';
import Story from './components/Story';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-orange-100 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading global AI perspectives...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Story />
    </div>
  );
}

export default App;
