// Vercel serverless function — completely free to run (Vercel's Hobby plan
// includes this for free) and calls Google's Gemini API, which has a free
// tier that needs no credit card. Your key stays here on the server and is
// never sent to the browser.
//
// If you ever get a "model not found" or billing-required error, Google
// occasionally renames which models are free — check
// https://ai.google.dev/gemini-api/docs/pricing and update GEMINI_MODEL below.

const GEMINI_MODEL = "gemini-2.5-flash";

export default async function handler(req, res) {
  // Allow the static site (hosted on a different domain, e.g. GitHub Pages)
  // to call this function.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: "Server is missing GEMINI_API_KEY. Set it in your Vercel project's Environment Variables, then redeploy.",
    });
    return;
  }

  const { messages, system } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "Request must include a non-empty 'messages' array." });
    return;
  }

  // Translate our Anthropic-shaped { role, content } messages into
  // Gemini's { role, parts: [{ text }] } format. Gemini calls the
  // assistant's role "model" instead of "assistant".
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
    const geminiResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        systemInstruction: system ? { parts: [{ text: system }] } : undefined,
      }),
    });

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      res.status(geminiResponse.status).json({ error: data?.error?.message || "Gemini API error", raw: data });
      return;
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") ||
      "I wasn't able to generate a response — try rephrasing.";

    // Respond in the same shape the front-end already expects, so
    // index.html doesn't need to know which AI provider is behind it.
    res.status(200).json({ content: [{ type: "text", text }] });
  } catch (err) {
    res.status(500).json({ error: "Failed to reach the Gemini API.", detail: String(err) });
  }
}
