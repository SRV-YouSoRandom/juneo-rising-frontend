// src/components/DiscordAuth.jsx
import React from 'react';
import { LogIn } from 'lucide-react';

const DiscordAuth = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center max-w-md w-full mx-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Juneo Rising</h1>
          <p className="text-gray-400">View your stats and compete on leaderboards</p>
        </div>
        
        <button
          onClick={onLogin}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
        >
          <LogIn size={20} />
          Login with Discord
        </button>
        
        <p className="text-gray-500 text-sm mt-4">
          Login to view your game statistics and compete on leaderboards
        </p>
      </div>
    </div>
  );
};

export default DiscordAuth;