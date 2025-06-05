// src/App.jsx
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDiscordAuth } from './hooks/useDiscordAuth';
import DiscordAuth from './components/DiscordAuth';
import Layout from './components/Layout';
import UserStats from './components/UserStats';
import Leaderboard from './components/Leaderboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent = ({ activeTab }) => {
  const { user, loading, login, logout } = useDiscordAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <DiscordAuth onLogin={login} />;
  }

  return (
    <Layout user={user} onLogout={logout}>
      <div>
        {activeTab === 'stats' && <UserStats user={user} />}
        {activeTab === 'leaderboard' && <Leaderboard user={user} />}
      </div>
    </Layout>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;