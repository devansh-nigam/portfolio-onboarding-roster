"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import OnboardingStepper from "@/components/OnboardingStepper/OnboardingStepper";
import styles from "./Onboarding.module.css";
import { useAppSelector } from "@/lib/hooks";

type StepStatus = "pending" | "current" | "completed" | "error";

interface Step {
  id: number;
  title: string;
  description: string;
  status: StepStatus;
  estimatedTime?: string;
  errorMessage?: string;
}

const Onboarding: React.FC = () => {
  const portfolioData = useAppSelector(
    (state) => state.portfolio?.portfolioData
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentStep, setCurrentStep] = useState(2);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [steps, setSteps] = useState<Step[]>([]);

  /**
 *  [
    {
      id: 1,
      title: "Connect Portfolio",
      description: "Link your existing portfolio or create a new one",
      status: "completed" as const,
      estimatedTime: "2 min",
    },
    {
      id: 2,
      title: "Upload Profile Photo",
      description: "Add a professional photo to your profile",
      status: "current" as const,
      estimatedTime: "1 min",
    },
    {
      id: 3,
      title: "Add Work Experience",
      description: "Import or manually add your work history",
      status: "error" as const,
      estimatedTime: "5 min",
    },
    {
      id: 4,
      title: "Setup Skills & Technologies",
      description: "List your technical skills and expertise",
      status: "completed" as const,
      estimatedTime: "3 min",
    },
    {
      id: 5,
      title: "Import Projects",
      description: "Showcase your best work and projects",
      status: "completed" as const,
      estimatedTime: "5 min",
      errorMessage:
        "Failed to connect to GitHub. Please check your permissions.",
    },
    {
      id: 6,
      title: "Review & Publish",
      description: "Final review before making your portfolio live",
      status: "completed" as const,
      estimatedTime: "2 min",
    },
  ]
 * 
 * 
 * 
 */

  useEffect(() => setSteps(portfolioData?.sections || []), [portfolioData]);

  const handleStepClick = (stepId: number) => {
    console.log("Clicked step:", stepId);
  };

  //   const handleContinue = () => {
  //     console.log("Continue clicked");
  //     // Handle continue action
  //   };

  //   const handleSkip = () => {
  //     console.log("Skip clicked");
  //     // Handle skip action
  //   };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <div className={styles.onboardingContainer}>
      <OnboardingStepper
        steps={steps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
        // onContinue={handleContinue}
        // onSkip={handleSkip}
      />

      <motion.div
        className={styles.mainContent}
        variants={contentVariants}
        initial="hidden"
        animate="visible"
      >
        <div className={styles.actionFooter}>
          <button className={styles.backButton}>← Back</button>
          <button className={styles.nextButton}>Continue →</button>
        </div>

        <div className={styles.contentHeader}>
          <h1>Are you able to see me?</h1>
        </div>

        <div className={styles.contentBody}>
          <h1>Hello world</h1>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
