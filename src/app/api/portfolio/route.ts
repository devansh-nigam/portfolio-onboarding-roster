import { NextRequest, NextResponse } from "next/server";

const mockUsers = [
  {
    id: "https://sonuchoudhary.my.canva.site/portfolio",
    portfolio: {
      sections: [
        {
          sectionName: "Profile",
          firstName: "Sonu",
          lastName: "Choudhary",
          title: "Video Editor & Content Creator",
          profileImage: {
            url: "https://sonuchoudhary.my.canva.site/portfolio/_assets/media/dd90340b9434fd961b83cd0676a3470e.png",
            alt: "Sonu Choudhary profile picture",
          },
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
          languages: [
            { name: "English", level: "Fluent" },
            { name: "Hindi", level: "Native" },
          ],
        },
        {
          sectionName: "Work Experience",
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
                  thumbnail: "https://example.com/thumbnails/iphone-review.jpg",
                  videoUrl: "https://youtube.com/watch?v=abc123",
                  duration: "12:34",
                  views: "2.1M",
                },
              ],
            },
          ],
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
