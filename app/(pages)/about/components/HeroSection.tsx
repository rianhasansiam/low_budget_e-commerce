import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative bg-black text-white py-20 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          About <span className="text-white border-b-4 border-white">Low Budget</span> E-Commerce
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto text-gray-300 leading-relaxed">
          Your trusted destination for affordable, quality products. We believe everyone deserves access to great products without breaking the bank.
        </p>
      </div>
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default HeroSection;
