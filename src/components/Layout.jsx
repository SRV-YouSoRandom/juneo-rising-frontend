// src/components/Layout.jsx
import React, { useState } from 'react';
import { User, Trophy, LogOut } from 'lucide-react';

const Layout = ({ user, onLogout, children }) => {
  const [activeTab, setActiveTab] = useState('stats');

  const tabs = [
    { id: 'stats', name: 'My Stats', icon: User },
    { id: 'leaderboard', name: 'Leaderboard', icon: Trophy },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111827' }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: '#1f2937', 
        borderBottom: '1px solid #374151',
        padding: '0 1rem'
      }}>
        <div style={{ 
          maxWidth: '80rem', 
          margin: '0 auto', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          height: '4rem' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '700', 
              color: '#f9fafb',
              margin: 0
            }}>
              Space Empire
            </h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img
                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=32`}
                alt="Avatar"
                style={{ 
                  width: '2rem', 
                  height: '2rem', 
                  borderRadius: '50%' 
                }}
                onError={(e) => {
                  e.target.src = `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`;
                }}
              />
              <span style={{ color: '#f9fafb', fontWeight: '500' }}>
                {user.username}
              </span>
            </div>
            
            <button
              onClick={onLogout}
              className="btn btn-secondary"
              style={{ padding: '0.5rem' }}
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{ 
        backgroundColor: '#1f2937', 
        borderBottom: '1px solid #374151',
        padding: '0 1rem'
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div className="tab-container">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <Icon size={20} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ 
        maxWidth: '80rem', 
        margin: '0 auto', 
        padding: '2rem 1rem' 
      }}>
        {typeof children === 'function' ? children(activeTab) : children}
      </main>
    </div>
  );
};

export default Layout;