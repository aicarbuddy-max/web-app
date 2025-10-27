import { useState, useEffect } from 'react';
import { MapPin, Search, Loader2, Navigation, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner';

interface LocationPickerProps {
  isDarkMode: boolean;
  onLocationSelect: (latitude: number, longitude: number, placeName?: string) => void;
  currentLocation?: { latitude: number; longitude: number; placeName?: string } | null;
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  place_id: number;
}

export function LocationPicker({ isDarkMode, onLocationSelect, currentLocation }: LocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Check if geolocation is available
  const isGeolocationAvailable = 'geolocation' in navigator;

  // Search for places using OpenStreetMap Nominatim API
  const searchPlaces = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
        {
          headers: {
            'User-Agent': 'CarBuddy/1.0'
          }
        }
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Place search error:', error);
      toast.error('Failed to search places. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle place selection from search results
  const handlePlaceSelect = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    onLocationSelect(lat, lon, result.display_name);
    setSearchQuery('');
    setSearchResults([]);
    setLocationStatus(`Location set: ${result.display_name}`);
    toast.success('Location set successfully!');
    setIsOpen(false);
  };

  // Get short display name (max 30 chars)
  const getShortLocationName = () => {
    if (!currentLocation) return 'Set Location';
    if (currentLocation.placeName) {
      return currentLocation.placeName.length > 30
        ? currentLocation.placeName.substring(0, 30) + '...'
        : currentLocation.placeName;
    }
    return `${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}`;
  };

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 3) {
        searchPlaces(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Get current location using browser geolocation API
  const getCurrentLocation = () => {
    if (!isGeolocationAvailable) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    setLocationStatus('Getting your location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationSelect(latitude, longitude);
        setLocationStatus(`Location found: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        toast.success('Location detected successfully!');
        setIsGettingLocation(false);
        setIsOpen(false);
      },
      (error) => {
        setIsGettingLocation(false);
        setLocationStatus('');

        let errorMessage = 'Failed to get location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable. Please try again or enter manually.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
        }

        toast.error(errorMessage);
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };


  return (
    <div className="w-full">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className={`w-full md:w-[200px] ${
              isDarkMode
                ? 'bg-gray-900 border-gray-700 text-gray-100 hover:bg-gray-800'
                : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
            }`}
          >
            <MapPin className={`w-4 h-4 mr-2 flex-shrink-0 ${currentLocation ? 'text-orange-600' : ''}`} />
            <span className="truncate text-sm">
              {getShortLocationName()}
            </span>
          </Button>
        </DialogTrigger>

        <DialogContent
          className={`${
            isDarkMode ? 'bg-gray-900 border-gray-800 text-gray-100' : 'bg-white'
          } max-w-md mx-auto`}
        >
          <DialogHeader>
            <DialogTitle>Choose Your Location</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Place Search */}
            <div className="space-y-3">
              <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Search for a Place
              </h3>
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <Input
                  type="text"
                  placeholder="Search city, address, or place..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 pr-10 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : ''}`}
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {isSearching && (
                  <Loader2 className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                )}
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className={`border rounded-lg ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} max-h-60 overflow-y-auto`}>
                  {searchResults.map((result) => (
                    <button
                      key={result.place_id}
                      onClick={() => handlePlaceSelect(result)}
                      className={`w-full text-left px-4 py-3 hover:bg-opacity-50 transition-colors border-b last:border-b-0 ${
                        isDarkMode
                          ? 'hover:bg-gray-700 border-gray-700'
                          : 'hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <MapPin className={`w-4 h-4 mt-1 flex-shrink-0 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} line-clamp-2`}>
                            {result.display_name}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {searchQuery.length > 0 && searchQuery.length < 3 && !isSearching && (
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Type at least 3 characters to search
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="relative">
              <div className={`absolute inset-0 flex items-center ${isDarkMode ? 'text-gray-700' : 'text-gray-300'}`}>
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className={`px-2 ${isDarkMode ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-500'}`}>
                  Or
                </span>
              </div>
            </div>

            {/* Auto-detect Location */}
            <div className="space-y-3">
              <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Auto-Detect Location
              </h3>
              <Button
                onClick={getCurrentLocation}
                disabled={isGettingLocation || !isGeolocationAvailable}
                className={`w-full ${
                  isDarkMode
                    ? 'bg-orange-600 hover:bg-orange-700'
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                {isGettingLocation ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4 mr-2" />
                    Use My Current Location
                  </>
                )}
              </Button>
              {!isGeolocationAvailable && (
                <p className="text-xs text-red-500">
                  Geolocation is not supported by your browser
                </p>
              )}
              {locationStatus && (
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {locationStatus}
                </p>
              )}
            </div>

            {/* Current Location Display */}
            {currentLocation && (
              <div
                className={`p-4 rounded-lg border-2 ${
                  isDarkMode
                    ? 'bg-orange-950/20 border-orange-700'
                    : 'bg-orange-50 border-orange-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${isDarkMode ? 'bg-orange-900' : 'bg-orange-200'}`}>
                    <MapPin className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium ${isDarkMode ? 'text-orange-400' : 'text-orange-700'} mb-1`}>
                      Selected Location
                    </p>
                    {currentLocation.placeName && (
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-1`}>
                        {currentLocation.placeName}
                      </p>
                    )}
                    <p className={`text-xs font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
