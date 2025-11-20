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

  const url = new URL("/health", baseUrl)
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream health check returned ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to reach upstream health endpoint",
      },
      { status: 502 }
    )
  } finally {
    clearTimeout(timeout)
  }
}
