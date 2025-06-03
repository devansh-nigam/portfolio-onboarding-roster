"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setPortfolioDataFromAPI } from "@/lib/slices/portfolio/portfolioSlice";
import styles from "./ProfilePhotoSection.module.css";

interface ProfilePhotoSectionProps {
  sectionData: {
    id: number;
    title: string;
    description: string;
    status: string;
    estimatedTime: string;
    data: {
      profileImage: {
        url: string;
        alt: string;
      };
    };
  };
}

const ProfilePhotoSection: React.FC<ProfilePhotoSectionProps> = ({
  sectionData,
}) => {
  const dispatch = useAppDispatch();
  const portfolioData = useAppSelector(
    (state) => state.portfolio?.portfolioData
  );

  const [currentImage, setCurrentImage] = useState(
    sectionData.data.profileImage
  );
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isDirty, setIsDirty] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  // File validation
  const validateFile = (file: File): string => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      return "Please upload a JPEG, PNG, or WebP image file";
    }

    if (file.size > maxSize) {
      return "Image size must be less than 5MB";
    }

    return "";
  };

  // Convert file to base64 for preview (in real app, you'd upload to cloud storage)
  const fileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle file processing
  const processFile = useCallback(async (file: File) => {
    setError("");
    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsUploading(true);

    try {
      // Convert to data URL for preview (in production, upload to cloud storage)
      const dataURL = await fileToDataURL(file);
      setPreviewImage(dataURL);
      setIsDirty(true);

      // In production, you would upload to your storage service here
      // const uploadedUrl = await uploadToCloudStorage(file);

      // For now, we'll use the data URL as the image URL
      const newImageData = {
        url: dataURL,
        alt: `${file.name} profile picture`,
      };

      setCurrentImage(newImageData);
    } catch (err) {
      setError("Failed to process image. Please try again.");
      console.error("Image processing error:", err);
    } finally {
      setIsUploading(false);
    }
  }, []);

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Handle drag and drop
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounterRef.current = 0;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  // Remove current image
  const handleRemoveImage = () => {
    setCurrentImage({ url: "", alt: "" });
    setPreviewImage(null);
    setIsDirty(true);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Save to Redux
  //   const handleSave = () => {
  //     const updatedPortfolioData = {
  //       ...portfolioData,
  //       sections: portfolioData.sections.map((section: any) =>
  //         section.id === sectionData.id
  //           ? {
  //               ...section,
  //               data: { profileImage: currentImage },
  //               status: currentImage.url ? "completed" : "pending",
  //             }
  //           : section
  //       ),
  //     };

  //     dispatch(setPortfolioDataFromAPI(updatedPortfolioData));
  //     setIsDirty(false);
  //     console.log("Profile photo saved successfully!");
  //   };

  // Save to Redux
  const handleSave = () => {
    const hasValidImage = currentImage.url && currentImage.url.trim() !== "";

    const updatedPortfolioData = {
      ...portfolioData,
      sections: portfolioData.sections.map((section: any) =>
        section.id === sectionData.id
          ? {
              ...section,
              data: { profileImage: currentImage },
              status: hasValidImage ? "completed" : "pending",
            }
          : section
      ),
    };

    dispatch(setPortfolioDataFromAPI(updatedPortfolioData));
    setIsDirty(false);
    console.log("Profile photo saved successfully!", {
      hasValidImage,
      currentImage,
    });
  };

  // Trigger file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

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

  const hasImage = currentImage.url || previewImage;

  return (
    <motion.div
      className={styles.photoSection}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className={styles.sectionHeader} variants={itemVariants}>
        <h1 className={styles.title}>Upload Your Profile Photo</h1>
        <p className={styles.subtitle}>
          Add a professional photo to make a great first impression
        </p>
      </motion.div>

      <motion.div className={styles.uploadContainer} variants={itemVariants}>
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className={styles.hiddenInput}
        />

        {/* Upload Area */}
        <div
          className={`${styles.uploadArea} ${
            isDragging ? styles.dragging : ""
          } ${hasImage ? styles.hasImage : ""}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={!hasImage ? triggerFileInput : undefined}
        >
          {isUploading ? (
            <div className={styles.uploadingState}>
              <div className={styles.spinner} />
              <p>Processing your image...</p>
            </div>
          ) : hasImage ? (
            <div className={styles.imagePreview}>
              <div className={styles.imageContainer}>
                <img
                  src={previewImage || currentImage.url}
                  alt={currentImage.alt || "Profile preview"}
                  className={styles.previewImage}
                />
                <div className={styles.imageOverlay}>
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className={styles.changeButton}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M4 16L16 4M16 4H8M16 4V12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Change Photo
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className={styles.removeButton}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M4 7H16M10 11V15M8 11V15M12 11V15M5 7L6 17H14L15 7M9 7V4H11V7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.uploadPrompt}>
              <div className={styles.uploadIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className={styles.uploadTitle}>
                {isDragging
                  ? "Drop your image here"
                  : "Upload your profile photo"}
              </h3>
              <p className={styles.uploadText}>
                Drag and drop your image here, or{" "}
                <span className={styles.browseText}>browse files</span>
              </p>
              <div className={styles.uploadSpecs}>
                <span>JPEG, PNG, WebP • Max 5MB • Recommended: 400x400px</span>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            className={styles.errorMessage}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 10V6M10 14h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {error}
          </motion.div>
        )}

        {/* Tips */}
        <motion.div className={styles.tipsSection} variants={itemVariants}>
          <h4 className={styles.tipsTitle}>📸 Photo Tips</h4>
          <ul className={styles.tipsList}>
            <li>Use a high-quality, recent photo</li>
            <li>Face the camera with good lighting</li>
            <li>Keep a professional, friendly expression</li>
            <li>Avoid busy backgrounds</li>
            <li>Square format works best (1:1 ratio)</li>
          </ul>
        </motion.div>

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
              Save Profile Photo
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

export default ProfilePhotoSection;
