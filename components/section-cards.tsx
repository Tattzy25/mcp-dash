import { IconActivity, IconServer, IconDatabase, IconClock } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type HealthStatus = {
  status: string
  uptime?: number
  timestamp?: string
}

type MetricsData = {
  totalRequests?: number
  errorRate?: number
  avgLatency?: number
  activeConnections?: number
  [key: string]: unknown
}

async function fetchHealthData(): Promise<HealthStatus | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/health`, {
      cache: "no-store",
      next: { revalidate: 0 },
    })
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error("Failed to fetch health data:", error)
  }
  return null
}

async function fetchMetrics(): Promise<MetricsData | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/metrics`, {
      cache: "no-store",
      next: { revalidate: 0 },
    })
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error("Failed to fetch metrics:", error)
  }
  return null
}

export async function SectionCards() {
  const healthData = await fetchHealthData()
  const metricsData = await fetchMetrics()

  // Extract relevant metrics
  const isHealthy = healthData?.status === "ok" || healthData?.status === "healthy"
  const uptime = healthData?.uptime || 0
  const uptimeHours = Math.floor(uptime / 3600)
  
  // Parse metrics data with type safety
  const totalRequests = typeof metricsData?.totalRequests === 'number' 
    ? metricsData.totalRequests 
    : (typeof metricsData?.total_requests === 'number' ? metricsData.total_requests : 0)
  const errorRate = typeof metricsData?.errorRate === 'number'
    ? metricsData.errorRate
    : (typeof metricsData?.error_rate === 'number' ? metricsData.error_rate : 0)
  const avgLatency = typeof metricsData?.avgLatency === 'number'
    ? metricsData.avgLatency
    : (typeof metricsData?.avg_latency === 'number' 
      ? metricsData.avg_latency 
      : (typeof metricsData?.latency_ms === 'number' ? metricsData.latency_ms : 0))
  const activeConnections = typeof metricsData?.activeConnections === 'number'
    ? metricsData.activeConnections
    : (typeof metricsData?.active_connections === 'number' ? metricsData.active_connections : 0)

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>System Health</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isHealthy ? "Healthy" : "Degraded"}
          </CardTitle>
          <CardAction>
            <Badge variant={isHealthy ? "outline" : "destructive"}>
              <IconActivity />
              {isHealthy ? "Online" : "Issues"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {isHealthy ? "All systems operational" : "System degraded"} <IconActivity className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Uptime: {uptimeHours > 0 ? `${uptimeHours}h` : "N/A"}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Requests</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalRequests.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconServer />
              {totalRequests > 0 ? "Active" : "Idle"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Processing requests <IconServer className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Error rate: {(errorRate * 100).toFixed(2)}%
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Connections</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {activeConnections.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconDatabase />
              {activeConnections > 0 ? "+Live" : "Idle"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {activeConnections > 0 ? "Users connected" : "No active users"} <IconDatabase className="size-4" />
          </div>
          <div className="text-muted-foreground">Real-time connections</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Avg Response Time</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {Math.round(avgLatency)}ms
          </CardTitle>
          <CardAction>
            <Badge variant={avgLatency < 500 ? "outline" : "destructive"}>
              <IconClock />
              {avgLatency < 500 ? "Fast" : "Slow"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {avgLatency < 500 ? "Performance optimal" : "High latency"} <IconClock className="size-4" />
          </div>
          <div className="text-muted-foreground">Response time tracking</div>
        </CardFooter>
      </Card>
    </div>
  )
}
