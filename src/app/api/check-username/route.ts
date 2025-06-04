// src/app/api/check-username/route.ts
import { NextRequest, NextResponse } from "next/server";

// Mock database of taken usernames (replace with real database)
const takenUsernames = new Set([
  "admin",
  "api",
  "www",
  "mail",
  "ftp",
  "localhost",
  "test",
  "demo",
  "support",
  "help",
  "info",
  "contact",
  "about",
  "blog",
  "news",
  "john",
  "jane",
  "user",
  "portfolio",
  "profile",
  "dashboard",
  "sonu",
  "roster",
  "app",
  "joinroster",
  "example",
  "sample",
]);

// Generate username suggestions
function generateSuggestions(baseUsername: string): string[] {
  const suggestions: string[] = [];
  const currentYear = new Date().getFullYear().toString().slice(-2);

  // Add numbers
  for (let i = 1; i <= 5; i++) {
    const suggestion = `${baseUsername}${i}`;
    if (!takenUsernames.has(suggestion)) {
      suggestions.push(suggestion);
    }
  }

  // Add year variants
  const yearVariants = [
    `${baseUsername}${currentYear}`,
    `${baseUsername}2024`,
    `${baseUsername}2025`,
  ];

  yearVariants.forEach((variant) => {
    if (!takenUsernames.has(variant) && !suggestions.includes(variant)) {
      suggestions.push(variant);
    }
  });

  // Add underscore variants
  const underscoreVariants = [
    `${baseUsername}_`,
    `${baseUsername}_portfolio`,
    `${baseUsername}_pro`,
  ];

  underscoreVariants.forEach((variant) => {
    if (!takenUsernames.has(variant) && !suggestions.includes(variant)) {
      suggestions.push(variant);
    }
  });

  // Add random suffixes if we need more suggestions
  const randomSuffixes = ["pro", "dev", "design", "creative", "studio", "work"];
  randomSuffixes.forEach((suffix) => {
    const suggestion = `${baseUsername}${suffix}`;
    if (!takenUsernames.has(suggestion) && !suggestions.includes(suggestion)) {
      suggestions.push(suggestion);
    }
  });

  return suggestions.slice(0, 6); // Return max 6 suggestions
}

// Validate username format
function validateUsername(username: string): {
  valid: boolean;
  message?: string;
} {
  if (!username) {
    return { valid: false, message: "Username is required" };
  }

  if (username.length < 3) {
    return {
      valid: false,
      message: "Username must be at least 3 characters long",
    };
  }

  if (username.length > 30) {
    return {
      valid: false,
      message: "Username must be less than 30 characters",
    };
  }

  // Allow only alphanumeric characters and hyphens
  if (!/^[a-z0-9-]+$/.test(username)) {
    return {
      valid: false,
      message: "Username can only contain letters, numbers, and hyphens",
    };
  }

  // Cannot start or end with hyphen
  if (username.startsWith("-") || username.endsWith("-")) {
    return {
      valid: false,
      message: "Username cannot start or end with a hyphen",
    };
  }

  // Cannot have consecutive hyphens
  if (username.includes("--")) {
    return {
      valid: false,
      message: "Username cannot have consecutive hyphens",
    };
  }

  return { valid: true };
}

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { available: false, message: "Username is required" },
        { status: 400 }
      );
    }

    const cleanUsername = username.toLowerCase().trim();

    // Validate username format
    const validation = validateUsername(cleanUsername);
    if (!validation.valid) {
      return NextResponse.json(
        {
          available: false,
          message: validation.message,
          suggestions: generateSuggestions(
            cleanUsername.replace(/[^a-z0-9]/g, "")
          ),
        },
        { status: 400 }
      );
    }

    // Check if username is taken
    const isTaken = takenUsernames.has(cleanUsername);

    if (isTaken) {
      const suggestions = generateSuggestions(cleanUsername);
      return NextResponse.json({
        available: false,
        message: `Username "${cleanUsername}" is already taken`,
        suggestions,
      });
    }

    // Username is available
    return NextResponse.json({
      available: true,
      message: `Username "${cleanUsername}" is available`,
    });
  } catch (error) {
    console.error("Error checking username:", error);
    return NextResponse.json(
      { available: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Use POST method to check username availability" },
    { status: 405 }
  );
}
