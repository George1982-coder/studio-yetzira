import { NextResponse } from "next/server";
import { normalizeIsraeliPhone, sendWhatsAppTemplate, sendWhatsAppText } from "@/lib/whatsapp";

type Body = {
  name?: string;
  phone?: string;
  message?: string;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const phoneRaw = (body.phone || "").trim();
  const message = (body.message || "").trim();

  if (!name) {
    return NextResponse.json({ error: "נא למלא שם" }, { status: 400 });
  }

  const phone = normalizeIsraeliPhone(phoneRaw);
  if (!phone) {
    return NextResponse.json(
      { error: "נא למלא מספר וואטסאפ ישראלי תקין (למשל 052-4186300)" },
      { status: 400 },
    );
  }

  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const clientTemplate = process.env.WHATSAPP_CLIENT_TEMPLATE || "lead_thanks";
  const clientLang = process.env.WHATSAPP_CLIENT_TEMPLATE_LANG || "he";
  const ownerPhone = normalizeIsraeliPhone(process.env.OWNER_WHATSAPP || "0524186300");
  const ownerTemplate = process.env.WHATSAPP_OWNER_TEMPLATE || "new_lead";
  const ownerLang = process.env.WHATSAPP_OWNER_TEMPLATE_LANG || "he";
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;

  if (!token || !phoneNumberId) {
    return NextResponse.json(
      {
        error:
          "אוטומציית וואטסאפ עדיין לא מוגדרת. הוסף WHATSAPP_TOKEN ו-WHATSAPP_PHONE_NUMBER_ID ב-Vercel.",
        code: "NOT_CONFIGURED",
      },
      { status: 503 },
    );
  }

  // 1) Auto-reply to the client
  const clientResult = await sendWhatsAppTemplate({
    token,
    phoneNumberId,
    to: phone,
    templateName: clientTemplate,
    languageCode: clientLang,
    bodyParams: [name],
  });

  if (!clientResult.ok) {
    return NextResponse.json(
      {
        error: "לא הצלחנו לשלוח הודעה לוואטסאפ. בדוק שהתבנית מאושרת ושהמספר תקין.",
        details: clientResult.error,
      },
      { status: 502 },
    );
  }

  // 2) Notify you about the lead
  const leadSummary = message || "—";
  const ownerTemplateResult = await sendWhatsAppTemplate({
    token,
    phoneNumberId,
    to: ownerPhone!,
    templateName: ownerTemplate,
    languageCode: ownerLang,
    bodyParams: [name, phone, leadSummary.slice(0, 200)],
  });

  // If owner template isn't ready yet, try a plain text (works only inside 24h window)
  if (!ownerTemplateResult.ok) {
    await sendWhatsAppText({
      token,
      phoneNumberId,
      to: ownerPhone!,
      body: `ליד חדש מהאתר:\nשם: ${name}\nטלפון: ${phone}\nהודעה: ${leadSummary}`,
    });
  }

  // 3) Optional external automation (Make / Zapier / n8n)
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          message: leadSummary,
          source: "studio-yetzira",
          createdAt: new Date().toISOString(),
        }),
      });
    } catch {
      // Don't fail the lead if webhook is down
    }
  }

  return NextResponse.json({ ok: true });
}
