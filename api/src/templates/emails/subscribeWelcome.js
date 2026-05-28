/**
 * subscribeWelcome.js — newsletter / footer subscribe confirmation.
 * Separate from welcome.js (which fires on first order) — sets expectations,
 * delivers the protocol guide, hands out a first-order incentive.
 */

const BG = '#0a0a0a'
const RED = '#ec1e27'
const BONE = '#f5efe6'
const MUTED = '#a0a0a0'
const SHOP_URL = 'https://primalnutrition.in/shop'
const SITE_URL = 'https://primalnutrition.in'
const WELCOME_CODE = 'BROTHERHOOD10'

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function buildSubscribeWelcomeHtml({ email } = {}) {
  const unsubscribeUrl = email
    ? `${SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}`
    : `${SITE_URL}/unsubscribe`

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>You're In. Welcome To The Inner Circle.</title>
</head>
<body style="margin:0;padding:0;background-color:${BG};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
  Your free Performance Protocol Guide and an exclusive first-order code inside.
</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BG};background-image:radial-gradient(circle at top, rgba(236,30,39,0.18), transparent 60%);">
  <tr>
    <td align="center" style="padding:48px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:${BG};">

        <!-- Brand wordmark -->
        <tr>
          <td align="center" style="padding:0 24px 32px 24px;">
            <div style="font-family:Georgia,'Times New Roman',serif;font-size:14px;letter-spacing:0.35em;color:${RED};text-transform:uppercase;font-weight:700;">Primal Nutrition</div>
          </td>
        </tr>

        <!-- Headline -->
        <tr>
          <td align="center" style="padding:0 24px 8px 24px;">
            <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:38px;line-height:1.1;color:${BONE};text-transform:uppercase;letter-spacing:0.06em;font-weight:700;">
              You're In.<br/>
              <span style="color:${RED};">Welcome To The Inner Circle.</span>
            </h1>
          </td>
        </tr>

        <!-- Sub -->
        <tr>
          <td align="center" style="padding:16px 24px 32px 24px;">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:${RED};text-transform:uppercase;letter-spacing:0.15em;font-weight:600;">Thanks for subscribing. Your edge starts here.</p>
          </td>
        </tr>

        <tr>
          <td style="padding:0 24px;">
            <div style="height:2px;background-color:${RED};width:64px;margin:0 auto;"></div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 32px 16px 32px;">
            <p style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:${BONE};">Hey Champion,</p>
            <p style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:${BONE};">You just joined a tribe of men who refuse to settle for average. Stronger drive, sharper focus, harder recovery, more discipline — built one consistent day at a time.</p>
            <p style="margin:0 0 24px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:${BONE};">Primal Nutrition exists for one reason: to arm modern men with elite-grade Ayurvedic actives, performance science, and routines that compound.</p>

            <h2 style="margin:24px 0 12px 0;font-family:Georgia,'Times New Roman',serif;font-size:20px;color:${RED};text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">What You'll Get</h2>
            <ul style="margin:0 0 24px 20px;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.7;color:${BONE};">
              <li style="margin-bottom:8px;"><strong style="color:${RED};">Weekly protocols</strong> — recovery, sleep, hormones, drive.</li>
              <li style="margin-bottom:8px;"><strong style="color:${RED};">Stack recommendations</strong> — tailored to your goals.</li>
              <li style="margin-bottom:8px;"><strong style="color:${RED};">Founder notes</strong> — the science and sourcing behind every active.</li>
              <li style="margin-bottom:0;"><strong style="color:${RED};">Early access</strong> to drops, restocks, and inner-circle pricing.</li>
            </ul>
          </td>
        </tr>

        <!-- Welcome offer card -->
        <tr>
          <td style="padding:8px 32px 8px 32px;">
            <div style="background-color:#101010;border:1px solid ${RED};border-radius:4px;padding:24px;">
              <p style="margin:0 0 6px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.18em;color:${MUTED};text-transform:uppercase;font-weight:600;">Welcome Drop</p>
              <p style="margin:0 0 8px 0;font-family:Georgia,'Times New Roman',serif;font-size:22px;color:${BONE};font-weight:700;letter-spacing:0.04em;">10% off your first stack</p>
              <p style="margin:0 0 12px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${MUTED};">Use code at checkout. One-time, all subscribers.</p>
              <div style="background-color:${BG};border:1px dashed ${RED};border-radius:2px;padding:10px 14px;display:inline-block;">
                <span style="font-family:'Courier New',Courier,monospace;font-size:18px;color:${RED};letter-spacing:0.2em;font-weight:700;">${WELCOME_CODE}</span>
              </div>
            </div>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td align="center" style="padding:24px 32px 8px 32px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" style="background-color:${RED};border-radius:2px;">
                  <a href="${SHOP_URL}" style="display:inline-block;padding:16px 36px;font-family:Arial,Helvetica,sans-serif;font-size:14px;letter-spacing:0.2em;color:#ffffff;text-decoration:none;text-transform:uppercase;font-weight:700;">Explore The Stack</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Closing -->
        <tr>
          <td style="padding:24px 32px 32px 32px;">
            <p style="margin:0 0 8px 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.5;color:${BONE};font-style:italic;">Weak men wait for motivation.</p>
            <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.5;color:${RED};font-weight:700;">Powerful men build systems.</p>
          </td>
        </tr>

        <!-- Footer divider -->
        <tr>
          <td style="padding:0 24px;">
            <div style="height:1px;background-color:#1a1a1a;"></div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align="center" style="padding:32px 24px 8px 24px;">
            <p style="margin:0 0 8px 0;font-family:Georgia,'Times New Roman',serif;font-size:14px;letter-spacing:0.3em;color:${RED};text-transform:uppercase;font-weight:700;">The Power To Perform</p>
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.7;color:${MUTED};">
              Team Primal Nutrition<br/>
              <a href="mailto:salesmanager@primalnutrition.in" style="color:${MUTED};text-decoration:none;">SALESMANAGER@PRIMALNUTRITION.IN</a><br/>
              +91 7838026415<br/>
              <a href="${SITE_URL}" style="color:${MUTED};text-decoration:none;">www.primalnutrition.in</a>
            </p>
          </td>
        </tr>

        <!-- Compliance footer -->
        <tr>
          <td align="center" style="padding:8px 24px 16px 24px;">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.5;color:${MUTED};">
              You're receiving this because you subscribed at primalnutrition.in.<br/>
              <a href="${unsubscribeUrl}" style="color:${MUTED};text-decoration:underline;">Unsubscribe</a> &middot; <a href="mailto:salesmanager@primalnutrition.in?subject=Unsubscribe" style="color:${MUTED};text-decoration:underline;">Reply to opt out</a>
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`
}

export function buildSubscribeWelcomeText({ email } = {}) {
  const unsubscribeUrl = email
    ? `${SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}`
    : `${SITE_URL}/unsubscribe`
  return `YOU'RE IN. WELCOME TO THE INNER CIRCLE.
Thanks for subscribing. Your edge starts here.

Hey Champion,

You just joined a tribe of men who refuse to settle for average. Stronger drive, sharper focus, harder recovery, more discipline — built one consistent day at a time.

Primal Nutrition exists for one reason: to arm modern men with elite-grade Ayurvedic actives, performance science, and routines that compound.

WHAT YOU'LL GET
- Weekly protocols — recovery, sleep, hormones, drive.
- Stack recommendations — tailored to your goals.
- Founder notes — the science and sourcing behind every active.
- Early access to drops, restocks, and inner-circle pricing.

WELCOME DROP — 10% off your first stack
Use code at checkout: ${WELCOME_CODE}

EXPLORE THE STACK: ${SHOP_URL}

Weak men wait for motivation. Powerful men build systems.

---
THE POWER TO PERFORM
Team Primal Nutrition
SALESMANAGER@PRIMALNUTRITION.IN
+91 7838026415
www.primalnutrition.in

You're receiving this because you subscribed at primalnutrition.in.
Unsubscribe: ${unsubscribeUrl}
`
}
