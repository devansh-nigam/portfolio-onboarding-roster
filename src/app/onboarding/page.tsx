"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import OnboardingStepper from "@/components/OnboardingStepper/OnboardingStepper";
import styles from "./Onboarding.module.css";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  PortfolioState,
  setPortfolioDataFromAPI,
  setStepperStep,
} from "@/lib/slices/portfolio/portfolioSlice";
import ProfileSection from "@components/Sections/ProfileSection/ProfileSection";
import ProfilePhotoSection from "@components/Sections/ProfilePhotoSection/ProfilePhotoSection";
import WorkExperienceSection from "@components/Sections/WorkExperienceSection/WorkExperienceSection";
import SkillsSection from "@components/Sections/SkillsSection/SkillsSection";
import SocialLinksSection from "@components/Sections/SocialLinksSection/SocialLinksSection";

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

const Onboarding: React.FC = () => {
  const portfolioData = useAppSelector(
    (state) => state.portfolio?.portfolioData
  ) as PortfolioState | undefined;
  const currentStepIndex = useAppSelector(
    (state) => state.portfolio?.stepper?.currentStep || 0
  );

  const dispatch = useAppDispatch();

  //const [currentStep, setCurrentStep] = useState(1);

  const [steps, setSteps] = useState<Step[]>([]);

  const renderCurrentSection = () => {
    const currentSection = steps.find((step) => step.status === "current");

    switch (currentSection?.id) {
      case 1: // Profile Photo section
        return <ProfilePhotoSection sectionData={currentSection} />;
      case 2: // Profile section
        return <ProfileSection sectionData={currentSection} />;
      case 3: // Work Experience section
        return <WorkExperienceSection sectionData={currentSection} />;
      case 4:
        return <SkillsSection sectionData={currentSection} />;
      case 5:
        return <SocialLinksSection sectionData={currentSection} />;
      default:
        return (
          <div className={styles.contentBody}>
            <h1>Section not implemented yet</h1>
            <p>Current step: {currentSection?.title}</p>
          </div>
        );
    }
  };

  useEffect(() => {
    if (portfolioData?.sections) {
      const initialSteps = portfolioData.sections.map(
        (section: Step, index: number) => ({
          ...section,
          originalStatus: section.status, // Store original status
          status: index === currentStepIndex ? "current" : section.status,
        })
      );
      setSteps(initialSteps);
    }
  }, [portfolioData, currentStepIndex]);

  const handleStepClick = (stepId: number) => {
    console.log("Clicked step:", stepId);
    dispatch(setStepperStep(stepId - 1));
  };

  // Update step status when navigating
  const updateStepStatus = (
    stepIndex: number,
    newStatus: StepStatus,
    shouldUpdateOriginal = false
  ) => {
    const updatedSteps = steps.map((step, index) => {
      if (index === stepIndex) {
        return {
          ...step,
          status: newStatus,
          originalStatus: shouldUpdateOriginal
            ? newStatus
            : step.originalStatus,
        };
      }
      return step;
    });

    setSteps(updatedSteps);

    // Update portfolio data in Redux
    const updatedPortfolioData = {
      ...portfolioData,
      sections: updatedSteps.map((step) => ({
        ...step,
        status: step.originalStatus, // Always use original status in portfolio data
      })),
    };

    dispatch(setPortfolioDataFromAPI(updatedPortfolioData));
  };

  const navigateToStep = (targetStepIndex: number) => {
    if (targetStepIndex < 0 || targetStepIndex >= steps.length) return;

    // Auto-complete current step if it has valid data
    if (currentStepIndex < steps.length) {
      const currentStep = steps[currentStepIndex];
      const isValid = validateCurrentStep(currentStep);

      if (isValid) {
        // Mark current step as completed since it has valid data
        const updatedSteps = [...steps];
        updatedSteps[currentStepIndex] = {
          ...updatedSteps[currentStepIndex],
          originalStatus: "completed",
        };
        setSteps(updatedSteps);
        updateStepStatus(currentStepIndex, "completed", true);
      } else {
        // Restore to original status if not valid
        updateStepStatus(
          currentStepIndex,
          steps[currentStepIndex].originalStatus || "pending"
        );
      }
    }

    // Set new step as current
    updateStepStatus(targetStepIndex, "current");

    // Update Redux stepper state
    dispatch(setStepperStep(targetStepIndex));
  };

  const handleBack = () => {
    const previousStepIndex = currentStepIndex - 1;
    if (previousStepIndex >= 0) {
      navigateToStep(previousStepIndex);
    }
  };

  // Handle continue button
  const handleContinue = () => {
    const nextStepIndex = currentStepIndex + 1;

    // Navigate to next step if available
    if (nextStepIndex < steps.length) {
      navigateToStep(nextStepIndex); // This will auto-complete current step if valid
    } else {
      // All steps completed - could navigate to final review or dashboard
      console.log("All onboarding steps completed!");
      alert("Congratulations! You've completed your portfolio setup.");
    }
  };

  const validateCurrentStep = (step: Step): boolean => {
    if (!step) return false;

    switch (step.id) {
      case 1: // Profile Photo
        const photoData = step.data?.profileImage;
        // Also check the original portfolio data as backup
        const originalPhotoData = portfolioData?.sections?.find(
          (s) => s.id === 1
        )?.data?.profileImage;

        const hasValidPhoto =
          (photoData?.url && photoData.url.trim() !== "") ||
          (originalPhotoData?.url && originalPhotoData.url.trim() !== "");

        return hasValidPhoto;

      case 2: // Profile
        const profileData = step.data;
        return !!(
          profileData?.firstName?.trim() &&
          profileData?.lastName?.trim() &&
          profileData?.title?.trim() &&
          profileData?.contact?.email?.trim() &&
          profileData?.location?.city?.trim() &&
          profileData?.location?.country?.trim()
        );

      case 3: // Work Experience
        const workData = step.data?.workExperience;
        return workData && Array.isArray(workData) && workData.length > 0;

      case 4: // Skills
        const skillsData = step.data;
        return !!(
          skillsData?.skills &&
          Array.isArray(skillsData.skills) &&
          skillsData.skills.length > 0
        );

      case 5: // Social Links
        const socialData = step.data?.socialLinks;
        return socialData && Array.isArray(socialData) && socialData.length > 0;

      default:
        return true;
    }
  };

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

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <div className={styles.onboardingContainer}>
      <OnboardingStepper
        steps={steps}
        // currentStep={currentStep}
        currentStep={currentStepIndex + 1}
        onStepClick={handleStepClick}
      />

      <motion.div
        className={styles.mainContent}
        variants={contentVariants}
        initial="hidden"
        animate="visible"
      >
        <div className={styles.actionFooter}>
          <button
            className={`${styles.backButton} ${
              isFirstStep ? styles.hidden : ""
            }`}
            onClick={handleBack}
            style={{ visibility: isFirstStep ? "hidden" : "visible" }}
          >
            ← Back
          </button>
          <button className={styles.nextButton} onClick={handleContinue}>
            {isLastStep ? "Complete Setup" : "Continue"} →
          </button>
        </div>

        {renderCurrentSection()}
      </motion.div>
    </div>
  );
};

export default Onboarding;
