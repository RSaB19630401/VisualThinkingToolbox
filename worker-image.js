/**
 * Sketchnote Image Generator Worker
 * Uses OpenAI gpt-image-1-mini for affordable sketchnote generation
 * Cost: ~$0.005 per image (Low quality, 1536x1024)
 *
 * Environment variable required: OPENAI_API_KEY
 */
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function buildPrompt(data) {
  const title = data.title || 'Sketchnote';
  const sections = (data.sections || []).slice(0, 6);
  const mood = data.mood || 'optimistisch';

  const moodHint = {
    optimistisch: 'warm pink and coral accents',
    neutral: 'blue and grey accents',
    nachdenklich: 'purple and teal accents',
    energisch: 'red and orange accents',
    empathisch: 'soft pink and green accents',
  };

  const sectionTexts = sections.map((s, i) => {
    const items = (s.items || []).slice(0, 3);
    return `Section ${i + 1}: Title "${s.title}" with bullet points: ${items.map(it => `"${it}"`).join(', ')}`;
  }).join('. ');

  const footer = data.footer?.items?.length
    ? `Footer labeled "ERINNERUNG" with: ${data.footer.items.map(it => `"${it}"`).join(', ')}.`
    : '';

  const centralMsg = data.cm ? `Central message in a rounded box: "${data.cm}".` : '';

  return [
    `Professional hand-drawn sketchnote poster on white paper, Bikablo visual facilitation style.`,
    `Title "${title}" in a large hand-drawn banner at top, ${moodHint[mood] || moodHint.optimistisch}.`,
    data.subtitle ? `Subtitle: "${data.subtitle}".` : '',
    `${sections.length} numbered sections: ${sectionTexts}.`,
    `Each section has expressive stick figure illustrations matching the topic.`,
    `Decorative elements: pink arrows, hearts, stars, checkmarks, speech bubbles, banner ribbons.`,
    centralMsg,
    footer,
    `ALL text in German, clearly legible hand-lettered style.`,
    `Black ink on white paper, NO photorealistic elements, pure hand-drawn illustration.`,
  ].filter(Boolean).join(' ');
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'POST required' }), {
        status: 405, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }
    if (!env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: 'OPENAI_API_KEY not configured' }), {
        status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    try {
      const data = await request.json();
      const prompt = buildPrompt(data);

      const res = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-image-1-mini',
          prompt: prompt,
          n: 1,
          size: '1536x1024',
          quality: 'low',
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        return new Response(JSON.stringify({
          error: `OpenAI Error ${res.status}`,
          detail: errData.error?.message || JSON.stringify(errData).slice(0, 500),
        }), {
          status: res.status,
          headers: { ...CORS, 'Content-Type': 'application/json' },
        });
      }

      const result = await res.json();
      const imgData = result.data?.[0];

      if (!imgData) {
        return new Response(JSON.stringify({ error: 'No image in response' }), {
          status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
        });
      }

      // gpt-image-1-mini returns b64_json
      if (imgData.b64_json) {
        const binStr = atob(imgData.b64_json);
        const bytes = new Uint8Array(binStr.length);
        for (let i = 0; i < binStr.length; i++) {
          bytes[i] = binStr.charCodeAt(i);
        }
        return new Response(bytes, {
          headers: { ...CORS, 'Content-Type': 'image/png' },
        });
      }

      // Fallback: URL
      if (imgData.url) {
        const imgRes = await fetch(imgData.url);
        return new Response(imgRes.body, {
          headers: { ...CORS, 'Content-Type': 'image/png' },
        });
      }

      return new Response(JSON.stringify({ error: 'No image data', keys: Object.keys(imgData) }), {
        status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }
  },
};
