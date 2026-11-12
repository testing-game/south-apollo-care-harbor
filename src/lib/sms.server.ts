import { smsErrorText } from "./sms";

const API = "https://api.zendsms.com/api/v1";

export type SmsResult = { ok: true; messageId: string | null } | { ok: false; code: number | null; error: string };

type Envelope = { success?: boolean; code?: number; message?: string; data?: Record<string, unknown> };

async function call(path: string, token: string, init?: RequestInit): Promise<{ status: number; body: Envelope }> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" },
  });
  const body = (await res.json().catch(() => ({}))) as Envelope;
  return { status: res.status, body };
}

/** The account's default sending number, used only if ZendSMS insists on one. */
async function defaultSender(token: string): Promise<string | null> {
  const { body } = await call("/sender-ids", token);
  const list = (body.data?.["sender_ids"] as { sender_id: string; type?: string; is_default?: boolean }[] | undefined) ?? [];
  return (list.find((s) => s.is_default) ?? list.find((s) => s.type === "unmasked") ?? list[0])?.sender_id ?? null;
}

/** Sends one non-masking SMS. Tries without a sender ID first; falls back to the account default when required. */
export async function sendZendSms(recipient: string, message: string, token: string): Promise<SmsResult> {
  const send = (sender?: string) =>
    call("/send-sms", token, { method: "POST", body: JSON.stringify({ recipient, type: "plain", message, ...(sender ? { sender_id: sender } : {}) }) });
  try {
    let r = await send();
    if (!r.body.success && (r.body.code === 2102 || r.body.code === 2105)) {
      const sender = await defaultSender(token);
      if (sender) r = await send(sender);
    }
    if (r.body.success) return { ok: true, messageId: (r.body.data?.["message_id"] as string | undefined) ?? null };
    console.error("[sms] ZendSMS rejected message", r.status, r.body.code, r.body.message);
    return { ok: false, code: r.body.code ?? null, error: smsErrorText(r.body.code, r.body.message) };
  } catch (e) {
    console.error("[sms] ZendSMS request failed", e);
    return { ok: false, code: null, error: "The SMS service could not be reached. Try again shortly." };
  }
}
