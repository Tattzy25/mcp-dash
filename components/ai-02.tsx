"use client"

import { useRef, useState } from "react"
import {
  IconAlertTriangle,
  IconArrowUp,
  IconCloud,
  IconFileSpark,
  IconGauge,
  IconPhotoScan,
  type Icon,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type PromptOption = {
  icon: Icon
  text: string
  prompt: string
}

type ModelOption = {
  value: string
  name: string
  description: string
  max?: boolean
}

const PROMPTS: PromptOption[] = [
  {
    icon: IconFileSpark,
    text: "Write documentation",
    prompt:
      "Write comprehensive documentation for this codebase, including setup instructions, API references, and usage examples.",
  },
  {
    icon: IconGauge,
    text: "Optimize performance",
    prompt:
      "Analyze the codebase for performance bottlenecks and suggest optimizations to improve loading times and runtime efficiency.",
  },
  {
    icon: IconAlertTriangle,
    text: "Find and fix 3 bugs",
    prompt:
      "Scan through the codebase to identify and fix 3 critical bugs, providing detailed explanations for each fix.",
  },
]

const MODELS: ModelOption[] = [
  {
    value: "gpt-5",
    name: "GPT-5",
    description: "Most advanced model",
    max: true,
  },
  {
    value: "gpt-4o",
    name: "GPT-4o",
    description: "Fast and capable",
  },
  {
    value: "gpt-4",
    name: "GPT-4",
    description: "Reliable and accurate",
  },
  {
    value: "claude-3.5",
    name: "Claude 3.5 Sonnet",
    description: "Great for coding tasks",
  },
]

type Ai02Props = {
  onSubmit?: (payload: { prompt: string; model: string }) => void
  isLoading?: boolean
  placeholder?: string
  prompts?: PromptOption[]
  models?: ModelOption[]
}

export default function Ai02({
  onSubmit,
  isLoading = false,
  placeholder = "Ask anything",
  prompts = PROMPTS,
  models = MODELS,
}: Ai02Props) {
  const [inputValue, setInputValue] = useState("")
  const [selectedModel, setSelectedModel] = useState(models[0])
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handlePromptClick = (prompt: string) => {
    if (inputRef.current) {
      inputRef.current.value = prompt
      setInputValue(prompt)
      inputRef.current.focus()
    }
  }

  const handleModelChange = (value: string) => {
    const model = models.find((m) => m.value === value)
    if (model) {
      setSelectedModel(model)
    }
  }

  const handleSubmit = () => {
    if (!inputValue.trim()) {
      return
    }

    onSubmit?.({ prompt: inputValue.trim(), model: selectedModel.value })
    setInputValue("")
  }

  const renderMaxBadge = () => (
    <div className="flex h-[14px] items-center gap-1.5 rounded border border-border px-1 py-0">
      <span className="bg-gradient-to-r from-[#81a1c1] to-[#7d7c9b] bg-clip-text text-[9px] font-bold uppercase text-transparent">
        MAX
      </span>
    </div>
  )

  return (
    <div className="flex w-[calc(42rem-5rem)] flex-col gap-4">
      <div className="flex min-h-[120px] flex-col rounded-2xl cursor-text bg-card border border-border shadow-lg">
        <div className="flex-1 relative overflow-y-auto max-h-[258px]">
          <Textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className="w-full border-0 p-3 transition-[padding] duration-200 ease-in-out min-h-[48.4px] outline-none text-[16px] text-foreground resize-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent! whitespace-pre-wrap break-words"
          />
        </div>

        <div className="flex min-h-[40px] items-center gap-2 p-2 pb-1">
          <div className="flex aspect-1 items-center gap-1 rounded-full bg-muted p-1.5 text-xs">
            <IconCloud className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="relative flex items-center">
            <Select
              value={selectedModel.value}
              onValueChange={handleModelChange}
            >
              <SelectTrigger className="w-fit border-none bg-transparent! p-0 text-sm text-muted-foreground hover:text-foreground focus:ring-0 shadow-none">
                <SelectValue>
                  {selectedModel.max ? (
                    <div className="flex items-center gap-1">
                      <span>{selectedModel.name}</span>
                      {renderMaxBadge()}
                    </div>
                  ) : (
                    <span>{selectedModel.name}</span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.max ? (
                      <div className="flex items-center gap-1">
                        <span>{model.name}</span>
                        {renderMaxBadge()}
                      </div>
                    ) : (
                      <span>{model.name}</span>
                    )}
                    <span className="text-muted-foreground block text-xs">
                      {model.description}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground transition-all duration-100"
              title="Attach images"
            >
              <IconPhotoScan className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-6 w-6 rounded-full transition-all duration-100 cursor-pointer bg-primary",
                inputValue && "bg-primary hover:bg-primary/90!"
              )}
              disabled={!inputValue.trim() || isLoading}
              onClick={handleSubmit}
            >
              <IconArrowUp className="h-4 w-4 text-primary-foreground" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {prompts.map((button) => {
          const IconComponent = button.icon
          return (
            <Button
              key={button.text}
              variant="ghost"
              className="group flex items-center gap-2 rounded-full border px-3 py-2 text-sm text-foreground transition-all duration-200 hover:bg-muted/30 h-auto bg-transparent dark:bg-muted"
              onClick={() => handlePromptClick(button.prompt)}
            >
              <IconComponent className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
              <span>{button.text}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}

