import { type NextRequest, NextResponse } from "next/server";
import { validateUsername } from "../../lib/utils";

// In-memory user storage (use database in production)
const activeUsers = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const { username, action } = await request.json();

    if (action === "login") {
      const validation = validateUsername(username);
      if (!validation.isValid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }

      // Check if username is already taken
      if (activeUsers.has(username.toLowerCase())) {
        return NextResponse.json(
          { error: "Username is already taken" },
          { status: 409 }
        );
      }

      activeUsers.add(username.toLowerCase());

      return NextResponse.json({
        success: true,
        message: "Authentication successful",
      });
    }

    if (action === "logout") {
      activeUsers.delete(username.toLowerCase());
      return NextResponse.json({
        success: true,
        message: "Logged out successfully",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Auth API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    activeUsers: activeUsers.size,
    timestamp: new Date().toISOString(),
  });
}
