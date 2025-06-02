"use client";

import React from "react";
import styles from "./FormFields.module.css";

interface BaseFieldWrapperProps {
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
  className?: string;
}

export const BaseFieldWrapper: React.FC<BaseFieldWrapperProps> = ({
  label,
  required,
  error,
  helperText,
  children,
  className = "",
}) => {
  return (
    <div className={`${styles.fieldWrapper} ${className}`}>
      <label className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>

      <div className={styles.inputContainer}>{children}</div>

      {error && (
        <div className={styles.errorMessage}>
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
        </div>
      )}

      {helperText && !error && (
        <div className={styles.helperText}>{helperText}</div>
      )}
    </div>
  );
};
