"use client";
import { useState } from "react";
import styles from "./PortfolioInput.module.css";

const PortfolioInput = ({
  value = "",
  onChange,
  placeholder = "Enter your portfolio URL (e.g., https://yourname.com/portfolio)",
  label = "Portfolio Link",
  required = false,
}) => {
  const [inputValue, setInputValue] = useState(value);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Call parent callbacks
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleBlur = () => {
    setIsTouched(true);
  };

  const handleFocus = () => {
    setErrorMessage("");
  };

  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor="portfolio-input">
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>

      <div className={styles.inputWrapper}>
        <input
          id="portfolio-input"
          type="url"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
        />
      </div>

      <div className={styles.helperText}>
        Supported platforms: Canva, Behance, Dribbble, GitHub Pages, Personal
        websites, and more
      </div>

      <button
        type="submit"
        style={{
          marginTop: "1rem",
          padding: "0.75rem 1.5rem",
          color: "white",
          border: "none",
          borderRadius: "0.5rem",
          fontSize: "1rem",
          transition: "background-color 0.2s",
        }}
      >
        Submit Portfolio
      </button>
    </div>
  );
};

export default PortfolioInput;
