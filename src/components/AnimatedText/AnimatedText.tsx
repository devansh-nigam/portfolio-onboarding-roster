"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./AnimatedText.module.css";

export type AnimationVariant =
  | "fadeIn"
  | "fadeInUp"
  | "fadeInDown"
  | "fadeInLeft"
  | "fadeInRight"
  | "slideUp"
  | "slideDown"
  | "scale"
  | "rotate"
  | "bounce"
  | "elastic"
  | "typing"
  | "letterFadeIn"
  | "letterSlideUp"
  | "letterBounce"
  | "letterRotate"
  | "wordFadeIn"
  | "wordSlideUp"
  | "glitch"
  | "wave"
  | "reveal"
  | "neonGlow";

interface AnimatedTextProps {
  text: string;
  variant?: AnimationVariant;
  fontSize?: string;
  fontWeight?: string | number;
  color?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  className?: string;
  repeat?: boolean;
  repeatDelay?: number;
  onAnimationComplete?: () => void;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  variant = "fadeIn",
  fontSize = "1rem",
  fontWeight = "normal",
  color = "inherit",
  delay = 0,
  duration = 0.6,
  stagger = 0.05,
  className = "",
  repeat = false,
  repeatDelay = 2,
  onAnimationComplete,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  // Typing animation effect
  useEffect(() => {
    if (variant === "typing") {
      setIsTyping(true);
      setDisplayedText("");
      setCurrentIndex(0);

      const typingInterval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          if (prevIndex < text.length) {
            setDisplayedText(text.slice(0, prevIndex + 1));
            return prevIndex + 1;
          } else {
            clearInterval(typingInterval);
            setIsTyping(false);
            onAnimationComplete?.();
            return prevIndex;
          }
        });
      }, 100);

      return () => clearInterval(typingInterval);
    }
  }, [text, variant, onAnimationComplete]);

  const containerStyle = {
    fontSize,
    fontWeight,
    color,
  };

  // Container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay,
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  // Letter/Word variants
  const letterVariants = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration },
      },
    },
    slideUp: {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration },
      },
    },
    bounce: {
      hidden: { opacity: 0, y: -20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          damping: 12,
          stiffness: 200,
          duration,
        },
      },
    },
    rotate: {
      hidden: { opacity: 0, rotateY: 90 },
      visible: {
        opacity: 1,
        rotateY: 0,
        transition: { duration },
      },
    },
  };

  // Text variants for whole text animations
  const textVariants = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { delay, duration },
      },
    },
    fadeInUp: {
      hidden: { opacity: 0, y: 30 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { delay, duration },
      },
    },
    fadeInDown: {
      hidden: { opacity: 0, y: -30 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { delay, duration },
      },
    },
    fadeInLeft: {
      hidden: { opacity: 0, x: -30 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { delay, duration },
      },
    },
    fadeInRight: {
      hidden: { opacity: 0, x: 30 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { delay, duration },
      },
    },
    slideUp: {
      hidden: { y: 50, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { delay, duration },
      },
    },
    slideDown: {
      hidden: { y: -50, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { delay, duration },
      },
    },
    scale: {
      hidden: { scale: 0, opacity: 0 },
      visible: {
        scale: 1,
        opacity: 1,
        transition: {
          delay,
          type: "spring",
          stiffness: 200,
          damping: 10,
        },
      },
    },
    rotate: {
      hidden: { rotateY: 90, opacity: 0 },
      visible: {
        rotateY: 0,
        opacity: 1,
        transition: { delay, duration },
      },
    },
    bounce: {
      hidden: { y: -50, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          delay,
          type: "spring",
          damping: 8,
          stiffness: 100,
        },
      },
    },
    elastic: {
      hidden: { scale: 0, opacity: 0 },
      visible: {
        scale: 1,
        opacity: 1,
        transition: {
          delay,
          type: "spring",
          damping: 5,
          stiffness: 100,
        },
      },
    },
    glitch: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { delay, duration },
      },
    },
    wave: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { delay, duration },
      },
    },
    reveal: {
      hidden: { opacity: 1 },
      visible: {
        opacity: 1,
        transition: { delay, duration },
      },
    },
    neonGlow: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { delay, duration },
      },
    },
  };

  // Render typing animation
  if (variant === "typing") {
    return (
      <div
        className={`${styles.container} ${className}`}
        style={containerStyle}
      >
        <span>{displayedText}</span>
        {isTyping && <span className={styles.cursor}>|</span>}
      </div>
    );
  }

  // Render letter-by-letter animations
  if (variant.startsWith("letter")) {
    const animationType = variant.replace("letter", "").toLowerCase();
    const letters = text.split("");

    return (
      <motion.div
        className={`${styles.container} ${className}`}
        style={containerStyle}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onAnimationComplete={onAnimationComplete}
      >
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            variants={
              letterVariants[animationType as keyof typeof letterVariants]
            }
            className={letter === " " ? styles.space : ""}
          >
            {letter}
          </motion.span>
        ))}
      </motion.div>
    );
  }

  // Render word-by-word animations
  if (variant.startsWith("word")) {
    const animationType = variant.replace("word", "").toLowerCase();
    const words = text.split(" ");

    return (
      <motion.div
        className={`${styles.container} ${className}`}
        style={containerStyle}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onAnimationComplete={onAnimationComplete}
      >
        {words.map((word, index) => (
          <motion.span
            key={index}
            variants={
              letterVariants[animationType as keyof typeof letterVariants]
            }
            className={styles.word}
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    );
  }

  // Special animations with custom styling
  const getSpecialClassName = () => {
    switch (variant) {
      case "glitch":
        return styles.glitch;
      case "wave":
        return styles.wave;
      case "reveal":
        return styles.reveal;
      case "neonGlow":
        return styles.neonGlow;
      default:
        return "";
    }
  };

  // Render whole text animations
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={`${styles.container} ${getSpecialClassName()} ${className}`}
        style={containerStyle}
        variants={textVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onAnimationComplete={onAnimationComplete}
        key={text}
      >
        {variant === "wave"
          ? text.split("").map((letter, index) => (
              <motion.span
                key={index}
                className={styles.waveLetter}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 0.5,
                  delay: delay + index * 0.1,
                  repeat: repeat ? Infinity : 0,
                  repeatDelay: repeatDelay,
                }}
              >
                {letter}
              </motion.span>
            ))
          : text}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedText;
