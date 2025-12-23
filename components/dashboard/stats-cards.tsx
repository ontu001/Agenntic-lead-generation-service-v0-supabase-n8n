import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, Search, CheckCircle2, Crown } from "lucide-react"

interface StatsCardsProps {
  credits: number
  totalQueries: number
  completedQueries: number
  plan: string
}

export function StatsCards({ credits, totalQueries, completedQueries, plan }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Available Credits</CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{credits}</div>
          <p className="text-xs text-muted-foreground mt-1">Use credits to run queries</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
          <Search className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalQueries}</div>
          <p className="text-xs text-muted-foreground mt-1">All time queries</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedQueries}</div>
          <p className="text-xs text-muted-foreground mt-1">Successfully processed</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
          <Crown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold capitalize">{plan}</div>
          <p className="text-xs text-muted-foreground mt-1">Upgrade for more features</p>
        </CardContent>
      </Card>
    </div>
  )
}
