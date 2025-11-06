"use client"

import { useMemo, useState } from "react"
import { IconDatabase, IconDownload, IconRefresh } from "@tabler/icons-react"

import Ai02 from "@/components/ai-02"
import {
  DataPreview,
  type DataPreviewDataset,
} from "@/components/data-preview"
import type { EditableDataset } from "@/components/editable-data-grid"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"

type SubmitPayload = {
  prompt: string
  creativity: string
}

const PRESET_PROMPTS = [
  {
    icon: IconDatabase,
    text: "Customer data",
    prompt:
      "Generate a customer database with name, email, phone, company, and location fields",
  },
  {
    icon: IconDatabase,
    text: "Sales pipeline",
    prompt:
      "Create a sales pipeline dataset with deal name, amount, stage, close date, and owner",
  },
  {
    icon: IconDatabase,
    text: "Product inventory",
    prompt:
      "Build a product inventory with SKU, name, category, price, stock quantity, and supplier",
  },
]

export default function AskBridgitAIPage() {
  const [dataset, setDataset] = useState<DataPreviewDataset | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lastPrompt, setLastPrompt] = useState<SubmitPayload | null>(null)

  const handleSubmit = async ({ prompt, creativity }: SubmitPayload) => {
    setIsLoading(true)
    setLastPrompt({ prompt, creativity })

    // TODO: Connect to backend API here
    // For now, show placeholder data structure
    await new Promise((resolve) => setTimeout(resolve, 600))

    // Placeholder: Empty dataset ready for backend integration
    setDataset({
      columns: ["Column 1", "Column 2", "Column 3"],
      rows: [
        { "Column 1": "", "Column 2": "", "Column 3": "" },
        { "Column 1": "", "Column 2": "", "Column 3": "" },
        { "Column 1": "", "Column 2": "", "Column 3": "" },
      ],
    })
    setIsLoading(false)
  }

  const activeSummary = useMemo(() => {
    if (!dataset || !lastPrompt) {
      return null
    }

    return {
      creativity: lastPrompt.creativity,
      rows: dataset.rows.length,
      columns: dataset.columns.length,
    }
  }, [dataset, lastPrompt])

  const handleReset = () => {
    setDataset(null)
    setLastPrompt(null)
  }

  const handleDatasetChange = (updatedDataset: EditableDataset) => {
    setDataset({
      columns: updatedDataset.columns,
      rows: updatedDataset.rows,
    })
  }

  return (
    <div className="flex flex-col gap-8 px-4 lg:px-6 py-8">
      {/* Hero Section */}
      <div className="flex flex-col gap-4 max-w-4xl">
        <h1 className="text-6xl font-bold tracking-tight">
          Generate Data with AI
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Describe what you need and watch Bridgit AI build your dataset instantly. 
          No setup, no hassle—just intelligent data generation powered by AI.
        </p>
      </div>

      <Card>
        <CardHeader className="gap-3">
          <CardTitle>Ask Bridgit AI</CardTitle>
          <CardDescription>
            Describe the data you need and Bridgit AI will build it on-the-fly.
            Nothing is stored—switching pages clears the workspace automatically.
          </CardDescription>
          {activeSummary ? (
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">Creativity: {activeSummary.creativity}</Badge>
              <span>{activeSummary.columns} columns</span>
              <span>{activeSummary.rows} rows</span>
            </div>
          ) : null}
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <Ai02
            prompts={PRESET_PROMPTS}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            placeholder="Ask Bridgit AI for the dataset you need..."
          />
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={isLoading || !dataset}
            >
              <IconRefresh className="mr-2 h-4 w-4" />
              Clear workspace
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!dataset || isLoading}
            >
              <IconDownload className="mr-2 h-4 w-4" />
              Export (coming soon)
            </Button>
            {isLoading ? (
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner className="size-3" /> Generating preview...
              </span>
            ) : null}
          </div>
          <DataPreview dataset={dataset} onDatasetChange={handleDatasetChange} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  )
}
