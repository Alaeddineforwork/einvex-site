type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  reason: string;
  message: string;
};

const validReasons = new Set([
  "General inquiry",
  "Partnership",
  "Investor interest",
  "Feedback",
  "Other",
]);

function isValidPayload(payload: ContactPayload): boolean {
  return Boolean(
    payload.name?.trim() &&
      payload.email?.trim() &&
      payload.email.includes("@") &&
      payload.reason?.trim() &&
      validReasons.has(payload.reason) &&
      payload.message?.trim()
  );
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ContactPayload;

    if (!isValidPayload(payload)) {
      return Response.json(
        { message: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    if (!webhookUrl) {
      return Response.json(
        { message: "Contact webhook is not configured yet." },
        { status: 500 }
      );
    }

    const sheetsResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: payload.name.trim(),
        email: payload.email.trim(),
        phone: payload.phone?.trim() ?? "",
        reason: payload.reason.trim(),
        message: payload.message.trim(),
        submittedAt: new Date().toISOString(),
      }),
    });

    if (!sheetsResponse.ok) {
      return Response.json(
        { message: "We could not send your message right now. Please try again." },
        { status: 502 }
      );
    }

    return Response.json({
      message: "Thanks, your message has been received.",
    });
  } catch {
    return Response.json(
      { message: "Something went wrong while sending your message." },
      { status: 500 }
    );
  }
}
