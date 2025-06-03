/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@lib/hooks";
import { setPortfolioDataFromAPI } from "@lib/slices/portfolio/portfolioSlice";
import { TextField } from "@components/FormFields/TextField";
import { TextAreaField } from "@components/FormFields/TextAreaField";
import { SelectField } from "@components/FormFields/SelectField";
import { TagField } from "@components/FormFields/TagField";
import styles from "./ProfileSection.module.css";

// Predefined options for dropdowns
const COUNTRIES = [
  { value: "india", label: "India" },
  { value: "usa", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "canada", label: "Canada" },
  { value: "australia", label: "Australia" },
  { value: "germany", label: "Germany" },
  { value: "france", label: "France" },
  { value: "singapore", label: "Singapore" },
  { value: "japan", label: "Japan" },
  { value: "other", label: "Other" },
];

const TIMEZONES = [
  { value: "Asia/Kolkata", label: "Asia/Kolkata (IST)" },
  { value: "America/New_York", label: "America/New_York (EST)" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles (PST)" },
  { value: "Europe/London", label: "Europe/London (GMT)" },
  { value: "Europe/Berlin", label: "Europe/Berlin (CET)" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo (JST)" },
  { value: "Australia/Sydney", label: "Australia/Sydney (AEST)" },
  { value: "Asia/Singapore", label: "Asia/Singapore (SGT)" },
];

const LANGUAGE_LEVELS = [
  { value: "Native", label: "Native" },
  { value: "Fluent", label: "Fluent" },
  { value: "Advanced", label: "Advanced" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Basic", label: "Basic" },
];

const COMMON_LANGUAGES = [
  "English",
  "Hindi",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Portuguese",
  "Russian",
  "Italian",
];

interface ProfileSectionProps {
  sectionData: {
    id: number;
    title: string;
    description: string;
    status: string;
    estimatedTime: string;
    data: {
      firstName: string;
      lastName: string;
      title: string;
      summary: string;
      website: string;
      location: {
        city: string;
        country: string;
        timezone: string;
      };
      contact: {
        email: string;
        phone: string;
      };
      languages: Array<{
        name: string;
        level: string;
      }>;
    };
  };
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ sectionData }) => {
  const dispatch = useAppDispatch();
  const portfolioData = useAppSelector(
    (state) => state.portfolio?.portfolioData
  );

  // Local state for form data
  const [formData, setFormData] = useState(sectionData.data);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  // Validation rules
  const validateField = (fieldName: string, value: any): string => {
    switch (fieldName) {
      case "firstName":
        return !value?.trim() ? "First name is required" : "";
      case "lastName":
        return !value?.trim() ? "Last name is required" : "";
      case "title":
        return !value?.trim() ? "Professional title is required" : "";
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !value?.trim()
          ? "Email is required"
          : !emailRegex.test(value)
          ? "Please enter a valid email address"
          : "";
      case "phone":
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return value?.trim() &&
          !phoneRegex.test(value.replace(/[\s\-\(\)]/g, ""))
          ? "Please enter a valid phone number"
          : "";
      case "website":
        const urlRegex =
          /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        return value?.trim() && !urlRegex.test(value)
          ? "Please enter a valid website URL"
          : "";
      case "city":
        return !value?.trim() ? "City is required" : "";
      case "country":
        return !value?.trim() ? "Country is required" : "";
      case "timezone":
        return !value?.trim() ? "Timezone is required" : "";
      default:
        return "";
    }
  };

  // Handle form field changes
  //   const handleFieldChange = (fieldPath: string, value: any) => {
  //     setIsDirty(true);

  //     // Handle nested object updates (e.g., "location.city")
  //     const pathArray = fieldPath.split(".");
  //     const newFormData = { ...formData };

  //     let current: any = newFormData;
  //     for (let i = 0; i < pathArray.length - 1; i++) {
  //       current = current[pathArray[i]];
  //     }
  //     current[pathArray[pathArray.length - 1]] = value;

  //     setFormData(newFormData);

  //     // Validate the field
  //     const error = validateField(fieldPath.replace(".", ""), value);
  //     setErrors((prev) => ({
  //       ...prev,
  //       [fieldPath]: error,
  //     }));
  //   };
  // Handle form field changes
  const handleFieldChange = (fieldPath: string, value: any) => {
    setIsDirty(true);

    const pathArray = fieldPath.split(".");

    if (pathArray.length === 1) {
      // Simple property update
      setFormData((prev) => ({
        ...prev,
        [fieldPath]: value,
      }));
    } else if (pathArray.length === 2) {
      // Nested property update (e.g., "contact.email")
      const [parentKey, childKey] = pathArray;
      setFormData((prev) => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [childKey]: value,
        },
      }));
    } else {
      // Deeper nesting (if needed)
      const newFormData = JSON.parse(JSON.stringify(formData));
      let current: any = newFormData;
      for (let i = 0; i < pathArray.length - 1; i++) {
        current = current[pathArray[i]];
      }
      current[pathArray[pathArray.length - 1]] = value;
      setFormData(newFormData);
    }

    // Validate the field
    const error = validateField(fieldPath.replace(".", ""), value);
    setErrors((prev) => ({
      ...prev,
      [fieldPath]: error,
    }));
  };

  // Handle language changes
  const handleLanguageChange = (languages: string[]) => {
    const languageObjects = languages.map((lang) => {
      const existing = formData.languages.find((l) => l.name === lang);
      return existing || { name: lang, level: "Intermediate" };
    });

    setFormData((prev) => ({
      ...prev,
      languages: languageObjects,
    }));
    setIsDirty(true);
  };

  const handleLanguageLevelChange = (languageName: string, level: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.map((lang) =>
        lang.name === languageName ? { ...lang, level } : lang
      ),
    }));
    setIsDirty(true);
  };

  // Save data to Redux
  const handleSave = useCallback(() => {
    // Validate all fields
    const newErrors: Record<string, string> = {};

    // Validate required fields
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          const fieldPath = `${key}.${nestedKey}`;
          const error = validateField(fieldPath.replace(".", ""), nestedValue);
          if (error) newErrors[fieldPath] = error;
        });
      } else {
        const error = validateField(key, value);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);

    // If no errors, save to Redux
    if (Object.keys(newErrors).length === 0) {
      const updatedPortfolioData = {
        ...portfolioData,
        sections: portfolioData.sections.map((section) =>
          section.id === sectionData.id
            ? { ...section, data: formData, status: "completed" }
            : section
        ),
      };

      dispatch(setPortfolioDataFromAPI(updatedPortfolioData));
      setIsDirty(false);

      // You could also trigger navigation to next step here
      console.log("Profile data saved successfully!");
    }
  }, [
    formData,
    portfolioData,
    sectionData.id,
    dispatch,
    setErrors,
    setIsDirty,
  ]);

  // Auto-save on unmount if dirty
  useEffect(() => {
    return () => {
      if (isDirty && Object.keys(errors).length === 0) {
        handleSave();
      }
    };
  }, [isDirty, errors, handleSave]);

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

  return (
    <motion.div
      className={styles.profileSection}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className={styles.sectionHeader} variants={itemVariants}>
        <h1 className={styles.title}>Complete Your Profile</h1>
        <p className={styles.subtitle}>
          Tell us about yourself to create an amazing portfolio
        </p>
      </motion.div>

      <motion.div className={styles.formContainer} variants={itemVariants}>
        {/* Basic Information */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Basic Information</h3>

          <div className={styles.formGrid}>
            <TextField
              label="First Name"
              value={formData.firstName}
              onChange={(value) => handleFieldChange("firstName", value)}
              error={errors.firstName}
              required
              placeholder="Enter your first name"
            />

            <TextField
              label="Last Name"
              value={formData.lastName}
              onChange={(value) => handleFieldChange("lastName", value)}
              error={errors.lastName}
              required
              placeholder="Enter your last name"
            />
          </div>

          <TextField
            label="Professional Title"
            value={formData.title}
            onChange={(value) => handleFieldChange("title", value)}
            error={errors.title}
            required
            placeholder="e.g., Video Editor & Content Creator"
            helperText="This will be your main headline on your portfolio"
          />

          <TextAreaField
            label="Professional Summary"
            value={formData.summary}
            onChange={(value) => handleFieldChange("summary", value)}
            error={errors.summary}
            placeholder="Write a brief summary about your professional background and expertise..."
            helperText="Describe your experience, skills, and what makes you unique"
            rows={4}
            maxLength={500}
          />

          <TextField
            label="Website"
            type="url"
            value={formData.website}
            onChange={(value) => handleFieldChange("website", value)}
            error={errors.website}
            placeholder="https://yourwebsite.com"
            helperText="Your portfolio website or professional homepage"
          />
        </div>

        {/* Contact Information */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Contact Information</h3>

          <div className={styles.formGrid}>
            <TextField
              label="Email Address"
              type="email"
              value={formData.contact.email}
              onChange={(value) => handleFieldChange("contact.email", value)}
              error={errors["contact.email"]}
              required
              placeholder="your.email@example.com"
            />

            <TextField
              label="Phone Number"
              type="tel"
              value={formData.contact.phone}
              onChange={(value) => handleFieldChange("contact.phone", value)}
              error={errors["contact.phone"]}
              placeholder="+1 (555) 123-4567"
              helperText="Include country code for international numbers"
            />
          </div>
        </div>

        {/* Location */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Location</h3>

          <div className={styles.formGrid}>
            <TextField
              label="City"
              value={formData.location.city}
              onChange={(value) => handleFieldChange("location.city", value)}
              error={errors["location.city"]}
              required
              placeholder="Enter your city"
            />

            <SelectField
              label="Country"
              value={formData.location.country}
              onChange={(value) => handleFieldChange("location.country", value)}
              error={errors["location.country"]}
              required
              options={COUNTRIES}
              searchable
              placeholder="Select your country"
            />
          </div>

          <SelectField
            label="Timezone"
            value={formData.location.timezone}
            onChange={(value) => handleFieldChange("location.timezone", value)}
            error={errors["location.timezone"]}
            required
            options={TIMEZONES}
            searchable
            placeholder="Select your timezone"
            helperText="This helps clients know your working hours"
          />
        </div>

        {/* Languages */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Languages</h3>

          <TagField
            label="Languages You Speak"
            value={formData.languages.map((lang) => lang.name)}
            onChange={handleLanguageChange}
            suggestions={COMMON_LANGUAGES}
            placeholder="Add languages you speak"
            helperText="Add languages to show your global reach"
            maxTags={10}
          />

          {formData.languages.length > 0 && (
            <div className={styles.languageLevels}>
              <h4 className={styles.subSectionTitle}>Language Proficiency</h4>
              {formData.languages.map((language, index) => (
                <div key={index} className={styles.languageLevel}>
                  <span className={styles.languageName}>{language.name}</span>
                  <SelectField
                    label=""
                    value={language.level}
                    onChange={(value) =>
                      handleLanguageLevelChange(language.name, value)
                    }
                    options={LANGUAGE_LEVELS}
                    placeholder="Select proficiency"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save Button */}
        <motion.div className={styles.saveSection} variants={itemVariants}>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty}
            className={`${styles.saveButton} ${isDirty ? styles.dirty : ""}`}
          >
            {isDirty ? "Save Changes" : "Saved"}
            {isDirty && (
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path
                  d="M16.667 5L7.5 14.167 3.333 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileSection;
