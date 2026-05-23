export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Only handle /api/generate - everything else goes to static assets
    if (url.pathname !== "/api/generate") {
      return env.ASSETS.fetch(request);
    }

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // Only POST allowed
    if (request.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    // Check API key
    const apiKey = env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "ANTHROPIC_API_KEY not set. Go to Worker Settings > Variables and add it." },
        { status: 500 }
      );
    }

    try {
      const body = await request.json();

      const apiResponse = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: body.model || "claude-sonnet-4-20250514",
          max_tokens: body.max_tokens || 2000,
          system: body.system,
          messages: body.messages,
        }),
      });

      const data = await apiResponse.json();

      return Response.json(data, {
        status: apiResponse.status,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    } catch (err) {
      return Response.json({ error: err.message }, { status: 500 });
    }
  },
};
