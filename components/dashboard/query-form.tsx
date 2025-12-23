"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { submitQuery } from "@/app/actions/query-actions"

interface QueryFormProps {
  userId: string
  currentCredits: number
}

export function QueryForm({ userId, currentCredits }: QueryFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    query: "",
    location: "",
    numLeads: "10",
    email: "",
  })
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (currentCredits < 1) {
      toast({
        title: "Insufficient credits",
        description: "You need at least 1 credit to run a query. Please upgrade your plan.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await submitQuery({
        userId,
        query: formData.query,
        location: formData.location,
        numLeads: Number.parseInt(formData.numLeads) || 10,
        email: formData.email,
      })

      if (result.success) {
        toast({
          title: "Query submitted",
          description: "Your lead generation query is being processed",
        })
        setFormData({
          query: "",
          location: "",
          numLeads: "10",
          email: "",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to submit query",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Query</CardTitle>
        <CardDescription>Enter your search criteria to generate leads. Each query costs 1 credit.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="query">
              Query <span className="text-destructive">*</span>
            </Label>
            <Input
              id="query"
              name="query"
              placeholder="e.g., Marketing managers in SaaS companies"
              value={formData.query}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">
                Location <span className="text-destructive">*</span>
              </Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g., San Francisco, CA"
                value={formData.location}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numLeads">
                Number of Leads <span className="text-destructive">*</span>
              </Label>
              <Input
                id="numLeads"
                name="numLeads"
                type="number"
                min="1"
                max="100"
                placeholder="10"
                value={formData.numLeads}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">{currentCredits}</span> credits remaining
            </div>
            <Button type="submit" disabled={isLoading || currentCredits < 1}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Generate Leads"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
