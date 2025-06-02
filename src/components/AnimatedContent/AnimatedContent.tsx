"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./AnimatedContent.module.css";

interface AnimatedContentProps {
  children: ReactNode;
}

export default function AnimatedContent({ children }: AnimatedContentProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [key, setKey] = useState(pathname);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    // Create audio element with a subtle pop sound using Web Audio API
    const createPopSound = () => {
      const audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();

      const playPopSound = () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Create a pleasant "pop" sound
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          200,
          audioContext.currentTime + 0.1
        );

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          0.1,
          audioContext.currentTime + 0.01
        );
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.1
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      };

      return playPopSound;
    };

    const playSound = createPopSound();
    audioRef.current = { play: playSound } as HTMLAudioElement;
  }, []);

  // Update key when pathname changes and play sound
  useEffect(() => {
    if (!isFirstLoad && audioRef.current) {
      // Small delay to sync with animation start
      setTimeout(() => {
        try {
          audioRef.current?.play();
        } catch (error) {
          console.log("Audio play failed:", error);
        }
      }, 50);
    }

    setKey(pathname);
    setIsFirstLoad(false);
  }, [pathname, isFirstLoad]);

  // Animation variants for the main content container
  const containerVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.6, 1],
      },
    },
  };

  // Animation variants for content appearing from bottom (non-home pages)
  const slideUpVariants = {
    hidden: {
      opacity: 0,
      y: 100,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -50,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.6, 1],
      },
    },
  };

  // Animation variants for child elements
  const childVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={key}
        className={`${styles.content} ${
          isHome ? styles.contentHome : styles.contentFullWidth
        }`}
        variants={isHome ? containerVariants : slideUpVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        layout
        transition={{
          layout: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
          },
        }}
      >
        <motion.div className={styles.contentInner} variants={childVariants}>
          {children}
        </motion.div>
      </motion.main>
    </AnimatePresence>
  );
}
