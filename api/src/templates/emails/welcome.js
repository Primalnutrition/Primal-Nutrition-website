/**
 * welcome.js — Welcome email template.
 * Premium matte-black + crimson-red aesthetic, fully inline-styled
 * for maximum email-client compatibility (Outlook, Gmail, Apple Mail).
 */

const BG = '#0a0a0a'
const RED = '#ec1e27'
const BONE = '#f5efe6'
const MUTED = '#a0a0a0'
const SHOP_URL = 'https://primalnutrition.in/shop'

const FOOTER_TEXT = `THE POWER TO PERFORM
Team Primal Nutrition
SALESMANAGER@PRIMALNUTRITION.IN
+91 7838026415
www.primalnutrition.in`

/**
 * @param {{ customerName?: string }} params
 * @returns {string} full HTML document
 */
export function buildWelcomeHtml({ customerName } = {}) {
  const greeting = customerName ? `Welcome, ${escapeHtml(customerName)}.` : 'Welcome.'

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Welcome To The Brotherhood Of Performance</title>
</head>
<body style="margin:0;padding:0;background-color:${BG};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
  Your transformation starts now. Welcome to the brotherhood.
</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BG};background-image:radial-gradient(circle at top, rgba(236,30,39,0.18), transparent 60%);">
  <tr>
    <td align="center" style="padding:48px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:${BG};">
        <!-- Brand wordmark -->
        <tr>
          <td align="center" style="padding:0 24px 32px 24px;">
            <div style="font-family:Georgia,'Times New Roman',serif;font-size:14px;letter-spacing:0.35em;color:${RED};text-transform:uppercase;font-weight:700;">
              Primal Nutrition
            </div>
          </td>
        </tr>

        <!-- Headline -->
        <tr>
          <td align="center" style="padding:0 24px 8px 24px;">
            <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:36px;line-height:1.15;color:${BONE};text-transform:uppercase;letter-spacing:0.06em;font-weight:700;">
              Welcome To The<br/>Brotherhood Of Performance
            </h1>
          </td>
        </tr>

        <!-- Sub -->
        <tr>
          <td align="center" style="padding:16px 24px 32px 24px;">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:${RED};text-transform:uppercase;letter-spacing:0.15em;font-weight:600;">
              Your transformation starts now.
            </p>
          </td>
        </tr>

        <!-- Divider -->
        <tr>
          <td style="padding:0 24px;">
            <div style="height:2px;background-color:${RED};width:64px;margin:0 auto;"></div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 32px 16px 32px;">
            <p style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:${BONE};">
              ${greeting}
            </p>
            <p style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:${BONE};">
              The modern man is overworked, under-recovered, and overstimulated. Energy crashes. Focus fades. Drive disappears. We built Primal Nutrition for the men who refuse to accept that as normal.
            </p>
            <p style="margin:0 0 24px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:${BONE};">
              Our mission is simple: arm you with the elite-grade fuel, protocols, and discipline to reclaim your edge — physically, mentally, and sexually.
            </p>

            <h2 style="margin:24px 0 12px 0;font-family:Georgia,'Times New Roman',serif;font-size:20px;color:${RED};text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">
              Inside Your Journey
            </h2>
            <ul style="margin:0 0 24px 20px;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.7;color:${BONE};">
              <li style="margin-bottom:8px;"><strong style="color:${RED};">Elite supplements</strong> — pharmaceutical-grade actives, no filler.</li>
              <li style="margin-bottom:8px;"><strong style="color:${RED};">Performance education</strong> — the science behind the stack.</li>
              <li style="margin-bottom:8px;"><strong style="color:${RED};">Discipline-driven routines</strong> — protocols that compound.</li>
              <li style="margin-bottom:8px;"><strong style="color:${RED};">Stack recommendations</strong> — tailored to your goals.</li>
              <li style="margin-bottom:8px;"><strong style="color:${RED};">Recovery &amp; vitality protocols</strong> — sleep, hormones, drive.</li>
              <li style="margin-bottom:0;"><strong style="color:${RED};">Access to future launches</strong> and exclusive drops.</li>
            </ul>

            <p style="margin:24px 0 8px 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.5;color:${BONE};font-style:italic;">
              Weak men wait for motivation. Powerful men build systems and routines.
            </p>
            <p style="margin:0 0 32px 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.5;color:${RED};font-weight:700;">
              And your transformation starts now.
            </p>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td align="center" style="padding:8px 32px 40px 32px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" style="background-color:${RED};border-radius:2px;">
                  <a href="${SHOP_URL}" style="display:inline-block;padding:16px 36px;font-family:Arial,Helvetica,sans-serif;font-size:14px;letter-spacing:0.2em;color:#ffffff;text-decoration:none;text-transform:uppercase;font-weight:700;">
                    Explore The Stack
                  </a>
                </td>
              </tr>
            </table>
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
          <td align="center" style="padding:32px 24px 16px 24px;">
            <p style="margin:0 0 8px 0;font-family:Georgia,'Times New Roman',serif;font-size:14px;letter-spacing:0.3em;color:${RED};text-transform:uppercase;font-weight:700;">
              The Power To Perform
            </p>
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.7;color:${MUTED};">
              Team Primal Nutrition<br/>
              <a href="mailto:salesmanager@primalnutrition.in" style="color:${MUTED};text-decoration:none;">SALESMANAGER@PRIMALNUTRITION.IN</a><br/>
              +91 7838026415<br/>
              <a href="https://www.primalnutrition.in" style="color:${MUTED};text-decoration:none;">www.primalnutrition.in</a>
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

/**
 * @param {{ customerName?: string }} params
 * @returns {string} plain-text fallback
 */
export function buildWelcomeText({ customerName } = {}) {
  const greeting = customerName ? `Welcome, ${customerName}.` : 'Welcome.'
  return `WELCOME TO THE BROTHERHOOD OF PERFORMANCE
Your transformation starts now.

${greeting}

The modern man is overworked, under-recovered, and overstimulated. Energy crashes. Focus fades. Drive disappears. We built Primal Nutrition for the men who refuse to accept that as normal.

Our mission is simple: arm you with the elite-grade fuel, protocols, and discipline to reclaim your edge — physically, mentally, and sexually.

INSIDE YOUR JOURNEY
- Elite supplements — pharmaceutical-grade actives, no filler.
- Performance education — the science behind the stack.
- Discipline-driven routines — protocols that compound.
- Stack recommendations — tailored to your goals.
- Recovery & vitality protocols — sleep, hormones, drive.
- Access to future launches and exclusive drops.

Weak men wait for motivation. Powerful men build systems and routines. And your transformation starts now.

EXPLORE THE STACK: ${SHOP_URL}

---
${FOOTER_TEXT}
`
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
