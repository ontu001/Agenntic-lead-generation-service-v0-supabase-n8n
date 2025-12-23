import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { MapPin, Hash, Search } from "lucide-react"

interface Query {
  id: string
  query: string
  location: string
  num_leads: number
  status: string
  created_at: string
}

interface QueryDetailsProps {
  query: Query
  resultCount: number
}

export function QueryDetails({ query, resultCount }: QueryDetailsProps) {
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
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl mb-2">{query.query}</CardTitle>
            <CardDescription>Query ID: {query.id}</CardDescription>
          </div>
          <Badge variant={getStatusVariant(query.status) as any} className="capitalize">
            {query.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase">Search Criteria</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Search className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Query</p>
                  <p className="text-sm text-muted-foreground">{query.query}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{query.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Hash className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Requested Leads</p>
                  <p className="text-sm text-muted-foreground">{query.num_leads}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase">Query Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-muted-foreground">{format(new Date(query.created_at), "PPpp")}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-sm text-muted-foreground capitalize">{query.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Results Found</p>
                <p className="text-sm text-muted-foreground">{resultCount} leads</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
