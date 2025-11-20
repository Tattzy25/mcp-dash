import { ChartAreaInteractiveClient } from "./chart-area-interactive-client"

type MetricsData = {
  per_path?: Record<string, {
    requests?: number
    latency_ms?: number | { avg?: number }
    timestamp?: string
  }>
  [key: string]: unknown
}

async function fetchMetricsHistory(): Promise<{ date: string; requests: number; latency: number }[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/metrics`, {
      cache: "no-store",
      next: { revalidate: 0 },
    })
    
    if (response.ok) {
      const metricsData: MetricsData = await response.json()
      
      // Generate sample data based on metrics - in a real scenario, you'd fetch historical data
      const chartData: { date: string; requests: number; latency: number }[] = []
      const today = new Date()
      
      // Extract current metrics
      let currentRequests = 0
      let currentLatency = 0
      
      if (metricsData.per_path) {
        const paths = Object.values(metricsData.per_path)
        currentRequests = paths.reduce((sum, path) => sum + (path.requests || 0), 0)
        const latencies = paths
          .map(path => {
            const latency = path.latency_ms
            if (typeof latency === 'number') return latency
            if (latency && typeof latency === 'object' && 'avg' in latency) {
              return latency.avg || 0
            }
            return 0
          })
          .filter(l => l > 0)
        currentLatency = latencies.length > 0 
          ? latencies.reduce((sum, l) => sum + l, 0) / latencies.length 
          : 0
      }
      
      // Generate last 90 days with some variation based on current metrics
      for (let i = 89; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        
        // Add some randomness to simulate historical data
        const variance = 0.3
        const requestsValue = Math.max(0, Math.floor(currentRequests * (1 + (Math.random() - 0.5) * variance)))
        const latencyValue = Math.max(0, Math.floor(currentLatency * (1 + (Math.random() - 0.5) * variance)))
        
        chartData.push({
          date: date.toISOString().split('T')[0],
          requests: requestsValue,
          latency: latencyValue,
        })
      }
      
      return chartData
    }
  } catch (error) {
    console.error("Failed to fetch metrics history:", error)
  }
  
  // Return empty data if fetch fails
  return []
}

export async function ChartAreaInteractiveServer() {
  const chartData = await fetchMetricsHistory()
  
  return <ChartAreaInteractiveClient data={chartData} />
}
