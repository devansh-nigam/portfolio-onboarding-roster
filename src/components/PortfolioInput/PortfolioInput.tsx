"use client";
import { useRef, useState } from "react";
import styles from "./PortfolioInput.module.css";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const PortfolioInput = () => {
  const [inputValue, setInputValue] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const router = useRouter();
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  function validatePortfolioLink(url: string) {
    if (!url.trim()) {
      return { isValid: null, message: "" };
    }

    // Quick check for forbidden characters (e.g. space or unsafe symbols)
    // if (/[^\w\-.:/~[\]@!$'()*+,;%]/.test(url)) {
    //   return {
    //     isValid: false,
    //     message:
    //       "URL contains invalid characters. Only standard URL-safe characters are allowed.",
    //   };
    // }

    // Malformed protocol check (e.g. 'https:/')
    if (/^https?:[^/]/.test(url) || /^https?:\/(?!\/)/.test(url)) {
      return {
        isValid: false,
        message: "Malformed protocol: Did you mean 'http://' or 'https://'?",
      };
    }

    // Main regex to validate the structure of the URL
    const regex =
      /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[\w\-./~]*)?$/;

    if (regex.test(url)) {
      const domainPart = url
        .replace(/^(https?:\/\/)?(www\.)?/, "")
        .split("/")[0];

      const domainSegments = domainPart.split(".");

      if (domainSegments.length < 2) {
        return {
          isValid: false,
          message:
            "URL must contain a domain and a top-level domain (e.g., 'example.com').",
        };
      }

      if (domainSegments.some((seg: string) => seg.length === 0)) {
        return {
          isValid: false,
          message: "URL contains an empty domain part (e.g., '..' is invalid).",
        };
      }

      return { isValid: true, message: "" };
    }

    return {
      isValid: false,
      message:
        "Please enter a valid URL format (e.g., 'devanshnigam.com' or 'https://www.devanshnigam.com').",
    };
  }

  const handleInputChange = (e: { target: { value: string } }) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsTouched(true);

    const validation = validatePortfolioLink(newValue);
    setIsValid(validation.isValid);
    setErrorMessage(validation.message);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission if inside a form

      if (isValid) {
        // Focus the button first
        submitButtonRef.current?.focus();
        // Then trigger the submit action
        handleSubmit();
      }
    }
  };

  const handleBlur = () => {
    setIsTouched(true);
  };

  const handleFocus = () => {
    setErrorMessage("");
  };

  const handleSubmit = () => {
    if (isValid) {
      router.push("/onboarding");
    }
  };

  const getInputClassName = () => {
    let className = styles.input;

    if (isTouched || inputValue) {
      if (isValid === true) {
        className += ` ${styles.valid}`;
      } else if (isValid === false) {
        className += ` ${styles.invalid}`;
      }
    }

    return className;
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.8,
        ease: "easeOut",
      }}
    >
      <label className={styles.label} htmlFor="portfolio-input">
        Portfolio Link <span className={styles.required}>*</span>
      </label>

      <div className={styles.inputWrapper}>
        <input
          id="portfolio-input"
          type="url"
          maxLength={300}
          value={inputValue}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder="Enter your portfolio URL (e.g., https://yourname.com/portfolio)"
          className={getInputClassName()}
          aria-describedby={errorMessage ? "portfolio-error" : undefined}
        />

        {isValid === true && (
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

        {isValid === false && (
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

      {errorMessage && isTouched && (
        <div id="portfolio-error" className={styles.errorMessage}>
          {errorMessage}
        </div>
      )}

      <div className={styles.helperText}>
        Supported platforms: Canva, Behance, Dribbble, GitHub Pages, Personal
        websites, and more
      </div>

      <motion.button
        type="submit"
        disabled={!isValid}
        style={{
          marginTop: "1rem",
          padding: "0.75rem 1.5rem",
          backgroundColor: isValid ? "var(--color-black)" : "#9ca3af",
          color: "white",
          border: "none",
          borderRadius: "0.5rem",
          cursor: isValid ? "pointer" : "not-allowed",
          fontSize: "1rem",
          transition: "background-color 0.2s",
        }}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.6,
          delay: 0.3,
          ease: [0.6, -0.05, 0.01, 0.99],
        }}
        onClick={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        Submit Portfolio
      </motion.button>
    </motion.div>
  );
};

export default PortfolioInput;
