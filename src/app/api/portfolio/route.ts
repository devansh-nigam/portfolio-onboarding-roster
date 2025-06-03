import { NextRequest, NextResponse } from "next/server";
import { mockUsers } from "@mock/mockUsers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if this is a portfolio request
    if (body.url) {
      // Find user by URL
      const user = mockUsers.find((u) => u.id === body.url);

      if (user) {
        return NextResponse.json(
          {
            success: true,
            data: user.portfolio,
            message: "Portfolio retrieved successfully",
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { success: false, error: "Portfolio not found" },
          { status: 404 }
        );
      }
    }
  } catch (error) {
    console.warn(error);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}

/**
 *  [
    {
      id: 1,
      title: "Connect Portfolio",
      description: "Link your existing portfolio or create a new one",
      status: "completed" as const,
      estimatedTime: "2 min",
    },
    {
      id: 2,
      title: "Upload Profile Photo",
      description: "Add a professional photo to your profile",
      status: "current" as const,
      estimatedTime: "1 min",
    },
    {
      id: 3,
      title: "Add Work Experience",
      description: "Import or manually add your work history",
      status: "error" as const,
      estimatedTime: "5 min",
    },
    {
      id: 4,
      title: "Setup Skills & Technologies",
      description: "List your technical skills and expertise",
      status: "completed" as const,
      estimatedTime: "3 min",
    },
    {
      id: 5,
      title: "Import Projects",
      description: "Showcase your best work and projects",
      status: "completed" as const,
      estimatedTime: "5 min",
      errorMessage:
        "Failed to connect to GitHub. Please check your permissions.",
    },
    {
      id: 6,
      title: "Review & Publish",
      description: "Final review before making your portfolio live",
      status: "completed" as const,
      estimatedTime: "2 min",
    },
  ]
 * 
 * 
 * 
 */
