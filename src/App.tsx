import { useState } from 'react';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { DesktopNav } from './components/DesktopNav';
import { GaragesPage } from './components/GaragesPage';
import { AutoPartShopsPage } from './components/AutoPartShopsPage';
import { CommunityPage } from './components/CommunityPage';
import { ContactPage } from './components/ContactPage';
import { ProfilePage } from './components/ProfilePage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { ChatBot } from './components/ChatBot';
import { Toaster } from './components/ui/sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const [activeTab, setActiveTab] = useState('garages');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const { isAuthenticated, isLoading } = useAuth();

  const handleLocationSelect = (latitude: number, longitude: number) => {
    setCurrentLocation({ latitude, longitude });
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className={`mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (authView === 'register') {
      return (
        <RegisterPage
          isDarkMode={isDarkMode}
          onSwitchToLogin={() => setAuthView('login')}
          onRegisterSuccess={() => setAuthView('login')}
        />
      );
    }
    return (
      <LoginPage
        isDarkMode={isDarkMode}
        onSwitchToRegister={() => setAuthView('register')}
        onLoginSuccess={() => {}}
      />
    );
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'garages':
        return <GaragesPage isDarkMode={isDarkMode} currentLocation={currentLocation} onLocationSelect={handleLocationSelect} />;
      case 'auto-parts':
        return <AutoPartShopsPage isDarkMode={isDarkMode} currentLocation={currentLocation} onLocationSelect={handleLocationSelect} />;
      case 'community':
        return <CommunityPage isDarkMode={isDarkMode} />;
      case 'contact':
        return <ContactPage isDarkMode={isDarkMode} />;
      case 'profile':
        return <ProfilePage isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />;
      default:
        return <GaragesPage isDarkMode={isDarkMode} currentLocation={currentLocation} onLocationSelect={handleLocationSelect} />;
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-950' : 'bg-gray-50'}`}>
      {/* Desktop Layout */}
      <div className="hidden md:flex flex-col min-h-screen">
        <DesktopNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentLocation={currentLocation}
          onLocationSelect={handleLocationSelect}
          onAskClick={() => setIsChatBotOpen(true)}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
        
        <main className="flex-1 pt-16 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {renderPage()}
          </div>
        </main>
      </div>

      {/* Mobile Layout */}
      <div className="flex md:hidden flex-col min-h-screen max-w-md mx-auto relative">
        <TopBar
          currentLocation={currentLocation}
          onLocationSelect={handleLocationSelect}
          onProfileClick={() => setActiveTab('profile')}
          isDarkMode={isDarkMode}
        />
        
        <main className="flex-1 pb-20 pt-16 overflow-y-auto">
          {renderPage()}
        </main>

        <BottomNav 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onAskClick={() => setIsChatBotOpen(true)}
          isDarkMode={isDarkMode}
        />
      </div>

      <ChatBot 
        isOpen={isChatBotOpen}
        onClose={() => setIsChatBotOpen(false)}
        isDarkMode={isDarkMode}
      />

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
