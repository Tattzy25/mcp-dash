import { NextResponse } from "next/server"

const REQUEST_TIMEOUT_MS = 8000

export async function GET() {
  const baseUrl = process.env.MCP_BASE_URL ?? process.env.NEXT_PUBLIC_MCP_BASE_URL
  if (!baseUrl) {
    return NextResponse.json(
      { error: "MCP_BASE_URL is not configured" },
      { status: 500 }
    )
  }

  const token = process.env.MCP_ADMIN_TOKEN ?? process.env.NEXT_PUBLIC_MCP_ADMIN_TOKEN
  if (!token) {
    return NextResponse.json(
      { error: "MCP_ADMIN_TOKEN is required for log streaming" },
      { status: 401 }
    )
  }

  const url = new URL("/admin/api/logs", baseUrl)
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream log feed returned ${response.status}` },
        { status: response.status }
      )
    }

    const body = await response.text()
    const lines = body
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)

    return NextResponse.json({ lines })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to reach upstream logs",
      },
      { status: 502 }
    )
  } finally {
    clearTimeout(timeout)
  }
}
