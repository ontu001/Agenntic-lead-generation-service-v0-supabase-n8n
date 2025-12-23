"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { triggerN8nWorkflow } from "@/lib/n8n/client"

interface SubmitQueryParams {
  userId: string
  query: string
  location: string
  numLeads: number
  email: string
}

export async function submitQuery(params: SubmitQueryParams) {
  try {
    const supabase = await createClient()

    // Check if user has enough credits
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("credits")
      .eq("id", params.userId)
      .single()

    if (userError || !userData) {
      return { success: false, error: "User not found" }
    }

    if (userData.credits < 1) {
      return { success: false, error: "Insufficient credits" }
    }

    // Create query record
    const { data: queryData, error: queryError } = await supabase
      .from("queries")
      .insert({
        user_id: params.userId,
        query: params.query,
        location: params.location,
        num_leads: params.numLeads,
        status: "pending",
      })
      .select()
      .single()

    if (queryError) {
      console.error("[v0] Query insert error:", queryError)
      return { success: false, error: "Failed to create query" }
    }

    // Deduct 1 credit from user
    const { error: updateError } = await supabase
      .from("users")
      .update({ credits: userData.credits - 1 })
      .eq("id", params.userId)

    if (updateError) {
      console.error("[v0] Credit deduction error:", updateError)
      return { success: false, error: "Failed to deduct credits" }
    }

    const n8nResult = await triggerN8nWorkflow({
      queryId: queryData.id,
      query: params.query,
      location: params.location,
      numLeads: params.numLeads,
      email: params.email,
    })

    if (!n8nResult.success) {
      console.error("[v0] Failed to trigger n8n workflow:", n8nResult.error)
      // Update query status to failed
      await supabase.from("queries").update({ status: "failed" }).eq("id", queryData.id)
    } else {
      // Update query status to processing
      await supabase.from("queries").update({ status: "processing" }).eq("id", queryData.id)
    }

    revalidatePath("/dashboard")
    return { success: true, queryId: queryData.id }
  } catch (error) {
    console.error("[v0] Submit query error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
