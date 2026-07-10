import { products } from '../artifacts/maison-volt/src/data/products';

function getGeminiUrl() {
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
}

type ConciergeRequest = {
  message?: string;
  contextProduct?: {
    id?: string;
    name?: string;
    category?: string;
  } | null;
  orders?: Record<string, string>;
};

function readBody(body: unknown): ConciergeRequest {
  if (typeof body === 'string') return JSON.parse(body) as ConciergeRequest;
  if (body && typeof body === 'object') return body as ConciergeRequest;
  return {};
}

function buildPrompt({ message, contextProduct, orders }: Required<Pick<ConciergeRequest, 'message'>> & ConciergeRequest) {
  const catalog = products
    .map((product) => (
      `- ${product.name} (${product.category}): PHP ${product.price.toLocaleString('en-US')}. ${product.shortDescription} Specs: ${product.specs.join('; ')}`
    ))
    .join('\n');

  const orderStatuses = Object.entries(orders || {})
    .map(([id, status]) => `- ${id}: ${status}`)
    .join('\n') || '- No active order records provided.';

  return `You are the Maison Volt Product Concierge for a luxury electronics portfolio store.
Answer in a polished, concise tone. Keep replies under 90 words unless comparing products.
Use only this product catalog, policy, and order status data. Do not invent stock, discounts, or delivery dates.

Policy:
- Shipping: complimentary expedited shipping. Standard delivery takes 3-5 business days. Express delivery takes 1-2 business days.
- Returns: accepted within 7 days for damaged, defective, or incorrect items in original packaging.
- Warranty: all pieces include a 1-year limited manufacturing warranty.

Current product context: ${contextProduct?.name || 'None'}

Product catalog:
${catalog}

Order statuses:
${orderStatuses}

Client message:
${message}`;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'Gemini API key is not configured' });

  let body: ConciergeRequest;
  try {
    body = readBody(req.body);
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const message = body.message?.trim();
  if (!message) return res.status(400).json({ error: 'Message is required' });
  if (message.length > 1000) return res.status(400).json({ error: 'Message is too long' });

  const geminiResponse = await fetch(getGeminiUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: buildPrompt({ ...body, message }) }],
        },
      ],
      generationConfig: {
        temperature: 0.55,
        maxOutputTokens: 260,
      },
    }),
  });

  if (!geminiResponse.ok) {
    return res.status(502).json({ error: 'Gemini request failed' });
  }

  const data = await geminiResponse.json();
  const reply = data?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part.text || '')
    .join('')
    .trim();

  if (!reply) return res.status(502).json({ error: 'Gemini returned an empty response' });

  return res.status(200).json({ reply });
}
