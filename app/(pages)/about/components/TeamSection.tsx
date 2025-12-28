"use client";

import React from 'react';
import { motion } from 'framer-motion';

const team = [
  {
    name: 'Sarah Johnson',
    role: 'CEO & Founder',
    image: '/team/sarah.jpg',
    fallbackInitials: 'SJ',
  },
  {
    name: 'Michael Chen',
    role: 'Head of Operations',
    image: '/team/michael.jpg',
    fallbackInitials: 'MC',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Customer Experience Lead',
    image: '/team/emily.jpg',
    fallbackInitials: 'ER',
  },
  {
    name: 'David Kim',
    role: 'Tech Lead',
    image: '/team/david.jpg',
    fallbackInitials: 'DK',
  },
];

const TeamSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="text-black font-semibold text-sm uppercase tracking-wider">
            Our Team
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Meet the People Behind Our Success
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            A dedicated team working tirelessly to bring you the best shopping experience.
          </p>
        </motion.div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.article 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center group"
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative mb-4 mx-auto w-32 h-32 lg:w-40 lg:h-40"
              >
                {/* Fallback avatar with initials */}
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white text-2xl lg:text-3xl font-bold transition-transform duration-300">
                  {member.fallbackInitials}
                </div>
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {member.name}
              </h3>
              <p className="text-gray-700 text-sm font-medium">
                {member.role}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
