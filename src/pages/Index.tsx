import { useState } from 'react';
import AuthLogin from '@/components/AuthLogin';
import NetworkDashboard from '@/components/NetworkDashboard';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <AuthLogin onLogin={handleLogin} />;
  }

  return <NetworkDashboard />;
};

export default Index;
