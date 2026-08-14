export function normalizeIsraeliPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (!digits) return null;

  let normalized = digits;
  if (normalized.startsWith("972")) {
    // already international
  } else if (normalized.startsWith("0") && normalized.length === 10) {
    normalized = `972${normalized.slice(1)}`;
  } else if (normalized.length === 9 && normalized.startsWith("5")) {
    normalized = `972${normalized}`;
  } else {
    return null;
  }

  // Israeli mobile: 972 + 9 digits (5xxxxxxxx)
  if (!/^9725\d{8}$/.test(normalized)) return null;
  return normalized;
}

type SendBase = {
  token: string;
  phoneNumberId: string;
  to: string;
};

export async function sendWhatsAppTemplate({
  token,
  phoneNumberId,
  to,
  templateName,
  languageCode,
  bodyParams = [],
}: SendBase & {
  templateName: string;
  languageCode: string;
  bodyParams?: string[];
}): Promise<{ ok: boolean; error?: string }> {
  const template: Record<string, unknown> = {
    name: templateName,
    language: { code: languageCode },
  };

  if (bodyParams.length > 0) {
    template.components = [
      {
        type: "body",
        parameters: bodyParams.map((text) => ({ type: "text", text })),
      },
    ];
  }

  const res = await fetch(
    `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "template",
        template,
      }),
    },
  );

  if (!res.ok) {
    const error = await res.text();
    return { ok: false, error };
  }
  return { ok: true };
}

export async function sendWhatsAppText({
  token,
  phoneNumberId,
  to,
  body,
}: SendBase & { body: string }): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(
    `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body },
      }),
    },
  );

  if (!res.ok) {
    const error = await res.text();
    return { ok: false, error };
  }
  return { ok: true };
}
