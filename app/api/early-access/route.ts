type EarlyAccessPayload = {
  name: string;
  email: string;
  phoneNumber: string;
  interestType: string;
  message: string;
};

function isValidPayload(payload: EarlyAccessPayload): boolean {
  return Boolean(
    payload.name.trim() &&
      payload.email.trim() &&
      payload.phoneNumber.trim() &&
      payload.interestType.trim() &&
      payload.message.trim()
  );
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as EarlyAccessPayload;

    if (!isValidPayload(payload)) {
      return Response.json(
        { message: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    if (!webhookUrl) {
      return Response.json(
        { message: "Google Sheets webhook is not configured yet." },
        { status: 500 }
      );
    }

    const sheetsResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        submittedAt: new Date().toISOString(),
      }),
    });

    if (!sheetsResponse.ok) {
      return Response.json(
        { message: "We could not save your request right now. Please try again." },
        { status: 502 }
      );
    }

    return Response.json({
      message: "Thanks, your early access request has been received.",
    });
  } catch {
    return Response.json(
      { message: "Something went wrong while submitting the form." },
      { status: 500 }
    );
  }
}
