"use client"

import { useMemo, useState } from "react"
import { IconDatabase, IconDownload, IconRefresh } from "@tabler/icons-react"

import Ai02 from "@/components/ai-02"
import {
  DataPreview,
  type DataPreviewDataset,
} from "@/components/data-preview"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"

type SubmitPayload = {
  prompt: string
  model: string
}

const PRESET_PROMPTS = [
  {
    icon: IconDatabase,
    text: "Generate sales leads",
    prompt:
      "Create a dataset of 15 construction leads including company name, contact, project size, and estimated close date.",
  },
  {
    icon: IconDatabase,
    text: "Pricing scenarios",
    prompt:
      "Build a pricing comparison table for three bid packages showing labor, materials, and margin columns.",
  },
  {
    icon: IconDatabase,
    text: "Project timeline",
    prompt:
      "Produce a phased project plan with phase name, owner, start date, end date, and critical tasks.",
  },
]

export default function AskBridgitAIPage() {
  const [dataset, setDataset] = useState<DataPreviewDataset | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lastPrompt, setLastPrompt] = useState<SubmitPayload | null>(null)

  const handleSubmit = async ({ prompt, model }: SubmitPayload) => {
    setIsLoading(true)
    setLastPrompt({ prompt, model })

    await new Promise((resolve) => setTimeout(resolve, 600))

    setDataset(generatePreview(prompt))
    setIsLoading(false)
  }

  const activeSummary = useMemo(() => {
    if (!dataset || !lastPrompt) {
      return null
    }

    return {
      model: lastPrompt.model,
      rows: dataset.rows.length,
      columns: dataset.columns.length,
    }
  }, [dataset, lastPrompt])

  const handleReset = () => {
    setDataset(null)
    setLastPrompt(null)
  }

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <Card>
        <CardHeader className="gap-3">
          <CardTitle>Ask Bridgit AI</CardTitle>
          <CardDescription>
            Describe the data you need and Bridgit AI will build it on-the-fly.
            Nothing is stored—switching pages clears the workspace automatically.
          </CardDescription>
          {activeSummary ? (
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">Model: {activeSummary.model}</Badge>
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
          <DataPreview dataset={dataset} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  )
}

function generatePreview(prompt: string): DataPreviewDataset {
  const baseColumns = ["ID", "Title", "Owner", "Status", "Value"]
  const seed = prompt.length || 5

  const rows = Array.from({ length: Math.min(10, Math.max(5, seed % 10 || 6)) }, (_, index) => {
    const id = index + 1
    const owner = `Owner ${((index + seed) % 5) + 1}`
    const statusPool = ["Planned", "Active", "Blocked", "Complete"]
    const status = statusPool[(index + seed) % statusPool.length]

    return {
      ID: id,
      Title: `${prompt.split(" ").slice(0, 3).join(" ") || "Dataset"} #${id}`,
      Owner: owner,
      Status: status,
      Value: `$${((seed + index) * 173) % 100000}`,
    }
  })

  return {
    columns: baseColumns,
    rows,
  }
}
