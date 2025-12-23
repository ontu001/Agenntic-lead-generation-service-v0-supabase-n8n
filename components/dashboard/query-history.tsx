"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { format } from "date-fns"
import { Clock, CheckCircle2, XCircle, Loader2, ExternalLink } from "lucide-react"

interface Query {
  id: string
  query: string
  location: string
  num_leads: number
  status: string
  created_at: string
  results?: { count: number }[]
}

interface QueryHistoryProps {
  queries: Query[]
}

export function QueryHistory({ queries }: QueryHistoryProps) {
  if (queries.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No queries yet</p>
            <Button asChild>
              <Link href="/dashboard">Create your first query</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />
      case "failed":
        return <XCircle className="h-4 w-4" />
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "failed":
        return "destructive"
      case "processing":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-4">
      {queries.map((query) => {
        const resultCount = query.results?.[0]?.count || 0

        return (
          <Card key={query.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-xl">{query.query}</CardTitle>
                  <CardDescription className="flex items-center gap-2 flex-wrap">
                    <span>{query.location}</span>
                    <span>•</span>
                    <span>{query.num_leads} leads requested</span>
                  </CardDescription>
                </div>
                <Badge variant={getStatusVariant(query.status) as any} className="capitalize flex items-center gap-1">
                  {getStatusIcon(query.status)}
                  {query.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <span className="font-medium">Created:</span> {format(new Date(query.created_at), "PPp")}
                  </p>
                  {query.status === "completed" && (
                    <p>
                      <span className="font-medium">Results:</span> {resultCount} leads found
                    </p>
                  )}
                </div>
                {query.status === "completed" && (
                  <Button asChild variant="outline" className="bg-transparent">
                    <Link href={`/dashboard/queries/${query.id}`}>
                      View Results
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
