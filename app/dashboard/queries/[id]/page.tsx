import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { QueryDetails } from "@/components/dashboard/query-details"
import { ResultsTable } from "@/components/dashboard/results-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function QueryDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  // Fetch query details
  const { data: query } = await supabase.from("queries").select("*").eq("id", params.id).eq("user_id", user.id).single()

  if (!query) {
    redirect("/dashboard/queries")
  }

  // Fetch results for this query
  const { data: results } = await supabase
    .from("results")
    .select("*")
    .eq("query_id", params.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={userData} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/dashboard/queries">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to queries
              </Link>
            </Button>
            <h1 className="text-3xl font-bold mb-2">Query Details</h1>
            <p className="text-muted-foreground">View query information and generated leads</p>
          </div>
          <QueryDetails query={query} resultCount={results?.length || 0} />
          <ResultsTable results={results || []} queryId={params.id} />
        </div>
      </main>
    </div>
  )
}
