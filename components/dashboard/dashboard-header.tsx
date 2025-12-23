"use client"

import { Button } from "@/components/ui/button"
import { Target, LogOut, History } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface DashboardHeaderProps {
  user: any
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast({
      title: "Signed out",
      description: "You have been successfully signed out",
    })
    router.push("/")
    router.refresh()
  }

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">LeadFlow</span>
            </Link>
            <nav className="hidden md:flex items-center gap-4">
              <Button variant={pathname === "/dashboard" ? "default" : "ghost"} size="sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button variant={pathname.startsWith("/dashboard/queries") ? "default" : "ghost"} size="sm" asChild>
                <Link href="/dashboard/queries">
                  <History className="h-4 w-4 mr-2" />
                  Query History
                </Link>
              </Button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium">{user?.email}</span>
              <span className="text-xs text-muted-foreground capitalize">{user?.plan} Plan</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="bg-transparent">
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
