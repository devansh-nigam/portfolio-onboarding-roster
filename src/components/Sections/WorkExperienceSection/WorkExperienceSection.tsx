"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setPortfolioDataFromAPI } from "@/lib/slices/portfolio/portfolioSlice";
import { TextField } from "@/components/FormFields/TextField";
import { TextAreaField } from "@/components/FormFields/TextAreaField";
import { SelectField } from "@/components/FormFields/SelectField";
import styles from "./WorkExperienceSection.module.css";

// Employment type options
const EMPLOYMENT_TYPES = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
  { value: "internship", label: "Internship" },
  { value: "temporary", label: "Temporary" },
];

interface WorkExperience {
  id: string;
  type: string;
  companyName: string;
  jobTitle: string;
  startDate: string;
  endDate: string | null;
  durationOfEmployment: string;
  employmentType: string;
  isCurrentRole: boolean;
  summary: string;
  portfolioItems: Array<{
    id: string;
    title: string;
    thumbnail: string;
    videoUrl: string;
    duration: string;
    views: string;
  }>;
}

interface WorkExperienceSectionProps {
  sectionData: {
    id: number;
    title: string;
    description: string;
    status: string;
    estimatedTime: string;
    data: {
      workExperience: WorkExperience[];
    };
  };
}

const WorkExperienceSection: React.FC<WorkExperienceSectionProps> = ({
  sectionData,
}) => {
  const dispatch = useAppDispatch();
  const portfolioData = useAppSelector(
    (state) => state.portfolio?.portfolioData
  );

  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>(
    sectionData.data?.workExperience || []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [expandedExperience, setExpandedExperience] = useState<string | null>(
    null
  );

  // Generate unique ID for new experiences
  const generateId = () =>
    `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Validation
  const validateExperience = (
    experience: WorkExperience,
    index: number
  ): Record<string, string> => {
    const experienceErrors: Record<string, string> = {};
    const prefix = `experience_${index}`;

    if (!experience.companyName?.trim()) {
      experienceErrors[`${prefix}_companyName`] =
        "Company/Client name is required";
    }

    if (!experience.jobTitle?.trim()) {
      experienceErrors[`${prefix}_jobTitle`] = "Job title is required";
    }

    if (!experience.employmentType?.trim()) {
      experienceErrors[`${prefix}_employmentType`] =
        "Employment type is required";
    }

    if (!experience.startDate?.trim()) {
      experienceErrors[`${prefix}_startDate`] = "Start date is required";
    }

    if (!experience.summary?.trim()) {
      experienceErrors[`${prefix}_summary`] = "Role summary is required";
    }

    return experienceErrors;
  };

  // Handle field changes
  const handleExperienceChange = (
    index: number,
    field: keyof WorkExperience,
    value: any
  ) => {
    setIsDirty(true);
    const updatedExperiences = [...workExperiences];

    if (field === "isCurrentRole" && value) {
      // If this is current role, clear end date and update duration
      updatedExperiences[index] = {
        ...updatedExperiences[index],
        [field]: value,
        endDate: null,
        durationOfEmployment: calculateDuration(
          updatedExperiences[index].startDate,
          null
        ),
      };
    } else if (field === "startDate" || field === "endDate") {
      // Recalculate duration when dates change
      const newExperience = { ...updatedExperiences[index], [field]: value };
      newExperience.durationOfEmployment = calculateDuration(
        newExperience.startDate,
        newExperience.isCurrentRole ? null : newExperience.endDate
      );
      updatedExperiences[index] = newExperience;
    } else {
      updatedExperiences[index] = {
        ...updatedExperiences[index],
        [field]: value,
      };
    }

    setWorkExperiences(updatedExperiences);

    // Clear field-specific errors
    const fieldKey = `experience_${index}_${field}`;
    if (errors[fieldKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldKey];
        return newErrors;
      });
    }
  };

  // Handle work sample changes
  const handleWorkSampleChange = (
    experienceIndex: number,
    sampleIndex: number,
    field: string,
    value: string
  ) => {
    setIsDirty(true);
    const updatedExperiences = [...workExperiences];
    const existingSamples = [
      ...(updatedExperiences[experienceIndex].portfolioItems || []),
    ];

    if (existingSamples[sampleIndex]) {
      existingSamples[sampleIndex] = {
        ...existingSamples[sampleIndex],
        [field]: value,
      };
    }

    updatedExperiences[experienceIndex] = {
      ...updatedExperiences[experienceIndex],
      portfolioItems: existingSamples,
    };

    setWorkExperiences(updatedExperiences);
  };

  // Add new work sample
  const addWorkSample = (experienceIndex: number) => {
    setIsDirty(true);
    const updatedExperiences = [...workExperiences];
    const newSample = {
      id: `sample_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: "",
      videoUrl: "",
      thumbnail: "",
      duration: "",
      views: "",
    };

    // Create a new array instead of mutating the existing one
    const existingSamples =
      updatedExperiences[experienceIndex].portfolioItems || [];
    updatedExperiences[experienceIndex] = {
      ...updatedExperiences[experienceIndex],
      portfolioItems: [...existingSamples, newSample],
    };

    setWorkExperiences(updatedExperiences);
  };

  // Remove work sample
  const removeWorkSample = (experienceIndex: number, sampleIndex: number) => {
    setIsDirty(true);
    const updatedExperiences = [...workExperiences];
    const existingSamples =
      updatedExperiences[experienceIndex].portfolioItems || [];

    updatedExperiences[experienceIndex] = {
      ...updatedExperiences[experienceIndex],
      portfolioItems: existingSamples.filter((_, i) => i !== sampleIndex),
    };

    setWorkExperiences(updatedExperiences);
  };

  // Calculate duration between dates
  const calculateDuration = (
    startDate: string,
    endDate: string | null
  ): string => {
    if (!startDate) return "";

    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    if (years > 0) {
      return months > 0
        ? `${years} year${years > 1 ? "s" : ""} ${months} month${
            months > 1 ? "s" : ""
          }`
        : `${years} year${years > 1 ? "s" : ""}`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? "s" : ""}`;
    } else {
      return "Less than a month";
    }
  };

  // Add new experience
  const addNewExperience = () => {
    const newExperience: WorkExperience = {
      id: generateId(),
      type: "client",
      companyName: "",
      jobTitle: "",
      startDate: "",
      endDate: null,
      durationOfEmployment: "",
      employmentType: "",
      isCurrentRole: false,
      summary: "",
      portfolioItems: [],
    };

    setWorkExperiences([...workExperiences, newExperience]);
    setExpandedExperience(newExperience.id);
    setIsDirty(true);
  };

  // Remove experience
  const removeExperience = (index: number) => {
    const updatedExperiences = workExperiences.filter((_, i) => i !== index);
    setWorkExperiences(updatedExperiences);
    setIsDirty(true);

    // Clear related errors
    const newErrors = { ...errors };
    Object.keys(newErrors).forEach((key) => {
      if (key.startsWith(`experience_${index}_`)) {
        delete newErrors[key];
      }
    });
    setErrors(newErrors);
  };

  // Save to Redux
  const handleSave = useCallback(() => {
    // Validate all experiences
    const allErrors: Record<string, string> = {};

    workExperiences.forEach((experience, index) => {
      const experienceErrors = validateExperience(experience, index);
      Object.assign(allErrors, experienceErrors);
    });

    setErrors(allErrors);

    if (Object.keys(allErrors).length === 0) {
      const updatedPortfolioData = {
        ...portfolioData,
        sections: portfolioData.sections.map((section: any) =>
          section.id === sectionData.id
            ? {
                ...section,
                data: { workExperience: workExperiences },
                status: workExperiences.length > 0 ? "completed" : "pending", // Allow pending with 0 experiences
              }
            : section
        ),
      };

      dispatch(setPortfolioDataFromAPI(updatedPortfolioData));
      setIsDirty(false);
      console.log("Work experience data saved successfully!");
    }
  });

  // Auto-save on unmount
  useEffect(() => {
    return () => {
      if (
        isDirty &&
        Object.keys(errors).length === 0 &&
        workExperiences.length >= 0
      ) {
        handleSave();
      }
    };
  }, [isDirty, errors, workExperiences, handleSave]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const experienceVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      className={styles.workExperienceSection}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className={styles.sectionHeader} variants={itemVariants}>
        <h1 className={styles.title}>Work Experience</h1>
        <p className={styles.subtitle}>
          Add your professional experience and showcase your best work
        </p>
      </motion.div>

      <motion.div
        className={styles.experiencesContainer}
        variants={itemVariants}
      >
        <AnimatePresence>
          {workExperiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              className={styles.experienceCard}
              variants={experienceVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
            >
              {/* Experience Header */}
              <div className={styles.experienceHeader}>
                <div className={styles.experienceTitle}>
                  <h3>{experience.companyName || `Experience ${index + 1}`}</h3>
                  <span className={styles.experienceType}>
                    {experience.jobTitle && ` • ${experience.jobTitle}`}
                  </span>
                </div>

                <div className={styles.experienceActions}>
                  <button
                    type="button"
                    className={styles.expandButton}
                    onClick={() =>
                      setExpandedExperience(
                        expandedExperience === experience.id
                          ? null
                          : experience.id
                      )
                    }
                  >
                    {expandedExperience === experience.id ? "Collapse" : "Edit"}
                  </button>

                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => removeExperience(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Experience Details (Expandable) */}
              <AnimatePresence>
                {expandedExperience === experience.id && (
                  <motion.div
                    className={styles.experienceDetails}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Basic Information */}
                    <div className={styles.formSection}>
                      <h4 className={styles.subsectionTitle}>
                        Basic Information
                      </h4>

                      <div className={styles.formGrid}>
                        <TextField
                          label="Company/Client Name"
                          value={experience.companyName}
                          onChange={(value) =>
                            handleExperienceChange(index, "companyName", value)
                          }
                          error={errors[`experience_${index}_companyName`]}
                          required
                          placeholder="e.g., TechReview Channel"
                        />

                        <TextField
                          label="Job Title"
                          value={experience.jobTitle}
                          onChange={(value) =>
                            handleExperienceChange(index, "jobTitle", value)
                          }
                          error={errors[`experience_${index}_jobTitle`]}
                          required
                          placeholder="e.g., Lead Video Editor"
                        />
                      </div>

                      <SelectField
                        label="Employment Type"
                        value={experience.employmentType}
                        onChange={(value) =>
                          handleExperienceChange(index, "employmentType", value)
                        }
                        error={errors[`experience_${index}_employmentType`]}
                        required
                        options={EMPLOYMENT_TYPES}
                        placeholder="Select employment type"
                      />
                    </div>

                    {/* Duration */}
                    <div className={styles.formSection}>
                      <h4 className={styles.subsectionTitle}>Duration</h4>

                      <div className={styles.formGrid}>
                        <TextField
                          label="Start Date"
                          type="date"
                          value={experience.startDate}
                          onChange={(value) =>
                            handleExperienceChange(index, "startDate", value)
                          }
                          error={errors[`experience_${index}_startDate`]}
                          required
                        />

                        <TextField
                          label="End Date"
                          type="date"
                          value={experience.endDate || ""}
                          onChange={(value) =>
                            handleExperienceChange(index, "endDate", value)
                          }
                          disabled={experience.isCurrentRole}
                          placeholder={
                            experience.isCurrentRole ? "Present" : ""
                          }
                        />
                      </div>

                      <div className={styles.currentRoleContainer}>
                        <label className={styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            checked={experience.isCurrentRole}
                            onChange={(e) =>
                              handleExperienceChange(
                                index,
                                "isCurrentRole",
                                e.target.checked
                              )
                            }
                            className={styles.checkbox}
                          />
                          <span className={styles.checkboxText}>
                            This is my current role
                          </span>
                        </label>

                        {experience.durationOfEmployment && (
                          <div className={styles.durationDisplay}>
                            Duration:{" "}
                            <strong>{experience.durationOfEmployment}</strong>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Role Summary */}
                    <div className={styles.formSection}>
                      <h4 className={styles.subsectionTitle}>Role Summary</h4>

                      <TextAreaField
                        label="What was your contribution in this role?"
                        value={experience.summary}
                        onChange={(value) =>
                          handleExperienceChange(index, "summary", value)
                        }
                        error={errors[`experience_${index}_summary`]}
                        required
                        placeholder="Describe your key responsibilities, achievements, and impact in this role..."
                        rows={4}
                        maxLength={500}
                        helperText="Highlight your main contributions and achievements"
                      />
                    </div>

                    {/* Work Samples */}
                    <div className={styles.formSection}>
                      <h4 className={styles.subsectionTitle}>
                        Work Samples
                        <span className={styles.itemCount}>
                          ({experience.portfolioItems?.length || 0})
                        </span>
                      </h4>

                      {experience.portfolioItems &&
                      experience.portfolioItems.length > 0 ? (
                        <div className={styles.workSamplesContainer}>
                          {experience.portfolioItems.map(
                            (sample, sampleIndex) => (
                              <div
                                key={sample.id}
                                className={styles.workSampleItem}
                              >
                                <div className={styles.workSampleHeader}>
                                  <h5 className={styles.workSampleTitle}>
                                    Work Sample {sampleIndex + 1}
                                  </h5>
                                  <button
                                    type="button"
                                    className={styles.removeSampleButton}
                                    onClick={() =>
                                      removeWorkSample(index, sampleIndex)
                                    }
                                  >
                                    Remove
                                  </button>
                                </div>

                                <div className={styles.sampleFormGrid}>
                                  <TextField
                                    label="Sample Title"
                                    value={sample.title}
                                    onChange={(value) =>
                                      handleWorkSampleChange(
                                        index,
                                        sampleIndex,
                                        "title",
                                        value
                                      )
                                    }
                                    placeholder="e.g., iPhone 15 Pro Max Review"
                                    required
                                  />

                                  <TextField
                                    label="Video/Work URL"
                                    type="url"
                                    value={sample.videoUrl}
                                    onChange={(value) =>
                                      handleWorkSampleChange(
                                        index,
                                        sampleIndex,
                                        "videoUrl",
                                        value
                                      )
                                    }
                                    placeholder="https://youtube.com/watch?v=abc123"
                                    required
                                  />
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <div className={styles.noWorkSamples}>
                          <p>No work samples added yet.</p>
                        </div>
                      )}

                      <button
                        type="button"
                        className={styles.addWorkSampleButton}
                        onClick={() => addWorkSample(index)}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M10 4V16M4 10H16"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                        Add Work Sample
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
          {workExperiences.length === 0 && (
            <div className={styles.emptyState}>
              <h3>No work experience added yet</h3>
              <p>
                Work experience is optional. You can add it later or continue
                without it.
              </p>
            </div>
          )}
        </AnimatePresence>

        {/* Add New Experience Button */}
        <motion.button
          type="button"
          className={styles.addExperienceButton}
          onClick={addNewExperience}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 4V16M4 10H16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Add Work Experience
        </motion.button>

        {/* Save Button */}
        {isDirty && workExperiences.length > 0 && (
          <motion.div
            className={styles.saveSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            variants={itemVariants}
          >
            <button
              type="button"
              onClick={handleSave}
              className={styles.saveButton}
            >
              Save Work Experience
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path
                  d="M16.667 5L7.5 14.167 3.333 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default WorkExperienceSection;
