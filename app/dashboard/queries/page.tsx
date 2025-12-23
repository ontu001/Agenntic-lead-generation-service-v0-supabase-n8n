import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { QueryHistory } from "@/components/dashboard/query-history"

export default async function QueriesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  // Fetch all queries with result counts
  const { data: queries } = await supabase
    .from("queries")
    .select(
      `
      *,
      results:results(count)
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={userData} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Query History</h1>
            <p className="text-muted-foreground">View all your lead generation queries and results</p>
          </div>
          <QueryHistory queries={queries || []} />
        </div>
      </main>
    </div>
  )
}
