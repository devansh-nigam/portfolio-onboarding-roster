/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { setPortfolioDataFromAPI } from "@/lib/slices/portfolio/portfolioSlice";
import { useRouter } from "next/navigation";
import styles from "./Dashboard.module.css";

interface UsernameCheckResponse {
  available: boolean;
  suggestions?: string[];
  message?: string;
}

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const portfolioData = useAppSelector(
    (state) => state.portfolio?.portfolioData
  );

  const [username, setUsername] = useState("");
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<
    "available" | "taken" | "error" | null
  >(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [isGeneratingUrl, setIsGeneratingUrl] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  // Generate initial username suggestion from profile data
  useEffect(() => {
    if (portfolioData?.sections) {
      const profileSection = portfolioData.sections.find(
        (section: { id: number }) => section.id === 2
      );
      if (profileSection?.data) {
        const { firstName, lastName } = profileSection.data as any;
        if (firstName && lastName) {
          const suggested = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
          setUsername(suggested);
          checkUsernameAvailability(suggested);
        }
      }
    }
  }, [portfolioData]);

  // Check username availability with backend
  const checkUsernameAvailability = async (usernameToCheck: string) => {
    if (!usernameToCheck.trim() || usernameToCheck.length < 3) {
      setAvailabilityStatus(null);
      return;
    }

    setIsCheckingAvailability(true);
    setAvailabilityStatus(null);

    try {
      const response = await fetch("/api/check-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: usernameToCheck.toLowerCase() }),
      });

      const data: UsernameCheckResponse = await response.json();

      if (data.available) {
        setAvailabilityStatus("available");
        setSuggestions([]);
      } else {
        setAvailabilityStatus("taken");
        setSuggestions(data.suggestions || []);
      }
    } catch (error) {
      console.error("Error checking username:", error);
      setAvailabilityStatus("error");
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  // Handle username input change
  const handleUsernameChange = (value: string) => {
    // Only allow alphanumeric and hyphens
    const cleanValue = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setUsername(cleanValue);

    // Debounce the availability check
    clearTimeout(window.usernameCheckTimeout);
    window.usernameCheckTimeout = setTimeout(() => {
      checkUsernameAvailability(cleanValue);
    }, 500);
  };

  // Generate portfolio URL
  const generatePortfolioUrl = async () => {
    if (availabilityStatus !== "available" || !username.trim()) {
      return;
    }

    setIsGeneratingUrl(true);

    try {
      const response = await fetch("/api/generate-portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.toLowerCase(),
          portfolioData: portfolioData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const generatedUrl = `https://app.joinroster.co/${username.toLowerCase()}`;
        setPortfolioUrl(generatedUrl);

        // Update Redux with the portfolio URL
        const updatedPortfolioData = {
          ...portfolioData,
          portfolioUrl: generatedUrl,
          username: username.toLowerCase(),
          isPublished: true,
        };

        dispatch(setPortfolioDataFromAPI(updatedPortfolioData));
      } else {
        throw new Error(data.message || "Failed to generate portfolio");
      }
    } catch (error) {
      console.error("Error generating portfolio:", error);
      alert("Failed to generate portfolio. Please try again.");
    } finally {
      setIsGeneratingUrl(false);
    }
  };

  // Copy URL to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  // Calculate portfolio completion
  const getPortfolioStats = () => {
    if (!portfolioData?.sections)
      return { completed: 0, total: 0, percentage: 0 };

    const completed = portfolioData.sections.filter(
      (section: { status: string }) => section.status === "completed"
    ).length;
    const total = portfolioData.sections.length;
    const percentage = Math.round((completed / total) * 100);

    return { completed, total, percentage };
  };

  const stats = getPortfolioStats();

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
    <div className={styles.dashboardContainer}>
      <motion.div
        className={styles.dashboard}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className={styles.header} variants={itemVariants}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>🎉 Congratulations!</h1>
            <p className={styles.subtitle}>
              Your portfolio is ready. Now let's create your unique link!
            </p>
          </div>

          <div className={styles.completionBadge}>
            <div className={styles.completionCircle}>
              <span>{stats.percentage}%</span>
            </div>
            <div className={styles.completionText}>
              <div>
                {stats.completed} of {stats.total} sections completed
              </div>
              <div className={styles.completionStatus}>Portfolio Complete!</div>
            </div>
          </div>
        </motion.div>

        {/* Portfolio Stats */}
        <motion.div className={styles.statsGrid} variants={itemVariants}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>👤</div>
            <div className={styles.statInfo}>
              <div className={styles.statNumber}>1</div>
              <div className={styles.statLabel}>Profile Setup</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>💼</div>
            <div className={styles.statInfo}>
              <div className={styles.statNumber}>
                {portfolioData?.sections?.find(
                  (s: { id: number }) => s.id === 3
                )?.data?.workExperience?.length || 0}
              </div>
              <div className={styles.statLabel}>Work Experiences</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>🛠️</div>
            <div className={styles.statInfo}>
              <div className={styles.statNumber}>
                {(portfolioData?.sections?.find(
                  (s: { id: number }) => s.id === 4
                )?.data?.skills?.length || 0) +
                  (portfolioData?.sections?.find(
                    (s: { id: number }) => s.id === 4
                  )?.data?.softwares?.length || 0)}
              </div>
              <div className={styles.statLabel}>Skills & Tools</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>🔗</div>
            <div className={styles.statInfo}>
              <div className={styles.statNumber}>
                {portfolioData?.sections?.find(
                  (s: { id: number }) => s.id === 5
                )?.data?.socialLinks?.length || 0}
              </div>
              <div className={styles.statLabel}>Social Links</div>
            </div>
          </div>
        </motion.div>

        {/* Username Generation */}
        <motion.div
          className={styles.urlGenerationSection}
          variants={itemVariants}
        >
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Create Your Portfolio URL</h2>
            <p className={styles.sectionSubtitle}>
              Choose a unique username for your portfolio link
            </p>
          </div>

          <div className={styles.urlInputSection}>
            <div className={styles.urlPreview}>
              <span className={styles.urlBase}>https://app.joinroster.co/</span>
              <input
                type="text"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="username"
                className={`${styles.usernameInput} ${
                  availabilityStatus === "available"
                    ? styles.available
                    : availabilityStatus === "taken"
                    ? styles.taken
                    : ""
                }`}
                maxLength={30}
                minLength={3}
              />

              {isCheckingAvailability && (
                <div className={styles.checkingSpinner}>
                  <div className={styles.spinner}></div>
                </div>
              )}

              {availabilityStatus === "available" && (
                <div className={styles.availableIcon}>✓</div>
              )}

              {availabilityStatus === "taken" && (
                <div className={styles.takenIcon}>✗</div>
              )}
            </div>

            {/* Status Messages */}
            {availabilityStatus === "available" && (
              <div className={styles.statusMessage}>
                <span className={styles.availableMessage}>
                  ✅ Great! &quot;{username}&quot; is available
                </span>
              </div>
            )}

            {availabilityStatus === "taken" && (
              <div className={styles.statusMessage}>
                <span className={styles.takenMessage}>
                  ❌ &quot;{username}&quot; is already taken
                </span>
                {suggestions.length > 0 && (
                  <div className={styles.suggestions}>
                    <p>Try these instead:</p>
                    <div className={styles.suggestionTags}>
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          className={styles.suggestionTag}
                          onClick={() => {
                            setUsername(suggestion);
                            checkUsernameAvailability(suggestion);
                          }}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {availabilityStatus === "error" && (
              <div className={styles.statusMessage}>
                <span className={styles.errorMessage}>
                  ⚠️ Error checking availability. Please try again.
                </span>
              </div>
            )}
          </div>

          {/* Generate Button */}
          {availabilityStatus === "available" && !portfolioUrl && (
            <motion.button
              className={styles.generateButton}
              onClick={generatePortfolioUrl}
              disabled={isGeneratingUrl}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isGeneratingUrl ? (
                <>
                  <div className={styles.spinner}></div>
                  Generating Portfolio...
                </>
              ) : (
                <>🚀 Generate My Portfolio</>
              )}
            </motion.button>
          )}
        </motion.div>

        {/* Generated URL */}
        {portfolioUrl && (
          <motion.div
            className={styles.successSection}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.successHeader}>
              <h3 className={styles.successTitle}>
                🎊 Your Portfolio is Live!
              </h3>
              <p className={styles.successSubtitle}>
                Share this link with clients and showcase your amazing work
              </p>
            </div>

            <div className={styles.urlDisplay}>
              <input
                type="text"
                value={portfolioUrl}
                readOnly
                className={styles.generatedUrl}
              />
              <button
                className={`${styles.copyButton} ${
                  showCopySuccess ? styles.copied : ""
                }`}
                onClick={copyToClipboard}
              >
                {showCopySuccess ? "Copied!" : "Copy"}
              </button>
            </div>

            <div className={styles.actionButtons}>
              <button
                className={styles.visitButton}
                onClick={() => window.open(portfolioUrl, "_blank")}
              >
                👁️ View Portfolio
              </button>

              <button
                className={styles.editButton}
                onClick={() => router.push("/onboarding")}
              >
                ✏️ Edit Portfolio
              </button>

              <button
                className={styles.shareButton}
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "Check out my portfolio!",
                      url: portfolioUrl,
                    });
                  } else {
                    copyToClipboard();
                  }
                }}
              >
                📤 Share
              </button>
            </div>
          </motion.div>
        )}

        {/* Portfolio Preview */}
        <motion.div className={styles.portfolioPreview} variants={itemVariants}>
          <div className={styles.previewHeader}>
            <h2 className={styles.previewTitle}>📋 Your Portfolio Preview</h2>
            <p className={styles.previewSubtitle}>
              Here's what your portfolio contains
            </p>
          </div>

          <div className={styles.previewSections}>
            {/* Profile Information */}
            {(() => {
              const profileSection = portfolioData?.sections?.find(
                (s: { id: number }) => s.id === 2
              );
              const profilePhotoSection = portfolioData?.sections?.find(
                (s: { id: number }) => s.id === 1
              );
              if (profileSection?.data) {
                const data = profileSection.data as any;
                const photoData = profilePhotoSection?.data as any;
                return (
                  <div className={styles.previewSection}>
                    <div className={styles.previewSectionHeader}>
                      <h3 className={styles.previewSectionTitle}>
                        <span className={styles.previewSectionIcon}>👤</span>
                        Profile Information
                      </h3>
                      <span
                        className={`${styles.sectionStatus} ${styles.completed}`}
                      >
                        Completed
                      </span>
                    </div>

                    <div className={styles.profilePreviewCard}>
                      {photoData?.profileImage?.url && (
                        <div className={styles.profilePhotoPreview}>
                          <img
                            src={photoData.profileImage.url}
                            alt={photoData.profileImage.alt || "Profile"}
                            className={styles.profilePhoto}
                          />
                        </div>
                      )}

                      <div className={styles.profileDetails}>
                        <div className={styles.profileName}>
                          {data.firstName} {data.lastName}
                        </div>
                        <div className={styles.profileTitle}>{data.title}</div>

                        {data.summary && (
                          <div className={styles.profileSummary}>
                            {data.summary}
                          </div>
                        )}

                        <div className={styles.contactInfo}>
                          {data.contact?.email && (
                            <div className={styles.contactItem}>
                              <span className={styles.contactIcon}>📧</span>
                              <span>{data.contact.email}</span>
                            </div>
                          )}

                          {data.contact?.phone && (
                            <div className={styles.contactItem}>
                              <span className={styles.contactIcon}>📱</span>
                              <span>{data.contact.phone}</span>
                            </div>
                          )}

                          {data.location && (
                            <div className={styles.contactItem}>
                              <span className={styles.contactIcon}>📍</span>
                              <span>
                                {data.location.city}, {data.location.country}
                              </span>
                            </div>
                          )}

                          {data.website && (
                            <div className={styles.contactItem}>
                              <span className={styles.contactIcon}>🌐</span>
                              <a
                                href={data.website}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {data.website}
                              </a>
                            </div>
                          )}
                        </div>

                        {data.languages && data.languages.length > 0 && (
                          <div className={styles.languagesSection}>
                            <h4 className={styles.subsectionTitle}>
                              Languages
                            </h4>
                            <div className={styles.languagesList}>
                              {data.languages.map(
                                (lang: any, index: number) => (
                                  <div
                                    key={index}
                                    className={styles.languageItem}
                                  >
                                    <span className={styles.languageName}>
                                      {lang.name}
                                    </span>
                                    <span className={styles.languageLevel}>
                                      {lang.level}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* Work Experience */}
            {(() => {
              const workSection = portfolioData?.sections?.find(
                (s: { id: number }) => s.id === 3
              );
              if (
                workSection?.data?.workExperience &&
                workSection.data.workExperience.length > 0
              ) {
                const experiences = workSection.data.workExperience as any[];
                return (
                  <div className={styles.previewSection}>
                    <div className={styles.previewSectionHeader}>
                      <h3 className={styles.previewSectionTitle}>
                        <span className={styles.previewSectionIcon}>💼</span>
                        Work Experience ({experiences.length})
                      </h3>
                      <span
                        className={`${styles.sectionStatus} ${styles.completed}`}
                      >
                        Completed
                      </span>
                    </div>

                    <div className={styles.experiencesGrid}>
                      {experiences.map((exp: any, index: number) => (
                        <div key={index} className={styles.experienceCard}>
                          <div className={styles.experienceHeader}>
                            <h4 className={styles.experienceTitle}>
                              {exp.jobTitle}
                            </h4>
                            <span className={styles.experienceType}>
                              {exp.employmentType}
                            </span>
                          </div>

                          <div className={styles.experienceCompany}>
                            {exp.companyName}
                          </div>
                          <div className={styles.experienceDuration}>
                            {exp.durationOfEmployment}
                            {exp.isCurrentRole && (
                              <span className={styles.currentRole}>
                                • Current
                              </span>
                            )}
                          </div>

                          {exp.summary && (
                            <div className={styles.experienceSummary}>
                              {exp.summary}
                            </div>
                          )}

                          {exp.portfolioItems &&
                            exp.portfolioItems.length > 0 && (
                              <div className={styles.workSamples}>
                                <div className={styles.workSamplesTitle}>
                                  Work Samples ({exp.portfolioItems.length})
                                </div>
                                <div className={styles.workSamplesList}>
                                  {exp.portfolioItems.map(
                                    (item: any, i: number) => (
                                      <div
                                        key={i}
                                        className={styles.workSampleItem}
                                      >
                                        <span className={styles.workSampleIcon}>
                                          🎬
                                        </span>
                                        <span className={styles.workSampleName}>
                                          {item.title}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* Skills & Software */}
            {(() => {
              const skillsSection = portfolioData?.sections?.find(
                (s: { id: number }) => s.id === 4
              );
              if (skillsSection?.data) {
                const data = skillsSection.data as any;
                const hasSkills = data.skills && data.skills.length > 0;
                const hasSoftware = data.softwares && data.softwares.length > 0;

                if (hasSkills || hasSoftware) {
                  return (
                    <div className={styles.previewSection}>
                      <div className={styles.previewSectionHeader}>
                        <h3 className={styles.previewSectionTitle}>
                          <span className={styles.previewSectionIcon}>🛠️</span>
                          Skills & Technologies
                        </h3>
                        <span
                          className={`${styles.sectionStatus} ${styles.completed}`}
                        >
                          Completed
                        </span>
                      </div>

                      <div className={styles.skillsGrid}>
                        {hasSkills && (
                          <div className={styles.skillsColumn}>
                            <h4 className={styles.skillsColumnTitle}>
                              Skills ({data.skills.length})
                            </h4>
                            <div className={styles.skillsTags}>
                              {data.skills
                                .slice(0, 15)
                                .map((skill: string, index: number) => (
                                  <span key={index} className={styles.skillTag}>
                                    {skill}
                                  </span>
                                ))}
                              {data.skills.length > 15 && (
                                <span className={styles.moreTag}>
                                  +{data.skills.length - 15} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {hasSoftware && (
                          <div className={styles.skillsColumn}>
                            <h4 className={styles.skillsColumnTitle}>
                              Software & Tools ({data.softwares.length})
                            </h4>
                            <div className={styles.skillsTags}>
                              {data.softwares
                                .slice(0, 15)
                                .map((software: string, index: number) => (
                                  <span
                                    key={index}
                                    className={styles.softwareTag}
                                  >
                                    {software}
                                  </span>
                                ))}
                              {data.softwares.length > 15 && (
                                <span className={styles.moreTag}>
                                  +{data.softwares.length - 15} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
              }
              return null;
            })()}

            {/* Social Links */}
            {(() => {
              const socialSection = portfolioData?.sections?.find(
                (s: { id: number }) => s.id === 5
              );
              if (
                socialSection?.data?.socialLinks &&
                socialSection.data.socialLinks.length > 0
              ) {
                const links = socialSection.data.socialLinks as any[];
                return (
                  <div className={styles.previewSection}>
                    <div className={styles.previewSectionHeader}>
                      <h3 className={styles.previewSectionTitle}>
                        <span className={styles.previewSectionIcon}>🔗</span>
                        Social Links ({links.length})
                      </h3>
                      <span
                        className={`${styles.sectionStatus} ${styles.completed}`}
                      >
                        Completed
                      </span>
                    </div>

                    <div className={styles.socialLinksGrid}>
                      {links.map((link: any, index: number) => (
                        <div key={index} className={styles.socialLinkCard}>
                          <div className={styles.socialLinkIcon}>
                            {link.platform === "linkedin" && "💼"}
                            {link.platform === "youtube" && "🎥"}
                            {link.platform === "instagram" && "📸"}
                            {link.platform === "twitter" && "🐦"}
                            {link.platform === "behance" && "🎨"}
                            {link.platform === "dribbble" && "🏀"}
                            {link.platform === "github" && "💻"}
                            {link.platform === "website" && "🌐"}
                            {![
                              "linkedin",
                              "youtube",
                              "instagram",
                              "twitter",
                              "behance",
                              "dribbble",
                              "github",
                              "website",
                            ].includes(link.platform) && "🔗"}
                          </div>
                          <div className={styles.socialLinkInfo}>
                            <div className={styles.socialLinkPlatform}>
                              {link.platform.charAt(0).toUpperCase() +
                                link.platform.slice(1)}
                            </div>
                            {link.handle && (
                              <div className={styles.socialLinkHandle}>
                                {link.handle}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* Empty State */}
            {(() => {
              const completedSections =
                portfolioData?.sections?.filter(
                  (s: { status: string }) => s.status === "completed"
                ) || [];
              if (completedSections.length === 0) {
                return (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyStateIcon}>📝</div>
                    <h3 className={styles.emptyStateTitle}>
                      No completed sections yet
                    </h3>
                    <p className={styles.emptyStateText}>
                      Complete your onboarding to see your portfolio preview
                      here
                    </p>
                    <button
                      className={styles.emptyStateButton}
                      onClick={() => router.push("/onboarding")}
                    >
                      Continue Setup
                    </button>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div className={styles.quickActions} variants={itemVariants}>
          <h3 className={styles.quickActionsTitle}>Quick Actions</h3>
          <div className={styles.quickActionButtons}>
            <button
              className={styles.quickActionButton}
              onClick={() => router.push("/onboarding")}
            >
              <span className={styles.quickActionIcon}>⚙️</span>
              <span>Edit Portfolio</span>
            </button>

            <button
              className={styles.quickActionButton}
              onClick={() =>
                window.open("https://help.joinroster.co", "_blank")
              }
            >
              <span className={styles.quickActionIcon}>💡</span>
              <span>Portfolio Tips</span>
            </button>

            <button
              className={styles.quickActionButton}
              onClick={() =>
                window.open("https://support.joinroster.co", "_blank")
              }
            >
              <span className={styles.quickActionIcon}>🆘</span>
              <span>Get Support</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Extend window interface for timeout
declare global {
  interface Window {
    usernameCheckTimeout: NodeJS.Timeout;
  }
}

export default Dashboard;
