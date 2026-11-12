import { interpretOcsResponse, type SmsResult } from "./sms";

/** Default OneCodeSoft v3 host; ONECODESOFT_BASE_URL overrides it if the dashboard shows a different one. */
const DEFAULT_BASE = "https://sms.ocs-api.top/api";

/** Sends one non-masking SMS through OneCodeSoft Bulk SMS v3. No sender ID = OneCodeSoft picks an approved non-masking sender. */
export async function sendOcsSms(number: string, message: string, opts: { apiKey: string; senderId?: string | undefined; baseUrl?: string | undefined }): Promise<SmsResult> {
  const base = (opts.baseUrl?.trim() || DEFAULT_BASE).replace(/\/+$/, "");
  const senderid = opts.senderId?.trim();
  try {
    const res = await fetch(`${base}/v3/send-sms`, {
      method: "POST",
      headers: { Authorization: `Bearer ${opts.apiKey}`, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ number, message, ...(senderid ? { senderid } : {}) }),
    });
    const body = await res.json().catch(() => null);
    const result = interpretOcsResponse(res.status, body);
    if (!result.success) console.error("[sms] OneCodeSoft did not send", res.status, body?.message, result.details?.status);
    return result;
  } catch (e) {
    console.error("[sms] OneCodeSoft request failed", e);
    return { success: false, message: "The SMS service could not be reached. Try again shortly." };
  }
}
