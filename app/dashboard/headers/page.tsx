"use client"

import { FormEvent, useMemo, useState } from "react"
import { IconPlus, IconTrash } from "@tabler/icons-react"

import {
  DataPreview,
  type DataPreviewDataset,
} from "@/components/data-preview"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"

export default function HeadersPage() {
  const [headers, setHeaders] = useState<string[]>(["Project Name", "Owner", "Due Date"])
  const [newHeader, setNewHeader] = useState("")
  const [rowCount, setRowCount] = useState(5)
  const [dataset, setDataset] = useState<DataPreviewDataset | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const hasHeaders = headers.length > 0

  const handleAddHeader = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const value = newHeader.trim()
    if (!value) {
      return
    }

    setHeaders((prev) => (prev.includes(value) ? prev : [...prev, value]))
    setNewHeader("")
  }

  const handleRemoveHeader = (value: string) => {
    setHeaders((prev) => prev.filter((header) => header !== value))
  }

  const handleGenerate = async () => {
    if (!hasHeaders) {
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setDataset(generateHeaderDataset(headers, rowCount))
    setIsLoading(false)
  }

  const summary = useMemo(() => {
    if (!dataset) {
      return null
    }

    return {
      columns: dataset.columns.length,
      rows: dataset.rows.length,
    }
  }, [dataset])

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <Card>
        <CardHeader className="gap-2">
          <CardTitle>Headers</CardTitle>
          <CardDescription>
            Define the columns you need. Bridgit AI fills the grid instantly and
            nothing is saved once you navigate away.
          </CardDescription>
          {summary ? (
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>{summary.columns} headers</span>
              <span>{summary.rows} rows</span>
            </div>
          ) : null}
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <form
            onSubmit={handleAddHeader}
            className="flex flex-col gap-3 rounded-lg border border-dashed p-4"
          >
            <div className="flex flex-col gap-1">
              <Label htmlFor="new-header">Add a header</Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  id="new-header"
                  value={newHeader}
                  onChange={(event) => setNewHeader(event.target.value)}
                  placeholder="e.g. Budget"
                />
                <Button type="submit" className="sm:w-auto" disabled={!newHeader.trim()}>
                  <IconPlus className="mr-2 h-4 w-4" />
                  Add header
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Current headers</Label>
              {hasHeaders ? (
                <div className="flex flex-wrap gap-2">
                  {headers.map((header) => (
                    <Badge key={header} variant="secondary" className="flex items-center gap-1.5">
                      {header}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-6 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveHeader(header)}
                        aria-label={`Remove ${header}`}
                      >
                        <IconTrash className="h-3.5 w-3.5" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  You have not added any headers yet.
                </p>
              )}
            </div>

            <div className="grid gap-2 sm:grid-cols-[200px_auto] sm:items-center">
              <Label htmlFor="row-count">Rows to generate</Label>
              <Input
                id="row-count"
                type="number"
                min={1}
                max={50}
                value={rowCount}
                onChange={(event) => setRowCount(Number(event.target.value) || 1)}
              />
            </div>
          </form>

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={handleGenerate} disabled={!hasHeaders || isLoading}>
              Generate with Bridgit AI
            </Button>
            <Button variant="outline" size="sm" onClick={() => setDataset(null)} disabled={!dataset}>
              Clear grid
            </Button>
            {isLoading ? (
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner className="size-3" /> Generating...
              </span>
            ) : null}
          </div>

          <DataPreview dataset={dataset} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  )
}

function generateHeaderDataset(headers: string[], rows: number): DataPreviewDataset {
  const safeRows = Math.max(1, Math.min(rows, 50))

  const dataRows = Array.from({ length: safeRows }, (_, index) => {
    return headers.reduce<Record<string, string>>((acc, header, headerIndex) => {
      acc[header] = `${header} value ${(index + 1) * (headerIndex + 1)}`
      return acc
    }, {})
  })

  return {
    columns: headers,
    rows: dataRows,
  }
}
