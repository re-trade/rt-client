"use client"
import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Command as CommandPrimitive } from "cmdk"
import { useEffect, useCallback, useRef, useMemo } from "react"
import { getAllCategories } from "@/service/categories.api"

type Framework = Record<"value" | "label", string>

interface Props {
  onChange: (selected: string[]) => void
  value?: string[]
  currentCategoryId?: {
    id: string
    name: string
  }[]
}

export function FancyMultiSelect({ onChange, value: initialValue = [], currentCategoryId }: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<Framework[]>([])
  const [inputValue, setInputValue] = React.useState("")
  const [categories, setCategories] = React.useState<Framework[]>([])
  const [loading, setLoading] = React.useState(false)

  // Track if we've initialized to prevent multiple calls
  const hasInitialized = useRef(false)
  const lastNotifiedValues = useRef<string[]>([])

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      try {
        const categoriesData = await getAllCategories()
        const transformedCategories = categoriesData.map((category: any) => ({
          value: category.id || category.value,
          label: category.name || category.label,
        }))
        setCategories(transformedCategories)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Memoize the initial selected values to prevent unnecessary re-calculations
  const initialSelectedValues = useMemo(() => {
    if (currentCategoryId && currentCategoryId.length > 0) {
      return currentCategoryId.map((item) => item.id)
    }
    return initialValue
  }, [currentCategoryId, initialValue])

  // Initialize selected items only once when categories are loaded
  useEffect(() => {
    if (categories.length === 0 || hasInitialized.current) return

    const initialSelected = categories.filter((cat) => initialSelectedValues.includes(cat.value))

    setSelected(initialSelected)
    hasInitialized.current = true

    // Set initial lastNotifiedValues to prevent immediate onChange call
    lastNotifiedValues.current = initialSelected.map((item) => item.value)
  }, [categories, initialSelectedValues])

  // Helper function to check if arrays are equal
  const arraysEqual = (a: string[], b: string[]) => {
    if (a.length !== b.length) return false
    return a.every((val, index) => val === b[index])
  }

  // Notify parent of changes only when values actually change
  const notifyChange = useCallback(
    (newSelected: Framework[]) => {
      const newValues = newSelected.map((item) => item.value)

      if (!arraysEqual(newValues, lastNotifiedValues.current)) {
        lastNotifiedValues.current = newValues
        onChange(newValues)
      }
    },
    [onChange],
  )

  const handleUnselect = useCallback(
    (framework: Framework) => {
      setSelected((prev) => {
        const newSelected = prev.filter((s) => s.value !== framework.value)
        // Use setTimeout to avoid calling during render
        setTimeout(() => notifyChange(newSelected), 0)
        return newSelected
      })
    },
    [notifyChange],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            setSelected((prev) => {
              const newSelected = [...prev]
              newSelected.pop()
              setTimeout(() => notifyChange(newSelected), 0)
              return newSelected
            })
          }
        }
        if (e.key === "Escape") {
          input.blur()
          setOpen(false)
        }
      }
    },
    [notifyChange],
  )

  const handleSelect = useCallback(
    (framework: Framework) => {
      setInputValue("")
      setSelected((prev) => {
        const newSelected = [...prev, framework]
        setTimeout(() => notifyChange(newSelected), 0)
        return newSelected
      })
    },
    [notifyChange],
  )

  const handleInputFocus = useCallback(() => {
    setOpen(true)
  }, [])

  const handleInputBlur = useCallback(() => {
    setTimeout(() => setOpen(false), 200)
  }, [])

  const selectables = useMemo(() => {
    return categories.filter((framework) => !selected.some((s) => s.value === framework.value))
  }, [categories, selected])

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((framework) => {
            return (
              <Badge key={framework.value} variant="secondary">
                {framework.label}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(framework)
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={() => handleUnselect(framework)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )
          })}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            placeholder={loading ? "Loading categories..." : "Select categories..."}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
            disabled={loading}
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && (
          <CommandList>
            {selectables.length > 0 ? (
              <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                <CommandGroup className="h-full overflow-auto max-h-60">
                  {selectables.map((framework) => {
                    return (
                      <CommandItem
                        key={framework.value}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onSelect={() => handleSelect(framework)}
                        className={"cursor-pointer"}
                      >
                        {framework.label}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </div>
            ) : (
              <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                <div className="p-2 text-sm text-muted-foreground text-center">
                  {inputValue ? "No categories found" : "All categories selected"}
                </div>
              </div>
            )}
          </CommandList>
        )}
      </div>
    </Command>
  )
}
