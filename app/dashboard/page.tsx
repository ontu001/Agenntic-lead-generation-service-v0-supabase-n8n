import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { QueryForm } from "@/components/dashboard/query-form"
import { StatsCards } from "@/components/dashboard/stats-cards"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user data
  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  // Fetch query statistics
  const { count: totalQueries } = await supabase
    .from("queries")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const { count: completedQueries } = await supabase
    .from("queries")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "completed")

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={userData} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {userData?.full_name || "User"}</h1>
            <p className="text-muted-foreground">Generate high-quality leads with our AI-powered platform</p>
          </div>

          <StatsCards
            credits={userData?.credits || 0}
            totalQueries={totalQueries || 0}
            completedQueries={completedQueries || 0}
            plan={userData?.plan || "free"}
          />

          <QueryForm userId={user.id} currentCredits={userData?.credits || 0} />
        </div>
      </main>
    </div>
  )
}
