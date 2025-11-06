import { useState, useEffect } from 'react';
import { Star, MapPin, Sparkles, Heart } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import { toast } from 'sonner';
import { motion } from 'motion/react';

interface DetailingShopsPageProps {
  isDarkMode: boolean;
  currentLocation: { latitude: number; longitude: number; placeName?: string } | null;
  onLocationSelect: (latitude: number, longitude: number, placeName?: string) => void;
}

const offerBanners = [
  {
    id: 1,
    title: 'Premium Interior Detailing',
    description: '30% OFF this month. Book your appointment!',
    badge: 'Special Offer',
    gradient: 'from-green-600 via-emerald-700 to-teal-700',
  },
  {
    id: 2,
    title: 'Ceramic Coating Package',
    description: 'Protect your car with professional ceramic coating',
    badge: 'Premium Service',
    gradient: 'from-purple-600 via-purple-700 to-pink-700',
  },
  {
    id: 3,
    title: 'Complete Detailing Bundle',
    description: 'Interior + Exterior + Wax. Save $100!',
    badge: 'Best Value',
    gradient: 'from-blue-600 via-blue-700 to-indigo-700',
  },
];

// Mock data - in production, this would come from the API
const mockDetailingShops = [
  {
    id: 1,
    name: 'Elite Auto Detailing',
    rating: 4.9,
    reviews: 234,
    distance: '0.5 mi',
    open: true,
    services: ['Ceramic Coating', 'Interior Detailing', 'Paint Correction'],
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400',
    address: '123 Main St, City',
    latitude: 0,
    longitude: 0,
  },
  {
    id: 2,
    name: 'Shine Masters',
    rating: 4.8,
    reviews: 189,
    distance: '1.1 mi',
    open: true,
    services: ['Exterior Wash', 'Wax & Polish', 'Headlight Restoration'],
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400',
    address: '456 Oak Ave, City',
    latitude: 0,
    longitude: 0,
  },
  {
    id: 3,
    name: 'Premium Car Care',
    rating: 4.7,
    reviews: 156,
    distance: '1.8 mi',
    open: false,
    services: ['Full Detailing', 'Steam Cleaning', 'Odor Removal'],
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400',
    address: '789 Pine Rd, City',
    latitude: 0,
    longitude: 0,
  },
];

export function DetailingShopsPage({ isDarkMode, currentLocation }: DetailingShopsPageProps) {
  const [detailingShops] = useState(mockDetailingShops);
  const [interestedShops, setInterestedShops] = useState<Set<number>>(new Set());

  const handleInterested = (shopId: number, shopName: string) => {
    setInterestedShops(prev => {
      const newSet = new Set(prev);
      if (newSet.has(shopId)) {
        newSet.delete(shopId);
        toast.info(`Removed interest in ${shopName}`);
      } else {
        newSet.add(shopId);
        toast.success(`You're interested in ${shopName}! We've notified them.`);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6 px-4">
      {/* Offer Banners Carousel */}
      <Carousel className="w-full">
        <CarouselContent>
          {offerBanners.map((banner) => (
            <CarouselItem key={banner.id} className="md:basis-1/2 lg:basis-1/3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${banner.gradient} p-6 shadow-lg`}
              >
                <div className="relative z-10">
                  <Badge className="bg-yellow-400 text-yellow-900 mb-2">{banner.badge}</Badge>
                  <h2 className="text-white mb-2 font-bold text-lg">{banner.title}</h2>
                  <p className="text-white/90 mb-3 text-sm">{banner.description}</p>
                  <button className={`px-6 py-2 rounded-full ${isDarkMode ? 'bg-white text-green-700' : 'bg-white text-green-600'} hover:bg-gray-100 transition-colors font-medium`}>
                    Claim Offer
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mb-12"></div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className={`left-2 ${isDarkMode ? 'bg-gray-900/80 border-gray-700 text-gray-100' : 'bg-white/80'}`} />
        <CarouselNext className={`right-2 ${isDarkMode ? 'bg-gray-900/80 border-gray-700 text-gray-100' : 'bg-white/80'}`} />
      </Carousel>

      {/* Detailing Shops List */}
      <div className="space-y-4">
        <div>
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Detailing Shops
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Professional car care services near you
          </p>
        </div>

        {!currentLocation ? (
          <div className="text-center py-20">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
              isDarkMode ? 'bg-green-950/20' : 'bg-green-100'
            }`}>
              <MapPin className={`w-10 h-10 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              Please Set Your Location
            </h3>
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              To find nearby detailing shops, please select your location using the location picker above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {detailingShops.map((shop) => {
              const isInterested = interestedShops.has(shop.id);

              return (
                <motion.div
                  key={shop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                >
                  <Card
                    className={`overflow-hidden ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} transition-all`}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <ImageWithFallback
                        src={shop.image}
                        alt={shop.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge
                          variant="default"
                          className={shop.open ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                        >
                          {shop.open ? 'Open' : 'Closed'}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="mb-3">
                        <h4 className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                          {shop.name}
                        </h4>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {shop.rating.toFixed(1)}
                            </span>
                          </div>
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            ({shop.reviews} reviews)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 mb-3">
                        <MapPin className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {shop.address}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {shop.services.map((service, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className={`text-xs ${isDarkMode ? 'border-gray-700 text-gray-300 bg-gray-800/50' : 'border-gray-300 text-gray-700'}`}
                          >
                            {service}
                          </Badge>
                        ))}
                      </div>

                      <Button
                        onClick={() => handleInterested(shop.id, shop.name)}
                        className={`w-full transition-all ${
                          isInterested
                            ? 'bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white'
                            : isDarkMode
                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-100'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                        }`}
                      >
                        {isInterested ? (
                          <>
                            <Heart className="w-4 h-4 mr-2 fill-current" />
                            Interested
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            I'm Interested
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
