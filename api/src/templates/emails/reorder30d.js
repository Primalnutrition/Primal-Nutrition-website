/**
 * reorder30d.js — 30-day reorder reminder email template.
 */

const BG = '#0a0a0a'
const RED = '#ec1e27'
const BONE = '#f5efe6'
const MUTED = '#a0a0a0'
const SHOP_URL = 'https://primalnutrition.in/shop'

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function buildReorder30dHtml({ customerName, favoriteProduct } = {}) {
  const greeting = customerName ? `Hey ${esc(customerName)},` : 'Hey Champion,'
  const lead = favoriteProduct
    ? `Your <strong style="color:${RED};">${esc(favoriteProduct)}</strong> stack is likely reaching its final servings.`
    : 'Your current Primal Nutrition stack is likely reaching its final servings.'

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Your Stack Is Running Low</title>
</head>
<body style="margin:0;padding:0;background-color:${BG};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
  Reorder your stack and stay sharp.
</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BG};background-image:radial-gradient(circle at top, rgba(236,30,39,0.18), transparent 60%);">
  <tr>
    <td align="center" style="padding:48px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:${BG};">
        <tr>
          <td align="center" style="padding:0 24px 32px 24px;">
            <div style="font-family:Georgia,'Times New Roman',serif;font-size:14px;letter-spacing:0.35em;color:${RED};text-transform:uppercase;font-weight:700;">Primal Nutrition</div>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:0 24px 8px 24px;">
            <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:1.15;color:${BONE};text-transform:uppercase;letter-spacing:0.06em;font-weight:700;">
              Your Stack Is Running Low.<br/>
              <span style="color:${RED};">Your Edge Shouldn't Be.</span>
            </h1>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:16px 24px 32px 24px;">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:${RED};text-transform:uppercase;letter-spacing:0.15em;font-weight:600;">Consistency creates dangerous men.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 24px;">
            <div style="height:2px;background-color:${RED};width:64px;margin:0 auto;"></div>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 32px 16px 32px;">
            <p style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:${BONE};">${greeting}</p>
            <p style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:${BONE};">Most men quit when they start feeling better. Powerful men stay consistent long enough to become unstoppable.</p>
            <p style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:${BONE};">${lead}</p>
            <p style="margin:0 0 24px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:${BONE};">Whether it's <strong style="color:${RED};">TREX</strong>, <strong style="color:${RED};">Royal Jelly</strong>, <strong style="color:${RED};">Tongkat Ali</strong>, <strong style="color:${RED};">Korean Ginseng</strong>, <strong style="color:${RED};">Black Maca</strong>, <strong style="color:${RED};">Cordyceps</strong>, or <strong style="color:${RED};">Liver Detox+</strong> — consistency is what separates temporary motivation from real transformation.</p>

            <ul style="margin:0 0 24px 20px;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.7;color:${BONE};">
              <li style="margin-bottom:6px;">The energy.</li>
              <li style="margin-bottom:6px;">The drive.</li>
              <li style="margin-bottom:6px;">The recovery.</li>
              <li style="margin-bottom:0;">The discipline.</li>
            </ul>
            <p style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:${BONE};">It compounds when the routine continues.</p>

            <p style="margin:24px 0 8px 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.5;color:${BONE};font-style:italic;">Don't let your momentum break now.</p>
            <p style="margin:0 0 32px 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.5;color:${RED};font-weight:700;">Stay sharp. Stay dangerous. Stay ahead.</p>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:8px 32px 40px 32px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" style="background-color:${RED};border-radius:2px;">
                  <a href="${SHOP_URL}" style="display:inline-block;padding:16px 36px;font-family:Arial,Helvetica,sans-serif;font-size:14px;letter-spacing:0.2em;color:#ffffff;text-decoration:none;text-transform:uppercase;font-weight:700;">Reorder Now</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 24px;">
            <div style="height:1px;background-color:#1a1a1a;"></div>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:32px 24px 16px 24px;">
            <p style="margin:0 0 8px 0;font-family:Georgia,'Times New Roman',serif;font-size:14px;letter-spacing:0.3em;color:${RED};text-transform:uppercase;font-weight:700;">The Power To Perform</p>
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

export function buildReorder30dText({ customerName, favoriteProduct } = {}) {
  const greeting = customerName ? `Hey ${customerName},` : 'Hey Champion,'
  const lead = favoriteProduct
    ? `Your ${favoriteProduct} stack is likely reaching its final servings.`
    : 'Your current Primal Nutrition stack is likely reaching its final servings.'
  return `YOUR STACK IS RUNNING LOW. YOUR EDGE SHOULDN'T BE.
Consistency creates dangerous men.

${greeting}

Most men quit when they start feeling better. Powerful men stay consistent long enough to become unstoppable.

${lead}

Whether it's TREX, Royal Jelly, Tongkat Ali, Korean Ginseng, Black Maca, Cordyceps, or Liver Detox+ — consistency is what separates temporary motivation from real transformation.

- The energy.
- The drive.
- The recovery.
- The discipline.

It compounds when the routine continues. Don't let your momentum break now.

Stay sharp. Stay dangerous. Stay ahead.

REORDER NOW: ${SHOP_URL}

---
THE POWER TO PERFORM
Team Primal Nutrition
SALESMANAGER@PRIMALNUTRITION.IN
+91 7838026415
www.primalnutrition.in
`
}
