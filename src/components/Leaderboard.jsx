// src/components/Leaderboard.jsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { gameApi } from '../services/api';
import { Trophy, Sword, Pickaxe, Zap, Coins, Target } from 'lucide-react';

const Leaderboard = ({ user }) => {
  const [activeCategory, setActiveCategory] = useState('power');

  const categories = [
    { id: 'power', name: 'Power', icon: Zap, color: 'text-purple-400' },
    { id: 'mining', name: 'Mining', icon: Pickaxe, color: 'text-amber-400' },
    { id: 'attackers', name: 'Attackers', icon: Sword, color: 'text-red-400' },
    { id: 'pve', name: 'PvE', icon: Target, color: 'text-green-400' },
    { id: 'tokens', name: 'Tokens', icon: Coins, color: 'text-yellow-400' },
  ];

  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ['leaderboard', activeCategory],
    queryFn: () => gameApi.getLeaderboard(activeCategory),
  });

  const { data: discordUsers } = useQuery({
    queryKey: ['discordUsers'],
    queryFn: async () => {
      const response = await gameApi.getAllUsers();
      const userIds = response.data.map(u => u.user_id);
      
      // Fetch Discord user data for each user ID
      const token = localStorage.getItem('discord_token');
      if (!token) return {};
      
      const discordData = {};
      for (const userId of userIds.slice(0, 50)) { // Limit to avoid rate limits
        try {
          const discordResponse = await fetch(`https://discord.com/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (discordResponse.ok) {
            const userData = await discordResponse.json();
            discordData[userId] = userData;
          }
        } catch (error) {
          console.error(`Error fetching Discord data for ${userId}:`, error);
        }
      }
      return discordData;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const getRankIcon = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const getRankColor = (index) => {
    if (index === 0) return 'text-yellow-400';
    if (index === 1) return 'text-gray-300';
    if (index === 2) return 'text-amber-600';
    return 'text-gray-400';
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded w-1/3"></div>
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const entries = leaderboardData?.data || [];

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeCategory === category.id
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Icon className={category.color} size={16} />
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center mb-6">
          <Trophy className="text-yellow-400 mr-2" size={24} />
          <h2 className="text-2xl font-bold text-white">
            {categories.find(c => c.id === activeCategory)?.name} Leaderboard
          </h2>
        </div>

        <div className="space-y-3">
          {entries.slice(0, 20).map((entry, index) => {
            const discordUser = discordUsers?.[entry.id];
            const isCurrentUser = entry.id === user?.id;
            
            return (
              <div
                key={entry.id}
                className={`flex items-center p-4 rounded-lg ${
                  isCurrentUser ? 'bg-blue-600/20 border border-blue-500' : 'bg-gray-700'
                }`}
              >
                <div className={`w-12 text-center font-bold ${getRankColor(index)}`}>
                  {getRankIcon(index)}
                </div>
                
                <div className="flex items-center flex-1 ml-4">
                  {discordUser ? (
                    <>
                      <img
                        src={`https://cdn.discordapp.com/avatars/${entry.id}/${discordUser.avatar}.png?size=32`}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <div>
                        <div className="text-white font-semibold">
                          {discordUser.global_name || discordUser.username}
                          {isCurrentUser && (
                            <span className="ml-2 text-blue-400 text-sm">(You)</span>
                          )}
                        </div>
                        <div className="text-gray-400 text-sm">{entry.details}</div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <div className="text-white font-semibold">
                        {entry.name}
                        {isCurrentUser && (
                          <span className="ml-2 text-blue-400 text-sm">(You)</span>
                        )}
                      </div>
                      <div className="text-gray-400 text-sm">{entry.details}</div>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-white font-bold text-lg">
                    {entry.score.toLocaleString()}
                  </div>
                  {entry.allegiance && (
                    <div className={`text-sm ${
                      entry.allegiance === 'Emperors League' ? 'text-red-400' : 
                      entry.allegiance === 'Conquerors League' ? 'text-blue-400' : 
                      'text-gray-400'
                    }`}>
                      {entry.allegiance_icon}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {entries.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No leaderboard data available
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;