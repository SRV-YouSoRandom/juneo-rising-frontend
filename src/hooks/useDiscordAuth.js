// src/hooks/useDiscordAuth.js
import { useState, useEffect } from 'react';

const DISCORD_CLIENT_ID = "1348972375575756850";
const REDIRECT_URI = "http://localhost:5173/";

export const useDiscordAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('discord_token');
    if (token) {
      fetchDiscordUser(token);
    } else {
      setLoading(false);
    }

    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      handleOAuthCallback(code);
    }
  }, []);

  const fetchDiscordUser = async (token) => {
    try {
      const response = await fetch('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem('discord_token');
      }
    } catch (error) {
      console.error('Error fetching Discord user:', error);
      localStorage.removeItem('discord_token');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthCallback = async (code) => {
    try {
      const response = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: DISCORD_CLIENT_ID,
          client_secret: "R0pYB2qpBE-4SuePiGIVHHG8-xNlbCGV",
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: REDIRECT_URI,
        }),
      });

      const tokenData = await response.json();
      
      if (tokenData.access_token) {
        localStorage.setItem('discord_token', tokenData.access_token);
        await fetchDiscordUser(tokenData.access_token);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (error) {
      console.error('Error handling OAuth callback:', error);
    }
  };

  const login = () => {
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify`;
    window.location.href = authUrl;
  };

  const logout = () => {
    localStorage.removeItem('discord_token');
    setUser(null);
  };

  return { user, loading, login, logout };
};