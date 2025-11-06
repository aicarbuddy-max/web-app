import { MessageCircleQuestion, Wrench, Package, Sparkles, CircleParking, Fuel, Battery, Droplets, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface HomePageProps {
  isDarkMode: boolean;
  onNavigate: (tab: string) => void;
  onAskClick: () => void;
}

export function HomePage({ isDarkMode, onNavigate, onAskClick }: HomePageProps) {
  const heroTiles = [
    {
      id: 'ai',
      title: 'Ask AI',
      tagline: 'Get instant answers to your car questions',
      icon: MessageCircleQuestion,
      gradient: 'from-blue-600 to-cyan-500',
      onClick: onAskClick
    },
    {
      id: 'garages',
      title: 'Find Garages',
      tagline: 'Trusted repair shops near you',
      icon: Wrench,
      gradient: 'from-orange-600 to-orange-500',
      onClick: () => onNavigate('garages')
    },
    {
      id: 'auto-parts',
      title: 'Auto Part Shops',
      tagline: 'Quality parts for your vehicle',
      icon: Package,
      gradient: 'from-purple-600 to-purple-500',
      onClick: () => onNavigate('auto-parts')
    },
    {
      id: 'detailing',
      title: 'Detailing Shops',
      tagline: 'Professional car care services',
      icon: Sparkles,
      gradient: 'from-green-600 to-emerald-500',
      onClick: () => onNavigate('detailing')
    }
  ];

  const otherServices = [
    {
      id: 'tire-shops',
      title: 'Tire Shops',
      description: 'Find the best tire dealers',
      icon: CircleParking,
      color: 'text-orange-400'
    },
    {
      id: 'petrol-pumps',
      title: 'Petrol Pumps',
      description: 'Nearby fuel stations',
      icon: Fuel,
      color: 'text-blue-400'
    },
    {
      id: 'battery-shops',
      title: 'Battery Shops',
      description: 'Car battery specialists',
      icon: Battery,
      color: 'text-green-400'
    },
    {
      id: 'car-washes',
      title: 'Car Washes',
      description: 'Keep your car spotless',
      icon: Droplets,
      color: 'text-cyan-400'
    },
    {
      id: 'ev-charging',
      title: 'EV Charging',
      description: 'Electric vehicle charging stations',
      icon: Zap,
      color: 'text-yellow-400'
    }
  ];

  return (
    <div className="min-h-screen pb-8">
      {/* Hero Section */}
      <div className="px-4 pt-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Welcome to Car Buddy
          </h1>
          <p className={`text-lg mb-8 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Your complete automotive service companion
          </p>
        </motion.div>

        {/* Hero Tiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {heroTiles.map((tile, index) => {
            const Icon = tile.icon;
            return (
              <motion.button
                key={tile.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={tile.onClick}
                className={`relative overflow-hidden rounded-2xl p-6 md:p-8 text-left transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-gray-900/50 hover:bg-gray-900/70 border border-gray-800 hover:border-gray-700'
                    : 'bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-lg'
                }`}
              >
                {/* Gradient Background Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tile.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />

                <div className="relative z-10">
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${tile.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>

                  <h3 className={`text-xl md:text-2xl font-bold mb-2 ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {tile.title}
                  </h3>

                  <p className={`text-sm md:text-base ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {tile.tagline}
                  </p>
                </div>

                {/* Hover Arrow */}
                <motion.div
                  className={`absolute bottom-6 right-6 w-8 h-8 rounded-full bg-gradient-to-br ${tile.gradient} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}
                  whileHover={{ x: 4 }}
                >
                  <span className="text-white text-lg">→</span>
                </motion.div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Other Services Section */}
      <div className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Other Services
          </h2>
          <p className={`text-base mb-6 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Explore more automotive services
          </p>
        </motion.div>

        {/* Horizontally Scrollable Services */}
        <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          <div className="flex gap-4 min-w-max">
            {otherServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.button
                  key={service.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center p-6 rounded-2xl min-w-[160px] md:min-w-[180px] transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-gray-900/50 hover:bg-gray-900/70 border border-gray-800 hover:border-gray-700'
                      : 'bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-lg'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-xl ${
                    isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                  } flex items-center justify-center mb-3`}>
                    <Icon className={`w-7 h-7 ${service.color}`} />
                  </div>

                  <h4 className={`text-sm font-semibold mb-1 text-center ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {service.title}
                  </h4>

                  <p className={`text-xs text-center ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {service.description}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="px-4 mt-12"
      >
        <div className={`rounded-2xl p-6 md:p-8 ${
          isDarkMode
            ? 'bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700'
            : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200'
        }`}>
          <h3 className={`text-xl md:text-2xl font-bold mb-2 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Need Help?
          </h3>
          <p className={`mb-6 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Get in touch with our support team
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigate('contact')}
              className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all ${
                isDarkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-100'
                  : 'bg-white hover:bg-gray-50 text-gray-900 shadow-md'
              }`}
            >
              Contact Us
            </button>

            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white transition-all text-center"
            >
              WhatsApp Support
            </a>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <div className={`text-center mt-12 px-4 text-sm ${
        isDarkMode ? 'text-gray-500' : 'text-gray-500'
      }`}>
        <p>&copy; 2025 Car Buddy. All rights reserved.</p>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
