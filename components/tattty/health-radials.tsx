"use client"

import {
  RadialBar,
  RadialBarChart,
  PolarAngleAxis,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { StatusSummary } from "@/components/tattty/types"

const healthChartConfig = {
  healthy: { label: "Healthy", color: "hsl(var(--chart-1))" },
  degraded: { label: "Degraded", color: "hsl(var(--chart-2))" },
  failing: { label: "Failing", color: "hsl(var(--chart-3))" },
}

const latencyChartConfig = {
  fast: { label: "< 400 ms", color: "hsl(var(--chart-4))" },
  steady: { label: "400-1200 ms", color: "hsl(var(--chart-5))" },
  slow: { label: "> 1200 ms", color: "hsl(var(--chart-6))" },
}

type Props = {
  summary: StatusSummary
}

export function HealthRadials({ summary }: Props) {
  const healthyPercent = summary.total ? (summary.healthy / summary.total) * 100 : 0

  if (summary.total === 0) {
    return (
      <div className="flex h-72 flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
        <p>No endpoints responded yet.</p>
        <p>As soon as the live probes return data, radial telemetry will unlock automatically.</p>
      </div>
    )
  }

  const healthDataset = summary.healthMix.map((slice) => ({
    ...slice,
    fill: `var(--color-${slice.key})`,
  }))

  const latencyDataset = summary.latencyBuckets.map((slice) => ({
    ...slice,
    fill: `var(--color-${slice.key})`,
  }))

  const formatPct = (value: number) => `${value.toFixed(1)}%`

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-wide">Availability mix</p>
          <p className="text-3xl font-semibold">{formatPct(healthyPercent)} uptime live</p>
          <p className="text-sm text-muted-foreground">{summary.total} probes reporting</p>
        </div>
        <ChartContainer config={healthChartConfig} className="max-h-[260px]">
          <RadialBarChart
            data={healthDataset}
            innerRadius="30%"
            outerRadius="90%"
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar
              dataKey="value"
              background
              cornerRadius={999}
              isAnimationActive={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent labelFormatter={() => "Status"} />}
            />
          </RadialBarChart>
        </ChartContainer>
        <dl className="grid gap-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Healthy</span>
            <span className="font-mono">{formatPct(healthDataset[0]?.value ?? 0)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Degraded</span>
            <span className="font-mono">{formatPct(healthDataset[1]?.value ?? 0)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Failing</span>
            <span className="font-mono">{formatPct(healthDataset[2]?.value ?? 0)}</span>
          </div>
        </dl>
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-wide">Latency envelope</p>
          <p className="text-3xl font-semibold">
            {summary.avgLatency !== null ? `${Math.round(summary.avgLatency)} ms` : "–"}
          </p>
          <p className="text-sm text-muted-foreground">
            Avg latency across {summary.sampleSize} samples • P95 {summary.p95Latency ? `${Math.round(summary.p95Latency)} ms` : "–"}
          </p>
        </div>
        <ChartContainer config={latencyChartConfig} className="max-h-[260px]">
          <RadialBarChart
            data={latencyDataset}
            innerRadius="20%"
            outerRadius="90%"
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar
              dataKey="value"
              background
              cornerRadius={999}
              isAnimationActive={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent labelFormatter={() => "Latency"} />}
            />
          </RadialBarChart>
        </ChartContainer>
        <dl className="grid gap-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Fast (&lt; 400 ms)</span>
            <span className="font-mono">{formatPct(latencyDataset[0]?.value ?? 0)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Nominal (400-1200 ms)</span>
            <span className="font-mono">{formatPct(latencyDataset[1]?.value ?? 0)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Slow (&gt; 1200 ms)</span>
            <span className="font-mono">{formatPct(latencyDataset[2]?.value ?? 0)}</span>
          </div>
        </dl>
      </div>
    </div>
  )
}
