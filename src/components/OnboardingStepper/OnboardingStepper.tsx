"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./OnboardingStepper.module.css";

type StepStatus = "pending" | "current" | "completed" | "error";

interface Step {
  id: number;
  title: string;
  description: string;
  status: StepStatus;
  estimatedTime: string; // Make required
  errorMessage?: string; // Keep optional
  originalStatus?: StepStatus; // Keep optional
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any; // Make required and use any for flexibility
}

interface OnboardingStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
  onContinue?: () => void;
  onSkip?: () => void;
}

const OnboardingStepper: React.FC<OnboardingStepperProps> = ({
  steps,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  currentStep,
  onStepClick,
}) => {
  const completedSteps = steps?.filter(
    (step) => step.originalStatus === "completed" || step.status === "completed" // Check both statuses
  ).length;
  const totalSteps = steps?.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  const getStatusIcon = (status: StepStatus, stepNumber: number) => {
    switch (status) {
      case "completed":
        return "✓";
      case "current":
        return stepNumber;
      case "error":
        return "!";
      default:
        return stepNumber;
    }
  };

  const getStatusText = (status: StepStatus) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "current":
        return "In Progress";
      case "error":
        return "Error";
      default:
        return "Pending";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const stepVariants = {
    hidden: {
      opacity: 0,
      x: 20,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.sidebarContent}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Setup Progress</h2>
          <p className={styles.sidebarSubtitle}>
            Complete your portfolio setup
          </p>

          <div className={styles.progressOverview}>
            <div
              className={styles.progressCircle}
              style={
                {
                  "--progress-angle": `${progressPercentage * 3.6}deg`,
                } as React.CSSProperties
              }
            >
              <div className={styles.progressCircleInner}>
                <span className={styles.progressText}>
                  {Math.round(progressPercentage)}%
                </span>
              </div>
            </div>
            <div className={styles.progressStats}>
              <div>
                {completedSteps} of {totalSteps} completed
              </div>
              <div style={{ opacity: 0.7 }}>
                {totalSteps - completedSteps} remaining
              </div>
            </div>
          </div>
        </div>

        <motion.div
          className={styles.stepsContainer}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {steps?.map((step, index) => (
              <motion.div
                key={step.id}
                className={styles.stepItem}
                variants={stepVariants}
                layout
                onClick={() => onStepClick?.(step.id)}
                style={{ cursor: onStepClick ? "pointer" : "default" }}
              >
                {index < steps?.length - 1 && (
                  <div
                    className={`${styles.stepConnector} ${
                      index === steps?.length - 1 ? styles.lastStep : ""
                    }`}
                  />
                )}

                <motion.div
                  className={`${styles.stepIcon} ${styles[step.status]}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {getStatusIcon(step.status, step.id)}
                </motion.div>

                <div className={styles.stepContent}>
                  <h3 className={`${styles.stepTitle} ${styles[step.status]}`}>
                    {step.title}
                  </h3>
                  <p className={styles.stepDescription}>
                    {step.status === "error" && step.errorMessage
                      ? step.errorMessage
                      : step.description}
                  </p>

                  <div className={styles.stepMeta}>
                    <span
                      className={`${styles.stepStatus} ${styles[step.status]}`}
                    >
                      <span
                        style={{ fontSize: "0.6rem", marginRight: "0.25rem" }}
                      >
                        ●
                      </span>
                      {getStatusText(step.status)}
                    </span>
                    {step.estimatedTime && step.status === "pending" && (
                      <span className={styles.stepTime}>
                        ~{step.estimatedTime}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingStepper;
