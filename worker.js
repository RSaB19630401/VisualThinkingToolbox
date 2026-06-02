// worker.js — Claude SVG/JSON proxy with rate limiting
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json", ...CORS } });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });

    if (url.pathname === "/api/test") {
      return json({ status: "Worker laeuft!", hasApiKey: !!env.ANTHROPIC_API_KEY, hasRateLimit: !!env.RATE_LIMITER, hasAssets: !!env.ASSETS });
    }

    if (url.pathname === "/api/generate" && request.method === "POST") {
      // ── Rate limiting (per client IP) ──
      if (env.RATE_LIMITER) {
        const ip = request.headers.get("CF-Connecting-IP") || "anon";
        const { success } = await env.RATE_LIMITER.limit({ key: ip });
        if (!success) return json({ error: "Zu viele Anfragen. Bitte kurz warten." }, 429);
      }

      const apiKey = env.ANTHROPIC_API_KEY;
      if (!apiKey) return json({ error: "Kein API-Key" }, 500);

      try {
        const body = await request.json();
        const r = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
          body: JSON.stringify({
            model: body.model || "claude-sonnet-4-20250514",
            max_tokens: body.max_tokens || 2000,
            system: body.system,
            messages: body.messages,
          }),
        });
        const data = await r.json();
        return json(data, r.status);
      } catch (err) {
        return json({ error: err.message }, 500);
      }
    }

    if (env.ASSETS) return env.ASSETS.fetch(request);
    return new Response("Worker laeuft, aber keine Assets", { status: 404 });
  },
};
