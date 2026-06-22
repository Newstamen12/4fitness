import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Image imports
import pic1 from '../assets/4fitness pictures.jpg';
import pic2 from '../assets/4fitness pictures2.jpg';
import pic4 from '../assets/4fitness pictures 4.jpg';
import pic5 from '../assets/4fitness pictures 5.jpg';
import pic6 from '../assets/4fitness6.jpg';
import pic7 from '../assets/4 fitness 7.jpg';
import pic8 from '../assets/4 fitness 8.jpg';
import pic9 from '../assets/4 fitness 9.jpg';
import pdoImg from '../assets/pdo.jpg';

export default function About() {
  // Original fading slides assets
  const sliderImages = [pic1, pic2, pic4, pic5];
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Infinite track assets
  const marqueeImages = [pic6, pic7, pic8, pic9, pdoImg];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [sliderImages.length]);

  const coreValues = [
    { name: "Strength", icon: "💪" },
    { name: "Dedication", icon: "🎯" },
    { name: "Inspire", icon: "✨" },
    { name: "Educate", icon: "📚" },
    { name: "Discipline", icon: "⏳" },
    { name: "Wellness", icon: "🌱" },
    { name: "Confidence", icon: "👑" },
    { name: "Consistency", icon: "🔄" },
    { name: "Growth", icon: "📈" },
    { name: "Community", icon: "👥" },
  ];

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] text-[#262626] font-sans antialiased overflow-x-hidden relative">
      
      {/* LUXURY BG ACCENTS */}
      <div className="absolute top-0 right-[10%] w-500px h-500px bg-rose-200/20 rounded-full blur-[130px] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto space-y-20 px-4 sm:px-8 relative z-10 pt-32">
        
        {/* HERO BRAND SECTION */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-rose-100/60 border border-rose-200 px-5 py-2 rounded-full">
            <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-rose-600 text-xs font-mono font-bold uppercase tracking-widest">
              The 4 FITNESS Movement
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#111111] uppercase leading-tight">
            Transforming Community <br />
            <span className="font-serif italic text-transparent bg-clip-text bg-linear-to-r from-rose-500 to-amber-500 normal-case">
              Fitness & Culture
            </span>
          </h1>
          
          <p className="text-[#555555] text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
            More than just a gym portal. 4 FITNESS is an elite training philosophy dedicated to high-performance coaching, community workout events, and structured physical accountability.
          </p>
        </div>

        {/* 1. THE INFINITE SCROLL CAROUSEL */}
        <div className="scroll-capture-flow relative w-full overflow-hidden border-y border-neutral-200/60 bg-white py-6 group">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-linear-to-r from-[#FAFAFA] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-[#FAFAFA] to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee-loop px-2 group-hover:[animation-play-state:paused] transition-all duration-700">
            {[...marqueeImages, ...marqueeImages].map((img, idx) => (
              <div 
                key={idx} 
                className="w-64 sm:w-72 aspect-4/5 bg-white border border-neutral-200/80 rounded-2xl overflow-hidden p-2 shadow-md hover:border-rose-400 transition-all duration-500 shrink-0"
              >
                <img
                  src={img}
                  alt="4 FITNESS Culture"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 2. RESTORED AUTOMATED FADING SLIDES CONTAINER */}
        <div className="scroll-capture-flow relative w-full h-112.5 sm:h-137.5 bg-white border border-neutral-200/60 rounded-3xl overflow-hidden shadow-xl shadow-neutral-100/50">
          {sliderImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full bg-white flex items-center justify-center transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={img}
                alt={`4 FITNESS Community Event ${index + 1}`}
                className="max-w-full max-h-full object-contain p-4 filter contrast-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-50/20 via-transparent to-transparent pointer-events-none" />
            </div>
          ))}

          {/* SLIDES INDICATOR DOTS */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {sliderImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'w-6 bg-rose-500' : 'w-2 bg-neutral-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* MISSION & VISION PILLARS */}
        <div className="scroll-capture-flow grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-white border border-neutral-200/60 rounded-3xl space-y-4 shadow-xs">
            <span className="text-xs font-mono font-bold tracking-wider text-rose-600 uppercase block">🚀 Our Mission</span>
            <h2 className="text-xl font-bold text-[#111111] uppercase">Driving Execution</h2>
            <p className="text-sm text-[#666666] leading-relaxed">
              To help people build healthier, stronger, and more confident lifestyles through personalized fitness coaching, immersive wellness education, and consistent premium support systems.
            </p>
          </div>

          <div className="p-8 bg-white border border-neutral-200/60 rounded-3xl space-y-4 shadow-xs">
            <span className="text-xs font-mono font-bold tracking-wider text-amber-600 uppercase block">👁️ Our Vision</span>
            <h2 className="text-xl font-bold text-[#111111] uppercase">The Future State</h2>
            <p className="text-sm text-[#666666] leading-relaxed">
              To build a thriving global community where individuals collectively prioritize health, develop unshakeable confidence, and sustain lifelong physical wellness.
            </p>
          </div>
        </div>

        {/* CORE VALUES */}
        <div className="scroll-capture-flow space-y-8 pb-16">
          <div className="text-center md:text-left">
            <span className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase">FOUNDATIONAL MATRICES</span>
            <h2 className="text-2xl font-bold text-[#111111] uppercase mt-1">
              Core Brand <span className="font-serif italic text-rose-500 normal-case">Values</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {coreValues.map((val, idx) => (
              <div 
                key={idx} 
                className="p-5 bg-white border border-neutral-200/60 rounded-2xl flex flex-col items-center text-center justify-center space-y-2 shadow-xs group"
              >
                <span className="text-xl">{val.icon}</span>
                <span className="text-xs font-mono font-bold tracking-wide text-[#444444] group-hover:text-rose-500 transition-colors">
                  {val.name}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}