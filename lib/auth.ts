import { cookies } from "next/headers"

export interface User {
  id: string
  username: string
  role: "admin"
}

// Simple authentication - in production, use proper JWT and bcrypt
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123", // In production, this should be hashed
}

export async function authenticate(username: string, password: string): Promise<User | null> {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    return {
      id: "1",
      username: "admin",
      role: "admin",
    }
  }
  return null
}

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")

  if (!sessionCookie) {
    return null
  }

  try {
    const user = JSON.parse(sessionCookie.value)
    return user
  } catch {
    return null
  }
}

export async function createSession(user: User) {
  const cookieStore = await cookies()
  cookieStore.set("session", JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}
