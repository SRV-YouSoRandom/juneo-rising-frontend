// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://172.104.229.234:8000/';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const gameApi = {
  // Get user stats
  getUserStats: (userId) => api.get(`/users/${userId}`),
  
  // Get leaderboard data
  getLeaderboard: (category) => api.get(`/leaderboard/${category}`),
  
  // Get leaderboard image
  getLeaderboardImage: (category, userId = null) => {
    const params = userId ? `?user_id=${userId}` : '';
    return api.get(`/leaderboard_image/${category}${params}`, {
      responseType: 'blob'
    });
  },
  
  // Get game data
  getGameData: () => api.get('/game_data'),
  
  // Get all users
  getAllUsers: () => api.get('/users'),
};