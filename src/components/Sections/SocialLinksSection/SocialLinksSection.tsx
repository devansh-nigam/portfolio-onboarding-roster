"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setPortfolioDataFromAPI } from "@/lib/slices/portfolio/portfolioSlice";
import { TextField } from "@/components/FormFields/TextField";
import styles from "./SocialLinksSection.module.css";

// Platform configurations with colors, patterns, and tips
const SOCIAL_PLATFORMS = {
  // Professional Platforms
  linkedin: {
    name: "LinkedIn",
    category: "Professional",
    color: "#0077B5",
    icon: "💼",
    urlPattern:
      /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9-]+\/?$/,
    placeholder: "https://linkedin.com/in/yourname",
    tip: "Share your professional experience and connect with industry leaders",
    handlePrefix: "linkedin.com/in/",
  },
  behance: {
    name: "Behance",
    category: "Professional",
    color: "#1769FF",
    icon: "🎨",
    urlPattern: /^https?:\/\/(www\.)?behance\.net\/[a-zA-Z0-9_-]+\/?$/,
    placeholder: "https://behance.net/yourname",
    tip: "Showcase your creative portfolio and design projects",
    handlePrefix: "behance.net/",
  },
  dribbble: {
    name: "Dribbble",
    category: "Professional",
    color: "#EA4C89",
    icon: "🏀",
    urlPattern: /^https?:\/\/(www\.)?dribbble\.com\/[a-zA-Z0-9_-]+\/?$/,
    placeholder: "https://dribbble.com/yourname",
    tip: "Display your design work and get discovered by clients",
    handlePrefix: "dribbble.com/",
  },

  // Creative Platforms
  youtube: {
    name: "YouTube",
    category: "Creative",
    color: "#FF0000",
    icon: "🎥",
    urlPattern:
      /^https?:\/\/(www\.)?youtube\.com\/(c|channel|user|@)[a-zA-Z0-9_-]+\/?$/,
    placeholder: "https://youtube.com/@yourchannel",
    tip: "Share your video content and build an audience",
    handlePrefix: "@",
  },
  instagram: {
    name: "Instagram",
    category: "Creative",
    color: "#E4405F",
    icon: "📸",
    urlPattern: /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/,
    placeholder: "https://instagram.com/yourusername",
    tip: "Show behind-the-scenes content and engage with your audience",
    handlePrefix: "@",
  },
  tiktok: {
    name: "TikTok",
    category: "Creative",
    color: "#000000",
    icon: "🎵",
    urlPattern: /^https?:\/\/(www\.)?tiktok\.com\/@[a-zA-Z0-9_.]+\/?$/,
    placeholder: "https://tiktok.com/@yourusername",
    tip: "Create short-form video content and trending content",
    handlePrefix: "@",
  },
  vimeo: {
    name: "Vimeo",
    category: "Creative",
    color: "#1AB7EA",
    icon: "🎬",
    urlPattern: /^https?:\/\/(www\.)?vimeo\.com\/[a-zA-Z0-9_-]+\/?$/,
    placeholder: "https://vimeo.com/yourname",
    tip: "Upload high-quality videos for professional viewing",
    handlePrefix: "vimeo.com/",
  },

  // Business Platforms
  twitter: {
    name: "Twitter / X",
    category: "Business",
    color: "#1DA1F2",
    icon: "🐦",
    urlPattern: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/?$/,
    placeholder: "https://x.com/yourusername",
    tip: "Share quick updates and engage in industry conversations",
    handlePrefix: "@",
  },
  facebook: {
    name: "Facebook",
    category: "Business",
    color: "#1877F2",
    icon: "👥",
    urlPattern: /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9_.]+\/?$/,
    placeholder: "https://facebook.com/yourpage",
    tip: "Connect with a broader audience and share updates",
    handlePrefix: "facebook.com/",
  },
  website: {
    name: "Personal Website",
    category: "Business",
    color: "#6366F1",
    icon: "🌐",
    urlPattern: /^https?:\/\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+$/,
    placeholder: "https://yourwebsite.com",
    tip: "Your professional home base - showcase everything in one place",
    handlePrefix: "",
  },

  // Other Platforms
  github: {
    name: "GitHub",
    category: "Professional",
    color: "#333333",
    icon: "💻",
    urlPattern: /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/,
    placeholder: "https://github.com/yourusername",
    tip: "Show your coding projects and technical skills",
    handlePrefix: "github.com/",
  },
  discord: {
    name: "Discord",
    category: "Creative",
    color: "#5865F2",
    icon: "🎮",
    urlPattern: /^https?:\/\/(www\.)?discord\.(gg|com)\/[a-zA-Z0-9_-]+\/?$/,
    placeholder: "https://discord.gg/yourserver",
    tip: "Build a community around your content",
    handlePrefix: "discord.gg/",
  },
};

interface SocialLink {
  platform: string;
  url: string;
  handle: string;
}

interface SocialLinksSectionProps {
  sectionData: {
    id: number;
    title: string;
    description: string;
    status: string;
    estimatedTime: string;
    data: {
      socialLinks: SocialLink[];
    };
  };
}

const SocialLinksSection: React.FC<SocialLinksSectionProps> = ({
  sectionData,
}) => {
  const dispatch = useAppDispatch();
  const portfolioData = useAppSelector(
    (state) => state.portfolio?.portfolioData
  );

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    sectionData.data?.socialLinks || []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showPreview, setShowPreview] = useState(false);

  // Get unique categories
  const categories = [
    "All",
    ...Array.from(
      new Set(Object.values(SOCIAL_PLATFORMS).map((p) => p.category))
    ),
  ];

  // Filter platforms by category
  const filteredPlatforms =
    selectedCategory === "All"
      ? Object.entries(SOCIAL_PLATFORMS)
      : Object.entries(SOCIAL_PLATFORMS).filter(
          ([_, platform]) => platform.category === selectedCategory
        );

  // Extract handle from URL
  const extractHandle = (
    url: string,
    platform: keyof typeof SOCIAL_PLATFORMS
  ): string => {
    if (!url) return "";

    try {
      const platformConfig = SOCIAL_PLATFORMS[platform];
      switch (platform) {
        case "youtube":
          const youtubeMatch = url.match(/@([a-zA-Z0-9_-]+)/);
          return youtubeMatch ? `@${youtubeMatch[1]}` : "";
        case "instagram":
        case "tiktok":
        case "twitter":
          const socialMatch = url.match(/\/([a-zA-Z0-9_.]+)\/?$/);
          return socialMatch ? `@${socialMatch[1]}` : "";
        case "linkedin":
          const linkedinMatch = url.match(/\/in\/([a-zA-Z0-9-]+)/);
          return linkedinMatch ? linkedinMatch[1] : "";
        default:
          const genericMatch = url.match(/\/([a-zA-Z0-9_.-]+)\/?$/);
          return genericMatch ? genericMatch[1] : "";
      }
    } catch {
      return "";
    }
  };

  // Validate URL format
  const validateUrl = (
    url: string,
    platform: keyof typeof SOCIAL_PLATFORMS
  ): string => {
    if (!url.trim()) return "";

    const platformConfig = SOCIAL_PLATFORMS[platform];
    if (!platformConfig.urlPattern.test(url)) {
      return `Please enter a valid ${platformConfig.name} URL`;
    }

    return "";
  };

  // Handle platform addition
  const addPlatform = (platformKey: string) => {
    // Check if platform already exists
    const exists = socialLinks.find((link) => link.platform === platformKey);
    if (exists) return;

    const newLink: SocialLink = {
      platform: platformKey,
      url: "",
      handle: "",
    };

    setSocialLinks([...socialLinks, newLink]);
    setIsDirty(true);
  };

  // Handle URL change
  const handleUrlChange = (index: number, url: string) => {
    const updatedLinks = [...socialLinks];
    const platform = updatedLinks[index]
      .platform as keyof typeof SOCIAL_PLATFORMS;

    updatedLinks[index] = {
      ...updatedLinks[index],
      url,
      handle: extractHandle(url, platform),
    };

    setSocialLinks(updatedLinks);
    setIsDirty(true);

    // Clear validation error if URL becomes valid
    const validationError = validateUrl(url, platform);
    const errorKey = `${index}_url`;

    if (!validationError && errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // Remove platform
  const removePlatform = (index: number) => {
    const updatedLinks = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(updatedLinks);
    setIsDirty(true);

    // Clear related errors
    const newErrors = { ...errors };
    delete newErrors[`${index}_url`];
    setErrors(newErrors);
  };

  // Save to Redux
  // const handleSave = () => {
  //   // Validate all URLs
  //   const validationErrors: Record<string, string> = {};

  //   socialLinks.forEach((link, index) => {
  //     if (link.url.trim()) {
  //       const error = validateUrl(
  //         link.url,
  //         link.platform as keyof typeof SOCIAL_PLATFORMS
  //       );
  //       if (error) {
  //         validationErrors[`${index}_url`] = error;
  //       }
  //     }
  //   });

  //   setErrors(validationErrors);

  //   if (Object.keys(validationErrors).length === 0) {
  //     // Filter out empty links
  //     const validLinks = socialLinks.filter((link) => link.url.trim() !== "");

  //     const updatedPortfolioData = {
  //       ...portfolioData,
  //       sections: portfolioData.sections.map((section: any) =>
  //         section.id === sectionData.id
  //           ? {
  //               ...section,
  //               data: { socialLinks: validLinks },
  //               status: validLinks.length > 0 ? "completed" : "pending",
  //             }
  //           : section
  //       ),
  //     };

  //     dispatch(setPortfolioDataFromAPI(updatedPortfolioData));
  //     setIsDirty(false);
  //     console.log("Social links saved successfully!");
  //   }
  // };

  const handleSave = () => {
    console.log("🔍 DEBUGGING SAVE:");
    console.log("socialLinks before save:", socialLinks);

    // Validate all URLs
    const validationErrors: Record<string, string> = {};

    socialLinks.forEach((link, index) => {
      console.log(`Checking link ${index}:`, link);
      if (link.url.trim()) {
        const error = validateUrl(
          link.url,
          link.platform as keyof typeof SOCIAL_PLATFORMS
        );
        if (error) {
          validationErrors[`${index}_url`] = error;
        }
      }
    });

    console.log("validationErrors:", validationErrors);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Filter out empty links
      const validLinks = socialLinks.filter((link) => link.url.trim() !== "");
      console.log("validLinks after filtering:", validLinks);

      const updatedPortfolioData = {
        ...portfolioData,
        sections: portfolioData.sections.map((section: any) =>
          section.id === sectionData.id
            ? {
                ...section,
                data: { socialLinks: validLinks },
                status: validLinks.length > 0 ? "completed" : "pending",
              }
            : section
        ),
      };

      console.log("updatedPortfolioData:", updatedPortfolioData);
      dispatch(setPortfolioDataFromAPI(updatedPortfolioData));
      setIsDirty(false);
      console.log("✅ Social links saved successfully!");
    } else {
      console.log("❌ Validation errors found, not saving");
    }
  };

  // Auto-save on unmount
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

  const linkVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 },
    },
  };

  const validLinks = socialLinks.filter((link) => link.url.trim() !== "");

  return (
    <motion.div
      className={styles.socialLinksSection}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className={styles.sectionHeader} variants={itemVariants}>
        <h1 className={styles.title}>Social Links</h1>
        <p className={styles.subtitle}>
          Connect your digital presence and let clients find you everywhere
        </p>
      </motion.div>

      {/* Category Filter */}
      <motion.div className={styles.categoryFilter} variants={itemVariants}>
        <div className={styles.filterButtons}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.filterButton} ${
                selectedCategory === category ? styles.active : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Current Social Links */}
      {socialLinks.length > 0 && (
        <motion.div
          className={styles.currentLinksSection}
          variants={itemVariants}
        >
          <div className={styles.sectionTitle}>
            <h3>Your Social Links ({validLinks.length})</h3>
            <button
              className={styles.previewToggle}
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </button>
          </div>

          <AnimatePresence>
            {socialLinks.map((link, index) => {
              const platform =
                SOCIAL_PLATFORMS[
                  link.platform as keyof typeof SOCIAL_PLATFORMS
                ];
              return (
                <motion.div
                  key={`${link.platform}-${index}`}
                  className={styles.socialLinkItem}
                  variants={linkVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  style={
                    {
                      "--platform-color": platform.color,
                    } as React.CSSProperties
                  }
                >
                  <div className={styles.platformHeader}>
                    <div className={styles.platformInfo}>
                      <span className={styles.platformIcon}>
                        {platform.icon}
                      </span>
                      <div className={styles.platformDetails}>
                        <h4 className={styles.platformName}>{platform.name}</h4>
                        <span className={styles.platformCategory}>
                          {platform.category}
                        </span>
                      </div>
                    </div>
                    <button
                      className={styles.removeButton}
                      onClick={() => removePlatform(index)}
                    >
                      Remove
                    </button>
                  </div>

                  <TextField
                    label={`${platform.name} URL`}
                    type="url"
                    value={link.url}
                    onChange={(value) => handleUrlChange(index, value)}
                    error={errors[`${index}_url`]}
                    placeholder={platform.placeholder}
                    helperText={platform.tip}
                  />

                  {/* Handle Preview */}
                  {link.handle && (
                    <div className={styles.handlePreview}>
                      <span className={styles.handleLabel}>Handle:</span>
                      <span className={styles.handleValue}>{link.handle}</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Add New Platform */}
      <motion.div className={styles.platformsGrid} variants={itemVariants}>
        <h3 className={styles.sectionTitle}>Add Social Platform</h3>
        <div className={styles.platformCards}>
          {filteredPlatforms.map(([key, platform]) => {
            const isAdded = socialLinks.some((link) => link.platform === key);
            return (
              <motion.button
                key={key}
                className={`${styles.platformCard} ${
                  isAdded ? styles.added : ""
                }`}
                onClick={() => !isAdded && addPlatform(key)}
                disabled={isAdded}
                whileHover={!isAdded ? { scale: 1.02, y: -2 } : {}}
                whileTap={!isAdded ? { scale: 0.98 } : {}}
                style={
                  { "--platform-color": platform.color } as React.CSSProperties
                }
              >
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>{platform.icon}</span>
                  <span className={styles.cardCategory}>
                    {platform.category}
                  </span>
                </div>
                <h4 className={styles.cardTitle}>{platform.name}</h4>
                <p className={styles.cardTip}>{platform.tip}</p>
                {isAdded && <div className={styles.addedBadge}>✓ Added</div>}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Social Preview */}
      {showPreview && validLinks.length > 0 && (
        <motion.div
          className={styles.previewSection}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          variants={itemVariants}
        >
          <h3 className={styles.sectionTitle}>How Your Links Will Appear</h3>
          <div className={styles.previewCard}>
            <div className={styles.previewHeader}>
              <div className={styles.profilePreview}>
                <div className={styles.profileAvatar}>👤</div>
                <div className={styles.profileInfo}>
                  <h4>Your Name</h4>
                  <p>Video Editor & Content Creator</p>
                </div>
              </div>
            </div>
            <div className={styles.socialLinksPreview}>
              {validLinks.map((link, index) => {
                const platform =
                  SOCIAL_PLATFORMS[
                    link.platform as keyof typeof SOCIAL_PLATFORMS
                  ];
                return (
                  <a
                    key={index}
                    href={link.url}
                    className={styles.previewLink}
                    style={
                      {
                        "--platform-color": platform.color,
                      } as React.CSSProperties
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className={styles.previewIcon}>{platform.icon}</span>
                    <span className={styles.previewName}>{platform.name}</span>
                    <span className={styles.previewHandle}>{link.handle}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Save Button */}
      {isDirty && (
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
            Save Social Links
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
  );
};

export default SocialLinksSection;
