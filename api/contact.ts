// Vercel Edge Function — receives the "Start Your Project" form submission
// and forwards it to a Telegram chat via the Bot API. Runs server-side only,
// so TELEGRAM_BOT_TOKEN never reaches the client bundle.
export const config = { runtime: "edge" };

type Payload = {
  name?: unknown;
  email?: unknown;
  type?: unknown;
  budget?: unknown;
  message?: unknown;
  // Honeypot: a field real users never see or fill. Bots that auto-fill every
  // input will trip it, letting us silently drop the spam.
  company?: unknown;
};

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function clean(value: unknown, max = 2000): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return json({ error: "Server is not configured" }, 500);
  }

  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }

  if (clean(body.company)) {
    // Honeypot tripped — pretend success so bots don't learn to avoid it.
    return json({ ok: true }, 200);
  }

  const name = clean(body.name, 200);
  const email = clean(body.email, 200);
  const type = clean(body.type, 200);
  const budget = clean(body.budget, 200);
  const message = clean(body.message, 4000);

  if (!name || !email || !message) {
    return json({ error: "Missing required fields" }, 400);
  }

  const lines = [
    "🆕 New project enquiry",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    type && `Type: ${type}`,
    budget && `Budget: ${budget}`,
    "",
    message,
  ].filter((line): line is string => line !== "" && line !== false);

  const tgRes = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: lines.join("\n") }),
    },
  );

  if (!tgRes.ok) {
    // Telegram's own error text (e.g. "chat not found", "Unauthorized") is
    // the fastest way to diagnose a bad token/chat id — surface it both in
    // the Vercel function logs and in the response while this is being set up.
    const detail = await tgRes.text();
    console.error("Telegram sendMessage failed:", tgRes.status, detail);
    return json({ error: "Failed to deliver message", detail }, 502);
  }

  return json({ ok: true }, 200);
}
