"use client"

import { useMemo, useState } from "react"
import { IconCopy } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export type DataRow = Record<string, string | number | boolean | null | undefined>

export type DataPreviewDataset = {
  columns: string[]
  rows: DataRow[]
}

type DataPreviewProps = {
  dataset?: DataPreviewDataset | null
  isLoading?: boolean
  className?: string
}

const FORMAT_ORDER = [
  { key: "table", label: "Table" },
  { key: "csv", label: "CSV" },
  { key: "json", label: "JSON" },
  { key: "sql", label: "SQL" },
  { key: "neon", label: "Neon SQL" },
  { key: "supabase", label: "Supabase SQL" },
] as const

type FormatKey = (typeof FORMAT_ORDER)[number]["key"]
type CodeFormat = Exclude<FormatKey, "table">

export function DataPreview({ dataset, isLoading = false, className }: DataPreviewProps) {
  const [activeTab, setActiveTab] = useState<FormatKey>("table")

  const formatted = useMemo(() => {
    if (!dataset || dataset.rows.length === 0) {
      return {
        csv: "",
        json: "",
        sql: "",
        neon: "",
        supabase: "",
      }
    }

    const normalisedRows = dataset.rows.map((row) =>
      dataset.columns.reduce<Record<string, string>>((acc, column) => {
        const value = row[column]
        acc[column] = value === null || value === undefined ? "" : String(value)
        return acc
      }, {})
    )

    const csvHeader = dataset.columns.join(",")
    const csvRows = normalisedRows
      .map((row) =>
        dataset.columns
          .map((column) => {
            const cell = row[column] ?? ""
            if (cell.includes(",") || cell.includes("\"") || cell.includes("\n")) {
              return `"${cell.replace(/"/g, '""')}"`
            }
            return cell
          })
          .join(",")
      )
      .join("\n")
    const csv = [csvHeader, csvRows].filter(Boolean).join("\n")

    const json = JSON.stringify(normalisedRows, null, 2)

    const buildSql = (tableName: string) => {
      const columnList = dataset.columns.map((column) => `"${column}"`).join(", ")
      const valuesList = normalisedRows
        .map((row) => {
          const values = dataset.columns
            .map((column) => {
              const cell = row[column] ?? ""
              return `'${cell.replace(/'/g, "''")}'`
            })
            .join(", ")
          return `(${values})`
        })
        .join(",\n  ")

      return `INSERT INTO ${tableName} (${columnList})\nVALUES\n  ${valuesList};`
    }

    return {
      csv,
      json,
      sql: buildSql("generated_data"),
      neon: buildSql("public.generated_data"),
      supabase: buildSql("public.generated_data"),
    }
  }, [dataset])

  const handleCopy = (value: string) => {
    if (!value) {
      return
    }

    if (typeof navigator === "undefined" || !navigator.clipboard) {
      return
    }

    void navigator.clipboard.writeText(value)
  }

  const hasData = !!dataset && dataset.rows.length > 0

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as FormatKey)}
      >
        <TabsList>
          {FORMAT_ORDER.map((format) => (
            <TabsTrigger key={format.key} value={format.key}>
              {format.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {FORMAT_ORDER.map((format) => (
          <TabsContent key={format.key} value={format.key}>
            {isLoading ? (
              <div className="flex flex-col gap-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-8 w-2/3" />
              </div>
            ) : format.key === "table" ? (
              hasData ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      {dataset.columns.map((column) => (
                        <TableHead key={column}>{column}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataset.rows.map((row, index) => (
                      <TableRow key={index}>
                        {dataset.columns.map((column) => (
                          <TableCell key={column}>{String(row[column] ?? "")}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-muted-foreground rounded-lg border border-dashed p-6 text-sm">
                  No data yet. Run a generation to see results here.
                </div>
              )
            ) : (
              (() => {
                const codeKey = format.key as CodeFormat
                const preview = formatted[codeKey]
                return (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Preview
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!hasData}
                        onClick={() => handleCopy(preview ?? "")}
                      >
                        <IconCopy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                    </div>
                    <pre className="bg-muted/40 text-muted-foreground scrollbar-thin max-h-96 overflow-auto rounded-lg border p-4 text-sm">
                      {hasData ? preview : "No data yet"}
                    </pre>
                  </div>
                )
              })()
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
