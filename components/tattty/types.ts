export type SummarySlice = {
  key: string
  label: string
  value: number
}

export type StatusSummary = {
  total: number
  healthy: number
  degraded: number
  failing: number
  avgLatency: number | null
  p95Latency: number | null
  maxLatency: number | null
  sampleSize: number
  healthMix: SummarySlice[]
  latencyBuckets: SummarySlice[]
}
