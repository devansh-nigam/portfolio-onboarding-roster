"use client";

import React, { useState } from "react";
import { BaseFieldWrapper } from "./BaseField";
import { TextAreaFieldProps } from "../../types/FormField";
import styles from "./FormFields.module.css";

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  value,
  onChange,
  error,
  required,
  disabled,
  placeholder,
  helperText,
  className,
  rows = 4,
  maxLength,
  resize = true,
}) => {
  const [isTouched, setIsTouched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isValid = !error && isTouched && value?.toString().trim();
  const isInvalid = error && isTouched;
  const characterCount = value?.toString().length || 0;

  const getTextAreaClassName = () => {
    let textareaClass = `${styles.input} ${styles.textarea}`;

    if (isValid) textareaClass += ` ${styles.valid}`;
    if (isInvalid) textareaClass += ` ${styles.invalid}`;
    if (isFocused) textareaClass += ` ${styles.focused}`;
    if (disabled) textareaClass += ` ${styles.disabled}`;
    if (!resize) textareaClass += ` ${styles.noResize}`;

    return textareaClass;
  };

  return (
    <BaseFieldWrapper
      label={label}
      required={required}
      error={error}
      helperText={helperText}
      className={className}
    >
      <div className={styles.textareaWrapper}>
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => {
            setIsTouched(true);
            setIsFocused(false);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className={getTextAreaClassName()}
        />

        {maxLength && (
          <div className={styles.characterCount}>
            <span
              className={characterCount > maxLength * 0.9 ? styles.warning : ""}
            >
              {characterCount}
            </span>
            /{maxLength}
          </div>
        )}
      </div>
    </BaseFieldWrapper>
  );
};
