import { API_BASE_URL } from './api.js'

/**
 * Fire-and-forget checkout telemetry → POST /api/checkout/client-log.
 * Never throws, never blocks the checkout flow. keepalive lets the beacon
 * survive the page/modal being torn down mid-flight.
 */
export function clientLog(event, data = {}) {
  try {
    fetch(`${API_BASE_URL}/api/checkout/client-log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, data }),
      keepalive: true,
    }).catch(() => {})
  } catch {}
}
