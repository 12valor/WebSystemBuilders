import { pathToFileURL } from "node:url";

const required = [
  ["supabase_url", "NEXT_PUBLIC_SUPABASE_URL", (value) => isHttpsUrl(value)],
  ["supabase_publishable_key", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", (value) => value.length >= 20],
  ["supabase_service_role", "SUPABASE_SERVICE_ROLE_KEY", (value) => value.length >= 20],
  ["inquiry_fingerprint_salt", "INQUIRY_FINGERPRINT_SALT", (value) => value.length >= 32],
  ["paymongo_live_key", "PAYMONGO_SECRET_KEY", (value) => /^sk_live_[A-Za-z0-9]+$/.test(value)],
  ["paymongo_webhook_secret", "PAYMONGO_WEBHOOK_SECRET", (value) => /^whsk_[A-Za-z0-9]+$/.test(value)],
  ["resend_api_key", "RESEND_API_KEY", (value) => /^re_[A-Za-z0-9_]+$/.test(value)],
  ["resend_sender", "RESEND_FROM_EMAIL", (value) => isOwnedSender(value)],
  ["canonical_site_url", "SITE_URL", (value) => value === "https://websystembuilders.com"],
];

export function checkLaunchReadiness(environment) {
  return required.flatMap(([code, name, validate]) => {
    const value = typeof environment[name] === "string" ? environment[name].trim() : "";
    return validate(value) ? [] : [{ code, variable: name }];
  });
}

function isHttpsUrl(value) {
  try { return new URL(value).protocol === "https:"; }
  catch { return false; }
}

function isOwnedSender(value) {
  const match = /^[^@\s]+@([^@\s]+)$/.exec(value.toLowerCase());
  return Boolean(match && (match[1] === "websystembuilders.com" || match[1].endsWith(".websystembuilders.com")));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const issues = checkLaunchReadiness(process.env);
  if (issues.length === 0) {
    console.log("Launch environment check passed. Manual provider, legal, content, backup, and deployment gates still apply.");
  } else {
    console.error("Launch environment check failed:");
    for (const issue of issues) console.error(`- ${issue.variable}: ${issue.code}`);
    console.error("No secret values were printed.");
    process.exitCode = 1;
  }
}
