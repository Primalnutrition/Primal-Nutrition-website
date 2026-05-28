/**
 * orderConfirmation.js — Order Confirmation email template.
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

function formatInr(n) {
  const num = Number(n) || 0
  return '₹' + num.toLocaleString('en-IN')
}

function formatDate(iso) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return ''
  }
}

export function buildOrderConfirmationHtml({ customerName, orderNumber, totalInr, items = [], placedAt } = {}) {
  const greeting = customerName ? `Hey ${esc(customerName)},` : 'Hey Champion,'
  const date = formatDate(placedAt)
  const itemRows = items.map((it) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #1a1a1a;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${BONE};">
        <div style="font-weight:600;">${esc(it.product_name)}</div>
        <div style="color:${MUTED};font-size:12px;margin-top:2px;">${esc(it.variant_label || '')}</div>
      </td>
      <td align="center" style="padding:12px 0;border-bottom:1px solid #1a1a1a;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${BONE};">${esc(it.qty)}</td>
      <td align="right" style="padding:12px 0;border-bottom:1px solid #1a1a1a;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${BONE};">${formatInr(it.line_total)}</td>
    </tr>
  `).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Your Order Is Confirmed</title>
</head>
<body style="margin:0;padding:0;background-color:${BG};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
  Order ${esc(orderNumber)} confirmed. The transformation begins.
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
            <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:40px;line-height:1.1;color:${BONE};text-transform:uppercase;letter-spacing:0.06em;font-weight:700;">Designed To Dominate</h1>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:16px 24px 32px 24px;">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:${RED};text-transform:uppercase;letter-spacing:0.15em;font-weight:600;">Your order is confirmed. Now the transformation begins.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 24px;">
            <div style="height:2px;background-color:${RED};width:64px;margin:0 auto;"></div>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 32px 8px 32px;">
            <p style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:${BONE};">${greeting}</p>
            <p style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:${BONE};">Weak men wait for motivation. Strong men create momentum.</p>
            <p style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:${BONE};">Your order with Primal Nutrition has been successfully confirmed, and our team is preparing it for dispatch.</p>
            <p style="margin:0 0 24px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:${BONE};">You didn't just buy a supplement. You invested in better performance, stronger discipline, and a more powerful version of yourself.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 32px 8px 32px;">
            <div style="background-color:#101010;border:1px solid #1f1f1f;border-radius:4px;padding:20px 20px 8px 20px;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:${MUTED};margin-bottom:4px;">Order</div>
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:20px;color:${RED};font-weight:700;letter-spacing:0.05em;margin-bottom:12px;">${esc(orderNumber)}</div>
              ${date ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${MUTED};margin-bottom:16px;">Placed ${esc(date)}</div>` : ''}
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <thead>
                  <tr>
                    <th align="left" style="padding:8px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.12em;color:${MUTED};text-transform:uppercase;font-weight:600;border-bottom:1px solid #1f1f1f;">Item</th>
                    <th align="center" style="padding:8px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.12em;color:${MUTED};text-transform:uppercase;font-weight:600;border-bottom:1px solid #1f1f1f;">Qty</th>
                    <th align="right" style="padding:8px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.12em;color:${MUTED};text-transform:uppercase;font-weight:600;border-bottom:1px solid #1f1f1f;">Amount</th>
                  </tr>
                </thead>
                <tbody>${itemRows}</tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" align="right" style="padding:16px 0 4px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;letter-spacing:0.1em;color:${MUTED};text-transform:uppercase;font-weight:600;">Total</td>
                    <td align="right" style="padding:16px 0 4px 0;font-family:Georgia,'Times New Roman',serif;font-size:22px;color:${RED};font-weight:700;">${formatInr(totalInr)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 32px 32px;">
            <p style="margin:0 0 12px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:${BONE};">Your tracking updates will be shared with you shortly.</p>
            <p style="margin:0 0 8px 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.5;color:${BONE};font-style:italic;">Until then —</p>
            <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.5;color:${RED};font-weight:700;letter-spacing:0.04em;">Train harder. Recover smarter. Perform stronger.</p>
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

export function buildOrderConfirmationText({ customerName, orderNumber, totalInr, items = [], placedAt } = {}) {
  const greeting = customerName ? `Hey ${customerName},` : 'Hey Champion,'
  const date = formatDate(placedAt)
  const lines = items.map((it) => `  - ${it.product_name}${it.variant_label ? ' (' + it.variant_label + ')' : ''} x${it.qty} = ${formatInr(it.line_total)}`).join('\n')
  return `DESIGNED TO DOMINATE
Your order is confirmed. Now the transformation begins.

${greeting}

Weak men wait for motivation. Strong men create momentum.

Your order with Primal Nutrition has been successfully confirmed, and our team is preparing it for dispatch.

You didn't just buy a supplement. You invested in better performance, stronger discipline, and a more powerful version of yourself.

ORDER: ${orderNumber}
${date ? `Placed: ${date}\n` : ''}
${lines}

TOTAL: ${formatInr(totalInr)}

Your tracking updates will be shared with you shortly.

Until then — Train harder. Recover smarter. Perform stronger.

---
THE POWER TO PERFORM
Team Primal Nutrition
SALESMANAGER@PRIMALNUTRITION.IN
+91 7838026415
www.primalnutrition.in
`
}
