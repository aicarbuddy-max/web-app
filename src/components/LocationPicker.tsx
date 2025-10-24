import { useState, useEffect } from 'react';
import { MapPin, Search, Loader2, Navigation } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner';

interface LocationPickerProps {
  isDarkMode: boolean;
  onLocationSelect: (latitude: number, longitude: number) => void;
  currentLocation?: { latitude: number; longitude: number } | null;
}

export function LocationPicker({ isDarkMode, onLocationSelect, currentLocation }: LocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [locationStatus, setLocationStatus] = useState<string>('');

  // Check if geolocation is available
  const isGeolocationAvailable = 'geolocation' in navigator;

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

  // Handle manual location input
  const handleManualLocation = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    if (isNaN(lat) || isNaN(lng)) {
      toast.error('Please enter valid latitude and longitude values');
      return;
    }

    if (lat < -90 || lat > 90) {
      toast.error('Latitude must be between -90 and 90');
      return;
    }

    if (lng < -180 || lng > 180) {
      toast.error('Longitude must be between -180 and 180');
      return;
    }

    onLocationSelect(lat, lng);
    setLocationStatus(`Location set: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    toast.success('Location set successfully!');
    setIsOpen(false);
    setManualLat('');
    setManualLng('');
  };

  // Auto-detect location on mount if not already set
  useEffect(() => {
    if (!currentLocation && isGeolocationAvailable) {
      // Optionally auto-detect on first load
      // Uncomment the line below to enable auto-detection
      // getCurrentLocation();
    }
  }, []);

  return (
    <div className="w-full">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className={`w-full md:w-auto ${
              isDarkMode
                ? 'bg-gray-900 border-gray-700 text-gray-100 hover:bg-gray-800'
                : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
            }`}
          >
            <MapPin className="w-4 h-4 mr-2" />
            <span className="truncate">
              {currentLocation
                ? `${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}`
                : 'Set Location'}
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

            {/* Divider */}
            <div className="relative">
              <div className={`absolute inset-0 flex items-center ${isDarkMode ? 'text-gray-700' : 'text-gray-300'}`}>
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className={`px-2 ${isDarkMode ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-500'}`}>
                  Or enter manually
                </span>
              </div>
            </div>

            {/* Manual Location Input */}
            <div className="space-y-3">
              <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Manual Input
              </h3>
              <div className="space-y-2">
                <div>
                  <label
                    htmlFor="latitude"
                    className={`block text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    Latitude (-90 to 90)
                  </label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="e.g., 40.7128"
                    value={manualLat}
                    onChange={(e) => setManualLat(e.target.value)}
                    className={isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : ''}
                  />
                </div>
                <div>
                  <label
                    htmlFor="longitude"
                    className={`block text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    Longitude (-180 to 180)
                  </label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="e.g., -74.0060"
                    value={manualLng}
                    onChange={(e) => setManualLng(e.target.value)}
                    className={isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : ''}
                  />
                </div>
              </div>
              <Button
                onClick={handleManualLocation}
                variant="outline"
                className={`w-full ${
                  isDarkMode
                    ? 'border-gray-700 text-gray-100 hover:bg-gray-800'
                    : 'border-gray-300 text-gray-900 hover:bg-gray-50'
                }`}
                disabled={!manualLat || !manualLng}
              >
                <Search className="w-4 h-4 mr-2" />
                Search This Location
              </Button>
            </div>

            {/* Current Location Display */}
            {currentLocation && (
              <div
                className={`p-3 rounded-lg ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                }`}
              >
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                  Current Location:
                </p>
                <p className={`text-sm font-mono ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
