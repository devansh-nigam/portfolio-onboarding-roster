"use client";

import React, { useState } from "react";
import { BaseFieldWrapper } from "./BaseField";
import { TextFieldProps } from "../../types/FormField";
import styles from "./FormFields.module.css";

export const TextField: React.FC<TextFieldProps> = ({
  label,
  value,
  onChange,
  error,
  required,
  disabled,
  placeholder,
  helperText,
  className,
  type = "text",
  maxLength,
  minLength,
}) => {
  const [isTouched, setIsTouched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isValid = !error && isTouched && value?.toString().trim();
  const isInvalid = error && isTouched;

  const getInputClassName = () => {
    let inputClass = styles.input;

    if (isValid) inputClass += ` ${styles.valid}`;
    if (isInvalid) inputClass += ` ${styles.invalid}`;
    if (isFocused) inputClass += ` ${styles.focused}`;
    if (disabled) inputClass += ` ${styles.disabled}`;

    return inputClass;
  };

  return (
    <BaseFieldWrapper
      label={label}
      required={required}
      error={error}
      helperText={helperText}
      className={className}
    >
      <div className={styles.inputWrapper}>
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setIsTouched(true)}
          onFocus={() => setIsFocused(true)}
          //   onBlur={() => {
          //     setIsTouched(true);
          //     setIsFocused(false);
          //   }}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          minLength={minLength}
          className={getInputClassName()}
        />

        {isValid && (
          <div className={styles.validIcon}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M16.667 5L7.5 14.167 3.333 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        {isInvalid && (
          <div className={styles.invalidIcon}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 10V6M10 14h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </BaseFieldWrapper>
  );
};
