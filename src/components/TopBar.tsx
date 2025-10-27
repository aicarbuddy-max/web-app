import { User, Car } from 'lucide-react';
import { LocationPicker } from './LocationPicker';

interface TopBarProps {
  currentLocation: { latitude: number; longitude: number; placeName?: string } | null;
  onLocationSelect: (latitude: number, longitude: number, placeName?: string) => void;
  onProfileClick: () => void;
  isDarkMode: boolean;
}

export function TopBar({ currentLocation, onLocationSelect, onProfileClick, isDarkMode }: TopBarProps) {
  return (
    <div className={`fixed top-0 left-0 right-0 z-40 max-w-md mx-auto ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b`}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* Branding */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center">
            <Car className="w-5 h-5 text-white" />
          </div>
          <span className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Car Buddy
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* GPS Location Picker */}
          <div className="scale-90">
            <LocationPicker
              isDarkMode={isDarkMode}
              onLocationSelect={onLocationSelect}
              currentLocation={currentLocation}
            />
          </div>

          <button
            onClick={onProfileClick}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
          >
            <User className={`w-5 h-5 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
