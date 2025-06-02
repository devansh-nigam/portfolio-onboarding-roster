"use client";

import React, { useState } from "react";
import { BaseFieldWrapper } from "./BaseField";
import { SelectFieldProps } from "../../types/FormField";
import styles from "./FormFields.module.css";

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  error,
  required,
  disabled,
  placeholder = "Select an option",
  helperText,
  className,
  options,
  searchable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const isValid = !error && isTouched && value;
  const isInvalid = error && isTouched;

  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setIsTouched(true);
    setSearchTerm("");
  };

  const getSelectClassName = () => {
    let selectClass = `${styles.input} ${styles.select}`;

    if (isValid) selectClass += ` ${styles.valid}`;
    if (isInvalid) selectClass += ` ${styles.invalid}`;
    if (isOpen) selectClass += ` ${styles.focused}`;
    if (disabled) selectClass += ` ${styles.disabled}`;

    return selectClass;
  };

  return (
    <BaseFieldWrapper
      label={label}
      required={required}
      error={error}
      helperText={helperText}
      className={className}
    >
      <div className={styles.selectWrapper}>
        <div
          className={getSelectClassName()}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <span
            className={
              selectedOption ? styles.selectedValue : styles.placeholder
            }
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <svg
            className={`${styles.chevron} ${isOpen ? styles.chevronUp : ""}`}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {isOpen && (
          <div className={styles.dropdown}>
            {searchable && (
              <div className={styles.searchWrapper}>
                <input
                  type="text"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            )}

            <div className={styles.optionsList}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`${styles.option} ${
                      option.value === value ? styles.selected : ""
                    } ${option.disabled ? styles.disabled : ""}`}
                    onClick={() =>
                      !option.disabled && handleSelect(option.value)
                    }
                  >
                    {option.label}
                    {option.value === value && (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M16.667 5L7.5 14.167 3.333 10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                ))
              ) : (
                <div className={styles.noOptions}>No options found</div>
              )}
            </div>
          </div>
        )}

        {/* Overlay to close dropdown when clicking outside */}
        {isOpen && (
          <div className={styles.overlay} onClick={() => setIsOpen(false)} />
        )}
      </div>
    </BaseFieldWrapper>
  );
};
