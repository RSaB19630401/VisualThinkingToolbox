// /functions/api/test.js — Diagnose-Endpoint
// Im Browser aufrufen: https://DEINE-DOMAIN/api/test
// Antwortet JSON  → Functions laufen, Problem liegt woanders.
// Antwortet 404   → Functions werden NICHT deployed (Build-Output-Dir prüfen).
export async function onRequest(context) {
  return new Response(JSON.stringify({
    status: 'Pages Functions laufen!',
    hasApiKey: !!context.env.ANTHROPIC_API_KEY,
    time: new Date().toISOString(),
  }, null, 2), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}
