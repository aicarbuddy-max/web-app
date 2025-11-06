import { User, Moon, Sun, Bell, CreditCard, MapPin, LogOut, Wrench, Package, Sparkles, Clock, Heart } from 'lucide-react';
import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface ProfilePageProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

export function ProfilePage({ isDarkMode, setIsDarkMode }: ProfilePageProps) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Mock interaction history - in production, this would come from API/database
  const interactionHistory = [
    {
      id: 1,
      type: 'garage',
      name: 'AutoCare Pro',
      action: 'Showed interest',
      date: '2 hours ago',
      icon: Wrench,
      color: 'text-orange-400',
      bgColor: isDarkMode ? 'bg-orange-950/30' : 'bg-orange-50'
    },
    {
      id: 2,
      type: 'detailing',
      name: 'Elite Auto Detailing',
      action: 'Showed interest',
      date: '1 day ago',
      icon: Sparkles,
      color: 'text-green-400',
      bgColor: isDarkMode ? 'bg-green-950/30' : 'bg-green-50'
    },
    {
      id: 3,
      type: 'auto-parts',
      name: 'Premium Parts Store',
      action: 'Visited page',
      date: '2 days ago',
      icon: Package,
      color: 'text-purple-400',
      bgColor: isDarkMode ? 'bg-purple-950/30' : 'bg-purple-50'
    },
    {
      id: 4,
      type: 'garage',
      name: 'Quick Fix Garage',
      action: 'Showed interest',
      date: '3 days ago',
      icon: Wrench,
      color: 'text-orange-400',
      bgColor: isDarkMode ? 'bg-orange-950/30' : 'bg-orange-50'
    },
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Profile Header */}
      <Card className={`p-6 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className={isDarkMode ? 'bg-orange-900 text-orange-300 text-xl' : 'bg-orange-100 text-orange-700 text-xl'}>
              {user ? getInitials(user.username) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>{user?.username || 'User'}</h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{user?.email || 'user@email.com'}</p>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Role: {user?.role || 'User'}
            </p>
          </div>
        </div>
        <Button variant="outline" className="w-full">
          <User className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </Card>

      {/* Settings */}
      <div>
        <h3 className={`mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card className={`p-4 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isDarkMode ? (
                  <Moon className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-gray-600'}`} />
                ) : (
                  <Sun className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-gray-600'}`} />
                )}
                <div>
                  <p className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>Dark Mode</p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Toggle dark theme
                  </p>
                </div>
              </div>
              <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
            </div>
          </Card>

          <Card className={`p-4 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} cursor-pointer hover:bg-opacity-80 transition-colors`}>
            <div className="flex items-center gap-3">
              <Bell className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              <div>
                <p className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>Notifications</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Manage notification preferences
                </p>
              </div>
            </div>
          </Card>

          <Card className={`p-4 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} cursor-pointer hover:bg-opacity-80 transition-colors`}>
            <div className="flex items-center gap-3">
              <CreditCard className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              <div>
                <p className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>Payment Methods</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Manage your payment options
                </p>
              </div>
            </div>
          </Card>

          <Card className={`p-4 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} cursor-pointer hover:bg-opacity-80 transition-colors`}>
            <div className="flex items-center gap-3">
              <MapPin className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              <div>
                <p className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>Saved Addresses</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Manage your saved locations
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* My Activity */}
      <div>
        <h3 className={`mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>My Activity</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card className={`p-4 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} cursor-pointer hover:bg-opacity-80 transition-colors`}>
            <p className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>Service History</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              View past services and bookings
            </p>
          </Card>

          <Card className={`p-4 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} cursor-pointer hover:bg-opacity-80 transition-colors`}>
            <p className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>My Reviews</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Reviews you've written
            </p>
          </Card>
        </div>
      </div>

      {/* Interaction History */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>Recent Activity</h3>
          <Badge variant="outline" className={isDarkMode ? 'border-gray-700 text-gray-400' : ''}>
            {interactionHistory.length} items
          </Badge>
        </div>

        <Card className={`p-4 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <div className="space-y-3">
            {interactionHistory.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-3 rounded-lg ${item.bgColor} transition-colors hover:opacity-80`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.action}
                      </p>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className={`w-3 h-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`} />
                        <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          {item.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Heart className={`w-5 h-5 ${item.action === 'Showed interest' ? 'fill-current text-red-500' : isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
              );
            })}
          </div>

          <Button
            variant="ghost"
            className={`w-full mt-3 ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}
          >
            View All Activity
          </Button>
        </Card>
      </div>

      {/* Logout */}
      <Button
        variant="outline"
        onClick={handleLogout}
        className={`w-full ${isDarkMode ? 'border-red-900 text-red-400 hover:bg-red-950' : 'border-red-200 text-red-600 hover:bg-red-50'}`}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Log Out
      </Button>
    </div>
  );
}
