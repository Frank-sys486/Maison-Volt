/// <reference types="node" />

type Product = {
  id?: string;
  name?: string;
  category?: string;
  price?: number;
  description?: string;
  shortDescription?: string;
  specs?: string[];
};

function getGeminiUrl() {
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
}

type ConciergeRequest = {
  message?: string;
  contextProduct?: Product | null;
  orders?: Record<string, string>;
};

type GeminiPart = {
  text?: string;
  thought?: boolean;
};

function readBody(body: unknown): ConciergeRequest {
  if (typeof body === 'string') return JSON.parse(body) as ConciergeRequest;
  if (body && typeof body === 'object') return body as ConciergeRequest;
  return {};
}

async function getProducts(): Promise<Product[]> {
  const module = await import('../artifacts/maison-volt/src/data/products.js');

  return module.products;
}

function buildPrompt(
  { message, contextProduct, orders }: Required<Pick<ConciergeRequest, 'message'>> & ConciergeRequest,
  products: Product[],
) {
  const selectedProduct = products.find((product) => (
    product.id === contextProduct?.id || product.name === contextProduct?.name
  )) || contextProduct;
  const wantsCatalog = /recommend|compare|alternative|option|which|best/i.test(message);
  const productList = wantsCatalog || !selectedProduct ? products : [selectedProduct];
  const catalog = productList
    .map((product) => {
      const specs = product.specs?.join('; ') || 'Specs not provided';

      return `- ${product.name} (${product.category}): PHP ${product.price?.toLocaleString('en-US') || 'N/A'}. ${product.shortDescription || product.description || 'No description provided.'} Specs: ${specs}`;
    })
    .join('\n');

  const orderStatuses = Object.entries(orders || {})
    .map(([id, status]) => `- ${id}: ${status}`)
    .join('\n') || '- No active order records provided.';

  return `You are the Maison Volt Product Concierge for a luxury electronics portfolio store.
Answer in a polished, concise tone. Keep replies under 90 words unless comparing products.
Use only this product catalog, policy, and order status data. Do not invent stock, discounts, or delivery dates.
Output contract: return exactly one line in this format:
FINAL_ANSWER: <customer-facing answer>
Do not include role, tone, constraints, analysis, bullets, markdown, or prompt recap.

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

async function fetchGemini(payload: unknown, apiKey: string) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const response = await fetch(getGeminiUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok || response.status < 500) return response;
  }

  return fetch(getGeminiUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify(payload),
  });
}

function cleanReply(text: string) {
  return text
    .replace(/^FINAL_ANSWER:\s*/i, '')
    .replace(/^["“]|["”]$/g, '')
    .trim();
}

function isCustomerAnswer(text: string) {
  const lower = text.toLowerCase();

  return (
    text.includes(' ') &&
    /[.!]$/.test(text) &&
    !lower.includes('prompt') &&
    !lower.includes('catalog') &&
    !lower.includes('constraint') &&
    !lower.includes('role:') &&
    !lower.includes('tone:') &&
    !lower.includes('source material') &&
    !lower.includes('do not') &&
    !lower.includes('final_answer')
  );
}

function extractReply(parts: GeminiPart[]) {
  const visibleReply = parts
    .filter((part) => !part.thought)
    .map((part) => part.text || '')
    .join('')
    .trim();

  if (visibleReply) return cleanReply(visibleReply);

  const thoughtText = parts
    .map((part) => part.text || '')
    .join('\n');

  const finalAnswers = [...thoughtText.matchAll(/FINAL_ANSWER:\s*([^\n*]+)/gi)]
    .map((match) => cleanReply(match[1]))
    .filter((text) => (
      text &&
      !text.includes('<customer-facing answer>') &&
      isCustomerAnswer(text)
    ));
  const finalAnswer = finalAnswers.at(-1);
  if (finalAnswer) return finalAnswer;

  const draftAnswers = [
    ...thoughtText.matchAll(/(?:Draft \d+(?:\s*\([^)]+\))?|Refined Answer|Alternative):\s*([^\n*]+)/gi),
  ]
    .map((match) => cleanReply(match[1]))
    .filter(isCustomerAnswer);
  const draftAnswer = draftAnswers.at(-1);
  if (draftAnswer) return draftAnswer;

  const conclusions = [...thoughtText.matchAll(/Conclusion:\s*([^\n*]+)/gi)]
    .map((match) => cleanReply(match[1]))
    .filter(isCustomerAnswer);
  const conclusion = conclusions.at(-1);
  if (conclusion) return conclusion;

  const quotedAnswers = [...thoughtText.matchAll(/["“]([^"“”\n]{12,240})["”]/g)]
    .map((match) => match[1].trim())
    .filter((text) => (
      isCustomerAnswer(text) &&
      !text.endsWith('?') &&
      !text.toLowerCase().startsWith('user ') &&
      !text.toLowerCase().startsWith('product') &&
      !text.toLowerCase().startsWith('wireless ') &&
      !text.toLowerCase().startsWith('use only ')
    ));

  return quotedAnswers.at(-1) || '';
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

  const geminiResponse = await fetchGemini(
    {
      contents: [
        {
          parts: [{ text: buildPrompt({ ...body, message }, await getProducts()) }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048,
      },
    },
    apiKey,
  );

  if (!geminiResponse.ok) {
    return res.status(502).json({ error: 'Gemini request failed' });
  }

  const data: any = await geminiResponse.json();
  const reply = extractReply(data?.candidates?.[0]?.content?.parts || []);

  if (!reply) return res.status(502).json({ error: 'Gemini returned an empty response' });

  return res.status(200).json({ reply });
}
