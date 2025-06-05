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
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="text-red-400 text-center">
          {error.response?.status === 404 ? 
            "You're not registered in the game yet!" : 
            "Error loading stats"
          }
        </div>
      </div>
    );
  }

  const userStats = stats.data;

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "text-blue-400" }) => (
    <div className="bg-gray-700 rounded-lg p-4">
      <div className="flex items-center mb-2">
        <Icon className={`${color} mr-2`} size={20} />
        <h3 className="text-white font-semibold">{title}</h3>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {subtitle && <div className="text-gray-400 text-sm">{subtitle}</div>}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center mb-6">
          <img 
            src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`}
            alt="Avatar"
            className="w-16 h-16 rounded-full mr-4"
          />
          <div>
            <h2 className="text-2xl font-bold text-white">{user.username}</h2>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Allegiance:</span>
              <span className={`font-semibold ${
                userStats.allegiance === 'Emperors League' ? 'text-red-400' : 
                userStats.allegiance === 'Conquerors League' ? 'text-blue-400' : 
                'text-gray-400'
              }`}>
                {userStats.allegiance || 'None'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
      </div>

      {/* Ships Section */}
      {userStats.ships && Object.keys(userStats.ships).length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Ships</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(userStats.ships).map(([shipType, levels]) => (
              <div key={shipType} className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-white font-semibold capitalize mb-2">{shipType}</h4>
                <div className="space-y-1">
                  {Object.entries(levels).map(([level, count]) => (
                    <div key={level} className="flex justify-between text-sm">
                      <span className="text-gray-400">Level {level}:</span>
                      <span className="text-white">{count}</span>
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
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Defenses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(userStats.defenses).map(([defenseType, levels]) => (
              <div key={defenseType} className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-white font-semibold capitalize mb-2">{defenseType}</h4>
                <div className="space-y-1">
                  {Object.entries(levels).map(([level, count]) => (
                    <div key={level} className="flex justify-between text-sm">
                      <span className="text-gray-400">Level {level}:</span>
                      <span className="text-white">{count}</span>
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