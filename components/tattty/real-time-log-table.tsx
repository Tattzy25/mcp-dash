"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const LEVEL_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  INFO: "secondary",
  DEBUG: "outline",
  WARN: "default",
  WARNING: "default",
  ERROR: "destructive",
  FATAL: "destructive",
}

type LogRow = {
  id: string
  timestamp: string
  level: string
  message: string
}

export function RealTimeLogTable() {
  const [rows, setRows] = useState<LogRow[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const isPollingRef = useRef(false)

  useEffect(() => {
    let isMounted = true

    const pullLogs = async () => {
      if (isPollingRef.current) return
      isPollingRef.current = true
      try {
        const response = await fetch("/api/tattty/logs", { cache: "no-store" })
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        const data = (await response.json()) as { lines?: string[] }
        if (!isMounted) return
        const parsed = (data.lines ?? []).map(parseLine).filter(Boolean) as LogRow[]
        if (parsed.length > 0) {
          setRows(parsed.slice(0, 50))
          setLastUpdated(new Date())
        }
        setError(null)
      } catch (err) {
        if (!isMounted) return
        setError(err instanceof Error ? err.message : "Failed to stream logs")
      } finally {
        isPollingRef.current = false
      }
    }

    pullLogs()
    const interval = setInterval(pullLogs, 4000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  const view = useMemo(() => rows.slice(0, 20), [rows])

  if (error) {
    return (
      <div className="flex h-56 flex-col items-center justify-center gap-2 text-center text-sm text-destructive">
        <p>Real-time logging unavailable</p>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  if (view.length === 0) {
    return (
      <div className="flex h-56 flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
        <span>Waiting for live log frames…</span>
        <span>Write traffic to the MCP service to watch entries stream in.</span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Live tail • updates every 4s</span>
        <span>{lastUpdated ? lastUpdated.toLocaleTimeString() : ""}</span>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Timestamp</TableHead>
              <TableHead className="w-20">Level</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {view.map((row) => (
              <TableRow key={row.id} className="text-xs">
                <TableCell className="font-mono">{row.timestamp}</TableCell>
                <TableCell>
                  <Badge variant={LEVEL_VARIANTS[row.level] ?? "secondary"}>{row.level}</Badge>
                </TableCell>
                <TableCell className="font-mono text-[11px]">
                  {row.message}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function parseLine(line: string, index: number): LogRow {
  const timestampMatch = line.match(
    /\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?/
  )
  const levelMatch = line.match(/\b(DEBUG|INFO|WARN|WARNING|ERROR|FATAL|TRACE)\b/)
  const timestamp = timestampMatch ? timestampMatch[0] : new Date().toISOString()
  const level = levelMatch ? levelMatch[0].replace("TRACE", "DEBUG") : "INFO"
  const messageStart = levelMatch ? line.indexOf(levelMatch[0]) + levelMatch[0].length : 0
  const message = line.slice(messageStart).trim() || line.trim()

  return {
    id: `${timestamp}-${index}`,
    timestamp,
    level,
    message,
  }
}
