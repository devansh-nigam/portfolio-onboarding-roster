"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setPortfolioDataFromAPI } from "@/lib/slices/portfolio/portfolioSlice";
import { TagField } from "@/components/FormFields/TagField";
import styles from "./SkillsSection.module.css";

// Predefined skill suggestions organized by category
const SKILL_SUGGESTIONS = {
  "Creative Skills": [
    "Color Grading",
    "Graphic Design",
    "Storyboarding",
    "2D Animation",
    "3D Animation",
    "Motion Graphics",
    "Visual Effects",
    "Compositing",
    "Typography",
    "Brand Design",
    "UI/UX Design",
    "Illustration",
    "Photography",
    "Art Direction",
    "Creative Direction",
  ],
  "Video Editing": [
    "Video Editing",
    "Rough Cut & Sequencing",
    "Splice & Dice",
    "Subtitling",
    "Subtitles",
    "Audio Editing",
    "Music Editing",
    "Sound Designing",
    "Voice Over",
    "Audio Mixing",
    "Color Correction",
    "Multi-cam Editing",
    "Green Screen",
    "Chroma Keying",
  ],
  "Content Creation": [
    "Content Strategy",
    "Copywriting",
    "Script Writing",
    "Content Planning",
    "Social Media Content",
    "Thumbnail Design",
    "CTR Optimization",
    "Audience Retention",
    "YouTube Optimization",
    "Content Marketing",
    "Brand Storytelling",
    "Campaign Development",
  ],
  "Technical Skills": [
    "Video Encoding",
    "File Management",
    "Workflow Optimization",
    "Technical Troubleshooting",
    "Hardware Setup",
    "Network Storage",
    "Backup Systems",
    "Quality Control",
    "Format Conversion",
  ],
  "Soft Skills": [
    "Project Management",
    "Team Leadership",
    "Client Communication",
    "Time Management",
    "Problem Solving",
    "Creative Thinking",
    "Attention to Detail",
    "Deadline Management",
    "People Management",
    "Collaboration",
    "Research",
    "Analysis",
  ],
  "Business Skills": [
    "Client Relations",
    "Budget Management",
    "Scheduling Posts",
    "Analytics",
    "ROI Analysis",
    "Market Research",
    "Competitive Analysis",
    "Proposal Writing",
    "Contract Negotiation",
  ],
};

// Predefined software suggestions organized by category
const SOFTWARE_SUGGESTIONS = {
  "Adobe Suite": [
    "Adobe Premiere Pro",
    "Adobe After Effects",
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Adobe Audition",
    "Adobe InDesign",
    "Adobe Media Encoder",
    "Adobe Character Animator",
    "Adobe Firefly",
    "Adobe Creative Cloud",
    "Adobe Bridge",
    "Adobe Lightroom",
  ],
  "Video Editing": [
    "Final Cut Pro",
    "DaVinci Resolve",
    "Avid Media Composer",
    "Capcut",
    "Filmora",
    "Vegas Pro",
    "HitFilm",
    "Camtasia",
    "Screenflow",
    "OpenShot",
    "Kdenlive",
  ],
  "Audio Tools": [
    "Audacity",
    "Logic Pro",
    "Pro Tools",
    "Reaper",
    "GarageBand",
    "Hindenburg Pro",
    "iZotope RX",
    "Waves",
    "FabFilter",
    "Native Instruments",
  ],
  "Motion Graphics": [
    "Cinema 4D",
    "Blender",
    "Maya",
    "3ds Max",
    "Houdini",
    "Nuke",
    "Fusion",
    "Mocha Pro",
    "Element 3D",
    "Trapcode Suite",
    "Red Giant Universe",
  ],
  "Project Management": [
    "Monday.com",
    "Asana",
    "Trello",
    "Notion",
    "ClickUp",
    "Basecamp",
    "Jira",
    "Slack",
    "Microsoft Teams",
    "Frame.io",
    "Wipster",
    "ReviewBoard",
  ],
  Productivity: [
    "Google Workspace",
    "Microsoft Office",
    "Excel",
    "Sheets",
    "Docs",
    "PowerPoint",
    "Keynote",
    "Airtable",
    "Dropbox",
    "Google Drive",
    "OneDrive",
    "WeTransfer",
  ],
  "Specialized Tools": [
    "OBS Studio",
    "Wirecast",
    "Streamlabs",
    "Descript",
    "Otter.ai",
    "Rev",
    "Canva",
    "Figma",
    "Sketch",
    "InVision",
    "Miro",
    "FigJam",
    "Loom",
  ],
  Other: [
    "Gusto",
    "QuickBooks",
    "Zoom",
    "Calendly",
    "Luma",
    "Buffer",
    "Hootsuite",
    "Later",
    "Sprout Social",
    "Analytics Tools",
    "SEO Tools",
  ],
};

interface SkillsSectionProps {
  sectionData: {
    id: number;
    title: string;
    description: string;
    status: string;
    estimatedTime: string;
    data: {
      skills: string[];
      softwares: string[];
    };
  };
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ sectionData }) => {
  const dispatch = useAppDispatch();
  const portfolioData = useAppSelector(
    (state) => state.portfolio?.portfolioData
  );

  const [skills, setSkills] = useState<string[]>(
    sectionData.data?.skills || []
  );
  const [softwares, setSoftwares] = useState<string[]>(
    sectionData.data?.softwares || []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  //const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Flatten suggestion arrays for TagField
  const allSkillSuggestions = Object.values(SKILL_SUGGESTIONS).flat();
  const allSoftwareSuggestions = Object.values(SOFTWARE_SUGGESTIONS).flat();

  const validateData = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    // Only require at least one skill OR one software (not both)
    if (skills.length === 0 && softwares.length === 0) {
      newErrors.general = "Please add at least one skill or software";
    }

    return newErrors;
  };

  // Handle skills change
  const handleSkillsChange = (newSkills: string[]) => {
    setSkills(newSkills);
    setIsDirty(true);

    // Clear skills error if we now have skills
    if (newSkills.length > 0 && errors.skills) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.skills;
        return newErrors;
      });
    }
  };

  // Handle softwares change
  const handleSoftwaresChange = (newSoftwares: string[]) => {
    setSoftwares(newSoftwares);
    setIsDirty(true);

    // Clear softwares error if we now have softwares
    if (newSoftwares.length > 0 && errors.softwares) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.softwares;
        return newErrors;
      });
    }
  };

  // Add skills from category
  const addSkillsFromCategory = (category: string) => {
    const categorySkills =
      SKILL_SUGGESTIONS[category as keyof typeof SKILL_SUGGESTIONS];
    const newSkills = [...new Set([...skills, ...categorySkills])]; // Remove duplicates
    setSkills(newSkills);
    setIsDirty(true);
  };

  // Add softwares from category
  const addSoftwaresFromCategory = (category: string) => {
    const categorySoftwares =
      SOFTWARE_SUGGESTIONS[category as keyof typeof SOFTWARE_SUGGESTIONS];
    const newSoftwares = [...new Set([...softwares, ...categorySoftwares])]; // Remove duplicates
    setSoftwares(newSoftwares);
    setIsDirty(true);
  };

  // Save to Redux
  const handleSave = () => {
    const validationErrors = validateData();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const updatedPortfolioData = {
        ...portfolioData,
        sections: portfolioData.sections.map((section: any) =>
          section.id === sectionData.id
            ? {
                ...section,
                data: { skills, softwares },
                status: "completed",
              }
            : section
        ),
      };

      dispatch(setPortfolioDataFromAPI(updatedPortfolioData));
      setIsDirty(false);
      console.log("Skills and softwares saved successfully!");
    }
  };

  // Auto-save on unmount
  useEffect(() => {
    return () => {
      if (
        isDirty &&
        Object.keys(errors).length === 0 &&
        (skills.length > 0 || softwares.length > 0)
      ) {
        handleSave();
      }
    };
  }, [isDirty, errors, skills, softwares, handleSave]);

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
      className={styles.skillsSection}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className={styles.sectionHeader} variants={itemVariants}>
        <h1 className={styles.title}>Skills & Technologies</h1>
        <p className={styles.subtitle}>
          Showcase your expertise and the tools you work with
        </p>
      </motion.div>

      <motion.div className={styles.skillsContainer} variants={itemVariants}>
        {/* Skills Section */}
        <div className={styles.skillsGroup}>
          <div className={styles.groupHeader}>
            <h2 className={styles.groupTitle}>
              <span className={styles.titleIcon}>🎯</span>
              Your Skills
            </h2>
            <div className={styles.skillCount}>
              {skills.length} skill{skills.length !== 1 ? "s" : ""} added
            </div>
          </div>

          <TagField
            label="Skills"
            value={skills}
            onChange={handleSkillsChange}
            suggestions={allSkillSuggestions}
            placeholder="Add your professional skills..."
            error={errors.skills}
            helperText="Add your key competencies and areas of expertise"
            maxTags={50}
          />

          {/* Quick Add Categories for Skills */}
          <div className={styles.quickAddSection}>
            <h4 className={styles.quickAddTitle}>Quick Add by Category:</h4>
            <div className={styles.categoryGrid}>
              {Object.keys(SKILL_SUGGESTIONS).map((category) => (
                <motion.button
                  key={category}
                  type="button"
                  className={styles.categoryButton}
                  onClick={() => addSkillsFromCategory(category)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className={styles.categoryName}>{category}</span>
                  <span className={styles.categoryCount}>
                    {
                      SKILL_SUGGESTIONS[
                        category as keyof typeof SKILL_SUGGESTIONS
                      ].length
                    }{" "}
                    skills
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Skills Preview */}
          {skills.length > 0 && (
            <div className={styles.previewSection}>
              <h4 className={styles.previewTitle}>Your Skills Preview:</h4>
              <div className={styles.previewTags}>
                {skills.slice(0, 10).map((skill, index) => (
                  <span key={index} className={styles.previewTag}>
                    {skill}
                  </span>
                ))}
                {skills.length > 10 && (
                  <span className={styles.moreCount}>
                    +{skills.length - 10} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Softwares Section */}
        <div className={styles.skillsGroup}>
          <div className={styles.groupHeader}>
            <h2 className={styles.groupTitle}>
              <span className={styles.titleIcon}>🛠️</span>
              Software & Tools
            </h2>
            <div className={styles.skillCount}>
              {softwares.length} tool{softwares.length !== 1 ? "s" : ""} added
            </div>
          </div>

          <TagField
            label="Software & Tools"
            value={softwares}
            onChange={handleSoftwaresChange}
            suggestions={allSoftwareSuggestions}
            placeholder="Add software and tools you use..."
            error={errors.softwares}
            helperText="List the software, tools, and platforms you're proficient with"
            maxTags={50}
          />

          {/* Quick Add Categories for Software */}
          <div className={styles.quickAddSection}>
            <h4 className={styles.quickAddTitle}>Quick Add by Category:</h4>
            <div className={styles.categoryGrid}>
              {Object.keys(SOFTWARE_SUGGESTIONS).map((category) => (
                <motion.button
                  key={category}
                  type="button"
                  className={styles.categoryButton}
                  onClick={() => addSoftwaresFromCategory(category)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className={styles.categoryName}>{category}</span>
                  <span className={styles.categoryCount}>
                    {
                      SOFTWARE_SUGGESTIONS[
                        category as keyof typeof SOFTWARE_SUGGESTIONS
                      ].length
                    }{" "}
                    tools
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Softwares Preview */}
          {softwares.length > 0 && (
            <div className={styles.previewSection}>
              <h4 className={styles.previewTitle}>Your Tools Preview:</h4>
              <div className={styles.previewTags}>
                {softwares.slice(0, 10).map((software, index) => (
                  <span key={index} className={styles.previewTag}>
                    {software}
                  </span>
                ))}
                {softwares.length > 10 && (
                  <span className={styles.moreCount}>
                    +{softwares.length - 10} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <motion.div className={styles.summarySection} variants={itemVariants}>
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryTitle}>Your Expertise Summary</h3>
            <div className={styles.summaryStats}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>{skills.length}</div>
                <div className={styles.statLabel}>Professional Skills</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>{softwares.length}</div>
                <div className={styles.statLabel}>Tools & Software</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>
                  {skills.length + softwares.length}
                </div>
                <div className={styles.statLabel}>Total Expertise</div>
              </div>
            </div>

            {(skills.length > 0 || softwares.length > 0) && (
              <div className={styles.completionBadge}>
                <span className={styles.badgeIcon}>✨</span>
                <span>
                  Great! You are building a comprehensive skill profile
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Save Button */}
        {isDirty && (skills.length > 0 || softwares.length > 0) && (
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
              Save Skills & Technologies
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

export default SkillsSection;
