import { headers } from "next/headers"
import { performance } from "node:perf_hooks"

import { HealthRadials } from "@/components/tattty/health-radials"
import { RealTimeLogTable } from "@/components/tattty/real-time-log-table"
import type { StatusSummary } from "@/components/tattty/types"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type EndpointMethod = "GET" | "POST"
type EndpointMode = "probe" | "metrics"

type EndpointConfig = {
  id: string
  label: string
  description: string
  method: EndpointMethod
  path: string
  mode: EndpointMode
  expectJson?: boolean
  requiresAdmin?: boolean
  extractor?: (payload: unknown) => string[]
  metricsExtractor?: (metrics: unknown) => MetricsExtraction
}

type SectionDefinition = {
  id: string
  title: string
  description: string
  items: EndpointConfig[]
}

type EndpointStatus = {
  id: string
  label: string
  description: string
  method: EndpointMethod
  path: string
  mode: EndpointMode
  ok: boolean
  badgeLabel: string
  badgeVariant: "default" | "secondary" | "destructive" | "outline"
  details: string[]
  latencyMs?: number
  httpStatus?: number | null
  timestamp: string
}

type MetricsExtraction = {
  ok: boolean
  details: string[]
  badgeLabel?: string
  badgeVariant?: EndpointStatus["badgeVariant"]
}

const REQUEST_TIMEOUT_MS = 8000

const sections: SectionDefinition[] = [
  {
    id: "health",
    title: "Health & Probes",
    description:
      "Direct health checks consumed by uptime monitors, deep diagnostics, and Railway snapshots.",
    items: [
      {
        id: "health-alive",
        label: "Alive Probe",
        description: "GET /health",
        method: "GET",
        path: "/health",
        mode: "probe",
      },
      {
        id: "health-deep",
        label: "Composite Health",
        description: "GET /health/deep",
        method: "GET",
        path: "/health/deep",
        mode: "probe",
      },
      {
        id: "health-railway",
        label: "Railway Snapshot",
        description: "GET /health/railway",
        method: "GET",
        path: "/health/railway",
        mode: "probe",
      },
      {
        id: "admin-health-deep",
        label: "Admin Deep Health",
        description: "GET /admin/api/health/deep",
        method: "GET",
        path: "/admin/api/health/deep",
        mode: "probe",
        requiresAdmin: true,
      },
      {
        id: "admin-health-railway",
        label: "Admin Railway Health",
        description: "GET /admin/api/health/railway",
        method: "GET",
        path: "/admin/api/health/railway",
        mode: "probe",
        requiresAdmin: true,
      },
    ],
  },
  {
    id: "runtime",
    title: "Runtime & Streams",
    description:
      "Command execution latency, SSE continuity, and raw metrics powering MCP operations.",
    items: [
      {
        id: "mcp-post",
        label: "JSON-RPC Command",
        description: "POST /mcp",
        method: "POST",
        path: "/mcp",
        mode: "metrics",
      },
      {
        id: "mcp-sse",
        label: "Progress Stream",
        description: "GET /mcp (SSE)",
        method: "GET",
        path: "/mcp",
        mode: "metrics",
        metricsExtractor: extractSseMetrics,
      },
      {
        id: "admin-metrics",
        label: "Metrics Snapshot",
        description: "GET /admin/api/metrics",
        method: "GET",
        path: "/admin/api/metrics",
        mode: "probe",
        requiresAdmin: true,
      },
      {
        id: "admin-logs",
        label: "Structured Logs",
        description: "GET /admin/api/logs",
        method: "GET",
        path: "/admin/api/logs",
        mode: "probe",
        requiresAdmin: true,
        expectJson: false,
        extractor: extractLogLines,
      },
    ],
  },
  {
    id: "admin",
    title: "Admin Surface",
    description:
      "Privileged HTML console and configuration endpoints that influence health signals.",
    items: [
      {
        id: "admin-dashboard",
        label: "Admin Console",
        description: "GET /admin",
        method: "GET",
        path: "/admin",
        mode: "probe",
        requiresAdmin: true,
        expectJson: false,
      },
      {
        id: "admin-settings",
        label: "Settings Updates",
        description: "POST /admin/settings",
        method: "POST",
        path: "/admin/settings",
        mode: "metrics",
      },
    ],
  },
]

export default async function TaTTTyMcpPage() {
  const headerList = await headers()
  const baseUrl = resolveBaseUrl(headerList)
  const adminToken =
    process.env.MCP_ADMIN_TOKEN ?? process.env.NEXT_PUBLIC_MCP_ADMIN_TOKEN
  const adminHeaders: Record<string, string> = adminToken
    ? { Authorization: `Bearer ${adminToken}` }
    : {}
  const generatedAt = new Date()

  const probeConfigs = sections
    .flatMap((section) => section.items)
    .filter((item) => item.mode === "probe")

  const probeResults = await Promise.all(
    probeConfigs.map((config) =>
      probeEndpoint({ config, baseUrl, adminHeaders, generatedAt })
    )
  )

  const metricsData = getRawDataFor("admin-metrics", probeResults)
  const statusById = new Map<string, EndpointStatus>(
    probeResults.map(({ status }) => [status.id, status])
  )

  const sectionsWithStatus = sections.map((section) => ({
    ...section,
    items: section.items.map((item) => {
      if (item.mode === "probe") {
        return statusById.get(item.id)!
      }
      return deriveMetricsStatus({ item, metricsData, generatedAt })
    }),
  }))

  const flattenedStatuses = sectionsWithStatus.flatMap((section) =>
    section.items as EndpointStatus[]
  )
  const statusSummary = buildStatusSummary(flattenedStatuses)
  const spreadsheetRows = buildSpreadsheetRows(flattenedStatuses)

  return (
    <div className="flex flex-col gap-8 px-4 py-8 lg:px-6">
      <header className="flex flex-col gap-3">
        <Badge variant="outline" className="w-fit">
          TaTTTy-MCP
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight">Mission Control</h1>
        <p className="text-muted-foreground text-lg max-w-3xl">
          Live health probes, MCP runtime signals, and admin-surface metrics pulled
          directly from the production endpoints listed below.
        </p>
      </header>

      <section className="grid gap-4 xl:grid-cols-[2fr,1fr]">
        <Card className="p-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Radial Telemetry</h2>
                <p className="text-muted-foreground text-sm">
                  Percentages are derived from the same live probes rendered below.
                </p>
              </div>
              <Badge variant="secondary">
                {statusSummary.total} live endpoints
              </Badge>
            </div>
            <HealthRadials summary={statusSummary} />
          </div>
        </Card>
        <Card className="p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Real-time logging</h2>
              <p className="text-muted-foreground text-sm">
                Direct tail from /admin/api/logs via secured proxy.
              </p>
            </div>
            <Badge variant="outline">live</Badge>
          </div>
          <RealTimeLogTable />
        </Card>
      </section>

      <Card className="p-6">
        <div className="flex items-center justify-between pb-4">
          <div>
            <h2 className="text-2xl font-semibold">Mission spreadsheet</h2>
            <p className="text-muted-foreground text-sm">
              Every endpoint, latency, and status rendered as a live spreadsheet grid.
            </p>
          </div>
          <Badge variant="secondary">auto-updates</Badge>
        </div>
        <StatusSpreadsheet statuses={spreadsheetRows} />
      </Card>

      {sectionsWithStatus.map((section) => (
        <section key={section.id} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold">{section.title}</h2>
            <p className="text-muted-foreground text-sm">{section.description}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {section.items.map((item) => (
              <Card key={item.id} className="@container/card">
                <CardHeader className="gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <CardTitle className="text-lg">{item.label}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                    <Badge variant={item.badgeVariant}>{item.badgeLabel}</Badge>
                  </div>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {item.method} {item.path}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {item.details.map((detail) => (
                      <li key={detail} className="flex gap-2">
                        <span className="mt-1 size-1.5 rounded-full bg-primary" />
                        <span className="leading-tight">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground justify-between">
                  <span>
                    {item.mode === "probe"
                      ? item.latencyMs !== undefined
                        ? `${Math.round(item.latencyMs)} ms`
                        : "probe"
                      : "metrics feed"}
                  </span>
                  <span>{item.timestamp}</span>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

async function probeEndpoint({
  config,
  baseUrl,
  adminHeaders,
  generatedAt,
}: {
  config: EndpointConfig
  baseUrl: string
  adminHeaders: Record<string, string>
  generatedAt: Date
}): Promise<{ status: EndpointStatus; rawData?: unknown }> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  const headers: Record<string, string> = {
    Accept: config.expectJson === false ? "*/*" : "application/json",
  }

  if (config.requiresAdmin) {
    Object.assign(headers, adminHeaders)
  }

  const url = new URL(config.path, baseUrl).toString()
  const start = performance.now()
  let ok = false
  let httpStatus: number | null = null
  let latency = 0
  let details: string[] = []
  let badgeLabel = "Offline"
  let badgeVariant: EndpointStatus["badgeVariant"] = "destructive"
  let rawData: unknown

  try {
    const response = await fetch(url, {
      method: config.method,
      cache: "no-store",
      headers,
      signal: controller.signal,
    })
    latency = performance.now() - start
    httpStatus = response.status
    ok = response.ok
    badgeLabel = ok ? `HTTP ${response.status}` : `HTTP ${response.status}`
    badgeVariant = ok ? "secondary" : "destructive"

    const contentType = response.headers.get("content-type") ?? ""
    if (config.expectJson === false && config.extractor) {
      const text = await response.text()
      details = config.extractor(text)
    } else if (contentType.includes("application/json")) {
      rawData = await response.json()
      details = config.extractor
        ? config.extractor(rawData)
        : buildJsonHighlights(rawData)
    } else {
      const text = await response.text()
      if (text) {
        details = [text.slice(0, 140)]
      }
    }
  } catch (error) {
    badgeLabel = error instanceof Error ? error.name : "Error"
    details = [
      error instanceof Error ? error.message : "Request failed",
      "Will retry on next render.",
    ]
  } finally {
    clearTimeout(timeout)
  }

  if (details.length === 0) {
    details = [ok ? "No additional details returned." : "No response body received."]
  }

  return {
    status: {
      id: config.id,
      label: config.label,
      description: config.description,
      method: config.method,
      path: config.path,
      mode: config.mode,
      ok,
      badgeLabel,
      badgeVariant,
      details,
      latencyMs: ok ? latency : undefined,
      httpStatus,
      timestamp: formatTimestamp(generatedAt),
    },
    rawData,
  }
}

function deriveMetricsStatus({
  item,
  metricsData,
  generatedAt,
}: {
  item: EndpointConfig
  metricsData?: unknown
  generatedAt: Date
}): EndpointStatus {
  if (!metricsData) {
    return {
      id: item.id,
      label: item.label,
      description: item.description,
      method: item.method,
      path: item.path,
      mode: item.mode,
      ok: false,
      badgeLabel: "No metrics",
      badgeVariant: "destructive",
      details: ["/admin/api/metrics unavailable"],
      timestamp: formatTimestamp(generatedAt),
    }
  }

  if (item.metricsExtractor) {
    const extraction = item.metricsExtractor(metricsData)
    return {
      id: item.id,
      label: item.label,
      description: item.description,
      method: item.method,
      path: item.path,
      mode: item.mode,
      ok: extraction.ok,
      badgeLabel: extraction.badgeLabel ?? (extraction.ok ? "Healthy" : "Issue"),
      badgeVariant: extraction.badgeVariant ?? (extraction.ok ? "secondary" : "destructive"),
      details:
        extraction.details.length > 0
          ? extraction.details
          : ["Metrics feed did not include details."],
      timestamp: formatTimestamp(generatedAt),
    }
  }

  const entry = lookupMetricsEntry(metricsData, item.method, item.path)
  if (!entry) {
    return {
      id: item.id,
      label: item.label,
      description: item.description,
      method: item.method,
      path: item.path,
      mode: item.mode,
      ok: false,
      badgeLabel: "Missing",
      badgeVariant: "destructive",
      details: [
        `No record for ${item.method} ${item.path} in /admin/api/metrics response.`,
      ],
      timestamp: formatTimestamp(generatedAt),
    }
  }

  const { ok, details } = formatMetricDetails(entry)

  return {
    id: item.id,
    label: item.label,
    description: item.description,
    method: item.method,
    path: item.path,
    mode: item.mode,
    ok,
    badgeLabel: ok ? "Healthy" : "Degraded",
    badgeVariant: ok ? "secondary" : "destructive",
    details,
    timestamp: formatTimestamp(generatedAt),
  }
}

function buildSpreadsheetRows(statuses: EndpointStatus[]): EndpointStatus[] {
  return [...statuses].sort((a, b) => a.label.localeCompare(b.label))
}

function StatusSpreadsheet({ statuses }: { statuses: EndpointStatus[] }) {
  if (statuses.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Awaiting first successful probe cycle. Once live traffic lands, this grid fills in
        automatically.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[220px]">Endpoint</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Latency</TableHead>
            <TableHead>HTTP</TableHead>
            <TableHead className="min-w-[140px]">Last Seen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {statuses.map((status) => (
            <TableRow key={status.id} className="text-sm">
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{status.label}</span>
                  <span className="text-muted-foreground text-xs font-mono">
                    {status.method} {status.path}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {status.details[0] ?? "No details"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={status.badgeVariant}>{status.badgeLabel}</Badge>
              </TableCell>
              <TableCell className="font-mono">
                {typeof status.latencyMs === "number"
                  ? `${Math.round(status.latencyMs)} ms`
                  : "—"}
              </TableCell>
              <TableCell className="font-mono text-xs">
                {status.httpStatus ?? "—"}
              </TableCell>
              <TableCell className="font-mono text-xs">{status.timestamp}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function buildStatusSummary(statuses: EndpointStatus[]): StatusSummary {
  const total = statuses.length
  if (total === 0) {
    return {
      total: 0,
      healthy: 0,
      degraded: 0,
      failing: 0,
      avgLatency: null,
      p95Latency: null,
      maxLatency: null,
      sampleSize: 0,
      healthMix: [
        { key: "healthy", label: "Healthy", value: 0 },
        { key: "degraded", label: "Degraded", value: 0 },
        { key: "failing", label: "Failing", value: 0 },
      ],
      latencyBuckets: [
        { key: "fast", label: "< 400 ms", value: 0 },
        { key: "steady", label: "400-1200 ms", value: 0 },
        { key: "slow", label: "> 1200 ms", value: 0 },
      ],
    }
  }

  const latencySamples = statuses
    .map((status) => status.latencyMs)
    .filter((value): value is number => typeof value === "number")

  const failing = statuses.filter((status) => !status.ok).length
  const degraded = statuses.filter((status) => {
    if (!status.ok) return false
    if (typeof status.latencyMs === "number" && status.latencyMs > 1200) {
      return true
    }
    const label = status.badgeLabel?.toLowerCase?.() ?? ""
    return label.includes("degrad") || label.includes("warn") || label.includes("issue")
  }).length
  const healthy = Math.max(total - degraded - failing, 0)

  const avgLatency = latencySamples.length
    ? latencySamples.reduce((sum, value) => sum + value, 0) / latencySamples.length
    : null
  const p95Latency = computePercentile(latencySamples, 0.95)
  const maxLatency = latencySamples.length
    ? Math.max(...latencySamples)
    : null

  const fast = latencySamples.filter((value) => value < 400).length
  const steady = latencySamples.filter((value) => value >= 400 && value <= 1200).length
  const slow = latencySamples.filter((value) => value > 1200).length
  const latencyBase = latencySamples.length || 1

  return {
    total,
    healthy,
    degraded,
    failing,
    avgLatency,
    p95Latency,
    maxLatency,
    sampleSize: latencySamples.length,
    healthMix: [
      { key: "healthy", label: "Healthy", value: (healthy / total) * 100 },
      { key: "degraded", label: "Degraded", value: (degraded / total) * 100 },
      { key: "failing", label: "Failing", value: (failing / total) * 100 },
    ],
    latencyBuckets: [
      { key: "fast", label: "< 400 ms", value: (fast / latencyBase) * 100 },
      { key: "steady", label: "400-1200 ms", value: (steady / latencyBase) * 100 },
      { key: "slow", label: "> 1200 ms", value: (slow / latencyBase) * 100 },
    ],
  }
}

function computePercentile(values: number[], percentile: number): number | null {
  if (!values.length) return null
  const sorted = [...values].sort((a, b) => a - b)
  const rank = Math.min(sorted.length - 1, Math.max(0, Math.ceil(percentile * sorted.length) - 1))
  return sorted[rank]
}

function buildJsonHighlights(payload: unknown, limit = 3): string[] {
  if (!payload || typeof payload !== "object") {
    return [String(payload)]
  }

  const entries = Object.entries(payload as Record<string, unknown>)
  const lines: string[] = []

  for (const [key, value] of entries) {
    if (lines.length >= limit) break
    if (value && typeof value === "object") {
      if (
        "status" in (value as Record<string, unknown>) &&
        typeof (value as Record<string, unknown>).status === "string"
      ) {
        lines.push(`${key}: ${(value as Record<string, unknown>).status}`)
        continue
      }
      if (
        "ok" in (value as Record<string, unknown>) &&
        typeof (value as Record<string, unknown>).ok === "boolean"
      ) {
        lines.push(`${key}: ${(value as Record<string, unknown>).ok ? "ok" : "issue"}`)
        continue
      }
    }
    lines.push(`${key}: ${summarizeValue(value)}`)
  }

  return lines.length > 0 ? lines : ["JSON payload received"]
}

function summarizeValue(value: unknown): string {
  if (value === null || value === undefined) return "null"
  if (typeof value === "string") return value.slice(0, 80)
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }
  return JSON.stringify(value).slice(0, 80)
}

function extractLogLines(payload: unknown): string[] {
  if (typeof payload !== "string") {
    return ["Logs endpoint did not return text"]
  }
  const lines = payload.split("\n").filter(Boolean)
  return lines.length > 0
    ? lines.slice(0, 3).map((line) => line.slice(0, 120))
    : ["No log lines returned"]
}

function extractSseMetrics(metrics: unknown): MetricsExtraction {
  if (!metrics || typeof metrics !== "object") {
    return { ok: false, details: ["Metrics payload missing"] }
  }

  const candidate =
    (metrics as Record<string, unknown>).streams ||
    (metrics as Record<string, unknown>).sse ||
    (metrics as Record<string, unknown>).sse_progress

  if (!candidate || typeof candidate !== "object") {
    return { ok: false, details: ["No SSE stream metrics present"] }
  }

  const data = candidate as Record<string, unknown>
  const active = pickNumber(data, ["active", "connections", "current"])
  const authFailures = pickNumber(data, ["auth_failures", "auth", "unauthorized"])
  const heartbeatsMissed = pickNumber(data, ["heartbeats_missed", "missed", "dropped"])

  const details: string[] = []
  if (typeof active === "number") details.push(`Active streams: ${active}`)
  if (typeof authFailures === "number") details.push(`Auth failures: ${authFailures}`)
  if (typeof heartbeatsMissed === "number")
    details.push(`Heartbeat misses: ${heartbeatsMissed}`)

  return {
    ok: typeof active === "number" ? active > 0 : true,
    details: details.length > 0 ? details : ["Streams metrics available"],
    badgeLabel: typeof active === "number" && active === 0 ? "No streams" : undefined,
    badgeVariant:
      typeof active === "number" && active === 0 ? "destructive" : undefined,
  }
}

function lookupMetricsEntry(
  metrics: unknown,
  method: EndpointMethod,
  path: string
): Record<string, unknown> | undefined {
  if (!metrics || typeof metrics !== "object") return undefined

  const candidates: Array<Record<string, unknown>> = []
  const metricsObj = metrics as Record<string, unknown>

  const perPathContainers = [
    metricsObj.per_path,
    metricsObj.paths,
    metricsObj.endpoints,
  ]
    .filter((value): value is Record<string, unknown> =>
      Boolean(value && typeof value === "object")
    )

  candidates.push(...perPathContainers)
  candidates.push(metricsObj)

  const keys = [
    `${method} ${path}`,
    `${method}:${path}`,
    path,
    path.startsWith("/") ? path.slice(1) : path,
  ]

  for (const container of candidates) {
    for (const key of keys) {
      const entry = container[key]
      if (entry && typeof entry === "object") {
        return entry as Record<string, unknown>
      }
    }
  }

  return undefined
}

function formatMetricDetails(entry: Record<string, unknown>) {
  const details: string[] = []
  const requests = pickNumber(entry, ["count", "requests", "total", "hits"])
  const errors = pickNumber(entry, ["errors", "error_count"])
  const errorRate = pickNumber(entry, ["error_rate", "errorRate"])
  const p95 = pickNumber(entry, ["p95", "p95_ms", "latency_p95"]) ??
    pickNumber(entry.latency_ms as Record<string, unknown>, ["p95"])

  if (typeof requests === "number") {
    details.push(`Requests: ${requests.toLocaleString()}`)
  }

  if (typeof errors === "number") {
    details.push(`Errors: ${errors.toLocaleString()}`)
  }

  if (typeof errorRate === "number") {
    details.push(`Error rate: ${(errorRate * 100).toFixed(2)}%`)
  }

  if (typeof p95 === "number") {
    details.push(`p95 latency: ${Math.round(p95)} ms`)
  }

  if (details.length === 0) {
    details.push(JSON.stringify(entry).slice(0, 120))
  }

  const ok =
    (typeof errorRate === "number" && errorRate < 0.05) ||
    (typeof errors === "number" && typeof requests === "number"
      ? errors / Math.max(1, requests) < 0.05
      : true)

  return { ok, details }
}

function pickNumber(
  source: Record<string, unknown> | undefined,
  keys: string[]
): number | undefined {
  if (!source) return undefined
  for (const key of keys) {
    const value = source[key]
    if (typeof value === "number") {
      return value
    }
  }
  return undefined
}

function formatTimestamp(date: Date) {
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

function getRawDataFor(
  id: string,
  probeResults: Array<{ status: EndpointStatus; rawData?: unknown }>
) {
  return probeResults.find(({ status }) => status.id === id)?.rawData
}

function resolveBaseUrl(headerList: Awaited<ReturnType<typeof headers>>) {
  const explicit = process.env.MCP_BASE_URL ?? process.env.NEXT_PUBLIC_MCP_BASE_URL
  if (explicit) {
    return explicit.endsWith("/") ? explicit : `${explicit}`
  }
  const host =
    headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000"
  const protocol = headerList.get("x-forwarded-proto") ?? "http"
  return `${protocol}://${host}`
}
