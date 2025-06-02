import { NextRequest, NextResponse } from "next/server";

// Mock data structure for existing analyses
const mockAnalyses = [
  {
    id: 1,
    url: "https://sonuchoudhary.my.canva.site/portfolio",
    analysis: {
      // Analysis data would be stored here
    },
  },
  {
    id: 2,
    url: "https://dellinzhang.com/video-edit",
    analysis: {
      // Analysis data would be stored here
    },
  },
];

// Helper function to generate mock analysis data
function generateMockAnalysis(url: string) {
  // Simulate different analysis results based on URL patterns
  const domain = new URL(url).hostname;
  const isPortfolio = url.includes("portfolio") || url.includes("resume");
  const isEcommerce = url.includes("shop") || url.includes("store");
  const isBlog = url.includes("blog") || url.includes("article");

  return {
    metadata: {
      title: `${domain} - Professional ${
        isPortfolio ? "Portfolio" : isEcommerce ? "Store" : "Website"
      }`,
      description: `A ${
        isPortfolio
          ? "creative portfolio"
          : isEcommerce
          ? "online store"
          : "professional website"
      } showcasing quality content.`,
      favicon: `https://www.google.com/s2/favicons?domain=${domain}`,
      ogImage: `https://via.placeholder.com/1200x630/4F46E5/FFFFFF?text=${encodeURIComponent(
        domain
      )}`,
      keywords: isPortfolio
        ? ["portfolio", "creative", "design"]
        : isEcommerce
        ? ["shop", "products", "store"]
        : ["website", "business"],
    },

    technicalAnalysis: {
      loadTime: Math.floor(Math.random() * 3000) + 500, // 500-3500ms
      performanceScore: Math.floor(Math.random() * 40) + 60, // 60-100
      mobileOptimized: Math.random() > 0.3, // 70% chance of being mobile optimized
      httpsEnabled: true,
      technologies: [
        ...(Math.random() > 0.5 ? ["React"] : []),
        ...(Math.random() > 0.5 ? ["Next.js"] : []),
        ...(Math.random() > 0.3 ? ["Tailwind CSS"] : ["CSS"]),
        ...(Math.random() > 0.7 ? ["TypeScript"] : ["JavaScript"]),
      ],
    },

    seoAnalysis: {
      score: Math.floor(Math.random() * 30) + 70, // 70-100
      issues: [
        ...(Math.random() > 0.6 ? ["Missing meta description"] : []),
        ...(Math.random() > 0.8 ? ["No alt text on images"] : []),
        ...(Math.random() > 0.7 ? ["Missing structured data"] : []),
      ],
      recommendations: [
        "Add more descriptive meta tags",
        "Improve internal linking structure",
        "Optimize images for faster loading",
      ],
    },

    contentAnalysis: {
      wordCount: Math.floor(Math.random() * 2000) + 300,
      readingTime: Math.floor(Math.random() * 10) + 2, // 2-12 minutes
      contentType: isPortfolio
        ? "portfolio"
        : isEcommerce
        ? "ecommerce"
        : isBlog
        ? "blog"
        : "corporate",
      sections: isPortfolio
        ? ["About", "Projects", "Skills", "Contact"]
        : isEcommerce
        ? ["Products", "Categories", "Cart", "Checkout"]
        : ["Home", "About", "Services", "Contact"],
      languageDetected: "en",
    },

    socialMediaPresence: {
      platforms: [
        ...(Math.random() > 0.4 ? [{ platform: "LinkedIn", url: "#" }] : []),
        ...(Math.random() > 0.6 ? [{ platform: "Twitter", url: "#" }] : []),
        ...(Math.random() > 0.7 ? [{ platform: "Instagram", url: "#" }] : []),
        ...(Math.random() > 0.8 ? [{ platform: "GitHub", url: "#" }] : []),
      ],
      shareability: Math.floor(Math.random() * 30) + 70,
    },

    securityAnalysis: {
      sslScore: Math.random() > 0.9 ? "A+" : "A",
      vulnerabilities: Math.random() > 0.8 ? ["Outdated dependencies"] : [],
      privacyScore: Math.floor(Math.random() * 20) + 80,
    },

    timestamp: new Date().toISOString(),
    processingTime: Math.floor(Math.random() * 2000) + 1000, // 1-3 seconds
  };
}

// POST /api/analyze
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    // Validation
    if (!url) {
      return NextResponse.json(
        {
          success: false,
          error: "URL is required",
          message: "Please provide a valid URL to analyze",
        },
        { status: 400 }
      );
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid URL format",
          message: "Please provide a valid URL (e.g., https://example.com)",
        },
        { status: 400 }
      );
    }

    // Check if URL was already analyzed (optional caching simulation)
    const existingAnalysis = mockAnalyses.find(
      (analysis) => analysis.url === url
    );

    if (existingAnalysis) {
      return NextResponse.json({
        success: true,
        data: {
          id: existingAnalysis.id,
          url: existingAnalysis.url,
          analysis: existingAnalysis.analysis,
          cached: true,
          message: "Retrieved cached analysis results",
        },
      });
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate mock analysis
    const analysis = generateMockAnalysis(url);
    const newAnalysis = {
      id: mockAnalyses.length + 1,
      url,
      analysis,
      cached: false,
    };

    // In a real app, you'd save this to a database
    mockAnalyses.push(newAnalysis);

    return NextResponse.json({
      success: true,
      data: newAnalysis,
      message: "URL analysis completed successfully",
    });
  } catch (error) {
    console.error("Error analyzing URL:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Analysis failed",
        message: "An error occurred while analyzing the URL. Please try again.",
      },
      { status: 500 }
    );
  }
}
