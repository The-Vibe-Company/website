let lastTriggered = 0
const DEBOUNCE_MS = 30_000

export async function triggerDeploy(): Promise<void> {
  const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL
  if (!hookUrl) return

  const now = Date.now()
  if (now - lastTriggered < DEBOUNCE_MS) return
  lastTriggered = now

  try {
    await fetch(hookUrl, { method: 'POST' })
  } catch {
    console.warn('[deploy-hook] Failed to trigger Vercel deploy hook')
  }
}
