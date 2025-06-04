// src/app/api/generate-portfolio/route.ts
import { NextRequest, NextResponse } from "next/server";

// Mock database to store generated portfolios (replace with real database)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const generatedPortfolios = new Map<string, any>();

// Simulate portfolio generation and storage
export async function POST(request: NextRequest) {
  try {
    const { username, portfolioData } = await request.json();

    if (!username || !portfolioData) {
      return NextResponse.json(
        {
          success: false,
          message: "Username and portfolio data are required",
        },
        { status: 400 }
      );
    }

    const cleanUsername = username.toLowerCase().trim();

    // Validate username format (same validation as check-username)
    if (!/^[a-z0-9-]+$/.test(cleanUsername) || cleanUsername.length < 3) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid username format",
        },
        { status: 400 }
      );
    }

    // Check if username is already taken in generated portfolios
    if (generatedPortfolios.has(cleanUsername)) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is no longer available",
        },
        { status: 409 }
      );
    }

    // Validate portfolio data completeness
    const requiredSections = ["profile", "skills"];
    const sections = portfolioData.sections || [];

    const hasProfile = sections.some(
      (section: any) => section.id === 2 && section.status === "completed"
    );

    if (!hasProfile) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Profile section must be completed before generating portfolio",
        },
        { status: 400 }
      );
    }

    // Create portfolio record
    const portfolioRecord = {
      username: cleanUsername,
      portfolioData,
      url: `https://app.joinroster.co/${cleanUsername}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublished: true,
      views: 0,
      metadata: {
        totalSections: sections.length,
        completedSections: sections.filter((s: any) => s.status === "completed")
          .length,
        completionPercentage: Math.round(
          (sections.filter((s: any) => s.status === "completed").length /
            sections.length) *
            100
        ),
        lastModified: new Date().toISOString(),
      },
    };

    // Store in mock database (replace with real database operation)
    generatedPortfolios.set(cleanUsername, portfolioRecord);

    // In a real application, you would:
    // 1. Save to database
    // 2. Generate static HTML files
    // 3. Deploy to CDN
    // 4. Set up routing
    // 5. Send confirmation emails
    // 6. Update analytics

    console.log(
      `Portfolio generated for ${cleanUsername}:`,
      portfolioRecord.url
    );

    // Simulate some processing time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      message: "Portfolio generated successfully",
      data: {
        username: cleanUsername,
        url: portfolioRecord.url,
        createdAt: portfolioRecord.createdAt,
        completionPercentage: portfolioRecord.metadata.completionPercentage,
      },
    });
  } catch (error) {
    console.error("Error generating portfolio:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate portfolio. Please try again.",
      },
      { status: 500 }
    );
  }
}

// Get portfolio data (for viewing generated portfolios)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { success: false, message: "Username parameter is required" },
        { status: 400 }
      );
    }

    const cleanUsername = username.toLowerCase().trim();
    const portfolio = generatedPortfolios.get(cleanUsername);

    if (!portfolio) {
      return NextResponse.json(
        { success: false, message: "Portfolio not found" },
        { status: 404 }
      );
    }

    // Increment view count
    portfolio.views = (portfolio.views || 0) + 1;
    generatedPortfolios.set(cleanUsername, portfolio);

    return NextResponse.json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update existing portfolio
export async function PUT(request: NextRequest) {
  try {
    const { username, portfolioData } = await request.json();

    if (!username || !portfolioData) {
      return NextResponse.json(
        { success: false, message: "Username and portfolio data are required" },
        { status: 400 }
      );
    }

    const cleanUsername = username.toLowerCase().trim();
    const existingPortfolio = generatedPortfolios.get(cleanUsername);

    if (!existingPortfolio) {
      return NextResponse.json(
        { success: false, message: "Portfolio not found" },
        { status: 404 }
      );
    }

    // Update portfolio data
    const updatedPortfolio = {
      ...existingPortfolio,
      portfolioData,
      updatedAt: new Date().toISOString(),
      metadata: {
        ...existingPortfolio.metadata,
        lastModified: new Date().toISOString(),
        totalSections: portfolioData.sections?.length || 0,
        completedSections:
          portfolioData.sections?.filter((s: any) => s.status === "completed")
            .length || 0,
        completionPercentage: Math.round(
          ((portfolioData.sections?.filter((s: any) => s.status === "completed")
            .length || 0) /
            (portfolioData.sections?.length || 1)) *
            100
        ),
      },
    };

    generatedPortfolios.set(cleanUsername, updatedPortfolio);

    return NextResponse.json({
      success: true,
      message: "Portfolio updated successfully",
      data: {
        username: cleanUsername,
        url: updatedPortfolio.url,
        updatedAt: updatedPortfolio.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating portfolio:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update portfolio" },
      { status: 500 }
    );
  }
}

// Delete portfolio
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { success: false, message: "Username parameter is required" },
        { status: 400 }
      );
    }

    const cleanUsername = username.toLowerCase().trim();

    if (!generatedPortfolios.has(cleanUsername)) {
      return NextResponse.json(
        { success: false, message: "Portfolio not found" },
        { status: 404 }
      );
    }

    generatedPortfolios.delete(cleanUsername);

    return NextResponse.json({
      success: true,
      message: "Portfolio deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete portfolio" },
      { status: 500 }
    );
  }
}
