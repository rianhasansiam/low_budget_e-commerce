"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const CTASection = () => {
  return (
    <section className="py-16 lg:py-24 bg-black mb-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-white mb-4"
        >
          Ready to Start Shopping?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-gray-400 text-lg max-w-2xl mx-auto mb-8"
        >
          Discover thousands of products at unbeatable prices. Join our community of smart shoppers today!
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              href="/allProducts"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300"
            >
              Browse Products
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors duration-300"
            >
              Contact Us
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
