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

  const getRankClass = (index) => {
    if (index === 0) return 'rank-1';
    if (index === 1) return 'rank-2';  
    if (index === 2) return 'rank-3';
    return 'rank-other';
  };

  if (isLoading) {
    return (
      <div className="card">
        <div className="animate-pulse" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="loading-skeleton" style={{ height: '2rem', width: '33%' }}></div>
          {[...Array(10)].map((_, i) => (
            <div key={i} className="loading-skeleton" style={{ height: '4rem' }}></div>
          ))}
        </div>
      </div>
    );
  }

  const entries = leaderboardData?.data || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Category Tabs */}
      <div className="card">
        <div className="tab-container">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`tab ${activeCategory === category.id ? 'active' : ''}`}
              >
                <Icon className={category.color} size={16} />
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trophy className="text-yellow-400" size={24} />
            <h2 className="card-title">
              {categories.find(c => c.id === activeCategory)?.name} Leaderboard
            </h2>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {entries.slice(0, 20).map((entry, index) => {
            const discordUser = discordUsers?.[entry.id];
            const isCurrentUser = entry.id === user?.id;
            
            return (
              <div
                key={entry.id}
                className={`leaderboard-entry ${isCurrentUser ? 'current-user' : ''}`}
              >
                <div className={`leaderboard-rank ${getRankClass(index)}`}>
                  {getRankIcon(index)}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  {discordUser ? (
                    <>
                      <img
                        src={`https://cdn.discordapp.com/avatars/${entry.id}/${discordUser.avatar}.png?size=32`}
                        alt="Avatar"
                        className="leaderboard-avatar"
                        onError={(e) => {
                          e.target.src = `https://cdn.discordapp.com/embed/avatars/${entry.id.slice(-1) % 5}.png`;
                        }}
                      />
                      <div className="leaderboard-info">
                        <div className="leaderboard-name">
                          {discordUser.global_name || discordUser.username}
                          {isCurrentUser && (
                            <span style={{ marginLeft: '0.5rem', color: '#60a5fa', fontSize: '0.875rem' }}>
                              (You)
                            </span>
                          )}
                        </div>
                        <div className="leaderboard-details">{entry.details}</div>
                      </div>
                    </>
                  ) : (
                    <div className="leaderboard-info">
                      <div className="leaderboard-name">
                        {entry.name}
                        {isCurrentUser && (
                          <span style={{ marginLeft: '0.5rem', color: '#60a5fa', fontSize: '0.875rem' }}>
                            (You)
                          </span>
                        )}
                      </div>
                      <div className="leaderboard-details">{entry.details}</div>
                    </div>
                  )}
                </div>

                <div className="leaderboard-score">
                  <div className="leaderboard-score-value">
                    {entry.score.toLocaleString()}
                  </div>
                  {entry.allegiance && (
                    <div className={`leaderboard-allegiance ${
                      entry.allegiance === 'Emperors League' ? 'allegiance-emperors' : 
                      entry.allegiance === 'Conquerors League' ? 'allegiance-conquerors' : 
                      'allegiance-none'
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
          <div style={{ 
            textAlign: 'center', 
            color: '#9ca3af', 
            padding: '2rem 0' 
          }}>
            No leaderboard data available
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;