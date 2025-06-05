// src/components/UserStats.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { gameApi } from '../services/api';
import { Sword, Shield, Pickaxe, Trophy, Coins, Zap } from 'lucide-react';

const UserStats = ({ user }) => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['userStats', user.id],
    queryFn: () => gameApi.getUserStats(user.id),
  });

  if (isLoading) {
    return (
      <div className="card">
        <div className="animate-pulse" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="loading-skeleton" style={{ height: '1rem', width: '25%' }}></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="loading-skeleton" style={{ height: '5rem' }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <h3>Error Loading Stats</h3>
        <p>
          {error.response?.status === 404 ? 
            "You're not registered in the game yet!" : 
            "Error loading stats"
          }
        </p>
      </div>
    );
  }

  const userStats = stats.data;

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "text-purple-400" }) => (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)' }}>
        <Icon className={color} size={20} />
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{title}</div>
      {subtitle && <div className="stat-subtitle">{subtitle}</div>}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* User Profile */}
      <div className="user-profile">
        <img 
          src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`}
          alt="Avatar"
          className="user-avatar"
          onError={(e) => {
            e.target.src = `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`;
          }}
        />
        <div className="user-info">
          <h2>{user.username}</h2>
          <div className="user-allegiance">
            <span style={{ color: '#9ca3af' }}>Allegiance:</span>
            <span className={`
              ${userStats.allegiance === 'Emperors League' ? 'allegiance-emperors' : 
                userStats.allegiance === 'Conquerors League' ? 'allegiance-conquerors' : 
                'allegiance-none'}
            `}>
              {userStats.allegiance || 'None'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem' 
      }}>
        <StatCard 
          icon={Coins}
          title="Tokens"
          value={userStats.tokens?.toLocaleString() || '0'}
          color="text-yellow-400"
        />
        
        <StatCard 
          icon={Zap}
          title="Total Power"
          value={userStats.total_power?.toLocaleString() || '0'}
          subtitle={`Ships: ${userStats.total_ship_power?.toLocaleString() || '0'} | Defenses: ${userStats.total_defense_power?.toLocaleString() || '0'}`}
          color="text-purple-400"
        />
        
        <StatCard 
          icon={Pickaxe}
          title="Total Mined"
          value={userStats.total_mined?.toLocaleString() || '0'}
          color="text-amber-400"
        />
        
        <StatCard 
          icon={Sword}
          title="Battles"
          value={userStats.total_attacked || '0'}
          subtitle={`Wins: ${userStats.total_victories || '0'} (${userStats.total_attacked > 0 ? Math.round((userStats.total_victories / userStats.total_attacked) * 100) : 0}%)`}
          color="text-red-400"
        />
        
        <StatCard 
          icon={Trophy}
          title="PvE Progress"
          value={`Level ${userStats.pve_highest_defeated || '0'}`}
          subtitle={`Current: ${userStats.pve_level || '1'}`}
          color="text-green-400"
        />
        
        <StatCard 
          icon={Shield}
          title="Level"
          value={userStats.level || '1'}
          subtitle={`XP: ${userStats.xp?.toLocaleString() || '0'}`}
          color="text-blue-400"
        />
      </div>

      {/* Ships Section */}
      {userStats.ships && Object.keys(userStats.ships).length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Fleet</h3>
          </div>
          <div className="fleet-grid">
            {Object.entries(userStats.ships).map(([shipType, levels]) => (
              <div key={shipType} className="fleet-item">
                <h4>{shipType}</h4>
                <div className="fleet-levels">
                  {Object.entries(levels).map(([level, count]) => (
                    <div key={level} className="fleet-level">
                      <span className="fleet-level-label">Level {level}:</span>
                      <span className="fleet-level-count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Defenses Section */}
      {userStats.defenses && Object.keys(userStats.defenses).length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Defenses</h3>
          </div>
          <div className="fleet-grid">
            {Object.entries(userStats.defenses).map(([defenseType, levels]) => (
              <div key={defenseType} className="fleet-item">
                <h4>{defenseType}</h4>
                <div className="fleet-levels">
                  {Object.entries(levels).map(([level, count]) => (
                    <div key={level} className="fleet-level">
                      <span className="fleet-level-label">Level {level}:</span>
                      <span className="fleet-level-count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserStats;