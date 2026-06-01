/**
 * day14Checkin.js — Day 14 progress check-in email template.
 */

const BG = '#0a0a0a'
const RED = '#ec1e27'
const BONE = '#f5efe6'
const MUTED = '#a0a0a0'

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function buildDay14CheckinHtml({ customerName } = {}) {
  const greeting = customerName ? `Hey ${esc(customerName)},` : 'Hey Champion,'

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Notice Anything Different Yet?</title>
</head>
<body style="margin:0;padding:0;background-color:${BG};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
  Two weeks in. Consistency creates dangerous men.
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
            <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:36px;line-height:1.15;color:${BONE};text-transform:uppercase;letter-spacing:0.06em;font-weight:700;">Notice Anything Different Yet?</h1>
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
            <p style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:${BONE};">Two weeks in.</p>
            <p style="margin:0 0 24px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:${BONE};">This is usually where the shift begins. Maybe it's subtle right now:</p>
            <ul style="margin:0 0 24px 20px;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.7;color:${BONE};">
              <li style="margin-bottom:6px;">A little more drive in the gym.</li>
              <li style="margin-bottom:6px;">Better recovery.</li>
              <li style="margin-bottom:6px;">Sharper focus.</li>
              <li style="margin-bottom:6px;">More stable energy.</li>
              <li style="margin-bottom:6px;">Less brain fog.</li>
              <li style="margin-bottom:0;">A stronger mindset.</li>
            </ul>
            <p style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:${BONE};">That's how real transformation starts — not overnight, but through consistency.</p>
            <p style="margin:0 0 24px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:${BONE};">Most men quit before the momentum compounds. The disciplined ones keep showing up until the results become impossible to ignore.</p>

            <h2 style="margin:24px 0 12px 0;font-family:Georgia,'Times New Roman',serif;font-size:20px;color:${RED};text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">Stay Locked In</h2>
            <ul style="margin:0 0 24px 20px;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.7;color:${BONE};">
              <li style="margin-bottom:6px;"><strong style="color:${RED};">Train hard.</strong></li>
              <li style="margin-bottom:6px;"><strong style="color:${RED};">Sleep properly.</strong></li>
              <li style="margin-bottom:6px;"><strong style="color:${RED};">Stay hydrated.</strong></li>
              <li style="margin-bottom:0;"><strong style="color:${RED};">Stay consistent with your stack.</strong></li>
            </ul>

            <p style="margin:24px 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:${BONE};">Supplements don't replace the work. They amplify the man doing it.</p>
            <p style="margin:0 0 8px 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.5;color:${BONE};font-style:italic;">Your future self is being built right now.</p>
            <p style="margin:0 0 32px 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.5;color:${RED};font-weight:700;">Stay dangerous.</p>
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

export function buildDay14CheckinText({ customerName } = {}) {
  const greeting = customerName ? `Hey ${customerName},` : 'Hey Champion,'
  return `NOTICE ANYTHING DIFFERENT YET?
Consistency creates dangerous men.

${greeting}

Two weeks in.

This is usually where the shift begins. Maybe it's subtle right now:
- A little more drive in the gym.
- Better recovery.
- Sharper focus.
- More stable energy.
- Less brain fog.
- A stronger mindset.

That's how real transformation starts — not overnight, but through consistency.

Most men quit before the momentum compounds. The disciplined ones keep showing up until the results become impossible to ignore.

STAY LOCKED IN
- Train hard.
- Sleep properly.
- Stay hydrated.
- Stay consistent with your stack.

Supplements don't replace the work. They amplify the man doing it.

Your future self is being built right now. Stay dangerous.

---
THE POWER TO PERFORM
Team Primal Nutrition
SALESMANAGER@PRIMALNUTRITION.IN
+91 7838026415
www.primalnutrition.in
`
}
