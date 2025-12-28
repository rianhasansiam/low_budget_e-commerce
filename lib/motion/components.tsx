"use client";

import { ReactNode } from "react";
import { motion, HTMLMotionProps, Variants } from "framer-motion";
import {
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  staggerItem,
  cardVariants,
} from "./variants";

// ============ TYPES ============
interface MotionWrapperProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  delay?: number;
}

interface ScrollRevealProps extends MotionWrapperProps {
  direction?: "up" | "down" | "left" | "right" | "scale";
}

interface StaggerContainerProps extends MotionWrapperProps {
  staggerDelay?: number;
}

// ============ SCROLL REVEAL COMPONENT ============
export function ScrollReveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  ...props
}: ScrollRevealProps) {
  const variants: Record<string, Variants> = {
    up: fadeInUp,
    down: fadeInDown,
    left: fadeInLeft,
    right: fadeInRight,
    scale: scaleIn,
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={variants[direction]}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ============ STAGGER CONTAINER COMPONENT ============
export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.1,
  ...props
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ============ STAGGER ITEM COMPONENT ============
export function StaggerItem({
  children,
  className = "",
  ...props
}: MotionWrapperProps) {
  return (
    <motion.div variants={staggerItem} className={className} {...props}>
      {children}
    </motion.div>
  );
}

// ============ CARD MOTION COMPONENT ============
export function MotionCard({
  children,
  className = "",
  delay = 0,
  ...props
}: MotionWrapperProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={cardVariants}
      transition={{ delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ============ HERO TEXT COMPONENT ============
export function HeroText({
  children,
  className = "",
  delay = 0,
  ...props
}: MotionWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ============ BUTTON MOTION COMPONENT ============
export function MotionButton({
  children,
  className = "",
  ...props
}: MotionWrapperProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ============ SECTION WRAPPER ============
export function SectionWrapper({
  children,
  className = "",
  ...props
}: MotionWrapperProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6 }}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  );
}

// ============ FLOATING ANIMATION ============
export function FloatingElement({
  children,
  className = "",
  ...props
}: MotionWrapperProps) {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ============ ICON MOTION COMPONENT ============
export function MotionIcon({
  children,
  className = "",
  ...props
}: MotionWrapperProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.2, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ============ COUNTER ANIMATION ============
interface CounterProps {
  from?: number;
  to: number;
  duration?: number;
  className?: string;
}

export function Counter({
  to,
  className = "",
}: CounterProps) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={className}
    >
      {to}
    </motion.span>
  );
}
