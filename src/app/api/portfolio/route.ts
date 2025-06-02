import { NextRequest, NextResponse } from "next/server";

export const mockUsers = [
  {
    id: "https://sonuchoudhary.my.canva.site/portfolio",
    portfolio: {
      sections: [
        {
          id: 1,
          title: "Upload Profile Photo",
          description: "Link your existing portfolio or create a new one",
          status: "pending" as const,
          estimatedTime: "2 min",
          data: {
            profileImage: {
              url: "",
              alt: "Sonu Choudhary profile picture",
            },
          },
        },
        {
          id: 2,
          title: "Profile",
          description: "Update your professional details",
          status: "pending" as const,
          estimatedTime: "1 min",
          data: {
            firstName: "Sonu",
            lastName: "Choudhary",
            title: "Video Editor & Content Creator",
            summary:
              "I specialize in YouTube video editing, crafting high-quality content that captivates audiences and drives engagement. I've had the privilege of working with top creators like Uptin (3M+ followers) and XYZ Education (1M+ subscribers), contributing to content that has amassed over 5 million organic views.",
            website: "https://sonuchoudhary.my.canva.site/portfolio",
            location: {
              city: "Mumbai",
              country: "India",
              timezone: "Asia/Kolkata",
            },
            contact: {
              email: "jabsvideo19@gmail.com",
              phone: "+91-9876543210",
            },
            languages: [
              { name: "English", level: "Fluent" },
              { name: "Hindi", level: "Native" },
            ],
          },
        },
        {
          id: 3,
          title: "Work Experience",
          description: "Add your employers/clients",
          status: "pending" as const,
          estimatedTime: "5 min",
          data: {
            workExperience: [
              {
                id: "exp_1a2b3c4d",
                type: "client",
                companyName: "TechReview Channel",
                jobTitle: "Lead Video Editor",
                startDate: "2023-01-15",
                endDate: null,
                durationOfEmployment: "1 year 5 months",
                employmentType: "contract",
                isCurrentRole: true,
                summary:
                  "Lead editor for a tech review YouTube channel with 500K+ subscribers.",
                portfolioItems: [
                  {
                    id: "vid_1x2y3z",
                    title: "iPhone 15 Pro Max Review",
                    thumbnail:
                      "https://example.com/thumbnails/iphone-review.jpg",
                    videoUrl: "https://youtube.com/watch?v=abc123",
                    duration: "12:34",
                    views: "2.1M",
                  },
                ],
              },
            ],
          },
        },
        {
          id: 4,
          title: "Skills & Softwares",
          description: "Your toolkit to stand you apart!",
          status: "pending" as const,
          estimatedTime: "3 min",
          data: {
            skills: [
              "Color Grading",
              "Graphic Design",
              "Subtitling",
              "Sourcing Stock Footage",
              "CTR Optimization",
              "People Management",
              "Storyboarding",
              "Copywriting",
              "Music Editing",
              "Sound Designing",
              "Sourcing Images",
              "Splice & Dice",
              "Subtitles",
              "Rough Cut & Sequencing",
              "Scheduling Posts",
              "Research",
              "Filming",
              "2D Animation",
              "Audience Retention",
            ],
            softwares: [
              "Adobe Illustrator",
              "Adobe Premiere Pro",
              "Adobe After Effects",
              "Adobe Photoshop",
              "Adobe Indesign",
              "Adobe Audition",
              "Capcut",
              "Audacity",
              "Descript",
              "Notion",
              "Monday.com",
              "Google Workspace",
              "Slack",
              "Trello",
              "Frame.io",
              "Gusto",
              "Excel",
              "Adobe Firefly",
              "Asana",
            ],
          },
        },
        {
          id: 5,
          title: "Social Links",
          description: "Let them reach out to you fast!",
          status: "pending" as const,
          estimatedTime: "2 min",
          data: {
            socialLinks: [
              {
                platform: "instagram",
                url: "https://www.instagram.com/jabsvideo.in/",
                handle: "@jabsvideo.in",
              },
              {
                platform: "youtube",
                url: "https://www.youtube.com/@theeditingentrepreneur",
                handle: "@theeditingentrepreneur",
              },
            ],
          },
        },
      ],
      metadata: {
        profileCompleteness: 95,
        isVerified: true,
        isAvailableForWork: true,
        lastUpdated: "2024-05-15T10:30:00Z",
        createdAt: "2021-01-15T08:00:00Z",
      },
    },
  },
];

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
