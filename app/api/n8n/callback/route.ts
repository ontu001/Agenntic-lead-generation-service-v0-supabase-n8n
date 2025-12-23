import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface N8nCallbackPayload {
  queryId: string
  results: Array<{
    email: string
  }>
}

export async function POST(request: Request) {
  try {
    const payload: N8nCallbackPayload = await request.json()
    console.log("[v0] Received n8n callback for query:", payload.queryId)

    const supabase = await createClient()

    // Verify query exists
    const { data: query, error: queryError } = await supabase
      .from("queries")
      .select("*")
      .eq("id", payload.queryId)
      .single()

    if (queryError || !query) {
      console.error("[v0] Query not found:", payload.queryId)
      return NextResponse.json({ success: false, error: "Query not found" }, { status: 404 })
    }

    // Insert results into database
    if (payload.results && payload.results.length > 0) {
      const resultsToInsert = payload.results.map((result) => ({
        query_id: payload.queryId,
        email: result.email,
      }))

      const { error: insertError } = await supabase.from("results").insert(resultsToInsert)

      if (insertError) {
        console.error("[v0] Error inserting results:", insertError)
        return NextResponse.json({ success: false, error: "Failed to insert results" }, { status: 500 })
      }
    }

    // Update query status to completed
    const { error: updateError } = await supabase
      .from("queries")
      .update({ status: "completed" })
      .eq("id", payload.queryId)

    if (updateError) {
      console.error("[v0] Error updating query status:", updateError)
      return NextResponse.json({ success: false, error: "Failed to update query status" }, { status: 500 })
    }

    console.log("[v0] n8n callback processed successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error processing n8n callback:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
