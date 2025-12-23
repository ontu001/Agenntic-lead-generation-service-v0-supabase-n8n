import { SignupForm } from "@/components/auth/signup-form"
import Link from "next/link"
import { Target } from "lucide-react"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary/30 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Target className="h-8 w-8 text-primary" />
            <span className="font-bold text-2xl">LeadFlow</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Get started</h1>
          <p className="text-muted-foreground">Create your account and get 10 free credits</p>
        </div>
        <SignupForm />
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
