import { NextRequest, NextResponse } from "next/server";

// Mock data - in a real app, this could come from a database
const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "user" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "user" },
  { id: 4, name: "Alice Brown", email: "alice@example.com", role: "moderator" },
];

// GET /api/users
export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const limit = searchParams.get("limit");

    let filteredUsers = mockUsers;

    // Filter by role if provided
    if (role) {
      filteredUsers = mockUsers.filter((user) => user.role === role);
    }

    // Limit results if provided
    if (limit) {
      filteredUsers = filteredUsers.slice(0, parseInt(limit));
    }

    return NextResponse.json({
      success: true,
      data: filteredUsers,
      total: filteredUsers.length,
    });
  } catch (error) {
    console.warn(error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/users
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Create new user with auto-generated ID
    const newUser = {
      id: mockUsers.length + 1,
      name: body.name,
      email: body.email,
      role: body.role || "user",
    };

    // In a real app, you'd save to database
    mockUsers.push(newUser);

    return NextResponse.json(
      {
        success: true,
        data: newUser,
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.warn(error);
    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    );
  }
}
