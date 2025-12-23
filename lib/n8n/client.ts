interface N8nQueryPayload {
  queryId: string
  query: string
  location: string
  numLeads: number
  email: string
}

interface N8nResult {
  email: string
}

export async function triggerN8nWorkflow(payload: N8nQueryPayload): Promise<{ success: boolean; error?: string }> {
  try {
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL

    if (!n8nWebhookUrl) {
      console.error("[v0] N8N_WEBHOOK_URL environment variable is not set")
      return { success: false, error: "N8N webhook URL not configured" }
    }

    console.log("[v0] Triggering n8n workflow for query:", payload.queryId)

    const response = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      console.error("[v0] n8n webhook response not ok:", response.status, response.statusText)
      return { success: false, error: `N8n workflow failed: ${response.statusText}` }
    }

    console.log("[v0] n8n workflow triggered successfully")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error triggering n8n workflow:", error)
    return { success: false, error: "Failed to trigger n8n workflow" }
  }
}

export async function processN8nResults(queryId: string, results: N8nResult[]): Promise<boolean> {
  try {
    console.log("[v0] Processing n8n results for query:", queryId, "count:", results.length)

    // Call our API route to store results
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/n8n/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        queryId,
        results,
      }),
    })

    if (!response.ok) {
      console.error("[v0] Failed to store n8n results:", response.status)
      return false
    }

    console.log("[v0] n8n results processed successfully")
    return true
  } catch (error) {
    console.error("[v0] Error processing n8n results:", error)
    return false
  }
}
