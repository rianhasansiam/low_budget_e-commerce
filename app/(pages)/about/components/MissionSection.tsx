import React from 'react';

const MissionSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <span className="text-black font-semibold text-sm uppercase tracking-wider">
              Our Mission
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
              Making Quality Affordable for Everyone
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              At Low Budget E-Commerce, we&apos;re on a mission to democratize online shopping. 
              We believe that financial constraints shouldn&apos;t limit your access to quality products.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Through strategic partnerships with manufacturers and efficient operations, 
              we&apos;re able to offer products at prices that won&apos;t strain your wallet while 
              maintaining the quality standards you deserve.
            </p>
          </div>
          
          {/* Visual Element */}
          <div className="relative">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 lg:p-12">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm text-center border border-gray-200">
                  <div className="text-4xl font-bold text-black mb-2">50K+</div>
                  <div className="text-gray-600 text-sm">Happy Customers</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm text-center border border-gray-200">
                  <div className="text-4xl font-bold text-black mb-2">10K+</div>
                  <div className="text-gray-600 text-sm">Products</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm text-center border border-gray-200">
                  <div className="text-4xl font-bold text-black mb-2">99%</div>
                  <div className="text-gray-600 text-sm">Satisfaction Rate</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm text-center border border-gray-200">
                  <div className="text-4xl font-bold text-black mb-2">24/7</div>
                  <div className="text-gray-600 text-sm">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
