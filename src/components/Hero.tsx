import React from 'react';
import { Shield, Beaker, Sparkles, Heart } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Main Content */}
      <div className="relative container mx-auto px-4 py-6 md:py-12 lg:py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-lg mb-4 md:mb-6 border border-blue-100">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-yellow-500" />
            <span className="text-xs md:text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Premium Quality Guaranteed
            </span>
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-yellow-500" />
          </div>

          {/* Main Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 md:mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Research-Grade
            </span>
            <br />
            <span className="text-gray-800">Peptides</span>
            <Heart className="inline-block w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-pink-500 ml-1 md:ml-2 mb-1 md:mb-2 animate-pulse" />
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-700 mb-6 md:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Verified reseller- Jonina David
            </span>
          </p>
          
          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8 max-w-xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-blue-100">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-2 md:p-3 rounded-lg md:rounded-xl mb-2 md:mb-3 inline-block shadow-md">
                <Shield className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 mb-0.5 md:mb-1">Lab Tested</h3>
              <p className="text-[10px] sm:text-xs text-gray-500">Third-party verified</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-purple-100">
              <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-2 md:p-3 rounded-lg md:rounded-xl mb-2 md:mb-3 inline-block shadow-md">
                <Beaker className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 mb-0.5 md:mb-1">99%+ Purity</h3>
              <p className="text-[10px] sm:text-xs text-gray-500">Research grade</p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="relative bg-white/90 backdrop-blur-sm border-t border-blue-100">
        <div className="container mx-auto px-4 py-2 md:py-3">
          <p className="text-[10px] sm:text-xs md:text-sm text-center text-gray-600">
            <span className="inline-flex items-center gap-0.5 md:gap-1">
              <Shield className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
              <strong className="text-blue-700">Research Use Only:</strong>
            </span>
            {' '}All peptides are sold for research purposes only. Not for human consumption.
          </p>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Hero;
