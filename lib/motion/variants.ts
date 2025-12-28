// Reusable Framer Motion animation variants for consistent animations across the site

import { Variants } from "framer-motion";

// ============ FADE ANIMATIONS ============
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// ============ SCALE ANIMATIONS ============
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export const scaleInSpring: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 15 }
  }
};

// ============ STAGGER CONTAINER ============
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  }
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

// ============ STAGGER ITEMS ============
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

export const staggerItemScale: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

// ============ HOVER ANIMATIONS ============
export const hoverScale = {
  scale: 1.05,
  transition: { duration: 0.2 }
};

export const hoverScaleLarge = {
  scale: 1.1,
  transition: { duration: 0.2 }
};

export const hoverLift = {
  y: -5,
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  transition: { duration: 0.2 }
};

// ============ TAP ANIMATIONS ============
export const tapScale = {
  scale: 0.95
};

// ============ SLIDE ANIMATIONS ============
export const slideInFromBottom: Variants = {
  hidden: { y: "100%", opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", damping: 25, stiffness: 300 }
  },
  exit: { 
    y: "100%", 
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

export const slideInFromTop: Variants = {
  hidden: { y: "-100%", opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", damping: 25, stiffness: 300 }
  },
  exit: { 
    y: "-100%", 
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

export const slideInFromLeft: Variants = {
  hidden: { x: "-100%", opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { type: "spring", damping: 25, stiffness: 300 }
  },
  exit: { 
    x: "-100%", 
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

export const slideInFromRight: Variants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { type: "spring", damping: 25, stiffness: 300 }
  },
  exit: { 
    x: "100%", 
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

// ============ CARD ANIMATIONS ============
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// ============ HERO ANIMATIONS ============
export const heroTitle: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

export const heroSubtitle: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, delay: 0.2, ease: "easeOut" }
  }
};

// ============ NAVBAR ANIMATIONS ============
export const navbarVariants: Variants = {
  hidden: { y: -100, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

// ============ BUTTON ANIMATIONS ============
export const buttonVariants: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 }
};

// ============ ICON ANIMATIONS ============
export const iconBounce: Variants = {
  initial: { scale: 1 },
  animate: { 
    scale: [1, 1.2, 1],
    transition: { duration: 0.3 }
  }
};

// ============ PAGE TRANSITION ============
export const pageTransition: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.4 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

// ============ FOOTER ANIMATIONS ============
export const footerSection: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

// ============ FLIP ANIMATIONS ============
export const flipIn: Variants = {
  hidden: { 
    rotateX: 90,
    opacity: 0 
  },
  visible: { 
    rotateX: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// ============ PULSE ANIMATION ============
export const pulse: Variants = {
  initial: { scale: 1 },
  animate: { 
    scale: [1, 1.05, 1],
    transition: { 
      duration: 2, 
      repeat: Infinity, 
      repeatType: "reverse" 
    }
  }
};
