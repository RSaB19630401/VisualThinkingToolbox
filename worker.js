// sketchnote – Cloudflare Worker (Claude-Proxy + statische Assets)
//
// Modell-Konfiguration (Dashboard → Settings → Variables and Secrets):
//   CLAUDE_MODEL           primäres Modell, z. B. claude-sonnet-5-5
//   CLAUDE_MODEL_FALLBACK  Ausweichmodell, z. B. claude-sonnet-4-6
//   ANTHROPIC_API_KEY      (Secret)
//
// Fallback greift NUR bei "Modell nicht gefunden" (404 / not_found_error), einmal, mit Log-Warnung.

const MODEL_DEFAULT = "claude-sonnet-4-6";

// Modellspezifische Parameter – damit die Antworten wie bisher ausfallen:
//  • Sonnet 5.5 / Haiku 5.5 denken sonst standardmäßig vorab mit (kostet Tokens, zählt gegen
//    max_tokens, und die Antwort beginnt dann mit einem thinking-Block statt mit Text).
//  • Die 5er-Modelle zählen denselben Text als ca. 30 % mehr Tokens → Limit wird mitgezogen
//    (berechnet werden nur tatsächlich erzeugte Tokens).
function modelParams(model, maxTokens) {
  const p = {};
  if (/^claude-sonnet-5-5/.test(model)) p.thinking = { type: "between_tools" };
  else if (/^claude-haiku-5/.test(model)) p.thinking = { type: "disabled" };
  if (/^claude-(sonnet|haiku|opus)-5/.test(model) && maxTokens) p.max_tokens = Math.ceil(maxTokens * 1.3);
  return p;
}

async function anthropicFetch(apiKey, payloadBase, env) {
  const primary  = (env && env.CLAUDE_MODEL)         || MODEL_DEFAULT;
  const fallback = (env && env.CLAUDE_MODEL_FALLBACK) || MODEL_DEFAULT;
  const call = (model) => fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ ...payloadBase, ...modelParams(model, payloadBase.max_tokens), model }),
  });

  let resp = await call(primary);
  let used = primary;
  if (resp.status === 404 && fallback && fallback !== primary) {
    let modelMissing = true;
    try {
      const j = await resp.clone().json();
      modelMissing = !j || !j.error || j.error.type === "not_found_error";
    } catch (_) {}
    if (modelMissing) {
      console.warn(`[CLAUDE] Modell '${primary}' nicht gefunden – Fallback auf '${fallback}'.`);
      resp = await call(fallback);
      used = fallback;
    }
  }
  return { resp, used };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/test") {
      return new Response(JSON.stringify({
        status: "Worker laeuft!",
        hasApiKey: !!env.ANTHROPIC_API_KEY,
        hasAssets: !!env.ASSETS,
        model: (env && env.CLAUDE_MODEL) || MODEL_DEFAULT,
        path: url.pathname,
      }), { headers: { "Content-Type": "application/json" } });
    }

    if (url.pathname === "/api/generate" && request.method === "POST") {
      const apiKey = env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        return new Response(JSON.stringify({ error: "Kein API-Key" }), {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }
      try {
        const body = await request.json();
        const payloadBase = {
          max_tokens: body.max_tokens || 2000,
          system: body.system,
          messages: body.messages,
        };
        const { resp, used } = await anthropicFetch(apiKey, payloadBase, env);
        const data = await resp.json();
        return new Response(JSON.stringify(data), {
          status: resp.status,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "X-Model-Used": used },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    return new Response("Worker laeuft, aber keine Assets", { status: 404 });
  },
};
