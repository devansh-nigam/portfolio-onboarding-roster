"use client";

import React, { useState, KeyboardEvent } from "react";
import { BaseFieldWrapper } from "./BaseField";
import { TagFieldProps } from "../../types/FormField";
import styles from "./FormFields.module.css";

export const TagField: React.FC<TagFieldProps> = ({
  label,
  value = [],
  onChange,
  error,
  required,
  disabled,
  placeholder = "Type and press Enter to add tags",
  helperText,
  className,
  suggestions = [],
  maxTags,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.includes(suggestion)
  );

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (
      trimmedTag &&
      !value.includes(trimmedTag) &&
      (!maxTags || value.length < maxTags)
    ) {
      onChange([...value, trimmedTag]);
      setInputValue("");
      setShowSuggestions(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  const isAtMaxTags = maxTags && value.length >= maxTags;

  return (
    <BaseFieldWrapper
      label={label}
      required={required}
      error={error}
      helperText={helperText}
      className={className}
    >
      <div className={styles.tagFieldWrapper}>
        <div
          className={`${styles.tagInput} ${isFocused ? styles.focused : ""} ${
            disabled ? styles.disabled : ""
          }`}
        >
          <div className={styles.tagsList}>
            {value.map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className={styles.tagRemove}
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>

          {!isAtMaxTags && (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                setIsFocused(true);
                setShowSuggestions(inputValue.length > 0);
              }}
              onBlur={() => {
                setIsFocused(false);
                // Delay hiding suggestions to allow clicks
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              placeholder={value.length === 0 ? placeholder : ""}
              disabled={disabled}
              className={styles.tagInputField}
            />
          )}
        </div>

        {maxTags && (
          <div className={styles.tagCounter}>
            {value.length}/{maxTags}
          </div>
        )}

        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className={styles.suggestions}>
            {filteredSuggestions.slice(0, 10).map((suggestion, index) => (
              <div
                key={index}
                className={styles.suggestion}
                onClick={() => addTag(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
    </BaseFieldWrapper>
  );
};
